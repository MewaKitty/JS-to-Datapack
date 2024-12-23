$data modify storage test:weather value set value $(weather)
data modify storage test:weather type set value "string"
data modify storage test:temp-0.9083408359234328 type set value "object"
data modify storage test:temp-0.9083408359234328 value.r.value set value "rain"
data modify storage test:temp-0.9083408359234328 value.r.type set value string
data modify storage test:temp-0.9083408359234328 value.c.value set value "clear"
data modify storage test:temp-0.9083408359234328 value.c.type set value string
data modify storage test:map value set from storage test:temp-0.9083408359234328 value
data modify storage test:map type set from storage test:temp-0.9083408359234328 type
data modify storage test:temp-0.1585096373236995 property set from storage test:weather value
data modify storage test:temp-0.1585096373236995 object set value "test:map"
data modify storage test:temp-0.1585096373236995 result set value "test:temp-0.02198725222987763"
function test:computedmember with storage test:temp-0.1585096373236995
data modify storage test:temp-0.5733197819603273 value set value "weather "
data modify storage test:temp-0.5733197819603273 type set value string
function test:add {namespace:"test",left:"test:temp-0.5733197819603273",right:"test:temp-0.02198725222987763"}
function test:run with storage test:temp-0.5733197819603273