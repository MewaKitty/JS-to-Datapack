import * as acorn from "acorn";
import type { Node, FunctionDeclaration, BlockStatement, ExpressionStatement, Expression, CallExpression, Identifier, Literal, VariableDeclaration, AssignmentExpression, IfStatement, WhileStatement, ForStatement, SwitchStatement, ForOfStatement, ClassDeclaration, MethodDefinition, MemberExpression, ReturnStatement } from "acorn";
import { readFile, writeFile, cp, readdir, unlink } from "node:fs/promises";
import path from "node:path";

const code = `
function test () {
    console.debug("test".repeat(4))
    const arr = ["a", "b", "c", "d"]
    for (const element of arr) {
        console.log(element)
    }
}/*
function main () {
    class Promise {
        constructor (func) {
            __run("data modify storage " + __resolveObject(this) + " promise set value {listeners:[]}")
            func((data) => {
                __resolvePromise(this, data);
            })
        }
        then (listener) {
            __run("data modify storage " + __resolveObject(this) + " promise.listeners append from storage " + __resolveVariable(listener) + " function")
        }
    }
    let resolver = null;
    const promise = new Promise(res => {
        resolver = res
    })
    const foo = async () => {
        console.log("starting the await")
        const result = await promise;
        console.log("the magic word is: " + result)
        console.log("ending the await")
        return 7;
    }
    console.log("foo is " + __resolveVariable(foo))
    const magic = async () => {
        console.log("magic time")
        const innerPromise = foo();
        console.log(__resolveObject(innerPromise))
        console.log(await innerPromise)
        console.log("magic done")
    }
    magic();
    promise.then(() => {
        console.log("then")
    })
    resolver("test")
}*/
`

const namespace = "test";

const standard = acorn.parse(await readFile("./standard.js", {
    "encoding": "utf-8"
}), {ecmaVersion: 2020}).body

const functions: Record<string, {
    params: Array<string>
}> = {}

type MCFunctionMetadata = {
    superClass?: string | null,
    type?: string | null,
    scopeList: string[],
    that?: string,
    output?: string[],
    skipScope?: boolean,
    isAsync?: boolean
}

class MCFunction {
    output: string[]
    that?: string
    superClass?: string | null
    type?: string | null
    blockScope: string
    scopeList: string[]
    destination?: string
    asyncReturn?: string
    asyncReturnValue?: string
    constructor (metadata: MCFunctionMetadata) {
        if (metadata.output && !(metadata instanceof MCFunction)) {
            this.output = metadata.output;
        } else {
            this.output = [];
        }
        if (metadata) this.superClass = metadata.superClass
        if (metadata) this.type = metadata.type
        if (metadata) this.that = metadata.that
        if (!metadata.skipScope) {
            this.blockScope = "scope-" + Math.random();
            this.scopeList = [...metadata.scopeList, this.blockScope]
        } else {
            if (metadata.scopeList.length === 0) throw new RangeError("Scope list must not be empty when skipScope is true.")
            this.blockScope = metadata.scopeList.at(-1) as string
            this.scopeList = metadata.scopeList
        }
        this.output.push(`data modify storage ${namespace}:${this.blockScope} scopes set value [${this.scopeList.map(scope => `"${scope}"`).join(", ")}]`)
        if (metadata.isAsync) {
            const asyncReturnValue = "temp-" + Math.random();
            this.output.push(`data modify storage ${namespace}:${asyncReturnValue} type set value "undefined"`)
            this.asyncReturnValue = asyncReturnValue;
        }
    }
    write () {
        if (!this.destination) throw new TypeError("destination property must exist in MCFunction instance")
        writeFile(this.destination, this.output.join("\n"))
    }
}

type ExpressionNullOutput = {
    type: "null"
}
type ExpressionLiteralOutput = {
    type: "literal",
    parsed: string,
    raw: string | number | bigint | boolean | RegExp | null | undefined
}
type ExpressionVariableOutput = {
    type: "variable",
    value: string,
    object?: ExpressionLiteralOutput | ExpressionVariableOutput
}
type ExpressionOutput = ExpressionNullOutput | ExpressionLiteralOutput | ExpressionVariableOutput;

const generateIfLines = (func: MCFunction, test: ExpressionVariableOutput, functionName: string) => {
    const additional = (func.type === "arrow" || func.type === "class") ? ` {__this:"$(__this)",__this_obj:"$(__this_obj)",__new_target:"$(__new_target)",__return:"$(__return)"}` : ""
    const prefix = (func.type === "arrow" || func.type === "class") ? "$" : ""
    func.output.push(`data modify storage ${namespace}:temp-result result set value 0`)
    func.output.push(`${prefix}execute store result storage ${namespace}:temp-result result int 1 if data storage ${namespace}:${test.value} {value:true} run function ${namespace}:${functionName}${additional}`)
    func.output.push(`${prefix}execute store result storage ${namespace}:temp-result result int 1 if data storage ${namespace}:${test.value} {type:"number"} unless data storage ${namespace}:${test.value} {value:0} run function ${namespace}:${functionName}${additional}`)
    func.output.push(`${prefix}execute store result storage ${namespace}:temp-result result int 1 if data storage ${namespace}:${test.value} {type:"string"} unless data storage ${namespace}:${test.value} {value:""} run function ${namespace}:${functionName}${additional}`)
    func.output.push(`${prefix}execute store result storage ${namespace}:temp-result result int 1 if data storage ${namespace}:${test.value} {type:"object"} run function ${namespace}:${functionName}${additional}`)
    func.output.push(`${prefix}execute store result storage ${namespace}:temp-result result int 1 if data storage ${namespace}:${test.value} {type:"function"} run function ${namespace}:${functionName}${additional}`)
    func.output.push(`execute if data storage ${namespace}:temp-result {result:-2000000000} run return -2000000000`)
}

const generateFunction = (params: Identifier[], isExpression: boolean, body: Node, func: MCFunction, that: null | string, isConstructor: boolean, metadata: MCFunctionMetadata) => {
    const functionName = "arrow" + Math.random()
    const subfunc = new MCFunction(metadata)
    subfunc.destination = "./output/" + functionName + ".mcfunction"
    for (const [index, param] of params.entries()) {
        subfunc.output.push(`$data modify storage ${namespace}:${func.blockScope} variables.${param.name}.value set from storage $(${index}) value`)
        subfunc.output.push(`$data modify storage ${namespace}:${func.blockScope} variables.${param.name}.type set from storage $(${index}) type`)
        subfunc.output.push(`$data modify storage ${namespace}:${func.blockScope} variables.${param.name}.function set from storage $(${index}) function`)
    }
    if (that) {
        subfunc.that = that;
        subfunc.output.push(`data modify storage ${namespace}:${that} type set value "object"`)
        subfunc.output.push(`$data modify storage ${namespace}:${that} value set from storage $(__this) value`)
    }
    if (metadata.isAsync) {
        const returnObjVariable = "temp-" + Math.random();
        subfunc.output.push(`$data modify storage $(__return) value set value "${namespace}:${returnObjVariable}"`)
        subfunc.output.push(`$data modify storage $(__return) type set value "object"`)
        subfunc.output.push(`data modify storage ${namespace}:${returnObjVariable} promise set value {listeners:[]}`)
        subfunc.asyncReturn = returnObjVariable;
    }
    if (isExpression) {
        handleExpression(body as Expression, subfunc)
    } else {
        handleNode(body, subfunc)
    }
    const objVariable = "temp-" + Math.random();
    if (that) {
        subfunc.output.push(`$data modify storage $(__this) type set value "object"`)
        subfunc.output.push(`$data modify storage $(__this) value set from storage ${namespace}:${that} value`)
        if (isConstructor) subfunc.output.push(`$data modify storage $(__this_obj) prototype set from storage ${namespace}:${objVariable} string.prototype.value`)
    }
    if (metadata.isAsync) {
        const promiseResolveVariable = "temp-" + Math.random();
        subfunc.output.push(`data modify storage ${namespace}:${promiseResolveVariable} namespace set value "${namespace}"`)
        subfunc.output.push(`data modify storage ${namespace}:${promiseResolveVariable} storage set value "${namespace}:${subfunc.asyncReturn}"`)
        subfunc.output.push(`data modify storage ${namespace}:${promiseResolveVariable} index set value 0`)
        subfunc.output.push(`data modify storage ${namespace}:${promiseResolveVariable} data set value "${namespace}:${subfunc.asyncReturnValue}"`)
        subfunc.output.push(`function ${namespace}:resolvepromise with storage ${namespace}:${promiseResolveVariable}`)
    }
    subfunc.write();
    const tempVariable = "temp-" + Math.random();
    func.output.push(`data modify storage ${namespace}:${tempVariable} value set value "${namespace}:${objVariable}"`)
    func.output.push(`data modify storage ${namespace}:${tempVariable} type set value function`)
    func.output.push(`data modify storage ${namespace}:${tempVariable} function set value ${functionName}`)
    func.output.push(`data modify storage ${namespace}:${objVariable} type set value "object"`)
    return [tempVariable, objVariable];
}

const generateClass = (node: acorn.ClassExpression | acorn.ClassDeclaration, func: MCFunction): ExpressionOutput => {

    const constructorMethod = node.body.body.find(node => "kind" in node ? node.kind === "constructor" : false) as MethodDefinition | undefined
    if (!constructorMethod) return {
        type: "null"
    };
    const instanceVariable = "instance-" + Math.random()

    let superClass = null;
    
    if (node.superClass) {
        superClass = handleExpression(node.superClass as Expression, func)
        console.log(superClass)
        if (superClass.type !== "variable") return {
            type: "null"
        };
    }
    const [constructorVariable, objVariable] = generateFunction(constructorMethod.value.params as Identifier[], constructorMethod.value.expression, constructorMethod.value.body, func, instanceVariable, true, {
        superClass: superClass?.value,
        scopeList: func.scopeList,
        type: "class"
    });

    if (node.id) {
        const className = node.id.name;
        func.output.push(`data modify storage ${namespace}:${func.blockScope} variables.${className}.value set from storage ${namespace}:${constructorVariable} value`)
        func.output.push(`data modify storage ${namespace}:${func.blockScope} variables.${className}.type set from storage ${namespace}:${constructorVariable} type`)
        func.output.push(`data modify storage ${namespace}:${func.blockScope} variables.${className}.function set from storage ${namespace}:${constructorVariable} function`)
    }
    const prototypeVariable = "obj-" + Math.random();
    func.output.push(`data modify storage ${namespace}:${objVariable} string.prototype.value set value "${namespace}:${prototypeVariable}"`)
    func.output.push(`data modify storage ${namespace}:${objVariable} string.prototype.type set value "object"`)
    func.output.push(`data modify storage ${namespace}:${prototypeVariable} type set value "object"`)
    
    if (superClass) {
        const prototypeSetVariable = "temp-" + Math.random();
        func.output.push(`data modify storage ${namespace}:${prototypeSetVariable} object set value "${namespace}:${prototypeVariable}"`)
        func.output.push(`data modify storage ${namespace}:${prototypeSetVariable} class set from storage ${namespace}:${superClass.value} value`)
        func.output.push(`function ${namespace}:setclassprototype with storage ${namespace}:${prototypeSetVariable}`)
    }
    const methods = node.body.body.filter(node => "kind" in node ? node.kind === "method" : false) as MethodDefinition[];
    for (const method of methods) {
        const methodName = (method.key as Identifier).name;
        const methodVariable = generateFunction(method.value.params as Identifier[], method.value.expression, method.value.body, func, instanceVariable, false, {
            superClass: superClass?.value,
            scopeList: func.scopeList,
            type: "class"
        })[0];
        func.output.push(`data modify storage ${namespace}:${prototypeVariable} string.${methodName}.value set from storage ${namespace}:${methodVariable} value`)
        func.output.push(`data modify storage ${namespace}:${prototypeVariable} string.${methodName}.type set from storage ${namespace}:${methodVariable} type`)
        func.output.push(`data modify storage ${namespace}:${prototypeVariable} string.${methodName}.function set from storage ${namespace}:${methodVariable} function`)
    }
    return {
        type: "variable",
        value: constructorVariable
    }
}

const handleNode = (node: Node, func: MCFunction): string => {
    if (node.type === "FunctionDeclaration") {
        const subfunc = new MCFunction(func)
        for (const param of (node as FunctionDeclaration).params as Identifier[]) {
            subfunc.output.push(`$data modify storage ${namespace}:${func.blockScope} variables.${param.name}.value set value $(${param.name})`)
            subfunc.output.push(`data modify storage ${namespace}:${func.blockScope} variables.${param.name}.type set value "string"`)
        }
        subfunc.output.push("data modify storage test:global type set value object")
        subfunc.output.push(`data modify storage test:global string set value {globalThis:{type:"object", value:"${namespace}:global"}}`)
        for (const standardNode of standard) {
            console.log(standardNode)
            handleNode(standardNode, subfunc);
        }
        handleNode((node as FunctionDeclaration).body, subfunc)
        writeFile("./output/" + (node as FunctionDeclaration).id.name + ".mcfunction", subfunc.output.join("\n"))
        functions[(node as FunctionDeclaration).id.name] = {
            params: (node as FunctionDeclaration).params.map(param => (param as Identifier).name)
        }
    }
    if (node.type === "BlockStatement") {
        for (const subnode of (node as BlockStatement).body) {
            handleNode(subnode, func)
        }
    }
    if (node.type === "ExpressionStatement") {
        handleExpression((node as ExpressionStatement).expression, func)
    }
    if (node.type === "VariableDeclaration") {
        for (const declaration of (node as VariableDeclaration).declarations) {
            const variableName = (declaration.id as Identifier).name
            if (!declaration.init) continue;
            const value = handleExpression(declaration.init, func);
            if (value.type === "literal") {
                func.output.push(`data modify storage ${namespace}:${func.blockScope} variables.${variableName}.value set value ${value.parsed}`)
                func.output.push(`data modify storage ${namespace}:${func.blockScope} variables.${variableName}.type set value "${typeof value.raw}"`)
            } else if (value.type === "variable") {
                func.output.push(`data modify storage ${namespace}:${func.blockScope} variables.${variableName}.value set from storage ${namespace}:${value.value} value`)
                func.output.push(`data modify storage ${namespace}:${func.blockScope} variables.${variableName}.type set from storage ${namespace}:${value.value} type`)
                func.output.push(`data modify storage ${namespace}:${func.blockScope} variables.${variableName}.function set from storage ${namespace}:${value.value} function`)
            }
        }
    }
    if (node.type === "IfStatement") {
        const ifStatement = node as IfStatement
        const test = handleExpression(ifStatement.test, func)
        if (test.type === "literal") {
            const functionName = "block" + Math.random()
            const subfunc = new MCFunction(func)
            if (test.raw) {
                handleNode(ifStatement.consequent, subfunc)
            } else if (ifStatement.alternate) {
                handleNode(ifStatement.alternate, subfunc)
            }
            writeFile("./output/" + functionName + ".mcfunction", subfunc.output.join("\n"))
        } else if (test.type === "variable") {
            const functionName = "block" + Math.random()
            const additional = (func.type === "arrow" || func.type === "class") ? ` {__this:"$(__this)",__this_obj:"$(__this_obj)",__new_target:"$(__new_target)",__return:"$(__return)"}` : ""
            const prefix = (func.type === "arrow" || func.type === "class") ? "$" : ""
            generateIfLines(func, test, functionName)
            const subfunc = new MCFunction(func)
            handleNode(ifStatement.consequent, subfunc)
            writeFile("./output/" + functionName + ".mcfunction", subfunc.output.join("\n"))
            if (ifStatement.alternate) {
                const functionAlternate = "block" + Math.random()
                func.output.push(`data modify storage ${namespace}:temp-result result set value 0`)
                func.output.push(`${prefix}execute store result storage ${namespace}:temp-result result int 1 if data storage ${namespace}:${test.value} {value:false} run function ${namespace}:${functionAlternate}${additional}`)
                func.output.push(`${prefix}execute store result storage ${namespace}:temp-result result int 1 if data storage ${namespace}:${test.value} {value:0} run function ${namespace}:${functionAlternate}${additional}`)
                func.output.push(`${prefix}execute store result storage ${namespace}:temp-result result int 1 if data storage ${namespace}:${test.value} {value:""} run function ${namespace}:${functionAlternate}${additional}`)
                func.output.push(`${prefix}execute store result storage ${namespace}:temp-result result int 1 if data storage ${namespace}:${test.value} {type:"object",value:"null"} run function ${namespace}:${functionAlternate}${additional}`)
                func.output.push(`${prefix}execute store result storage ${namespace}:temp-result result int 1 if data storage ${namespace}:${test.value} {type:"undefined"} run function ${namespace}:${functionAlternate}${additional}`)
                func.output.push(`execute if data storage ${namespace}:temp-result {result:-2000000000} run return -2000000000`)
                const alternatefunc = new MCFunction(func)
                handleNode(ifStatement.alternate, alternatefunc)
                writeFile("./output/" + functionAlternate + ".mcfunction", alternatefunc.output.join("\n"))
            }
        } else if (test.type === "null") {
            if (ifStatement.alternate) handleNode(ifStatement.alternate, func)
        }
    }
    if (node.type === "WhileStatement") {
        const whileStatement = node as WhileStatement;
        const test = handleExpression(whileStatement.test, func)
        if (test.type === "literal" && !test.raw) return "";
        const functionName = "block" + Math.random()
        if (test.type === "variable") {
            generateIfLines(func, test, functionName)
        } else {
            func.output.push(`function ${namespace}:${functionName}`)
        }
        const subfunc = new MCFunction(func)
        handleNode(whileStatement.body, subfunc)
        if (test.type === "variable") {
            const subtest = handleExpression(whileStatement.test, subfunc)
            if (subtest.type !== "variable") return "";
            generateIfLines(subfunc, subtest, functionName)
        } else {     
            subfunc.output.push(`function ${namespace}:${functionName}`)
        }
        writeFile("./output/" + functionName + ".mcfunction", subfunc.output.join("\n"))
    }
    if (node.type === "ForStatement") {
        const forStatement = node as ForStatement;
        const subfunc = new MCFunction(func)
        const initfunc = new MCFunction({
            scopeList: subfunc.scopeList,
            superClass: subfunc.superClass,
            that: subfunc.that,
            output: func.output,
            skipScope: true,
            type: func.type
        })
        if (forStatement.init) handleNode(forStatement.init, initfunc);
        const functionName = "block" + Math.random()
        let test = null;
        if (forStatement.test) {
            test = handleExpression(forStatement.test, initfunc)
            if (test.type === "literal") {
                if (!test.raw) return "";
                func.output.push(`function ${namespace}:${functionName}`)
            } else if (test.type === "variable") {
                generateIfLines(initfunc, test, functionName)
            }
        } else {
            func.output.push(`function ${namespace}:${functionName}`)
        }
        handleNode(forStatement.body, subfunc)
        if (forStatement.update) handleExpression(forStatement.update, subfunc)
        if (forStatement.test && test && test.type === "variable") {
            const subtest = handleExpression(forStatement.test, subfunc)
            if (subtest.type === "variable") generateIfLines(subfunc, subtest, functionName)
        } else {
            subfunc.output.push(`function ${namespace}:${functionName}`)
        }
        writeFile("./output/" + functionName + ".mcfunction", subfunc.output.join("\n"))
    }
    if (node.type === "SwitchStatement") {
        const switchStatement = node as SwitchStatement;
        const discriminant = handleExpression(switchStatement.discriminant, func);
        let discriminantName = "temp-" + Math.random();
        if (discriminant.type === "literal") {
            func.output.push(`data modify storage ${namespace}:${discriminantName} value set value ${discriminant.parsed}`)
            func.output.push(`data modify storage ${namespace}:${discriminantName} type set value ${typeof discriminant.raw}`)
        } else if (discriminant.type === "variable") {
            discriminantName = discriminant.value;
        }
        const switchname = "block" + Math.random();
        const switchfunc = new MCFunction(func)
        for (const switchCase of switchStatement.cases) {
            const functionName = "block" + Math.random()
            if (switchCase.test) {
                const test = handleExpression(switchCase.test, switchfunc)
                const tempVariable = "temp-" + Math.random();
                const resultVariable = "temp-" + Math.random();
                switchfunc.output.push(`data modify storage ${namespace}:${tempVariable} namespace set value "${namespace}"`)
                switchfunc.output.push(`data modify storage ${namespace}:${tempVariable} result set value "${namespace}:${resultVariable}"`)
                switchfunc.output.push(`data modify storage ${namespace}:${tempVariable} left set value "${namespace}:${discriminantName}"`)
                if (test.type === "variable") {
                    switchfunc.output.push(`data modify storage ${namespace}:${tempVariable} type set from storage ${namespace}:${test.value} type`)
                    switchfunc.output.push(`data modify storage ${namespace}:${tempVariable} value set from storage ${namespace}:${test.value} value`)
                } else if (test.type === "literal") {
                    switchfunc.output.push(`data modify storage ${namespace}:${tempVariable} type set value "${typeof test.raw}"`)
                    switchfunc.output.push(`data modify storage ${namespace}:${tempVariable} value set value ${test.parsed}`)
                }
                switchfunc.output.push(`data modify storage ${namespace}:${tempVariable} ifequal set value "true"`)
                switchfunc.output.push(`data modify storage ${namespace}:${tempVariable} ifunequal set value "false"`)
                switchfunc.output.push(`function ${namespace}:equals with storage ${namespace}:${tempVariable}`)
                
                switchfunc.output.push(`data modify storage ${namespace}:temp-result result set value 0`)
                switchfunc.output.push(`execute store result storage ${namespace}:temp-result result int 1 if data storage ${namespace}:${resultVariable} {value:true} run function ${namespace}:${functionName}`)
                switchfunc.output.push(`execute if data storage ${namespace}:temp-result {result:-2000000000} run return 0`)
                const subfunc = new MCFunction(switchfunc)
                for (const node of switchCase.consequent) handleNode(node, subfunc)
                writeFile("./output/" + functionName + ".mcfunction", subfunc.output.join("\n"))
            } else {
                for (const node of switchCase.consequent) handleNode(node, switchfunc)
            }
        }
        writeFile("./output/" + switchname + ".mcfunction", switchfunc.output.join("\n"))

        func.output.push(`function ${namespace}:${switchname}`)
    }
    if (node.type === "BreakStatement") {
        func.output.push("return -2000000000")
    }
    if (node.type === "ForOfStatement") {
        const forOf = node as ForOfStatement
        if (forOf.left.type !== "VariableDeclaration") return "";
        const variableName = ((forOf.left as unknown as VariableDeclaration).declarations[0].id as Identifier).name
        const right = handleExpression(forOf.right, func)
        if (right.type !== "variable") return "";
        const tempVariable = "temp-" + Math.random();
        const functionName = "block" + Math.random()
        func.output.push(`data modify storage ${namespace}:${tempVariable} namespace set value "${namespace}"`)
        func.output.push(`data modify storage ${namespace}:${tempVariable} storage set from storage ${namespace}:${right.value} value`)
        func.output.push(`data modify storage ${namespace}:${tempVariable} index set value 0`)
        func.output.push(`data modify storage ${namespace}:${tempVariable} function set value "${namespace}:${functionName}"`)
        func.output.push(`function ${namespace}:looparray with storage ${namespace}:${tempVariable}`)
        const subfunc = new MCFunction(func)
        subfunc.output.push(`data modify storage ${namespace}:${func.blockScope} variables.${variableName}.value set from storage ${namespace}:temp data.value`)
        subfunc.output.push(`data modify storage ${namespace}:${func.blockScope} variables.${variableName}.type set from storage ${namespace}:temp data.type`)
        subfunc.output.push(`data modify storage ${namespace}:${func.blockScope} variables.${variableName}.function set from storage ${namespace}:temp data.function`)
        handleNode(forOf.body, subfunc)
        writeFile("./output/" + functionName + ".mcfunction", subfunc.output.join("\n"))
    }
    if (node.type === "ClassDeclaration") {
        generateClass(node as acorn.ClassDeclaration, func)
    }
    if (node.type === "ReturnStatement") {
        if ((node as ReturnStatement).argument) {
            const argument = handleExpression((node as ReturnStatement).argument as Expression, func);
            const returnVariable = func.asyncReturnValue ? namespace + ":" + func.asyncReturnValue :  "$(__return)"
            const macro = func.asyncReturnValue ? "" : "$";
            if (argument.type === "literal") {
                func.output.push(`${macro}data modify storage ${returnVariable} value set value ${argument.parsed}`)
                func.output.push(`${macro}data modify storage ${returnVariable} type set value "${typeof argument.raw}"`)
            } else if (argument.type === "variable") {
                func.output.push(`${macro}data modify storage ${returnVariable} value set from storage ${namespace}:${argument.value} value`)
                func.output.push(`${macro}data modify storage ${returnVariable} type set from storage ${namespace}:${argument.value} type`)
                func.output.push(`${macro}data modify storage ${returnVariable} function set from storage ${namespace}:${argument.value} function`)
            }
            if (func.asyncReturnValue) {
                const promiseResolveVariable = "temp-" + Math.random();
                func.output.push(`data modify storage ${namespace}:${promiseResolveVariable} namespace set value "${namespace}"`)
                func.output.push(`data modify storage ${namespace}:${promiseResolveVariable} storage set value "${namespace}:${func.asyncReturn}"`)
                func.output.push(`data modify storage ${namespace}:${promiseResolveVariable} index set value 0`)
                func.output.push(`data modify storage ${namespace}:${promiseResolveVariable} data set value "${namespace}:${func.asyncReturnValue}"`)
                func.output.push(`function ${namespace}:resolvepromise with storage ${namespace}:${promiseResolveVariable}`)
            }
        }
        func.output.push(`return 0`)
    }
    handleExpression(node as Expression, func);
    return "";
}

const parseLiteral = (literal: string | number | bigint | boolean | RegExp | null | undefined) => {
    if (typeof literal === "string") return "\"" + literal.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + "\""
    if (typeof literal === "number") return literal + "";
    if (typeof literal === "boolean") return literal + "";
    if (literal === null) return "\"null\"";
    return "";
}
const handleExpression = (expression: Expression, func: MCFunction): ExpressionOutput => {
    if (expression.type === "Literal") return {
        type: "literal",
        raw: expression.value,
        parsed: parseLiteral(expression.value)
    }
    if (expression.type === "Identifier") {
        if (expression.name === "__namespace") return {
            type: "literal",
            raw: namespace,
            parsed: `"${namespace}"`
        }
        const tempVariable = "temp-" + Math.random();
        const resultVariable = "temp-" + Math.random();
        func.output.push(`data modify storage ${namespace}:${tempVariable} namespace set value "${namespace}"`)
        func.output.push(`data modify storage ${namespace}:${tempVariable} storage set value "${namespace}:${func.blockScope}"`)
        func.output.push(`data modify storage ${namespace}:${tempVariable} index set value "-2"`)
        func.output.push(`data modify storage ${namespace}:${tempVariable} blockScope set value "${func.blockScope}"`)
        func.output.push(`data modify storage ${namespace}:${tempVariable} name set value "${expression.name}"`)
        func.output.push(`data modify storage ${namespace}:${tempVariable} result set value "${namespace}:${resultVariable}"`)
        func.output.push(`function ${namespace}:getvariable with storage ${namespace}:${tempVariable}`)
        return {
            type: "variable",
            value: resultVariable
        }
    }
    if (expression.type === "CallExpression") {
        if (((expression as CallExpression)?.callee as Identifier)?.name === "__run") {
            if (expression.arguments[0].type === "Literal" && typeof expression.arguments[0].value === "string") {
                func.output.push(expression.arguments[0].value)
            } else {
                const subexpression = handleExpression(expression.arguments[0] as Expression, func);
                if (subexpression.type !== "variable") return {
                    type: "null"
                }
                func.output.push(`function ${namespace}:run with storage ${namespace}:${subexpression.value}`)
            }
            return {
                type: "null"
            }
        } else if (((expression as CallExpression)?.callee as Identifier)?.name === "__resolveVariable") {
            const subexpression = handleExpression(expression.arguments[0] as Expression, func);
            if (subexpression.type !== "variable") return {
                type: "null"
            }
            return {
                type: "literal",
                raw: namespace + ":" + subexpression.value,
                parsed: `"${namespace}:${subexpression.value}"`
            }
        } else if (((expression as CallExpression)?.callee as Identifier)?.name === "__resolveObject") {
            const subexpression = handleExpression(expression.arguments[0] as Expression, func);
            if (subexpression.type !== "variable") return {
                type: "null"
            }
            const tempVariable = "temp-" + Math.random();
            func.output.push(`data modify storage ${namespace}:${tempVariable} type set value "string"`)
            func.output.push(`data modify storage ${namespace}:${tempVariable} value set from storage ${namespace}:${subexpression.value} value`)
            return {
                type: "variable",
                value: tempVariable
            }
        } else if (((expression as CallExpression)?.callee as Identifier)?.name === "__resolvePromise") {
            const subexpression = handleExpression(expression.arguments[0] as Expression, func);
            if (subexpression.type !== "variable") return {
                type: "null"
            }
            const dataExpression = handleExpression(expression.arguments[1] as Expression, func);
            if (dataExpression.type !== "variable") return {
                type: "null"
            }
            const tempVariable = "temp-" + Math.random();
            func.output.push(`data modify storage ${namespace}:${tempVariable} namespace set value "${namespace}"`)
            func.output.push(`data modify storage ${namespace}:${tempVariable} storage set from storage ${namespace}:${subexpression.value} value`)
            func.output.push(`data modify storage ${namespace}:${tempVariable} index set value 0`)
            func.output.push(`data modify storage ${namespace}:${tempVariable} data set value "${namespace}:${dataExpression.value}"`)
            func.output.push(`function ${namespace}:resolvepromise with storage ${namespace}:${tempVariable}`)
            return subexpression
        } else if (((expression as CallExpression)?.callee as Identifier)?.name === "__singleQuoteConcat") {
            console.log(func.destination)
            const tempVariable = "temp-" + Math.random();
            const leftExpression = handleExpression(expression.arguments[0] as Expression, func);
            if (leftExpression.type === "literal") {
                func.output.push(`data modify storage ${namespace}:${tempVariable} left set value ${leftExpression.parsed}`)
            } else if (leftExpression.type === "variable") {
                func.output.push(`data modify storage ${namespace}:${tempVariable} left set from storage ${namespace}:${leftExpression.value} value`)
            }
            const rightExpression = handleExpression(expression.arguments[1] as Expression, func);
            if (rightExpression.type === "literal") {
                func.output.push(`data modify storage ${namespace}:${tempVariable} right set value ${rightExpression.parsed}`)
            } else if (rightExpression.type === "variable") {
                func.output.push(`data modify storage ${namespace}:${tempVariable} right set from storage ${namespace}:${rightExpression.value} value`)
            }
            const resultVariable = "temp-" + Math.random();
            func.output.push(`data modify storage ${namespace}:${tempVariable} storage set value "${namespace}:${resultVariable}"`)
            func.output.push(`function ${namespace}:singlequoteconcat with storage ${namespace}:${tempVariable}`)
            return {
                type: "variable",
                value: resultVariable
            }
        } else {
            const callExpression = expression as CallExpression
            if (callExpression.callee.type === "Identifier" && callExpression?.callee?.name in functions) {
                const callee = ((expression as CallExpression)?.callee as Identifier)?.name
                const params = functions[callee].params
                for (const [index, argument] of (expression as CallExpression).arguments.entries()) {
                    const argumentOutput = handleExpression(argument as Expression, func);
                    if (argumentOutput.type === "literal") {
                        func.output.push(`data modify storage ${namespace}:params ${params[index]} set value ${argumentOutput.parsed}`)
                    }
                    if (argumentOutput.type === "variable") {
                        func.output.push(`data modify storage ${namespace}:params ${params[index]} set from storage ${namespace}:${argumentOutput.value} value`)
                    }
                }
                func.output.push(`function ${namespace}:${callee} with storage ${namespace}:params`)
            } else {
                let callee = null;
                if (callExpression.callee.type === "Super") {
                    console.log("it's super time")
                    console.log(callExpression.callee)
                    callee = {"type": "variable", "value": func.superClass}
                } else {
                    callee = handleExpression(callExpression.callee as Identifier, func);
                    if (callee.type !== "variable") return {"type": "null"}
                }
                const tempVariable = "temp-" + Math.random();
                const resultVariable = "temp-" + Math.random();
                func.output.push(`data modify storage ${namespace}:${tempVariable} function set from storage ${namespace}:${callee.value} function`)
                
                for (const [index, argument] of (expression as CallExpression).arguments.entries()) {
                    const argumentOutput = handleExpression(argument as Expression, func);
                    let argumentVariable = null;
                    if (argumentOutput.type === "literal") {
                        argumentVariable = "temp-" + Math.random();
                        func.output.push(`data modify storage ${namespace}:${argumentVariable} value set value ${argumentOutput.parsed}`)
                        func.output.push(`data modify storage ${namespace}:${argumentVariable} type set value ${typeof argumentOutput.raw}`)
                    }
                    if (argumentOutput.type === "variable") {
                        argumentVariable = argumentOutput.value;
                    }
                    func.output.push(`data modify storage ${namespace}:params ${index} set value "${namespace}:${argumentVariable}"`)
                }
                func.output.push(`data modify storage ${namespace}:${tempVariable} namespace set value "${namespace}"`)
                func.output.push(`data modify storage ${namespace}:${tempVariable} storage set value "${namespace}:params"`)

                if (expression.callee.type === "MemberExpression") {
                    if (callee.type === "variable") {
                        const objectName = (callee.object as ExpressionVariableOutput | undefined)?.value
                        func.output.push(`execute if data storage ${namespace}:${objectName} {type:"object"} run data modify storage ${namespace}:params __this set value "${namespace}:${objectName}"`)
                        func.output.push(`execute if data storage ${namespace}:${objectName} {type:"object"} run data modify storage ${namespace}:params __this_obj set from storage ${namespace}:${objectName} value`)
                        func.output.push(`execute unless data storage ${namespace}:${objectName} {type:"object"} run data modify storage ${namespace}:params __this set value "${namespace}:temp-obj-var"`)
                        func.output.push(`execute unless data storage ${namespace}:${objectName} {type:"object"} run data modify storage ${namespace}:params __this_obj set value "${namespace}:temp-obj"`)
                    } else if (callee.type === "literal") {
                        func.output.push(`data modify storage ${namespace}:params __this set value "${namespace}:temp-obj-var"`)
                        func.output.push(`data modify storage ${namespace}:params __this_obj set value "${namespace}:temp-obj"`)
                    }
                } else {
                    func.output.push(`data modify storage ${namespace}:params __this set value "undefined"`)
                    func.output.push(`data modify storage ${namespace}:params __this_obj set value "undefined"`)
                }
                func.output.push(`data modify storage ${namespace}:params __new_target set value "${namespace}:undefined"`)
                func.output.push(`data modify storage ${namespace}:params __return set value "${namespace}:${resultVariable}"`)
                func.output.push(`function ${namespace}:call with storage ${namespace}:${tempVariable}`)
                return {
                    type: "variable",
                    value: resultVariable
                }
            }
        }
    }
    if (expression.type === "NewExpression") {
        const callee = handleExpression(expression.callee as Identifier, func);
        if (callee.type !== "variable") return {"type": "null"}
        const tempVariable = "temp-" + Math.random();
        func.output.push(`data modify storage ${namespace}:${tempVariable} function set from storage ${namespace}:${callee.value} function`)
        
        for (const [index, argument] of expression.arguments.entries()) {
            const argumentOutput = handleExpression(argument as Expression, func);
            let argumentVariable = null;
            if (argumentOutput.type === "literal") {
                argumentVariable = "temp-" + Math.random();
                func.output.push(`data modify storage ${namespace}:${argumentVariable} value set value ${argumentOutput.parsed}`)
                func.output.push(`data modify storage ${namespace}:${argumentVariable} type set value ${typeof argumentOutput.raw}`)
            }
            if (argumentOutput.type === "variable") {
                argumentVariable = argumentOutput.value;
            }
            func.output.push(`data modify storage ${namespace}:params ${index} set value "${namespace}:${argumentVariable}"`)
        }
        func.output.push(`data modify storage ${namespace}:${tempVariable} namespace set value "${namespace}"`)
        func.output.push(`data modify storage ${namespace}:${tempVariable} storage set value "${namespace}:params"`)

        const instanceVariable = "temp-" + Math.random();
        func.output.push(`data modify storage ${namespace}:${instanceVariable} type set value "object"`)
        const objVariable = "obj-" + Math.random();
        func.output.push(`data modify storage ${namespace}:${instanceVariable} value set value "${namespace}:${objVariable}"`)
        func.output.push(`data modify storage ${namespace}:${objVariable} type set value "object"`)

        func.output.push(`data modify storage ${namespace}:params __this set value "${namespace}:${instanceVariable}"`)
        func.output.push(`data modify storage ${namespace}:params __this_obj set from storage ${namespace}:${instanceVariable} value`)
        func.output.push(`data modify storage ${namespace}:params __new_target set value "${namespace}:${callee.value}"`)
        func.output.push(`data modify storage ${namespace}:params __return set value "${namespace}:temp"`)
        
        func.output.push(`function ${namespace}:call with storage ${namespace}:${tempVariable}`)

        return {
            type: "variable",
            value: instanceVariable
        }
    }
    if (expression.type === "AssignmentExpression") {
        const assignmentExpression = expression as AssignmentExpression;
        let variableName = null;
        let prefix = null;
        let objectName = null;
        let propertyName = null;
        if (assignmentExpression.left.type === "MemberExpression") {
            const memberExpression = assignmentExpression.left as MemberExpression
            const object = handleExpression(memberExpression.object as Expression, func)
            if (object.type !== "variable") return {
                type: "null"
            };
            objectName = object.value;
            const property: ExpressionOutput = memberExpression.property.type === "Identifier" ? {type:"variable",value:memberExpression.property.name} : handleExpression(memberExpression.property as Expression, func);
            if (property.type === "variable" && memberExpression.computed) {
            } else if (property.type === "literal" || !memberExpression.computed) {
                const propertyValue = property.type === "literal" ? property.raw : (property.type === "variable" ? property.value : "");
                propertyName = propertyValue;
            }
        } else if (assignmentExpression.left.type === "Identifier") {
            variableName = (assignmentExpression.left as Identifier).name
            prefix = "";
        }
        const right = handleExpression(assignmentExpression.right, func)
        const tempVariable = "temp-" + Math.random();
        let result = null;
        if (assignmentExpression.operator === "=") {
            result = right;
        } else {
            const input = handleExpression(assignmentExpression.left as Identifier, func)
            if (input.type !== "variable") return {"type": "null"}
            const leftVariable = input.value;
            let rightVariable = null;
            if (right.type === "literal") {
                const tempVariable = "temp-" + Math.random();
                func.output.push(`data modify storage ${namespace}:${tempVariable} value set value "${right.raw}"`)
                func.output.push(`data modify storage ${namespace}:${tempVariable} type set value ${typeof right.raw}`)
                rightVariable = tempVariable
            } else if (right.type === "variable") {
                rightVariable = right.value;
            }
            if (assignmentExpression.operator === "+=") {
                func.output.push(`function ${namespace}:add {namespace:"${namespace}",left:"${namespace}:${leftVariable}",right:"${namespace}:${rightVariable}",prefix:""}`)
            } else if (assignmentExpression.operator === "-=") {
                func.output.push(`function ${namespace}:subtract {namespace:"${namespace}",left:"${namespace}:${leftVariable}",right:"${namespace}:${rightVariable}",prefix:""}`)
            } else if (assignmentExpression.operator === "*=") {
                func.output.push(`function ${namespace}:mathoperation {namespace:"${namespace}",left:"${namespace}:${leftVariable}",right:"${namespace}:${rightVariable}",operation:"*="}`)
            } else if (assignmentExpression.operator === "/=") {
                func.output.push(`function ${namespace}:mathoperation {namespace:"${namespace}",left:"${namespace}:${leftVariable}",right:"${namespace}:${rightVariable}",operation:"/="}`)
            } else if (assignmentExpression.operator === "%=") {
                func.output.push(`function ${namespace}:mathoperation {namespace:"${namespace}",left:"${namespace}:${leftVariable}",right:"${namespace}:${rightVariable}",operation:"%="}`)
            } else {
                return {"type": "null"}
            }
            result = input;
        }
        if (assignmentExpression.left.type === "MemberExpression") {
            func.output.push(`data modify storage ${namespace}:${tempVariable} storage set from storage ${namespace}:${objectName} value`)
            func.output.push(`data modify storage ${namespace}:${tempVariable} property set value "${propertyName}"`)
            if (result.type === "literal") {
                func.output.push(`data modify storage ${namespace}:${tempVariable} value set value ${result.parsed}`)
                func.output.push(`data modify storage ${namespace}:${tempVariable} type set value "${typeof result.raw}"`)
            } else if (result.type === "variable") {
                func.output.push(`data modify storage ${namespace}:${tempVariable} value set from storage ${namespace}:${result.value} value`)
                func.output.push(`data modify storage ${namespace}:${tempVariable} type set from storage ${namespace}:${result.value} type`)
                func.output.push(`data modify storage ${namespace}:${tempVariable} function set value ""`)
                func.output.push(`data modify storage ${namespace}:${tempVariable} function set from storage ${namespace}:${result.value} function`)
            }
            func.output.push(`function ${namespace}:setmember with storage ${namespace}:${tempVariable}`)
        } else {
            func.output.push(`data modify storage ${namespace}:${tempVariable} namespace set value "${namespace}"`)
            func.output.push(`data modify storage ${namespace}:${tempVariable} storage set value "${namespace}:${func.blockScope}"`)
            func.output.push(`data modify storage ${namespace}:${tempVariable} index set value "-2"`)
            func.output.push(`data modify storage ${namespace}:${tempVariable} blockScope set value "${func.blockScope}"`)
            func.output.push(`data modify storage ${namespace}:${tempVariable} name set value "${variableName}"`)
            if (result.type === "literal") {
                func.output.push(`data modify storage ${namespace}:${tempVariable} type set value "${result.type}"`)
                func.output.push(`data modify storage ${namespace}:${tempVariable} value set value ${result.parsed}`)
                func.output.push(`function ${namespace}:setvariableliteral with storage ${namespace}:${tempVariable}`)
            } else if (result.type === "variable") {
                func.output.push(`data modify storage ${namespace}:${tempVariable} result set value "${namespace}:${result.value}"`)
                func.output.push(`function ${namespace}:setvariable with storage ${namespace}:${tempVariable}`)
            }
        }/*
        if (right.type === "literal") {
            if (assignmentExpression.operator === "=") {
                if (assignmentExpression.left.type === "MemberExpression") {
                    func.output.push(`data modify storage ${namespace}:${tempVariable} storage set from storage ${namespace}:${objectName} value`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} property set value "${propertyName}"`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} value set value ${right.parsed}`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} type set value "${typeof right.raw}"`)
                    func.output.push(`function ${namespace}:setmemberliteral with storage ${namespace}:${tempVariable}`)
                } else {
                    func.output.push(`data modify storage ${namespace}:${variableName} ${prefix}value set value ${right.parsed}`)
                    func.output.push(`data modify storage ${namespace}:${variableName} ${prefix}type set value ${typeof right.raw}`)
                }
            }
            if (assignmentExpression.operator === "+=") {
                if (assignmentExpression.left.type === "MemberExpression") {
                    func.output.push(`data modify storage ${namespace}:${tempVariable} namespace set value "${namespace}"`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} storage set from storage ${namespace}:${objectName} value`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} right set value ${right.parsed}`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} operation set value "add"`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} prefix set value "string.${propertyName}."`)
                    func.output.push(`function ${namespace}:add${typeof right.raw}literal with storage ${namespace}:${tempVariable}`)
                } else {
                    func.output.push(`function ${namespace}:add${typeof right.raw}literal {namespace:"${namespace}",storage:"${namespace}:${variableName}",right:${right.parsed},operation:"add",prefix:""}`)
                }
            }
            if (assignmentExpression.operator === "-=") {
                if (assignmentExpression.left.type === "MemberExpression") {
                    func.output.push(`data modify storage ${namespace}:${tempVariable} namespace set value "${namespace}"`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} storage set from storage ${namespace}:${objectName} value`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} right set value ${right.parsed}`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} operation set value "remove"`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} prefix set value "string.${propertyName}."`)
                    func.output.push(`function ${namespace}:add${typeof right.raw}literal with storage ${namespace}:${tempVariable}`)
                } else {
                    func.output.push(`function ${namespace}:add${typeof right.raw}literal {namespace:"${namespace}",storage:"${namespace}:${variableName}",right:${right.parsed},operation:"remove",prefix:""}`)
                }
            }
            if (assignmentExpression.operator === "*=") {
                func.output.push(`function ${namespace}:mathoperationliteral {namespace:"${namespace}",storage:"${namespace}:${variableName}",right:${right.parsed},operation:"*="}`)
            }
            if (assignmentExpression.operator === "/=") {
                func.output.push(`function ${namespace}:mathoperationliteral {namespace:"${namespace}",storage:"${namespace}:${variableName}",right:${right.parsed},operation:"/="}`)
            }
            if (assignmentExpression.operator === "%=") {
                func.output.push(`function ${namespace}:mathoperationliteral {namespace:"${namespace}",storage:"${namespace}:${variableName}",right:${right.parsed},operation:"%="}`)
            }
        } else if (right.type === "variable") {
            if (assignmentExpression.operator === "=") {
                if (assignmentExpression.left.type === "MemberExpression") {
                    func.output.push(`data modify storage ${namespace}:${tempVariable} storage set from storage ${namespace}:${objectName} value`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} property set value "${propertyName}"`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} value set from storage ${namespace}:${right.value} value`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} type set from storage ${namespace}:${right.value} type`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} function set from storage ${namespace}:${right.value} function`)
                    func.output.push(`function ${namespace}:setmemberliteral with storage ${namespace}:${tempVariable}`)
                } else {
                    const tempVariable = "temp-" + Math.random();
                    const resultVariable = "temp-" + Math.random();
                    func.output.push(`data modify storage ${namespace}:${tempVariable} namespace set value "${namespace}"`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} storage set value "${namespace}:${func.blockScope}"`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} index set value "-2"`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} blockScope set value "${func.blockScope}"`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} name set value "${variableName}"`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} result set value "${namespace}:${right.value}"`)
                    func.output.push(`function ${namespace}:setvariable with storage ${namespace}:${tempVariable}`)
                    return {
                        type: "variable",
                        value: resultVariable
                    }
                }
            }
            if (assignmentExpression.operator === "+=") {
                if (assignmentExpression.left.type === "MemberExpression") {
                    func.output.push(`data modify storage ${namespace}:${tempVariable} namespace set value "${namespace}"`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} left set from storage ${namespace}:${objectName} value`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} key set value "${propertyName}"`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} right set value "${namespace}:${right.value}"`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} prefix set value "string.${propertyName}."`)
                    func.output.push(`function ${namespace}:addmember with storage ${namespace}:${tempVariable}`)
                } else {
                    func.output.push(`function ${namespace}:add {namespace:"${namespace}",left:"${namespace}:${variableName}",right:"${namespace}:${right.value}"}`)
                }
            }
            if (assignmentExpression.operator === "-=") {
                if (assignmentExpression.left.type === "MemberExpression") {
                    func.output.push(`data modify storage ${namespace}:${tempVariable} namespace set value "${namespace}"`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} left set from storage ${namespace}:${objectName} value`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} key set value "${propertyName}"`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} right set value "${namespace}:${right.value}"`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} prefix set value "string.${propertyName}."`)
                    func.output.push(`function ${namespace}:subtractmember with storage ${namespace}:${tempVariable}`)
                } else {
                    func.output.push(`function ${namespace}:subtract {namespace:"${namespace}",left:"${namespace}:${variableName}",right:"${namespace}:${right.value}"}`)
                }
            } else if (assignmentExpression.operator === "*=") {
                func.output.push(`function ${namespace}:mathoperation {namespace:"${namespace}",left:"${namespace}:${variableName}",right:"${namespace}:${right.value}",operation:"*="}`)
            } else if (assignmentExpression.operator === "/=") {
                func.output.push(`function ${namespace}:mathoperation {namespace:"${namespace}",left:"${namespace}:${variableName}",right:"${namespace}:${right.value}",operation:"/="}`)
            } else if (assignmentExpression.operator === "%=") {
                func.output.push(`function ${namespace}:mathoperation {namespace:"${namespace}",left:"${namespace}:${variableName}",right:"${namespace}:${right.value}",operation:"%="}`)
            }
        }*/
    }
    if (expression.type === "BinaryExpression") {
        const left = handleExpression(expression.left as Expression, func);
        const right = handleExpression(expression.right, func);
        if (left.type === "literal" && right.type === "literal") {
            if (expression.operator === "+") {
                if (typeof left.raw === "string" || typeof right.raw === "string") return {
                    type: "literal",
                    raw: "" + left.raw + right.raw,
                    parsed: parseLiteral("" + left.raw + right.raw)
                }
                if (typeof left.raw !== "string" && typeof left.raw !== "number") return {"type": "null"}
                if (typeof right.raw !== "string" && typeof right.raw !== "number") return {"type": "null"}
                return {
                    type: "literal",
                    raw: left.raw + right.raw,
                    parsed: left.raw + right.raw + ""
                }
            }
            if (expression.operator === "===") {
                return {
                    type: "literal",
                    raw: left.raw === right.raw,
                    parsed: (left.raw === right.raw) + ""
                }
            }
            if (typeof left.raw !== "number" || typeof right.raw !== "number") return {"type": "null"}
            if (expression.operator === "-") {
                return {
                    type: "literal",
                    raw: left.raw - right.raw,
                    parsed: left.raw - right.raw + ""
                }
            }
            if (expression.operator === "*") {
                return {
                    type: "literal",
                    raw: left.raw * right.raw,
                    parsed: left.raw * right.raw + ""
                }
            }
            if (expression.operator === "/") {
                return {
                    type: "literal",
                    raw: left.raw / right.raw,
                    parsed: left.raw / right.raw + ""
                }
            }
            if (expression.operator === "%") {
                return {
                    type: "literal",
                    raw: left.raw % right.raw,
                    parsed: left.raw % right.raw + ""
                }
            }
        }
        if (left.type === "variable" || right.type === "variable") {
            let leftVariable = null;
            if (left.type === "literal") {
                const tempVariable = "temp-" + Math.random();
                func.output.push(`data modify storage ${namespace}:${tempVariable} value set value ${left.parsed}`)
                func.output.push(`data modify storage ${namespace}:${tempVariable} type set value ${typeof left.raw}`)
                leftVariable = tempVariable
            } else if (left.type === "variable") {
                const tempVariable = "temp-" + Math.random();
                func.output.push(`data modify storage ${namespace}:${tempVariable} value set from storage ${namespace}:${left.value} value`)
                func.output.push(`data modify storage ${namespace}:${tempVariable} type set from storage ${namespace}:${left.value} type`)
                leftVariable = tempVariable;
            }
            let rightVariable = null;
            if (right.type === "literal") {
                const tempVariable = "temp-" + Math.random();
                func.output.push(`data modify storage ${namespace}:${tempVariable} value set value ${right.parsed}`)
                func.output.push(`data modify storage ${namespace}:${tempVariable} type set value ${typeof right.raw}`)
                rightVariable = tempVariable
            } else if (right.type === "variable") {
                rightVariable = right.value;
            }
            if (expression.operator === "+") {
                func.output.push(`function ${namespace}:add {namespace:"${namespace}",left:"${namespace}:${leftVariable}",right:"${namespace}:${rightVariable}",prefix:""}`)
            } else if (expression.operator === "-") {
                func.output.push(`function ${namespace}:subtract {namespace:"${namespace}",left:"${namespace}:${leftVariable}",right:"${namespace}:${rightVariable}",prefix:""}`)
            } else if (expression.operator === "*") {
                func.output.push(`function ${namespace}:mathoperation {namespace:"${namespace}",left:"${namespace}:${leftVariable}",right:"${namespace}:${rightVariable}",operation:"*="}`)
            } else if (expression.operator === "/") {
                func.output.push(`function ${namespace}:mathoperation {namespace:"${namespace}",left:"${namespace}:${leftVariable}",right:"${namespace}:${rightVariable}",operation:"/="}`)
            } else if (expression.operator === "%") {
                func.output.push(`function ${namespace}:mathoperation {namespace:"${namespace}",left:"${namespace}:${leftVariable}",right:"${namespace}:${rightVariable}",operation:"%="}`)
            } else if (expression.operator === "===" || expression.operator === "!==" || expression.operator === "<" || expression.operator === "<=" || expression.operator === ">" || expression.operator === ">=") {
                const tempVariable = "temp-" + Math.random();
                const resultVariable = "temp-" + Math.random();
                func.output.push(`data modify storage ${namespace}:${tempVariable} namespace set value "${namespace}"`)
                func.output.push(`data modify storage ${namespace}:${tempVariable} result set value "${namespace}:${resultVariable}"`)
                if (expression.operator === "===" || expression.operator === "!==") {
                    func.output.push(`data modify storage ${namespace}:${tempVariable} left set value "${namespace}:${leftVariable}"`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} type set from storage ${namespace}:${rightVariable} type`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} value set from storage ${namespace}:${rightVariable} value`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} ifequal set value "${expression.operator === "==="}"`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} ifunequal set value "${expression.operator === "!=="}"`)
                    func.output.push(`function ${namespace}:equals with storage ${namespace}:${tempVariable}`)
                } else {
                    func.output.push(`data modify storage ${namespace}:${tempVariable} left set from storage ${namespace}:${leftVariable} value`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} right set from storage ${namespace}:${rightVariable} value`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} operator set value "${expression.operator}"`)
                    func.output.push(`function ${namespace}:numbercompare with storage ${namespace}:${tempVariable}`)
                }
                return {
                    type: "variable",
                    value: resultVariable as string
                }
            }
            return {
                type: "variable",
                value: leftVariable as string
            }
        }
    }
    if (expression.type === "UnaryExpression") {
        const argument = handleExpression(expression.argument, func);
        if (expression.operator === "+") {
            if (argument.type === "literal") {
                if (typeof argument.raw !== "number" && typeof argument.raw !== "string") return {
                    "type": "null"
                };
                return {
                    type: "literal",
                    raw: +argument.raw,
                    parsed: argument.raw + ""
                }
            } else if (argument.type === "variable") {
                const tempVariable = "temp-" + Math.random();
                const resultVariable = "temp-" + Math.random();
                func.output.push(`data modify storage ${namespace}:${tempVariable} variable set value "${namespace}:${resultVariable}"`)
                func.output.push(`data modify storage ${namespace}:${tempVariable} value set from storage ${namespace}:${argument.value} value`)
                func.output.push(`function ${namespace}:tonumber with storage ${namespace}:${tempVariable}`)
                return {
                    type: "variable",
                    value: resultVariable
                }
            }
        }
        if (expression.operator === "-") {
            if (argument.type === "literal") {
                if (typeof argument.raw !== "number" && typeof argument.raw !== "string") return {
                    "type": "null"
                };
                return {
                    type: "literal",
                    raw: -argument.raw,
                    parsed: -argument.raw + ""
                }
            } else if (argument.type === "variable") {
                const tempVariable = "temp-" + Math.random();
                const resultVariable = "temp-" + Math.random();
                func.output.push(`data modify storage ${namespace}:${resultVariable} type set value "number"`)
                func.output.push(`data modify storage ${namespace}:${tempVariable} left set value 0`)
                func.output.push(`data modify storage ${namespace}:${tempVariable} right set from storage ${namespace}:${argument.value} value`)
                func.output.push(`data modify storage ${namespace}:${tempVariable} operation set value "-="`)
                func.output.push(`data modify storage ${namespace}:${tempVariable} storage set value "${namespace}:${resultVariable}"`)
                func.output.push(`function ${namespace}:mathoperationinternal with storage ${namespace}:${tempVariable}`)
                return {
                    type: "variable",
                    value: resultVariable
                }
            }
        }
        if (expression.operator === "typeof") {
            if (argument.type === "literal") return {
                type: "literal",
                raw: typeof argument.raw,
                parsed: "\"" + argument.raw + "\""
            }
            if (argument.type === "variable") {
                const tempVariable = "temp-" + Math.random();
                func.output.push(`data modify storage ${namespace}:${tempVariable} type set value "string"`)
                func.output.push(`data modify storage ${namespace}:${tempVariable} value set from storage ${namespace}:${argument.value} type`)
                return {
                    type: "variable",
                    value: tempVariable
                }
            }
        }
    }
    if (expression.type === "ObjectExpression") {
        const tempVariable = "temp-" + Math.random();
        func.output.push(`data modify storage ${namespace}:${tempVariable} type set value "object"`)
        const objVariable = "obj-" + Math.random();
        func.output.push(`data modify storage ${namespace}:${tempVariable} value set value "${namespace}:${objVariable}"`)
        func.output.push(`data modify storage ${namespace}:${objVariable} type set value "object"`)
        for (const property of expression.properties) {
            if (property.type === "SpreadElement") continue;
            if (property.computed) {

            } else {
                const value = handleExpression(property.value, func)
                const key = (property.key as Literal).value
                if (value.type === "literal") {
                    func.output.push(`data modify storage ${namespace}:${objVariable} string.${key}.value set value ${value.parsed}`)
                    func.output.push(`data modify storage ${namespace}:${objVariable} string.${key}.type set value ${typeof value.raw}`)
                } else if (value.type === "variable") {
                    func.output.push(`data modify storage ${namespace}:${objVariable} string.${key}.value set from storage ${namespace}:${value.value} value`)
                    func.output.push(`data modify storage ${namespace}:${objVariable} string.${key}.type set from storage ${namespace}:${value.value} type`)
                    func.output.push(`data modify storage ${namespace}:${objVariable} string.${key}.function set from storage ${namespace}:${value.value} function`)
                }
            }
        }
        return {
            type: "variable",
            value: tempVariable
        }
    }
    if (expression.type === "MemberExpression") {
        const property: ExpressionOutput = expression.property.type === "Identifier" ? {type: "variable", value: expression.property.name} : handleExpression(expression.property as Expression, func)
        if (expression.object.type === "Super") {
            console.log("it's super member time!")
            const tempVariable = "temp-" + Math.random();
            const resultVariable = "temp-" + Math.random();
            func.output.push(`data modify storage ${namespace}:${tempVariable} prototype set from storage ${namespace}:${func.superClass} value`)
            if (property.type === "variable" && expression.computed) {
                func.output.push(`data modify storage ${namespace}:${tempVariable} property set from storage ${namespace}:${property.value} value`)
            } else if (property.type === "literal" || !expression.computed) {
                const propertyValue = property.type === "literal" ? property.raw : (property.type === "variable" ? property.value : "");
                func.output.push(`data modify storage ${namespace}:${tempVariable} property set value ${propertyValue}`)
            }
            func.output.push(`data modify storage ${namespace}:${tempVariable} result set value "${namespace}:${resultVariable}"`)
            func.output.push(`data modify storage ${namespace}:${tempVariable} namespace set value "${namespace}"`)
            func.output.push(`function ${namespace}:prototypemember with storage ${namespace}:${tempVariable}`)
            if (!func.that) return {"type": "null"}
            return {
                type: "variable",
                value: resultVariable,
                object: {"type": "variable", "value": func.that}
            }
        }
        const object = handleExpression(expression.object, func);
        if (object.type === "null") return {type: "null"}
        let variableName = null;
        if (object.type === "literal") {
            variableName = "temp-" + Math.random();
            func.output.push(`data modify storage ${namespace}:${variableName} type set value "${typeof object.raw}"`)
            func.output.push(`data modify storage ${namespace}:${variableName} value set value ${object.parsed}`)
        } else {
            variableName = object.value
        }
        const tempVariable = "temp-" + Math.random();
        const resultVariable = "temp-" + Math.random();
        if (property.type === "variable" && expression.computed) {
            func.output.push(`data modify storage ${namespace}:${tempVariable} property set from storage ${namespace}:${property.value} value`)
            func.output.push(`data modify storage ${namespace}:${tempVariable} object set value "${namespace}:${variableName}"`)
            func.output.push(`data modify storage ${namespace}:${tempVariable} result set value "${namespace}:${resultVariable}"`)
            func.output.push(`data modify storage ${namespace}:${tempVariable} namespace set value "${namespace}"`)
            func.output.push(`function ${namespace}:getmember with storage ${namespace}:${tempVariable}`)
        } else if (property.type === "literal" || !expression.computed) {
            const propertyValue = property.type === "literal" ? property.raw : (property.type === "variable" ? property.value : "");
            func.output.push(`data modify storage ${namespace}:${tempVariable} property set value "${propertyValue}"`)
            func.output.push(`data modify storage ${namespace}:${tempVariable} object set value "${namespace}:${variableName}"`)
            func.output.push(`data modify storage ${namespace}:${tempVariable} result set value "${namespace}:${resultVariable}"`)
            func.output.push(`data modify storage ${namespace}:${tempVariable} namespace set value "${namespace}"`)
            func.output.push(`function ${namespace}:getmember with storage ${namespace}:${tempVariable}`)
        }
        return {
            type: "variable",
            value: resultVariable,
            object
        }
    }
    if (expression.type === "UpdateExpression") {
        const argument = handleExpression(expression.argument, func)
        if (argument.type === "literal") {
            if (typeof argument.raw !== "number") return {type: "null"};
            return {
                type: "literal",
                raw: expression.prefix ? argument.raw + 1 : argument.raw,
                parsed: (expression.prefix ? argument.raw + 1 : argument.raw) + ""
            }
        } else if (argument.type === "variable") {
            const tempVariable = "temp-" + Math.random();
            if (!expression.prefix) {
                func.output.push(`data modify storage ${namespace}:${tempVariable} value set from storage ${namespace}:${argument.value} value`)
                func.output.push(`data modify storage ${namespace}:${tempVariable} type set from storage ${namespace}:${argument.value} type`)
            }
            if (expression.operator === "++") {
                func.output.push(`function ${namespace}:addnumberliteral {namespace:"${namespace}",storage:"${namespace}:${argument.value}",right:1,operation:"add"}`)
            } else if (expression.operator === "--") {
                func.output.push(`function ${namespace}:addnumberliteral {namespace:"${namespace}",storage:"${namespace}:${argument.value}",right:1,operation:"remove"}`)
            }
            func.output.push(`data modify storage ${namespace}:${tempVariable} namespace set value "${namespace}"`)
            func.output.push(`data modify storage ${namespace}:${tempVariable} storage set value "${namespace}:${func.blockScope}"`)
            func.output.push(`data modify storage ${namespace}:${tempVariable} index set value "-2"`)
            func.output.push(`data modify storage ${namespace}:${tempVariable} blockScope set value "${func.blockScope}"`)
            func.output.push(`data modify storage ${namespace}:${tempVariable} name set value "${(expression.argument as Identifier).name}"`)
            func.output.push(`data modify storage ${namespace}:${tempVariable} result set value "${namespace}:${argument.value}"`)
            func.output.push(`function ${namespace}:setvariable with storage ${namespace}:${tempVariable}`)
            if (!expression.prefix) return {
                type: "variable",
                value: tempVariable
            }
            return {
                type: "variable",
                value: argument.value
            }
        }
    }
    if (expression.type === "ArrowFunctionExpression") {
        return {
            type: "variable",
            value: generateFunction(expression.params as Identifier[], expression.expression, expression.body, func, null, false, {
                type: "arrow",
                scopeList: func.scopeList,
                superClass: func.superClass,
                that: func.that,
                isAsync: true
            })[0]
        }
    }
    if (expression.type === "ArrayExpression") {
        const tempVariable = "temp-" + Math.random();
        const objVariable = "obj-" + Math.random();
        func.output.push(`data modify storage ${namespace}:${tempVariable} value set value "${namespace}:${objVariable}"`)
        func.output.push(`data modify storage ${namespace}:${tempVariable} type set value "object"`)
        func.output.push(`data modify storage ${namespace}:${objVariable} array set value []`)
        func.output.push(`data modify storage ${namespace}:${objVariable} type set value "array"`)
        for (const node of expression.elements) {
            if (!node || node.type === "SpreadElement") return {"type": "null"};
            const element = handleExpression(node, func)
            if (element.type === "literal") {
                func.output.push(`data modify storage ${namespace}:${objVariable} array append value {type: "${typeof element.raw}", value: ${element.parsed}}`)
            } else if (element.type === "variable") {
                func.output.push(`data modify storage ${namespace}:${objVariable} array append from storage ${namespace}:${element.value}`)
            }
        }
        return {
            type: "variable",
            value: tempVariable
        }
    }
    if (expression.type === "ThisExpression") {
        if (func.that) {
            return {
                type: "variable",
                value: func.that
            }
        } else {
            return {
                type: "null"
            }
        }
    }
    if (expression.type === "AwaitExpression") {
        const argument = handleExpression(expression.argument, func);
        if (argument.type !== "variable") return {
            type: "null"
        }
        
        const getmemberTemp = "temp-" + Math.random();
        const getmemberResult = "temp-" + Math.random();
        
        func.output.push(`data modify storage ${namespace}:${getmemberTemp} property set value "then"`)
        func.output.push(`data modify storage ${namespace}:${getmemberTemp} object set from storage ${namespace}:${argument.value} value`)
        func.output.push(`data modify storage ${namespace}:${getmemberTemp} result set value "${namespace}:${getmemberResult}"`)
        func.output.push(`data modify storage ${namespace}:${getmemberTemp} namespace set value "${namespace}"`)
        func.output.push(`function ${namespace}:getmemberinternal with storage ${namespace}:${getmemberTemp}`)
        
        const callTemp = "temp-" + Math.random();
        const callResult = "temp-" + Math.random();
        func.output.push(`data modify storage ${namespace}:${callTemp} function set from storage ${namespace}:${getmemberResult} function`)
        
        const functionName = "await-" + Math.random();
        
        const functionVariable = "temp-" + Math.random();
        const objVariable = "temp-" + Math.random();
        func.output.push(`data modify storage ${namespace}:${functionVariable} value set value "${namespace}:${objVariable}"`)
        func.output.push(`data modify storage ${namespace}:${functionVariable} type set value function`)
        func.output.push(`data modify storage ${namespace}:${functionVariable} function set value ${functionName}`)
        func.output.push(`data modify storage ${namespace}:${objVariable} type set value "object"`)

        func.output.push(`data modify storage ${namespace}:params 0 set value "${namespace}:${functionVariable}"`)
        
        func.output.push(`data modify storage ${namespace}:${callTemp} namespace set value "${namespace}"`)
        func.output.push(`data modify storage ${namespace}:${callTemp} storage set value "${namespace}:params"`)

        func.output.push(`data modify storage ${namespace}:params __this set value "${namespace}:${argument.value}"`)
        func.output.push(`data modify storage ${namespace}:params __this_obj set from storage ${namespace}:${argument.value} value`)
        
        func.output.push(`data modify storage ${namespace}:params __return set value "${namespace}:${callResult}"`)
        func.output.push(`function ${namespace}:call with storage ${namespace}:${callTemp}`)
        

        func.write();
        func.output = [];
        func.destination = "./output/" + functionName + ".mcfunction"

        const awaitResult = "temp-" + Math.random();
        func.output.push(`$data modify storage ${namespace}:${awaitResult} value set from storage $(0) value`)
        func.output.push(`$data modify storage ${namespace}:${awaitResult} type set from storage $(0) type`)
        func.output.push(`$data modify storage ${namespace}:${awaitResult} function set from storage $(0) function`)
        return {
            type: "variable",
            value: awaitResult
        }
    }
    if (expression.type === "ClassExpression") {
        return generateClass(expression, func)
    }
    if (expression.type === "MetaProperty") {
        if (expression.meta.name === "new") {
            if (expression.property.name === "target") {
                const tempVariable = "temp-" + Math.random();
                func.output.push(`data modify storage ${namespace}:${tempVariable} value set value "undefined"`)
                func.output.push(`data modify storage ${namespace}:${tempVariable} type set value "undefined"`)
                func.output.push(`$data modify storage ${namespace}:${tempVariable} value set from storage $(__new_target) value`)
                func.output.push(`$data modify storage ${namespace}:${tempVariable} type set from storage $(__new_target) type`)
                func.output.push(`$data modify storage ${namespace}:${tempVariable} function set from storage $(__new_target) function`)
                return {
                    type: "variable",
                    value: tempVariable
                }
            }
        }
    }
    return {
        type: "null"
    };
}

const files = await readdir("./output");
        
for (const file of files) {
    const filePath = path.join("./output", file);
    await unlink(filePath);
}

for (const node of acorn.parse(code, {ecmaVersion: 2020}).body) {
    handleNode(node, new MCFunction({
        scopeList: []
    }));
}

await cp('libs/.', 'output/.', { recursive: true });