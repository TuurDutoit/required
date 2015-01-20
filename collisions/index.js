define(["../pool/index", "./rbush", "./SAT"], function(Pool, RBush, SAT) {
    //add(Collider, data) : Crash
    //remove(Collider) : Crash
    //removeData(data) : Crash
    //load(Array<Collider>) : Crash
    //check(Collider) : Array<SAT.Response>
    //all : Array<Collider>
    
    
    var exports = {};
    
    
    var getAABBoxPolygon = function(collider) {
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
        return new SAT.Box(collider.pos.clone().add(new SAT.Vector(xMin, yMin)), xMax - xMin, yMax - yMin);
    }
    
    var getAABBoxCircle = function(collider) {
        var r = collider.r;
        var corner = collider.pos.clone().sub(new SAT.Vector(r, r));
        return new SAT.Box(corner, r*2, r*2)
    }
    
    var getAABBox = function(collider) {
        if(collider instanceof SAT.Polygon) {
            return getAABBoxPolygon(collider);
        }
        else {
            return getAABBoxCircle(collider);
        }
    }
    
    
    exports.SAT = SAT;
    exports.RBush = RBush;
    exports.items = [];
    
    
    exports.init = function(maxEntries) {
        exports.rbush = new RBush(maxEntries, ["x1", "y1", "x2", "y2"]);
        
        return this;
    }
    
    exports.add = function(collider, data) {
        var item = {
            collider: collider,
            data: data
        };
        
        var aabb = getAABBox(collider);
        item.x1 = aabb.pos.x;
        item.y1 = aabb.pos.y;
        item.x2 = aabb.pos.x + aabb.w;
        item.y2 = aabb.pos.y + aabb.h;
        
        exports.rbush.insert(item);
        exports.items.push(item);
        
        return this;
    }
    
    exports.remove = function(collider) {
        
    }
    
    exports.removeData = function(data) {
        
    }
    
    exports.load = function(items) {
        
    }
    
    exports.check = function(collider) {
        
    }
    
    
    
    
    
    
    return Crash;
    
    
});
