data modify storage test:scope-0.957448816041974 scopes set value ["scope-0.7934915055461373", "scope-0.957448816041974"]
data modify storage test:temp-0.5527798379465023 namespace set value "test"
data modify storage test:temp-0.5527798379465023 storage set value "test:scope-0.957448816041974"
data modify storage test:temp-0.5527798379465023 index set value "-2"
data modify storage test:temp-0.5527798379465023 blockScope set value "scope-0.957448816041974"
data modify storage test:temp-0.5527798379465023 name set value "theTest"
data modify storage test:temp-0.5527798379465023 result set value "test:temp-0.7668543704416918"
function test:getvariable with storage test:temp-0.5527798379465023
data modify storage test:temp-0.010855968794590498 property set value "hasRan"
data modify storage test:temp-0.010855968794590498 object set value "test:temp-0.7668543704416918"
data modify storage test:temp-0.010855968794590498 result set value "test:temp-0.19403939070054899"
data modify storage test:temp-0.010855968794590498 namespace set value "test"
function test:getmember with storage test:temp-0.010855968794590498
data modify storage test:temp-0.7241544812761534 function set from storage test:temp-0.19403939070054899 function
data modify storage test:temp-0.7241544812761534 namespace set value "test"
data modify storage test:temp-0.7241544812761534 storage set value "test:params"
data modify storage test:params __this set value "test:temp-0.7668543704416918"
data modify storage test:params __this_obj set from storage test:temp-0.7668543704416918 value
data modify storage test:params __return set value "test:temp-0.33090163334468126"
function test:call with storage test:temp-0.7241544812761534