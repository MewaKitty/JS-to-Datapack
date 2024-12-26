scoreboard objectives add temp dummy
$scoreboard players set value temp $(left)
$scoreboard players $(operation) value temp $(right)
$execute store result storage $(storage) $(prefix)value int 1 run scoreboard players get value temp
scoreboard objectives remove temp