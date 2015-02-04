define(["../events/index", "../util/index", "./rbush", "./SAT"], function(Events, Util, RBush, SAT) {
    "use strict";
    
    
    
    
    /*************
     * Variables *
     *************/
    
    
    
    var exports = Events.scope("collisions");
    
    
    var getTestString = function(type1, type2) {
        return type1 === "circle" ? (
            type2 === "circle" ? "testCircleCircle" : "testCirclePolygon"
        ) : (
            type2 === "circle" ? "testPolygonCircle" : "testPolygonPolygon"
        )
    }

    
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
    
    var updateAABBPoint = function(aabb, collider) {
        aabb.x1 = aabb.x2 = collider.pos.x;
        aabb.y1 = aabb.y2 = collider.pos.x;
    }
    
    var updateAABB = function(aabb, collider) {
        switch(collider.type) {
            case "polygon":
            case "box":
                return updateAABBPolygon(aabb, collider);
                
            case "circle":
                return updateAABBCircle(aabb, collider);
                
            case "point":
                return updateAABBPoint(aabb, collider);
        }
    }
    
    


    
    
    
    /*****************
     * Basic Exports *
     *****************/
    

    exports.SAT = SAT;
    exports.RBush = RBush;
    exports.rbush = null;
    exports.V = exports.Vector = SAT.Vector;

    
    exports.init = function(maxEntries) {
        exports.rbush = new RBush(maxEntries, ["x1", "y1", "x2", "y2"]);

        return this;
    }
    
    
    
    
    
    
    /******************
     * Test Function *
     ******************/
    
    
    
    exports.test = function(collider) {
        var possible = exports.rbush.search(collider);
        var br = false;
        var cancel = function(){
            br = true;
            return false;
        }
        
        loop:
        for(var i = 0, len = possible.length; i < len; i++) {
            var other = possible[i];
            var response = new SAT.Response();
            var testString = getTestString(collider.type, other.type);
            
            if( SAT[testString](collider.sat, other.sat, response) ) {
                exports.emit("collision", collider, other, response, cancel);
                
                if(br) {
                    break loop;
                }
            }
        }
        
        return this;
    }
    
    
    
    
    
    
    
    
    
    
    /********************
     * Collider Classes *
     ********************/
    
    
    
    var Collider = exports.Collider = function(type, sat, options) {
        if(!options) options = {};
        
        this.type = type;
        this.data = data;
        this.sat = sat;
        
        updateAABB(this, sat);
        
        if(options.insert !== false) exports.rbush.insert(this);
        
        return this;
    }
    
    Collider.prototype.update = function() {
        exports.rbush.remove(this);
        updateAABB(this, this.sat);
        exports.rbush.insert(this);
        
        return this;
    }
    
    Collider.prototype.moveTo = function(x, y) {
        this.sat.pos.x = x;
        this.sat.pos.y = y;
        
        return this.update();
    }
    
    Collider.prototype.move = Collider.prototype.moveBy = function(x, y) {
        return this.moveTo(this.sat.pos.x + x, this.sat.pos.y + y);
    }
    
    Collider.prototype.setData = function(data) {
        this.data = data;
        
        return this;
    }
    
    Collider.extend = Util.extendProto;
    
    
    
    exports.Polygon = Collider.extend({
        constructor: function(pos, point, options) {
            var sat = new SAT.Polygon(pos, points);
            Collider.call(this, "polygon", sat, options);
            
            return this;
        },
        
        setPoints: function(points) {
            this.sat.setPoints(points);
            return this.update();
        },

        setAngle: function(angle) {
            this.sat.setAngle(angle);
            return this.update();
        },

        setOffset: function(offset) {
            this.sat.setOffset(offset);
            return this.update();
        },

        rotate: function(angle) {
            this.sat.rotate(angle);
            return this.update();
        },
        
        translate: function(x, y) {
            this.sat.translate(x, y);
            return this.update();
        }
    });
    
    
    
    exports.Circle = Collider.extend({
        constructor: function(pos, r, options) {
            var sat = new SAT.Cirle(pos, r);
            Collider.call(this, "circle", sat, options);
            
            return this;
        }
    });
    
    
    
    
    exports.Point = Collider.extend({
        constructor: function(x, y, options) {
            var sat = new (SAT.Box(new SAT.Vector(x, y), 1, 1)).toPolygon();
            Collider.apply(this, "point", sat, options);
            
            return this;
        }
    });

    
    
    
    exports.Box = Collider.extend({
        constructor: function(pos, w, h, options) {
            var sat = (new SAT.Box(pos, w, h)).toPolygon();
            Collider.apply(this, "box", sat, options);
            
            return this;
        }
    });
    

    




    return exports;
    
});
