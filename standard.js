globalThis.console = {
    "log": (text) => __run(__singleQuoteConcat(__singleQuoteConcat('tellraw @a "', text), '"')),
    "warn": (text) => __run(__singleQuoteConcat(__singleQuoteConcat('tellraw @a {"text":"', text), '","color":"yellow"}')),
    "error": (text) => __run(__singleQuoteConcat(__singleQuoteConcat('tellraw @a {"text":"', text), '","color":"red"}')),
    "info": (text) => __run(__singleQuoteConcat(__singleQuoteConcat('tellraw @a {"text":"', text), '","color":"blue"}')),
    "debug": (text) => __run(__singleQuoteConcat(__singleQuoteConcat('tellraw @a {"text":"', text), '","color":"aqua"}')),
}