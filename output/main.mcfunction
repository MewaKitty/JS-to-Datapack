data modify storage test:temp-0.745014361993087 value set value []
data modify storage test:temp-0.745014361993087 type set value array
data modify storage test:temp-0.745014361993087 value append value {type: "string", value: "pig"}
data modify storage test:temp-0.745014361993087 value append value {type: "string", value: "cow"}
data modify storage test:animals value set from storage test:temp-0.745014361993087 value
data modify storage test:animals type set from storage test:temp-0.745014361993087 type
data modify storage test:animals function set from storage test:temp-0.745014361993087 function
data modify storage test:i value set value 0
data modify storage test:i type set value "number"
data modify storage test:temp-0.6506184715941176 value set from storage test:i value
data modify storage test:temp-0.6506184715941176 type set from storage test:i type
data modify storage test:temp-0.8376330634639548 value set value "3"
data modify storage test:temp-0.8376330634639548 type set value number
data modify storage test:temp-0.8745636134139883 namespace set value "test"
data modify storage test:temp-0.8745636134139883 result set value "test:temp-0.9266688507973521"
data modify storage test:temp-0.8745636134139883 left set from storage test:temp-0.6506184715941176 value
data modify storage test:temp-0.8745636134139883 right set from storage test:temp-0.8376330634639548 value
data modify storage test:temp-0.8745636134139883 operator set value "<"
function test:numbercompare with storage test:temp-0.8745636134139883
data modify storage test:temp-result result set value 0
execute store result storage test:temp-result result int 1 if data storage test:temp-0.9266688507973521 {value:true} run function test:block0.3727274047763637
execute store result storage test:temp-result result int 1 if data storage test:temp-0.9266688507973521 {type:"number"} unless data storage test:temp-0.9266688507973521 {value:0} run function test:block0.3727274047763637
execute store result storage test:temp-result result int 1 if data storage test:temp-0.9266688507973521 {type:"string"} unless data storage test:temp-0.9266688507973521 {value:""} run function test:block0.3727274047763637
execute if data storage test:temp-result {result:-2000000000} run return -2000000000