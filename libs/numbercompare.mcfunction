scoreboard objectives add temp dummy
$scoreboard players set left temp $(left)
$scoreboard players set right temp $(right)
$data modify storage $(result) type set value "boolean"
$execute if score left temp $(operator) right temp run data modify storage $(result) value set value true
$execute unless score left temp $(operator) right temp run data modify storage $(result) value set value false
scoreboard objectives remove temp