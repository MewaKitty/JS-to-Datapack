$data modify storage test:a value set value $(a)
data modify storage test:a type set value "string"
$data modify storage test:b value set value $(b)
data modify storage test:b type set value "string"
data modify storage test:temp-0.9537838256922904 variable set value "test:temp-0.11068223142812394"
data modify storage test:temp-0.9537838256922904 value set from storage test:a value
function test:tonumber with storage test:temp-0.9537838256922904
data modify storage test:temp-0.7004533843522857 variable set value "test:temp-0.3617012219820551"
data modify storage test:temp-0.7004533843522857 value set from storage test:b value
function test:tonumber with storage test:temp-0.7004533843522857
data modify storage test:temp-0.9014294538918872 value set from storage test:temp-0.11068223142812394 value
data modify storage test:temp-0.9014294538918872 type set from storage test:temp-0.11068223142812394 type
function test:add {namespace:"test",left:"test:temp-0.9014294538918872",right:"test:temp-0.3617012219820551"}
data modify storage test:temp-0.3037529893301897 value set value "say "
data modify storage test:temp-0.3037529893301897 type set value string
function test:add {namespace:"test",left:"test:temp-0.3037529893301897",right:"test:temp-0.9014294538918872"}
function test:run with storage test:temp-0.3037529893301897