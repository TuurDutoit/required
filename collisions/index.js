define(["../events/index", "./rbush", "./SAT"], function(Events, RBush, SAT) {
    "use strict";
    
    
    var exports = Events.scope("collisions");

    
    var updateAABBPolygon = function(aabb, collider) {
        var pos = collider.pos;
        var points = collider.calcPoints;
        var len = points.length;
        var xMin = points[0].x;
        var yMin = points[0].y;
        var xMax = points[0].x;
        var yMax = points[0].y;
        for (var i = 1; i < len; i++) {
            var point = points[i];
            if (point.x < xMin) {
                xMin = point.x;
            }
            else if (point.x > xMax) {
                xMax = point.x;
            }
            if (point.y < yMin) {
                yMin = point.y;
            }
            else if (point.y > yMax) {
                yMax = point.y;
            }
        }
        
        aabb.x1 = pos + xMin;
        aabb.y1 = pos + yMin;
        aabb.x2 = pos + xMax;
        aabb.y2 = pos + yMax;
    }
    
    var updateAABBCircle = function(aabb, collider) {
        var r = collider.r;
        var center = collider.pos;

        aabb.x1 = center.x - r;
        aabb.y1 = center.y - r;
        aabb.x2 = center.x + r;
        aabb.y2 = center.y + r;
    }
    
    var getAABBPolygon = function(collider) {
        return updateAABBPolygon({}, collider);
    }
    
    var getAABBCircle = function(collider) {
        return updateAABBCircle({}, collider);
    }



    

    exports.SAT = SAT;
    exports.RBush = RBush;
    exports.rbush = null;
    exports.V = exports.Vector = SAT.Vector;

    
    exports.init = function(maxEntries) {
        exports.rbush = new RBush(maxEntries, ["x1", "y1", "x2", "y2"]);

        return this;
    }
    
    
    
    
    
    
    
    
    exports.test = function(collider) {
        return collider.type === "polygon" ? exports.testPolygon(collider) : exports.testCircle(collider);
    }
    
    exports.testPolygon = function(collider) {
        var possible = exports.rbush.search(collider);
        
        for(var i = 0, len = possible.length; i < len; i++) {
            var other = possible[i];
            var response = new SAT.Response();
            
            switch(other.type) {
                case "polygon":
                    if(SAT.testPolygonPolygon(collider, other.collider, response)) {
                        exports.emit("collision", collider, other, response);
                    }
                    break;
                case "circle":
                    if(SAT.testPolygonCircle(collider, other.collider, response)) {
                        exports.emit("collision", collider, other, response);
                    }
            }
        }
        
        return this;
    }
    
    exports.testCircle = function(collider) {
        var possible = exports.rbush.search(collider);
        
        for(var i = 0, len = possible.length; i < len; i++) {
            var other = possible[i];
            var response = new SAT.Response();
            
            switch(other.type) {
                case "polygon":
                    if(SAT.testCirclePolygon(collider, other.collider, response)) {
                        exports.emit("collision", collider, other, response);
                    }
                    break;
                case "circle":
                    if(SAT.testCircleCircle(collider, other.collider, response)) {
                        exports.emit("collision", collider, other, response);
                    }
            }
        }
        
        return this;
    }
    
    
    
    
    
    
    
    
    
    var Polygon = exports.Polygon = function(pos, points, options) {
        if(!options) options = {};
        
        this.type = "polygon";
        this.sat = new SAT.Polygon(pos, points);
        this.data = options.data;
        
        updateAABBPolygon(this, this.sat);
        
        if(options.insert !== false) exports.rbush.insert(this);

        return this;
    }
    
    Polygon.prototype.setPoints = function(points) {
        this.sat.setPoints(points);
        return this.update();
    }
    
    Polygon.prototype.setAngle = function(angle) {
        this.sat.setAngle(angle);
        return this.update();
    }
    
    Polygon.prototype.setOffset = function(offset) {
        this.sat.setOffset(offset);
        return this.update();
    }
    
    Polygon.prototype.rotate = function(angle) {
        this.sat.rotate(angle);
        return this.update();
    }
    
    Polygon.prototype.translate = function(x, y) {
        this.sat.translate(x, y);
        return this.update();
    }

    Polygon.prototype.update = function() {
        exports.rbush.remove(this);
        updateAABBPolygon(this, this.sat);
        exports.rbush.insert(this);

        return this;
    }

    Polygon.prototype.moveTo = function(x, y) {
        this.sat.pos.x = x;
        this.sat.pos.y = y;
        return this.update();
    }

    Polygon.prototype.move = Polygon.prototype.moveBy = function(x, y) {
        return this.moveTo(this.sat.pos.x + x, this.sat.pos.y + y);
    }



    var Circle = exports.Circle = function(pos, r, options) {
        if(!options) options = {};
        
        this.type = "circle";
        this.sat = new SAT.Circle(pos, r);
        this.data = options.data;
        
        updateAABBCircle(this, this.sat);
        
        if(insert !== false) exports.rbush.insert(this.rbush);

        return this;
        
    }

    Circle.prototype.update = function() {
        exports.rbush.remove(this);
        updateAABBCircle(this, this.sat);
        exports.rbush.insert(this);

        return this;
    }

    Circle.prototype.moveTo = function(x, y) {
        this.sat.pos.x = x;
        this.sat.pos.y = y;
        return this.update();
    }

    Circle.prototype.move = Circle.prototype.moveBy = function(x, y) {
        return this.moveTo(this.sat.pos.x + x, this.sat.pos.y + y);
    }
    
    
    exports.Box = function(pos, w, h, options) {
        return new exports.Polygon(pos, [
            new SAT.Vector(),
            new SAT.Vector(w, 0),
            new SAT.Vector(w, h),
            new SAT.Vector(0, h)
        ], options);
    }
    

    




    return exports;
    
});
