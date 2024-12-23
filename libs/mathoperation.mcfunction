$data modify storage $(namespace):temp left set from storage $(left) value
$data modify storage $(namespace):temp right set from storage $(right) value
$data modify storage $(namespace):temp storage set value "$(left)"
$data modify storage $(namespace):temp operation set value "$(operation)"
$execute if data storage $(left) {type:"number"} run return run function $(namespace):mathoperationinternal with storage $(namespace):temp