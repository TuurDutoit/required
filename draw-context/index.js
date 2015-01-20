define(["../viewport/index", "../util/index"], function(Viewport, Util) {
    
    
    var exports = {};
    var X = exports.x = 0;
    var Y = exports.y = 0;
    
    var ctx = Viewport.context;
    var defaults = {
        fillStyle: "#000",
        font: "10px sans-serif",
        lineCap: "butt",
        lineDashOffset: 0,
        lineJoin: "miter",
        lineWidth: 1,
        miterLimit: 10,
        shadowBlur: 0,
        shadowColor: "rgba(0, 0, 0, 0)",
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        strokeStyle: "#000",
        textAlign: "start",
        textBaseline: "alphabetic",
        setLineDash: []
    };
    
    var funcNames = /^(setLineDash)$/;
    var resetDefaults = function() {
        for(name in defaults) {
            if(funcNames.test(name)) {
                ctx[name](defaults[name]);
            }
            else {
                ctx[name] = defaults[name];
            }
        }
    }
    
    
    
    
    
    exports.set = exports.setPosition = function(x, y) {
        exports.x = x;
        exports.y = y;
        
        return this;
    }
    
    exports.setDefault = function(name, val) {
        defaults[name] = val;
        
        return this;
    }
    
    exports.setDefaults = function(def) {
        Util.extend(defaults, def);
        
        return this;
    }
    
    exports.draw(drawable) {
        if(drawable.draw) {
            drawable.draw(Context);
        }
        else {
            drawable(Context);
        }
        
        resetDefaults;
    }
    
    
    
    
    var Context = exports.context = {
        fillStyle: function(style) {
            ctx.fillStyle = style;
            return this;
        },

        font: function(font) {
            ctx.font = font;
            return this;
        },

        lineCap: function(cap) {
            ctx.lineCap = cap;
            return this;
        },

        lineDashOffset: function(offset) {
            ctx.lineDashOffset = offset;
            return this;
        },

        lineJoin: function(join) {
            ctx.lineJoin = join;
            return this;
        },

        linWidth: function(width) {
            ctx.lineWidth = width;
            return this;
        },

        miterLimit: function(limit) {
            ctx.miterLimit = limit;
            return this;
        },

        shadowBlur: function(level) {
            ctx.shadowBlur = level;
            return this;
        },

        shadowColor: function(color) {
            ctx.shadowColor = color;
            return this;
        },

        shadowOffsetX: function(offset) {
            ctx.shadowOffsetX = offset;
            return this;
        },

        shadowOffsetY: function(offset) {
            ctx.shadowOffsetY = offset;
            return this;
        },

        shadow: function(offsetX, offsetY, blur, color) {
            ctx.shadowOffsetX = offsetX;
            ctx.shadowOffsetY = offsetY;
            ctx.shadowBlur = blur;
            ctx.shadowColor = color;
            return this;
        },

        strokeStyle: function(style) {
            ctx.strokeStyle = style;
            return this;
        },

        textAlign: function(align) {
            ctx.textAlign = align;
            return this;
        },

        textBaseline: function(baseline) {
            ctx.textBaseline = baseline;
            return this;
        },

        text: function(align, baseline) {
            ctx.align = aling;
            ctx.baseline = baseline;
            return this;
        },




        arc: function(x, y, radius, start, end, anti) {
            ctx.arc(x+X, y+Y, radius, start, end, anti);
            return this;
        },

        arcTo: function(x1, y1, x2, y2, radius) {
            ctx.arcTo(x1+X, y1+Y, x2+X, y2+Y, radius);
            return this;
        },

        beginPath: function() {
            ctx.beginPath();
            return this;
        },

        bezierCurveTo: function(cp1x, cp1y, cp2x, cp2y, x, y) {
            ctx.bezierCurveTo(cp1x+X, cp1y+Y, cp2x+X, cp2y+Y, x+X, y+Y);
            return this;
        },

        clip: function(path, fillRule) {
            ctx.clip(path, fillRule);
            return this;
        },

        closePath: function() {
            ctx.closePath();
            return this;
        },

        createImageData: function(width, height) {
            return ctx.createImageData(width, height);
        },

        createLinearGradient: function(x1, y1, x2, y2) {
            return ctx.createLinearGradient(x1, y1, x2, y2);
        },

        createPattern: function(image, repetition) {
            return ctx.createPattern(image, repetition);
        },
        
        createRadialGradient: function(x1, y1, r1, x2, y2, r2) {
            return ctx.createRadialGradient(x1, y1, r1, x2, y2, r2);
        },
        
        drawImage: function(image, sx, sy, sw, sh, dx, dy, dw, dh) {
            switch(arguments.length) {
                case 3:
                case 5:
                    ctx.drawImage(image, sx+X, sy+Y, sw, sh);
                    break;
                case 9:
                    ctx.drawImage(image, sx, sy, sw, sh, dx+X, dy+Y, dw, dh);
            }
            
            return this;
        },
        
        fill: function() {
            ctx.fill();
            return this;
        },
        
        fillRect: function(x, y, w, h) {
            ctx.fillRect(x+X, y+Y, w, h);
            return this;
        },
        
        fillText: function(text, x, y, w) {
            ctx.fillText(text, x+X, y+Y, w);
            return this;
        },
        
        getImageData: function(x, y, w, h) {
            return ctx.getImageData(x+X, y+Y, w, h);
        },
        
        getLineDash: function() {
            return ctx.getLineDash();
        },
        
        isPointInPath: function(path, x, y, fillRule) {
            switch(arguments.length) {
                case 2:
                case 3:
                    return pointInPath = ctx.isPointInPath(path+X, x+Y, y);
                case 4:
                    return pointInPath = ctx.isPointInPath(path, x+X, y+Y, fillRule);
            }
        },
        
        isPointInStroke: function(path, x, y) {
            switch(arguments.length) {
                case 2:
                    return ctx.isPointInStroke(path+X, x+Y);
                case 3:
                    return ctx.isPointInStroke(path, x+X, y+Y);
            }
        },
        
        measureText: function(text) {
            return ctx.measureText(text);
        },
        
        moveTo: function(x, y) {
            ctx.moveTo(x+X, y+Y);
            return this;
        },
        
        putImageData: function(image, x, y, dx, dy, dw, dh) {
            ctx.putImageData(image, x+X, y+Y, dx, dy, dw, dh);
            return this;
        },
        
        quadraticCurveTo: function(cpx, cpy, x, y) {
            ctx.quadraticCurveTo(cpx+X, cpy+Y, x+X, y+Y);
            return this;
        },
        
        rect: function(x, y, w, h) {
            ctx.rect(x+X, y+Y, w, h);
            return this;
        }, 
        
        restore: function() {
            ctx.restore();
            return this;
        },
        
        save: function() {
            ctx.save();
            return this;
        },
        
        setLineDash: function(segments) {
            ctx.setLineDash(segments);
            return this;
        },
        
        stroke: function(path) {
            ctx.stroke(path);
            return this;
        },
        
        strokeRect: function(x, y, w, h) {
            ctx.strokeRect(x+X, y+Y, w, h);
            return this;
        },
        
        strokeText: function(text, x, y, w) {
            ctx.strokeText(text, x+X, y+Y, w);
            return this;
        },
        
        
        
        
        
        clipRect: function(x, y, w, h) {
            this.rect(x, y, w, h);
            ctx.clip();
            return this;
        },
        
        circle: function(x, y, r, anti) {
            ctx.arc(x+X, y+Y, r, 0, 2*Math.PI, anti);
            return this;
        },
        
        fillCircle: function(x, y, r, anti) {
            this.circle(x, y, r, anti);
            ctx.fill();
            return this;
        },
        
        strokeCircle: function(x, y, r, anti) {
            this.circle(x, y, r, anti);
            ctx.stroke();
            return this;
        },
        
        clipCircle: function(x, y, r, anti) {
            this.circle(x, y, r, anti);
            ctx.clip();
            return this;
        }
    }
    
    
});