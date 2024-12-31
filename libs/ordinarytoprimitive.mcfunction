$data modify storage $(namespace):temp-primitive object set from storage $(object) value
$data modify storage $(namespace):temp-primitive property set value "toString"
$data modify storage $(namespace):temp-primitive result set value "$(namespace):temp-tostring"
$data modify storage $(namespace):temp-primitive namespace set value "$(namespace)"
$function $(namespace):getmemberinternal with storage $(namespace):temp-primitive

$data modify storage $(namespace):temp-primitive object set from storage $(object) value
$data modify storage $(namespace):temp-primitive property set value "valueOf"
$data modify storage $(namespace):temp-primitive result set value "$(namespace):temp-valueof"
$data modify storage $(namespace):temp-primitive namespace set value "$(namespace)"
$function $(namespace):getmemberinternal with storage $(namespace):temp-primitive
        
$data modify storage $(namespace):params __this set value "$(object)"
$data modify storage $(namespace):params __this set from storage $(object) value
$data modify storage $(namespace):params __return set value "$(namespace):temp-result"

$data modify storage $(namespace):temp-primitive storage set value "$(namespace):params"

$execute if data storage $(namespace):temp-hint {value:"STRING"} run data modify storage $(namespace):temp-primitive function set from storage $(namespace):temp-tostring function
$execute if data storage $(namespace):temp-hint {value:"STRING"} if data storage $(namespace):temp-tostring {type:"function"} run function $(namespace):call with storage $(namespace):temp-primitive
$execute if data storage $(namespace):temp-hint {value:"STRING"} unless data storage $(namespace):temp-result {type:"object"} run return 1

$data modify storage $(namespace):temp-primitive function set from storage $(namespace):temp-valueof function
$execute if data storage $(namespace):temp-tostring {type:"function"} run function $(namespace):call with storage $(namespace):temp-primitive
$execute unless data storage $(namespace):temp-result {type:"object"} run return 1

$execute unless data storage $(namespace):temp-hint {value:"STRING"} run data modify storage $(namespace):temp-primitive function set from storage $(namespace):temp-tostring function
$execute unless data storage $(namespace):temp-hint {value:"STRING"} if data storage $(namespace):temp-tostring {type:"function"} run function $(namespace):call with storage $(namespace):temp-primitive
$execute unless data storage $(namespace):temp-hint {value:"STRING"} unless data storage $(namespace):temp-result {type:"object"} run return 1

say TypeError: can't convert object to primitive type
return fail