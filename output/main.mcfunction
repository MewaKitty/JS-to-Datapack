data modify storage test:scope-0.35231898384148486 scopes set value ["scope-0.6145783293361887", "scope-0.35231898384148486"]
data modify storage test:global type set value object
data modify storage test:global string set value {globalThis:{type:"object", value:"test:global"}}
data modify storage test:temp-0.42121470434811437 namespace set value "test"
data modify storage test:temp-0.42121470434811437 storage set value "test:scope-0.35231898384148486"
data modify storage test:temp-0.42121470434811437 index set value "-2"
data modify storage test:temp-0.42121470434811437 blockScope set value "scope-0.35231898384148486"
data modify storage test:temp-0.42121470434811437 name set value "globalThis"
data modify storage test:temp-0.42121470434811437 result set value "test:temp-0.32164543278125934"
function test:getvariable with storage test:temp-0.42121470434811437
data modify storage test:temp-0.45820970055069443 type set value "object"
data modify storage test:temp-0.45820970055069443 value set value "test:obj-0.43905365277591446"
data modify storage test:obj-0.43905365277591446 type set value "object"
data modify storage test:temp-0.7496754253639705 value set value "test:temp-0.7006709195373839"
data modify storage test:temp-0.7496754253639705 type set value function
data modify storage test:temp-0.7496754253639705 function set value arrow0.8366870495277052
data modify storage test:temp-0.7006709195373839 type set value "object"
data modify storage test:obj-0.43905365277591446 string.log.value set from storage test:temp-0.7496754253639705 value
data modify storage test:obj-0.43905365277591446 string.log.type set from storage test:temp-0.7496754253639705 type
data modify storage test:obj-0.43905365277591446 string.log.function set from storage test:temp-0.7496754253639705 function
data modify storage test:temp-0.5585564008017204 value set value "test:temp-0.16661305131644777"
data modify storage test:temp-0.5585564008017204 type set value function
data modify storage test:temp-0.5585564008017204 function set value arrow0.16438704589439124
data modify storage test:temp-0.16661305131644777 type set value "object"
data modify storage test:obj-0.43905365277591446 string.warn.value set from storage test:temp-0.5585564008017204 value
data modify storage test:obj-0.43905365277591446 string.warn.type set from storage test:temp-0.5585564008017204 type
data modify storage test:obj-0.43905365277591446 string.warn.function set from storage test:temp-0.5585564008017204 function
data modify storage test:temp-0.2952183490152944 value set value "test:temp-0.7674089270648184"
data modify storage test:temp-0.2952183490152944 type set value function
data modify storage test:temp-0.2952183490152944 function set value arrow0.7269960239975065
data modify storage test:temp-0.7674089270648184 type set value "object"
data modify storage test:obj-0.43905365277591446 string.error.value set from storage test:temp-0.2952183490152944 value
data modify storage test:obj-0.43905365277591446 string.error.type set from storage test:temp-0.2952183490152944 type
data modify storage test:obj-0.43905365277591446 string.error.function set from storage test:temp-0.2952183490152944 function
data modify storage test:temp-0.41071446913428067 value set value "test:temp-0.06476008758670182"
data modify storage test:temp-0.41071446913428067 type set value function
data modify storage test:temp-0.41071446913428067 function set value arrow0.1616990891034018
data modify storage test:temp-0.06476008758670182 type set value "object"
data modify storage test:obj-0.43905365277591446 string.info.value set from storage test:temp-0.41071446913428067 value
data modify storage test:obj-0.43905365277591446 string.info.type set from storage test:temp-0.41071446913428067 type
data modify storage test:obj-0.43905365277591446 string.info.function set from storage test:temp-0.41071446913428067 function
data modify storage test:temp-0.030694488912939577 value set value "test:temp-0.9118706572358178"
data modify storage test:temp-0.030694488912939577 type set value function
data modify storage test:temp-0.030694488912939577 function set value arrow0.08765683930567014
data modify storage test:temp-0.9118706572358178 type set value "object"
data modify storage test:obj-0.43905365277591446 string.debug.value set from storage test:temp-0.030694488912939577 value
data modify storage test:obj-0.43905365277591446 string.debug.type set from storage test:temp-0.030694488912939577 type
data modify storage test:obj-0.43905365277591446 string.debug.function set from storage test:temp-0.030694488912939577 function
data modify storage test:temp-0.3869033376278128 storage set from storage test:temp-0.32164543278125934 value
data modify storage test:temp-0.3869033376278128 property set value "console"
data modify storage test:temp-0.3869033376278128 value set from storage test:temp-0.45820970055069443 value
data modify storage test:temp-0.3869033376278128 type set from storage test:temp-0.45820970055069443 type
data modify storage test:temp-0.3869033376278128 function set from storage test:temp-0.45820970055069443 function
function test:setmember with storage test:temp-0.3869033376278128
data modify storage test:temp-0.410285330241303 value set value "test:temp-0.3138147607716334"
data modify storage test:temp-0.410285330241303 type set value function
data modify storage test:temp-0.410285330241303 function set value arrow0.602835242199538
data modify storage test:temp-0.3138147607716334 type set value "object"
data modify storage test:scope-0.35231898384148486 variables.Promise.value set from storage test:temp-0.410285330241303 value
data modify storage test:scope-0.35231898384148486 variables.Promise.type set from storage test:temp-0.410285330241303 type
data modify storage test:scope-0.35231898384148486 variables.Promise.function set from storage test:temp-0.410285330241303 function
data modify storage test:temp-0.3138147607716334 string.prototype.value set value "test:obj-0.08058840489944308"
data modify storage test:temp-0.3138147607716334 string.prototype.type set value "object"
data modify storage test:obj-0.08058840489944308 type set value "object"
data modify storage test:temp-0.7570352160853306 value set value "test:temp-0.5028739206639588"
data modify storage test:temp-0.7570352160853306 type set value function
data modify storage test:temp-0.7570352160853306 function set value arrow0.9607928733481718
data modify storage test:temp-0.5028739206639588 type set value "object"
data modify storage test:obj-0.08058840489944308 string.then.value set from storage test:temp-0.7570352160853306 value
data modify storage test:obj-0.08058840489944308 string.then.type set from storage test:temp-0.7570352160853306 type
data modify storage test:obj-0.08058840489944308 string.then.function set from storage test:temp-0.7570352160853306 function
data modify storage test:scope-0.35231898384148486 variables.resolver.value set value "null"
data modify storage test:scope-0.35231898384148486 variables.resolver.type set value "object"
data modify storage test:temp-0.4312128106074572 namespace set value "test"
data modify storage test:temp-0.4312128106074572 storage set value "test:scope-0.35231898384148486"
data modify storage test:temp-0.4312128106074572 index set value "-2"
data modify storage test:temp-0.4312128106074572 blockScope set value "scope-0.35231898384148486"
data modify storage test:temp-0.4312128106074572 name set value "Promise"
data modify storage test:temp-0.4312128106074572 result set value "test:temp-0.9700474349341014"
function test:getvariable with storage test:temp-0.4312128106074572
data modify storage test:temp-0.25650650128185704 function set from storage test:temp-0.9700474349341014 function
data modify storage test:temp-0.007613684611038174 value set value "test:temp-0.18567476784203596"
data modify storage test:temp-0.007613684611038174 type set value function
data modify storage test:temp-0.007613684611038174 function set value arrow0.3737532327081291
data modify storage test:temp-0.18567476784203596 type set value "object"
data modify storage test:params 0 set value "test:temp-0.007613684611038174"
data modify storage test:temp-0.25650650128185704 namespace set value "test"
data modify storage test:temp-0.25650650128185704 storage set value "test:params"
data modify storage test:temp-0.8069293485596797 type set value "object"
data modify storage test:temp-0.8069293485596797 value set value "test:obj-0.692970679530377"
data modify storage test:obj-0.692970679530377 type set value "object"
data modify storage test:params __this set value "test:temp-0.8069293485596797"
data modify storage test:params __this_obj set from storage test:temp-0.8069293485596797 value
function test:call with storage test:temp-0.25650650128185704
data modify storage test:scope-0.35231898384148486 variables.promise.value set from storage test:temp-0.8069293485596797 value
data modify storage test:scope-0.35231898384148486 variables.promise.type set from storage test:temp-0.8069293485596797 type
data modify storage test:scope-0.35231898384148486 variables.promise.function set from storage test:temp-0.8069293485596797 function
data modify storage test:temp-0.6298682690397254 value set value "test:temp-0.27310891809212445"
data modify storage test:temp-0.6298682690397254 type set value function
data modify storage test:temp-0.6298682690397254 function set value arrow0.26242860098436527
data modify storage test:temp-0.27310891809212445 type set value "object"
data modify storage test:scope-0.35231898384148486 variables.foo.value set from storage test:temp-0.6298682690397254 value
data modify storage test:scope-0.35231898384148486 variables.foo.type set from storage test:temp-0.6298682690397254 type
data modify storage test:scope-0.35231898384148486 variables.foo.function set from storage test:temp-0.6298682690397254 function
data modify storage test:temp-0.6030541485117678 namespace set value "test"
data modify storage test:temp-0.6030541485117678 storage set value "test:scope-0.35231898384148486"
data modify storage test:temp-0.6030541485117678 index set value "-2"
data modify storage test:temp-0.6030541485117678 blockScope set value "scope-0.35231898384148486"
data modify storage test:temp-0.6030541485117678 name set value "console"
data modify storage test:temp-0.6030541485117678 result set value "test:temp-0.991282054973319"
function test:getvariable with storage test:temp-0.6030541485117678
data modify storage test:temp-0.5543946486118486 property set value "log"
data modify storage test:temp-0.5543946486118486 object set value "test:temp-0.991282054973319"
data modify storage test:temp-0.5543946486118486 result set value "test:temp-0.20917139625773074"
data modify storage test:temp-0.5543946486118486 namespace set value "test"
function test:getmember with storage test:temp-0.5543946486118486
data modify storage test:temp-0.27805007208151644 function set from storage test:temp-0.20917139625773074 function
data modify storage test:temp-0.3512021643617306 namespace set value "test"
data modify storage test:temp-0.3512021643617306 storage set value "test:scope-0.35231898384148486"
data modify storage test:temp-0.3512021643617306 index set value "-2"
data modify storage test:temp-0.3512021643617306 blockScope set value "scope-0.35231898384148486"
data modify storage test:temp-0.3512021643617306 name set value "foo"
data modify storage test:temp-0.3512021643617306 result set value "test:temp-0.32697580970104057"
function test:getvariable with storage test:temp-0.3512021643617306
data modify storage test:temp-0.6395767889563319 value set value "foo is test:temp-0.32697580970104057"
data modify storage test:temp-0.6395767889563319 type set value string
data modify storage test:params 0 set value "test:temp-0.6395767889563319"
data modify storage test:temp-0.27805007208151644 namespace set value "test"
data modify storage test:temp-0.27805007208151644 storage set value "test:params"
data modify storage test:params __this set value "test:temp-0.991282054973319"
data modify storage test:params __this_obj set from storage test:temp-0.991282054973319 value
data modify storage test:params __return set value "test:temp-0.25358401896891836"
function test:call with storage test:temp-0.27805007208151644
data modify storage test:temp-0.8458439630907199 value set value "test:temp-0.2604306144479509"
data modify storage test:temp-0.8458439630907199 type set value function
data modify storage test:temp-0.8458439630907199 function set value arrow0.47910001626670184
data modify storage test:temp-0.2604306144479509 type set value "object"
data modify storage test:scope-0.35231898384148486 variables.magic.value set from storage test:temp-0.8458439630907199 value
data modify storage test:scope-0.35231898384148486 variables.magic.type set from storage test:temp-0.8458439630907199 type
data modify storage test:scope-0.35231898384148486 variables.magic.function set from storage test:temp-0.8458439630907199 function
data modify storage test:temp-0.7875338691880323 namespace set value "test"
data modify storage test:temp-0.7875338691880323 storage set value "test:scope-0.35231898384148486"
data modify storage test:temp-0.7875338691880323 index set value "-2"
data modify storage test:temp-0.7875338691880323 blockScope set value "scope-0.35231898384148486"
data modify storage test:temp-0.7875338691880323 name set value "magic"
data modify storage test:temp-0.7875338691880323 result set value "test:temp-0.2626781516805381"
function test:getvariable with storage test:temp-0.7875338691880323
data modify storage test:temp-0.31924930798246187 function set from storage test:temp-0.2626781516805381 function
data modify storage test:temp-0.31924930798246187 namespace set value "test"
data modify storage test:temp-0.31924930798246187 storage set value "test:params"
data modify storage test:params __return set value "test:temp-0.5276253901452451"
function test:call with storage test:temp-0.31924930798246187
data modify storage test:temp-0.8855554400729341 namespace set value "test"
data modify storage test:temp-0.8855554400729341 storage set value "test:scope-0.35231898384148486"
data modify storage test:temp-0.8855554400729341 index set value "-2"
data modify storage test:temp-0.8855554400729341 blockScope set value "scope-0.35231898384148486"
data modify storage test:temp-0.8855554400729341 name set value "promise"
data modify storage test:temp-0.8855554400729341 result set value "test:temp-0.8103455105472319"
function test:getvariable with storage test:temp-0.8855554400729341
data modify storage test:temp-0.7745676072597235 property set value "then"
data modify storage test:temp-0.7745676072597235 object set value "test:temp-0.8103455105472319"
data modify storage test:temp-0.7745676072597235 result set value "test:temp-0.016390797913265587"
data modify storage test:temp-0.7745676072597235 namespace set value "test"
function test:getmember with storage test:temp-0.7745676072597235
data modify storage test:temp-0.2839216411436817 function set from storage test:temp-0.016390797913265587 function
data modify storage test:temp-0.13640440837660417 value set value "test:temp-0.44698028918386956"
data modify storage test:temp-0.13640440837660417 type set value function
data modify storage test:temp-0.13640440837660417 function set value arrow0.9821336805160404
data modify storage test:temp-0.44698028918386956 type set value "object"
data modify storage test:params 0 set value "test:temp-0.13640440837660417"
data modify storage test:temp-0.2839216411436817 namespace set value "test"
data modify storage test:temp-0.2839216411436817 storage set value "test:params"
data modify storage test:params __this set value "test:temp-0.8103455105472319"
data modify storage test:params __this_obj set from storage test:temp-0.8103455105472319 value
data modify storage test:params __return set value "test:temp-0.7043738210504397"
function test:call with storage test:temp-0.2839216411436817
data modify storage test:temp-0.7147534434574555 namespace set value "test"
data modify storage test:temp-0.7147534434574555 storage set value "test:scope-0.35231898384148486"
data modify storage test:temp-0.7147534434574555 index set value "-2"
data modify storage test:temp-0.7147534434574555 blockScope set value "scope-0.35231898384148486"
data modify storage test:temp-0.7147534434574555 name set value "resolver"
data modify storage test:temp-0.7147534434574555 result set value "test:temp-0.7160646296781942"
function test:getvariable with storage test:temp-0.7147534434574555
data modify storage test:temp-0.9154140254720122 function set from storage test:temp-0.7160646296781942 function
data modify storage test:temp-0.3654975175131704 value set value "test"
data modify storage test:temp-0.3654975175131704 type set value string
data modify storage test:params 0 set value "test:temp-0.3654975175131704"
data modify storage test:temp-0.9154140254720122 namespace set value "test"
data modify storage test:temp-0.9154140254720122 storage set value "test:params"
data modify storage test:params __return set value "test:temp-0.7435149055408931"
function test:call with storage test:temp-0.9154140254720122