$execute if data storage $(storage) {type:"array"} store success storage $(namespace):temp success int 1 run function $(namespace):checkifnumber {value:"$(property)"}
$execute if data storage $(storage) {type:"array"} if data storage $(namespace):temp {success:1} run return run function $(namespace):setmemberarray {storage:"$(storage)",value:"$(value)",type:"$(type)",function:"$(function)",property:"$(property)"}
$data modify storage $(storage) string.$(property).value set value "$(value)"
$data modify storage $(storage) string.$(property).type set value "$(type)"
$data modify storage $(storage) string.$(property).function set value "$(function)"