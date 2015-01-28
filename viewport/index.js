define(["../events/index"], function(Events) {
    "use strict";
    
    
    var exports = {};
    var scope = Events.scope("viewport");
    
    
    var elem = exports.element = document.createElement("canvas");
    elem.setAttribute("id", "required-canvas");
    
    exports.context = elem.getContext("2d");
    
    exports.width = elem.offsetWidth || 0;
    exports.height = elem.offsetHeight || 0;
    
    
    
    window.addEventListener("resize", function(e) {
        if(elem.offsetWidth !== exports.width || elem.offsetHeight !== exports.height) {
            exports.width = elem.offsetWidth;
            exports.height = elem.offsetHeight;
            scope.emit("resize", exports.width, exports.height);
        }
    });
    
    
    
    
    return exports;
    
    
    
});