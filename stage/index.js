define(["../events/index"], function(Events) {
    "use strict";
    
    var exports = {};
    var scenes = {};
    var scope = Events.scope("stage");
    var currentId;
    
    
    var createScene = function(arr) {
        arr.get = arr.getObject = function(index) {
            return this[index];
        }
        
        arr.search = arr.searchObject = function(obj) {
            return this.indexOf(obj);
        }
        
        arr.contains = arr.containsObject = function(obj) {
            return arr.indexOf(obj) > -1;
        }
        
        arr.add = arr.addObject = function(obj, index) {
            if(typeof index !== "number") {
                this.push(obj);
            }
            else {
                this.splice(index, 0, obj);
            }
            
            return this;
        }
        
        arr.remove = arr.removeObject = function(index, amount) {
            this.splice(index, typeof amount === "number" ? amount : 1);
            
            return this;
        }
        
        
        return arr;
    }
    
    
    exports.get = exports.getScene = function(id) {
        return scenes[id];
    }
    
    exports.add = exports.addScene = function(id, scene) {
        var upgraded = createScene(scene);
        scope.emit("add", id, upgraded);
        scenes[id] = upgraded;
        
        return this;
    }
    
    exports.remove = exports.removeScene = function(id) {
        scope.emit("remove", id, exports.getScene(id));
        delete scenes[id];
        
        return this;
    }
    
    exports.getId = exports.getSceneId = function(scene) {
        for(var id in scenes) {
            if(scenes[id] === scene) {
                return id;
            }
        }
        
        return null;
    }
    
    exports.getCurrentId = function() {
        return currentId;
    }
    
    exports.getCurrent = exports.getCurrentScene = function() {
        return exports.getScene(exports.getCurrentId());
    }
    
    exports.load = exports.loadScene = function(id) {
        scope.emit("load", id, exports.getScene(id));
        currentId = id;
        
        return this;
    }
    
    
    
    
});