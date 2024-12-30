$data modify storage $(namespace):temp-obj-var type set value "object"
$data modify storage $(namespace):temp-obj-var value set value "$(namespace):temp-obj"
$data modify storage $(namespace):temp-obj type set value "object"
$data modify storage $(namespace):temp-obj prototype set from storage $(class) string.prototype.value
$data modify storage $(namespace):temp-obj string._value.type set from storage $(object) type
$data modify storage $(namespace):temp-obj string._value.value set from storage $(object) value