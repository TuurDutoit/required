define(["./rbush", "./SAT"], function(RBush, SAT) {
    "use strict";
    
    
    var exports = {};

    
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
        
        aabb[0] = pos + xMin;
        aabb[1] = pos + yMin;
        aabb[2] = pos + xMax;
        aabb[3] = pos + yMax;
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
    exports.V = exports.Vector = SAT.Vector;

    
    exports.init = function(maxEntries) {
        exports.rbush = new RBush(maxEntries);

        return this;
    }

    
    exports.test = function(collider) {
        switch(collider.type){
            case "polygon":
                return exports.testPolygon(collider);
            case "circle":
                return exports.testCircle(collider);
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
                    if(SAT.testPolygonPolygon(collider, other, response)) {
                        responses.push(response);
                    }
                    break;
                case "circle":
                    if(SAT.testPolygonCircle(collider, other, response)) {
                        responses.push(response);
                    }
                    break;
            }
        }
                    
        return responses;
    }
    
    exports.testCircle = function(collider) {
        var possible = exports.rbush.search(collider.rbush);
        var responses = [];

        for(var i = 0, len possible.length; i < len; i++) {
            var other = possible[i];
            var response = new SAT.Response();
            switch(other.type) {
                case "polygon":
                    if(SAT.testCirclePolygon(collider, other, response)) {
                        responses.push(response);
                    }
                    break;
                case "circle":
                    if(SAT.testCircleCircle(collider, other, response)) {
                        responses.push(response);
                    }
                    break;
            }
        }
                    
        return responses;
    }
    
    
    exports.load = function(colliders) {
        var items = [];
        for(var i = 0, len = colliders.length; i < len; i++) {
            items.push(colliders[i].rbush);
        }
        
        exports.rbush.load(items);
        
        return this;
    }
    
    
    
    
    
    
    
    var Polygon = exports.Polygon = function(pos, points, insert) {
        this.type = "polygon";
        this.sat = new SAT.Polygon(pos, points);
        this.rbush = getAABBPolygon(this.sat);
        if(insert !== false) exports.rbush.insert(this.rbush);

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



    var Circle = exports.Circle = function(pos, r, insert) {
        this.type = "circle";
        this.sat = new SAT.Circle(pos, r);
        this.rbush = getAABBCircle(this.sat);
        if(insert !== false) exports.rbush.insert(this.rbush);

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
