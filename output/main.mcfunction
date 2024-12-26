data modify storage test:temp-0.021857283774639247 value set value "test:temp-0.7228433682971152"
data modify storage test:temp-0.021857283774639247 type set value function
data modify storage test:temp-0.021857283774639247 function set value arrow0.9374675227263273
data modify storage test:temp-0.7228433682971152 type set value "object"
data modify storage test:test value set from storage test:temp-0.021857283774639247 value
data modify storage test:test type set from storage test:temp-0.021857283774639247 type
data modify storage test:test function set from storage test:temp-0.021857283774639247 function
data modify storage test:temp-0.7228433682971152 string.prototype.value set value "test:obj-0.19253526900967877"
data modify storage test:temp-0.7228433682971152 string.prototype.type set value "object"
data modify storage test:obj-0.19253526900967877 type set value "object"
data modify storage test:temp-0.9204352196254503 value set value "test:temp-0.9357230294857222"
data modify storage test:temp-0.9204352196254503 type set value function
data modify storage test:temp-0.9204352196254503 function set value arrow0.9840056417030348
data modify storage test:temp-0.9357230294857222 type set value "object"
data modify storage test:obj-0.19253526900967877 string.run.value set from storage test:temp-0.9204352196254503 value
data modify storage test:obj-0.19253526900967877 string.run.type set from storage test:temp-0.9204352196254503 type
data modify storage test:obj-0.19253526900967877 string.run.function set from storage test:temp-0.9204352196254503 function
data modify storage test:temp-0.7393686028089249 function set from storage test:test function
data modify storage test:temp-0.7393686028089249 namespace set value "test"
data modify storage test:temp-0.7393686028089249 storage set value "test:params"
data modify storage test:temp-0.4902477164564587 type set value "object"
data modify storage test:temp-0.4902477164564587 value set value "test:obj-0.3761474743716502"
data modify storage test:obj-0.3761474743716502 type set value "object"
data modify storage test:params __this set value "test:temp-0.4902477164564587"
data modify storage test:params __this_obj set from storage test:temp-0.4902477164564587 value
function test:call with storage test:temp-0.7393686028089249
data modify storage test:thetest value set from storage test:temp-0.4902477164564587 value
data modify storage test:thetest type set from storage test:temp-0.4902477164564587 type
data modify storage test:thetest function set from storage test:temp-0.4902477164564587 function
data modify storage test:temp-0.1257546412896784 property set value "a"
data modify storage test:temp-0.1257546412896784 object set value "test:thetest"
data modify storage test:temp-0.1257546412896784 result set value "test:temp-0.4654635106427124"
data modify storage test:temp-0.1257546412896784 namespace set value "test"
function test:getmember with storage test:temp-0.1257546412896784
data modify storage test:temp-0.727356073229231 value set value "say "
data modify storage test:temp-0.727356073229231 type set value string
function test:add {namespace:"test",left:"test:temp-0.727356073229231",right:"test:temp-0.4654635106427124",prefix:""}
function test:run with storage test:temp-0.727356073229231
data modify storage test:temp-0.3136962868060803 property set value "run"
data modify storage test:temp-0.3136962868060803 object set value "test:thetest"
data modify storage test:temp-0.3136962868060803 result set value "test:temp-0.4864270474033362"
data modify storage test:temp-0.3136962868060803 namespace set value "test"
function test:getmember with storage test:temp-0.3136962868060803
data modify storage test:temp-0.2864563926689593 function set from storage test:temp-0.4864270474033362 function
data modify storage test:temp-0.2864563926689593 namespace set value "test"
data modify storage test:temp-0.2864563926689593 storage set value "test:params"
data modify storage test:params __this set value "test:thetest"
data modify storage test:params __this_obj set from storage test:thetest value
function test:call with storage test:temp-0.2864563926689593