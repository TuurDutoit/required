define(["../util/index", "./base-types.js"], function(Util, registerBaseTypes) {
    "use strict";
    
    
    var exports = {};
    var Pool = {};
    
    
    exports.register = function(type, create, clear) {
        Pool[type] = {
            create: create,
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
            return new Type.create();
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