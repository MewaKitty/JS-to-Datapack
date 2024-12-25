import * as acorn from "acorn";
import type { Node, FunctionDeclaration, BlockStatement, ExpressionStatement, Expression, CallExpression, Identifier, Literal, VariableDeclaration, AssignmentExpression, IfStatement, WhileStatement, ForStatement, SwitchStatement, ForOfStatement } from "acorn";
import { writeFile, cp, readdir, unlink } from "node:fs/promises";
import path from "node:path";

const code = `
function main () {
    const animals = ["pig", "cow"]
    for (let i = 0; i < 3; i++) {
        for (const animal of animals) __run("summon " + animal)
    }
}
`

const namespace = "test";

const functions: Record<string, {
    params: Array<string>
}> = {}

class MCFunction {
    output: string[]
    constructor () {
        this.output = [];
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
    value: string
}
type ExpressionOutput = ExpressionNullOutput | ExpressionLiteralOutput | ExpressionVariableOutput;

const generateIfLines = (func: MCFunction, test: ExpressionVariableOutput, functionName: string) => {
    func.output.push(`data modify storage ${namespace}:temp-result result set value 0`)
    func.output.push(`execute store result storage ${namespace}:temp-result result int 1 if data storage ${namespace}:${test.value} {value:true} run function ${namespace}:${functionName}`)
    func.output.push(`execute store result storage ${namespace}:temp-result result int 1 if data storage ${namespace}:${test.value} {type:"number"} unless data storage ${namespace}:${test.value} {value:0} run function ${namespace}:${functionName}`)
    func.output.push(`execute store result storage ${namespace}:temp-result result int 1 if data storage ${namespace}:${test.value} {type:"string"} unless data storage ${namespace}:${test.value} {value:""} run function ${namespace}:${functionName}`)
    func.output.push(`execute if data storage ${namespace}:temp-result {result:-2000000000} run return -2000000000`)
}
const handleNode = (node: Node, func: MCFunction): string => {
    if (node.type === "FunctionDeclaration") {
        const subfunc = new MCFunction()
        for (const param of (node as FunctionDeclaration).params as Identifier[]) {
            subfunc.output.push(`$data modify storage ${namespace}:${param.name} value set value $(${param.name})`)
            subfunc.output.push(`data modify storage ${namespace}:${param.name} type set value "string"`)
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
                func.output.push(`data modify storage ${namespace}:${variableName} value set value ${value.parsed}`)
                func.output.push(`data modify storage ${namespace}:${variableName} type set value "${typeof value.raw}"`)
            } else if (value.type === "variable") {
                func.output.push(`data modify storage ${namespace}:${variableName} value set from storage ${namespace}:${value.value} value`)
                func.output.push(`data modify storage ${namespace}:${variableName} type set from storage ${namespace}:${value.value} type`)
                func.output.push(`data modify storage ${namespace}:${variableName} function set from storage ${namespace}:${value.value} function`)
            }
        }
    }
    if (node.type === "IfStatement") {
        const ifStatement = node as IfStatement
        const test = handleExpression(ifStatement.test, func)
        if (test.type === "literal") {
            if (test.raw) {
                handleNode(ifStatement.consequent, func)
            } else if (ifStatement.alternate) {
                handleNode(ifStatement.alternate, func)
            }
        } else if (test.type === "variable") {
            const functionName = "block" + Math.random()
            generateIfLines(func, test, functionName)
            const subfunc = new MCFunction()
            handleNode(ifStatement.consequent, subfunc)
            writeFile("./output/" + functionName + ".mcfunction", subfunc.output.join("\n"))
            if (ifStatement.alternate) {
                const functionAlternate = "block" + Math.random()
                func.output.push(`data modify storage ${namespace}:temp-result result set value 0`)
                func.output.push(`execute store result storage ${namespace}:temp-result result int 1 if data storage ${namespace}:${test.value} {value:false} run function ${namespace}:${functionAlternate}`)
                func.output.push(`execute store result storage ${namespace}:temp-result result int 1 if data storage ${namespace}:${test.value} {value:0} run function ${namespace}:${functionAlternate}`)
                func.output.push(`execute store result storage ${namespace}:temp-result result int 1 if data storage ${namespace}:${test.value} {value:""} run function ${namespace}:${functionAlternate}`)
                func.output.push(`execute if data storage ${namespace}:temp-result {result:-2000000000} run return -2000000000`)
                const alternatefunc = new MCFunction()
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
        const subfunc = new MCFunction()
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
        if (!forStatement.test) return "";
        if (forStatement.init) handleNode(forStatement.init, func);
        const test = handleExpression(forStatement.test, func)
        if (test.type === "literal") {
            return "";
        } else if (test.type === "variable") {
            const functionName = "block" + Math.random()
            generateIfLines(func, test, functionName)
            const subfunc = new MCFunction()
            handleNode(forStatement.body, subfunc)
            if (forStatement.update) handleExpression(forStatement.update, subfunc)
            const subtest = handleExpression(forStatement.test, subfunc)
            if (subtest.type !== "variable") return "";
            generateIfLines(subfunc, subtest, functionName)
            writeFile("./output/" + functionName + ".mcfunction", subfunc.output.join("\n"))
        }
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
        const switchfunc = new MCFunction()
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
                const subfunc = new MCFunction()
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
        func.output.push(`data modify storage ${namespace}:${tempVariable} storage set value "${namespace}:${right.value}"`)
        func.output.push(`data modify storage ${namespace}:${tempVariable} index set value 0`)
        func.output.push(`data modify storage ${namespace}:${tempVariable} function set value "${namespace}:${functionName}"`)
        func.output.push(`function ${namespace}:looparray with storage ${namespace}:${tempVariable}`)
        const subfunc = new MCFunction()
        subfunc.output.push(`data modify storage ${namespace}:${variableName} value set from storage ${namespace}:temp data.value`)
        subfunc.output.push(`data modify storage ${namespace}:${variableName} type set from storage ${namespace}:temp data.type`)
        subfunc.output.push(`data modify storage ${namespace}:${variableName} function set from storage ${namespace}:temp data.function`)
        handleNode(forOf.body, subfunc)
        writeFile("./output/" + functionName + ".mcfunction", subfunc.output.join("\n"))
    }
    handleExpression(node as Expression, func);
    return "";
}

const parseLiteral = (literal: string | number | bigint | boolean | RegExp | null | undefined) => {
    if (typeof literal === "string") return "\"" + literal + "\"";
    if (typeof literal === "number") return literal + "";
    if (typeof literal === "boolean") return literal + "";
    return "";
}
const handleExpression = (expression: Expression, func: MCFunction): ExpressionOutput => {
    if (expression.type === "Literal") return {
        type: "literal",
        raw: expression.value,
        parsed: parseLiteral(expression.value)
    }
    if (expression.type === "Identifier") return {
        type: "variable",
        value: expression.name
    };
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
                const callee = handleExpression(callExpression.callee as Identifier, func);
                if (callee.type !== "variable") return {"type": "null"}
                const tempVariable = "temp-" + Math.random();
                func.output.push(`data modify storage ${namespace}:${tempVariable} function set from storage ${namespace}:${callee.value} function`)
                
                for (const [index, argument] of (expression as CallExpression).arguments.entries()) {
                    const argumentOutput = handleExpression(argument as Expression, func);
                    if (argumentOutput.type === "literal") {
                        func.output.push(`data modify storage ${namespace}:params ${index} set value ${argumentOutput.parsed}`)
                    }
                    if (argumentOutput.type === "variable") {
                        func.output.push(`data modify storage ${namespace}:params ${index} set from storage ${namespace}:${argumentOutput.value} value`)
                    }
                }
                func.output.push(`data modify storage ${namespace}:${tempVariable} namespace set value "${namespace}"`)
                func.output.push(`data modify storage ${namespace}:${tempVariable} storage set value "${namespace}:params"`)
                func.output.push(`function ${namespace}:call with storage ${namespace}:${tempVariable}`)
            }
        }
    }
    if (expression.type === "AssignmentExpression") {
        const assignmentExpression = expression as AssignmentExpression;
        const variableName = (assignmentExpression.left as Identifier).name
        const right = handleExpression(assignmentExpression.right, func)
        if (right.type === "literal") {
            if (assignmentExpression.operator === "=") {
                func.output.push(`data modify storage ${namespace}:${variableName} value set value ${right.parsed}`)
                func.output.push(`data modify storage ${namespace}:${variableName} type set value ${typeof right.raw}`)
            }
            if (assignmentExpression.operator === "+=") {
                func.output.push(`function ${namespace}:add${typeof right.raw}literal {namespace:"${namespace}",storage:"${namespace}:${variableName}",right:${right.parsed},operation:"add"}`)
            }
            if (assignmentExpression.operator === "-=") {
                func.output.push(`function ${namespace}:add${typeof right.raw}literal {namespace:"${namespace}",storage:"${namespace}:${variableName}",right:${right.parsed},operation:"remove"}`)
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
                func.output.push(`data modify storage ${namespace}:${variableName} value set from storage ${namespace}:${right.value} value`)
                func.output.push(`data modify storage ${namespace}:${variableName} type set from storage ${namespace}:${right.value} type`)
                func.output.push(`data modify storage ${namespace}:${variableName} function set from storage ${namespace}:${right.value} function`)
            }
            if (assignmentExpression.operator === "+=") {
                func.output.push(`function ${namespace}:add {namespace:"${namespace}",left:"${namespace}:${variableName}",right:"${namespace}:${right.value}"}`)
            }
            if (assignmentExpression.operator === "-=") {
                func.output.push(`function ${namespace}:subtract {namespace:"${namespace}",left:"${namespace}:${variableName}",right:"${namespace}:${right.value}"}`)
            } else if (assignmentExpression.operator === "*=") {
                func.output.push(`function ${namespace}:mathoperation {namespace:"${namespace}",left:"${namespace}:${variableName}",right:"${namespace}:${right.value}",operation:"*="}`)
            } else if (assignmentExpression.operator === "/=") {
                func.output.push(`function ${namespace}:mathoperation {namespace:"${namespace}",left:"${namespace}:${variableName}",right:"${namespace}:${right.value}",operation:"/="}`)
            } else if (assignmentExpression.operator === "%=") {
                func.output.push(`function ${namespace}:mathoperation {namespace:"${namespace}",left:"${namespace}:${variableName}",right:"${namespace}:${right.value}",operation:"%="}`)
            }
        }
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
                func.output.push(`data modify storage ${namespace}:${tempVariable} value set value "${left.raw}"`)
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
                func.output.push(`data modify storage ${namespace}:${tempVariable} value set value "${right.raw}"`)
                func.output.push(`data modify storage ${namespace}:${tempVariable} type set value ${typeof right.raw}`)
                rightVariable = tempVariable
            } else if (right.type === "variable") {
                rightVariable = right.value;
            }
            if (expression.operator === "+") {
                func.output.push(`function ${namespace}:add {namespace:"${namespace}",left:"${namespace}:${leftVariable}",right:"${namespace}:${rightVariable}"}`)
            } else if (expression.operator === "-") {
                func.output.push(`function ${namespace}:subtract {namespace:"${namespace}",left:"${namespace}:${leftVariable}",right:"${namespace}:${rightVariable}"}`)
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
        if (expression.operator === "+") {
            const argument = handleExpression(expression.argument, func);
            if (argument.type === "literal") {
                if (argument.raw !== "number" && argument.raw !== "string") return {
                    "type": "null"
                };
                return {
                    type: "literal",
                    raw: +argument.raw,
                    parsed: argument.raw
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
    }
    if (expression.type === "ObjectExpression") {
        const tempVariable = "temp-" + Math.random();
        func.output.push(`data modify storage ${namespace}:${tempVariable} type set value "object"`)
        for (const property of expression.properties) {
            if (property.type === "SpreadElement") continue;
            console.log(property)
            if (property.computed) {

            } else {
                const value = handleExpression(property.value, func)
                const key = (property.key as Literal).value
                if (value.type === "literal") {
                    func.output.push(`data modify storage ${namespace}:${tempVariable} value.${key}.value set value ${value.parsed}`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} value.${key}.type set value ${typeof value.raw}`)
                } else if (value.type === "variable") {
                    func.output.push(`data modify storage ${namespace}:${tempVariable} value.${key}.value set from storage ${namespace}:${value.value} value`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} value.${key}.type set from storage ${namespace}:${value.value} type`)
                    func.output.push(`data modify storage ${namespace}:${tempVariable} value.${key}.function set from storage ${namespace}:${value.value} function`)
                }
            }
        }
        return {
            type: "variable",
            value: tempVariable
        }
    }
    if (expression.type === "MemberExpression") {
        if (expression.object.type === "Super") return {
            type: "null"
        };
        const object = handleExpression(expression.object, func);
        const property = handleExpression(expression.property as Expression, func)
        if (property.type === "variable" && expression.computed) {
            if (object.type === "literal") {

            } else if (object.type === "variable") {
                const tempVariable = "temp-" + Math.random();
                const resultVariable = "temp-" + Math.random();
                func.output.push(`data modify storage ${namespace}:${tempVariable} property set from storage ${namespace}:${property.value} value`)
                func.output.push(`data modify storage ${namespace}:${tempVariable} object set value "${namespace}:${object.value}"`)
                func.output.push(`data modify storage ${namespace}:${tempVariable} result set value "${namespace}:${resultVariable}"`)
                func.output.push(`function ${namespace}:computedmember with storage ${namespace}:${tempVariable}`)
                return {
                    type: "variable",
                    value: resultVariable
                }
            }
        } else if (property.type === "literal" || !expression.computed) {
            const propertyValue = property.type === "literal" ? property.raw : (property.type === "variable" ? property.value : "");
            if (object.type === "literal") {

            } else if (object.type === "variable") {
                const tempVariable = "temp-" + Math.random();
                const index = property.type === "literal" && typeof property.raw === "number" ? `value[${propertyValue}]` : `value.${propertyValue}`
                func.output.push(`data modify storage ${namespace}:${tempVariable} value set from storage ${namespace}:${object.value} ${index}.value`)
                func.output.push(`data modify storage ${namespace}:${tempVariable} type set from storage ${namespace}:${object.value} ${index}.type`)
                func.output.push(`data modify storage ${namespace}:${tempVariable} function set from storage ${namespace}:${object.value} ${index}.function`)
                return {
                    type: "variable",
                    value: tempVariable
                }
            }
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
        console.log(expression)
        const functionName = "arrow" + Math.random()
        const subfunc = new MCFunction()
        for (const [index, param] of (expression.params as Identifier[]).entries()) {
            subfunc.output.push(`$data modify storage ${namespace}:${param.name} value set value $(${index})`)
            subfunc.output.push(`data modify storage ${namespace}:${param.name} type set value "string"`)
        }
        if (expression.expression) {
            handleExpression(expression.body as Expression, subfunc)
        } else {
            handleNode(expression.body, subfunc)
        }
        writeFile("./output/" + functionName + ".mcfunction", subfunc.output.join("\n"))
        const tempVariable = "temp-" + Math.random();
        func.output.push(`data modify storage ${namespace}:${tempVariable} value set value {}`)
        func.output.push(`data modify storage ${namespace}:${tempVariable} type set value function`)
        func.output.push(`data modify storage ${namespace}:${tempVariable} function set value ${functionName}`)
        
        return {
            type: "variable",
            value: tempVariable
        }
    }
    if (expression.type === "ArrayExpression") {
        const tempVariable = "temp-" + Math.random();
        func.output.push(`data modify storage ${namespace}:${tempVariable} value set value []`)
        func.output.push(`data modify storage ${namespace}:${tempVariable} type set value array`)
        for (const node of expression.elements) {
            if (!node || node.type === "SpreadElement") return {"type": "null"};
            const element = handleExpression(node, func)
            if (element.type === "literal") {
                func.output.push(`data modify storage ${namespace}:${tempVariable} value append value {type: "${typeof element.raw}", value: ${element.parsed}}`)
            } else if (element.type === "variable") {
                func.output.push(`data modify storage ${namespace}:${tempVariable} value append from storage ${namespace}:${element.value}`)
            }
        }
        return {
            type: "variable",
            value: tempVariable
        }
    }
    console.log(expression)
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
    handleNode(node, new MCFunction());
}

await cp('libs/.', 'output/.', { recursive: true });