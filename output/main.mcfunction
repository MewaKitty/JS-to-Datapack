data modify storage test:temp-0.4298564757114288 value set from storage test:i value
data modify storage test:temp-0.4298564757114288 type set from storage test:i type
data modify storage test:temp-0.5157292100538875 value set value "5"
data modify storage test:temp-0.5157292100538875 type set value number
data modify storage test:temp-0.42118906688936175 namespace set value "test"
data modify storage test:temp-0.42118906688936175 result set value "test:temp-0.5729007101606249"
data modify storage test:temp-0.42118906688936175 left set from storage test:temp-0.4298564757114288 value
data modify storage test:temp-0.42118906688936175 right set from storage test:temp-0.5157292100538875 value
data modify storage test:temp-0.42118906688936175 operator set value "<"
function test:numbercompare with storage test:temp-0.42118906688936175
data modify storage test:i value set value 0
data modify storage test:i type set value "number"
execute if data storage test:temp-0.5729007101606249 {value:true} run function test:block0.18073369613545698
execute if data storage test:temp-0.5729007101606249 {type:"number"} unless data storage test:temp-0.5729007101606249 {value:0} run function test:block0.18073369613545698
execute if data storage test:temp-0.5729007101606249 {type:"string"} unless data storage test:temp-0.5729007101606249 {value:""} run function test:block0.18073369613545698