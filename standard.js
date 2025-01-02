globalThis.Object = class {
    constructor () {
    }
    toString () {
        if (this === null) return "[object Null]";
        return "[object Object]";
    }
}
const convertToString = text => {
    if (typeof text === "string") {
        return text
    };
    return text + "";
}
globalThis.console = {
    "log": (text) => __run(__singleQuoteConcat(__singleQuoteConcat('tellraw @a "', convertToString(text)), '"')),
    "warn": (text) => __run(__singleQuoteConcat(__singleQuoteConcat('tellraw @a {"text":"', convertToString(text)), '","color":"yellow"}')),
    "error": (text) => __run(__singleQuoteConcat(__singleQuoteConcat('tellraw @a {"text":"', convertToString(text)), '","color":"red"}')),
    "info": (text) => __run(__singleQuoteConcat(__singleQuoteConcat('tellraw @a {"text":"', convertToString(text)), '","color":"blue"}')),
    "debug": (text) => __run(__singleQuoteConcat(__singleQuoteConcat('tellraw @a {"text":"', convertToString(text)), '","color":"aqua"}')),
};
globalThis.String = class {
    constructor (value) {
        if (new.target) {
            this._value = value + "";
        } else {
            return value + "";
        };
    }
    repeat (count) {
        let result = "";
        for (let i = 0; i < count; i++) {
            result += this._value;
        };
        return result;
    }
};
globalThis.Promise = class {
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
globalThis.setTimeout = (handler, timeout) => {
    __run("schedule function " + __callableFunction(handler) + " " + (timeout / 50) + "t append")
}
globalThis.setInterval = (handler, timeout) => {
    __run("schedule function " + __callableFunction(() => {
        handler();
        setInterval(handler, timeout);
    }) + " " + (timeout / 50) + "t append")
}