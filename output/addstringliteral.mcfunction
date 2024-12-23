$data modify storage $(namespace):temp storage set value "$(storage)"
$data modify storage $(namespace):temp left set from storage $(storage) value
$data modify storage $(namespace):temp right set value "$(right)"
$function $(namespace):concat with storage $(namespace):temp