import * as acorn from "acorn";
import type { Node, FunctionDeclaration, BlockStatement, ExpressionStatement, Expression, CallExpression, Identifier, Literal, VariableDeclaration, AssignmentExpression } from "acorn";
import { writeFile, cp } from "node:fs/promises";

const code = `
function main (weather) {
    const map = {
        "r": "rain",
        "c": "clear"
    }
    __run("weather " + map[weather])
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
                func.output.push(`data modify storage ${namespace}:${variableName} type set value "${typeof value.parsed}"`)
            } else if (value.type === "variable") {
                func.output.push(`data modify storage ${namespace}:${variableName} value set from storage ${namespace}:${value.value} value`)
                func.output.push(`data modify storage ${namespace}:${variableName} type set from storage ${namespace}:${value.value} type`)
            }
        }
    }
    return "";
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
            const callee = ((expression as CallExpression)?.callee as Identifier)?.name
            const params = functions[callee].params
            const argumentMap: Record<string, Literal> = {}
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
        }
    }
    if (expression.type === "AssignmentExpression") {
        const assignmentExpression = expression as AssignmentExpression;
        const variableName = (assignmentExpression.left as Identifier).name
        const right = handleExpression(assignmentExpression.right, func)
        if (right.type === "literal") {
            if (assignmentExpression.operator === "=") {
                func.output.push(`data modify storage ${namespace}:${variableName} value set value ${right.parsed}`)
                func.output.push(`data modify storage ${namespace}:${variableName} type set value ${typeof right}`)
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
        if (property.type === "variable") {
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
        } else if (property.type === "literal") {
            const propertyValue = property.raw;
            if (object.type === "literal") {

            } else if (object.type === "variable") {
                const tempVariable = "temp-" + Math.random();
                func.output.push(`data modify storage ${namespace}:${tempVariable} value set from storage ${namespace}:${object.value} value.${propertyValue}.value`)
                func.output.push(`data modify storage ${namespace}:${tempVariable} type set from storage ${namespace}:${object.value} value.${propertyValue}.type`)
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
for (const node of acorn.parse(code, {ecmaVersion: 2020}).body) {
    handleNode(node, new MCFunction());
}
await cp('libs/.', 'output/.', { recursive: true });