define(["../clock/index"], function(Clock) {
    "use strict";
    
    
    
    var createGetTime = function(useFrameTime) {
        return useFrameTime ? function() { return Clock.frameTime(); }  :  function() { return Clock.now(); };
    }
    
    
    
    return function(Metrics) {
        
        Metrics.register("duration", function(exports, useFrameTime) {
            var tracker = exports.tracker;
            var stopwatch = useFrameTime ? Clock.frameStopwatch : Clock.stopwatch();
            
            tracker.start = function() {
                stopwatch.start();
                
                return this;
            }
            
            tracker.pause = function() {
                stopwatch.pause();
                
                return this;
            }
            
            tracker.tick = tracker.stop = function() {
                stopwatch.stop();
                exports.public = stopwatch.time();
                
                return this;
            }
        });
        
        
        Metrics.register("durations", function(exports, useFrameTime) {
            var public = exports.public;
            var tracker = exports.tracker;
            var stopwatch = useFrameTime ? Clock.frameStopwatch : Clock.stopwatch();
            
            
            public.durations = [];
            
            public.getAverageDuration = function() {
                var sum = 0;
                for(var i = 0, len = public.durations.length; i < len; i++) {
                    sum += public.durations[i];
                }
                
                return sum / public.durations.length;
            }
            
            
            tracker.start = function() {
                stopwatch.start();
                
                return this;
            }
            
            tracker.pause = function() {
                stopwatch.pause();
                
                return this;
            }
            
            tracker.stop = function() {
                stopwatch.stop();
                
                return this;
            }
            
            tracker.tick = function() {
                public.durations.push(stopwatch.time());
                
                return this;
            }
        });
        
        
        Metrics.register("durationsNamed", function(exports, useFrameTime) {
            var public = exports.public;
            var tracker = exports.tracker;
            var stopwatch = useFrameTime ? Clock.frameStopwatch() : Clock.stopwatch();
            
            
            public.durations = {};
            
            public.getAverageDuration = function() {
                var sum = 0;
                var names = Object.keys(public.durations);
                
                for(var name in public.durations) {
                    sum += public.durations[name];
                }
                
                return sum / names.length;
            }
            
            
            tracker.start = function() {
                stopwatch.start();
                
                return this;
            }
            
            tracker.pause = function() {
                stopwatch.pause();
                
                return this;
            }
            
            tracker.stop = function() {
                stopwatch.stop();
                
                return this;
            }
            
            tracker.tick =function(name) {
                public.durations[name] = stopwatch.time();
                
                return this;
            }
        });
        
        
        Metrics.register("time", function(exports, useFrameTime) {
            var tracker = exports.tracker;
            var getTime = createGetTime(useFrameTime);
            
            
            tracker.tick = tracker.stop = function() {
                exports.public = getTime();
            }
        });
        
        Metrics.register("times", function(exports, useFrameTime) {
            var tracker = exports.tracker;
            var public = exports.public;
            var getTime = createGetTime(useFrameTime);
            
            
            public.times = [];
            
            
            tracker.tick = tracker.stop = function() {
                public.times.push(getTime());
            }
        });
        
        Metrics.register("timesNamed", function(exports, useFrameTime) {
            var tracker = exports.tracker;
            var public = exports.public;
            var getTime = createGetTime(useFrameTime);
            
            
            public.times = {};
            
            
            tracker.tick = tracker.stop = function(name) {
                public.times[name] = getTime();
            }
        })
        
        
        
        
    }
});