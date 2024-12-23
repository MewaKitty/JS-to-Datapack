$data modify storage test:a value set value $(a)
data modify storage test:a type set value "string"
$data modify storage test:b value set value $(b)
data modify storage test:b type set value "string"
data modify storage test:temp-0.2718141695092712 variable set value "test:temp-0.9192316805386428"
data modify storage test:temp-0.2718141695092712 value set from storage test:a value
function test:tonumber with storage test:temp-0.2718141695092712
data modify storage test:temp-0.13481116010657712 variable set value "test:temp-0.07933848210796501"
data modify storage test:temp-0.13481116010657712 value set from storage test:b value
function test:tonumber with storage test:temp-0.13481116010657712
data modify storage test:temp-0.8064060868518566 value set from storage test:temp-0.9192316805386428 value
data modify storage test:temp-0.8064060868518566 type set from storage test:temp-0.9192316805386428 type
function test:mathoperation {namespace:"test",left:"test:temp-0.8064060868518566",right:"test:temp-0.07933848210796501",operation:"*="}
data modify storage test:temp-0.28524948280325046 value set value "say "
data modify storage test:temp-0.28524948280325046 type set value string
function test:add {namespace:"test",left:"test:temp-0.28524948280325046",right:"test:temp-0.8064060868518566"}
function test:run with storage test:temp-0.28524948280325046