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

        this.time = 0;
        this.startTime = null;
        this.pauseTime = null;
        this.status= "stopped";

        if(autoStart !== false) {
            this.start();
        }

        return this;
    }

    Util.inherits(Stopwatch, EventEmitter);


    Stopwatch.prototype.start = function() {
        if(this.status === "stopped") {
            this.time = 0;
        }
        this.status = "running";
        this.pauseTime = null;
        this.startTime = exports.now();
        this.emit("start");

        return this;
    }

    Stopwatch.prototype.pause = function() {
        if(this.status === "running") {
            this.pauseTime = exports.now();
            this.time += this.pauseTime - this.startTime;
            this.startTime = null;
            this.status = "paused";
            this.emit("pause");
        }

        return this;
    }
    
    Stopwatch.prototype.clear = function() {
        // this.time is not cleared; that way, you can still read it after a stop()
        this.starTime = 0;
        this.startTime = 0;
        this.pauseTime = null;
        this.status = "stopped";
        this.emit("clear");
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



    exports.stopwatch = exports.time = function(autoStart) {
        return new Stopwatch(autoStart);
    }





    /**
     * Timer
     *
     * Emits a 'end' event when the specified time (in ms) has passed
     * Basically setTimeout
     */

    var Timer = function(time, cb) {
        EventEmitter.call(this);

        var self = this;
        setTimeout(function() {
            self.emit("end", time);
        });

        if(cb) {
            this.on("end", cb);
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


    

    return exports;




});