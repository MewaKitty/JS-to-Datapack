scoreboard objectives add temp dummy
$execute store result score left temp run data get storage $(storage) value
$scoreboard players set right temp $(right)
$scoreboard players operation left temp $(operation) right temp
$execute store result storage $(storage) value int 1 run scoreboard players get left temp
scoreboard objectives remove temp