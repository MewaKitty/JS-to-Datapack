$data modify storage $(namespace):temp storage set value "$(storage)"
$data modify storage $(namespace):temp left set from storage $(storage) value
$data modify storage $(namespace):temp right set value "$(right)"
$data modify storage $(namespace):temp prefix set value "$(prefix)"
$function $(namespace):concat with storage $(namespace):temp