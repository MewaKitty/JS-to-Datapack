$execute if data storage $(object) {type:"array"} run function $(namespace):getmemberarray {object:"$(object)",result:"$(result)",property:"$(property)"}
$execute if data storage $(object) {type:"object"} run data modify storage $(result) value set from storage $(object) string.$(property).value
$execute if data storage $(object) {type:"object"} run data modify storage $(result) type set from storage $(object) string.$(property).type
$execute if data storage $(object) {type:"object"} run data modify storage $(result) function set from storage $(object) string.$(property).function
$execute store success storage $(namespace):temp-member success int 1 run data get storage $(object) string.$(property).value
$execute store success storage $(namespace):temp-prototype success int 1 run data get storage $(object) prototype
$execute if data storage $(namespace):temp-member {success:0} if data storage $(namespace):temp-prototype {success:0} run data modify storage $(result) type set value "undefined"
$execute if data storage $(namespace):temp-member {success:0} if data storage $(namespace):temp-prototype {success:0} run data modify storage $(result) value set value "undefined"
$execute if data storage $(namespace):temp-member {success:0} if data storage $(namespace):temp-prototype {success:0} run return fail
$execute if data storage $(namespace):temp-member {success:0} run data modify storage $(namespace):temp namespace set value "$(namespace)"
$execute if data storage $(namespace):temp-member {success:0} run data modify storage $(namespace):temp result set value "$(result)"
$execute if data storage $(namespace):temp-member {success:0} run data modify storage $(namespace):temp property set value "$(property)"
$execute if data storage $(namespace):temp-member {success:0} run data modify storage $(namespace):temp prototype set from storage $(object) prototype
$execute if data storage $(namespace):temp-member {success:0} run function $(namespace):prototypemember with storage $(namespace):temp