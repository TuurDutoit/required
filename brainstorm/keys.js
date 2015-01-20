// When w (or one of its aliases) is pressed; onDown, onUp
Keys.on("w", function(){}, function(){});

// When w (not one of its aliases!) is pressed
Keys.on("!w", function(){});

// When key nr. 38 is pressed
// Key code will be converted to string, e.g. 38 becomes 'up'
// strings are preferred
Keys.on(38, function(){});

// When the w and shift keys are pressed together
Keys.on("shift+w", function(){});

// When a is pressed after w
Keys.on("w a", function(){});

// The vertical group changed to 'up'
Keys.on("vertical:up", function(){});






// The w and up arrow keys are now aliases
Keys.alias("w", "up");
Keys.alias("s", "down");

// Idem, but with key codes
// Key codes will be converted to strings, e.g. 38 becomes 'up'
// strings are preferred
Keys.alias(87, 38);

// Get the aliases of the 'up' key
// Here: ['w']
Keys.aliases("up");

// Get the aliases of the 'up' key, and add itself to the list
// Here: ['up', 'w']
Keys.aliases("up", true);





// The up and down keys are now opposites, in a group called 'vertical'
Keys.opposites("vertical", {up: "up", down: "down"});




// Get the state of a key (or one of its aliases)
// true if the up key (or one of its aliases) is pressed, false if not
Keys.get("up");

// Get the state of a key, but do not check aliases
// true if up is pressed, false otherwise
Keys.get("!up");

// Get the state of a group
// 'up' if the up key was the last to be pressed in the group, 'down' if it was the down key
Keys.get("vertical");





//IMPLEMENTATION
//============================================================

var aliases = {
    "up": ["w"],
    "w": ["up"],
    "shift+w": ["d", "del"],
    "d": ["del", "shift+w"],
    "del": ["d", "shift+w"],
    "w a": ["esc"],
    "esc": ["w a"]
};

var names = {
    "up": 38,
    "del": 46,
    "delete": 46
};

