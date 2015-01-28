define(["./rbush", "./SAT"], function(RBush, SAT) {
    
    
    var exports = {};

    
    var getAABBPolygon = function(aabb, collider) {
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
        
        aabb[0] = xMin;
        aabb[1] = yMin;
        aabb[2] = xMax;
        aabb[3] = yMax;
    }
    
    var updateAABBCircle = function(aabb, collider) {
        var r = collider.r;
        var center = collider.pos;

        aabb[0] = center.x - r;
        aabb[1] = center.y - r;
        aabb[2] = center.x + r;
        aabb[3] = center.y + r;
    }

    var getAABBPolygon = function(collider) {
        return updateAABBPolygon([], collider);
    }

    var getAABBCircle = function(collider) {
        return updateAABBCircle([], collider);
    }



    

    exports.SAT = SAT;
    exports.RBush = RBush;
    exports.rbush = null;

    exports.init = function(maxEntries) {
        exports.rbush = new RBush(maxEntries);

        return this;
    }

    exports.test = function(collider) {
        var possible = exports.rbush.search(collider.rbush);
        var responses = [];

        for(var i = 0, len = possible.length; i < len; i++) {
            var other = possible[i];
            switch(collider.type) {
                case "polygon":
                    switch(other.type) {
                        case "polygon":
                            responses.push(SAT.)
                    }
            }
        }
    }

    exports.testPolygon = function(collider) {
        var possible = exports.rbush.search(collider.rbush);
        var responses = [];

        for(var i = 0, len possible.length; i < len; i++) {
            var other = possible[i];
            var response = new SAT.Response();
            switch(other.type) {
                case "polygon":
                    SAT.testPolygonPolygon(collider, other, response) ? responses.push(response);
                    break;
                case "circle":
                    
                    break;
            }
        }
    }
    
    
    
    
    
    var Polygon = exports.Polygon = function(pos, points) {
        this.type = "polygon";
        this.sat = new SAT.Polygon(pos, points);
        this.rbush = getAABBPolygon(this.sat);
        exports.rbush.insert(this.rbush);

        return this;
    }

    Polygon.prototype.update = function() {
        this.sat.recalc();
        exports.rbush.remove(this.rbush);
        updateAABBPolygon(this.rbush, this.sat);
        exports.rbush.insert(this.rbush);

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

    Polygon.prototype.rotateTo = function(angle) {
        this.sat.angle = angle;
        return this.update();
    }

    Polygon.prototype.rotate = Polygon.rotateBy = function(angle) {
        return this.rotateTo(this.sat.angle + angle);
    }



    var Circle = exports.Circle = function(pos, r) {
        this.type = "circle";
        this.sat = new SAT.Circle(pos, r);
        this.rbush = getAABBCircle(this.sat);
        exports.rbush.insert(this.rbush);

        return this;
        
    }

    Circle.prototype.update = function() {
        exports.rbush.remove(this.rbush);
        updateAABBCircle(this.rbush, this.sat);
        exports.rbush.insert(this.rbush);

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
    

    




    return exports;
    
});
