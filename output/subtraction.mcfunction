$data modify storage test:a value set value $(a)
data modify storage test:a type set value "string"
$data modify storage test:b value set value $(b)
data modify storage test:b type set value "string"
data modify storage test:temp-0.250422494045358 variable set value "test:temp-0.4596758457691823"
data modify storage test:temp-0.250422494045358 value set from storage test:a value
function test:tonumber with storage test:temp-0.250422494045358
data modify storage test:temp-0.32773149734374996 variable set value "test:temp-0.5369354766011688"
data modify storage test:temp-0.32773149734374996 value set from storage test:b value
function test:tonumber with storage test:temp-0.32773149734374996
data modify storage test:temp-0.14460520114840636 value set from storage test:temp-0.4596758457691823 value
data modify storage test:temp-0.14460520114840636 type set from storage test:temp-0.4596758457691823 type
function test:subtract {namespace:"test",left:"test:temp-0.14460520114840636",right:"test:temp-0.5369354766011688"}
data modify storage test:temp-0.31740379628281945 value set value "say "
data modify storage test:temp-0.31740379628281945 type set value string
function test:add {namespace:"test",left:"test:temp-0.31740379628281945",right:"test:temp-0.14460520114840636"}
function test:run with storage test:temp-0.31740379628281945