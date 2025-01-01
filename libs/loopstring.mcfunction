$data modify storage $(namespace):temp data.value set value ""
$data modify storage $(namespace):temp data.type set value "string"
$data modify storage $(namespace):temp data.function set value ""
$execute store success storage $(namespace):temp-string success int 1 run data modify storage $(namespace):temp data.value set string storage $(storage) value $(index) $(next)
$execute if data storage $(namespace):temp-string {success:0} run return 0
$function $(function) with storage $(namespace):temp
scoreboard objectives add temp dummy
$scoreboard players set index temp $(index)
$scoreboard players set next temp $(next)
scoreboard players add index temp 1
scoreboard players add next temp 1
$execute store result storage $(namespace):temp index int 1 run scoreboard players get index temp
$execute store result storage $(namespace):temp next int 1 run scoreboard players get next temp
scoreboard objectives remove temp
$data modify storage $(namespace):temp namespace set value "$(namespace)"
$data modify storage $(namespace):temp storage set value "$(storage)"
$data modify storage $(namespace):temp function set value "$(function)"
$function $(namespace):loopstring with storage $(namespace):temp