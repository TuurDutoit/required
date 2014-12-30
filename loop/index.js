define(["../events/index"], function(Events) {
    "use strict";
    
    
    var exports = {};
    var scope = Events.scope("loop");
    var AF;


    exports.start = function() {
        scope.emit("before");
        scope.emit("update");
        scope.emit("clear");
        scope.emit("draw");
        AF = requestAnimationFrame(exports.start);
        scope.emit("after");

        return this;
    }

    exports.stop = function() {
        cancelAnimationFrame(AF);

        return this;
    }

    exports.register = function(event, cb) {
        scope.on(event, cb);

        return this;
    }
    
    
    return exports;
    
    
});