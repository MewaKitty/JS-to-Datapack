$data modify storage $(namespace):temp object set from storage $(object) value
$data modify storage $(namespace):temp property set value "$(property)"
$data modify storage $(namespace):temp result set value "$(result)"
$data modify storage $(namespace):temp namespace set value "$(namespace)"
$execute if data storage $(object) {type:"object"} run return run function $(namespace):getmemberinternal with storage $(namespace):temp
$function $(namespace):toobject {object:"$(object)",property:"$(property)",result:"$(result)",namespace:"$(namespace)"}
$data modify storage $(namespace):temp object set value "$(namespace):temp-obj"
$function $(namespace):getmemberinternal with storage $(namespace):temp