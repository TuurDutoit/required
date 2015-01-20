define(["../events/index", "../viewport/index"], function(Events, Viewport) {
    
    
    var exports = {};
    var scope = Events.scope("camera");
    
    var X = Viewport.width/2; // X-coordinate of the center
    var Y = Viewport.height/2; // Y-coordinate of the center
    var relX = 0; // X-coordinate relative to X (used to position camera relative to the object it's following)
    var relY = 0; // Y-coordinate relative to Y (used to position camera relative to the object it's following)
    
    
    exports.width = Viewport.width; // The width of the camera (in pixels; zoom already taken into account)
    exports.height = Viewport.height; // The height of the camera (in pixels; zoom already taken into account)
    exports.following = false; // The object the camera is following. false if not following
    exports.zoomX = 1; // The scale factor on the X axis
    exports.zoomY = 1; // The scale factor on the Y axis
    
    
    exports.move = exports.moveBy = function(x, y) {
        if(exports.following) {
            relX += x || 0;
            relY += y || 0;
        }
        else {
            X += x || 0;
            Y += y || 0;
        }
        
        scope.emit("move-by", x, y);
        scope.emit("move");
        
        return this;
    }
    
    exports.moveTo = function(x, y) {
        exports.following = false;
        
        relX = 0;
        relY = 0;
        X = x;
        Y = y;
        
        scope.emit("move-to", x, y);
        scope.emit("move");
        
        return this;
    }
    
    exports.follow = function(obj, stay) {
        exports.following = obj;
        
        if(stay) {
            relX = X - obj.x;
            relY = Y - obj.y;
        }
        else {
            relX = 0;
            relY = 0;
        }
        
        X = obj.x;
        Y = obj.y;
        
        scope.emit("follow", obj);
        
        return this;
    }
    
    exports.unFollow = function() {
        exports.following = false;
        
        exports.x += exports.relX;
        exports.y += exports.relY;
        
        exports.relX = 0;
        exports.relY = 0;
        
        scope.emit("unfollow");
        
        return this;
    }
    
    exports.getX = function(type, system) {
        var x;
        
        switch(type) {
            case "base":
                x = X;
                break;
            case "relative":
                x = relX;
                break;
            default:
                x = X + relX;
        }
        
        switch(system) {
            case "cartesian":
            case "canvas":
            case "left":
                return x - exports.width/2;
                break;
            case "right":
                return x + exports.width/2;
                break;
            default:
                return x;
        }
    }
    
    exports.getY = function(type, system) {
        var y;
        
        switch(type) {
            case "base":
                y = Y;
                break;
            case "relative":
                y = relY;
                break;
            default:
                y = Y + relY;
        }
        
        switch(system) {
            case "cartesian":
            case "bottom":
                return y - exports.height/2;
                break;
            case "canvas":
            case "top":
                return y + exports.height/2;
                break;
            default:
                return y;
        }
    }
    
    exports.zoom = function(newX, y) {
        var newY = typeof y === "number" ? y : newX;
        
        exports.width *= newX / exports.zoomX;
        exports.height *= newY / exports.zoomY;
        
        exports.zoomX = newX;
        exports.zoomY = newY;
        
        scope.emit("zoom", newX, newY);
        
        return this;
    }
    
    
    
    
    Events.on("viewport:resize", function(w, h) {
        exports.width = w * exports.zoomX;
        exports.height = h * exports.zoomY;
    });
    
    Events.on("objects:move", function(obj) {
        if(obj === exports.following) {
            X = obj.x;
            Y = obj.y;
        }
    });
    
    
});