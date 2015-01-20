define(["../util/index", "./base-types.js"], function(Util, registerBaseTypes) {
    
    
    var exports = {};
    var Pool = {};
    
    
    exports.register = function(type, ctor, clear) {
        Pool[type] = {
            ctor: ctor,
            clear: clear,
            cache: []
        };
        
        return this;
    }
    
    exports.get = function(type) {
        var Type = Pool[type];
        
        if(Type.cache.length) {
            return Type.cache.pop();
        }
        else {
            return new Type.ctor();
        }
    }
    
    exports.free = function(type, item) {
        var Type = Pool[type];
        
        Type.clear(item);
        Type.cache.push(item);
        
        return this;
    }
    
    
    
    registerBaseTypes(exports);
    
    
    
    return exports;
    
    
});