define(["../events/index", "../collisions/index"], function(Events, Collisions) {
    
    
    var polygonRegExp = /^(polygon|box|point)$/;
    var moveRegExp = /^(move|rotate|origin)$/;
    
    var checkSolid = function(a, b, res, cancel) {
        if(a.solid && b.solid) {
            a.moveBy(-res.overlapV.x, -res.overlapV.y);
            return cancel();
        }
    }
    
    var moveListener = function(collider) {
        Collisions.test()
    }
    
    
    var exports = Events.EventEmitter.extend({
        constructor: function() {
            Events.EventEmitter.call(this);
            
            this.x = 0;
            this.y = 0;
            this.w = 1;
            this.h = 1;
            this.rotation = 0;
            this.origin: new Collisions.Vector();
            
            this.children = [];
            this.parent = null;
            this.collider = null;
            this.solid = true;
            
            return this;
        },
        
        setSolid: function(solid) {
            if(solid) {
                this.solid = true;
                this.on("collision", checkSolid);
            }
            else {
                this.solid = false;
                this.off("collision", checkSolid);
            }
            
            return this;
        },
        
        setParent: function(parent) {
            var old = this.parent;
            this.parent = parent;
            this.emit("parent", parent, old);
            
            return this;
        },
        
        addChild: function(child, index) {
            this.children.splice(index, 0, child);
            this.emit("children:add", child, index);
            
            return this;
        },
        
        appendChild: function(child) {
            this.children.push(child);
            this.emit("children:add", child, this.children.length - 1);
            
            return this;
        },
        
        prependChild: function(child) {
            this.children.unshift(child);
            this.emit("children:add", child, 0);
            
            return this;
        },
        
        getChild: function(index) {
            return this.children[index];
        },
        
        getChildIndex: function(child) {
            return this.children.indexOf(child);
        },
        
        removeChildAt: function(index) {
            var removed = this.splice(index, 1);
            this.emit("children:remove", removed[0], index);
            
            return this;
        },
        
        removeChild: function(child) {
            var index = this.getChildIndex(child);
            
            if(index > -1) {
                this.removeChildAt(index);
            }
            
            return this;
        },
        
        getTopParent: function() {
            var curr = this;
            
            while(curr.parent) {
                curr = curr.parent;
            }
            
            return curr;
        },
        
        moveTo: function(x, y) {
            if(this.collider) {
                this.collider.moveTo(x, y);
                this.emit("move:to", x, y);
            }
            
            return this;
        },
        
        moveBy: function(x, y) {
            if(this.collider) {
                this.collider.moveBy(x, y);
                this.emit("move:by", x, y);
            }
            
            return this;
        },
        
        rotateTo: function(angle) {
            this.rotation = angle;
            
            if(this.collider && polygonRegExp.test(this.collider.type)) {
                this.collider.setAngle(angle);
            }
            
            this.emit("rotate:to", angle);
            
            return this;
        },
        
        rotateBy: function(angle) {
            this.rotation += angle;
            
            if(this.collider && polygonRegExp.test(this.collider.type)) {
                this.collider.setAngle(this.rotation);
            }
            
            this.emit("rotate:by", angle);
            
            return this;
        },
        
        moveOriginTo: function(x, y) {
            this.origin.x = x;
            this.origin.y = y;
            
            if(this.collider && polygonRegExp.test(this.collider.type)) {
                this.collider.setOffset(this.origin);
            }
            
            this.emit("origin:to", x, y);
            
            return this;
        },
        
        moveOriginBy: function(x, y) {
            this.origin.x += x;
            this.origin.y += y;
            
            if(this.collider && polygonRegExp.test(this.collider.type)) {
                this.collider.setOffset(this.origin);
            }
            
            this.emit("origin:by", x, y);
            
            return this;
        }
    });
    
    var Node = exports.prototype;
    
    Node.move = Node.moveBy;
    Node.rotate = Node.rotateBy;
    Node.moveOrigin = Node.moveOriginBy;
    Node.add = Node.addChild;
    Node.append = Node.appendChild;
    Node.prepend = Node.prependChild;
    Node.remove = Node.removeChild;
    Node.removeAt = Node.removeChildAt;
    Node.get = Node.getChild;
    
    
    
    
    Events.on("collisions:collision", function(a, b, res, cancel) {
        if(a.data instanceof exports && b.data instanceof exports) {
            var cancelled = false;
            a.emit("collision", a.data, b.data, res, function() {
                cancelled = true;
                return cancel();
            });
            
            return cancelled;
        }
    });
    
    
    
    return exports;
    
    
});