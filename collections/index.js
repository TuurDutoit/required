define(["../util/index", "../events/index"], function(Util, Events) {
    
    
    var capitalize = function(str) {
        return str.slice(0,1).toUpperCase() + str.slice(1).toLowerCase();
    }
    
    var lowerCase = function(str) {
        return str.toLowerCase();
    }
    
    
    var createCollection = exports.createCollection = function(obj, collection, options) {
        if(!collection) var collection = [];
        if(!options) var options = {};
        
        var name = lowerCase(options.name) || "";
        var Name = capitalize(name);
        var plural = lowerCase(options.plural) || name === "" ? "" : name+s;
        var Plural = capitalize(plural);
        var scope = plural === "" ? "" : plural+":";
        
        var short = !!options.short;
        
        var events;
        if(options.events instanceof Events.EventEmitter) {
            events = options.events;
        }
        else if (obj instanceof Events.EventEmitter) {
            if(typeof options.events === "string") {
                events = obj.scope(options.events);
            }
            else {
                if(short) {
                    events = obj;
                }
                else if (options.events !== false) {
                    var scope = plural === "" ? "" : plural+":";
                    events = obj.scope(scope);
                }
                else {
                    events = false;
                }
            }
        }
        else {
            events = false;
        }
        
        var all = "all"+Plural;
        var add = "add"+Name;
        var prepend = "prepend"+Name;
        var append = "append"+Name;
        var remove = "remove"+Name;
        var removeAt = "remove"+Name+"At";
        var get = "get"+Name;
        var search = "search"+Name;
        var contains = "contains"+Name;
        var clear = "clear"+Plural;
        var load = "load"+Plural;
        
        var addEvent = scope+"add";
        var prependEvent = scope+"prepend";
        var appendEvent = scope+"append";
        var removeEvent = scope+"remove";
        var clearEvent = scope+"clear";
        var loadEvent = scope+"load";
        
        
        
        obj[all] = function() {
            return collection;
        }
        
        obj[add] = function(thing, index) {
            collection.splice(index, 0, thing);
            
            if(events) events.emit(addEvent, thing, index);
            
            return this;
        }
        
        obj[prepend] = function(thing) {
            this.add(thing, 0);
            
            if(events) events.emit(prependEvent, thing);
            
            return this;
        }
        
        obj[append] = function(thing) {
            this.add(thing, collection.length - 1);
            
            if(events) events.emit(appendEvent, thing);
            
            return this;
        }
        
        obj[remove] = function(thing) {
            var index = this[search](thing);
            
            if(index > -1) {
                this[removeAt](index);
            }
            
            return this;
        }
        
        obj[removeAt] = function(index) {
            if(events) events.emit(removeEvent, index, this[get](index));
            
            collection.splice(index, 1);
            
            return this;
        }
        
        obj[get] = function(index) {
            return collection[index];
        }
        
        obj[search] = function(thing) {
            return collection.indexOf(thing);
        }
        
        obj[contains] = function(thing) {
            return this[search](thing) > -1;
        }
        
        obj[clear] = function() {
            if(events) events.emit(clearEvent);
            
            collection.splice(0, collection.length - 1);
            
            return this;
        }
        
        obj[load] = function(arr) {
            if(events) events.emit(loadEvent, arr);
            
            this[clear]();
            collection.push.apply(collection, arr);
            
            return this;
        }
        
        
        if(short) {
            obj.all = obj[all];
            obj.add = obj[add];
            obj.prepend = obj[prepend];
            obj.append = obj[append];
            obj.remove = obj[remove];
            obj.removeAt = obj[removeAt];
            obj.get = obj[get];
            obj.search = obj[search];
            obj.contains = obj[contains];
            obj.clear = obj[clear];
            obj.load = obj[load];
        }
        
        
        return obj;
        
        
    }
    
    
    
    
    
    var createNamedCollection = exports.createNamedCollection = function(obj, collection, options) {
        if(!collection) var collection = {};
        if(!options) var options = {};
        
        var name = lowerCase(options.name) || "";
        var Name = capitalize(name);
        var plural = lowerCase(options.plural) || name === "" ? "" : name+s;
        var Plural = capitalize(plural);
        var scope = plural === "" ? "" : plural+":";
        
        var short = !!options.short;
        
        var events;
        if(options.events instanceof Events.EventEmitter) {
            events = options.events;
        }
        else if (obj instanceof Events.EventEmitter) {
            if(typeof options.events === "string") {
                events = obj.scope(options.events);
            }
            else {
                if(short) {
                    events = obj;
                }
                else if (options.events !== false) {
                    var scope = plural === "" ? "" : plural+":";
                    events = obj.scope(scope);
                }
                else {
                    events = false;
                }
            }
        }
        else {
            events = false;
        }
        
        var all = "all"+Plural;
        var add = "add"+Name;
        var remove = "remove"+Name;
        var removeAt = "remove"+Name+"At";
        var get = "get"+Name;
        var search = "search"+Name;
        var contains = "contains"+Name;
        var clear = "clear"+Plural;
        var load = "load"+Plural;
        
        var addEvent = scope+"add";
        var removeEvent = scope+"remove";
        var clearEvent = scope+"clear";
        var loadEvent = scope+"load";
        
        
        
        obj[all] = function() {
            return collection;
        }
        
        obj[add] = function(thing, name) {
            collection[name] = thing;
            
            if(events) events.emit(addEvent, thing, name);
            
            return this;
        }
        
        obj[remove] = function(thing) {
            var name = this[search](thing);
            
            if(name) {
                this[removeAt](name);
            }
            
            return this;
        }
        
        obj[removeAt] = function(name) {
            if(events) events.emit(removeEvent, name, this[get](name));
            
            collection[name] = undefined;
            
            return this;
        }
        
        obj[get] = function(name) {
            return collection[name];
        }
        
        obj[search] = function(thing) {
            for(var name in collection) {
                if(collection[name] === thing) {
                    return name;
                }
            }
            
            return null;
        }
        
        obj[contains] = function(thing) {
            return !!this[search](thing);
        }
        
        obj[clear] = function() {
            if(events) events.emit(clearEvent);
            
            for(var name in collection) {
                collection[name] = undefined;
            }
            
            return this;
        }
        
        obj[load] = function(things) {
            if(events) events.emit(loadEvent, arr);
            
            this[clear]();
            
            Util.extend(collection, things);
            
            return this;
        }
        
        
        if(short) {
            obj.all = obj[all];
            obj.add = obj[add];
            obj.remove = obj[remove];
            obj.removeAt = obj[removeAt];
            obj.get = obj[get];
            obj.search = obj[search];
            obj.contains = obj[contains];
            obj.clear = obj[clear];
            obj.load = obj[load];
        }
        
        
        return obj;
        
        
    }
    
    
    
    
    return exports;
    
    
});