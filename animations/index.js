define(["../clock/index"], function(Clock) {
    "use strict";
    
    
    var exports = {};
    
    
    var FrameByFrame = exports.FrameByFrame = function(interval, frames, autoStart) {
        this.interval = interval;
        this.frames = frames || [];
        this.timer = Clock.stopwatch();
        
        if(autoStart) {
            this.start();
        }
        
        return this;
    }
    
    FrameByFrame.prototype.start = function() {
        this.timer.start();
        
        return this;
    }
    
    FrameByFrame.prototype.pause = function() {
        this.timer.pause();
        
        return this;
    }
    
    FrameByFrame.prototype.stop = function(restart) {
        this.timer.stop(restart);
        
        return this;
    }
    
    FrameByFrame.prototype.reset = function() {
        this.timer.clear();
        
        return this;
    }
    
    FrameByFrame.prototype.clear = function() {
        this.interval = null;
        this.frames = [];
        this.timer.clear();
        
        return this;
    }
    
    FrameByFrame.prototype.addFrame = function(frame, index) {
        if(typeof index !== "number") {
            this.frames.push(frame);
        }
        else {
            this.frames.splice(index, 0, frame);
        }
        
        return this;
    }
    
    FrameByFrame.prototype.addFrames = function(frames, index) {
        if(typeof index !== "number") {
            this.frames.push.apply(this.frames, frames);
        }
        else {
            var args = [index, 0].concat(frames);
            this.frames.splice.apply(this.frames, frames);
        }
        
        return this;
    }
    
    FrameByFrame.prototype.removeFrame = function(index) {
        this.frames.splice(index, 1);
        
        return this;
    }
    
    FrameByFrame.prototype.removeFrames = function(index, amount) {
        this.frames.splice(index, amount);
        
        return this;
    }
    
    FrameByFrame.prototype.removeFramesAbsolute = function(index1, index2) {
        this.frames.splice(index1, index2 - index1);
        
        return this;
    }
    
    FrameByFrame.prototype.getFrame = function(index) {
        return this.frames[index];
    }
    
    FrameByFrame.prototype.getFrameIndex = function(frame) {
        return this.frames.indexOf(frame);
    }
    
    FrameByFrame.prototype.getCurrentIndex = function() {
        return Math.floor(this.timer.time / this.interval) % this.frames.length;
    }
    
    FrameByFrame.prototype.getCurrentFrame = function() {
        return this.getFrame(this.getCurrentIndex());
    }
    
    
    
    return exports;
    
    
});