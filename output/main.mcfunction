data modify storage test:temp-0.7872115628930945 value set value "test:temp-0.30356260283840786"
data modify storage test:temp-0.7872115628930945 type set value function
data modify storage test:temp-0.7872115628930945 function set value arrow0.36666895704785374
data modify storage test:temp-0.30356260283840786 type set value "object"
data modify storage test:testfunc value set from storage test:temp-0.7872115628930945 value
data modify storage test:testfunc type set from storage test:temp-0.7872115628930945 type
data modify storage test:testfunc function set from storage test:temp-0.7872115628930945 function
data modify storage test:temp-0.7341697882424488 function set from storage test:testfunc function
data modify storage test:temp-0.7341697882424488 namespace set value "test"
data modify storage test:temp-0.7341697882424488 storage set value "test:params"
data modify storage test:params __return set value "test:temp-0.7663990757020568"
function test:call with storage test:temp-0.7341697882424488
data modify storage test:temp-0.5577649683944025 value set value "say "
data modify storage test:temp-0.5577649683944025 type set value string
function test:add {namespace:"test",left:"test:temp-0.5577649683944025",right:"test:temp-0.7663990757020568",prefix:""}
function test:run with storage test:temp-0.5577649683944025