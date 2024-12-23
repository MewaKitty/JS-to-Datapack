$data modify storage test:a value set value $(a)
data modify storage test:a type set value "string"
$data modify storage test:b value set value $(b)
data modify storage test:b type set value "string"
data modify storage test:temp-0.6847973645358411 value set from storage test:a value
data modify storage test:temp-0.6847973645358411 type set from storage test:a type
data modify storage test:temp-0.9808844286280989 namespace set value "test"
data modify storage test:temp-0.9808844286280989 result set value "test:temp-0.9876625708454111"
data modify storage test:temp-0.9808844286280989 left set from storage test:temp-0.6847973645358411 value
data modify storage test:temp-0.9808844286280989 right set from storage test:b value
data modify storage test:temp-0.9808844286280989 operator set value ">"
function test:numbercompare with storage test:temp-0.9808844286280989
data modify storage test:bool value set from storage test:temp-0.9876625708454111 value
data modify storage test:bool type set from storage test:temp-0.9876625708454111 type
execute if data storage test:bool {value:true} run function test:block0.9766656872144498
execute if data storage test:bool {type:"number"} unless data storage test:bool {value:0} run function test:block0.9766656872144498
execute if data storage test:bool {type:"string"} unless data storage test:bool {value:""} run function test:block0.9766656872144498
execute if data storage test:bool {value:false} run function test:block0.15167450978621255
execute if data storage test:bool {value:0} run function test:block0.15167450978621255
execute if data storage test:bool {value:""} run function test:block0.15167450978621255