data modify storage test:i value set value 0
data modify storage test:i type set value "number"
data modify storage test:temp-0.7810452011899266 value set from storage test:i value
data modify storage test:temp-0.7810452011899266 type set from storage test:i type
data modify storage test:temp-0.5060194092964116 value set value "5"
data modify storage test:temp-0.5060194092964116 type set value number
data modify storage test:temp-0.7502627566085297 namespace set value "test"
data modify storage test:temp-0.7502627566085297 result set value "test:temp-0.20824620378216874"
data modify storage test:temp-0.7502627566085297 left set from storage test:temp-0.7810452011899266 value
data modify storage test:temp-0.7502627566085297 right set from storage test:temp-0.5060194092964116 value
data modify storage test:temp-0.7502627566085297 operator set value "<"
function test:numbercompare with storage test:temp-0.7502627566085297
execute if data storage test:temp-0.20824620378216874 {value:true} run function test:block0.6859951332096232
execute if data storage test:temp-0.20824620378216874 {type:"number"} unless data storage test:temp-0.20824620378216874 {value:0} run function test:block0.6859951332096232
execute if data storage test:temp-0.20824620378216874 {type:"string"} unless data storage test:temp-0.20824620378216874 {value:""} run function test:block0.6859951332096232