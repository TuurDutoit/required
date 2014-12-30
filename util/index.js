define(function() {
    "use strict";
    
    
    return {
        inherits: function(child, parent) {
            child.super_ = parent;
            child.prototype = Object.create(parent.prototype, {
                constructor: {
                    value: child,
                    enumerable: true,
                    writable: true,
                    configurable: true
                }
            });
        }
    }
    
    
});