data modify storage test:scope-0.1549006386804166 scopes set value ["scope-0.7092477183857968", "scope-0.1549006386804166"]
data modify storage test:temp-0.797549693773222 type set value "object"
data modify storage test:temp-0.797549693773222 value set value "test:obj-0.3768151651587337"
data modify storage test:obj-0.3768151651587337 type set value "object"
data modify storage test:temp-0.37656303563618254 value set value "test:temp-0.36691995387678145"
data modify storage test:temp-0.37656303563618254 type set value function
data modify storage test:temp-0.37656303563618254 function set value arrow0.3368449474884675
data modify storage test:temp-0.36691995387678145 type set value "object"
data modify storage test:obj-0.3768151651587337 string.log.value set from storage test:temp-0.37656303563618254 value
data modify storage test:obj-0.3768151651587337 string.log.type set from storage test:temp-0.37656303563618254 type
data modify storage test:obj-0.3768151651587337 string.log.function set from storage test:temp-0.37656303563618254 function
data modify storage test:scope-0.1549006386804166 variables.console.value set from storage test:temp-0.797549693773222 value
data modify storage test:scope-0.1549006386804166 variables.console.type set from storage test:temp-0.797549693773222 type
data modify storage test:scope-0.1549006386804166 variables.console.function set from storage test:temp-0.797549693773222 function
data modify storage test:temp-0.8241871879838774 value set value "test:temp-0.7815405800847757"
data modify storage test:temp-0.8241871879838774 type set value function
data modify storage test:temp-0.8241871879838774 function set value arrow0.3408245916726099
data modify storage test:temp-0.7815405800847757 type set value "object"
data modify storage test:scope-0.1549006386804166 variables.Promise.value set from storage test:temp-0.8241871879838774 value
data modify storage test:scope-0.1549006386804166 variables.Promise.type set from storage test:temp-0.8241871879838774 type
data modify storage test:scope-0.1549006386804166 variables.Promise.function set from storage test:temp-0.8241871879838774 function
data modify storage test:temp-0.7815405800847757 string.prototype.value set value "test:obj-0.5617794202275519"
data modify storage test:temp-0.7815405800847757 string.prototype.type set value "object"
data modify storage test:obj-0.5617794202275519 type set value "object"
data modify storage test:temp-0.5797706998111872 value set value "test:temp-0.2640769300390978"
data modify storage test:temp-0.5797706998111872 type set value function
data modify storage test:temp-0.5797706998111872 function set value arrow0.003093875845266769
data modify storage test:temp-0.2640769300390978 type set value "object"
data modify storage test:obj-0.5617794202275519 string.then.value set from storage test:temp-0.5797706998111872 value
data modify storage test:obj-0.5617794202275519 string.then.type set from storage test:temp-0.5797706998111872 type
data modify storage test:obj-0.5617794202275519 string.then.function set from storage test:temp-0.5797706998111872 function
data modify storage test:scope-0.1549006386804166 variables.resolver.value set value "null"
data modify storage test:scope-0.1549006386804166 variables.resolver.type set value "object"
data modify storage test:temp-0.14772585237522629 namespace set value "test"
data modify storage test:temp-0.14772585237522629 storage set value "test:scope-0.1549006386804166"
data modify storage test:temp-0.14772585237522629 index set value "-2"
data modify storage test:temp-0.14772585237522629 blockScope set value "scope-0.1549006386804166"
data modify storage test:temp-0.14772585237522629 name set value "Promise"
data modify storage test:temp-0.14772585237522629 result set value "test:temp-0.9539161942268365"
function test:getvariable with storage test:temp-0.14772585237522629
data modify storage test:temp-0.8655487495905095 function set from storage test:temp-0.9539161942268365 function
data modify storage test:temp-0.8018450771592884 value set value "test:temp-0.3992324304564834"
data modify storage test:temp-0.8018450771592884 type set value function
data modify storage test:temp-0.8018450771592884 function set value arrow0.8940029073948912
data modify storage test:temp-0.3992324304564834 type set value "object"
data modify storage test:params 0 set value "test:temp-0.8018450771592884"
data modify storage test:temp-0.8655487495905095 namespace set value "test"
data modify storage test:temp-0.8655487495905095 storage set value "test:params"
data modify storage test:temp-0.50075841535457 type set value "object"
data modify storage test:temp-0.50075841535457 value set value "test:obj-0.5328890278459186"
data modify storage test:obj-0.5328890278459186 type set value "object"
data modify storage test:params __this set value "test:temp-0.50075841535457"
data modify storage test:params __this_obj set from storage test:temp-0.50075841535457 value
function test:call with storage test:temp-0.8655487495905095
data modify storage test:scope-0.1549006386804166 variables.promise.value set from storage test:temp-0.50075841535457 value
data modify storage test:scope-0.1549006386804166 variables.promise.type set from storage test:temp-0.50075841535457 type
data modify storage test:scope-0.1549006386804166 variables.promise.function set from storage test:temp-0.50075841535457 function
data modify storage test:temp-0.3065677998898524 value set value "test:temp-0.6856426528279348"
data modify storage test:temp-0.3065677998898524 type set value function
data modify storage test:temp-0.3065677998898524 function set value arrow0.6967737069017641
data modify storage test:temp-0.6856426528279348 type set value "object"
data modify storage test:scope-0.1549006386804166 variables.foo.value set from storage test:temp-0.3065677998898524 value
data modify storage test:scope-0.1549006386804166 variables.foo.type set from storage test:temp-0.3065677998898524 type
data modify storage test:scope-0.1549006386804166 variables.foo.function set from storage test:temp-0.3065677998898524 function
data modify storage test:temp-0.07591715359053597 namespace set value "test"
data modify storage test:temp-0.07591715359053597 storage set value "test:scope-0.1549006386804166"
data modify storage test:temp-0.07591715359053597 index set value "-2"
data modify storage test:temp-0.07591715359053597 blockScope set value "scope-0.1549006386804166"
data modify storage test:temp-0.07591715359053597 name set value "console"
data modify storage test:temp-0.07591715359053597 result set value "test:temp-0.5456848929656901"
function test:getvariable with storage test:temp-0.07591715359053597
data modify storage test:temp-0.4237633129934433 property set value "log"
data modify storage test:temp-0.4237633129934433 object set value "test:temp-0.5456848929656901"
data modify storage test:temp-0.4237633129934433 result set value "test:temp-0.5306708833204254"
data modify storage test:temp-0.4237633129934433 namespace set value "test"
function test:getmember with storage test:temp-0.4237633129934433
data modify storage test:temp-0.7795156643703146 function set from storage test:temp-0.5306708833204254 function
data modify storage test:temp-0.6550153666803312 namespace set value "test"
data modify storage test:temp-0.6550153666803312 storage set value "test:scope-0.1549006386804166"
data modify storage test:temp-0.6550153666803312 index set value "-2"
data modify storage test:temp-0.6550153666803312 blockScope set value "scope-0.1549006386804166"
data modify storage test:temp-0.6550153666803312 name set value "foo"
data modify storage test:temp-0.6550153666803312 result set value "test:temp-0.2337928077801431"
function test:getvariable with storage test:temp-0.6550153666803312
data modify storage test:temp-0.6687629891778735 value set value "foo is test:temp-0.2337928077801431"
data modify storage test:temp-0.6687629891778735 type set value string
data modify storage test:params 0 set value "test:temp-0.6687629891778735"
data modify storage test:temp-0.7795156643703146 namespace set value "test"
data modify storage test:temp-0.7795156643703146 storage set value "test:params"
data modify storage test:params __this set value "test:temp-0.5456848929656901"
data modify storage test:params __this_obj set from storage test:temp-0.5456848929656901 value
data modify storage test:params __return set value "test:temp-0.22500457474264124"
function test:call with storage test:temp-0.7795156643703146
data modify storage test:temp-0.9695806175587238 value set value "test:temp-0.8947037058051354"
data modify storage test:temp-0.9695806175587238 type set value function
data modify storage test:temp-0.9695806175587238 function set value arrow0.21466500222337936
data modify storage test:temp-0.8947037058051354 type set value "object"
data modify storage test:scope-0.1549006386804166 variables.magic.value set from storage test:temp-0.9695806175587238 value
data modify storage test:scope-0.1549006386804166 variables.magic.type set from storage test:temp-0.9695806175587238 type
data modify storage test:scope-0.1549006386804166 variables.magic.function set from storage test:temp-0.9695806175587238 function
data modify storage test:temp-0.4055249511055544 namespace set value "test"
data modify storage test:temp-0.4055249511055544 storage set value "test:scope-0.1549006386804166"
data modify storage test:temp-0.4055249511055544 index set value "-2"
data modify storage test:temp-0.4055249511055544 blockScope set value "scope-0.1549006386804166"
data modify storage test:temp-0.4055249511055544 name set value "magic"
data modify storage test:temp-0.4055249511055544 result set value "test:temp-0.21762235490111448"
function test:getvariable with storage test:temp-0.4055249511055544
data modify storage test:temp-0.5930402620924338 function set from storage test:temp-0.21762235490111448 function
data modify storage test:temp-0.5930402620924338 namespace set value "test"
data modify storage test:temp-0.5930402620924338 storage set value "test:params"
data modify storage test:params __return set value "test:temp-0.7478569378932001"
function test:call with storage test:temp-0.5930402620924338
data modify storage test:temp-0.5295343657107862 namespace set value "test"
data modify storage test:temp-0.5295343657107862 storage set value "test:scope-0.1549006386804166"
data modify storage test:temp-0.5295343657107862 index set value "-2"
data modify storage test:temp-0.5295343657107862 blockScope set value "scope-0.1549006386804166"
data modify storage test:temp-0.5295343657107862 name set value "promise"
data modify storage test:temp-0.5295343657107862 result set value "test:temp-0.08100663197167768"
function test:getvariable with storage test:temp-0.5295343657107862
data modify storage test:temp-0.811188792463328 property set value "then"
data modify storage test:temp-0.811188792463328 object set value "test:temp-0.08100663197167768"
data modify storage test:temp-0.811188792463328 result set value "test:temp-0.3578294015151726"
data modify storage test:temp-0.811188792463328 namespace set value "test"
function test:getmember with storage test:temp-0.811188792463328
data modify storage test:temp-0.125244519035696 function set from storage test:temp-0.3578294015151726 function
data modify storage test:temp-0.06990451247558604 value set value "test:temp-0.35612004283516385"
data modify storage test:temp-0.06990451247558604 type set value function
data modify storage test:temp-0.06990451247558604 function set value arrow0.7090133664706616
data modify storage test:temp-0.35612004283516385 type set value "object"
data modify storage test:params 0 set value "test:temp-0.06990451247558604"
data modify storage test:temp-0.125244519035696 namespace set value "test"
data modify storage test:temp-0.125244519035696 storage set value "test:params"
data modify storage test:params __this set value "test:temp-0.08100663197167768"
data modify storage test:params __this_obj set from storage test:temp-0.08100663197167768 value
data modify storage test:params __return set value "test:temp-0.10367773376441924"
function test:call with storage test:temp-0.125244519035696
data modify storage test:temp-0.9636473682696636 namespace set value "test"
data modify storage test:temp-0.9636473682696636 storage set value "test:scope-0.1549006386804166"
data modify storage test:temp-0.9636473682696636 index set value "-2"
data modify storage test:temp-0.9636473682696636 blockScope set value "scope-0.1549006386804166"
data modify storage test:temp-0.9636473682696636 name set value "resolver"
data modify storage test:temp-0.9636473682696636 result set value "test:temp-0.34949933094787"
function test:getvariable with storage test:temp-0.9636473682696636
data modify storage test:temp-0.7142425378112564 function set from storage test:temp-0.34949933094787 function
data modify storage test:temp-0.5090699581110979 value set value "test"
data modify storage test:temp-0.5090699581110979 type set value string
data modify storage test:params 0 set value "test:temp-0.5090699581110979"
data modify storage test:temp-0.7142425378112564 namespace set value "test"
data modify storage test:temp-0.7142425378112564 storage set value "test:params"
data modify storage test:params __return set value "test:temp-0.9654365268083565"
function test:call with storage test:temp-0.7142425378112564