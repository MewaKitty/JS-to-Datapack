$execute store success storage $(namespace):temp success int 1 run data get storage $(namespace):$(blockScope) variables.$(name)
$execute if data storage $(namespace):temp {success:1} run data modify storage $(namespace):$(blockScope) variables.$(name).type set from storage $(result) type
$execute if data storage $(namespace):temp {success:1} run data modify storage $(namespace):$(blockScope) variables.$(name).value set from storage $(result) value
$execute if data storage $(namespace):temp {success:1} run data modify storage $(namespace):$(blockScope) variables.$(name).function set from storage $(result) function
$execute if data storage $(namespace):temp {success:1} run return 1

$execute store success storage $(namespace):temp success int 1 run data get storage $(storage) scopes[$(index)]
$execute if data storage $(namespace):temp {success:0} run say ReferenceError: $(name) is not defined
$execute if data storage $(namespace):temp {success:0} run return 0

scoreboard objectives add temp dummy
$scoreboard players set value temp $(index)
scoreboard players remove value temp 1
$execute store result storage $(namespace):temp index int 1 run scoreboard players get value temp
scoreboard objectives remove temp

$data modify storage $(namespace):temp namespace set value "$(namespace)"
$data modify storage $(namespace):temp storage set value "$(storage)"
$data modify storage $(namespace):temp name set value "$(name)"
$data modify storage $(namespace):temp blockScope set from storage $(storage) scopes[$(index)]
$data modify storage $(namespace):temp result set value "$(result)"
$function $(namespace):setvariable with storage $(namespace):temp