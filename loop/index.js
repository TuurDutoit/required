define(["../events/index", "../metrics/index"], function(Events, Metrics) {
    "use strict";
    
    
    var exports = {};
    var scope = Events.scope("loop");
    var metric = Metrics.track("loop", "durations");
    var stop = false;
    var AF;


    exports.start = function() {
        metric.start();
        scope.emit("before");
        scope.emit("update");
        scope.emit("clear");
        scope.emit("draw");
        if(!stop) AF = requestAnimationFrame(exports.start);
        scope.emit("after");
        metric.tick();

        return this;
    }

    exports.stop = exports.pause = function() {
        stop = true;
        cancelAnimationFrame(AF);
        metric.pause();

        return this;
    }

    exports.register = function(event, cb) {
        scope.on(event, cb);

        return this;
    }
    
    
    return exports;
    
    
});