define(["../clock/index", "../events/index"], function(Clock, Events) {
    "use strict";
    
    
    var exports = {};
    
    
    /**
     * LOOP
     *
     * Time metrics on the Loop module
     */

    var loopTimes = [];
    var loopStopwatch = Clock.stopwatch();


    Events.on("loop:before", function() {
        loopStopwatch.start();
    });

    Events.on("loopafter", function() {
        var time = loopStopwatch.stop().time;
        loopTimes.push(time);
    });

    
    
    exports.loop = {
        getTimes: function() {
            return loopTimes;
        },
        getAverageTime: function() {
            var sum = 0;
            for(var i = 0, len = loopTimes.length; i < len; i++) {
                sum += loopTimes[i];
            }
            return sum / loopTimes.length;
        }
    }
    
    
    
    
    return exports;
    
});