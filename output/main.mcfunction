data modify storage test:temp-0.656308079911799 type set value "object"
data modify storage test:temp-0.9909052803291727 value set value {}
data modify storage test:temp-0.9909052803291727 type set value function
data modify storage test:temp-0.9909052803291727 function set value arrow0.5638248574823691
data modify storage test:temp-0.656308079911799 value.foo.value set from storage test:temp-0.9909052803291727 value
data modify storage test:temp-0.656308079911799 value.foo.type set from storage test:temp-0.9909052803291727 type
data modify storage test:temp-0.656308079911799 value.foo.function set from storage test:temp-0.9909052803291727 function
data modify storage test:obj value set from storage test:temp-0.656308079911799 value
data modify storage test:obj type set from storage test:temp-0.656308079911799 type
data modify storage test:obj function set from storage test:temp-0.656308079911799 function
data modify storage test:temp-0.6947667757119066 value set from storage test:obj value.foo.value
data modify storage test:temp-0.6947667757119066 type set from storage test:obj value.foo.type
data modify storage test:temp-0.6947667757119066 function set from storage test:obj value.foo.function
data modify storage test:temp-0.35018877014598404 function set from storage test:temp-0.6947667757119066 function
data modify storage test:temp-0.35018877014598404 namespace set value "test"
data modify storage test:temp-0.35018877014598404 storage set value "test:params"
function test:call with storage test:temp-0.35018877014598404