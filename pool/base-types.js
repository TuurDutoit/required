define(function() {
    
    
    return function(Pool) {
        Pool.register("object", Object, function(obj) {
            for(key in obj) {
                delete obj[key];
            }
        });
        
        Pool.register("array", Array, function(arr) {
            arr.splice(0, arr.length);
        });
    }
    
    
});