define(["../events/index"], function(Events) {
    "use strict";
    
    
    /**
     * Vars
     * ============================================================================================
     */
    
    var exports = {};
    var scope = Events.scope("keys");
    
    var activeKeys = [];
    var aliases = {};
    var modifiersArr = [];
    
    var modifiersMap = {
        shift: false,
        ctrl: false,
        alt: false,
        meta: false
    };
    
    var namesToCodes = {
        backspace: 8,
        tab: 9,
        clear: 12,
        enter: 13,
        return: 13,
        shift: 16,
        ctrl: 17,
        alt: 18,
        pause: 19,
        left: 37,
        up: 38,
        right: 39,
        down: 40
    };
    
    
    var codesToNames = {};
    for(var name in namesToCodes) {
        var code = namesToCodes[name];
        if(!codesToNames[code]) {
            codesToNames[code] = [];
        }
        codesToNames[code].push(name);
    }
    
    
    
    /**
     * Utils
     * ============================================================================================
     */
    
    var removeDuplicates = function(arr) {
        var result = [];
        for(var i = 0, len = arr.length; i < len; i++) {
            if(result.indexOf(arr[i]) === -1) {
                result.push(arr[i]);
            }
        }
        
        return result;
    }
    
    
    var updateModifiers = function(e) {
        modifiersMap.shift = e.shiftKey;
        mosifiersMap.ctrl = e.ctrlKey;
        modifiersMap.alt = e.altKey;
        modifiersMap.meta = e.metaKay;
        
        // Empty modifiers array
        for(var i = 0, len = modifiersArr.length; i < len; i++) {
            modifiersArr.pop();
        }
        
        // And update it
        for(mod in modifiersMap) {
            if(modifiersMap[mod]) {
                modifiersArr.push(mod);
            }
        }
    }
    
    
    
    
    /**
     * API
     * ============================================================================================
     */
    
    exports.on = exports.bind = function(event, down, up) {
        if(event instanceof Array) {
            for(var i = 0, len = event.length; i < len; i++) {
                Keys.on(event[i], down, up);
            }
        }
        else {
            var sane = event.trim().replace(/ {2,}/g, " ");
            if(down) scope.on("down:"+sane, down);
            if(up) scope.on("up:"+sane, up);
        }
        
        return this;
    }
    
    exports.names(code) {
        return typeof code === "number" ? (codesToNames[code] || [code+""]) : [code];
    }
    
    exports.namesArr = function(arr) {
        var exports = [];
        for(var i = 0, len = arr.length; i < len; i++) {
            exports.push.apply(result, result.names(arr[i]));
        }
        
        return removeDuplicates(result);
    }
    
    exports.code(name) {
        if(typeof name === "string") {
            if(namesToCodes[name]) {
                return namesToCodes[name];
            }
            else {
                try{
                    var name = parseInt(name);
                    return name;
                }
                catch(e) {
                    return  null;
                }
            }
        }
        else {
            return name;
        }
    }
    
    exports.codeArr = function(arr) {
        var result = [];
        for(var i = 0, len = arr.length; i < len; i++) {
            result.push(exports.code(arr[i]));
        }
        
        return removeDuplicates(result);
    }
    
    exports.aliases = function(code, addSelf) {
        if(!aliases[code]) {
            aliases[code] = [];
        }
        
        var result = aliases[code];
        if(addSelf) {
            result.unshift(code);
        }
        
        return result;
    }
    
    exports.aliasesArr = function(arr, addSelf) {
        var result = [];
        for(var i = 0, len = arr.length; i < len; i++) {
            result.push.apply(result, exports.aliases(arr[i]));
        }
        
        if(addSelf) {
            result.unshift.apply(result, arr);
        }
        
        return removeDuplicates(result);
    }
    
    exports.modifiers = function(e, map) {
        if(e) {
            updateModifiers(e);
        }
        
        return map ? modifiersMap : modifiersArr;
    }
    
    exports.modifiersMap = function() {
        return modifiersMap;
    }
    
    exports.modifiersArr = function() {
        return modifiersArr;
    }
    
    exports.isActive = function(code) {
        if(code === "shift" || code === "ctrl" || code === "alt" || code === "meta") {
            return modifiers[code];
        }
        else if(typeof code === "string") {
            code = exports.code(code);
        }
        
        return activeKeys.indexOf(code) > -1;
    }
    
    
    
    
    
    document.addEventListener("keydown", function(e) {
        updateModifiers(e);
        var code = e.keyCode;
        var keys = exports.aliases(code);
        var names = exports.namesArr(keys);
        var modifiers = exports.modifiersArr().join("+");
        var prefix = "down:"+modifiers+"+";
        
        for(var i = 0, len = keys.length; i < len; i++) {
            actievKeys[keys[i]] = true;
            scope.emit(prefix+keys[i], e);
        }
    });
    
    
    document.addEventListener("keyup", function(e) {
        updateModifiers(e);
        var code = e.keyCode;
        var keys = exports.aliases(code);
        var names = exports.namesArr(keys);
        var modifiers = exports.modifiersArr().join("+");
        var prefix = "up:"+modifiers+"+";
        
        for(var i = 0, len = keys.length; i < len; i++) {
            actievKeys[keys[i]] = false;
            scope.emit(prefix+keys[i], e);
        }
    });
    
    
    
    
    
    
});