$execute if data storage $(argument) {type:"string"} run data modify storage $(result) type set from storage $(argument) type
$execute if data storage $(argument) {type:"string"} run return run data modify storage $(result) value set from storage $(argument) value
$execute if data storage $(argument) {type:"symbol"} run say TypeError: can't convert symbol to string
$execute if data storage $(argument) {type:"symbol"} run return fail
$execute if data storage $(argument) {type:"undefined"} run data modify storage $(result) type set value "string"
$execute if data storage $(argument) {type:"undefined"} run return run data modify storage $(result) value set value "undefined"
$execute if data storage $(argument) {type:"object",value:"null"} run data modify storage $(result) type set value "string"
$execute if data storage $(argument) {type:"object",value:"null"} run return run data modify storage $(result) value set value "null"
$execute if data storage $(argument) {type:"boolean",value:true} run data modify storage $(result) type set value "true"
$execute if data storage $(argument) {type:"boolean",value:false} run return run data modify storage $(result) value set value "false"
$execute if data storage $(argument) {type:"number"} run data modify storage $(namespace):test storage set value "$(result)"
$execute if data storage $(argument) {type:"number"} run data modify storage $(namespace):test left set from storage $(argument) value
$execute if data storage $(argument) {type:"number"} run data modify storage $(namespace):test right set value ""
$data modify storage $(namespace):temp-hint value set value "STRING"
$function $(namespace):toprimitive {namespace:"$(namespace)",object:"$(argument)"}
$function $(namespace):tostring {namespace:"$(namespace)",argument:"$(namespace):temp-result",result:"$(result)"}