define(["../clock/index", "../events/index", "../util/index", "./types.js"], function(Clock, Events, Util, registerDefaultTypes) {
    "use strict";
    
    
    var exports = {};
    var Types = {};
    var Metrics = {};
    
    
    exports.register = exports.registerType = function(name, init) {
        Types[name] = init;
        
        return this;
    }
    
    exports.get = exports.metric = exports.getMetric = function(name) {
        return Metrics[name];
    }
    
    exports.track = exports.createTracker = function(name, type) {
        var exp = {
            public: {},
            tracker: {}
        }
        
        var init = Types[type];
        var args = Util.copyArray(arguments);
        args.splice(0, 2, exp);
        var res = init.apply(init, args);
        
        if(res && res.public) {
            exp.public = res.public;
        }
        if(res && res.tracker) {
            exp.tracker = res.tracker;
        }
        
        Metrics[name] = public;
        
        return tracker;
    }
    
    
    
    registerDefaultTypes(exports);
    
    
    
    
    
    
    
    
    /*
    
    // metrics/types.js
    Metrics.registerType("durations", function(public, tracker) {
        var stopwatch = Clock.stopwatch();
        
        public.times = [];
        
        public.averageTime = function() {
            var sum = 0;
            for(var i = 0, len = public.times.length; i < len; i++) {
                sum += public.times[i];
            }
            
            return sum / public.times.length;
        }
        
        
        tracker.start = function() {
            stopwatch.start();
            
            return this;
        }
        
        tracker.stop = function(restart) {
            stopwatch.stop();
            public.time.push(stopwatch.time());
        }
    });
    
    
    // loop/index.js
    var tracker = Metrics.track("loop", "durations");
    // ...
    tracker.start();
    scope.emit("before");
    // ...
    scope.emit("after");
    tracker.stop();
    
    
    // analyze-metrics.js
    var loop = Metrics.metric("loop");
    loop.times //[num, num, num, ...]
    loop.averageTime //num
    
    */
    
    
    
    
    return exports;
    
});