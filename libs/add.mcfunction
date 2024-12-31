$data modify storage $(namespace):temp left set from storage $(left) value
$data modify storage $(namespace):temp right set from storage $(right) value
$data modify storage $(namespace):temp storage set value "$(left)"
$data modify storage $(namespace):temp operation set value "add"
$data modify storage $(namespace):temp prefix set value ""
$execute if data storage $(left) {type:"string"} run function $(namespace):tostring {namespace:"$(namespace)",argument:"$(right)",result:"$(namespace):temp-right"}
$execute if data storage $(left) {type:"string"} run data modify storage $(namespace):temp right set from storage $(namespace):temp-right value
$execute if data storage $(left) {type:"string"} run return run function $(namespace):concat with storage $(namespace):temp
$execute if data storage $(right) {type:"string"} run function $(namespace):tostring {namespace:"$(namespace)",argument:"$(left)",result:"$(namespace):temp-left"}
$execute if data storage $(right) {type:"string"} run data modify storage $(namespace):temp left set from storage $(namespace):temp-left value
$execute if data storage $(right) {type:"string"} run return run function $(namespace):concat with storage $(namespace):temp
$execute if data storage $(left) {type:"number"} run return run function $(namespace):addnumbervariable with storage $(namespace):temp