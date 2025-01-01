$data modify storage $(namespace):temp-member namespace set value "$(namespace)"
$data modify storage $(namespace):temp-member result set value "$(result)"
$data modify storage $(namespace):temp-member property set value "$(property)"
$data modify storage $(namespace):temp-member object set from storage $(prototype) string.prototype.value

$data modify storage $(namespace):temp-member success set value 1

$execute store success storage $(namespace):temp-member success int 1 run data get storage $(prototype) string.prototype.value
$execute if data storage $(namespace):temp-member {success:0} run say $(property) was not found, couldn't find prototype on $(prototype)
$execute if data storage $(namespace):temp-member {success:0} run return 0

$function $(namespace):getmemberinternal with storage $(namespace):temp-member