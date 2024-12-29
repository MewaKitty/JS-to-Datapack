$execute store success storage $(namespace):temp-array success int 1 run data get storage $(storage) promise.listeners[$(index)]
$execute if data storage $(namespace):temp-array {success:0} run return 0
$data modify storage $(namespace):temp namespace set value "$(namespace)"
$data modify storage $(namespace):temp function set from storage $(storage) promise.listeners[$(index)]
$data modify storage $(namespace):params 0 set value "$(data)"
$data modify storage $(namespace):temp storage set value "$(namespace):params"
$function $(namespace):call with storage $(namespace):temp
scoreboard objectives add temp dummy
$scoreboard players set value temp $(index)
scoreboard players add value temp 1
$execute store result storage $(namespace):temp index int 1 run scoreboard players get value temp
scoreboard objectives remove temp
$data modify storage $(namespace):temp namespace set value "$(namespace)"
$data modify storage $(namespace):temp storage set value "$(storage)"
$data modify storage $(namespace):temp data set value "$(data)"
$function $(namespace):resolvepromise with storage $(namespace):temp