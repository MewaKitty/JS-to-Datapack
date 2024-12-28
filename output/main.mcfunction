data modify storage test:scope-0.26573553986031484 scopes set value ["scope-0.10993559317701351", "scope-0.26573553986031484"]
data modify storage test:temp-0.7487612407645086 type set value "object"
data modify storage test:temp-0.7487612407645086 value set value "test:obj-0.7082934412735042"
data modify storage test:obj-0.7082934412735042 type set value "object"
data modify storage test:temp-0.22204387700445283 value set value "test:temp-0.5413356368200963"
data modify storage test:temp-0.22204387700445283 type set value function
data modify storage test:temp-0.22204387700445283 function set value arrow0.9875608802701564
data modify storage test:temp-0.5413356368200963 type set value "object"
data modify storage test:obj-0.7082934412735042 string.log.value set from storage test:temp-0.22204387700445283 value
data modify storage test:obj-0.7082934412735042 string.log.type set from storage test:temp-0.22204387700445283 type
data modify storage test:obj-0.7082934412735042 string.log.function set from storage test:temp-0.22204387700445283 function
data modify storage test:scope-0.26573553986031484 variables.console.value set from storage test:temp-0.7487612407645086 value
data modify storage test:scope-0.26573553986031484 variables.console.type set from storage test:temp-0.7487612407645086 type
data modify storage test:scope-0.26573553986031484 variables.console.function set from storage test:temp-0.7487612407645086 function
data modify storage test:temp-0.9746854470551739 value set value "test:temp-0.09204764663858156"
data modify storage test:temp-0.9746854470551739 type set value function
data modify storage test:temp-0.9746854470551739 function set value arrow0.6466134721603876
data modify storage test:temp-0.09204764663858156 type set value "object"
data modify storage test:scope-0.26573553986031484 variables.Promise.value set from storage test:temp-0.9746854470551739 value
data modify storage test:scope-0.26573553986031484 variables.Promise.type set from storage test:temp-0.9746854470551739 type
data modify storage test:scope-0.26573553986031484 variables.Promise.function set from storage test:temp-0.9746854470551739 function
data modify storage test:temp-0.09204764663858156 string.prototype.value set value "test:obj-0.6365591077509906"
data modify storage test:temp-0.09204764663858156 string.prototype.type set value "object"
data modify storage test:obj-0.6365591077509906 type set value "object"
data modify storage test:temp-0.7691196574586772 value set value "test:temp-0.5872130670208796"
data modify storage test:temp-0.7691196574586772 type set value function
data modify storage test:temp-0.7691196574586772 function set value arrow0.8029412728104265
data modify storage test:temp-0.5872130670208796 type set value "object"
data modify storage test:obj-0.6365591077509906 string.then.value set from storage test:temp-0.7691196574586772 value
data modify storage test:obj-0.6365591077509906 string.then.type set from storage test:temp-0.7691196574586772 type
data modify storage test:obj-0.6365591077509906 string.then.function set from storage test:temp-0.7691196574586772 function
data modify storage test:scope-0.26573553986031484 variables.resolver.value set value "null"
data modify storage test:scope-0.26573553986031484 variables.resolver.type set value "object"
data modify storage test:temp-0.8756942687148228 namespace set value "test"
data modify storage test:temp-0.8756942687148228 storage set value "test:scope-0.26573553986031484"
data modify storage test:temp-0.8756942687148228 index set value "-2"
data modify storage test:temp-0.8756942687148228 blockScope set value "scope-0.26573553986031484"
data modify storage test:temp-0.8756942687148228 name set value "Promise"
data modify storage test:temp-0.8756942687148228 result set value "test:temp-0.551004442251329"
function test:getvariable with storage test:temp-0.8756942687148228
data modify storage test:temp-0.5634861542589469 function set from storage test:temp-0.551004442251329 function
data modify storage test:temp-0.1003967712503302 value set value "test:temp-0.16531861581057372"
data modify storage test:temp-0.1003967712503302 type set value function
data modify storage test:temp-0.1003967712503302 function set value arrow0.6772199225404245
data modify storage test:temp-0.16531861581057372 type set value "object"
data modify storage test:params 0 set value "test:temp-0.1003967712503302"
data modify storage test:temp-0.5634861542589469 namespace set value "test"
data modify storage test:temp-0.5634861542589469 storage set value "test:params"
data modify storage test:temp-0.9956238506015589 type set value "object"
data modify storage test:temp-0.9956238506015589 value set value "test:obj-0.7359984159922328"
data modify storage test:obj-0.7359984159922328 type set value "object"
data modify storage test:params __this set value "test:temp-0.9956238506015589"
data modify storage test:params __this_obj set from storage test:temp-0.9956238506015589 value
function test:call with storage test:temp-0.5634861542589469
data modify storage test:scope-0.26573553986031484 variables.promise.value set from storage test:temp-0.9956238506015589 value
data modify storage test:scope-0.26573553986031484 variables.promise.type set from storage test:temp-0.9956238506015589 type
data modify storage test:scope-0.26573553986031484 variables.promise.function set from storage test:temp-0.9956238506015589 function
data modify storage test:scope-0.3084538779384255 scopes set value ["scope-0.10993559317701351", "scope-0.26573553986031484", "scope-0.3084538779384255"]
data modify storage test:scope-0.3084538779384255 variables.i.value set value 0
data modify storage test:scope-0.3084538779384255 variables.i.type set value "number"
data modify storage test:temp-0.2649313528039612 namespace set value "test"
data modify storage test:temp-0.2649313528039612 storage set value "test:scope-0.3084538779384255"
data modify storage test:temp-0.2649313528039612 index set value "-2"
data modify storage test:temp-0.2649313528039612 blockScope set value "scope-0.3084538779384255"
data modify storage test:temp-0.2649313528039612 name set value "i"
data modify storage test:temp-0.2649313528039612 result set value "test:temp-0.9933937424621774"
function test:getvariable with storage test:temp-0.2649313528039612
data modify storage test:temp-0.7557671470450182 value set from storage test:temp-0.9933937424621774 value
data modify storage test:temp-0.7557671470450182 type set from storage test:temp-0.9933937424621774 type
data modify storage test:temp-0.23132752029087889 value set value 3
data modify storage test:temp-0.23132752029087889 type set value number
data modify storage test:temp-0.777244888305999 namespace set value "test"
data modify storage test:temp-0.777244888305999 result set value "test:temp-0.4709279958090731"
data modify storage test:temp-0.777244888305999 left set from storage test:temp-0.7557671470450182 value
data modify storage test:temp-0.777244888305999 right set from storage test:temp-0.23132752029087889 value
data modify storage test:temp-0.777244888305999 operator set value "<"
function test:numbercompare with storage test:temp-0.777244888305999
data modify storage test:temp-result result set value 0
execute store result storage test:temp-result result int 1 if data storage test:temp-0.4709279958090731 {value:true} run function test:block0.27697145925988864
execute store result storage test:temp-result result int 1 if data storage test:temp-0.4709279958090731 {type:"number"} unless data storage test:temp-0.4709279958090731 {value:0} run function test:block0.27697145925988864
execute store result storage test:temp-result result int 1 if data storage test:temp-0.4709279958090731 {type:"string"} unless data storage test:temp-0.4709279958090731 {value:""} run function test:block0.27697145925988864
execute if data storage test:temp-result {result:-2000000000} run return -2000000000
data modify storage test:temp-0.8469012131171132 namespace set value "test"
data modify storage test:temp-0.8469012131171132 storage set value "test:scope-0.26573553986031484"
data modify storage test:temp-0.8469012131171132 index set value "-2"
data modify storage test:temp-0.8469012131171132 blockScope set value "scope-0.26573553986031484"
data modify storage test:temp-0.8469012131171132 name set value "resolver"
data modify storage test:temp-0.8469012131171132 result set value "test:temp-0.8719968126134903"
function test:getvariable with storage test:temp-0.8469012131171132
data modify storage test:temp-0.05951216820097649 function set from storage test:temp-0.8719968126134903 function
data modify storage test:temp-0.43294613557589046 value set value "test"
data modify storage test:temp-0.43294613557589046 type set value string
data modify storage test:params 0 set value "test:temp-0.43294613557589046"
data modify storage test:temp-0.05951216820097649 namespace set value "test"
data modify storage test:temp-0.05951216820097649 storage set value "test:params"
data modify storage test:params __return set value "test:temp-0.7492631339506204"
function test:call with storage test:temp-0.05951216820097649