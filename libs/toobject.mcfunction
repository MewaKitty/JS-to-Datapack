$data modify storage $(namespace):temp object set value "$(object)"
$data modify storage $(namespace):temp property set value "$(property)"
$data modify storage $(namespace):temp result set value "$(result)"
$data modify storage $(namespace):temp namespace set value "$(namespace)"
$execute if data storage $(object) {type:"string"} run data modify storage $(namespace):temp class set from storage $(namespace):global string.String.value
$function $(namespace):toobjectgetprototype with storage $(namespace):temp