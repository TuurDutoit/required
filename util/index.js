define(function() {
    "use strict";
    
    
    var exports = {};
    
    
    // Sets up a prototype chain, in such a way that child inherits from parent
    // Taken from node.js
    // http://nodejs.org
    // Constructor, Contructor
    var inherits = exports.inherits = function(child, parent) {
        child._super = parent;
        child.prototype = Object.create(parent.prototype, {
            constructor: {
                value: child,
                enumerable: true,
                writable: true,
                configurable: true
            }
        });
    };

    
    // Copies properties from objects to obj
    // Taken from underscore.js
    // http://underscorejs.org
    // Object, Object,...
    var extend = exports.extend = function(obj) {
        if (typeof obj !== "object" && typeof obj !== "function") return obj;
        var source, prop;
        for (var i = 1, length = arguments.length; i < length; i++) {
          source = arguments[i];
          for (prop in source) {
            if (source.hasOwnProperty(prop)) {
                obj[prop] = source[prop];
            }
          }
        }
        return obj;
    };
    
    
    
    // Copy an Object
    var copyObject = exports.copyObject = function(obj) {
        return extend({}, obj);
    }
    
    
    // Copy an Array
    var copyArray = exports.copyArray = function(arr) {
        var res = [];
        for(var i = 0, len = arr.length; i < len; i++) {
            res[i] = arr[i];
        }
        
        return res;
    }

    
    // Sets up a prototype chain. Add this method to the parent and create a child contructor like this: var child = parent.extend(protoProps, staticProps)
    // Taken from Backbone.js (http://backbonejs.org)
    // Object: prototype, Object: staticProps
    var extendProto = exports.extendProto = function(protoProps, staticProps) {
        var parent = this;
        var child;

        // The constructor function for the new subclass is either defined by you
        // (the "constructor" property in your `extend` definition), or defaulted
        // by us to simply call the parent's constructor.
        if (protoProps && protoProps.hasOwnProperty('constructor')) {
            child = protoProps.constructor;
        }
        else {
            child = function(){ return parent.apply(this, arguments); };
        }
        
        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        inherits(child, parent);
        
        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if (protoProps) extend(child.prototype, protoProps);
        
        // Add static properties to the constructor function, if supplied.
        extend(child, parent, staticProps);
        

        return child;
    };
    
    
    return exports;
    
    
});