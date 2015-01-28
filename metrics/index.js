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
        var _exports = {
            public: {},
            tracker: {}
        }
        
        var init = Types[type];
        var args = Util.copyArray(arguments);
        args.splice(0, 2, exp);
        var res = init.apply(init, args);
        
        if(res && res.public) {
            _exports.public = res.public;
        }
        if(res && res.tracker) {
            _exports.tracker = res.tracker;
        }
        
        Metrics[name] = _exports.public;
        
        return _exports.tracker;
    }
    
    
    
    registerDefaultTypes(exports);
    
    
    
    
    return exports;
    
});