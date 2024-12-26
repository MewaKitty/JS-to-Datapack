$data modify storage $(namespace):temp object set from storage $(object) value
$data modify storage $(namespace):temp property set value "$(property)"
$data modify storage $(namespace):temp result set value "$(result)"
$data modify storage $(namespace):temp namespace set value "$(namespace)"
$function $(namespace):getmemberinternal with storage $(namespace):temp