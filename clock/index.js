define(["../events/index", "../util/index"], function(Events, Util) {
    "use strict";
    
    
    var exports = {};
    var EventEmitter = Events.EventEmitter;



    /**
     * Stopwatch
     *
     * Records how much time (in ms) has passed
     * Can be started, paused and stopped
     * By default, a stopwatch starts immediately. Pass in 'false' to not do this
     */

    var Stopwatch = function(autoStart) {
        EventEmitter.call(this);

        this._time = 0;
        this.startTime = null;
        this.pauseTime = null;
        this.status= "stopped";

        if(autoStart) {
            this.start();
        }

        return this;
    }

    Util.inherits(Stopwatch, EventEmitter);


    Stopwatch.prototype.start = function() {
        if(this.status === "stopped") {
            this.time = 0;
        }
        
        if(this.status !== "running") {
            this.emit("start");
            this.status = "running";
            this.pauseTime = null;
            this.startTime = exports.now();
        }

        return this;
    }

    Stopwatch.prototype.pause = function() {
        if(this.status === "running") {
            this.emit("pause");
            this.pauseTime = exports.now();
            this._time += this.pauseTime - this.startTime;
            this.startTime = null;
            this.status = "paused";
        }

        return this;
    }
    
    Stopwatch.prototype.clear = function() {
        // this._time is not cleared; that way, you can still read it after a stop()
        this.emit("clear");
        this.startTime = null;
        this.pauseTime = null;
        this.status = "stopped";
        
        return this;
    }

    Stopwatch.prototype.stop = function(restart) {
        this.emit("stop");
        this.clear();

        if(restart) {
            this.emit("restart");
            this.start();
        }

        return this;
    }

    Stopwatch.prototype.restart = function() {
        this.stop(true);

        return this;
    }
    
    Stopwatch.prototype.time = function() {
        if(this.status === "running") {
            return this._time + (exports.now() - this.startTime);
        }
        else {
            return this._time;
        }
    }



    exports.stopwatch = exports.time = function(autoStart) {
        return new Stopwatch(autoStart);
    }
    
    
    
    
    
    /**
     * FrameStopwatch
     *
     * A stopwatch that works with the time of the frame
     * This allows all animations etc. to run exactly simultaneously
     */
    
    var FrameStopwatch = function(autoStart) {
        EventEmitter.call(this);
        
        this._time = 0;
        this.startTime = null;
        this.pauseTime = null;
        this.status = "stopped";
        
        if(autoStart) {
            this.start();
        }
        
        return this;
    }
    
    Util.inherits(FrameStopwatch, EventEmitter);
    
    
    FrameStopwatch.prototype.start = function() {
        if(this.status !== "running") {
            this.emit("start");
            this.startTime = exports.frameTime;
            this.pauseTime = null;
            this.status = "running";
        }
        
        return this;
    }
    
    FrameStopwatch.prototype.pause = function() {
        if(this.status === "running") {
            this.emit("pause");
            this.pauseTime = exports.frameTime;
            this._time += this.pauseTime - this.startTime;
            this.startTime = null;
            this.status = "paused";
        }
        
        return this;
    }
    
    FrameStopwatch.prototype.clear = function() {
        // this._time is not cleared; that way, you can still read it after a stop()
        this.emit("clear");
        this.startTime = null;
        this.pauseTime = null;
        this.status = "stopped";
        
        return this;
    }
    
    FrameStopwatch.prototype.stop = function(restart) {
        this.emit("stop");
        this.clear();

        if(restart) {
            this.emit("restart");
            this.start();
        }

        return this;
    }
    
    FrameStopwatch.prototype.restart = function() {
        this.stop(true);
        
        return this;
    }
    
    FrameStopwatch.prototype.time = function() {
        if(this.status === "running") {
            return this._time + (exports.frameTime - this.startTime);
        }
        else {
            return this._time;
        }
    }
    
    
    exports.frameStopwatch = function(autoStart) {
        return new FrameStopwatch(autoStart);
    }





    /**
     * Timer
     *
     * Emits a 'end' event when the specified time (in ms) has passed
     * Basically setTimeout
     */

    var Timer = function(time, cb) {
        EventEmitter.call(this);
        if(typeof time === "function") {
            cb = time;
            time = null;
        }
        
        this.running = false;
        
        if(typeof time === "number") {
            this.start(time);
        }

        if(cb) {
            this.on("end", cb);
        }

        return this;
    }
    
    Timer.prototype.start = function(time) {
        if(!this.running) {
            this.running = true;

            var self = this;
            this._timeout = setTimeout(function() {
                self.running = false;
                self.emit("end", time);
            });
        }
        
        return this;
    }
    
    Timer.prototype.clear = function(time) {
        this.removeAllListeners();
        clearTimeout(this._timeout);
        this.running = false;
        
        if(typeof time === "number") {
            this.start(time);
        }
        
        return this;
    }

    Util.inherits(Timer, EventEmitter);



    exports.timer = function(time, cb) {
        return new Timer(time, cb);
    }





    /**
     * Clock.now()
     *
     * Returns the current time
     * Preferably from performance.now(), and if that's not supported, from Date.now()
     */

    exports.now = function() {
        //iife
        if(performance && performance.now) {
            return function() {
                return performance.now();
            }
        }
        else {
            return Date.now;
        }
    }();
    
    
    
    
    /**
     * Clock.frameTime
     *
     * At the beginning of every frame, the current time is saved
     * With frameTime you can get that time (which will be the same during the whole frame)
     * This is used by FrameStopwatch
     */
    
    var frameTime = exports.now();
    Events.on("loop:before", function() {
        frameTime = exports.now();
    });
    
    exports.frameTime = function() {
        return frameTime;
    }
    
    


    

    return exports;




});