define(["../util/index"], function(Util, Stage) {
    "use strict";
    
    
    var Class = function() {
        var args = [];
        args.push.apply(args, arguments);
        args.unshift(this);
        Util.extend.apply(Util, args);
        
        return this;
    }
    Class.extend = Util.extendProto;
    
    
    var _Object = Class.extend({
        stage: function(scene) {
            // Add object to the stage
            
            return this;
        },
        
        unStage: function(scene) {
            // Remove object from the stage
            
            return this;
        },
        
        destroy: function() {
            // Destroy the object
            
            return this;
        }
    });
    
    
});