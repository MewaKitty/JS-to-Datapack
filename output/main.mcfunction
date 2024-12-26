data modify storage test:temp-0.6317760803325986 value set value "test:temp-0.723296673292268"
data modify storage test:temp-0.6317760803325986 type set value function
data modify storage test:temp-0.6317760803325986 function set value arrow0.1847593738783334
data modify storage test:temp-0.723296673292268 type set value "object"
data modify storage test:basetest value set from storage test:temp-0.6317760803325986 value
data modify storage test:basetest type set from storage test:temp-0.6317760803325986 type
data modify storage test:basetest function set from storage test:temp-0.6317760803325986 function
data modify storage test:temp-0.723296673292268 string.prototype.value set value "test:obj-0.6654946570235479"
data modify storage test:temp-0.723296673292268 string.prototype.type set value "object"
data modify storage test:obj-0.6654946570235479 type set value "object"
data modify storage test:temp-0.8524494160996008 value set value "test:temp-0.729898247851174"
data modify storage test:temp-0.8524494160996008 type set value function
data modify storage test:temp-0.8524494160996008 function set value arrow0.15047083830134766
data modify storage test:temp-0.729898247851174 type set value "object"
data modify storage test:obj-0.6654946570235479 string.base.value set from storage test:temp-0.8524494160996008 value
data modify storage test:obj-0.6654946570235479 string.base.type set from storage test:temp-0.8524494160996008 type
data modify storage test:obj-0.6654946570235479 string.base.function set from storage test:temp-0.8524494160996008 function
data modify storage test:temp-0.03784030988245346 value set value "test:temp-0.662029326904342"
data modify storage test:temp-0.03784030988245346 type set value function
data modify storage test:temp-0.03784030988245346 function set value arrow0.5215242508042113
data modify storage test:temp-0.662029326904342 type set value "object"
data modify storage test:obj-0.6654946570235479 string.look.value set from storage test:temp-0.03784030988245346 value
data modify storage test:obj-0.6654946570235479 string.look.type set from storage test:temp-0.03784030988245346 type
data modify storage test:obj-0.6654946570235479 string.look.function set from storage test:temp-0.03784030988245346 function
data modify storage test:temp-0.19658168648855756 value set value "test:temp-0.2508287955580484"
data modify storage test:temp-0.19658168648855756 type set value function
data modify storage test:temp-0.19658168648855756 function set value arrow0.006154245396149061
data modify storage test:temp-0.2508287955580484 type set value "object"
data modify storage test:test value set from storage test:temp-0.19658168648855756 value
data modify storage test:test type set from storage test:temp-0.19658168648855756 type
data modify storage test:test function set from storage test:temp-0.19658168648855756 function
data modify storage test:temp-0.2508287955580484 string.prototype.value set value "test:obj-0.49549375581368515"
data modify storage test:temp-0.2508287955580484 string.prototype.type set value "object"
data modify storage test:obj-0.49549375581368515 type set value "object"
data modify storage test:obj-0.49549375581368515 prototype set from storage test:basetest value
data modify storage test:temp-0.3244501776235482 value set value "test:temp-0.8347698617546107"
data modify storage test:temp-0.3244501776235482 type set value function
data modify storage test:temp-0.3244501776235482 function set value arrow0.47155960847612155
data modify storage test:temp-0.8347698617546107 type set value "object"
data modify storage test:obj-0.49549375581368515 string.look.value set from storage test:temp-0.3244501776235482 value
data modify storage test:obj-0.49549375581368515 string.look.type set from storage test:temp-0.3244501776235482 type
data modify storage test:obj-0.49549375581368515 string.look.function set from storage test:temp-0.3244501776235482 function
data modify storage test:temp-0.9191676411644151 value set value "test:temp-0.5770967528418237"
data modify storage test:temp-0.9191676411644151 type set value function
data modify storage test:temp-0.9191676411644151 function set value arrow0.8428783359032426
data modify storage test:temp-0.5770967528418237 type set value "object"
data modify storage test:obj-0.49549375581368515 string.run.value set from storage test:temp-0.9191676411644151 value
data modify storage test:obj-0.49549375581368515 string.run.type set from storage test:temp-0.9191676411644151 type
data modify storage test:obj-0.49549375581368515 string.run.function set from storage test:temp-0.9191676411644151 function
data modify storage test:temp-0.9062728510377698 function set from storage test:test function
data modify storage test:temp-0.9062728510377698 namespace set value "test"
data modify storage test:temp-0.9062728510377698 storage set value "test:params"
data modify storage test:temp-0.19257922877780542 type set value "object"
data modify storage test:temp-0.19257922877780542 value set value "test:obj-0.953823375207403"
data modify storage test:obj-0.953823375207403 type set value "object"
data modify storage test:params __this set value "test:temp-0.19257922877780542"
data modify storage test:params __this_obj set from storage test:temp-0.19257922877780542 value
function test:call with storage test:temp-0.9062728510377698
data modify storage test:thetest value set from storage test:temp-0.19257922877780542 value
data modify storage test:thetest type set from storage test:temp-0.19257922877780542 type
data modify storage test:thetest function set from storage test:temp-0.19257922877780542 function
data modify storage test:temp-0.7302384864203539 property set value "a"
data modify storage test:temp-0.7302384864203539 object set value "test:thetest"
data modify storage test:temp-0.7302384864203539 result set value "test:temp-0.538321485211173"
data modify storage test:temp-0.7302384864203539 namespace set value "test"
function test:getmember with storage test:temp-0.7302384864203539
data modify storage test:temp-0.07223994915402321 value set value "say "
data modify storage test:temp-0.07223994915402321 type set value string
function test:add {namespace:"test",left:"test:temp-0.07223994915402321",right:"test:temp-0.538321485211173",prefix:""}
function test:run with storage test:temp-0.07223994915402321
data modify storage test:temp-0.301172295786285 property set value "run"
data modify storage test:temp-0.301172295786285 object set value "test:thetest"
data modify storage test:temp-0.301172295786285 result set value "test:temp-0.6629644024265167"
data modify storage test:temp-0.301172295786285 namespace set value "test"
function test:getmember with storage test:temp-0.301172295786285
data modify storage test:temp-0.939977423656463 function set from storage test:temp-0.6629644024265167 function
data modify storage test:temp-0.939977423656463 namespace set value "test"
data modify storage test:temp-0.939977423656463 storage set value "test:params"
data modify storage test:params __this set value "test:thetest"
data modify storage test:params __this_obj set from storage test:thetest value
function test:call with storage test:temp-0.939977423656463
data modify storage test:temp-0.8889545617151113 property set value "base"
data modify storage test:temp-0.8889545617151113 object set value "test:thetest"
data modify storage test:temp-0.8889545617151113 result set value "test:temp-0.6489673982713098"
data modify storage test:temp-0.8889545617151113 namespace set value "test"
function test:getmember with storage test:temp-0.8889545617151113
data modify storage test:temp-0.22003667666585358 function set from storage test:temp-0.6489673982713098 function
data modify storage test:temp-0.22003667666585358 namespace set value "test"
data modify storage test:temp-0.22003667666585358 storage set value "test:params"
data modify storage test:params __this set value "test:thetest"
data modify storage test:params __this_obj set from storage test:thetest value
function test:call with storage test:temp-0.22003667666585358