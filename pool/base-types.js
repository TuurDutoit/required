define(function() {
    "use strict";
    
    
    return function(Pool) {
        Pool.register("object", Object, function(obj) {
            for(key in obj) {
                if(obj.hasOwnProperty(key)) {
                    delete obj[key];
                }
            }
        });
        
        Pool.register("array", Array, function(arr) {
            arr.splice(0, arr.length);
        });
    }
    
    
});