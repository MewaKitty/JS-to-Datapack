scoreboard objectives add temp dummy
$execute store result score value temp run data get storage $(storage) value
$scoreboard players $(operation) value temp $(right)
$execute store result storage $(storage) value int 1 run scoreboard players get value temp
scoreboard objectives remove temp