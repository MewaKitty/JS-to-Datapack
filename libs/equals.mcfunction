$data modify storage $(result) type set value "boolean"
$execute unless data storage $(left) {type:"string"} run return run function $(namespace):equalnonstring {left:"$(left)",value:"$(value)", type:"$(type)", result:"$(result)", ifequal:"$(ifequal)", ifunequal:"$(ifunequal)"}
$execute if data storage $(left) {value:"$(value)",type:"$(type)"} run data modify storage $(result) value set value $(ifequal)
$execute unless data storage $(left) {value:"$(value)",type:"$(type)"} run data modify storage $(result) value set value $(ifunequal)