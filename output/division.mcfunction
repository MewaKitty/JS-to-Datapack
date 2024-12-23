$data modify storage test:a value set value $(a)
data modify storage test:a type set value "string"
$data modify storage test:b value set value $(b)
data modify storage test:b type set value "string"
data modify storage test:temp-0.6685404529150686 variable set value "test:temp-0.37165277522853635"
data modify storage test:temp-0.6685404529150686 value set from storage test:a value
function test:tonumber with storage test:temp-0.6685404529150686
data modify storage test:temp-0.4168641168338004 variable set value "test:temp-0.14373994889433028"
data modify storage test:temp-0.4168641168338004 value set from storage test:b value
function test:tonumber with storage test:temp-0.4168641168338004
data modify storage test:temp-0.13883204839858387 value set from storage test:temp-0.37165277522853635 value
data modify storage test:temp-0.13883204839858387 type set from storage test:temp-0.37165277522853635 type
function test:mathoperation {namespace:"test",left:"test:temp-0.13883204839858387",right:"test:temp-0.14373994889433028",operation:"/="}
data modify storage test:temp-0.8679163341074545 value set value "say "
data modify storage test:temp-0.8679163341074545 type set value string
function test:add {namespace:"test",left:"test:temp-0.8679163341074545",right:"test:temp-0.13883204839858387"}
function test:run with storage test:temp-0.8679163341074545