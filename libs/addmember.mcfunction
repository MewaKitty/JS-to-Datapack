$data modify storage $(namespace):temp left set from storage $(left) $(prefix)value
$data modify storage $(namespace):temp right set from storage $(right) value
$data modify storage $(namespace):temp storage set value "$(left)"
$data modify storage $(namespace):temp operation set value "add"
$data modify storage $(namespace):temp prefix set value "$(prefix)"
$execute if data storage $(left) {string:{$(key):{type:"string"}}} run return run function $(namespace):concat with storage $(namespace):temp
$execute if data storage $(right) {type:"string"} run return run function $(namespace):concat with storage $(namespace):temp
$execute if data storage $(left) {string:{$(key):{type:"number"}}} run return run function $(namespace):addnumbervariable with storage $(namespace):temp