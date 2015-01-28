define(["../events/index", "../util/index"], function(Events, Util) {
    "use strict";
    
    var exports = {};
    var scenes = {};
    var scope = Events.scope("stage");
    var currentId;
    
    
    var Scene = exports.Scene = function(arr) {
        if(arr) {
            arr instanceof Scene ? return arr : this.load(arr);
        }
        
        return this;
    }
    
    Util.inherits(Scene, Array);
    
    
    Scene.prototype.load = function(arr) {
        this.clear().push.apply(this, arr);
        
        return this;
    }
    
    Scene.prototype.get = Scene.prototype.getObject = function(index) {
        return this[index];
    }
    
    Scene.prototype.add = Scene.prototype.addObject = function(obj, index) {
        typeof index === "number" ? this.splice(index, 0, obj) : this.push(obj);
        
        return this;
    }
    
    Scene.prototype.remove = Scene.prototype.removeObject = function(index, amount) {
        if(index > -1) this.splice(index, typeof amount === "number" ? amount : 1);
        
        return this;
    }
    
    Scene.prototype.search = Scene.prototype.searchObject = function(obj) {
        return this.indexOf(obj);
    }
    
    Scene.prototype.contains = Scene.prototype.containsObject = function(obj) {
        return this.search(obj) > -1;
    }
    
    Scene.prototype.clear = function() {
        this.splice(0, this.length);
        
        return this;
    }

    
    
    
    
    
    exports.get = function(id) {
        return scenes[id];
    }
    
    exports.add = exports.addScene = function(id, scene) {
        scene = new Scene(scene);
        scope.emit("add", id, scene);
        scenes[id] = scene;
        
        return this;
    }
    
    exports.remove = exports.removeScene = function(id) {
        scope.emit("remove", id, exports.get(id));
        scenes[id] = undefined;
        
        return this;
    }
    
    exports.search = exports.searchScene = function(scene) {
        for(var id in scenes) {
            if(scenes[id] === scene) {
                return id;
            }
        }
        
        return null;
    }
    
    exports.contains = exports.containsScene = function(scene) {
        return !!this.searchScene(scene);
    }
    
    exports.getCurrentId = function() {
        return currentId;
    }
    
    exports.getCurrent = exports.getCurrentScene = function() {
        return exports.getScene(exports.getCurrentId());
    }
    
    exports.load = exports.loadScene = function(id) {
        scope.emit("load", id, exports.getScene(id), exports.getCurrentScene());
        currentId = id;
        
        return this;
    }
    
    
    
    
    
    
    return exports;
    
    
    
});