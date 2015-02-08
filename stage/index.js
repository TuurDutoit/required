define(["../events/index", "../util/index", "../collections/index"], function(Events, Util, Collections) {
    "use strict";
    
    var exports = new Events.EventEmitter();
    
    exports.scenes = {};
    exports.current = null;
    
    exports.getCurrent = exports.getCurrentScene = function() {
        return this.getScene(this.current);
    }
    
    Collections.createNamedCollection(exports, exports.scenes, {name: "scene", short: true});
    
    
    
    
    
    var Scene = exports.Scene = function(arr) {
        Events.EventEmitter.call(this);
        
        Collections.createCollection(this, this, {name:"object", short: true});
        
        if(arr) this.load(arr);
        
        return this;
    }
    
    Util.inherits(Scene, Array);
    Util.inherits(Scene, Events.EventEmitter);
    
    
    
    
    
    
    return exports;
    
    
    
});