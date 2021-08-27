/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/hammerjs/hammer.js":
/*!*****************************************!*\
  !*** ./node_modules/hammerjs/hammer.js ***!
  \*****************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_RESULT__;/*! Hammer.JS - v2.0.7 - 2016-04-22
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
(function(window, document, exportName, undefined) {
  'use strict';

var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
var TEST_ELEMENT = document.createElement('div');

var TYPE_FUNCTION = 'function';

var round = Math.round;
var abs = Math.abs;
var now = Date.now;

/**
 * set a timeout with a given scope
 * @param {Function} fn
 * @param {Number} timeout
 * @param {Object} context
 * @returns {number}
 */
function setTimeoutContext(fn, timeout, context) {
    return setTimeout(bindFn(fn, context), timeout);
}

/**
 * if the argument is an array, we want to execute the fn on each entry
 * if it aint an array we don't want to do a thing.
 * this is used by all the methods that accept a single and array argument.
 * @param {*|Array} arg
 * @param {String} fn
 * @param {Object} [context]
 * @returns {Boolean}
 */
function invokeArrayArg(arg, fn, context) {
    if (Array.isArray(arg)) {
        each(arg, context[fn], context);
        return true;
    }
    return false;
}

/**
 * walk objects and arrays
 * @param {Object} obj
 * @param {Function} iterator
 * @param {Object} context
 */
function each(obj, iterator, context) {
    var i;

    if (!obj) {
        return;
    }

    if (obj.forEach) {
        obj.forEach(iterator, context);
    } else if (obj.length !== undefined) {
        i = 0;
        while (i < obj.length) {
            iterator.call(context, obj[i], i, obj);
            i++;
        }
    } else {
        for (i in obj) {
            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
        }
    }
}

/**
 * wrap a method with a deprecation warning and stack trace
 * @param {Function} method
 * @param {String} name
 * @param {String} message
 * @returns {Function} A new function wrapping the supplied method.
 */
function deprecate(method, name, message) {
    var deprecationMessage = 'DEPRECATED METHOD: ' + name + '\n' + message + ' AT \n';
    return function() {
        var e = new Error('get-stack-trace');
        var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, '')
            .replace(/^\s+at\s+/gm, '')
            .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@') : 'Unknown Stack Trace';

        var log = window.console && (window.console.warn || window.console.log);
        if (log) {
            log.call(window.console, deprecationMessage, stack);
        }
        return method.apply(this, arguments);
    };
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} target
 * @param {...Object} objects_to_assign
 * @returns {Object} target
 */
var assign;
if (typeof Object.assign !== 'function') {
    assign = function assign(target) {
        if (target === undefined || target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        var output = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source !== undefined && source !== null) {
                for (var nextKey in source) {
                    if (source.hasOwnProperty(nextKey)) {
                        output[nextKey] = source[nextKey];
                    }
                }
            }
        }
        return output;
    };
} else {
    assign = Object.assign;
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} dest
 * @param {Object} src
 * @param {Boolean} [merge=false]
 * @returns {Object} dest
 */
var extend = deprecate(function extend(dest, src, merge) {
    var keys = Object.keys(src);
    var i = 0;
    while (i < keys.length) {
        if (!merge || (merge && dest[keys[i]] === undefined)) {
            dest[keys[i]] = src[keys[i]];
        }
        i++;
    }
    return dest;
}, 'extend', 'Use `assign`.');

/**
 * merge the values from src in the dest.
 * means that properties that exist in dest will not be overwritten by src
 * @param {Object} dest
 * @param {Object} src
 * @returns {Object} dest
 */
var merge = deprecate(function merge(dest, src) {
    return extend(dest, src, true);
}, 'merge', 'Use `assign`.');

/**
 * simple class inheritance
 * @param {Function} child
 * @param {Function} base
 * @param {Object} [properties]
 */
function inherit(child, base, properties) {
    var baseP = base.prototype,
        childP;

    childP = child.prototype = Object.create(baseP);
    childP.constructor = child;
    childP._super = baseP;

    if (properties) {
        assign(childP, properties);
    }
}

/**
 * simple function bind
 * @param {Function} fn
 * @param {Object} context
 * @returns {Function}
 */
function bindFn(fn, context) {
    return function boundFn() {
        return fn.apply(context, arguments);
    };
}

/**
 * let a boolean value also be a function that must return a boolean
 * this first item in args will be used as the context
 * @param {Boolean|Function} val
 * @param {Array} [args]
 * @returns {Boolean}
 */
function boolOrFn(val, args) {
    if (typeof val == TYPE_FUNCTION) {
        return val.apply(args ? args[0] || undefined : undefined, args);
    }
    return val;
}

/**
 * use the val2 when val1 is undefined
 * @param {*} val1
 * @param {*} val2
 * @returns {*}
 */
function ifUndefined(val1, val2) {
    return (val1 === undefined) ? val2 : val1;
}

/**
 * addEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function addEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.addEventListener(type, handler, false);
    });
}

/**
 * removeEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function removeEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.removeEventListener(type, handler, false);
    });
}

/**
 * find if a node is in the given parent
 * @method hasParent
 * @param {HTMLElement} node
 * @param {HTMLElement} parent
 * @return {Boolean} found
 */
function hasParent(node, parent) {
    while (node) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/**
 * small indexOf wrapper
 * @param {String} str
 * @param {String} find
 * @returns {Boolean} found
 */
function inStr(str, find) {
    return str.indexOf(find) > -1;
}

/**
 * split string on whitespace
 * @param {String} str
 * @returns {Array} words
 */
function splitStr(str) {
    return str.trim().split(/\s+/g);
}

/**
 * find if a array contains the object using indexOf or a simple polyFill
 * @param {Array} src
 * @param {String} find
 * @param {String} [findByKey]
 * @return {Boolean|Number} false when not found, or the index
 */
function inArray(src, find, findByKey) {
    if (src.indexOf && !findByKey) {
        return src.indexOf(find);
    } else {
        var i = 0;
        while (i < src.length) {
            if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
                return i;
            }
            i++;
        }
        return -1;
    }
}

/**
 * convert array-like objects to real arrays
 * @param {Object} obj
 * @returns {Array}
 */
function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
}

/**
 * unique array with objects based on a key (like 'id') or just by the array's value
 * @param {Array} src [{id:1},{id:2},{id:1}]
 * @param {String} [key]
 * @param {Boolean} [sort=False]
 * @returns {Array} [{id:1},{id:2}]
 */
function uniqueArray(src, key, sort) {
    var results = [];
    var values = [];
    var i = 0;

    while (i < src.length) {
        var val = key ? src[i][key] : src[i];
        if (inArray(values, val) < 0) {
            results.push(src[i]);
        }
        values[i] = val;
        i++;
    }

    if (sort) {
        if (!key) {
            results = results.sort();
        } else {
            results = results.sort(function sortUniqueArray(a, b) {
                return a[key] > b[key];
            });
        }
    }

    return results;
}

/**
 * get the prefixed property
 * @param {Object} obj
 * @param {String} property
 * @returns {String|Undefined} prefixed
 */
function prefixed(obj, property) {
    var prefix, prop;
    var camelProp = property[0].toUpperCase() + property.slice(1);

    var i = 0;
    while (i < VENDOR_PREFIXES.length) {
        prefix = VENDOR_PREFIXES[i];
        prop = (prefix) ? prefix + camelProp : property;

        if (prop in obj) {
            return prop;
        }
        i++;
    }
    return undefined;
}

/**
 * get a unique id
 * @returns {number} uniqueId
 */
var _uniqueId = 1;
function uniqueId() {
    return _uniqueId++;
}

/**
 * get the window object of an element
 * @param {HTMLElement} element
 * @returns {DocumentView|Window}
 */
function getWindowForElement(element) {
    var doc = element.ownerDocument || element;
    return (doc.defaultView || doc.parentWindow || window);
}

var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

var SUPPORT_TOUCH = ('ontouchstart' in window);
var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

var INPUT_TYPE_TOUCH = 'touch';
var INPUT_TYPE_PEN = 'pen';
var INPUT_TYPE_MOUSE = 'mouse';
var INPUT_TYPE_KINECT = 'kinect';

var COMPUTE_INTERVAL = 25;

var INPUT_START = 1;
var INPUT_MOVE = 2;
var INPUT_END = 4;
var INPUT_CANCEL = 8;

var DIRECTION_NONE = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 4;
var DIRECTION_UP = 8;
var DIRECTION_DOWN = 16;

var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

var PROPS_XY = ['x', 'y'];
var PROPS_CLIENT_XY = ['clientX', 'clientY'];

/**
 * create new input type manager
 * @param {Manager} manager
 * @param {Function} callback
 * @returns {Input}
 * @constructor
 */
function Input(manager, callback) {
    var self = this;
    this.manager = manager;
    this.callback = callback;
    this.element = manager.element;
    this.target = manager.options.inputTarget;

    // smaller wrapper around the handler, for the scope and the enabled state of the manager,
    // so when disabled the input events are completely bypassed.
    this.domHandler = function(ev) {
        if (boolOrFn(manager.options.enable, [manager])) {
            self.handler(ev);
        }
    };

    this.init();

}

Input.prototype = {
    /**
     * should handle the inputEvent data and trigger the callback
     * @virtual
     */
    handler: function() { },

    /**
     * bind the events
     */
    init: function() {
        this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    },

    /**
     * unbind the events
     */
    destroy: function() {
        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    }
};

/**
 * create new input type manager
 * called by the Manager constructor
 * @param {Hammer} manager
 * @returns {Input}
 */
function createInputInstance(manager) {
    var Type;
    var inputClass = manager.options.inputClass;

    if (inputClass) {
        Type = inputClass;
    } else if (SUPPORT_POINTER_EVENTS) {
        Type = PointerEventInput;
    } else if (SUPPORT_ONLY_TOUCH) {
        Type = TouchInput;
    } else if (!SUPPORT_TOUCH) {
        Type = MouseInput;
    } else {
        Type = TouchMouseInput;
    }
    return new (Type)(manager, inputHandler);
}

/**
 * handle input events
 * @param {Manager} manager
 * @param {String} eventType
 * @param {Object} input
 */
function inputHandler(manager, eventType, input) {
    var pointersLen = input.pointers.length;
    var changedPointersLen = input.changedPointers.length;
    var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
    var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

    input.isFirst = !!isFirst;
    input.isFinal = !!isFinal;

    if (isFirst) {
        manager.session = {};
    }

    // source event is the normalized value of the domEvents
    // like 'touchstart, mouseup, pointerdown'
    input.eventType = eventType;

    // compute scale, rotation etc
    computeInputData(manager, input);

    // emit secret event
    manager.emit('hammer.input', input);

    manager.recognize(input);
    manager.session.prevInput = input;
}

/**
 * extend the data with some usable properties like scale, rotate, velocity etc
 * @param {Object} manager
 * @param {Object} input
 */
function computeInputData(manager, input) {
    var session = manager.session;
    var pointers = input.pointers;
    var pointersLength = pointers.length;

    // store the first input to calculate the distance and direction
    if (!session.firstInput) {
        session.firstInput = simpleCloneInputData(input);
    }

    // to compute scale and rotation we need to store the multiple touches
    if (pointersLength > 1 && !session.firstMultiple) {
        session.firstMultiple = simpleCloneInputData(input);
    } else if (pointersLength === 1) {
        session.firstMultiple = false;
    }

    var firstInput = session.firstInput;
    var firstMultiple = session.firstMultiple;
    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

    var center = input.center = getCenter(pointers);
    input.timeStamp = now();
    input.deltaTime = input.timeStamp - firstInput.timeStamp;

    input.angle = getAngle(offsetCenter, center);
    input.distance = getDistance(offsetCenter, center);

    computeDeltaXY(session, input);
    input.offsetDirection = getDirection(input.deltaX, input.deltaY);

    var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
    input.overallVelocityX = overallVelocity.x;
    input.overallVelocityY = overallVelocity.y;
    input.overallVelocity = (abs(overallVelocity.x) > abs(overallVelocity.y)) ? overallVelocity.x : overallVelocity.y;

    input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
    input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

    input.maxPointers = !session.prevInput ? input.pointers.length : ((input.pointers.length >
        session.prevInput.maxPointers) ? input.pointers.length : session.prevInput.maxPointers);

    computeIntervalInputData(session, input);

    // find the correct target
    var target = manager.element;
    if (hasParent(input.srcEvent.target, target)) {
        target = input.srcEvent.target;
    }
    input.target = target;
}

function computeDeltaXY(session, input) {
    var center = input.center;
    var offset = session.offsetDelta || {};
    var prevDelta = session.prevDelta || {};
    var prevInput = session.prevInput || {};

    if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
        prevDelta = session.prevDelta = {
            x: prevInput.deltaX || 0,
            y: prevInput.deltaY || 0
        };

        offset = session.offsetDelta = {
            x: center.x,
            y: center.y
        };
    }

    input.deltaX = prevDelta.x + (center.x - offset.x);
    input.deltaY = prevDelta.y + (center.y - offset.y);
}

/**
 * velocity is calculated every x ms
 * @param {Object} session
 * @param {Object} input
 */
function computeIntervalInputData(session, input) {
    var last = session.lastInterval || input,
        deltaTime = input.timeStamp - last.timeStamp,
        velocity, velocityX, velocityY, direction;

    if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
        var deltaX = input.deltaX - last.deltaX;
        var deltaY = input.deltaY - last.deltaY;

        var v = getVelocity(deltaTime, deltaX, deltaY);
        velocityX = v.x;
        velocityY = v.y;
        velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
        direction = getDirection(deltaX, deltaY);

        session.lastInterval = input;
    } else {
        // use latest velocity info if it doesn't overtake a minimum period
        velocity = last.velocity;
        velocityX = last.velocityX;
        velocityY = last.velocityY;
        direction = last.direction;
    }

    input.velocity = velocity;
    input.velocityX = velocityX;
    input.velocityY = velocityY;
    input.direction = direction;
}

/**
 * create a simple clone from the input used for storage of firstInput and firstMultiple
 * @param {Object} input
 * @returns {Object} clonedInputData
 */
function simpleCloneInputData(input) {
    // make a simple copy of the pointers because we will get a reference if we don't
    // we only need clientXY for the calculations
    var pointers = [];
    var i = 0;
    while (i < input.pointers.length) {
        pointers[i] = {
            clientX: round(input.pointers[i].clientX),
            clientY: round(input.pointers[i].clientY)
        };
        i++;
    }

    return {
        timeStamp: now(),
        pointers: pointers,
        center: getCenter(pointers),
        deltaX: input.deltaX,
        deltaY: input.deltaY
    };
}

/**
 * get the center of all the pointers
 * @param {Array} pointers
 * @return {Object} center contains `x` and `y` properties
 */
function getCenter(pointers) {
    var pointersLength = pointers.length;

    // no need to loop when only one touch
    if (pointersLength === 1) {
        return {
            x: round(pointers[0].clientX),
            y: round(pointers[0].clientY)
        };
    }

    var x = 0, y = 0, i = 0;
    while (i < pointersLength) {
        x += pointers[i].clientX;
        y += pointers[i].clientY;
        i++;
    }

    return {
        x: round(x / pointersLength),
        y: round(y / pointersLength)
    };
}

/**
 * calculate the velocity between two points. unit is in px per ms.
 * @param {Number} deltaTime
 * @param {Number} x
 * @param {Number} y
 * @return {Object} velocity `x` and `y`
 */
function getVelocity(deltaTime, x, y) {
    return {
        x: x / deltaTime || 0,
        y: y / deltaTime || 0
    };
}

/**
 * get the direction between two points
 * @param {Number} x
 * @param {Number} y
 * @return {Number} direction
 */
function getDirection(x, y) {
    if (x === y) {
        return DIRECTION_NONE;
    }

    if (abs(x) >= abs(y)) {
        return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
}

/**
 * calculate the absolute distance between two points
 * @param {Object} p1 {x, y}
 * @param {Object} p2 {x, y}
 * @param {Array} [props] containing x and y keys
 * @return {Number} distance
 */
function getDistance(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];

    return Math.sqrt((x * x) + (y * y));
}

/**
 * calculate the angle between two coordinates
 * @param {Object} p1
 * @param {Object} p2
 * @param {Array} [props] containing x and y keys
 * @return {Number} angle
 */
function getAngle(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];
    return Math.atan2(y, x) * 180 / Math.PI;
}

/**
 * calculate the rotation degrees between two pointersets
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} rotation
 */
function getRotation(start, end) {
    return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
}

/**
 * calculate the scale factor between two pointersets
 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} scale
 */
function getScale(start, end) {
    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
}

var MOUSE_INPUT_MAP = {
    mousedown: INPUT_START,
    mousemove: INPUT_MOVE,
    mouseup: INPUT_END
};

var MOUSE_ELEMENT_EVENTS = 'mousedown';
var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

/**
 * Mouse events input
 * @constructor
 * @extends Input
 */
function MouseInput() {
    this.evEl = MOUSE_ELEMENT_EVENTS;
    this.evWin = MOUSE_WINDOW_EVENTS;

    this.pressed = false; // mousedown state

    Input.apply(this, arguments);
}

inherit(MouseInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function MEhandler(ev) {
        var eventType = MOUSE_INPUT_MAP[ev.type];

        // on start we want to have the left mouse button down
        if (eventType & INPUT_START && ev.button === 0) {
            this.pressed = true;
        }

        if (eventType & INPUT_MOVE && ev.which !== 1) {
            eventType = INPUT_END;
        }

        // mouse must be down
        if (!this.pressed) {
            return;
        }

        if (eventType & INPUT_END) {
            this.pressed = false;
        }

        this.callback(this.manager, eventType, {
            pointers: [ev],
            changedPointers: [ev],
            pointerType: INPUT_TYPE_MOUSE,
            srcEvent: ev
        });
    }
});

var POINTER_INPUT_MAP = {
    pointerdown: INPUT_START,
    pointermove: INPUT_MOVE,
    pointerup: INPUT_END,
    pointercancel: INPUT_CANCEL,
    pointerout: INPUT_CANCEL
};

// in IE10 the pointer types is defined as an enum
var IE10_POINTER_TYPE_ENUM = {
    2: INPUT_TYPE_TOUCH,
    3: INPUT_TYPE_PEN,
    4: INPUT_TYPE_MOUSE,
    5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
};

var POINTER_ELEMENT_EVENTS = 'pointerdown';
var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

// IE10 has prefixed support, and case-sensitive
if (window.MSPointerEvent && !window.PointerEvent) {
    POINTER_ELEMENT_EVENTS = 'MSPointerDown';
    POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
}

/**
 * Pointer events input
 * @constructor
 * @extends Input
 */
function PointerEventInput() {
    this.evEl = POINTER_ELEMENT_EVENTS;
    this.evWin = POINTER_WINDOW_EVENTS;

    Input.apply(this, arguments);

    this.store = (this.manager.session.pointerEvents = []);
}

inherit(PointerEventInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function PEhandler(ev) {
        var store = this.store;
        var removePointer = false;

        var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
        var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

        var isTouch = (pointerType == INPUT_TYPE_TOUCH);

        // get index of the event in the store
        var storeIndex = inArray(store, ev.pointerId, 'pointerId');

        // start and mouse must be down
        if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
            if (storeIndex < 0) {
                store.push(ev);
                storeIndex = store.length - 1;
            }
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            removePointer = true;
        }

        // it not found, so the pointer hasn't been down (so it's probably a hover)
        if (storeIndex < 0) {
            return;
        }

        // update the event in the store
        store[storeIndex] = ev;

        this.callback(this.manager, eventType, {
            pointers: store,
            changedPointers: [ev],
            pointerType: pointerType,
            srcEvent: ev
        });

        if (removePointer) {
            // remove from the store
            store.splice(storeIndex, 1);
        }
    }
});

var SINGLE_TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Touch events input
 * @constructor
 * @extends Input
 */
function SingleTouchInput() {
    this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
    this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
    this.started = false;

    Input.apply(this, arguments);
}

inherit(SingleTouchInput, Input, {
    handler: function TEhandler(ev) {
        var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

        // should we handle the touch events?
        if (type === INPUT_START) {
            this.started = true;
        }

        if (!this.started) {
            return;
        }

        var touches = normalizeSingleTouches.call(this, ev, type);

        // when done, reset the started state
        if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
            this.started = false;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function normalizeSingleTouches(ev, type) {
    var all = toArray(ev.touches);
    var changed = toArray(ev.changedTouches);

    if (type & (INPUT_END | INPUT_CANCEL)) {
        all = uniqueArray(all.concat(changed), 'identifier', true);
    }

    return [all, changed];
}

var TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Multi-user touch events input
 * @constructor
 * @extends Input
 */
function TouchInput() {
    this.evTarget = TOUCH_TARGET_EVENTS;
    this.targetIds = {};

    Input.apply(this, arguments);
}

inherit(TouchInput, Input, {
    handler: function MTEhandler(ev) {
        var type = TOUCH_INPUT_MAP[ev.type];
        var touches = getTouches.call(this, ev, type);
        if (!touches) {
            return;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function getTouches(ev, type) {
    var allTouches = toArray(ev.touches);
    var targetIds = this.targetIds;

    // when there is only one touch, the process can be simplified
    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
        targetIds[allTouches[0].identifier] = true;
        return [allTouches, allTouches];
    }

    var i,
        targetTouches,
        changedTouches = toArray(ev.changedTouches),
        changedTargetTouches = [],
        target = this.target;

    // get target touches from touches
    targetTouches = allTouches.filter(function(touch) {
        return hasParent(touch.target, target);
    });

    // collect touches
    if (type === INPUT_START) {
        i = 0;
        while (i < targetTouches.length) {
            targetIds[targetTouches[i].identifier] = true;
            i++;
        }
    }

    // filter changed touches to only contain touches that exist in the collected target ids
    i = 0;
    while (i < changedTouches.length) {
        if (targetIds[changedTouches[i].identifier]) {
            changedTargetTouches.push(changedTouches[i]);
        }

        // cleanup removed touches
        if (type & (INPUT_END | INPUT_CANCEL)) {
            delete targetIds[changedTouches[i].identifier];
        }
        i++;
    }

    if (!changedTargetTouches.length) {
        return;
    }

    return [
        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
        changedTargetTouches
    ];
}

/**
 * Combined touch and mouse input
 *
 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
 * This because touch devices also emit mouse events while doing a touch.
 *
 * @constructor
 * @extends Input
 */

var DEDUP_TIMEOUT = 2500;
var DEDUP_DISTANCE = 25;

function TouchMouseInput() {
    Input.apply(this, arguments);

    var handler = bindFn(this.handler, this);
    this.touch = new TouchInput(this.manager, handler);
    this.mouse = new MouseInput(this.manager, handler);

    this.primaryTouch = null;
    this.lastTouches = [];
}

inherit(TouchMouseInput, Input, {
    /**
     * handle mouse and touch events
     * @param {Hammer} manager
     * @param {String} inputEvent
     * @param {Object} inputData
     */
    handler: function TMEhandler(manager, inputEvent, inputData) {
        var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
            isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

        if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
            return;
        }

        // when we're in a touch event, record touches to  de-dupe synthetic mouse event
        if (isTouch) {
            recordTouches.call(this, inputEvent, inputData);
        } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
            return;
        }

        this.callback(manager, inputEvent, inputData);
    },

    /**
     * remove the event listeners
     */
    destroy: function destroy() {
        this.touch.destroy();
        this.mouse.destroy();
    }
});

function recordTouches(eventType, eventData) {
    if (eventType & INPUT_START) {
        this.primaryTouch = eventData.changedPointers[0].identifier;
        setLastTouch.call(this, eventData);
    } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
        setLastTouch.call(this, eventData);
    }
}

function setLastTouch(eventData) {
    var touch = eventData.changedPointers[0];

    if (touch.identifier === this.primaryTouch) {
        var lastTouch = {x: touch.clientX, y: touch.clientY};
        this.lastTouches.push(lastTouch);
        var lts = this.lastTouches;
        var removeLastTouch = function() {
            var i = lts.indexOf(lastTouch);
            if (i > -1) {
                lts.splice(i, 1);
            }
        };
        setTimeout(removeLastTouch, DEDUP_TIMEOUT);
    }
}

function isSyntheticEvent(eventData) {
    var x = eventData.srcEvent.clientX, y = eventData.srcEvent.clientY;
    for (var i = 0; i < this.lastTouches.length; i++) {
        var t = this.lastTouches[i];
        var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
        if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
            return true;
        }
    }
    return false;
}

var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

// magical touchAction value
var TOUCH_ACTION_COMPUTE = 'compute';
var TOUCH_ACTION_AUTO = 'auto';
var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
var TOUCH_ACTION_NONE = 'none';
var TOUCH_ACTION_PAN_X = 'pan-x';
var TOUCH_ACTION_PAN_Y = 'pan-y';
var TOUCH_ACTION_MAP = getTouchActionProps();

/**
 * Touch Action
 * sets the touchAction property or uses the js alternative
 * @param {Manager} manager
 * @param {String} value
 * @constructor
 */
function TouchAction(manager, value) {
    this.manager = manager;
    this.set(value);
}

TouchAction.prototype = {
    /**
     * set the touchAction value on the element or enable the polyfill
     * @param {String} value
     */
    set: function(value) {
        // find out the touch-action by the event handlers
        if (value == TOUCH_ACTION_COMPUTE) {
            value = this.compute();
        }

        if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
        }
        this.actions = value.toLowerCase().trim();
    },

    /**
     * just re-set the touchAction value
     */
    update: function() {
        this.set(this.manager.options.touchAction);
    },

    /**
     * compute the value for the touchAction property based on the recognizer's settings
     * @returns {String} value
     */
    compute: function() {
        var actions = [];
        each(this.manager.recognizers, function(recognizer) {
            if (boolOrFn(recognizer.options.enable, [recognizer])) {
                actions = actions.concat(recognizer.getTouchAction());
            }
        });
        return cleanTouchActions(actions.join(' '));
    },

    /**
     * this method is called on each input cycle and provides the preventing of the browser behavior
     * @param {Object} input
     */
    preventDefaults: function(input) {
        var srcEvent = input.srcEvent;
        var direction = input.offsetDirection;

        // if the touch action did prevented once this session
        if (this.manager.session.prevented) {
            srcEvent.preventDefault();
            return;
        }

        var actions = this.actions;
        var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

        if (hasNone) {
            //do not prevent defaults if this is a tap gesture

            var isTapPointer = input.pointers.length === 1;
            var isTapMovement = input.distance < 2;
            var isTapTouchTime = input.deltaTime < 250;

            if (isTapPointer && isTapMovement && isTapTouchTime) {
                return;
            }
        }

        if (hasPanX && hasPanY) {
            // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
            return;
        }

        if (hasNone ||
            (hasPanY && direction & DIRECTION_HORIZONTAL) ||
            (hasPanX && direction & DIRECTION_VERTICAL)) {
            return this.preventSrc(srcEvent);
        }
    },

    /**
     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
     * @param {Object} srcEvent
     */
    preventSrc: function(srcEvent) {
        this.manager.session.prevented = true;
        srcEvent.preventDefault();
    }
};

/**
 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
 * @param {String} actions
 * @returns {*}
 */
function cleanTouchActions(actions) {
    // none
    if (inStr(actions, TOUCH_ACTION_NONE)) {
        return TOUCH_ACTION_NONE;
    }

    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

    // if both pan-x and pan-y are set (different recognizers
    // for different directions, e.g. horizontal pan but vertical swipe?)
    // we need none (as otherwise with pan-x pan-y combined none of these
    // recognizers will work, since the browser would handle all panning
    if (hasPanX && hasPanY) {
        return TOUCH_ACTION_NONE;
    }

    // pan-x OR pan-y
    if (hasPanX || hasPanY) {
        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
    }

    // manipulation
    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
        return TOUCH_ACTION_MANIPULATION;
    }

    return TOUCH_ACTION_AUTO;
}

function getTouchActionProps() {
    if (!NATIVE_TOUCH_ACTION) {
        return false;
    }
    var touchMap = {};
    var cssSupports = window.CSS && window.CSS.supports;
    ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function(val) {

        // If css.supports is not supported but there is native touch-action assume it supports
        // all values. This is the case for IE 10 and 11.
        touchMap[val] = cssSupports ? window.CSS.supports('touch-action', val) : true;
    });
    return touchMap;
}

/**
 * Recognizer flow explained; *
 * All recognizers have the initial state of POSSIBLE when a input session starts.
 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
 * Example session for mouse-input: mousedown -> mousemove -> mouseup
 *
 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
 * which determines with state it should be.
 *
 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
 * POSSIBLE to give it another change on the next cycle.
 *
 *               Possible
 *                  |
 *            +-----+---------------+
 *            |                     |
 *      +-----+-----+               |
 *      |           |               |
 *   Failed      Cancelled          |
 *                          +-------+------+
 *                          |              |
 *                      Recognized       Began
 *                                         |
 *                                      Changed
 *                                         |
 *                                  Ended/Recognized
 */
var STATE_POSSIBLE = 1;
var STATE_BEGAN = 2;
var STATE_CHANGED = 4;
var STATE_ENDED = 8;
var STATE_RECOGNIZED = STATE_ENDED;
var STATE_CANCELLED = 16;
var STATE_FAILED = 32;

/**
 * Recognizer
 * Every recognizer needs to extend from this class.
 * @constructor
 * @param {Object} options
 */
function Recognizer(options) {
    this.options = assign({}, this.defaults, options || {});

    this.id = uniqueId();

    this.manager = null;

    // default is enable true
    this.options.enable = ifUndefined(this.options.enable, true);

    this.state = STATE_POSSIBLE;

    this.simultaneous = {};
    this.requireFail = [];
}

Recognizer.prototype = {
    /**
     * @virtual
     * @type {Object}
     */
    defaults: {},

    /**
     * set options
     * @param {Object} options
     * @return {Recognizer}
     */
    set: function(options) {
        assign(this.options, options);

        // also update the touchAction, in case something changed about the directions/enabled state
        this.manager && this.manager.touchAction.update();
        return this;
    },

    /**
     * recognize simultaneous with an other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    recognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
            return this;
        }

        var simultaneous = this.simultaneous;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (!simultaneous[otherRecognizer.id]) {
            simultaneous[otherRecognizer.id] = otherRecognizer;
            otherRecognizer.recognizeWith(this);
        }
        return this;
    },

    /**
     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRecognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        delete this.simultaneous[otherRecognizer.id];
        return this;
    },

    /**
     * recognizer can only run when an other is failing
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    requireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
            return this;
        }

        var requireFail = this.requireFail;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (inArray(requireFail, otherRecognizer) === -1) {
            requireFail.push(otherRecognizer);
            otherRecognizer.requireFailure(this);
        }
        return this;
    },

    /**
     * drop the requireFailure link. it does not remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRequireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        var index = inArray(this.requireFail, otherRecognizer);
        if (index > -1) {
            this.requireFail.splice(index, 1);
        }
        return this;
    },

    /**
     * has require failures boolean
     * @returns {boolean}
     */
    hasRequireFailures: function() {
        return this.requireFail.length > 0;
    },

    /**
     * if the recognizer can recognize simultaneous with an other recognizer
     * @param {Recognizer} otherRecognizer
     * @returns {Boolean}
     */
    canRecognizeWith: function(otherRecognizer) {
        return !!this.simultaneous[otherRecognizer.id];
    },

    /**
     * You should use `tryEmit` instead of `emit` directly to check
     * that all the needed recognizers has failed before emitting.
     * @param {Object} input
     */
    emit: function(input) {
        var self = this;
        var state = this.state;

        function emit(event) {
            self.manager.emit(event, input);
        }

        // 'panstart' and 'panmove'
        if (state < STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }

        emit(self.options.event); // simple 'eventName' events

        if (input.additionalEvent) { // additional event(panleft, panright, pinchin, pinchout...)
            emit(input.additionalEvent);
        }

        // panend and pancancel
        if (state >= STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }
    },

    /**
     * Check that all the require failure recognizers has failed,
     * if true, it emits a gesture event,
     * otherwise, setup the state to FAILED.
     * @param {Object} input
     */
    tryEmit: function(input) {
        if (this.canEmit()) {
            return this.emit(input);
        }
        // it's failing anyway
        this.state = STATE_FAILED;
    },

    /**
     * can we emit?
     * @returns {boolean}
     */
    canEmit: function() {
        var i = 0;
        while (i < this.requireFail.length) {
            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                return false;
            }
            i++;
        }
        return true;
    },

    /**
     * update the recognizer
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        // make a new copy of the inputData
        // so we can change the inputData without messing up the other recognizers
        var inputDataClone = assign({}, inputData);

        // is is enabled and allow recognizing?
        if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
            this.reset();
            this.state = STATE_FAILED;
            return;
        }

        // reset when we've reached the end
        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
            this.state = STATE_POSSIBLE;
        }

        this.state = this.process(inputDataClone);

        // the recognizer has recognized a gesture
        // so trigger an event
        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
            this.tryEmit(inputDataClone);
        }
    },

    /**
     * return the state of the recognizer
     * the actual recognizing happens in this method
     * @virtual
     * @param {Object} inputData
     * @returns {Const} STATE
     */
    process: function(inputData) { }, // jshint ignore:line

    /**
     * return the preferred touch-action
     * @virtual
     * @returns {Array}
     */
    getTouchAction: function() { },

    /**
     * called when the gesture isn't allowed to recognize
     * like when another is being recognized or it is disabled
     * @virtual
     */
    reset: function() { }
};

/**
 * get a usable string, used as event postfix
 * @param {Const} state
 * @returns {String} state
 */
function stateStr(state) {
    if (state & STATE_CANCELLED) {
        return 'cancel';
    } else if (state & STATE_ENDED) {
        return 'end';
    } else if (state & STATE_CHANGED) {
        return 'move';
    } else if (state & STATE_BEGAN) {
        return 'start';
    }
    return '';
}

/**
 * direction cons to string
 * @param {Const} direction
 * @returns {String}
 */
function directionStr(direction) {
    if (direction == DIRECTION_DOWN) {
        return 'down';
    } else if (direction == DIRECTION_UP) {
        return 'up';
    } else if (direction == DIRECTION_LEFT) {
        return 'left';
    } else if (direction == DIRECTION_RIGHT) {
        return 'right';
    }
    return '';
}

/**
 * get a recognizer by name if it is bound to a manager
 * @param {Recognizer|String} otherRecognizer
 * @param {Recognizer} recognizer
 * @returns {Recognizer}
 */
function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
    var manager = recognizer.manager;
    if (manager) {
        return manager.get(otherRecognizer);
    }
    return otherRecognizer;
}

/**
 * This recognizer is just used as a base for the simple attribute recognizers.
 * @constructor
 * @extends Recognizer
 */
function AttrRecognizer() {
    Recognizer.apply(this, arguments);
}

inherit(AttrRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof AttrRecognizer
     */
    defaults: {
        /**
         * @type {Number}
         * @default 1
         */
        pointers: 1
    },

    /**
     * Used to check if it the recognizer receives valid input, like input.distance > 10.
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {Boolean} recognized
     */
    attrTest: function(input) {
        var optionPointers = this.options.pointers;
        return optionPointers === 0 || input.pointers.length === optionPointers;
    },

    /**
     * Process the input and return the state for the recognizer
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {*} State
     */
    process: function(input) {
        var state = this.state;
        var eventType = input.eventType;

        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
        var isValid = this.attrTest(input);

        // on cancel input and we've recognized before, return STATE_CANCELLED
        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
            return state | STATE_CANCELLED;
        } else if (isRecognized || isValid) {
            if (eventType & INPUT_END) {
                return state | STATE_ENDED;
            } else if (!(state & STATE_BEGAN)) {
                return STATE_BEGAN;
            }
            return state | STATE_CHANGED;
        }
        return STATE_FAILED;
    }
});

/**
 * Pan
 * Recognized when the pointer is down and moved in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function PanRecognizer() {
    AttrRecognizer.apply(this, arguments);

    this.pX = null;
    this.pY = null;
}

inherit(PanRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PanRecognizer
     */
    defaults: {
        event: 'pan',
        threshold: 10,
        pointers: 1,
        direction: DIRECTION_ALL
    },

    getTouchAction: function() {
        var direction = this.options.direction;
        var actions = [];
        if (direction & DIRECTION_HORIZONTAL) {
            actions.push(TOUCH_ACTION_PAN_Y);
        }
        if (direction & DIRECTION_VERTICAL) {
            actions.push(TOUCH_ACTION_PAN_X);
        }
        return actions;
    },

    directionTest: function(input) {
        var options = this.options;
        var hasMoved = true;
        var distance = input.distance;
        var direction = input.direction;
        var x = input.deltaX;
        var y = input.deltaY;

        // lock to axis?
        if (!(direction & options.direction)) {
            if (options.direction & DIRECTION_HORIZONTAL) {
                direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
                hasMoved = x != this.pX;
                distance = Math.abs(input.deltaX);
            } else {
                direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
                hasMoved = y != this.pY;
                distance = Math.abs(input.deltaY);
            }
        }
        input.direction = direction;
        return hasMoved && distance > options.threshold && direction & options.direction;
    },

    attrTest: function(input) {
        return AttrRecognizer.prototype.attrTest.call(this, input) &&
            (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
    },

    emit: function(input) {

        this.pX = input.deltaX;
        this.pY = input.deltaY;

        var direction = directionStr(input.direction);

        if (direction) {
            input.additionalEvent = this.options.event + direction;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Pinch
 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
 * @constructor
 * @extends AttrRecognizer
 */
function PinchRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(PinchRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'pinch',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
    },

    emit: function(input) {
        if (input.scale !== 1) {
            var inOut = input.scale < 1 ? 'in' : 'out';
            input.additionalEvent = this.options.event + inOut;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Press
 * Recognized when the pointer is down for x ms without any movement.
 * @constructor
 * @extends Recognizer
 */
function PressRecognizer() {
    Recognizer.apply(this, arguments);

    this._timer = null;
    this._input = null;
}

inherit(PressRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PressRecognizer
     */
    defaults: {
        event: 'press',
        pointers: 1,
        time: 251, // minimal time of the pointer to be pressed
        threshold: 9 // a minimal movement is ok, but keep it low
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_AUTO];
    },

    process: function(input) {
        var options = this.options;
        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTime = input.deltaTime > options.time;

        this._input = input;

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
            this.reset();
        } else if (input.eventType & INPUT_START) {
            this.reset();
            this._timer = setTimeoutContext(function() {
                this.state = STATE_RECOGNIZED;
                this.tryEmit();
            }, options.time, this);
        } else if (input.eventType & INPUT_END) {
            return STATE_RECOGNIZED;
        }
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function(input) {
        if (this.state !== STATE_RECOGNIZED) {
            return;
        }

        if (input && (input.eventType & INPUT_END)) {
            this.manager.emit(this.options.event + 'up', input);
        } else {
            this._input.timeStamp = now();
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Rotate
 * Recognized when two or more pointer are moving in a circular motion.
 * @constructor
 * @extends AttrRecognizer
 */
function RotateRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(RotateRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof RotateRecognizer
     */
    defaults: {
        event: 'rotate',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
    }
});

/**
 * Swipe
 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function SwipeRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(SwipeRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof SwipeRecognizer
     */
    defaults: {
        event: 'swipe',
        threshold: 10,
        velocity: 0.3,
        direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
        pointers: 1
    },

    getTouchAction: function() {
        return PanRecognizer.prototype.getTouchAction.call(this);
    },

    attrTest: function(input) {
        var direction = this.options.direction;
        var velocity;

        if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
            velocity = input.overallVelocity;
        } else if (direction & DIRECTION_HORIZONTAL) {
            velocity = input.overallVelocityX;
        } else if (direction & DIRECTION_VERTICAL) {
            velocity = input.overallVelocityY;
        }

        return this._super.attrTest.call(this, input) &&
            direction & input.offsetDirection &&
            input.distance > this.options.threshold &&
            input.maxPointers == this.options.pointers &&
            abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
    },

    emit: function(input) {
        var direction = directionStr(input.offsetDirection);
        if (direction) {
            this.manager.emit(this.options.event + direction, input);
        }

        this.manager.emit(this.options.event, input);
    }
});

/**
 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
 * a single tap.
 *
 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
 * multi-taps being recognized.
 * @constructor
 * @extends Recognizer
 */
function TapRecognizer() {
    Recognizer.apply(this, arguments);

    // previous time and center,
    // used for tap counting
    this.pTime = false;
    this.pCenter = false;

    this._timer = null;
    this._input = null;
    this.count = 0;
}

inherit(TapRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'tap',
        pointers: 1,
        taps: 1,
        interval: 300, // max time between the multi-tap taps
        time: 250, // max time of the pointer to be down (like finger on the screen)
        threshold: 9, // a minimal movement is ok, but keep it low
        posThreshold: 10 // a multi-tap can be a bit off the initial position
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_MANIPULATION];
    },

    process: function(input) {
        var options = this.options;

        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTouchTime = input.deltaTime < options.time;

        this.reset();

        if ((input.eventType & INPUT_START) && (this.count === 0)) {
            return this.failTimeout();
        }

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (validMovement && validTouchTime && validPointers) {
            if (input.eventType != INPUT_END) {
                return this.failTimeout();
            }

            var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
            var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

            this.pTime = input.timeStamp;
            this.pCenter = input.center;

            if (!validMultiTap || !validInterval) {
                this.count = 1;
            } else {
                this.count += 1;
            }

            this._input = input;

            // if tap count matches we have recognized it,
            // else it has began recognizing...
            var tapCount = this.count % options.taps;
            if (tapCount === 0) {
                // no failing requirements, immediately trigger the tap event
                // or wait as long as the multitap interval to trigger
                if (!this.hasRequireFailures()) {
                    return STATE_RECOGNIZED;
                } else {
                    this._timer = setTimeoutContext(function() {
                        this.state = STATE_RECOGNIZED;
                        this.tryEmit();
                    }, options.interval, this);
                    return STATE_BEGAN;
                }
            }
        }
        return STATE_FAILED;
    },

    failTimeout: function() {
        this._timer = setTimeoutContext(function() {
            this.state = STATE_FAILED;
        }, this.options.interval, this);
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function() {
        if (this.state == STATE_RECOGNIZED) {
            this._input.tapCount = this.count;
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Simple way to create a manager with a default set of recognizers.
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Hammer(element, options) {
    options = options || {};
    options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
    return new Manager(element, options);
}

/**
 * @const {string}
 */
Hammer.VERSION = '2.0.7';

/**
 * default settings
 * @namespace
 */
Hammer.defaults = {
    /**
     * set if DOM events are being triggered.
     * But this is slower and unused by simple implementations, so disabled by default.
     * @type {Boolean}
     * @default false
     */
    domEvents: false,

    /**
     * The value for the touchAction property/fallback.
     * When set to `compute` it will magically set the correct value based on the added recognizers.
     * @type {String}
     * @default compute
     */
    touchAction: TOUCH_ACTION_COMPUTE,

    /**
     * @type {Boolean}
     * @default true
     */
    enable: true,

    /**
     * EXPERIMENTAL FEATURE -- can be removed/changed
     * Change the parent input target element.
     * If Null, then it is being set the to main element.
     * @type {Null|EventTarget}
     * @default null
     */
    inputTarget: null,

    /**
     * force an input class
     * @type {Null|Function}
     * @default null
     */
    inputClass: null,

    /**
     * Default recognizer setup when calling `Hammer()`
     * When creating a new Manager these will be skipped.
     * @type {Array}
     */
    preset: [
        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
        [RotateRecognizer, {enable: false}],
        [PinchRecognizer, {enable: false}, ['rotate']],
        [SwipeRecognizer, {direction: DIRECTION_HORIZONTAL}],
        [PanRecognizer, {direction: DIRECTION_HORIZONTAL}, ['swipe']],
        [TapRecognizer],
        [TapRecognizer, {event: 'doubletap', taps: 2}, ['tap']],
        [PressRecognizer]
    ],

    /**
     * Some CSS properties can be used to improve the working of Hammer.
     * Add them to this method and they will be set when creating a new Manager.
     * @namespace
     */
    cssProps: {
        /**
         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userSelect: 'none',

        /**
         * Disable the Windows Phone grippers when pressing an element.
         * @type {String}
         * @default 'none'
         */
        touchSelect: 'none',

        /**
         * Disables the default callout shown when you touch and hold a touch target.
         * On iOS, when you touch and hold a touch target such as a link, Safari displays
         * a callout containing information about the link. This property allows you to disable that callout.
         * @type {String}
         * @default 'none'
         */
        touchCallout: 'none',

        /**
         * Specifies whether zooming is enabled. Used by IE10>
         * @type {String}
         * @default 'none'
         */
        contentZooming: 'none',

        /**
         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userDrag: 'none',

        /**
         * Overrides the highlight color shown when the user taps a link or a JavaScript
         * clickable element in iOS. This property obeys the alpha value, if specified.
         * @type {String}
         * @default 'rgba(0,0,0,0)'
         */
        tapHighlightColor: 'rgba(0,0,0,0)'
    }
};

var STOP = 1;
var FORCED_STOP = 2;

/**
 * Manager
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Manager(element, options) {
    this.options = assign({}, Hammer.defaults, options || {});

    this.options.inputTarget = this.options.inputTarget || element;

    this.handlers = {};
    this.session = {};
    this.recognizers = [];
    this.oldCssProps = {};

    this.element = element;
    this.input = createInputInstance(this);
    this.touchAction = new TouchAction(this, this.options.touchAction);

    toggleCssProps(this, true);

    each(this.options.recognizers, function(item) {
        var recognizer = this.add(new (item[0])(item[1]));
        item[2] && recognizer.recognizeWith(item[2]);
        item[3] && recognizer.requireFailure(item[3]);
    }, this);
}

Manager.prototype = {
    /**
     * set options
     * @param {Object} options
     * @returns {Manager}
     */
    set: function(options) {
        assign(this.options, options);

        // Options that need a little more setup
        if (options.touchAction) {
            this.touchAction.update();
        }
        if (options.inputTarget) {
            // Clean up existing event listeners and reinitialize
            this.input.destroy();
            this.input.target = options.inputTarget;
            this.input.init();
        }
        return this;
    },

    /**
     * stop recognizing for this session.
     * This session will be discarded, when a new [input]start event is fired.
     * When forced, the recognizer cycle is stopped immediately.
     * @param {Boolean} [force]
     */
    stop: function(force) {
        this.session.stopped = force ? FORCED_STOP : STOP;
    },

    /**
     * run the recognizers!
     * called by the inputHandler function on every movement of the pointers (touches)
     * it walks through all the recognizers and tries to detect the gesture that is being made
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        var session = this.session;
        if (session.stopped) {
            return;
        }

        // run the touch-action polyfill
        this.touchAction.preventDefaults(inputData);

        var recognizer;
        var recognizers = this.recognizers;

        // this holds the recognizer that is being recognized.
        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
        // if no recognizer is detecting a thing, it is set to `null`
        var curRecognizer = session.curRecognizer;

        // reset when the last recognizer is recognized
        // or when we're in a new session
        if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
            curRecognizer = session.curRecognizer = null;
        }

        var i = 0;
        while (i < recognizers.length) {
            recognizer = recognizers[i];

            // find out if we are allowed try to recognize the input for this one.
            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
            //      that is being recognized.
            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
            //      this can be setup with the `recognizeWith()` method on the recognizer.
            if (session.stopped !== FORCED_STOP && ( // 1
                    !curRecognizer || recognizer == curRecognizer || // 2
                    recognizer.canRecognizeWith(curRecognizer))) { // 3
                recognizer.recognize(inputData);
            } else {
                recognizer.reset();
            }

            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
            // current active recognizer. but only if we don't already have an active recognizer
            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                curRecognizer = session.curRecognizer = recognizer;
            }
            i++;
        }
    },

    /**
     * get a recognizer by its event name.
     * @param {Recognizer|String} recognizer
     * @returns {Recognizer|Null}
     */
    get: function(recognizer) {
        if (recognizer instanceof Recognizer) {
            return recognizer;
        }

        var recognizers = this.recognizers;
        for (var i = 0; i < recognizers.length; i++) {
            if (recognizers[i].options.event == recognizer) {
                return recognizers[i];
            }
        }
        return null;
    },

    /**
     * add a recognizer to the manager
     * existing recognizers with the same event name will be removed
     * @param {Recognizer} recognizer
     * @returns {Recognizer|Manager}
     */
    add: function(recognizer) {
        if (invokeArrayArg(recognizer, 'add', this)) {
            return this;
        }

        // remove existing
        var existing = this.get(recognizer.options.event);
        if (existing) {
            this.remove(existing);
        }

        this.recognizers.push(recognizer);
        recognizer.manager = this;

        this.touchAction.update();
        return recognizer;
    },

    /**
     * remove a recognizer by name or instance
     * @param {Recognizer|String} recognizer
     * @returns {Manager}
     */
    remove: function(recognizer) {
        if (invokeArrayArg(recognizer, 'remove', this)) {
            return this;
        }

        recognizer = this.get(recognizer);

        // let's make sure this recognizer exists
        if (recognizer) {
            var recognizers = this.recognizers;
            var index = inArray(recognizers, recognizer);

            if (index !== -1) {
                recognizers.splice(index, 1);
                this.touchAction.update();
            }
        }

        return this;
    },

    /**
     * bind event
     * @param {String} events
     * @param {Function} handler
     * @returns {EventEmitter} this
     */
    on: function(events, handler) {
        if (events === undefined) {
            return;
        }
        if (handler === undefined) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            handlers[event] = handlers[event] || [];
            handlers[event].push(handler);
        });
        return this;
    },

    /**
     * unbind event, leave emit blank to remove all handlers
     * @param {String} events
     * @param {Function} [handler]
     * @returns {EventEmitter} this
     */
    off: function(events, handler) {
        if (events === undefined) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            if (!handler) {
                delete handlers[event];
            } else {
                handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
            }
        });
        return this;
    },

    /**
     * emit event to the listeners
     * @param {String} event
     * @param {Object} data
     */
    emit: function(event, data) {
        // we also want to trigger dom events
        if (this.options.domEvents) {
            triggerDomEvent(event, data);
        }

        // no handlers, so skip it all
        var handlers = this.handlers[event] && this.handlers[event].slice();
        if (!handlers || !handlers.length) {
            return;
        }

        data.type = event;
        data.preventDefault = function() {
            data.srcEvent.preventDefault();
        };

        var i = 0;
        while (i < handlers.length) {
            handlers[i](data);
            i++;
        }
    },

    /**
     * destroy the manager and unbinds all events
     * it doesn't unbind dom events, that is the user own responsibility
     */
    destroy: function() {
        this.element && toggleCssProps(this, false);

        this.handlers = {};
        this.session = {};
        this.input.destroy();
        this.element = null;
    }
};

/**
 * add/remove the css properties as defined in manager.options.cssProps
 * @param {Manager} manager
 * @param {Boolean} add
 */
function toggleCssProps(manager, add) {
    var element = manager.element;
    if (!element.style) {
        return;
    }
    var prop;
    each(manager.options.cssProps, function(value, name) {
        prop = prefixed(element.style, name);
        if (add) {
            manager.oldCssProps[prop] = element.style[prop];
            element.style[prop] = value;
        } else {
            element.style[prop] = manager.oldCssProps[prop] || '';
        }
    });
    if (!add) {
        manager.oldCssProps = {};
    }
}

/**
 * trigger dom event
 * @param {String} event
 * @param {Object} data
 */
function triggerDomEvent(event, data) {
    var gestureEvent = document.createEvent('Event');
    gestureEvent.initEvent(event, true, true);
    gestureEvent.gesture = data;
    data.target.dispatchEvent(gestureEvent);
}

assign(Hammer, {
    INPUT_START: INPUT_START,
    INPUT_MOVE: INPUT_MOVE,
    INPUT_END: INPUT_END,
    INPUT_CANCEL: INPUT_CANCEL,

    STATE_POSSIBLE: STATE_POSSIBLE,
    STATE_BEGAN: STATE_BEGAN,
    STATE_CHANGED: STATE_CHANGED,
    STATE_ENDED: STATE_ENDED,
    STATE_RECOGNIZED: STATE_RECOGNIZED,
    STATE_CANCELLED: STATE_CANCELLED,
    STATE_FAILED: STATE_FAILED,

    DIRECTION_NONE: DIRECTION_NONE,
    DIRECTION_LEFT: DIRECTION_LEFT,
    DIRECTION_RIGHT: DIRECTION_RIGHT,
    DIRECTION_UP: DIRECTION_UP,
    DIRECTION_DOWN: DIRECTION_DOWN,
    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL: DIRECTION_VERTICAL,
    DIRECTION_ALL: DIRECTION_ALL,

    Manager: Manager,
    Input: Input,
    TouchAction: TouchAction,

    TouchInput: TouchInput,
    MouseInput: MouseInput,
    PointerEventInput: PointerEventInput,
    TouchMouseInput: TouchMouseInput,
    SingleTouchInput: SingleTouchInput,

    Recognizer: Recognizer,
    AttrRecognizer: AttrRecognizer,
    Tap: TapRecognizer,
    Pan: PanRecognizer,
    Swipe: SwipeRecognizer,
    Pinch: PinchRecognizer,
    Rotate: RotateRecognizer,
    Press: PressRecognizer,

    on: addEventListeners,
    off: removeEventListeners,
    each: each,
    merge: merge,
    extend: extend,
    assign: assign,
    inherit: inherit,
    bindFn: bindFn,
    prefixed: prefixed
});

// this prevents errors when Hammer is loaded in the presence of an AMD
//  style loader but by script tag, not by the loader.
var freeGlobal = (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {})); // jshint ignore:line
freeGlobal.Hammer = Hammer;

if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
        return Hammer;
    }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else {}

})(window, document, 'Hammer');


/***/ }),

/***/ "./src/Bristol/BristolBoard.ts":
/*!*************************************!*\
  !*** ./src/Bristol/BristolBoard.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BristolHAlign": () => (/* binding */ BristolHAlign),
/* harmony export */   "BristolVAlign": () => (/* binding */ BristolVAlign),
/* harmony export */   "BristolFontStyle": () => (/* binding */ BristolFontStyle),
/* harmony export */   "BristolFontFamily": () => (/* binding */ BristolFontFamily),
/* harmony export */   "FontSize": () => (/* binding */ FontSize),
/* harmony export */   "BristolFontWeight": () => (/* binding */ BristolFontWeight),
/* harmony export */   "BristolFont": () => (/* binding */ BristolFont),
/* harmony export */   "InputEvent": () => (/* binding */ InputEvent),
/* harmony export */   "InputEventAction": () => (/* binding */ InputEventAction),
/* harmony export */   "KeyboardInputKey": () => (/* binding */ KeyboardInputKey),
/* harmony export */   "KeyboardInputEvent": () => (/* binding */ KeyboardInputEvent),
/* harmony export */   "MouseInputEvent": () => (/* binding */ MouseInputEvent),
/* harmony export */   "MouseBtnInputEvent": () => (/* binding */ MouseBtnInputEvent),
/* harmony export */   "MouseMovedInputEvent": () => (/* binding */ MouseMovedInputEvent),
/* harmony export */   "MouseScrolledInputEvent": () => (/* binding */ MouseScrolledInputEvent),
/* harmony export */   "MouseDraggedInputEvent": () => (/* binding */ MouseDraggedInputEvent),
/* harmony export */   "BristolBoard": () => (/* binding */ BristolBoard)
/* harmony export */ });
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hammerjs */ "./node_modules/hammerjs/hammer.js");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(hammerjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _imports__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../imports */ "./src/imports.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};


var BristolHAlign;
(function (BristolHAlign) {
    BristolHAlign["Left"] = "left";
    BristolHAlign["Center"] = "center";
    BristolHAlign["Right"] = "right";
})(BristolHAlign || (BristolHAlign = {}));
var BristolVAlign;
(function (BristolVAlign) {
    BristolVAlign["Top"] = "top";
    BristolVAlign["Bottom"] = "bottom";
    BristolVAlign["Middle"] = "middle";
    BristolVAlign["Alphabetic"] = "alphabetic";
    BristolVAlign["Hanging"] = "hanging";
})(BristolVAlign || (BristolVAlign = {}));
var BristolFontStyle;
(function (BristolFontStyle) {
    BristolFontStyle["Normal"] = "normal";
    BristolFontStyle["Italic"] = "italic";
    BristolFontStyle["Oblique"] = "oblique";
})(BristolFontStyle || (BristolFontStyle = {}));
var BristolFontFamily;
(function (BristolFontFamily) {
    BristolFontFamily["Arial"] = "Arial";
    BristolFontFamily["Verdana"] = "Verdana";
    BristolFontFamily["TimesNewRoman"] = "TimesNewRoman";
    BristolFontFamily["CourierNew"] = "Courier New";
    BristolFontFamily["Monospace"] = "Monospace";
    BristolFontFamily["CascadiaCode"] = "Cascadia Code";
    BristolFontFamily["MaterialIcons"] = "Material Icons";
    BristolFontFamily["MaterialIconsOutlined"] = "Material Icons Outlined";
})(BristolFontFamily || (BristolFontFamily = {}));
var FontSize;
(function (FontSize) {
    FontSize[FontSize["Small"] = 8] = "Small";
    FontSize[FontSize["Medium"] = 16] = "Medium";
    FontSize[FontSize["Large"] = 20] = "Large";
})(FontSize || (FontSize = {}));
var BristolFontWeight;
(function (BristolFontWeight) {
    BristolFontWeight["normal"] = "normal";
    BristolFontWeight["bold"] = "bold";
    BristolFontWeight["bolder"] = "bolder";
    BristolFontWeight["lighter"] = "lighter";
})(BristolFontWeight || (BristolFontWeight = {}));
var BristolFont = /** @class */ (function () {
    function BristolFont() {
        this.style = BristolFontStyle.Normal;
        this.weight = BristolFontWeight.normal;
        this.family = BristolFontFamily.Monospace;
        this.size = 12;
    }
    BristolFont.prototype.toString = function () {
        return this.size + "px " + this.family; // ${this.style} ${this.weight}
    };
    return BristolFont;
}());

var MOUSE_INPUT_MAP = {
    mousedown: hammerjs__WEBPACK_IMPORTED_MODULE_0__.INPUT_START,
    mousemove: hammerjs__WEBPACK_IMPORTED_MODULE_0__.INPUT_MOVE,
    mouseup: hammerjs__WEBPACK_IMPORTED_MODULE_0__.INPUT_END
};
//override
var baseClass = hammerjs__WEBPACK_IMPORTED_MODULE_0__.MouseInput;
var InputEvent = /** @class */ (function () {
    function InputEvent() {
    }
    return InputEvent;
}());

var InputEventAction;
(function (InputEventAction) {
    InputEventAction[InputEventAction["Down"] = 0] = "Down";
    InputEventAction[InputEventAction["Up"] = 1] = "Up";
})(InputEventAction || (InputEventAction = {}));
var KeyboardInputKey;
(function (KeyboardInputKey) {
    KeyboardInputKey["a"] = "a";
    KeyboardInputKey["b"] = "b";
    KeyboardInputKey["c"] = "c";
    KeyboardInputKey["d"] = "d";
    KeyboardInputKey["e"] = "e";
    KeyboardInputKey["f"] = "f";
    KeyboardInputKey["g"] = "g";
    KeyboardInputKey["h"] = "h";
    KeyboardInputKey["i"] = "i";
    KeyboardInputKey["j"] = "j";
    KeyboardInputKey["k"] = "k";
    KeyboardInputKey["l"] = "l";
    KeyboardInputKey["m"] = "m";
    KeyboardInputKey["n"] = "n";
    KeyboardInputKey["o"] = "0";
    KeyboardInputKey["p"] = "p";
    KeyboardInputKey["q"] = "q";
    KeyboardInputKey["r"] = "r";
    KeyboardInputKey["s"] = "s";
    KeyboardInputKey["t"] = "t";
    KeyboardInputKey["u"] = "u";
    KeyboardInputKey["v"] = "v";
    KeyboardInputKey["w"] = "w";
    KeyboardInputKey["x"] = "x";
    KeyboardInputKey["y"] = "y";
    KeyboardInputKey["z"] = "z";
    KeyboardInputKey["shift"] = "shift";
    KeyboardInputKey["enter"] = "enter";
    KeyboardInputKey["ctrl"] = "ctrl";
    KeyboardInputKey["alt"] = "alt";
})(KeyboardInputKey || (KeyboardInputKey = {}));
var KeyboardInputEvent = /** @class */ (function (_super) {
    __extends(KeyboardInputEvent, _super);
    function KeyboardInputEvent(action, key, isShift, isCtrl, isAlt) {
        var _this = _super.call(this) || this;
        _this.action = action;
        _this.key = key;
        _this.isShift = isShift;
        _this.isCtrl = isCtrl;
        _this.isAlt = isAlt;
        return _this;
    }
    return KeyboardInputEvent;
}(InputEvent));

var MouseInputEvent = /** @class */ (function (_super) {
    __extends(MouseInputEvent, _super);
    function MouseInputEvent(x, y) {
        var _this = _super.call(this) || this;
        _this.x = x;
        _this.y = y;
        return _this;
    }
    return MouseInputEvent;
}(InputEvent));

var MouseBtnInputEvent = /** @class */ (function (_super) {
    __extends(MouseBtnInputEvent, _super);
    function MouseBtnInputEvent(x, y, btn, action) {
        if (action === void 0) { action = null; }
        var _this = _super.call(this, x, y) || this;
        _this.action = action;
        _this.btn = btn;
        return _this;
    }
    return MouseBtnInputEvent;
}(MouseInputEvent));

var MouseMovedInputEvent = /** @class */ (function (_super) {
    __extends(MouseMovedInputEvent, _super);
    function MouseMovedInputEvent(x, y, deltaX, deltaY) {
        var _this = _super.call(this, x, y) || this;
        _this.deltaX = deltaX;
        _this.deltaY = deltaY;
        return _this;
    }
    return MouseMovedInputEvent;
}(MouseInputEvent));

var MouseScrolledInputEvent = /** @class */ (function (_super) {
    __extends(MouseScrolledInputEvent, _super);
    function MouseScrolledInputEvent(x, y, amount) {
        var _this = _super.call(this, x, y) || this;
        _this.amount = amount;
        return _this;
    }
    return MouseScrolledInputEvent;
}(MouseInputEvent));

var MouseDraggedInputEvent = /** @class */ (function (_super) {
    __extends(MouseDraggedInputEvent, _super);
    function MouseDraggedInputEvent(x, y, btn, deltaX, deltaY) {
        var _this = _super.call(this, x, y, deltaX, deltaY) || this;
        _this.btn = btn;
        return _this;
    }
    return MouseDraggedInputEvent;
}(MouseMovedInputEvent));

var BristolBoard = /** @class */ (function () {
    function BristolBoard(containerDivElem, onInitialized) {
        var _this = this;
        // jobExecutor: JobExecutor = null;
        this.keyboardState = new Map();
        this.debuggerFlags = {
            uiFrameOutlines: false
        };
        this.lastScrollOffset = [0, 0];
        this.scrollDeltaY = 0;
        this.scrollDeltaX = 0;
        this.perfAvg = new _imports__WEBPACK_IMPORTED_MODULE_1__.Averager(20);
        this.targetFps = 20;
        this.drawProm = null;
        this.autoFrames = true;
        this.font = new BristolFont();
        var ths = this;
        this.uiElements = _imports__WEBPACK_IMPORTED_MODULE_1__.SortedLinkedList.Create(function (a, b) { return (a.depth - b.depth); });
        this.containerDiv = new _imports__WEBPACK_IMPORTED_MODULE_1__.FHTML(containerDivElem);
        this.containerDivElem = containerDivElem;
        this.canvas = new _imports__WEBPACK_IMPORTED_MODULE_1__.FHTML(document.createElement('canvas'));
        this.canvas.attr('oncontextmenu', 'return false');
        this.containerDiv.append(this.canvas);
        this.ctx = this.canvas.element.getContext('2d');
        // if (this.shouldExecJobs()) {
        //     this.jobExecutor = new JobExecutor();
        //     CerealBox.jobExecutor = this.jobExecutor;
        // }
        this.onResize();
        this.lastDrawTime = Date.now();
        this.canvas.element.addEventListener('wheel', function (evt) {
            ths.mouseScrolled(new MouseScrolledInputEvent(ths.iMouseX, ths.iMouseY, evt.deltaY));
        });
        this.hammerManager = new hammerjs__WEBPACK_IMPORTED_MODULE_0__.Manager(this.canvas.element);
        this.rotateRecognizer = new hammerjs__WEBPACK_IMPORTED_MODULE_0__.Rotate();
        this.panRecognizer = new hammerjs__WEBPACK_IMPORTED_MODULE_0__.Pan();
        this.hammerManager.add(this.rotateRecognizer);
        this.hammerManager.add(this.panRecognizer);
        this.hammerManager.on('panstart', function (evt) {
            _this.lastScrollOffset = [0, 0];
            if (_this.mousePressed(new MouseBtnInputEvent(evt.center.x, evt.center.y, 1, InputEventAction.Down))) {
                evt.preventDefault();
            }
        });
        this.hammerManager.on('panend', function (evt) {
            _this.lastScrollOffset = [0, 0];
            if (_this.mouseReleased(new MouseBtnInputEvent(evt.center.x, evt.center.y, 1, InputEventAction.Up))) {
                evt.preventDefault();
            }
        });
        this.hammerManager.on('pan', function (evt) {
            ths.scrollDeltaX += evt.deltaX - ths.lastScrollOffset[0];
            ths.scrollDeltaY += evt.deltaY - ths.lastScrollOffset[1];
            ths.lastScrollOffset[0] = evt.deltaX;
            ths.lastScrollOffset[1] = evt.deltaY;
            if (Math.max(Math.abs(_this.scrollDeltaX), Math.abs(_this.scrollDeltaY)) > 1) {
                //  console.log(`${this.scrollDeltaX}, ${this.scrollDeltaY}`);
                ths.mouseDragged(new MouseDraggedInputEvent(evt.center.x, evt.center.y, 1, ths.scrollDeltaX, ths.scrollDeltaY));
                // ths.mouseDragged(evt, this.scrollDeltaX, this.scrollDeltaY);
                _this.scrollDeltaX = 0;
                _this.scrollDeltaY = 0;
            }
        });
        document.addEventListener('keydown', function (evt) {
            // var inputKey: KeyboardInputKey
            // if(evt.shiftKey){
            //     inputKey = KeyboardInputKey.shift;
            // } else if(evt.ctrlKey){
            //     inputKey = KeyboardInputKey.ctrl;
            // } else if(evt.altKey){
            //     inputKey = KeyboardInputKey.alt;
            // } else {
            //     inputKey = KeyboardInputKey[evt.key.toLowerCase()];
            // }
            _this.keyboardState.set(evt.key, true);
            var event = new KeyboardInputEvent(InputEventAction.Down, evt.key, _this.isKeyPressed(KeyboardInputKey.shift), _this.isKeyPressed(KeyboardInputKey.ctrl), _this.isKeyPressed(KeyboardInputKey.alt));
            if (ths.keyDown(event)) {
                evt.preventDefault();
            }
        });
        document.addEventListener('keyup', function (evt) {
            _this.keyboardState.set(evt.key, false);
            var event = new KeyboardInputEvent(InputEventAction.Down, evt.key, _this.isKeyPressed(KeyboardInputKey.shift), _this.isKeyPressed(KeyboardInputKey.ctrl), _this.isKeyPressed(KeyboardInputKey.alt));
            if (ths.keyUp(event)) {
                evt.preventDefault();
            }
        });
        document.addEventListener('mousemove', function (evt) {
            var parentOffset = ths.canvas.offset();
            //or $(this).offset(); if you really just want the current element's offset
            var relX = evt.pageX - parentOffset.left;
            var relY = evt.pageY - parentOffset.top;
            var deltaX = relX - ths.iMouseX;
            var deltaY = relY - ths.iMouseY;
            ths.iMouseX = relX;
            ths.iMouseY = relY;
            ths.mouseMoved(new MouseMovedInputEvent(relX, relY, deltaX, deltaY));
        });
        document.addEventListener('mousedown', function (evt) {
            var parentOffset = ths.canvas.offset();
            //or $(this).offset(); if you really just want the current element's offset
            var relX = evt.pageX - parentOffset.left;
            var relY = evt.pageY - parentOffset.top;
            if (relX >= 0 && relX <= parentOffset.left + ths.canvas.width &&
                relY >= 0 && relY <= parentOffset.top + ths.canvas.height) {
                if (_this.mousePressed(new MouseBtnInputEvent(relX, relY, evt.which, InputEventAction.Down))) {
                    evt.preventDefault();
                }
            }
        });
        document.addEventListener('mouseup', function (evt) {
            var parentOffset = ths.canvas.offset();
            //or $(this).offset(); if you really just want the current element's offset
            var relX = evt.pageX - parentOffset.left;
            var relY = evt.pageY - parentOffset.top;
            if (relX >= 0 && relX <= parentOffset.left + ths.canvas.width &&
                relY >= 0 && relY <= parentOffset.top + ths.canvas.height) {
                if (_this.mouseReleased(new MouseBtnInputEvent(relX, relY, evt.which, InputEventAction.Up))) {
                    evt.preventDefault();
                }
            }
        });
        // this.canvas.on('keydown', (event: JQuery.KeyDownEvent<HTMLCanvasElement, null, HTMLCanvasElement, HTMLCanvasElement>)=>{
        //     return ths.keyDown(event);
        // })
        // this.canvas.on('keyup',(event: KeyboardEvent)=>{
        //     return ths.keyUp(event);
        // })
        this.onInit().then(function () {
            _this.draw();
        }).then(function () {
            onInitialized(ths);
        });
    }
    BristolBoard.prototype.isKeyPressed = function (key) {
        return this.keyboardState.get(key) || false;
    };
    BristolBoard.prototype.mousePressed = function (evt) {
        return false;
    };
    BristolBoard.prototype.mouseReleased = function (evt) {
        return false;
    };
    BristolBoard.prototype.mouseMoved = function (event) {
        return false;
    };
    BristolBoard.prototype.keyUp = function (event) {
        return false;
    };
    BristolBoard.prototype.keyDown = function (event) {
        return false;
    };
    BristolBoard.prototype.pixelDensity = function () {
        return window.devicePixelRatio;
    };
    Object.defineProperty(BristolBoard.prototype, "targetFrameTime", {
        get: function () {
            return 1000 / this.targetFps;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BristolBoard.prototype, "fps", {
        get: function () {
            return 1 / (this.deltaDrawTime / 1000);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BristolBoard.prototype, "performanceRatio", {
        get: function () {
            return this.targetFps / this.deltaDrawTime;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BristolBoard.prototype, "avgPerfRatio", {
        get: function () {
            return this.perfAvg.val;
        },
        enumerable: false,
        configurable: true
    });
    BristolBoard.prototype.draw = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ths;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.drawProm != null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.drawProm];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                    case 2:
                        this.currentDrawTime = Date.now();
                        this.deltaDrawTime = (this.currentDrawTime - this.lastDrawTime);
                        this.perfAvg.add(this.performanceRatio);
                        this.drawProm = this.onDraw(this.deltaDrawTime);
                        return [4 /*yield*/, this.drawProm];
                    case 3:
                        _a.sent();
                        this.lastDrawTime = this.currentDrawTime;
                        ths = this;
                        // if (this.shouldExecJobs()) {
                        //     await this.jobExecutor.execJobs();
                        // }
                        this.drawProm = null;
                        if (this.autoFrames) {
                            setTimeout(function () {
                                window.requestAnimationFrame(_this.draw.bind(_this));
                            }, Math.max(this.targetFrameTime - this.deltaDrawTime, 0));
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    BristolBoard.prototype.drawFrame = function () {
        if (this.drawProm == null && !this.autoFrames) {
            window.requestAnimationFrame(this.draw.bind(this));
            return true;
        }
        return false;
    };
    Object.defineProperty(BristolBoard.prototype, "width", {
        get: function () {
            return this.iWidth;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BristolBoard.prototype, "height", {
        get: function () {
            return this.iHeight;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BristolBoard.prototype, "mouseX", {
        get: function () {
            return this.iMouseX;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BristolBoard.prototype, "mouseY", {
        get: function () {
            return this.iMouseY;
        },
        enumerable: false,
        configurable: true
    });
    BristolBoard.prototype.onResize = function () {
        this.iWidth = this.containerDiv.width;
        this.iHeight = this.containerDiv.height;
        this.canvas.element.width = this.iWidth;
        this.canvas.element.height = this.iHeight;
        this.canvas.setCss('width', this.iWidth + "px");
        this.canvas.setCss('height', this.iHeight + "px");
    };
    BristolBoard.prototype.displayDensity = function () {
        return 1;
    };
    BristolBoard.prototype.strokeColor = function (style) {
        var _a;
        this.ctx.strokeStyle = (_a = style === null || style === void 0 ? void 0 : style.toHexString()) !== null && _a !== void 0 ? _a : '#000000';
    };
    BristolBoard.prototype.roundedRect = function (x, y, w, h, rad) {
        if (typeof rad == 'number') {
            rad = {
                lowerLeft: rad,
                lowerRight: rad,
                upperLeft: rad,
                upperRight: rad
            };
        }
        var upperLeft = [x, y];
        var upperRight = [x + w, y];
        var lowerRight = [x + w, y + h];
        var lowerLeft = [x, y + h];
        this.ctx.beginPath();
        this.ctx.moveTo(upperLeft[0] + rad.upperLeft, upperLeft[1]);
        this.ctx.lineTo(upperRight[0] - rad.upperRight, upperRight[1]);
        this.ctx.arcTo(upperRight[0], upperRight[1], upperRight[0], upperRight[1] + rad.upperRight, rad.upperRight);
        this.ctx.lineTo(lowerRight[0], lowerRight[1] - rad.lowerRight);
        this.ctx.arcTo(lowerRight[0], lowerRight[1], lowerRight[0] - rad.lowerRight, lowerRight[1], rad.lowerRight);
        this.ctx.lineTo(lowerLeft[0] + rad.lowerLeft, lowerLeft[1]);
        this.ctx.arcTo(lowerLeft[0], lowerLeft[1], lowerLeft[0], lowerLeft[1] - rad.lowerLeft, rad.lowerLeft);
        this.ctx.lineTo(upperLeft[0], upperLeft[1] + rad.upperLeft);
        this.ctx.arcTo(upperLeft[0], upperLeft[1], upperLeft[0] + rad.upperLeft, upperLeft[1], rad.upperLeft);
        this.ctx.closePath();
    };
    BristolBoard.prototype.roundedRectFrame = function (frame, rad, fill, stroke) {
        if (fill === void 0) { fill = false; }
        if (stroke === void 0) { stroke = false; }
        if (typeof rad == 'number') {
            rad = {
                lowerLeft: rad,
                lowerRight: rad,
                upperLeft: rad,
                upperRight: rad
            };
        }
        var upperLeft = [frame.leftX(), frame.topY()];
        var upperRight = [frame.rightX(), frame.topY()];
        var lowerRight = [frame.rightX(), frame.bottomY()];
        var lowerLeft = [frame.leftX(), frame.bottomY()];
        this.ctx.beginPath();
        this.ctx.moveTo(upperLeft[0] + rad.upperLeft, upperLeft[1]);
        this.ctx.lineTo(upperRight[0] - rad.upperRight, upperRight[1]);
        this.ctx.arcTo(upperRight[0], upperRight[1], upperRight[0], upperRight[1] + rad.upperRight, rad.upperRight);
        this.ctx.lineTo(lowerRight[0], lowerRight[1] - rad.lowerRight);
        this.ctx.arcTo(lowerRight[0], lowerRight[1], lowerRight[0] - rad.lowerRight, lowerRight[1], rad.lowerRight);
        this.ctx.lineTo(lowerLeft[0] + rad.lowerLeft, lowerLeft[1]);
        this.ctx.arcTo(lowerLeft[0], lowerLeft[1], lowerLeft[0], lowerLeft[1] - rad.lowerLeft, rad.lowerLeft);
        this.ctx.lineTo(upperLeft[0], upperLeft[1] + rad.upperLeft);
        this.ctx.arcTo(upperLeft[0], upperLeft[1], upperLeft[0] + rad.upperLeft, upperLeft[1], rad.upperLeft);
        this.ctx.closePath();
        if (fill) {
            this.ctx.fill();
        }
        if (stroke) {
            this.ctx.stroke();
        }
    };
    // rectFrame(frame: UIFrame, rad: number | CornerRadius) {
    //     let upperLeft: [number, number] = [frame.upLeftX(), frame.topY()];
    //     let upperRight: [number, number] = [frame.upRightX(), frame.upRightY()];
    //     let lowerRight: [number, number] = [frame.rightX(), frame.bottomY()];
    //     let lowerLeft: [number, number] = [frame.leftX(), frame.bottomY()];
    //     this.ctx.beginPath();
    //     this.ctx.moveTo(frame.upLeftX(), frame.topY());
    //     this.ctx.lineTo(frame.upRightX(), frame.upRightY());
    //     this.ctx.lineTo(frame.rightX(), frame.bottomY());
    //     this.ctx.lineTo(frame.leftX(), frame.downLeftY());
    //     this.ctx.lineTo(frame.upLeftX(), frame.topY());
    //     this.ctx.closePath();
    // }
    BristolBoard.prototype.candleIcon = function (x, y, w, h, rad, wiskerSize, boxSize, padding) {
        if (rad === void 0) { rad = 2; }
        if (wiskerSize === void 0) { wiskerSize = [0.2, 0.9]; }
        if (boxSize === void 0) { boxSize = [0.4, 0.6]; }
        if (padding === void 0) { padding = 2; }
        var boxVPadding = (h - (h * boxSize[1])) / 2;
        var boxWPadding = (w - (w * boxSize[0])) / 2;
        var wiskerVPadding = (h - (h * wiskerSize[1])) / 2;
        var wiskerWPadding = (w - (w * wiskerSize[0])) / 2;
        var boxTop = y + boxVPadding;
        var boxBottom = y + h - boxVPadding;
        var boxLeft = x + boxWPadding;
        var boxRight = x + w - boxWPadding;
        var wiskerTop = y + wiskerVPadding;
        var wiskerBottom = y + h - wiskerVPadding;
        var wiskerLeft = x + wiskerWPadding;
        var wiskerRight = x + w - wiskerWPadding;
        var data = [
            [wiskerLeft, boxTop],
            [[wiskerLeft, wiskerTop + rad], [wiskerLeft, wiskerTop], [wiskerLeft + rad, wiskerTop], rad],
            [[wiskerRight - rad, wiskerTop], [wiskerRight, wiskerTop], [wiskerRight, wiskerTop + rad], rad],
            [wiskerRight, boxTop],
            [[boxRight - rad, boxTop], [boxRight, boxTop], [boxRight, boxTop + rad], rad],
            [[boxRight, boxBottom - rad], [boxRight, boxBottom], [boxRight - rad, boxBottom], rad],
            [wiskerRight, boxBottom],
            [[wiskerRight, wiskerBottom - rad], [wiskerRight, wiskerBottom], [wiskerRight - rad, wiskerBottom], rad],
            [[wiskerLeft + rad, wiskerBottom], [wiskerLeft, wiskerBottom], [wiskerLeft, wiskerBottom - rad], rad],
            [wiskerLeft, boxBottom],
            [[boxLeft + rad, boxBottom], [boxLeft, boxBottom], [boxLeft, boxBottom - rad], rad],
            [[boxLeft, boxTop + rad], [boxLeft, boxTop], [boxLeft + rad, boxTop], rad],
            [wiskerLeft, boxTop]
        ];
        //[x, y] | [[x,y],[x,y],[x,y],radius]
        this.ctx.beginPath();
        var startPoint = data[0];
        this.ctx.moveTo(startPoint[0], startPoint[1]);
        var points;
        for (var i = 1; i < data.length; i++) {
            if (data[i].length == 2) { //[x,y]
                this.ctx.lineTo(data[i][0], data[i][1]);
            }
            else { //[[x, y], [x, y], [x, y], radius]
                points = data[i];
                this.ctx.lineTo(points[0][0], points[0][1]); //A
                this.ctx.arcTo(points[1][0], points[1][1], points[2][0], points[2][1], points[3]);
            }
        }
    };
    BristolBoard.prototype.fillColor = function (style) {
        this.ctx.fillStyle = style.toHexString();
    };
    BristolBoard.prototype.noStroke = function () {
        this.ctx.strokeStyle = BristolBoard.noStyle;
    };
    BristolBoard.prototype.noFill = function () {
        this.ctx.fillStyle = BristolBoard.noStyle;
    };
    BristolBoard.prototype.strokeWeight = function (weight) {
        this.ctx.lineWidth = weight;
    };
    BristolBoard.prototype.cursor = function (cursorCss) {
        this.canvas.setCss('cursor', cursorCss);
    };
    BristolBoard.prototype.background = function (color) {
        this.noStroke();
        this.fillColor(color);
        this.ctx.fillRect(0, 0, this.width, this.height);
    };
    BristolBoard.prototype.line = function (x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    };
    BristolBoard.prototype.ellipse = function (centerX, centerY, width, height, stroke, fill) {
        if (stroke === void 0) { stroke = true; }
        if (fill === void 0) { fill = false; }
        this.ellipseBounds(centerX - width / 2.0, centerY - height / 2.0, width, height, stroke, fill);
    };
    BristolBoard.prototype.ellipseFrame = function (uiFrame, stroke, fill) {
        if (stroke === void 0) { stroke = true; }
        if (fill === void 0) { fill = false; }
        this.ellipseBounds(uiFrame.leftX(), uiFrame.topY(), uiFrame.measureWidth(), uiFrame.measureHeight());
    };
    BristolBoard.prototype.ellipseBounds = function (cornerX, cornerY, w, h, stroke, fill) {
        if (stroke === void 0) { stroke = true; }
        if (fill === void 0) { fill = false; }
        var kappa = .5522848, ox = (w / 2) * kappa, // control point offset horizontal
        oy = (h / 2) * kappa, // control point offset vertical
        xe = cornerX + w, // x-end
        ye = cornerY + h, // y-end
        xm = cornerX + w / 2, // x-middle
        ym = cornerY + h / 2; // y-middle
        this.ctx.beginPath();
        this.ctx.moveTo(cornerX, ym);
        this.ctx.bezierCurveTo(cornerX, ym - oy, xm - ox, cornerY, xm, cornerY);
        this.ctx.bezierCurveTo(xm + ox, cornerY, xe, ym - oy, xe, ym);
        this.ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        this.ctx.bezierCurveTo(xm - ox, ye, cornerX, ym + oy, cornerX, ym);
        if (stroke) {
            this.ctx.stroke();
        }
        if (fill) {
            this.ctx.fill();
        }
    };
    BristolBoard.prototype.text = function (str, x, y) {
        this.ctx.fillText(str, x, y);
    };
    BristolBoard.prototype.getFontText = function () {
        return this.font.toString();
    };
    BristolBoard.prototype.textWeight = function (weight) {
        this.font.weight = weight;
        this.ctx.font = this.font.toString();
    };
    BristolBoard.prototype.textSize = function (size) {
        this.font.size = size;
        this.ctx.font = this.font.toString();
    };
    BristolBoard.prototype.fontFamily = function (family) {
        this.font.family = family;
        this.ctx.font = this.font.toString();
    };
    BristolBoard.prototype.textAlign = function (horizontal, vertical) {
        this.ctx.textAlign = horizontal;
        this.ctx.textBaseline = vertical;
    };
    BristolBoard.prototype.textWidth = function (text) {
        return this.ctx.measureText(text).width;
    };
    BristolBoard.prototype.rect = function (x, y, w, h) {
        this.ctx.rect(x, y, w, h);
    };
    BristolBoard.prototype.rectFrame = function (frame) {
        return this.ctx.rect(frame.leftX(), frame.topY(), frame.measureWidth(), frame.measureHeight());
    };
    BristolBoard.prototype.fillRectFrame = function (frame) {
        return this.ctx.fillRect(frame.leftX(), frame.topY(), frame.measureWidth(), frame.measureHeight());
    };
    BristolBoard.prototype.mouseScrolled = function (event) {
    };
    BristolBoard.prototype.mouseDragged = function (event) {
    };
    //overridable methods--------------------------------------------------
    BristolBoard.prototype.shouldExecJobs = function () {
        return false;
    };
    BristolBoard.prototype.addUiElement = function (element) {
        element.parent = this; //bad type
        this.uiElements.add(element);
        // for (let i = 0; i < this.uiElements.length; i++) {
        //     if (this.uiElements[i].depth >= element.depth) {
        //         this.uiElements.splice(i, 0, element);
        //         return;
        //     }
        // }
        // this.uiElements.push(element);
    };
    BristolBoard.prototype.removeUIElement = function (element) {
        element.parent = null;
        this.uiElements.remove(function (elem) { return (elem.id == element.id); });
        // var removeIndex = this.uiElements.map(item => item.id)
        //     .indexOf(element.id);
        // if (removeIndex !== -1) {
        //     ~removeIndex && this.uiElements.splice(removeIndex, 1);
        // }
    };
    BristolBoard.prototype.onDraw = function (deltaMs) {
        return __awaiter(this, void 0, void 0, function () {
            var ths;
            return __generator(this, function (_a) {
                ths = this;
                this.noStroke();
                this.fillColor(_imports__WEBPACK_IMPORTED_MODULE_1__.fColor.grey.darken3);
                this.ctx.fillRect(0, 0, this.width, this.height);
                // this.currentContentPanel.drawBackground(deltaMs);
                //  this.ctx.fillStyle = fColor.green.darken2.toHexString();
                // this.ctx.fillRect(0,0, 500, 500);
                //         console.log(this.ctx);
                this.uiElements.forEach(function (element) {
                    if (element.frame.isVisible()) {
                        element.draw(deltaMs, ths.ctx);
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    BristolBoard.noStyle = '';
    return BristolBoard;
}());



/***/ }),

/***/ "./src/Bristol/MainBristol.ts":
/*!************************************!*\
  !*** ./src/Bristol/MainBristol.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CardBristol": () => (/* binding */ CardBristol)
/* harmony export */ });
/* harmony import */ var _imports__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../imports */ "./src/imports.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};

var CardBristol = /** @class */ (function (_super) {
    __extends(CardBristol, _super);
    function CardBristol(containerDivElem, onInitialized) {
        var _this = _super.call(this, containerDivElem, onInitialized) || this;
        _this.padding = 8;
        var ths = _this;
        _this.machine = new _imports__WEBPACK_IMPORTED_MODULE_0__.SlotMachine('theMachine', new _imports__WEBPACK_IMPORTED_MODULE_0__.UIFrame_Rect_CornerSized(0, 0, _this.width), _this);
        _this.machine.frame.relY = function () { return (ths.height / 2 - ths.machine.frame.measureHeight() / 2); };
        _this.message = new _imports__WEBPACK_IMPORTED_MODULE_0__.SpecialMessage('message', function () { return 'Happy Birthday Christina!'; }, new _imports__WEBPACK_IMPORTED_MODULE_0__.UIFrame_Rect_CornerSized(0, 0, ths.width, ths.machine.frame.relY), _this);
        _this.addUiElement(_this.message);
        _this.addUiElement(_this.machine);
        return _this;
    }
    CardBristol.prototype.onInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ths;
            return __generator(this, function (_a) {
                ths = this;
                return [2 /*return*/];
            });
        });
    };
    CardBristol.prototype.mousePressed = function (evt) {
        return this.machine.lever.mousePressed(evt);
    };
    CardBristol.prototype.mouseReleased = function (evt) {
        return this.machine.lever.mouseReleased(evt);
    };
    CardBristol.prototype.mouseDragged = function (evt) {
        return this.machine.lever.mouseDragged(evt);
    };
    return CardBristol;
}(_imports__WEBPACK_IMPORTED_MODULE_0__.BristolBoard));



/***/ }),

/***/ "./src/Bristol/UIElement.ts":
/*!**********************************!*\
  !*** ./src/Bristol/UIElement.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UIElement": () => (/* binding */ UIElement)
/* harmony export */ });
/* harmony import */ var _imports__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../imports */ "./src/imports.ts");

var UIElement = /** @class */ (function () {
    function UIElement(uid, uiFrame, brist) {
        this.parent = null;
        this.cElements = _imports__WEBPACK_IMPORTED_MODULE_0__.SortedLinkedList.Create(function (a, b) { return (a.depth - b.depth); });
        // childElements: Array<UIElement> = [];
        this.zOffset = 0;
        this.dfc = null;
        this.id = uid;
        this.brist = brist;
        // this.panel = panel;
        this.frame = uiFrame;
    }
    Object.defineProperty(UIElement.prototype, "depth", {
        // panel: UIContentPanel;
        get: function () {
            if (this.parent == null || this.parent instanceof _imports__WEBPACK_IMPORTED_MODULE_0__.CardBristol) {
                return this.zOffset;
            }
            if (this.parent instanceof UIElement) {
                return this.parent.depth + 1 + this.zOffset;
            }
        },
        enumerable: false,
        configurable: true
    });
    UIElement.prototype.findChild = function (childId) {
        return this.cElements.find(function (elem) { return (elem.id == childId); });
        // for (let i = 0; i < this.childElements.length; i++) {
        //     if (this.childElements[i].id == childId) {
        //         return this.childElements[i];
        //     }
        // }
        // return null;
    };
    UIElement.prototype.addChild = function (childElement) {
        // let index: number = -1;
        // index = this.childElements.push(childElement) - 1;
        var i = this.cElements.add(childElement);
        childElement.parent = this;
        childElement.frame.parent = this.frame;
        childElement.onAddToParent();
        return i;
    };
    UIElement.prototype.removeFromParent = function () {
        if (this.parent instanceof UIElement) {
            this.parent.removeUIElement(this.id);
        }
        else {
            this.parent.removeUIElement(this);
        }
    };
    UIElement.prototype.removeUIElement = function (childId) {
        this.cElements.remove(function (elem) { return (elem.id == childId); });
        // for (let i = 0; i < this.childElements.length; i++) {
        //     if (this.childElements[i].id == childId) {
        //         this.childElements[i].onRemoveFromParent();
        //         this.childElements[i].parent = null;
        //         this.childElements.splice(i, 1);
        //     }
        // }
    };
    UIElement.prototype.clearChildElements = function () {
        this.cElements.clear();
    };
    UIElement.prototype.draw = function (deltaTime, ctx) {
        this.onDrawBackground(deltaTime, ctx);
        this.cElements.forEach(function (elem) {
            if (elem.frame.isVisible()) {
                elem.draw(deltaTime, ctx);
            }
        });
        this.onDrawForeground(deltaTime, ctx);
    };
    UIElement.prototype.onDrawBackground = function (deltaTime, ctx) {
    };
    UIElement.prototype.onDrawForeground = function (deltaTime, ctx) {
    };
    UIElement.prototype.isInside = function (x, y) {
        return this.frame.isInside(x, y);
    };
    UIElement.prototype.onAddToParent = function () {
    };
    UIElement.prototype.onRemoveFromParent = function () {
    };
    UIElement.prototype.onPanelShow = function () {
        this.cElements.forEach(function (elem) {
            elem.onPanelShow();
        });
    };
    UIElement.prototype.onPanelHide = function () {
        this.cElements.forEach(function (elem) {
            elem.onPanelHide();
        });
    };
    UIElement.prototype.mousePressed = function (evt) { return false; };
    UIElement.prototype.mouseReleased = function (evt) { return false; };
    UIElement.prototype.mouseEnter = function (evt) { return true; };
    UIElement.prototype.mouseExit = function (evt) { return false; };
    UIElement.prototype.mouseMoved = function (evt) { return false; };
    UIElement.prototype.mouseDragged = function (evt) { return false; };
    UIElement.prototype.mouseWheel = function (delta) { return false; };
    UIElement.prototype.keyPressed = function (evt) { return false; };
    UIElement.prototype.keyReleased = function (evt) { return false; };
    Object.defineProperty(UIElement.prototype, "debugFrameColor", {
        get: function () {
            if (this.dfc == null) {
                var colors = ['red', 'blue', 'green', 'purple', 'orange', 'cyan'];
                var color = colors[Math.floor(Math.random() * colors.length)];
                var subColors = ['accent1', 'accent3', 'lighten2', 'lighten4'];
                var subColor = subColors[Math.floor(Math.random() * subColors.length)];
                this.dfc = _imports__WEBPACK_IMPORTED_MODULE_0__.fColor[color][subColor];
            }
            return this.dfc;
        },
        enumerable: false,
        configurable: true
    });
    UIElement.prototype.drawUIFrame = function (drawChildFrames, weight) {
        if (drawChildFrames === void 0) { drawChildFrames = true; }
        if (weight === void 0) { weight = 1; }
        this.brist.strokeColor(this.debugFrameColor);
        this.brist.strokeWeight(weight);
        this.brist.ellipse(this.frame.leftX(), this.frame.topY(), weight * 2, weight * 2);
        this.brist.line(this.frame.leftX(), this.frame.topY(), this.frame.rightX(), this.frame.topY());
        this.brist.ellipse(this.frame.rightX(), this.frame.topY(), weight * 2, weight * 2);
        this.brist.line(this.frame.rightX(), this.frame.topY(), this.frame.rightX(), this.frame.bottomY());
        this.brist.ellipse(this.frame.rightX(), this.frame.bottomY(), weight * 2, weight * 2);
        this.brist.line(this.frame.rightX(), this.frame.bottomY(), this.frame.leftX(), this.frame.bottomY());
        this.brist.ellipse(this.frame.leftX(), this.frame.bottomY(), weight * 2, weight * 2);
        this.brist.line(this.frame.leftX(), this.frame.bottomY(), this.frame.leftX(), this.frame.topY());
        this.brist.ellipse(this.frame.centerX(), this.frame.centerY(), weight * 2, weight * 2);
        // this.brist.ctx.strokeRect(this.frame.upLeftX(), this.frame.topY(), this.frame.measureWidth(), this.frame.measureHeight());
        if (drawChildFrames) {
            this.cElements.forEach(function (elem) {
                elem.drawUIFrame(true, weight);
            });
        }
    };
    return UIElement;
}());



/***/ }),

/***/ "./src/Bristol/UIFrame.ts":
/*!********************************!*\
  !*** ./src/Bristol/UIFrame.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UIFrame_Abstract": () => (/* binding */ UIFrame_Abstract),
/* harmony export */   "UICorner": () => (/* binding */ UICorner),
/* harmony export */   "UIFrame_Rect_CornerSized": () => (/* binding */ UIFrame_Rect_CornerSized)
/* harmony export */ });
/* harmony import */ var _imports__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../imports */ "./src/imports.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var UIFrame_Abstract = /** @class */ (function () {
    function UIFrame_Abstract() {
        this.visible = true;
    }
    UIFrame_Abstract.prototype.isVisible = function () {
        return (0,_imports__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(this.visible);
    };
    UIFrame_Abstract.prototype.centerX = function () {
        return (this.leftX() + this.rightX()) / 2;
    };
    UIFrame_Abstract.prototype.centerY = function () {
        return (this.bottomY() + this.topY()) / 2;
    };
    UIFrame_Abstract.prototype.getCornerX = function (corner) {
        switch (corner) {
            case UICorner.upLeft:
                return this.leftX();
            case UICorner.upRight:
                return this.rightX();
            case UICorner.downRight:
                return this.rightX();
            case UICorner.downLeft:
                return this.leftX();
            case UICorner.center:
                return this.centerX();
        }
    };
    UIFrame_Abstract.prototype.getCornerY = function (corner) {
        switch (corner) {
            case UICorner.upLeft:
                return this.topY();
            case UICorner.upRight:
                return this.topY();
            case UICorner.downRight:
                return this.bottomY();
            case UICorner.downLeft:
                return this.bottomY();
            case UICorner.center:
                return this.centerY();
        }
    };
    UIFrame_Abstract.prototype.measureWidth = function () {
        return this.rightX() - this.leftX();
    };
    UIFrame_Abstract.prototype.measureHeight = function () {
        return this.bottomY() - this.topY();
    };
    return UIFrame_Abstract;
}());

var UICorner;
(function (UICorner) {
    UICorner[UICorner["upLeft"] = 0] = "upLeft";
    UICorner[UICorner["upRight"] = 1] = "upRight";
    UICorner[UICorner["downRight"] = 2] = "downRight";
    UICorner[UICorner["downLeft"] = 3] = "downLeft";
    UICorner[UICorner["center"] = 4] = "center";
})(UICorner || (UICorner = {}));
var UIFrame_Rect_CornerSized = /** @class */ (function (_super) {
    __extends(UIFrame_Rect_CornerSized, _super);
    function UIFrame_Rect_CornerSized(x, y, width, height, measureCorner, parent, parentCorner) {
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        if (measureCorner === void 0) { measureCorner = UICorner.upLeft; }
        if (parent === void 0) { parent = null; }
        if (parentCorner === void 0) { parentCorner = UICorner.upLeft; }
        var _this = _super.call(this) || this;
        _this.measureCorner = measureCorner;
        _this.parentCorner = parentCorner;
        _this.relX = x;
        _this.relY = y;
        _this.width = width;
        _this.height = height;
        _this.parent = parent;
        var ths = _this;
        _this.absX = function () { return (ths.hasParent ? (0,_imports__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(ths.relX) + ths.parent.getCornerX((0,_imports__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(ths.parentCorner)) : (0,_imports__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(ths.relX)); };
        _this.absY = function () { return (ths.hasParent ? (0,_imports__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(ths.relY) + ths.parent.getCornerY((0,_imports__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(ths.parentCorner)) : (0,_imports__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(ths.relY)); };
        return _this;
    }
    UIFrame_Rect_CornerSized.prototype.isInside = function (x, y) {
        return (x >= this.leftX() && x <= this.rightX()) && (y >= this.topY() && y <= this.bottomY());
    };
    UIFrame_Rect_CornerSized.prototype.leftX = function () {
        switch (this.measureCorner) {
            default:
            case UICorner.downLeft:
            case UICorner.upLeft:
                return (0,_imports__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(this.absX);
            case UICorner.upRight:
            case UICorner.downRight:
                return (0,_imports__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(this.absX) - (0,_imports__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(this.width);
        }
    };
    UIFrame_Rect_CornerSized.prototype.topY = function () {
        switch (this.measureCorner) {
            default:
            case UICorner.downLeft:
            case UICorner.downRight:
                return (0,_imports__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(this.absY) - (0,_imports__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(this.height);
            case UICorner.upLeft:
            case UICorner.upRight:
                return (0,_imports__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(this.absY);
        }
    };
    UIFrame_Rect_CornerSized.prototype.rightX = function () {
        switch (this.measureCorner) {
            default:
            case UICorner.downLeft:
            case UICorner.upLeft:
                return (0,_imports__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(this.absX) + (0,_imports__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(this.width);
            case UICorner.upRight:
            case UICorner.downRight:
                return (0,_imports__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(this.absX);
        }
    };
    UIFrame_Rect_CornerSized.prototype.bottomY = function () {
        switch (this.measureCorner) {
            default:
            case UICorner.downLeft:
            case UICorner.downRight:
                return (0,_imports__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(this.absY);
            case UICorner.upLeft:
            case UICorner.upRight:
                return (0,_imports__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(this.absY) + (0,_imports__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(this.height);
        }
    };
    UIFrame_Rect_CornerSized.prototype.measureWidth = function () {
        return (0,_imports__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(this.width);
    };
    UIFrame_Rect_CornerSized.prototype.measureHeight = function () {
        return (0,_imports__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(this.height);
    };
    Object.defineProperty(UIFrame_Rect_CornerSized.prototype, "hasParent", {
        get: function () {
            return this.parent != null;
        },
        enumerable: false,
        configurable: true
    });
    return UIFrame_Rect_CornerSized;
}(UIFrame_Abstract));



/***/ }),

/***/ "./src/Elements/Background.ts":
/*!************************************!*\
  !*** ./src/Elements/Background.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BackgroundElement": () => (/* binding */ BackgroundElement)
/* harmony export */ });
/* harmony import */ var _imports__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../imports */ "./src/imports.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var BackgroundElement = /** @class */ (function (_super) {
    __extends(BackgroundElement, _super);
    function BackgroundElement(uid, brist) {
        var _this = _super.call(this, uid, new _imports__WEBPACK_IMPORTED_MODULE_0__.UIFrame_Rect_CornerSized(0, 0), brist) || this;
        _this.frame.width = function () { return brist.width; };
        _this.frame.height = function () { return brist.height; };
        var field = new _imports__WEBPACK_IMPORTED_MODULE_0__.FootballField('field', brist);
        var sky = new _imports__WEBPACK_IMPORTED_MODULE_0__.Sky('sky', brist);
        var crowd = new _imports__WEBPACK_IMPORTED_MODULE_0__.ImageElement('brickA', ["./crowd.jpg"], new _imports__WEBPACK_IMPORTED_MODULE_0__.UIFrame_Rect_CornerSized(0, 0), brist);
        crowd.frame.relY = function () { return (0); };
        crowd.frame.relX = function () { return (field.currentOffset * 0.2); };
        crowd.setScale(2.5);
        crowd.tileX(3);
        var bricks = new _imports__WEBPACK_IMPORTED_MODULE_0__.ImageElement('brickA', ["./bricks.jpg"], new _imports__WEBPACK_IMPORTED_MODULE_0__.UIFrame_Rect_CornerSized(0, 0), brist);
        bricks.frame.relY = function () { return (brist.height * 2 / 3 - bricks.frame.measureHeight()); };
        bricks.frame.relX = function () { return (field.currentOffset * 0.2); };
        bricks.setScale(0.10);
        bricks.tileX(20);
        var message = new _imports__WEBPACK_IMPORTED_MODULE_0__.ImageElement('message', ["./HappyFathersday.jpg"], new _imports__WEBPACK_IMPORTED_MODULE_0__.UIFrame_Rect_CornerSized(0, 0), brist);
        message.frame.relY = function () { return (brist.height * 2 / 3 - bricks.frame.measureHeight() * 0.5 - message.frame.measureHeight() * 0.5); };
        message.frame.relX = function () { return (field.currentOffset * 0.2); };
        message.setScale(0.2);
        message.tileX(20);
        _this.addChild(message);
        _this.addChild(bricks);
        _this.addChild(crowd);
        _this.addChild(sky);
        _this.addChild(field);
        return _this;
    }
    BackgroundElement.prototype.onDrawForeground = function (deltaMs) {
        // this.brist.fillColor(fColor.green.darken2);
        // this.brist.fillRectFrame(this.frame);
    };
    return BackgroundElement;
}(_imports__WEBPACK_IMPORTED_MODULE_0__.UIElement));



/***/ }),

/***/ "./src/Elements/FootballField.ts":
/*!***************************************!*\
  !*** ./src/Elements/FootballField.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FootballField": () => (/* binding */ FootballField)
/* harmony export */ });
/* harmony import */ var _imports__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../imports */ "./src/imports.ts");
/* harmony import */ var _Bristol_UIFrame__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Bristol/UIFrame */ "./src/Bristol/UIFrame.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var FootballField = /** @class */ (function (_super) {
    __extends(FootballField, _super);
    function FootballField(uid, brist) {
        var _this = _super.call(this, uid, new _Bristol_UIFrame__WEBPACK_IMPORTED_MODULE_1__.UIFrame_Rect_CornerSized(0, 0), brist) || this;
        _this.distance = 1000;
        _this.distanceVariance = 600;
        _this.lineWidth = 8;
        _this.widthVariance = 5;
        _this.runDistance = 0;
        _this.frame.relY = function () { return brist.height * 2 / 3; };
        _this.frame.width = function () { return brist.width; };
        _this.frame.height = function () { return brist.height / 3; };
        if (brist.width < brist.height) {
            _this.distance = Math.min(_this.distance, brist.width);
        }
        _this.distanceVariance = _this.distance * 0.5;
        return _this;
    }
    Object.defineProperty(FootballField.prototype, "currentOffset", {
        get: function () {
            return this.runDistance % this.distance;
        },
        enumerable: false,
        configurable: true
    });
    FootballField.prototype.onDrawBackground = function (deltaMs) {
        this.runDistance -= deltaMs * 0.2;
        this.brist.fillColor(_imports__WEBPACK_IMPORTED_MODULE_0__.fColor.green.darken2);
        this.brist.fillRectFrame(this.frame);
    };
    FootballField.prototype.onDrawForeground = function (deltaMs) {
        var top = this.frame.topY();
        var bottom = this.frame.bottomY();
        this.brist.fillColor(_imports__WEBPACK_IMPORTED_MODULE_0__.fColor.white);
        var frameWidth = this.frame.measureWidth();
        var startX = this.currentOffset - this.distance * 100;
        for (var i = startX; i < frameWidth + this.distance * 100; i += this.distance) {
            var warpAlpha = ((frameWidth / 2 - i) / frameWidth) * 2;
            this.brist.ctx.beginPath();
            this.brist.ctx.moveTo(i + warpAlpha * this.distanceVariance, top);
            this.brist.ctx.lineTo(i + this.lineWidth + warpAlpha * this.distanceVariance, top);
            this.brist.ctx.lineTo(i + this.lineWidth + this.widthVariance, bottom);
            this.brist.ctx.lineTo(i, bottom);
            this.brist.ctx.lineTo(i + warpAlpha * this.distanceVariance, top);
            this.brist.ctx.closePath();
            this.brist.ctx.fill();
        }
    };
    return FootballField;
}(_imports__WEBPACK_IMPORTED_MODULE_0__.UIElement));



/***/ }),

/***/ "./src/Elements/ImageElem.ts":
/*!***********************************!*\
  !*** ./src/Elements/ImageElem.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ImageElement": () => (/* binding */ ImageElement)
/* harmony export */ });
/* harmony import */ var _Helper_Helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Helper/Helper */ "./src/Helper/Helper.ts");
/* harmony import */ var _imports__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../imports */ "./src/imports.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var ImageElement = /** @class */ (function (_super) {
    __extends(ImageElement, _super);
    function ImageElement(uid, url, frame, brist) {
        var _this = _super.call(this, uid, frame, brist) || this;
        _this.currentFrameIndex = 0;
        _this.imgDownloaded = false;
        _this.rotationPivot = [0, 0];
        _this.rotation = 0;
        _this.time = 0;
        //this.frame.absY = () => { return brist.height / 2 };
        // this.frame.height = () => { return brist.height * 2 / 3; }
        var ths = _this;
        _this.images = [];
        var _loop_1 = function (i) {
            this_1.images[i] = new Image();
            var tmp = i;
            this_1.images[i].onload = function () {
                ths.onLoaded(tmp);
            };
            this_1.images[i].src = url[i];
        };
        var this_1 = this;
        for (var i = 0; i < url.length; i++) {
            _loop_1(i);
        }
        return _this;
        // this.rotation = () => { return Math.PI * ths.time };
        // this.setPivotToCenter();
    }
    Object.defineProperty(ImageElement.prototype, "currentFrame", {
        get: function () {
            var _a;
            return (_a = this.images[Math.min(this.images.length - 1, (0,_Helper_Helper__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(this.currentFrameIndex, 0))]) !== null && _a !== void 0 ? _a : null;
        },
        enumerable: false,
        configurable: true
    });
    ImageElement.prototype.animateFrames = function (fps) {
        var _this = this;
        var timeBetweenFrames = 1 / fps;
        var timeBetweenLoops = timeBetweenFrames * this.images.length;
        var ths = this;
        this.currentFrameIndex = function () {
            var alpha = (ths.time % timeBetweenLoops) / timeBetweenLoops;
            var currentFrame = Math.round(alpha * (_this.images.length - 1));
            //console.log(currentFrame);
            return currentFrame;
        };
    };
    ImageElement.prototype.setScale = function (scale) {
        var ths = this;
        this.frame.width = function () { var _a, _b; return (_b = ((_a = ths.currentFrame) === null || _a === void 0 ? void 0 : _a.naturalWidth) * scale) !== null && _b !== void 0 ? _b : 10; };
        this.frame.height = function () { var _a, _b; return (_b = ((_a = ths.currentFrame) === null || _a === void 0 ? void 0 : _a.naturalHeight) * scale) !== null && _b !== void 0 ? _b : 10; };
    };
    ImageElement.prototype.setFrameIndex = function (frameIndex) {
        this.currentFrameIndex = frameIndex;
    };
    ImageElement.prototype.setPivotToCenter = function (useFunc) {
        if (useFunc === void 0) { useFunc = true; }
        if (useFunc) {
            var ths_1 = this;
            this.rotationPivot[0] = function () { return (ths_1.frame.measureWidth() / 2); };
            this.rotationPivot[1] = function () { return (ths_1.frame.measureHeight() / 2); };
        }
        else {
            this.rotationPivot[0] = (this.frame.measureWidth() / 2);
            this.rotationPivot[1] = (this.frame.measureHeight() / 2);
        }
    };
    ImageElement.prototype.setPivotByPercent = function (xAlpha, yAlpha) {
        var _this = this;
        this.rotationPivot[0] = function () { return (_this.frame.measureWidth() * (0,_Helper_Helper__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(xAlpha, 0)); };
        this.rotationPivot[1] = function () { return (_this.frame.measureHeight() * (0,_Helper_Helper__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(yAlpha, 0)); };
    };
    ImageElement.prototype.onLoaded = function (index) {
        this.imgDownloaded = true;
    };
    ImageElement.prototype.onDrawBackground = function (deltaMs) {
        this.time += deltaMs * 0.001;
        if (this.imgDownloaded) {
            this.brist.ctx.save();
            this.brist.ctx.translate(this.frame.leftX(), this.frame.topY());
            this.brist.ctx.rotate((0,_Helper_Helper__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(this.rotation, 0));
            this.brist.ctx.drawImage(this.currentFrame, 0 - (0,_Helper_Helper__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(this.rotationPivot[0], 0), 0 - (0,_Helper_Helper__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(this.rotationPivot[1], 0), this.frame.measureWidth(), this.frame.measureHeight());
            // this.brist.strokeWeight(1);
            //  this.brist.strokeColor(fColor.red.accent1);
            //  this.brist.ctx.strokeRect(0 - evalOptionalFunc(this.rotationPivot[0], 0), 0 - evalOptionalFunc(this.rotationPivot[1], 0), this.frame.measureWidth(), this.frame.measureHeight());
            this.brist.ctx.restore();
        }
    };
    ImageElement.prototype.tileX = function (tileCount) {
        var ths = this;
        this.onDrawBackground = function (deltaMs) {
            ths.time += deltaMs * 0.001;
            if (ths.imgDownloaded) {
                ths.brist.ctx.save();
                ths.brist.ctx.translate(ths.frame.leftX(), ths.frame.topY());
                ths.brist.ctx.rotate((0,_Helper_Helper__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(ths.rotation, 0));
                for (var i = 0; i < tileCount; i++) {
                    ths.brist.ctx.drawImage(ths.currentFrame, 0 - (0,_Helper_Helper__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(ths.rotationPivot[0], 0) + i * ths.frame.measureWidth(), 0 - (0,_Helper_Helper__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(this.rotationPivot[1], 0), this.frame.measureWidth(), this.frame.measureHeight());
                } // this.brist.strokeWeight(1);
                //  this.brist.strokeColor(fColor.red.accent1);
                //  this.brist.ctx.strokeRect(0 - evalOptionalFunc(this.rotationPivot[0], 0), 0 - evalOptionalFunc(this.rotationPivot[1], 0), this.frame.measureWidth(), this.frame.measureHeight());
                ths.brist.ctx.restore();
            }
        };
    };
    return ImageElement;
}(_imports__WEBPACK_IMPORTED_MODULE_1__.UIElement));



/***/ }),

/***/ "./src/Elements/Message.ts":
/*!*********************************!*\
  !*** ./src/Elements/Message.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpecialMessage": () => (/* binding */ SpecialMessage)
/* harmony export */ });
/* harmony import */ var _Helper_Helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Helper/Helper */ "./src/Helper/Helper.ts");
/* harmony import */ var _imports__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../imports */ "./src/imports.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var SpecialMessage = /** @class */ (function (_super) {
    __extends(SpecialMessage, _super);
    function SpecialMessage(id, text, frame, brist) {
        var _this = _super.call(this, id, frame, brist) || this;
        _this.getText = function () { return (0,_Helper_Helper__WEBPACK_IMPORTED_MODULE_0__.evalOptionalFunc)(text); };
        return _this;
    }
    SpecialMessage.prototype.onDrawBackground = function (deltaMs) {
        this.brist.fillColor(fColor.white);
        this.brist.fillRectFrame(this.frame);
        this.brist.noStroke();
        this.brist.fillColor(fColor.green.darken1);
        this.brist.textAlign(_imports__WEBPACK_IMPORTED_MODULE_1__.BristolHAlign.Left, _imports__WEBPACK_IMPORTED_MODULE_1__.BristolVAlign.Middle);
        this.brist.fontFamily(_imports__WEBPACK_IMPORTED_MODULE_1__.BristolFontFamily.Verdana);
        this.brist.textSize(18);
        this.brist.text(this.getText(), this.frame.leftX() + this.frame.measureHeight() / 2, this.frame.centerY());
    };
    return SpecialMessage;
}(_imports__WEBPACK_IMPORTED_MODULE_1__.UIElement));



/***/ }),

/***/ "./src/Elements/Sky.ts":
/*!*****************************!*\
  !*** ./src/Elements/Sky.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Sky": () => (/* binding */ Sky)
/* harmony export */ });
/* harmony import */ var _imports__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../imports */ "./src/imports.ts");
/* harmony import */ var _Bristol_UIFrame__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Bristol/UIFrame */ "./src/Bristol/UIFrame.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var Sky = /** @class */ (function (_super) {
    __extends(Sky, _super);
    function Sky(uid, brist) {
        var _this = _super.call(this, uid, new _Bristol_UIFrame__WEBPACK_IMPORTED_MODULE_1__.UIFrame_Rect_CornerSized(0, 0), brist) || this;
        //this.frame.absY = () => { return brist.height / 2 };
        _this.frame.width = function () { return brist.width; };
        _this.frame.height = function () { return brist.height * 2 / 3; };
        return _this;
    }
    Sky.prototype.onDrawBackground = function (deltaMs) {
        this.brist.fillColor(_imports__WEBPACK_IMPORTED_MODULE_0__.fColor.blue.lighten1);
        this.brist.fillRectFrame(this.frame);
    };
    return Sky;
}(_imports__WEBPACK_IMPORTED_MODULE_0__.UIElement));



/***/ }),

/***/ "./src/Elements/SlotMachine.ts":
/*!*************************************!*\
  !*** ./src/Elements/SlotMachine.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SlotLeverAssembly": () => (/* binding */ SlotLeverAssembly),
/* harmony export */   "SlotMachineWheel": () => (/* binding */ SlotMachineWheel),
/* harmony export */   "SlotMachineWheels": () => (/* binding */ SlotMachineWheels),
/* harmony export */   "RewardHole": () => (/* binding */ RewardHole),
/* harmony export */   "SlotMachine": () => (/* binding */ SlotMachine)
/* harmony export */ });
/* harmony import */ var _imports__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../imports */ "./src/imports.ts");
/* harmony import */ var _ImageElem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ImageElem */ "./src/Elements/ImageElem.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var SlotLeverAssembly = /** @class */ (function (_super) {
    __extends(SlotLeverAssembly, _super);
    function SlotLeverAssembly(uid, machine) {
        var _this = _super.call(this, uid, new _imports__WEBPACK_IMPORTED_MODULE_0__.UIFrame_Rect_CornerSized(0, 0, machine.colWidth, machine.colHeight * 2), machine.brist) || this;
        _this.pullAlpha = 0.0;
        _this.randomNess = 0.5;
        _this.isPressed = false;
        _this.lastDragTime = -1;
        _this.machine = machine;
        _this.paw = new Image();
        _this.paw.src = './PajamaPaw.png';
        _this.zOffset = 2;
        return _this;
    }
    SlotLeverAssembly.prototype.mousePressed = function (evt) {
        this.isPressed = true;
        return true;
    };
    SlotLeverAssembly.prototype.mouseReleased = function (evt) {
        this.isPressed = false;
        this.lastDragTime = -1;
        return true;
    };
    SlotLeverAssembly.prototype.mouseDragged = function (evt) {
        var current = Date.now();
        this.isPressed = true;
        var percentDelta = evt.deltaY / (this.frame.measureHeight() - this.machine.padding * 2);
        var deltaSec = (current - this.lastDragTime) / 10;
        if (deltaSec == 0) {
            deltaSec = 0.001;
        }
        var pullVelocity = (evt.deltaY / deltaSec) / this.machine.wheels.wheels[0].tileSize;
        console.log(pullVelocity);
        this.machine.wheels.wheels[0].spinTimeLeft = 5;
        this.machine.wheels.wheels[1].spinTimeLeft = 5;
        this.machine.wheels.wheels[2].spinTimeLeft = 5;
        if (!Number.isNaN(pullVelocity)) {
            this.machine.wheels.wheels[0].velocity += pullVelocity * (Math.random() * this.randomNess + (1 - this.randomNess));
            this.machine.wheels.wheels[1].velocity += pullVelocity * (Math.random() * this.randomNess + (1 - this.randomNess));
            this.machine.wheels.wheels[2].velocity += pullVelocity * (Math.random() * this.randomNess + (1 - this.randomNess));
        }
        else {
        }
        this.pullAlpha = Math.max(0, Math.min(1, this.pullAlpha + percentDelta));
        this.lastDragTime = current;
        return false;
    };
    SlotLeverAssembly.prototype.onDrawBackground = function (deltaMs) {
        this.brist.fillColor(fColor.green.darken2);
        this.brist.roundedRectFrame(this.frame, this.machine.padding, true);
        this.brist.strokeColor(fColor.grey.darken2);
        this.brist.strokeWeight(4);
        var trackStart = [this.frame.centerX(), this.frame.topY() + this.machine.padding];
        var trackEnd = [this.frame.centerX(), this.frame.bottomY() - this.machine.padding];
        this.brist.line(trackStart[0], trackStart[1], trackEnd[0], trackEnd[1]);
        this.brist.fillColor(fColor.lightGreen.accent3); //this.isPressed ? fColor.blue.accent1 : fColor.red.accent1);
        var leverY = (0,_imports__WEBPACK_IMPORTED_MODULE_0__.lerp)(trackStart[1], trackEnd[1], this.pullAlpha);
        var leverSize = this.frame.measureWidth() - this.machine.padding;
        this.brist.ctx.drawImage(this.paw, trackStart[0] - leverSize * 0.9, leverY - leverSize * (this.isPressed ? 1.2 : 1.5), leverSize * this.paw.width / this.paw.height, leverSize);
        this.brist.ellipse(trackStart[0], leverY, leverSize, leverSize, false, true);
        if (this.pullAlpha > 0 && !this.isPressed) {
            this.pullAlpha = Math.max(0, this.pullAlpha - (deltaMs / 1000));
        }
    };
    return SlotLeverAssembly;
}(_imports__WEBPACK_IMPORTED_MODULE_0__.UIElement));

var SlotMachineWheel = /** @class */ (function (_super) {
    __extends(SlotMachineWheel, _super);
    function SlotMachineWheel(uid, frame, machine) {
        var _this = _super.call(this, uid, frame, machine.brist) || this;
        _this.offset = 0;
        _this.tileSize = 0;
        _this.velocity = 0;
        _this.spinTimeLeft = 3;
        _this.isSpinning = false;
        _this.machine = machine;
        var ths = _this;
        _this.tileSize = _this.frame.measureWidth() - machine.padding * 2;
        var imgUrls = ['./doggo/doggo0.png', './doggo/doggo1.png', './doggo/doggo2.png', './doggo/doggo3.png', './doggo/pupp1.png', './doggo/puppy2.png'];
        _this.images = [];
        var tiles = [];
        _this.images.length = imgUrls.length;
        for (var i = 0; i < imgUrls.length; i++) {
            _this.images[i] = new Image();
            _this.images[i].src = imgUrls[i];
            // let freshTile = new ImageElement(`SlotTile${i}`, [imgUrls[i]], new UIFrame_Rect_CornerSized(machine.padding, 0), machine.brist);
            // freshTile['tileIndex'] = i;
            // freshTile.frame.width = ths.tileSize;
            // freshTile.frame.height = ths.tileSize;
            // freshTile.frame.relY = ()=>{
            //     let startY = 0 - (ths.tileSize + machine.padding) + freshTile['tileIndex'] * (ths.tileSize + machine.padding)
            //     return startY + this.offset;
            // }
            // tiles.push(freshTile);
            // this.addChild(freshTile);
        }
        return _this;
    }
    Object.defineProperty(SlotMachineWheel.prototype, "fullTileWidth", {
        get: function () {
            return this.tileSize + this.machine.padding;
        },
        enumerable: false,
        configurable: true
    });
    SlotMachineWheel.prototype.onDrawBackground = function (deltaMs) {
        this.brist.fillColor(fColor.grey.lighten4);
        this.brist.fillRectFrame(this.frame);
        this.offset += (deltaMs / 1000) * this.velocity * this.fullTileWidth;
        // let imgIndex = startIndex;
        // for(let imgY = this.frame.centerY() - this.tileSize/2 - this.fullTileWidth + this.offset; imgY < this.frame.bottomY() + this.fullTileWidth; imgY += this.fullTileWidth){
        //     this.brist.ctx.drawImage(this.images[imgIndex % ( this.images.length - 1)], this.frame.leftX() + this.machine.padding, imgY, this.tileSize, this.tileSize)
        //     imgIndex++;
        // }
        var distanceToEntry = Math.abs(1.5 - 2 * ((this.offset % this.tileSize) / this.tileSize));
        if (this.spinTimeLeft > 3 || distanceToEntry > 0.2) {
            // this.velocity = 2;
            this.isSpinning = true;
        }
        else if (Math.abs(this.velocity) < 0.01) {
            this.velocity = 0;
            if (this.isSpinning) {
                this.onLand();
            }
            this.isSpinning = false;
        }
        else {
            this.isSpinning = true;
            this.velocity = (this.velocity - distanceToEntry) * 0.6;
        }
        //this.brist.ctx.fillStyle = `rgb(0,0,${lerp(0, 255, distanceToEntry)})`;
        this.brist.ctx.beginPath();
        this.brist.rectFrame(this.frame);
        this.brist.ctx.save();
        this.brist.ctx.clip();
        //console.log(distanceToEntry);
        for (var imageIndex = 0; imageIndex < this.images.length; imageIndex++) {
            var imgY = this.frame.centerY() - this.tileSize / 2 - this.fullTileWidth * (this.images.length - 2) + ((this.offset + this.fullTileWidth * imageIndex) % (this.fullTileWidth * this.images.length));
            this.brist.ctx.drawImage(this.images[imageIndex], this.frame.leftX() + this.machine.padding, imgY, this.tileSize, this.tileSize);
        }
        this.brist.ctx.restore();
        this.spinTimeLeft -= deltaMs / 1000;
    };
    SlotMachineWheel.prototype.onLand = function () {
        this.isSpinning = false;
        var landedOn = Math.floor((this.offset % this.fullTileWidth * this.images.length) % this.fullTileWidth - 1) % this.images.length;
        console.log(this.id + " landed " + landedOn);
        for (var i = 0; i < this.machine.wheels.wheels.length; i++) {
            if (this.machine.wheels.wheels[i].velocity > 0.01) {
                return;
            }
        }
        this.machine.hole.show(this.images[landedOn]);
    };
    return SlotMachineWheel;
}(_imports__WEBPACK_IMPORTED_MODULE_0__.UIElement));

var SlotMachineWheels = /** @class */ (function (_super) {
    __extends(SlotMachineWheels, _super);
    function SlotMachineWheels(uid, frame, machine) {
        var _this = _super.call(this, uid, frame, machine.brist) || this;
        var ths = _this;
        _this.wheels = [
            new SlotMachineWheel('wheel1', new _imports__WEBPACK_IMPORTED_MODULE_0__.UIFrame_Rect_CornerSized(machine.padding, machine.padding, machine.colWidth, machine.colHeight), machine),
            new SlotMachineWheel('wheel2', new _imports__WEBPACK_IMPORTED_MODULE_0__.UIFrame_Rect_CornerSized(0, 0, machine.colWidth, machine.colHeight), machine),
            new SlotMachineWheel('wheel3', new _imports__WEBPACK_IMPORTED_MODULE_0__.UIFrame_Rect_CornerSized(0, 0, machine.colWidth, machine.colHeight), machine)
        ];
        _this.wheels[1].frame.absX = function () { return (ths.wheels[0].frame.rightX() + machine.padding); };
        _this.wheels[1].frame.absY = function () { return (ths.wheels[0].frame.topY()); };
        _this.wheels[2].frame.absX = function () { return (ths.wheels[1].frame.rightX() + machine.padding); };
        _this.wheels[2].frame.absY = function () { return (ths.wheels[1].frame.topY()); };
        _this.frame.width = function () {
            return machine.colWidth * 3 + machine.padding * 4;
        };
        _this.frame.height = function () {
            return machine.colHeight + machine.padding * 2;
        };
        for (var i = 0; i < _this.wheels.length; i++) {
            _this.addChild(_this.wheels[i]);
        }
        return _this;
    }
    SlotMachineWheels.prototype.onDrawBackground = function () {
        this.brist.fillColor(fColor.green.darken2);
        this.brist.fillRectFrame(this.frame);
    };
    return SlotMachineWheels;
}(_imports__WEBPACK_IMPORTED_MODULE_0__.UIElement));

var RewardHole = /** @class */ (function (_super) {
    __extends(RewardHole, _super);
    function RewardHole(uid, frame, machine) {
        var _this = _super.call(this, uid, frame, machine.brist) || this;
        _this.shownTime = -1;
        _this.machine = machine;
        var ths = _this;
        _this.child = new _ImageElem__WEBPACK_IMPORTED_MODULE_1__.ImageElement('', ['./imgsource/aussy01.jpg'], new _imports__WEBPACK_IMPORTED_MODULE_0__.UIFrame_Rect_CornerSized(function () { return (ths.frame.measureWidth() / 2 - ths.child.frame.measureWidth() / 2); }, function () { return ((0,_imports__WEBPACK_IMPORTED_MODULE_0__.lerp)(0 - ths.child.frame.measureHeight(), ths.frame.measureHeight(), ths.shownChildAlpha)); }, function () { return (ths.frame.measureWidth() * 0.5); }, function () { return (ths.child.frame.measureWidth() / (ths.child.images[0].width / ths.child.images[0].height)); }), machine.brist);
        _this.child.frame.absY = function () {
            var out = ths.frame.topY() - ths.child.frame.measureHeight() * 2 + (0,_imports__WEBPACK_IMPORTED_MODULE_0__.lerp)(0, ths.child.frame.measureHeight() * 1.5 + ths.frame.measureHeight(), ths.shownChildAlpha);
            return out;
        };
        _this.addChild(_this.child);
        return _this;
    }
    Object.defineProperty(RewardHole.prototype, "shownChildAlpha", {
        get: function () {
            if (this.shownTime == -1) {
                return 0;
            }
            console.log(Math.min(Date.now() - this.shownTime, 3000) / 3000);
            return Math.min(Date.now() - this.shownTime, 3000) / 3000;
        },
        enumerable: false,
        configurable: true
    });
    // get shownChildAlpha(): number {
    //     console.log((Math.cos(Date.now() / 1000) + 1) / 2)
    //         return (Math.cos(Date.now() / 1000) + 1) / 2
    //     }
    RewardHole.prototype.show = function (img) {
        if (img === void 0) { img = null; }
        this.shownTime = Date.now();
        if (img != null)
            this.child.images[0] = img;
    };
    RewardHole.prototype.hide = function () {
    };
    RewardHole.prototype.onDrawBackground = function () {
        this.selectCtxPath();
        this.brist.fillColor(fColor.black);
        this.brist.ctx.fill();
        this.selectCtxPath(true, false);
        this.brist.ctx.lineTo(this.brist.width, this.frame.bottomY());
        this.brist.ctx.lineTo(this.brist.width, this.brist.height);
        this.brist.ctx.lineTo(0, this.brist.height);
        this.brist.ctx.lineTo(0, this.frame.bottomY());
        this.brist.ctx.lineTo(this.frame.leftX(), this.frame.bottomY());
        this.brist.ctx.save();
        //this.brist.fillColor(fColor.red.base);
        //this.brist.ctx.fill();
        this.brist.ctx.clip();
    };
    RewardHole.prototype.onDrawForeground = function () {
        this.gradient = this.brist.ctx.createLinearGradient(this.frame.centerX(), this.frame.topY(), this.frame.centerX(), this.frame.bottomY());
        this.gradient.addColorStop(0, '#000000FF');
        this.gradient.addColorStop(1, '#00000000');
        this.selectCtxPath();
        this.brist.ctx.fillStyle = this.gradient;
        this.brist.ctx.fill();
        this.brist.ctx.restore();
        this.selectCtxPath(true, false);
        this.brist.strokeColor(fColor.green.darken2);
        this.brist.strokeWeight(this.machine.padding);
        this.brist.ctx.stroke();
    };
    RewardHole.prototype.selectCtxPath = function (beginPath, closePath) {
        if (beginPath === void 0) { beginPath = true; }
        if (closePath === void 0) { closePath = true; }
        if (beginPath) {
            this.brist.ctx.beginPath();
        }
        this.brist.ctx.moveTo(this.frame.leftX(), this.frame.bottomY());
        var baseControlY = this.frame.bottomY() - this.frame.measureHeight() / 4;
        this.brist.ctx.bezierCurveTo(this.frame.leftX(), baseControlY, this.frame.leftX() + this.frame.measureWidth() / 8, this.frame.topY(), this.frame.centerX(), this.frame.topY());
        this.brist.ctx.bezierCurveTo(this.frame.rightX() - this.frame.measureWidth() / 8, this.frame.topY(), this.frame.rightX(), baseControlY, this.frame.rightX(), this.frame.bottomY());
        if (closePath) {
            this.brist.ctx.lineTo(this.frame.leftX(), this.frame.bottomY());
            this.brist.ctx.closePath();
        }
    };
    return RewardHole;
}(_imports__WEBPACK_IMPORTED_MODULE_0__.UIElement));

var SlotMachine = /** @class */ (function (_super) {
    __extends(SlotMachine, _super);
    function SlotMachine(uid, frame, brist) {
        var _this = _super.call(this, uid, frame, brist) || this;
        _this.padding = 8;
        var ths = _this;
        _this.wheels = new SlotMachineWheels('wheels', new _imports__WEBPACK_IMPORTED_MODULE_0__.UIFrame_Rect_CornerSized(ths.padding, 0), _this);
        _this.addChild(_this.wheels);
        _this.lever = new SlotLeverAssembly('lever', _this);
        //this.frame.width = () => (ths.wheels.frame.measureWidth() + ths.lever.frame.measureWidth() + ths.padding);
        _this.frame.height = function () { return (ths.lever.frame.measureHeight() + ths.hole.frame.measureHeight() + ths.padding * 4); };
        _this.lever.frame.absX = function () { return (ths.wheels.frame.rightX()); };
        _this.lever.frame.relY = function () { return (ths.padding); };
        _this.wheels.frame.absY = function () { return (ths.lever.frame.centerY() - ths.wheels.frame.measureHeight() / 2); };
        _this.addChild(_this.lever);
        _this.hole = new RewardHole('hole', new _imports__WEBPACK_IMPORTED_MODULE_0__.UIFrame_Rect_CornerSized(0, 0, ths.colWidth * 4, ths.colWidth * 3), _this);
        _this.hole.frame.relX = function () { return (ths.frame.measureWidth() / 2 - ths.hole.frame.measureWidth() / 2); };
        _this.hole.frame.absY = function () { return (ths.lever.frame.bottomY() + ths.padding); };
        _this.addChild(_this.hole);
        return _this;
    }
    Object.defineProperty(SlotMachine.prototype, "colWidth", {
        //colSize: [number, number] = [20, 150]
        get: function () {
            return (this.frame.measureWidth() - this.padding * 6) / 4;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SlotMachine.prototype, "colHeight", {
        get: function () {
            return this.colWidth * 2;
        },
        enumerable: false,
        configurable: true
    });
    SlotMachine.prototype.onDrawBackground = function () {
        this.brist.fillColor(fColor.green.base);
        this.brist.fillRectFrame(this.frame);
    };
    return SlotMachine;
}(_imports__WEBPACK_IMPORTED_MODULE_0__.UIElement));



/***/ }),

/***/ "./src/FHTML/FColor.ts":
/*!*****************************!*\
  !*** ./src/FHTML/FColor.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FColorSwath": () => (/* binding */ FColorSwath),
/* harmony export */   "FColor": () => (/* binding */ FColor),
/* harmony export */   "FColorDirectory": () => (/* binding */ FColorDirectory)
/* harmony export */ });
var FColorSwath = /** @class */ (function () {
    function FColorSwath(data) {
        var _a, _b, _c, _d;
        this.lighten4 = FColor.fromHex(data['100']);
        this.lighten3 = FColor.fromHex(data['200']);
        this.lighten2 = FColor.fromHex(data['300']);
        this.lighten1 = FColor.fromHex(data['400']);
        this.base = FColor.fromHex(data['500']);
        this.darken1 = FColor.fromHex(data['600']);
        this.darken2 = FColor.fromHex(data['700']);
        this.darken3 = FColor.fromHex(data['800']);
        this.darken4 = FColor.fromHex(data['900']);
        this.accent1 = FColor.fromHex((_a = data['a100']) !== null && _a !== void 0 ? _a : '#000');
        this.accent2 = FColor.fromHex((_b = data['a200']) !== null && _b !== void 0 ? _b : '#000');
        this.accent3 = FColor.fromHex((_c = data['a400']) !== null && _c !== void 0 ? _c : '#000');
        this.accent4 = FColor.fromHex((_d = data['a700']) !== null && _d !== void 0 ? _d : '#000');
    }
    return FColorSwath;
}());

var FColor = /** @class */ (function () {
    function FColor(r, g, b, a, total) {
        if (total === void 0) { total = 255; }
        this.total = 255;
        this.lastHex = null;
        this.oldVals = [-1, -1, -1, -1];
        this.rr = r;
        this.gg = g;
        this.bb = b;
        this.aa = a;
        this.total = total;
    }
    FColor.fromHex = function (colorHex) {
        colorHex = colorHex.replaceAll('#', '').replaceAll(' ', '');
        var r = parseInt(colorHex.substr(0, 2), 16);
        var g = parseInt(colorHex.substr(2, 2), 16);
        var b = parseInt(colorHex.substr(4, 2), 16);
        var a = colorHex.length > 6 ? parseInt(colorHex.substr(6, 2), 16) : -1;
        return new FColor(r, g, b, a);
    };
    FColor.prototype.setHex = function (colorHex) {
        this.lastHex = colorHex;
        colorHex = colorHex.replaceAll('#', '').replaceAll(' ', '');
        var r = parseInt(colorHex.substr(0, 2), 16);
        var g = parseInt(colorHex.substr(2, 2), 16);
        var b = parseInt(colorHex.substr(4, 2), 16);
        var a = colorHex.length > 6 ? parseInt(colorHex.substr(6, 2), 16) : -1;
        this.rr = r;
        this.gg = g;
        this.bb = b;
        this.aa = a;
        this.total = 255;
    };
    Object.defineProperty(FColor.prototype, "r", {
        get: function () {
            return (this.rr / this.total) * 255;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FColor.prototype, "g", {
        get: function () {
            return (this.gg / this.total) * 255;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FColor.prototype, "b", {
        get: function () {
            return (this.bb / this.total) * 255;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FColor.prototype, "a", {
        get: function () {
            return (this.aa / this.total) * 255;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FColor.prototype, "hasChanged", {
        get: function () {
            return (this.oldVals[0] != this.r) || (this.oldVals[1] != this.g) || (this.oldVals[2] != this.b) || (this.oldVals[3] != this.a);
        },
        enumerable: false,
        configurable: true
    });
    FColor.prototype.genStr = function () {
        this.oldStr = "rgb" + (this.a != -1 ? 'a' : '') + "(" + this.r + ", " + this.g + ", " + this.b + (this.a != -1 ? (', ' + this.a) : '') + ")";
    };
    FColor.prototype.toHexString = function () {
        if (this.hasChanged) {
            this.genStr();
        }
        return this.oldStr;
    };
    FColor.prototype.copy = function () {
        return new FColor(this.rr, this.gg, this.bb, this.aa, this.total);
    };
    //opacity 0-255
    FColor.prototype.setAlpha = function (a) {
        this.aa = a;
        return this;
    };
    //opacity 0-1
    FColor.prototype.setOpacity = function (decimalPercent) {
        this.setAlpha(this.total * decimalPercent);
        return this;
    };
    return FColor;
}());

var FColorDirectory = /** @class */ (function () {
    function FColorDirectory() {
        this.darkMode = [null, null, null, null, null, null, null, null, null, null, null, null];
        this.lightText = [FColor.fromHex('#9E9E9E'), FColor.fromHex('#E0E0E0')];
        //          0  1   2   3   4   5   6   7   8   9   10  11
        var dmcs = [0, 15, 20, 25, 30, 34, 38, 42, 47, 54, 60, 70];
        var getDarkModeColor = function (i) {
            var s = dmcs[i]; //Math.floor(70 * Math.pow(i / 10.0, 2));
            var p = s.toString(16);
            if (p.length == 1) {
                p = "0" + p;
            }
            var out = "#" + p + p + p;
            //console.log(`Built dark mode color ${s} for index ${i}: ${out} `)
            return FColor.fromHex(out);
        };
        var darkModeColorCount = 11;
        var genCss = " ";
        var cssElem = document.createElement('style');
        for (var i_1 = 0; i_1 <= darkModeColorCount; i_1++) {
            this.darkMode[i_1] = getDarkModeColor(i_1);
            genCss = genCss + ("\n.darkBackground" + i_1 + "{background-color: " + getDarkModeColor(i_1).toHexString() + "}\n");
        }
        //let tst = //new DOMParser().parseFromString(`${genCss}</style>`, 'text/html')
        cssElem.innerHTML = genCss;
        document.querySelector('head').append(cssElem);
        //$(`${genCss}</style>`).appendTo("head");
        var colorNames = Object.keys(FColorDirectory.materialColors);
        var colorLabels = [];
        var englishLabel = "";
        var currentColor;
        //console.log("Mapping colors");
        for (var i = 0; i < colorNames.length; i++) {
            //console.log("Mapping " + colorNames[i]);
            currentColor = FColorDirectory.materialColors[colorNames[i]];
            if (typeof currentColor == 'object') {
                colorLabels = Object.keys(currentColor);
                this[colorNames[i]] = new FColorSwath(FColorDirectory.materialColors[colorNames[i]]);
                for (var j = 0; j < colorLabels.length; j++) {
                    switch (colorLabels[j]) {
                        case "50":
                            englishLabel = "lighten-5";
                            break;
                        case "100":
                            englishLabel = "lighten-4";
                            break;
                        case "200":
                            englishLabel = "lighten-3";
                            break;
                        case "300":
                            englishLabel = "lighten-2";
                            break;
                        case "400":
                            englishLabel = "lighten-1";
                            break;
                        case "500":
                            englishLabel = "base";
                            break;
                        case "600":
                            englishLabel = "darken-1";
                            break;
                        case "700":
                            englishLabel = "darken-2";
                            break;
                        case "800":
                            englishLabel = "darken-3";
                            break;
                        case "900":
                            englishLabel = "darken-4";
                            break;
                        case "a100":
                            englishLabel = "accent-1";
                            break;
                        case "a200":
                            englishLabel = "accent-2";
                            break;
                        case "a400":
                            englishLabel = "accent-3";
                            break;
                        case "a700":
                            englishLabel = "accent-4";
                            break;
                        default:
                            englishLabel = colorLabels[j];
                    }
                    //console.log("[" + i + ", " + j + "] Mapping colors." + colorNames[j] + "." + englishLabel + " = " + currentColor[colorLabels[j]]);
                    this[colorNames[i]][englishLabel] = FColor.fromHex(currentColor[colorLabels[j]]);
                }
            }
            else {
                this[colorNames[i]] = FColor.fromHex(currentColor !== null && currentColor !== void 0 ? currentColor : "#ff00ff");
            }
        }
    }
    FColorDirectory.materialColors = {
        "red": {
            "50": "#ffebee",
            "100": "#ffcdd2",
            "200": "#ef9a9a",
            "300": "#e57373",
            "400": "#ef5350",
            "500": "#f44336",
            "600": "#e53935",
            "700": "#d32f2f",
            "800": "#c62828",
            "900": "#b71c1c",
            "a100": "#ff8a80",
            "a200": "#ff5252",
            "a400": "#ff1744",
            "a700": "#d50000"
        },
        "pink": {
            "50": "#fce4ec",
            "100": "#f8bbd0",
            "200": "#f48fb1",
            "300": "#f06292",
            "400": "#ec407a",
            "500": "#e91e63",
            "600": "#d81b60",
            "700": "#c2185b",
            "800": "#ad1457",
            "900": "#880e4f",
            "a100": "#ff80ab",
            "a200": "#ff4081",
            "a400": "#f50057",
            "a700": "#c51162"
        },
        "purple": {
            "50": "#f3e5f5",
            "100": "#e1bee7",
            "200": "#ce93d8",
            "300": "#ba68c8",
            "400": "#ab47bc",
            "500": "#9c27b0",
            "600": "#8e24aa",
            "700": "#7b1fa2",
            "800": "#6a1b9a",
            "900": "#4a148c",
            "a100": "#ea80fc",
            "a200": "#e040fb",
            "a400": "#d500f9",
            "a700": "#aa00ff"
        },
        "deepPurple": {
            "50": "#ede7f6",
            "100": "#d1c4e9",
            "200": "#b39ddb",
            "300": "#9575cd",
            "400": "#7e57c2",
            "500": "#673ab7",
            "600": "#5e35b1",
            "700": "#512da8",
            "800": "#4527a0",
            "900": "#311b92",
            "a100": "#b388ff",
            "a200": "#7c4dff",
            "a400": "#651fff",
            "a700": "#6200ea"
        },
        "indigo": {
            "50": "#e8eaf6",
            "100": "#c5cae9",
            "200": "#9fa8da",
            "300": "#7986cb",
            "400": "#5c6bc0",
            "500": "#3f51b5",
            "600": "#3949ab",
            "700": "#303f9f",
            "800": "#283593",
            "900": "#1a237e",
            "a100": "#8c9eff",
            "a200": "#536dfe",
            "a400": "#3d5afe",
            "a700": "#304ffe"
        },
        "blue": {
            "50": "#e3f2fd",
            "100": "#bbdefb",
            "200": "#90caf9",
            "300": "#64b5f6",
            "400": "#42a5f5",
            "500": "#2196f3",
            "600": "#1e88e5",
            "700": "#1976d2",
            "800": "#1565c0",
            "900": "#0d47a1",
            "a100": "#82b1ff",
            "a200": "#448aff",
            "a400": "#2979ff",
            "a700": "#2962ff"
        },
        "lightBlue": {
            "50": "#e1f5fe",
            "100": "#b3e5fc",
            "200": "#81d4fa",
            "300": "#4fc3f7",
            "400": "#29b6f6",
            "500": "#03a9f4",
            "600": "#039be5",
            "700": "#0288d1",
            "800": "#0277bd",
            "900": "#01579b",
            "a100": "#80d8ff",
            "a200": "#40c4ff",
            "a400": "#00b0ff",
            "a700": "#0091ea"
        },
        "cyan": {
            "50": "#e0f7fa",
            "100": "#b2ebf2",
            "200": "#80deea",
            "300": "#4dd0e1",
            "400": "#26c6da",
            "500": "#00bcd4",
            "600": "#00acc1",
            "700": "#0097a7",
            "800": "#00838f",
            "900": "#006064",
            "a100": "#84ffff",
            "a200": "#18ffff",
            "a400": "#00e5ff",
            "a700": "#00b8d4"
        },
        "teal": {
            "50": "#e0f2f1",
            "100": "#b2dfdb",
            "200": "#80cbc4",
            "300": "#4db6ac",
            "400": "#26a69a",
            "500": "#009688",
            "600": "#00897b",
            "700": "#00796b",
            "800": "#00695c",
            "900": "#004d40",
            "a100": "#a7ffeb",
            "a200": "#64ffda",
            "a400": "#1de9b6",
            "a700": "#00bfa5"
        },
        "green": {
            "50": "#e8f5e9",
            "100": "#c8e6c9",
            "200": "#a5d6a7",
            "300": "#81c784",
            "400": "#66bb6a",
            "500": "#4caf50",
            "600": "#43a047",
            "700": "#388e3c",
            "800": "#2e7d32",
            "900": "#1b5e20",
            "a100": "#b9f6ca",
            "a200": "#69f0ae",
            "a400": "#00e676",
            "a700": "#00c853"
        },
        "lightGreen": {
            "50": "#f1f8e9",
            "100": "#dcedc8",
            "200": "#c5e1a5",
            "300": "#aed581",
            "400": "#9ccc65",
            "500": "#8bc34a",
            "600": "#7cb342",
            "700": "#689f38",
            "800": "#558b2f",
            "900": "#33691e",
            "a100": "#ccff90",
            "a200": "#b2ff59",
            "a400": "#76ff03",
            "a700": "#64dd17"
        },
        "lime": {
            "50": "#f9fbe7",
            "100": "#f0f4c3",
            "200": "#e6ee9c",
            "300": "#dce775",
            "400": "#d4e157",
            "500": "#cddc39",
            "600": "#c0ca33",
            "700": "#afb42b",
            "800": "#9e9d24",
            "900": "#827717",
            "a100": "#f4ff81",
            "a200": "#eeff41",
            "a400": "#c6ff00",
            "a700": "#aeea00"
        },
        "yellow": {
            "50": "#fffde7",
            "100": "#fff9c4",
            "200": "#fff59d",
            "300": "#fff176",
            "400": "#ffee58",
            "500": "#ffeb3b",
            "600": "#fdd835",
            "700": "#fbc02d",
            "800": "#f9a825",
            "900": "#f57f17",
            "a100": "#ffff8d",
            "a200": "#ffff00",
            "a400": "#ffea00",
            "a700": "#ffd600"
        },
        "amber": {
            "50": "#fff8e1",
            "100": "#ffecb3",
            "200": "#ffe082",
            "300": "#ffd54f",
            "400": "#ffca28",
            "500": "#ffc107",
            "600": "#ffb300",
            "700": "#ffa000",
            "800": "#ff8f00",
            "900": "#ff6f00",
            "a100": "#ffe57f",
            "a200": "#ffd740",
            "a400": "#ffc400",
            "a700": "#ffab00"
        },
        "orange": {
            "50": "#fff3e0",
            "100": "#ffe0b2",
            "200": "#ffcc80",
            "300": "#ffb74d",
            "400": "#ffa726",
            "500": "#ff9800",
            "600": "#fb8c00",
            "700": "#f57c00",
            "800": "#ef6c00",
            "900": "#e65100",
            "a100": "#ffd180",
            "a200": "#ffab40",
            "a400": "#ff9100",
            "a700": "#ff6d00"
        },
        "deepOrange": {
            "50": "#fbe9e7",
            "100": "#ffccbc",
            "200": "#ffab91",
            "300": "#ff8a65",
            "400": "#ff7043",
            "500": "#ff5722",
            "600": "#f4511e",
            "700": "#e64a19",
            "800": "#d84315",
            "900": "#bf360c",
            "a100": "#ff9e80",
            "a200": "#ff6e40",
            "a400": "#ff3d00",
            "a700": "#dd2c00"
        },
        "brown": {
            "50": "#efebe9",
            "100": "#d7ccc8",
            "200": "#bcaaa4",
            "300": "#a1887f",
            "400": "#8d6e63",
            "500": "#795548",
            "600": "#6d4c41",
            "700": "#5d4037",
            "800": "#4e342e",
            "900": "#3e2723"
        },
        "grey": {
            "50": "#fafafa",
            "100": "#f5f5f5",
            "200": "#eeeeee",
            "300": "#e0e0e0",
            "400": "#bdbdbd",
            "500": "#9e9e9e",
            "600": "#757575",
            "700": "#616161",
            "800": "#424242",
            "900": "#212121"
        },
        "blueGrey": {
            "50": "#eceff1",
            "100": "#cfd8dc",
            "200": "#b0bec5",
            "300": "#90a4ae",
            "400": "#78909c",
            "500": "#607d8b",
            "600": "#546e7a",
            "700": "#455a64",
            "800": "#37474f",
            "900": "#263238"
        },
        "black": "#000000",
        "white": "#ffffff"
    };
    FColorDirectory.fColor = null; //singlton instance
    return FColorDirectory;
}());



/***/ }),

/***/ "./src/FHTML/FHTML.ts":
/*!****************************!*\
  !*** ./src/FHTML/FHTML.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FHTML": () => (/* binding */ FHTML)
/* harmony export */ });
var FHTML = /** @class */ (function () {
    function FHTML(element) {
        if (typeof element == "string") {
            this.element = document.querySelector(element);
        }
        else {
            this.element = element;
        }
    }
    FHTML.prototype.offset = function () {
        return this.element.getBoundingClientRect();
        ;
    };
    Object.defineProperty(FHTML.prototype, "width", {
        get: function () {
            return this.element.offsetWidth;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FHTML.prototype, "height", {
        get: function () {
            return this.element.offsetHeight;
        },
        enumerable: false,
        configurable: true
    });
    FHTML.prototype.setCss = function (name, value) {
        if (value === void 0) { value = null; }
        if (typeof name == 'string') {
            this.element.style[name] = value; //(name, value);
            return this;
        }
        else {
            for (var i = 0; i < name.length; i++) {
                this.setCss(name[i][0], name[i][1]);
            }
            return this;
        }
    };
    FHTML.prototype.append = function (canvas) {
        this.element.append(canvas.element);
    };
    FHTML.prototype.getCss = function (name) {
        return this.element.style[name];
    };
    FHTML.prototype.attr = function (name, value) {
        if (value === void 0) { value = null; }
        if (value != null) {
            this.element.setAttribute(name, value);
            return null;
        }
        else {
            return this.element.getAttribute(name);
        }
    };
    FHTML.prototype.createChildDiv = function (id) {
        return this.createChildElem(id, "div");
    };
    FHTML.prototype.createChildElem = function (id, tagType) {
        var elem = document.createElement(tagType);
        var output = new FHTML(elem);
        output.attr("id", id);
        this.element.appendChild(elem);
        return output;
    };
    return FHTML;
}());



/***/ }),

/***/ "./src/Helper/Helper.ts":
/*!******************************!*\
  !*** ./src/Helper/Helper.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isNumber": () => (/* binding */ isNumber),
/* harmony export */   "lerp": () => (/* binding */ lerp),
/* harmony export */   "evalOptionalFunc": () => (/* binding */ evalOptionalFunc),
/* harmony export */   "Averager": () => (/* binding */ Averager)
/* harmony export */ });
String.prototype.replaceAll = function (a, b) {
    return this.split(a).join(b);
};
function isNumber(input) {
    return !isNaN(input);
}
function lerp(start, end, alpha) {
    return start + (end - start) * alpha;
}
function evalOptionalFunc(input, def) {
    if (def === void 0) { def = null; }
    if (input == null || input == undefined) {
        return def;
    }
    if (typeof input == 'function') {
        return input();
    }
    return input;
}
var Averager = /** @class */ (function () {
    function Averager(size) {
        this.maxInd = 0;
        this.index = 0;
        this.arr = new Array(size);
    }
    Averager.prototype.add = function (val) {
        this.arr[this.index] = val;
        this.index++;
        if (this.index >= this.arr.length) {
            this.index = 0;
        }
        if (this.maxInd < this.arr.length - 1) {
            this.maxInd++;
        }
    };
    Averager.prototype.addHelper = function (val, index) {
        if (index <= this.maxInd) {
            this.total += val;
        }
    };
    Object.defineProperty(Averager.prototype, "val", {
        get: function () {
            this.total = 0;
            this.arr.forEach(this.addHelper.bind(this));
            return this.total / this.maxInd;
        },
        enumerable: false,
        configurable: true
    });
    return Averager;
}());



/***/ }),

/***/ "./src/Helper/SortedLinkedList.ts":
/*!****************************************!*\
  !*** ./src/Helper/SortedLinkedList.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SortedLinkedList": () => (/* binding */ SortedLinkedList),
/* harmony export */   "SortedLinkedListNode": () => (/* binding */ SortedLinkedListNode)
/* harmony export */ });
/* harmony import */ var _imports__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../imports */ "./src/imports.ts");

var SortedLinkedList = /** @class */ (function () {
    function SortedLinkedList(comparator) {
        this.count = 0;
        this.head = null;
        this.comparator = comparator;
    }
    Object.defineProperty(SortedLinkedList.prototype, "length", {
        get: function () {
            return this.count;
        },
        enumerable: false,
        configurable: true
    });
    SortedLinkedList.prototype.clear = function (onRemove) {
        if (onRemove === void 0) { onRemove = function (v) { }; }
        var tmp = this.head;
        this.head = null;
        var next;
        while (tmp != null) {
            next = tmp.next;
            onRemove(tmp.value);
            tmp.next = null;
            tmp.last = null;
            tmp.value = null;
            tmp = next;
        }
    };
    Object.defineProperty(SortedLinkedList.prototype, "tail", {
        get: function () {
            var n = this.head;
            if (n == null) {
                return null;
            }
            while (n.next != null) {
                n = n.next;
            }
            return n;
        },
        enumerable: false,
        configurable: true
    });
    SortedLinkedList.Create = function (comparator) {
        var out = new SortedLinkedList(comparator);
        return new Proxy(out, {
            get: function (target, name) {
                if (name in target) {
                    return target[name];
                }
                ;
                if ((0,_imports__WEBPACK_IMPORTED_MODULE_0__.isNumber)(name)) {
                    var targetIndex_1 = Number(name);
                    var out_1 = null;
                    target.forEach(function (v, index) {
                        if (index == targetIndex_1) {
                            out_1 = v;
                            return true;
                        }
                    });
                    return out_1;
                }
                return undefined;
            }
        });
    };
    SortedLinkedList.prototype.isAGreater = function (a, b) {
        return this.comparator(a, b) > 0;
    };
    SortedLinkedList.prototype.isALesser = function (a, b) {
        return this.comparator(a, b) < 0;
    };
    SortedLinkedList.prototype.isEqual = function (a, b) {
        return this.comparator(a, b) == 0;
    };
    SortedLinkedList.prototype.add = function (value) {
        this.count++;
        if (this.head == null) {
            this.head = new SortedLinkedListNode(value);
            return 0;
        }
        var fresh = new SortedLinkedListNode(value);
        var n = this.head;
        if (this.isALesser(value, n.value)) {
            fresh.next = this.head;
            this.head.last = fresh;
            this.head = fresh;
            return 0;
        }
        var i = 1;
        while (n.next != null && (this.comparator(value, n.next.value) >= 0)) {
            n = n.next;
            i++;
        }
        var tmp = n.next;
        n.next = fresh;
        fresh.last = n;
        fresh.next = tmp;
        if (tmp != null) {
            tmp.last = fresh;
        }
        return i;
    };
    //removes first element that condition(T) returns true for
    SortedLinkedList.prototype.remove = function (condition) {
        if (condition(this.head.value)) {
            this.head = this.head.next;
            this.head.last = null;
            this.count--;
            return;
        }
        var n = this.head.next;
        var lastN = this.head;
        while (n != null) {
            if (condition(n.value)) {
                lastN.next = n.next;
                if (n.next != null) {
                    n.next.last = lastN;
                }
                this.count--;
                break;
            }
            lastN = n;
            n = n.next;
        }
    };
    SortedLinkedList.prototype.find = function (condition) {
        var n = this.head;
        while (n != null) {
            if (condition(n.value)) {
                return n.value;
            }
            n = n.next;
        }
        return null;
    };
    //return true to break
    SortedLinkedList.prototype.forEach = function (callback) {
        var n = this.head;
        var i = 0;
        while (n != null) {
            if (callback(n.value, i) == true) {
                break;
            }
            i++;
            n = n.next;
        }
    };
    //return true to break
    SortedLinkedList.prototype.forEachReverse = function (callback) {
        var n = this.tail;
        while (n != null) {
            if (callback(n.value) == true) {
                break;
            }
            n = n.last;
        }
    };
    return SortedLinkedList;
}());

var SortedLinkedListNode = /** @class */ (function () {
    function SortedLinkedListNode(value, next, last) {
        if (next === void 0) { next = null; }
        if (last === void 0) { last = null; }
        this.value = value;
        this.next = next;
        this.last = last;
    }
    return SortedLinkedListNode;
}());



/***/ }),

/***/ "./src/imports.ts":
/*!************************!*\
  !*** ./src/imports.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FHTML": () => (/* reexport safe */ _FHTML_FHTML__WEBPACK_IMPORTED_MODULE_0__.FHTML),
/* harmony export */   "BristolBoard": () => (/* reexport safe */ _Bristol_BristolBoard__WEBPACK_IMPORTED_MODULE_1__.BristolBoard),
/* harmony export */   "BristolFont": () => (/* reexport safe */ _Bristol_BristolBoard__WEBPACK_IMPORTED_MODULE_1__.BristolFont),
/* harmony export */   "BristolFontFamily": () => (/* reexport safe */ _Bristol_BristolBoard__WEBPACK_IMPORTED_MODULE_1__.BristolFontFamily),
/* harmony export */   "BristolFontStyle": () => (/* reexport safe */ _Bristol_BristolBoard__WEBPACK_IMPORTED_MODULE_1__.BristolFontStyle),
/* harmony export */   "BristolFontWeight": () => (/* reexport safe */ _Bristol_BristolBoard__WEBPACK_IMPORTED_MODULE_1__.BristolFontWeight),
/* harmony export */   "BristolHAlign": () => (/* reexport safe */ _Bristol_BristolBoard__WEBPACK_IMPORTED_MODULE_1__.BristolHAlign),
/* harmony export */   "BristolVAlign": () => (/* reexport safe */ _Bristol_BristolBoard__WEBPACK_IMPORTED_MODULE_1__.BristolVAlign),
/* harmony export */   "FontSize": () => (/* reexport safe */ _Bristol_BristolBoard__WEBPACK_IMPORTED_MODULE_1__.FontSize),
/* harmony export */   "InputEvent": () => (/* reexport safe */ _Bristol_BristolBoard__WEBPACK_IMPORTED_MODULE_1__.InputEvent),
/* harmony export */   "InputEventAction": () => (/* reexport safe */ _Bristol_BristolBoard__WEBPACK_IMPORTED_MODULE_1__.InputEventAction),
/* harmony export */   "KeyboardInputEvent": () => (/* reexport safe */ _Bristol_BristolBoard__WEBPACK_IMPORTED_MODULE_1__.KeyboardInputEvent),
/* harmony export */   "KeyboardInputKey": () => (/* reexport safe */ _Bristol_BristolBoard__WEBPACK_IMPORTED_MODULE_1__.KeyboardInputKey),
/* harmony export */   "MouseBtnInputEvent": () => (/* reexport safe */ _Bristol_BristolBoard__WEBPACK_IMPORTED_MODULE_1__.MouseBtnInputEvent),
/* harmony export */   "MouseDraggedInputEvent": () => (/* reexport safe */ _Bristol_BristolBoard__WEBPACK_IMPORTED_MODULE_1__.MouseDraggedInputEvent),
/* harmony export */   "MouseInputEvent": () => (/* reexport safe */ _Bristol_BristolBoard__WEBPACK_IMPORTED_MODULE_1__.MouseInputEvent),
/* harmony export */   "MouseMovedInputEvent": () => (/* reexport safe */ _Bristol_BristolBoard__WEBPACK_IMPORTED_MODULE_1__.MouseMovedInputEvent),
/* harmony export */   "MouseScrolledInputEvent": () => (/* reexport safe */ _Bristol_BristolBoard__WEBPACK_IMPORTED_MODULE_1__.MouseScrolledInputEvent),
/* harmony export */   "Averager": () => (/* reexport safe */ _Helper_Helper__WEBPACK_IMPORTED_MODULE_2__.Averager),
/* harmony export */   "evalOptionalFunc": () => (/* reexport safe */ _Helper_Helper__WEBPACK_IMPORTED_MODULE_2__.evalOptionalFunc),
/* harmony export */   "isNumber": () => (/* reexport safe */ _Helper_Helper__WEBPACK_IMPORTED_MODULE_2__.isNumber),
/* harmony export */   "lerp": () => (/* reexport safe */ _Helper_Helper__WEBPACK_IMPORTED_MODULE_2__.lerp),
/* harmony export */   "FColor": () => (/* reexport safe */ _FHTML_FColor__WEBPACK_IMPORTED_MODULE_3__.FColor),
/* harmony export */   "fColor": () => (/* binding */ fColor),
/* harmony export */   "FColorSwath": () => (/* reexport safe */ _FHTML_FColor__WEBPACK_IMPORTED_MODULE_3__.FColorSwath),
/* harmony export */   "FColorDirectory": () => (/* reexport safe */ _FHTML_FColor__WEBPACK_IMPORTED_MODULE_3__.FColorDirectory),
/* harmony export */   "UICorner": () => (/* reexport safe */ _Bristol_UIFrame__WEBPACK_IMPORTED_MODULE_4__.UICorner),
/* harmony export */   "UIFrame_Abstract": () => (/* reexport safe */ _Bristol_UIFrame__WEBPACK_IMPORTED_MODULE_4__.UIFrame_Abstract),
/* harmony export */   "UIFrame_Rect_CornerSized": () => (/* reexport safe */ _Bristol_UIFrame__WEBPACK_IMPORTED_MODULE_4__.UIFrame_Rect_CornerSized),
/* harmony export */   "CardBristol": () => (/* reexport safe */ _Bristol_MainBristol__WEBPACK_IMPORTED_MODULE_5__.CardBristol),
/* harmony export */   "UIElement": () => (/* reexport safe */ _Bristol_UIElement__WEBPACK_IMPORTED_MODULE_6__.UIElement),
/* harmony export */   "SortedLinkedList": () => (/* reexport safe */ _Helper_SortedLinkedList__WEBPACK_IMPORTED_MODULE_7__.SortedLinkedList),
/* harmony export */   "SortedLinkedListNode": () => (/* reexport safe */ _Helper_SortedLinkedList__WEBPACK_IMPORTED_MODULE_7__.SortedLinkedListNode),
/* harmony export */   "FootballField": () => (/* reexport safe */ _Elements_FootballField__WEBPACK_IMPORTED_MODULE_8__.FootballField),
/* harmony export */   "Sky": () => (/* reexport safe */ _Elements_Sky__WEBPACK_IMPORTED_MODULE_9__.Sky),
/* harmony export */   "SpecialMessage": () => (/* reexport safe */ _Elements_Message__WEBPACK_IMPORTED_MODULE_10__.SpecialMessage),
/* harmony export */   "BackgroundElement": () => (/* reexport safe */ _Elements_Background__WEBPACK_IMPORTED_MODULE_11__.BackgroundElement),
/* harmony export */   "ImageElement": () => (/* reexport safe */ _Elements_ImageElem__WEBPACK_IMPORTED_MODULE_12__.ImageElement),
/* harmony export */   "RewardHole": () => (/* reexport safe */ _Elements_SlotMachine__WEBPACK_IMPORTED_MODULE_13__.RewardHole),
/* harmony export */   "SlotLeverAssembly": () => (/* reexport safe */ _Elements_SlotMachine__WEBPACK_IMPORTED_MODULE_13__.SlotLeverAssembly),
/* harmony export */   "SlotMachine": () => (/* reexport safe */ _Elements_SlotMachine__WEBPACK_IMPORTED_MODULE_13__.SlotMachine),
/* harmony export */   "SlotMachineWheel": () => (/* reexport safe */ _Elements_SlotMachine__WEBPACK_IMPORTED_MODULE_13__.SlotMachineWheel),
/* harmony export */   "SlotMachineWheels": () => (/* reexport safe */ _Elements_SlotMachine__WEBPACK_IMPORTED_MODULE_13__.SlotMachineWheels)
/* harmony export */ });
/* harmony import */ var _FHTML_FHTML__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FHTML/FHTML */ "./src/FHTML/FHTML.ts");
/* harmony import */ var _Bristol_BristolBoard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Bristol/BristolBoard */ "./src/Bristol/BristolBoard.ts");
/* harmony import */ var _Helper_Helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Helper/Helper */ "./src/Helper/Helper.ts");
/* harmony import */ var _FHTML_FColor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./FHTML/FColor */ "./src/FHTML/FColor.ts");
/* harmony import */ var _Bristol_UIFrame__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Bristol/UIFrame */ "./src/Bristol/UIFrame.ts");
/* harmony import */ var _Bristol_MainBristol__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Bristol/MainBristol */ "./src/Bristol/MainBristol.ts");
/* harmony import */ var _Bristol_UIElement__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Bristol/UIElement */ "./src/Bristol/UIElement.ts");
/* harmony import */ var _Helper_SortedLinkedList__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Helper/SortedLinkedList */ "./src/Helper/SortedLinkedList.ts");
/* harmony import */ var _Elements_FootballField__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Elements/FootballField */ "./src/Elements/FootballField.ts");
/* harmony import */ var _Elements_Sky__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Elements/Sky */ "./src/Elements/Sky.ts");
/* harmony import */ var _Elements_Message__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Elements/Message */ "./src/Elements/Message.ts");
/* harmony import */ var _Elements_Background__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./Elements/Background */ "./src/Elements/Background.ts");
/* harmony import */ var _Elements_ImageElem__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./Elements/ImageElem */ "./src/Elements/ImageElem.ts");
/* harmony import */ var _Elements_SlotMachine__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./Elements/SlotMachine */ "./src/Elements/SlotMachine.ts");




var fColor = new _FHTML_FColor__WEBPACK_IMPORTED_MODULE_3__.FColorDirectory();

window.fColor = fColor;












/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _imports__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./imports */ "./src/imports.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};

var body = new _imports__WEBPACK_IMPORTED_MODULE_0__.FHTML("body");
var containerDiv = body.createChildDiv('container');
containerDiv.setCss([
    ["width", "100vw"],
    ['height', '100vh'],
    ['position', 'absolute'],
    ['left', '0px'],
    ['top', '0px']
]);
window.card = new _imports__WEBPACK_IMPORTED_MODULE_0__.CardBristol(containerDiv.element, function (brist) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/];
    });
}); });

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcsU0FBUztBQUNwQixXQUFXLFVBQVU7QUFDckIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQjs7QUFFM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVcsU0FBUztBQUNwQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxRQUFRO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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O0FBRUw7QUFDQTtBQUNBLGVBQWUsWUFBWTtBQUMzQixpQkFBaUIsWUFBWTtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsZUFBZSxZQUFZO0FBQzNCLGlCQUFpQixZQUFZO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsZUFBZSxZQUFZO0FBQzNCLGlCQUFpQixZQUFZO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxlQUFlLFlBQVk7QUFDM0IsaUJBQWlCLFlBQVk7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsZUFBZSxZQUFZO0FBQzNCLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0NBQWtDOztBQUVsQyxxQ0FBcUM7QUFDckM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7O0FBRXRDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QixpQkFBaUIsT0FBTztBQUN4QjtBQUNBLG9DQUFvQzs7QUFFcEM7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0Esa0NBQWtDOztBQUVsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxtQkFBbUI7QUFDOUIsV0FBVyxZQUFZO0FBQ3ZCLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkIsaUJBQWlCLFNBQVM7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QixpQkFBaUIsR0FBRztBQUNwQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTs7QUFFQTs7QUFF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QyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNsRCxJQUFJLFNBQVMsR0FBcUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRTdDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzVHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQy9ELElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM1RyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdEcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3RHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUNELHVDQUFnQixHQUFoQixVQUFpQixLQUF1QixFQUFFLEdBQTBCLEVBQUUsSUFBcUIsRUFBRSxNQUF1QjtRQUE5QyxtQ0FBcUI7UUFBRSx1Q0FBdUI7UUFDaEgsSUFBSSxPQUFPLEdBQUcsSUFBSSxRQUFRLEVBQUU7WUFDeEIsR0FBRyxHQUFHO2dCQUNGLFNBQVMsRUFBRSxHQUFHO2dCQUNkLFVBQVUsRUFBRSxHQUFHO2dCQUNmLFNBQVMsRUFBRSxHQUFHO2dCQUNkLFVBQVUsRUFBRSxHQUFHO2FBQ2xCO1NBQ0o7UUFDRCxJQUFJLFNBQVMsR0FBcUIsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDaEUsSUFBSSxVQUFVLEdBQXFCLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ2xFLElBQUksVUFBVSxHQUFxQixDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUNyRSxJQUFJLFNBQVMsR0FBcUIsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFFbkUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RCxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvRCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDNUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzVHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVELElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN0RyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM1RCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdEcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUVyQixJQUFJLElBQUksRUFBRTtZQUNOLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDbkI7UUFDRCxJQUFJLE1BQU0sRUFBRTtZQUNSLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDckI7SUFDTCxDQUFDO0lBQ0QsMERBQTBEO0lBQzFELHlFQUF5RTtJQUN6RSwrRUFBK0U7SUFDL0UsNEVBQTRFO0lB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QyxLQUFLLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDL0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ25GLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUNuRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdEYsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ3JHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FB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Q0FBQyxDQUFDO1FBQ25GLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hFLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsOERBQTZEO1FBQzdHLElBQUksTUFBTSxHQUFHLDhDQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDOUQsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUdqRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsU0FBUyxHQUFHLEdBQUcsRUFBRSxNQUFNLEdBQUcsU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDO1FBQy9LLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDN0UsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDdkMsSUFBSSxDQUFD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QyxLQUFLLENBQUMsR0FBRyxHQUFHO1FBQ3ZDLENBQUM7OztPQUFBO0lBQ0Qsc0JBQUkscUJBQUM7YUFBTDtZQUNJLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHO1FBQ3ZDLENBQUM7OztPQUFBO0lBQ0Qsc0JBQUkscUJBQUM7YUFBTDtZQUNJLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHO1FBQ3ZDLENBQUM7OztPQUFBO0lBQ0Qsc0JBQUksOEJBQVU7YUFBZDtZQUNJLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwSSxDQUFDOzs7T0FBQTtJQUNPLHVCQUFNLEdBQWQ7UUFDSSxJQUFJLENBQUMsTUFBTSxHQUFHLFNBQU0sSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQUksSUFBSSxDQUFDLENBQUMsVUFBSyxJQUFJLENBQUMsQ0FBQyxVQUFLLElBQUksQ0FBQyxDQUFDLElBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQUcsQ0FBQztJQUN6SCxDQUFDO0lBR0QsNEJBQVcsR0FBWDtRQUNJLElBQUksSUFBSSxDQUFDLFVB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Q0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0ppRTtBQUdqRSxJQUFJLElBQUksR0FBMkIsSUFBSSwyQ0FBSyxDQUFrQixNQUFNLENBQUMsQ0FBQztBQUN0RSxJQUFJLFlBQVksR0FBMEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUM7QUFDMUUsWUFBWSxDQUFDLE1BQU0sQ0FBQztJQUNoQixDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUM7SUFDbEIsQ0FBQyxRQUFRLEVBQUMsT0FBTyxDQUFDO0lBQ2xCLENBQUMsVUFBVSxFQUFDLFVBQVUsQ0FBQztJQUN2QixDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUM7SUFDZixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7Q0FDakIsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLGlEQUFXLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxVQUFPLEtBQWtCOzs7O0tBSTVFLENBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2RlZXBjaGVzdGF1Yy8uL25vZGVfbW9kdWxlcy9oYW1tZXJqcy9oYW1tZXIuanMiLCJ3ZWJwYWNrOi8vZGVlcGNoZXN0YXVjLy4vc3JjL0JyaXN0b2wvQnJpc3RvbEJvYXJkLnRzIiwid2VicGFjazovL2RlZXBjaGVzdGF1Yy8uL3NyYy9CcmlzdG9sL01haW5CcmlzdG9sLnRzIiwid2VicGFjazovL2RlZXBjaGVzdGF1Yy8uL3NyYy9CcmlzdG9sL1VJRWxlbWVudC50cyIsIndlYnBhY2s6Ly9kZWVwY2hlc3RhdWMvLi9zcmMvQnJpc3RvbC9VSUZyYW1lLnRzIiwid2VicGFjazovL2RlZXBjaGVzdGF1Yy8uL3NyYy9FbGVtZW50cy9CYWNrZ3JvdW5kLnRzIiwid2VicGFjazovL2RlZXBjaGVzdGF1Yy8uL3NyYy9FbGVtZW50cy9Gb290YmFsbEZpZWxkLnRzIiwid2VicGFjazovL2RlZXBjaGVzdGF1Yy8uL3NyYy9FbGVtZW50cy9JbWFnZUVsZW0udHMiLCJ3ZWJwYWNrOi8vZGVlcGNoZXN0YXVjLy4vc3JjL0VsZW1lbnRzL01lc3NhZ2UudHMiLCJ3ZWJwYWNrOi8vZGVlcGNoZXN0YXVjLy4vc3JjL0VsZW1lbnRzL1NreS50cyIsIndlYnBhY2s6Ly9kZWVwY2hlc3RhdWMvLi9zcmMvRWxlbWVudHMvU2xvdE1hY2hpbmUudHMiLCJ3ZWJwYWNrOi8vZGVlcGNoZXN0YXVjLy4vc3JjL0ZIVE1ML0ZDb2xvci50cyIsIndlYnBhY2s6Ly9kZWVwY2hlc3RhdWMvLi9zcmMvRkhUTUwvRkhUTUwudHMiLCJ3ZWJwYWNrOi8vZGVlcGNoZXN0YXVjLy4vc3JjL0hlbHBlci9IZWxwZXIudHMiLCJ3ZWJwYWNrOi8vZGVlcGNoZXN0YXVjLy4vc3JjL0hlbHBlci9Tb3J0ZWRMaW5rZWRMaXN0LnRzIiwid2VicGFjazovL2RlZXBjaGVzdGF1Yy8uL3NyYy9pbXBvcnRzLnRzIiwid2VicGFjazovL2RlZXBjaGVzdGF1Yy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9kZWVwY2hlc3RhdWMvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vZGVlcGNoZXN0YXVjL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9kZWVwY2hlc3RhdWMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9kZWVwY2hlc3RhdWMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9kZWVwY2hlc3RhdWMvLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohIEhhbW1lci5KUyAtIHYyLjAuNyAtIDIwMTYtMDQtMjJcbiAqIGh0dHA6Ly9oYW1tZXJqcy5naXRodWIuaW8vXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE2IEpvcmlrIFRhbmdlbGRlcjtcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSAqL1xuKGZ1bmN0aW9uKHdpbmRvdywgZG9jdW1lbnQsIGV4cG9ydE5hbWUsIHVuZGVmaW5lZCkge1xuICAndXNlIHN0cmljdCc7XG5cbnZhciBWRU5ET1JfUFJFRklYRVMgPSBbJycsICd3ZWJraXQnLCAnTW96JywgJ01TJywgJ21zJywgJ28nXTtcbnZhciBURVNUX0VMRU1FTlQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxudmFyIFRZUEVfRlVOQ1RJT04gPSAnZnVuY3Rpb24nO1xuXG52YXIgcm91bmQgPSBNYXRoLnJvdW5kO1xudmFyIGFicyA9IE1hdGguYWJzO1xudmFyIG5vdyA9IERhdGUubm93O1xuXG4vKipcbiAqIHNldCBhIHRpbWVvdXQgd2l0aCBhIGdpdmVuIHNjb3BlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHBhcmFtIHtOdW1iZXJ9IHRpbWVvdXRcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0XG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5mdW5jdGlvbiBzZXRUaW1lb3V0Q29udGV4dChmbiwgdGltZW91dCwgY29udGV4dCkge1xuICAgIHJldHVybiBzZXRUaW1lb3V0KGJpbmRGbihmbiwgY29udGV4dCksIHRpbWVvdXQpO1xufVxuXG4vKipcbiAqIGlmIHRoZSBhcmd1bWVudCBpcyBhbiBhcnJheSwgd2Ugd2FudCB0byBleGVjdXRlIHRoZSBmbiBvbiBlYWNoIGVudHJ5XG4gKiBpZiBpdCBhaW50IGFuIGFycmF5IHdlIGRvbid0IHdhbnQgdG8gZG8gYSB0aGluZy5cbiAqIHRoaXMgaXMgdXNlZCBieSBhbGwgdGhlIG1ldGhvZHMgdGhhdCBhY2NlcHQgYSBzaW5nbGUgYW5kIGFycmF5IGFyZ3VtZW50LlxuICogQHBhcmFtIHsqfEFycmF5fSBhcmdcbiAqIEBwYXJhbSB7U3RyaW5nfSBmblxuICogQHBhcmFtIHtPYmplY3R9IFtjb250ZXh0XVxuICogQHJldHVybnMge0Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGludm9rZUFycmF5QXJnKGFyZywgZm4sIGNvbnRleHQpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShhcmcpKSB7XG4gICAgICAgIGVhY2goYXJnLCBjb250ZXh0W2ZuXSwgY29udGV4dCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogd2FsayBvYmplY3RzIGFuZCBhcnJheXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gY29udGV4dFxuICovXG5mdW5jdGlvbiBlYWNoKG9iaiwgaXRlcmF0b3IsIGNvbnRleHQpIHtcbiAgICB2YXIgaTtcblxuICAgIGlmICghb2JqKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAob2JqLmZvckVhY2gpIHtcbiAgICAgICAgb2JqLmZvckVhY2goaXRlcmF0b3IsIGNvbnRleHQpO1xuICAgIH0gZWxzZSBpZiAob2JqLmxlbmd0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IG9iai5sZW5ndGgpIHtcbiAgICAgICAgICAgIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2ldLCBpLCBvYmopO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChpIGluIG9iaikge1xuICAgICAgICAgICAgb2JqLmhhc093blByb3BlcnR5KGkpICYmIGl0ZXJhdG9yLmNhbGwoY29udGV4dCwgb2JqW2ldLCBpLCBvYmopO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vKipcbiAqIHdyYXAgYSBtZXRob2Qgd2l0aCBhIGRlcHJlY2F0aW9uIHdhcm5pbmcgYW5kIHN0YWNrIHRyYWNlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBtZXRob2RcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZVxuICogQHJldHVybnMge0Z1bmN0aW9ufSBBIG5ldyBmdW5jdGlvbiB3cmFwcGluZyB0aGUgc3VwcGxpZWQgbWV0aG9kLlxuICovXG5mdW5jdGlvbiBkZXByZWNhdGUobWV0aG9kLCBuYW1lLCBtZXNzYWdlKSB7XG4gICAgdmFyIGRlcHJlY2F0aW9uTWVzc2FnZSA9ICdERVBSRUNBVEVEIE1FVEhPRDogJyArIG5hbWUgKyAnXFxuJyArIG1lc3NhZ2UgKyAnIEFUIFxcbic7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZSA9IG5ldyBFcnJvcignZ2V0LXN0YWNrLXRyYWNlJyk7XG4gICAgICAgIHZhciBzdGFjayA9IGUgJiYgZS5zdGFjayA/IGUuc3RhY2sucmVwbGFjZSgvXlteXFwoXSs/W1xcbiRdL2dtLCAnJylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9eXFxzK2F0XFxzKy9nbSwgJycpXG4gICAgICAgICAgICAucmVwbGFjZSgvXk9iamVjdC48YW5vbnltb3VzPlxccypcXCgvZ20sICd7YW5vbnltb3VzfSgpQCcpIDogJ1Vua25vd24gU3RhY2sgVHJhY2UnO1xuXG4gICAgICAgIHZhciBsb2cgPSB3aW5kb3cuY29uc29sZSAmJiAod2luZG93LmNvbnNvbGUud2FybiB8fCB3aW5kb3cuY29uc29sZS5sb2cpO1xuICAgICAgICBpZiAobG9nKSB7XG4gICAgICAgICAgICBsb2cuY2FsbCh3aW5kb3cuY29uc29sZSwgZGVwcmVjYXRpb25NZXNzYWdlLCBzdGFjayk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1ldGhvZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG59XG5cbi8qKlxuICogZXh0ZW5kIG9iamVjdC5cbiAqIG1lYW5zIHRoYXQgcHJvcGVydGllcyBpbiBkZXN0IHdpbGwgYmUgb3ZlcndyaXR0ZW4gYnkgdGhlIG9uZXMgaW4gc3JjLlxuICogQHBhcmFtIHtPYmplY3R9IHRhcmdldFxuICogQHBhcmFtIHsuLi5PYmplY3R9IG9iamVjdHNfdG9fYXNzaWduXG4gKiBAcmV0dXJucyB7T2JqZWN0fSB0YXJnZXRcbiAqL1xudmFyIGFzc2lnbjtcbmlmICh0eXBlb2YgT2JqZWN0LmFzc2lnbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIGFzc2lnbiA9IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQpIHtcbiAgICAgICAgaWYgKHRhcmdldCA9PT0gdW5kZWZpbmVkIHx8IHRhcmdldCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnZlcnQgdW5kZWZpbmVkIG9yIG51bGwgdG8gb2JqZWN0Jyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgb3V0cHV0ID0gT2JqZWN0KHRhcmdldCk7XG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMTsgaW5kZXggPCBhcmd1bWVudHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2luZGV4XTtcbiAgICAgICAgICAgIGlmIChzb3VyY2UgIT09IHVuZGVmaW5lZCAmJiBzb3VyY2UgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBuZXh0S2V5IGluIHNvdXJjZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KG5leHRLZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRbbmV4dEtleV0gPSBzb3VyY2VbbmV4dEtleV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICB9O1xufSBlbHNlIHtcbiAgICBhc3NpZ24gPSBPYmplY3QuYXNzaWduO1xufVxuXG4vKipcbiAqIGV4dGVuZCBvYmplY3QuXG4gKiBtZWFucyB0aGF0IHByb3BlcnRpZXMgaW4gZGVzdCB3aWxsIGJlIG92ZXJ3cml0dGVuIGJ5IHRoZSBvbmVzIGluIHNyYy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkZXN0XG4gKiBAcGFyYW0ge09iamVjdH0gc3JjXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFttZXJnZT1mYWxzZV1cbiAqIEByZXR1cm5zIHtPYmplY3R9IGRlc3RcbiAqL1xudmFyIGV4dGVuZCA9IGRlcHJlY2F0ZShmdW5jdGlvbiBleHRlbmQoZGVzdCwgc3JjLCBtZXJnZSkge1xuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoc3JjKTtcbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBrZXlzLmxlbmd0aCkge1xuICAgICAgICBpZiAoIW1lcmdlIHx8IChtZXJnZSAmJiBkZXN0W2tleXNbaV1dID09PSB1bmRlZmluZWQpKSB7XG4gICAgICAgICAgICBkZXN0W2tleXNbaV1dID0gc3JjW2tleXNbaV1dO1xuICAgICAgICB9XG4gICAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIGRlc3Q7XG59LCAnZXh0ZW5kJywgJ1VzZSBgYXNzaWduYC4nKTtcblxuLyoqXG4gKiBtZXJnZSB0aGUgdmFsdWVzIGZyb20gc3JjIGluIHRoZSBkZXN0LlxuICogbWVhbnMgdGhhdCBwcm9wZXJ0aWVzIHRoYXQgZXhpc3QgaW4gZGVzdCB3aWxsIG5vdCBiZSBvdmVyd3JpdHRlbiBieSBzcmNcbiAqIEBwYXJhbSB7T2JqZWN0fSBkZXN0XG4gKiBAcGFyYW0ge09iamVjdH0gc3JjXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBkZXN0XG4gKi9cbnZhciBtZXJnZSA9IGRlcHJlY2F0ZShmdW5jdGlvbiBtZXJnZShkZXN0LCBzcmMpIHtcbiAgICByZXR1cm4gZXh0ZW5kKGRlc3QsIHNyYywgdHJ1ZSk7XG59LCAnbWVyZ2UnLCAnVXNlIGBhc3NpZ25gLicpO1xuXG4vKipcbiAqIHNpbXBsZSBjbGFzcyBpbmhlcml0YW5jZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2hpbGRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGJhc2VcbiAqIEBwYXJhbSB7T2JqZWN0fSBbcHJvcGVydGllc11cbiAqL1xuZnVuY3Rpb24gaW5oZXJpdChjaGlsZCwgYmFzZSwgcHJvcGVydGllcykge1xuICAgIHZhciBiYXNlUCA9IGJhc2UucHJvdG90eXBlLFxuICAgICAgICBjaGlsZFA7XG5cbiAgICBjaGlsZFAgPSBjaGlsZC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKGJhc2VQKTtcbiAgICBjaGlsZFAuY29uc3RydWN0b3IgPSBjaGlsZDtcbiAgICBjaGlsZFAuX3N1cGVyID0gYmFzZVA7XG5cbiAgICBpZiAocHJvcGVydGllcykge1xuICAgICAgICBhc3NpZ24oY2hpbGRQLCBwcm9wZXJ0aWVzKTtcbiAgICB9XG59XG5cbi8qKlxuICogc2ltcGxlIGZ1bmN0aW9uIGJpbmRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge09iamVjdH0gY29udGV4dFxuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5mdW5jdGlvbiBiaW5kRm4oZm4sIGNvbnRleHQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gYm91bmRGbigpIHtcbiAgICAgICAgcmV0dXJuIGZuLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50cyk7XG4gICAgfTtcbn1cblxuLyoqXG4gKiBsZXQgYSBib29sZWFuIHZhbHVlIGFsc28gYmUgYSBmdW5jdGlvbiB0aGF0IG11c3QgcmV0dXJuIGEgYm9vbGVhblxuICogdGhpcyBmaXJzdCBpdGVtIGluIGFyZ3Mgd2lsbCBiZSB1c2VkIGFzIHRoZSBjb250ZXh0XG4gKiBAcGFyYW0ge0Jvb2xlYW58RnVuY3Rpb259IHZhbFxuICogQHBhcmFtIHtBcnJheX0gW2FyZ3NdXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gYm9vbE9yRm4odmFsLCBhcmdzKSB7XG4gICAgaWYgKHR5cGVvZiB2YWwgPT0gVFlQRV9GVU5DVElPTikge1xuICAgICAgICByZXR1cm4gdmFsLmFwcGx5KGFyZ3MgPyBhcmdzWzBdIHx8IHVuZGVmaW5lZCA6IHVuZGVmaW5lZCwgYXJncyk7XG4gICAgfVxuICAgIHJldHVybiB2YWw7XG59XG5cbi8qKlxuICogdXNlIHRoZSB2YWwyIHdoZW4gdmFsMSBpcyB1bmRlZmluZWRcbiAqIEBwYXJhbSB7Kn0gdmFsMVxuICogQHBhcmFtIHsqfSB2YWwyXG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuZnVuY3Rpb24gaWZVbmRlZmluZWQodmFsMSwgdmFsMikge1xuICAgIHJldHVybiAodmFsMSA9PT0gdW5kZWZpbmVkKSA/IHZhbDIgOiB2YWwxO1xufVxuXG4vKipcbiAqIGFkZEV2ZW50TGlzdGVuZXIgd2l0aCBtdWx0aXBsZSBldmVudHMgYXQgb25jZVxuICogQHBhcmFtIHtFdmVudFRhcmdldH0gdGFyZ2V0XG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZXNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXJcbiAqL1xuZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lcnModGFyZ2V0LCB0eXBlcywgaGFuZGxlcikge1xuICAgIGVhY2goc3BsaXRTdHIodHlwZXMpLCBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGhhbmRsZXIsIGZhbHNlKTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiByZW1vdmVFdmVudExpc3RlbmVyIHdpdGggbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2VcbiAqIEBwYXJhbSB7RXZlbnRUYXJnZXR9IHRhcmdldFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUV2ZW50TGlzdGVuZXJzKHRhcmdldCwgdHlwZXMsIGhhbmRsZXIpIHtcbiAgICBlYWNoKHNwbGl0U3RyKHR5cGVzKSwgZnVuY3Rpb24odHlwZSkge1xuICAgICAgICB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBoYW5kbGVyLCBmYWxzZSk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogZmluZCBpZiBhIG5vZGUgaXMgaW4gdGhlIGdpdmVuIHBhcmVudFxuICogQG1ldGhvZCBoYXNQYXJlbnRcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG5vZGVcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHBhcmVudFxuICogQHJldHVybiB7Qm9vbGVhbn0gZm91bmRcbiAqL1xuZnVuY3Rpb24gaGFzUGFyZW50KG5vZGUsIHBhcmVudCkge1xuICAgIHdoaWxlIChub2RlKSB7XG4gICAgICAgIGlmIChub2RlID09IHBhcmVudCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgbm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIHNtYWxsIGluZGV4T2Ygd3JhcHBlclxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHBhcmFtIHtTdHJpbmd9IGZpbmRcbiAqIEByZXR1cm5zIHtCb29sZWFufSBmb3VuZFxuICovXG5mdW5jdGlvbiBpblN0cihzdHIsIGZpbmQpIHtcbiAgICByZXR1cm4gc3RyLmluZGV4T2YoZmluZCkgPiAtMTtcbn1cblxuLyoqXG4gKiBzcGxpdCBzdHJpbmcgb24gd2hpdGVzcGFjZVxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybnMge0FycmF5fSB3b3Jkc1xuICovXG5mdW5jdGlvbiBzcGxpdFN0cihzdHIpIHtcbiAgICByZXR1cm4gc3RyLnRyaW0oKS5zcGxpdCgvXFxzKy9nKTtcbn1cblxuLyoqXG4gKiBmaW5kIGlmIGEgYXJyYXkgY29udGFpbnMgdGhlIG9iamVjdCB1c2luZyBpbmRleE9mIG9yIGEgc2ltcGxlIHBvbHlGaWxsXG4gKiBAcGFyYW0ge0FycmF5fSBzcmNcbiAqIEBwYXJhbSB7U3RyaW5nfSBmaW5kXG4gKiBAcGFyYW0ge1N0cmluZ30gW2ZpbmRCeUtleV1cbiAqIEByZXR1cm4ge0Jvb2xlYW58TnVtYmVyfSBmYWxzZSB3aGVuIG5vdCBmb3VuZCwgb3IgdGhlIGluZGV4XG4gKi9cbmZ1bmN0aW9uIGluQXJyYXkoc3JjLCBmaW5kLCBmaW5kQnlLZXkpIHtcbiAgICBpZiAoc3JjLmluZGV4T2YgJiYgIWZpbmRCeUtleSkge1xuICAgICAgICByZXR1cm4gc3JjLmluZGV4T2YoZmluZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IHNyYy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICgoZmluZEJ5S2V5ICYmIHNyY1tpXVtmaW5kQnlLZXldID09IGZpbmQpIHx8ICghZmluZEJ5S2V5ICYmIHNyY1tpXSA9PT0gZmluZCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxufVxuXG4vKipcbiAqIGNvbnZlcnQgYXJyYXktbGlrZSBvYmplY3RzIHRvIHJlYWwgYXJyYXlzXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKi9cbmZ1bmN0aW9uIHRvQXJyYXkob2JqKSB7XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG9iaiwgMCk7XG59XG5cbi8qKlxuICogdW5pcXVlIGFycmF5IHdpdGggb2JqZWN0cyBiYXNlZCBvbiBhIGtleSAobGlrZSAnaWQnKSBvciBqdXN0IGJ5IHRoZSBhcnJheSdzIHZhbHVlXG4gKiBAcGFyYW0ge0FycmF5fSBzcmMgW3tpZDoxfSx7aWQ6Mn0se2lkOjF9XVxuICogQHBhcmFtIHtTdHJpbmd9IFtrZXldXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtzb3J0PUZhbHNlXVxuICogQHJldHVybnMge0FycmF5fSBbe2lkOjF9LHtpZDoyfV1cbiAqL1xuZnVuY3Rpb24gdW5pcXVlQXJyYXkoc3JjLCBrZXksIHNvcnQpIHtcbiAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgIHZhciB2YWx1ZXMgPSBbXTtcbiAgICB2YXIgaSA9IDA7XG5cbiAgICB3aGlsZSAoaSA8IHNyYy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIHZhbCA9IGtleSA/IHNyY1tpXVtrZXldIDogc3JjW2ldO1xuICAgICAgICBpZiAoaW5BcnJheSh2YWx1ZXMsIHZhbCkgPCAwKSB7XG4gICAgICAgICAgICByZXN1bHRzLnB1c2goc3JjW2ldKTtcbiAgICAgICAgfVxuICAgICAgICB2YWx1ZXNbaV0gPSB2YWw7XG4gICAgICAgIGkrKztcbiAgICB9XG5cbiAgICBpZiAoc29ydCkge1xuICAgICAgICBpZiAoIWtleSkge1xuICAgICAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuc29ydCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuc29ydChmdW5jdGlvbiBzb3J0VW5pcXVlQXJyYXkoYSwgYikge1xuICAgICAgICAgICAgICAgIHJldHVybiBhW2tleV0gPiBiW2tleV07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHRzO1xufVxuXG4vKipcbiAqIGdldCB0aGUgcHJlZml4ZWQgcHJvcGVydHlcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wZXJ0eVxuICogQHJldHVybnMge1N0cmluZ3xVbmRlZmluZWR9IHByZWZpeGVkXG4gKi9cbmZ1bmN0aW9uIHByZWZpeGVkKG9iaiwgcHJvcGVydHkpIHtcbiAgICB2YXIgcHJlZml4LCBwcm9wO1xuICAgIHZhciBjYW1lbFByb3AgPSBwcm9wZXJ0eVswXS50b1VwcGVyQ2FzZSgpICsgcHJvcGVydHkuc2xpY2UoMSk7XG5cbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBWRU5ET1JfUFJFRklYRVMubGVuZ3RoKSB7XG4gICAgICAgIHByZWZpeCA9IFZFTkRPUl9QUkVGSVhFU1tpXTtcbiAgICAgICAgcHJvcCA9IChwcmVmaXgpID8gcHJlZml4ICsgY2FtZWxQcm9wIDogcHJvcGVydHk7XG5cbiAgICAgICAgaWYgKHByb3AgaW4gb2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvcDtcbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogZ2V0IGEgdW5pcXVlIGlkXG4gKiBAcmV0dXJucyB7bnVtYmVyfSB1bmlxdWVJZFxuICovXG52YXIgX3VuaXF1ZUlkID0gMTtcbmZ1bmN0aW9uIHVuaXF1ZUlkKCkge1xuICAgIHJldHVybiBfdW5pcXVlSWQrKztcbn1cblxuLyoqXG4gKiBnZXQgdGhlIHdpbmRvdyBvYmplY3Qgb2YgYW4gZWxlbWVudFxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICogQHJldHVybnMge0RvY3VtZW50Vmlld3xXaW5kb3d9XG4gKi9cbmZ1bmN0aW9uIGdldFdpbmRvd0ZvckVsZW1lbnQoZWxlbWVudCkge1xuICAgIHZhciBkb2MgPSBlbGVtZW50Lm93bmVyRG9jdW1lbnQgfHwgZWxlbWVudDtcbiAgICByZXR1cm4gKGRvYy5kZWZhdWx0VmlldyB8fCBkb2MucGFyZW50V2luZG93IHx8IHdpbmRvdyk7XG59XG5cbnZhciBNT0JJTEVfUkVHRVggPSAvbW9iaWxlfHRhYmxldHxpcChhZHxob25lfG9kKXxhbmRyb2lkL2k7XG5cbnZhciBTVVBQT1JUX1RPVUNIID0gKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyk7XG52YXIgU1VQUE9SVF9QT0lOVEVSX0VWRU5UUyA9IHByZWZpeGVkKHdpbmRvdywgJ1BvaW50ZXJFdmVudCcpICE9PSB1bmRlZmluZWQ7XG52YXIgU1VQUE9SVF9PTkxZX1RPVUNIID0gU1VQUE9SVF9UT1VDSCAmJiBNT0JJTEVfUkVHRVgudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcblxudmFyIElOUFVUX1RZUEVfVE9VQ0ggPSAndG91Y2gnO1xudmFyIElOUFVUX1RZUEVfUEVOID0gJ3Blbic7XG52YXIgSU5QVVRfVFlQRV9NT1VTRSA9ICdtb3VzZSc7XG52YXIgSU5QVVRfVFlQRV9LSU5FQ1QgPSAna2luZWN0JztcblxudmFyIENPTVBVVEVfSU5URVJWQUwgPSAyNTtcblxudmFyIElOUFVUX1NUQVJUID0gMTtcbnZhciBJTlBVVF9NT1ZFID0gMjtcbnZhciBJTlBVVF9FTkQgPSA0O1xudmFyIElOUFVUX0NBTkNFTCA9IDg7XG5cbnZhciBESVJFQ1RJT05fTk9ORSA9IDE7XG52YXIgRElSRUNUSU9OX0xFRlQgPSAyO1xudmFyIERJUkVDVElPTl9SSUdIVCA9IDQ7XG52YXIgRElSRUNUSU9OX1VQID0gODtcbnZhciBESVJFQ1RJT05fRE9XTiA9IDE2O1xuXG52YXIgRElSRUNUSU9OX0hPUklaT05UQUwgPSBESVJFQ1RJT05fTEVGVCB8IERJUkVDVElPTl9SSUdIVDtcbnZhciBESVJFQ1RJT05fVkVSVElDQUwgPSBESVJFQ1RJT05fVVAgfCBESVJFQ1RJT05fRE9XTjtcbnZhciBESVJFQ1RJT05fQUxMID0gRElSRUNUSU9OX0hPUklaT05UQUwgfCBESVJFQ1RJT05fVkVSVElDQUw7XG5cbnZhciBQUk9QU19YWSA9IFsneCcsICd5J107XG52YXIgUFJPUFNfQ0xJRU5UX1hZID0gWydjbGllbnRYJywgJ2NsaWVudFknXTtcblxuLyoqXG4gKiBjcmVhdGUgbmV3IGlucHV0IHR5cGUgbWFuYWdlclxuICogQHBhcmFtIHtNYW5hZ2VyfSBtYW5hZ2VyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybnMge0lucHV0fVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIElucHV0KG1hbmFnZXIsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMubWFuYWdlciA9IG1hbmFnZXI7XG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIHRoaXMuZWxlbWVudCA9IG1hbmFnZXIuZWxlbWVudDtcbiAgICB0aGlzLnRhcmdldCA9IG1hbmFnZXIub3B0aW9ucy5pbnB1dFRhcmdldDtcblxuICAgIC8vIHNtYWxsZXIgd3JhcHBlciBhcm91bmQgdGhlIGhhbmRsZXIsIGZvciB0aGUgc2NvcGUgYW5kIHRoZSBlbmFibGVkIHN0YXRlIG9mIHRoZSBtYW5hZ2VyLFxuICAgIC8vIHNvIHdoZW4gZGlzYWJsZWQgdGhlIGlucHV0IGV2ZW50cyBhcmUgY29tcGxldGVseSBieXBhc3NlZC5cbiAgICB0aGlzLmRvbUhhbmRsZXIgPSBmdW5jdGlvbihldikge1xuICAgICAgICBpZiAoYm9vbE9yRm4obWFuYWdlci5vcHRpb25zLmVuYWJsZSwgW21hbmFnZXJdKSkge1xuICAgICAgICAgICAgc2VsZi5oYW5kbGVyKGV2KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLmluaXQoKTtcblxufVxuXG5JbnB1dC5wcm90b3R5cGUgPSB7XG4gICAgLyoqXG4gICAgICogc2hvdWxkIGhhbmRsZSB0aGUgaW5wdXRFdmVudCBkYXRhIGFuZCB0cmlnZ2VyIHRoZSBjYWxsYmFja1xuICAgICAqIEB2aXJ0dWFsXG4gICAgICovXG4gICAgaGFuZGxlcjogZnVuY3Rpb24oKSB7IH0sXG5cbiAgICAvKipcbiAgICAgKiBiaW5kIHRoZSBldmVudHNcbiAgICAgKi9cbiAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5ldkVsICYmIGFkZEV2ZW50TGlzdGVuZXJzKHRoaXMuZWxlbWVudCwgdGhpcy5ldkVsLCB0aGlzLmRvbUhhbmRsZXIpO1xuICAgICAgICB0aGlzLmV2VGFyZ2V0ICYmIGFkZEV2ZW50TGlzdGVuZXJzKHRoaXMudGFyZ2V0LCB0aGlzLmV2VGFyZ2V0LCB0aGlzLmRvbUhhbmRsZXIpO1xuICAgICAgICB0aGlzLmV2V2luICYmIGFkZEV2ZW50TGlzdGVuZXJzKGdldFdpbmRvd0ZvckVsZW1lbnQodGhpcy5lbGVtZW50KSwgdGhpcy5ldldpbiwgdGhpcy5kb21IYW5kbGVyKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogdW5iaW5kIHRoZSBldmVudHNcbiAgICAgKi9cbiAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5ldkVsICYmIHJlbW92ZUV2ZW50TGlzdGVuZXJzKHRoaXMuZWxlbWVudCwgdGhpcy5ldkVsLCB0aGlzLmRvbUhhbmRsZXIpO1xuICAgICAgICB0aGlzLmV2VGFyZ2V0ICYmIHJlbW92ZUV2ZW50TGlzdGVuZXJzKHRoaXMudGFyZ2V0LCB0aGlzLmV2VGFyZ2V0LCB0aGlzLmRvbUhhbmRsZXIpO1xuICAgICAgICB0aGlzLmV2V2luICYmIHJlbW92ZUV2ZW50TGlzdGVuZXJzKGdldFdpbmRvd0ZvckVsZW1lbnQodGhpcy5lbGVtZW50KSwgdGhpcy5ldldpbiwgdGhpcy5kb21IYW5kbGVyKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIGNyZWF0ZSBuZXcgaW5wdXQgdHlwZSBtYW5hZ2VyXG4gKiBjYWxsZWQgYnkgdGhlIE1hbmFnZXIgY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7SGFtbWVyfSBtYW5hZ2VyXG4gKiBAcmV0dXJucyB7SW5wdXR9XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUlucHV0SW5zdGFuY2UobWFuYWdlcikge1xuICAgIHZhciBUeXBlO1xuICAgIHZhciBpbnB1dENsYXNzID0gbWFuYWdlci5vcHRpb25zLmlucHV0Q2xhc3M7XG5cbiAgICBpZiAoaW5wdXRDbGFzcykge1xuICAgICAgICBUeXBlID0gaW5wdXRDbGFzcztcbiAgICB9IGVsc2UgaWYgKFNVUFBPUlRfUE9JTlRFUl9FVkVOVFMpIHtcbiAgICAgICAgVHlwZSA9IFBvaW50ZXJFdmVudElucHV0O1xuICAgIH0gZWxzZSBpZiAoU1VQUE9SVF9PTkxZX1RPVUNIKSB7XG4gICAgICAgIFR5cGUgPSBUb3VjaElucHV0O1xuICAgIH0gZWxzZSBpZiAoIVNVUFBPUlRfVE9VQ0gpIHtcbiAgICAgICAgVHlwZSA9IE1vdXNlSW5wdXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgVHlwZSA9IFRvdWNoTW91c2VJbnB1dDtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyAoVHlwZSkobWFuYWdlciwgaW5wdXRIYW5kbGVyKTtcbn1cblxuLyoqXG4gKiBoYW5kbGUgaW5wdXQgZXZlbnRzXG4gKiBAcGFyYW0ge01hbmFnZXJ9IG1hbmFnZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFR5cGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICovXG5mdW5jdGlvbiBpbnB1dEhhbmRsZXIobWFuYWdlciwgZXZlbnRUeXBlLCBpbnB1dCkge1xuICAgIHZhciBwb2ludGVyc0xlbiA9IGlucHV0LnBvaW50ZXJzLmxlbmd0aDtcbiAgICB2YXIgY2hhbmdlZFBvaW50ZXJzTGVuID0gaW5wdXQuY2hhbmdlZFBvaW50ZXJzLmxlbmd0aDtcbiAgICB2YXIgaXNGaXJzdCA9IChldmVudFR5cGUgJiBJTlBVVF9TVEFSVCAmJiAocG9pbnRlcnNMZW4gLSBjaGFuZ2VkUG9pbnRlcnNMZW4gPT09IDApKTtcbiAgICB2YXIgaXNGaW5hbCA9IChldmVudFR5cGUgJiAoSU5QVVRfRU5EIHwgSU5QVVRfQ0FOQ0VMKSAmJiAocG9pbnRlcnNMZW4gLSBjaGFuZ2VkUG9pbnRlcnNMZW4gPT09IDApKTtcblxuICAgIGlucHV0LmlzRmlyc3QgPSAhIWlzRmlyc3Q7XG4gICAgaW5wdXQuaXNGaW5hbCA9ICEhaXNGaW5hbDtcblxuICAgIGlmIChpc0ZpcnN0KSB7XG4gICAgICAgIG1hbmFnZXIuc2Vzc2lvbiA9IHt9O1xuICAgIH1cblxuICAgIC8vIHNvdXJjZSBldmVudCBpcyB0aGUgbm9ybWFsaXplZCB2YWx1ZSBvZiB0aGUgZG9tRXZlbnRzXG4gICAgLy8gbGlrZSAndG91Y2hzdGFydCwgbW91c2V1cCwgcG9pbnRlcmRvd24nXG4gICAgaW5wdXQuZXZlbnRUeXBlID0gZXZlbnRUeXBlO1xuXG4gICAgLy8gY29tcHV0ZSBzY2FsZSwgcm90YXRpb24gZXRjXG4gICAgY29tcHV0ZUlucHV0RGF0YShtYW5hZ2VyLCBpbnB1dCk7XG5cbiAgICAvLyBlbWl0IHNlY3JldCBldmVudFxuICAgIG1hbmFnZXIuZW1pdCgnaGFtbWVyLmlucHV0JywgaW5wdXQpO1xuXG4gICAgbWFuYWdlci5yZWNvZ25pemUoaW5wdXQpO1xuICAgIG1hbmFnZXIuc2Vzc2lvbi5wcmV2SW5wdXQgPSBpbnB1dDtcbn1cblxuLyoqXG4gKiBleHRlbmQgdGhlIGRhdGEgd2l0aCBzb21lIHVzYWJsZSBwcm9wZXJ0aWVzIGxpa2Ugc2NhbGUsIHJvdGF0ZSwgdmVsb2NpdHkgZXRjXG4gKiBAcGFyYW0ge09iamVjdH0gbWFuYWdlclxuICogQHBhcmFtIHtPYmplY3R9IGlucHV0XG4gKi9cbmZ1bmN0aW9uIGNvbXB1dGVJbnB1dERhdGEobWFuYWdlciwgaW5wdXQpIHtcbiAgICB2YXIgc2Vzc2lvbiA9IG1hbmFnZXIuc2Vzc2lvbjtcbiAgICB2YXIgcG9pbnRlcnMgPSBpbnB1dC5wb2ludGVycztcbiAgICB2YXIgcG9pbnRlcnNMZW5ndGggPSBwb2ludGVycy5sZW5ndGg7XG5cbiAgICAvLyBzdG9yZSB0aGUgZmlyc3QgaW5wdXQgdG8gY2FsY3VsYXRlIHRoZSBkaXN0YW5jZSBhbmQgZGlyZWN0aW9uXG4gICAgaWYgKCFzZXNzaW9uLmZpcnN0SW5wdXQpIHtcbiAgICAgICAgc2Vzc2lvbi5maXJzdElucHV0ID0gc2ltcGxlQ2xvbmVJbnB1dERhdGEoaW5wdXQpO1xuICAgIH1cblxuICAgIC8vIHRvIGNvbXB1dGUgc2NhbGUgYW5kIHJvdGF0aW9uIHdlIG5lZWQgdG8gc3RvcmUgdGhlIG11bHRpcGxlIHRvdWNoZXNcbiAgICBpZiAocG9pbnRlcnNMZW5ndGggPiAxICYmICFzZXNzaW9uLmZpcnN0TXVsdGlwbGUpIHtcbiAgICAgICAgc2Vzc2lvbi5maXJzdE11bHRpcGxlID0gc2ltcGxlQ2xvbmVJbnB1dERhdGEoaW5wdXQpO1xuICAgIH0gZWxzZSBpZiAocG9pbnRlcnNMZW5ndGggPT09IDEpIHtcbiAgICAgICAgc2Vzc2lvbi5maXJzdE11bHRpcGxlID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIGZpcnN0SW5wdXQgPSBzZXNzaW9uLmZpcnN0SW5wdXQ7XG4gICAgdmFyIGZpcnN0TXVsdGlwbGUgPSBzZXNzaW9uLmZpcnN0TXVsdGlwbGU7XG4gICAgdmFyIG9mZnNldENlbnRlciA9IGZpcnN0TXVsdGlwbGUgPyBmaXJzdE11bHRpcGxlLmNlbnRlciA6IGZpcnN0SW5wdXQuY2VudGVyO1xuXG4gICAgdmFyIGNlbnRlciA9IGlucHV0LmNlbnRlciA9IGdldENlbnRlcihwb2ludGVycyk7XG4gICAgaW5wdXQudGltZVN0YW1wID0gbm93KCk7XG4gICAgaW5wdXQuZGVsdGFUaW1lID0gaW5wdXQudGltZVN0YW1wIC0gZmlyc3RJbnB1dC50aW1lU3RhbXA7XG5cbiAgICBpbnB1dC5hbmdsZSA9IGdldEFuZ2xlKG9mZnNldENlbnRlciwgY2VudGVyKTtcbiAgICBpbnB1dC5kaXN0YW5jZSA9IGdldERpc3RhbmNlKG9mZnNldENlbnRlciwgY2VudGVyKTtcblxuICAgIGNvbXB1dGVEZWx0YVhZKHNlc3Npb24sIGlucHV0KTtcbiAgICBpbnB1dC5vZmZzZXREaXJlY3Rpb24gPSBnZXREaXJlY3Rpb24oaW5wdXQuZGVsdGFYLCBpbnB1dC5kZWx0YVkpO1xuXG4gICAgdmFyIG92ZXJhbGxWZWxvY2l0eSA9IGdldFZlbG9jaXR5KGlucHV0LmRlbHRhVGltZSwgaW5wdXQuZGVsdGFYLCBpbnB1dC5kZWx0YVkpO1xuICAgIGlucHV0Lm92ZXJhbGxWZWxvY2l0eVggPSBvdmVyYWxsVmVsb2NpdHkueDtcbiAgICBpbnB1dC5vdmVyYWxsVmVsb2NpdHlZID0gb3ZlcmFsbFZlbG9jaXR5Lnk7XG4gICAgaW5wdXQub3ZlcmFsbFZlbG9jaXR5ID0gKGFicyhvdmVyYWxsVmVsb2NpdHkueCkgPiBhYnMob3ZlcmFsbFZlbG9jaXR5LnkpKSA/IG92ZXJhbGxWZWxvY2l0eS54IDogb3ZlcmFsbFZlbG9jaXR5Lnk7XG5cbiAgICBpbnB1dC5zY2FsZSA9IGZpcnN0TXVsdGlwbGUgPyBnZXRTY2FsZShmaXJzdE11bHRpcGxlLnBvaW50ZXJzLCBwb2ludGVycykgOiAxO1xuICAgIGlucHV0LnJvdGF0aW9uID0gZmlyc3RNdWx0aXBsZSA/IGdldFJvdGF0aW9uKGZpcnN0TXVsdGlwbGUucG9pbnRlcnMsIHBvaW50ZXJzKSA6IDA7XG5cbiAgICBpbnB1dC5tYXhQb2ludGVycyA9ICFzZXNzaW9uLnByZXZJbnB1dCA/IGlucHV0LnBvaW50ZXJzLmxlbmd0aCA6ICgoaW5wdXQucG9pbnRlcnMubGVuZ3RoID5cbiAgICAgICAgc2Vzc2lvbi5wcmV2SW5wdXQubWF4UG9pbnRlcnMpID8gaW5wdXQucG9pbnRlcnMubGVuZ3RoIDogc2Vzc2lvbi5wcmV2SW5wdXQubWF4UG9pbnRlcnMpO1xuXG4gICAgY29tcHV0ZUludGVydmFsSW5wdXREYXRhKHNlc3Npb24sIGlucHV0KTtcblxuICAgIC8vIGZpbmQgdGhlIGNvcnJlY3QgdGFyZ2V0XG4gICAgdmFyIHRhcmdldCA9IG1hbmFnZXIuZWxlbWVudDtcbiAgICBpZiAoaGFzUGFyZW50KGlucHV0LnNyY0V2ZW50LnRhcmdldCwgdGFyZ2V0KSkge1xuICAgICAgICB0YXJnZXQgPSBpbnB1dC5zcmNFdmVudC50YXJnZXQ7XG4gICAgfVxuICAgIGlucHV0LnRhcmdldCA9IHRhcmdldDtcbn1cblxuZnVuY3Rpb24gY29tcHV0ZURlbHRhWFkoc2Vzc2lvbiwgaW5wdXQpIHtcbiAgICB2YXIgY2VudGVyID0gaW5wdXQuY2VudGVyO1xuICAgIHZhciBvZmZzZXQgPSBzZXNzaW9uLm9mZnNldERlbHRhIHx8IHt9O1xuICAgIHZhciBwcmV2RGVsdGEgPSBzZXNzaW9uLnByZXZEZWx0YSB8fCB7fTtcbiAgICB2YXIgcHJldklucHV0ID0gc2Vzc2lvbi5wcmV2SW5wdXQgfHwge307XG5cbiAgICBpZiAoaW5wdXQuZXZlbnRUeXBlID09PSBJTlBVVF9TVEFSVCB8fCBwcmV2SW5wdXQuZXZlbnRUeXBlID09PSBJTlBVVF9FTkQpIHtcbiAgICAgICAgcHJldkRlbHRhID0gc2Vzc2lvbi5wcmV2RGVsdGEgPSB7XG4gICAgICAgICAgICB4OiBwcmV2SW5wdXQuZGVsdGFYIHx8IDAsXG4gICAgICAgICAgICB5OiBwcmV2SW5wdXQuZGVsdGFZIHx8IDBcbiAgICAgICAgfTtcblxuICAgICAgICBvZmZzZXQgPSBzZXNzaW9uLm9mZnNldERlbHRhID0ge1xuICAgICAgICAgICAgeDogY2VudGVyLngsXG4gICAgICAgICAgICB5OiBjZW50ZXIueVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGlucHV0LmRlbHRhWCA9IHByZXZEZWx0YS54ICsgKGNlbnRlci54IC0gb2Zmc2V0LngpO1xuICAgIGlucHV0LmRlbHRhWSA9IHByZXZEZWx0YS55ICsgKGNlbnRlci55IC0gb2Zmc2V0LnkpO1xufVxuXG4vKipcbiAqIHZlbG9jaXR5IGlzIGNhbGN1bGF0ZWQgZXZlcnkgeCBtc1xuICogQHBhcmFtIHtPYmplY3R9IHNlc3Npb25cbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICovXG5mdW5jdGlvbiBjb21wdXRlSW50ZXJ2YWxJbnB1dERhdGEoc2Vzc2lvbiwgaW5wdXQpIHtcbiAgICB2YXIgbGFzdCA9IHNlc3Npb24ubGFzdEludGVydmFsIHx8IGlucHV0LFxuICAgICAgICBkZWx0YVRpbWUgPSBpbnB1dC50aW1lU3RhbXAgLSBsYXN0LnRpbWVTdGFtcCxcbiAgICAgICAgdmVsb2NpdHksIHZlbG9jaXR5WCwgdmVsb2NpdHlZLCBkaXJlY3Rpb247XG5cbiAgICBpZiAoaW5wdXQuZXZlbnRUeXBlICE9IElOUFVUX0NBTkNFTCAmJiAoZGVsdGFUaW1lID4gQ09NUFVURV9JTlRFUlZBTCB8fCBsYXN0LnZlbG9jaXR5ID09PSB1bmRlZmluZWQpKSB7XG4gICAgICAgIHZhciBkZWx0YVggPSBpbnB1dC5kZWx0YVggLSBsYXN0LmRlbHRhWDtcbiAgICAgICAgdmFyIGRlbHRhWSA9IGlucHV0LmRlbHRhWSAtIGxhc3QuZGVsdGFZO1xuXG4gICAgICAgIHZhciB2ID0gZ2V0VmVsb2NpdHkoZGVsdGFUaW1lLCBkZWx0YVgsIGRlbHRhWSk7XG4gICAgICAgIHZlbG9jaXR5WCA9IHYueDtcbiAgICAgICAgdmVsb2NpdHlZID0gdi55O1xuICAgICAgICB2ZWxvY2l0eSA9IChhYnModi54KSA+IGFicyh2LnkpKSA/IHYueCA6IHYueTtcbiAgICAgICAgZGlyZWN0aW9uID0gZ2V0RGlyZWN0aW9uKGRlbHRhWCwgZGVsdGFZKTtcblxuICAgICAgICBzZXNzaW9uLmxhc3RJbnRlcnZhbCA9IGlucHV0O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHVzZSBsYXRlc3QgdmVsb2NpdHkgaW5mbyBpZiBpdCBkb2Vzbid0IG92ZXJ0YWtlIGEgbWluaW11bSBwZXJpb2RcbiAgICAgICAgdmVsb2NpdHkgPSBsYXN0LnZlbG9jaXR5O1xuICAgICAgICB2ZWxvY2l0eVggPSBsYXN0LnZlbG9jaXR5WDtcbiAgICAgICAgdmVsb2NpdHlZID0gbGFzdC52ZWxvY2l0eVk7XG4gICAgICAgIGRpcmVjdGlvbiA9IGxhc3QuZGlyZWN0aW9uO1xuICAgIH1cblxuICAgIGlucHV0LnZlbG9jaXR5ID0gdmVsb2NpdHk7XG4gICAgaW5wdXQudmVsb2NpdHlYID0gdmVsb2NpdHlYO1xuICAgIGlucHV0LnZlbG9jaXR5WSA9IHZlbG9jaXR5WTtcbiAgICBpbnB1dC5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG59XG5cbi8qKlxuICogY3JlYXRlIGEgc2ltcGxlIGNsb25lIGZyb20gdGhlIGlucHV0IHVzZWQgZm9yIHN0b3JhZ2Ugb2YgZmlyc3RJbnB1dCBhbmQgZmlyc3RNdWx0aXBsZVxuICogQHBhcmFtIHtPYmplY3R9IGlucHV0XG4gKiBAcmV0dXJucyB7T2JqZWN0fSBjbG9uZWRJbnB1dERhdGFcbiAqL1xuZnVuY3Rpb24gc2ltcGxlQ2xvbmVJbnB1dERhdGEoaW5wdXQpIHtcbiAgICAvLyBtYWtlIGEgc2ltcGxlIGNvcHkgb2YgdGhlIHBvaW50ZXJzIGJlY2F1c2Ugd2Ugd2lsbCBnZXQgYSByZWZlcmVuY2UgaWYgd2UgZG9uJ3RcbiAgICAvLyB3ZSBvbmx5IG5lZWQgY2xpZW50WFkgZm9yIHRoZSBjYWxjdWxhdGlvbnNcbiAgICB2YXIgcG9pbnRlcnMgPSBbXTtcbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBpbnB1dC5wb2ludGVycy5sZW5ndGgpIHtcbiAgICAgICAgcG9pbnRlcnNbaV0gPSB7XG4gICAgICAgICAgICBjbGllbnRYOiByb3VuZChpbnB1dC5wb2ludGVyc1tpXS5jbGllbnRYKSxcbiAgICAgICAgICAgIGNsaWVudFk6IHJvdW5kKGlucHV0LnBvaW50ZXJzW2ldLmNsaWVudFkpXG4gICAgICAgIH07XG4gICAgICAgIGkrKztcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB0aW1lU3RhbXA6IG5vdygpLFxuICAgICAgICBwb2ludGVyczogcG9pbnRlcnMsXG4gICAgICAgIGNlbnRlcjogZ2V0Q2VudGVyKHBvaW50ZXJzKSxcbiAgICAgICAgZGVsdGFYOiBpbnB1dC5kZWx0YVgsXG4gICAgICAgIGRlbHRhWTogaW5wdXQuZGVsdGFZXG4gICAgfTtcbn1cblxuLyoqXG4gKiBnZXQgdGhlIGNlbnRlciBvZiBhbGwgdGhlIHBvaW50ZXJzXG4gKiBAcGFyYW0ge0FycmF5fSBwb2ludGVyc1xuICogQHJldHVybiB7T2JqZWN0fSBjZW50ZXIgY29udGFpbnMgYHhgIGFuZCBgeWAgcHJvcGVydGllc1xuICovXG5mdW5jdGlvbiBnZXRDZW50ZXIocG9pbnRlcnMpIHtcbiAgICB2YXIgcG9pbnRlcnNMZW5ndGggPSBwb2ludGVycy5sZW5ndGg7XG5cbiAgICAvLyBubyBuZWVkIHRvIGxvb3Agd2hlbiBvbmx5IG9uZSB0b3VjaFxuICAgIGlmIChwb2ludGVyc0xlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogcm91bmQocG9pbnRlcnNbMF0uY2xpZW50WCksXG4gICAgICAgICAgICB5OiByb3VuZChwb2ludGVyc1swXS5jbGllbnRZKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciB4ID0gMCwgeSA9IDAsIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgcG9pbnRlcnNMZW5ndGgpIHtcbiAgICAgICAgeCArPSBwb2ludGVyc1tpXS5jbGllbnRYO1xuICAgICAgICB5ICs9IHBvaW50ZXJzW2ldLmNsaWVudFk7XG4gICAgICAgIGkrKztcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICB4OiByb3VuZCh4IC8gcG9pbnRlcnNMZW5ndGgpLFxuICAgICAgICB5OiByb3VuZCh5IC8gcG9pbnRlcnNMZW5ndGgpXG4gICAgfTtcbn1cblxuLyoqXG4gKiBjYWxjdWxhdGUgdGhlIHZlbG9jaXR5IGJldHdlZW4gdHdvIHBvaW50cy4gdW5pdCBpcyBpbiBweCBwZXIgbXMuXG4gKiBAcGFyYW0ge051bWJlcn0gZGVsdGFUaW1lXG4gKiBAcGFyYW0ge051bWJlcn0geFxuICogQHBhcmFtIHtOdW1iZXJ9IHlcbiAqIEByZXR1cm4ge09iamVjdH0gdmVsb2NpdHkgYHhgIGFuZCBgeWBcbiAqL1xuZnVuY3Rpb24gZ2V0VmVsb2NpdHkoZGVsdGFUaW1lLCB4LCB5KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgeDogeCAvIGRlbHRhVGltZSB8fCAwLFxuICAgICAgICB5OiB5IC8gZGVsdGFUaW1lIHx8IDBcbiAgICB9O1xufVxuXG4vKipcbiAqIGdldCB0aGUgZGlyZWN0aW9uIGJldHdlZW4gdHdvIHBvaW50c1xuICogQHBhcmFtIHtOdW1iZXJ9IHhcbiAqIEBwYXJhbSB7TnVtYmVyfSB5XG4gKiBAcmV0dXJuIHtOdW1iZXJ9IGRpcmVjdGlvblxuICovXG5mdW5jdGlvbiBnZXREaXJlY3Rpb24oeCwgeSkge1xuICAgIGlmICh4ID09PSB5KSB7XG4gICAgICAgIHJldHVybiBESVJFQ1RJT05fTk9ORTtcbiAgICB9XG5cbiAgICBpZiAoYWJzKHgpID49IGFicyh5KSkge1xuICAgICAgICByZXR1cm4geCA8IDAgPyBESVJFQ1RJT05fTEVGVCA6IERJUkVDVElPTl9SSUdIVDtcbiAgICB9XG4gICAgcmV0dXJuIHkgPCAwID8gRElSRUNUSU9OX1VQIDogRElSRUNUSU9OX0RPV047XG59XG5cbi8qKlxuICogY2FsY3VsYXRlIHRoZSBhYnNvbHV0ZSBkaXN0YW5jZSBiZXR3ZWVuIHR3byBwb2ludHNcbiAqIEBwYXJhbSB7T2JqZWN0fSBwMSB7eCwgeX1cbiAqIEBwYXJhbSB7T2JqZWN0fSBwMiB7eCwgeX1cbiAqIEBwYXJhbSB7QXJyYXl9IFtwcm9wc10gY29udGFpbmluZyB4IGFuZCB5IGtleXNcbiAqIEByZXR1cm4ge051bWJlcn0gZGlzdGFuY2VcbiAqL1xuZnVuY3Rpb24gZ2V0RGlzdGFuY2UocDEsIHAyLCBwcm9wcykge1xuICAgIGlmICghcHJvcHMpIHtcbiAgICAgICAgcHJvcHMgPSBQUk9QU19YWTtcbiAgICB9XG4gICAgdmFyIHggPSBwMltwcm9wc1swXV0gLSBwMVtwcm9wc1swXV0sXG4gICAgICAgIHkgPSBwMltwcm9wc1sxXV0gLSBwMVtwcm9wc1sxXV07XG5cbiAgICByZXR1cm4gTWF0aC5zcXJ0KCh4ICogeCkgKyAoeSAqIHkpKTtcbn1cblxuLyoqXG4gKiBjYWxjdWxhdGUgdGhlIGFuZ2xlIGJldHdlZW4gdHdvIGNvb3JkaW5hdGVzXG4gKiBAcGFyYW0ge09iamVjdH0gcDFcbiAqIEBwYXJhbSB7T2JqZWN0fSBwMlxuICogQHBhcmFtIHtBcnJheX0gW3Byb3BzXSBjb250YWluaW5nIHggYW5kIHkga2V5c1xuICogQHJldHVybiB7TnVtYmVyfSBhbmdsZVxuICovXG5mdW5jdGlvbiBnZXRBbmdsZShwMSwgcDIsIHByb3BzKSB7XG4gICAgaWYgKCFwcm9wcykge1xuICAgICAgICBwcm9wcyA9IFBST1BTX1hZO1xuICAgIH1cbiAgICB2YXIgeCA9IHAyW3Byb3BzWzBdXSAtIHAxW3Byb3BzWzBdXSxcbiAgICAgICAgeSA9IHAyW3Byb3BzWzFdXSAtIHAxW3Byb3BzWzFdXTtcbiAgICByZXR1cm4gTWF0aC5hdGFuMih5LCB4KSAqIDE4MCAvIE1hdGguUEk7XG59XG5cbi8qKlxuICogY2FsY3VsYXRlIHRoZSByb3RhdGlvbiBkZWdyZWVzIGJldHdlZW4gdHdvIHBvaW50ZXJzZXRzXG4gKiBAcGFyYW0ge0FycmF5fSBzdGFydCBhcnJheSBvZiBwb2ludGVyc1xuICogQHBhcmFtIHtBcnJheX0gZW5kIGFycmF5IG9mIHBvaW50ZXJzXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IHJvdGF0aW9uXG4gKi9cbmZ1bmN0aW9uIGdldFJvdGF0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gZ2V0QW5nbGUoZW5kWzFdLCBlbmRbMF0sIFBST1BTX0NMSUVOVF9YWSkgKyBnZXRBbmdsZShzdGFydFsxXSwgc3RhcnRbMF0sIFBST1BTX0NMSUVOVF9YWSk7XG59XG5cbi8qKlxuICogY2FsY3VsYXRlIHRoZSBzY2FsZSBmYWN0b3IgYmV0d2VlbiB0d28gcG9pbnRlcnNldHNcbiAqIG5vIHNjYWxlIGlzIDEsIGFuZCBnb2VzIGRvd24gdG8gMCB3aGVuIHBpbmNoZWQgdG9nZXRoZXIsIGFuZCBiaWdnZXIgd2hlbiBwaW5jaGVkIG91dFxuICogQHBhcmFtIHtBcnJheX0gc3RhcnQgYXJyYXkgb2YgcG9pbnRlcnNcbiAqIEBwYXJhbSB7QXJyYXl9IGVuZCBhcnJheSBvZiBwb2ludGVyc1xuICogQHJldHVybiB7TnVtYmVyfSBzY2FsZVxuICovXG5mdW5jdGlvbiBnZXRTY2FsZShzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIGdldERpc3RhbmNlKGVuZFswXSwgZW5kWzFdLCBQUk9QU19DTElFTlRfWFkpIC8gZ2V0RGlzdGFuY2Uoc3RhcnRbMF0sIHN0YXJ0WzFdLCBQUk9QU19DTElFTlRfWFkpO1xufVxuXG52YXIgTU9VU0VfSU5QVVRfTUFQID0ge1xuICAgIG1vdXNlZG93bjogSU5QVVRfU1RBUlQsXG4gICAgbW91c2Vtb3ZlOiBJTlBVVF9NT1ZFLFxuICAgIG1vdXNldXA6IElOUFVUX0VORFxufTtcblxudmFyIE1PVVNFX0VMRU1FTlRfRVZFTlRTID0gJ21vdXNlZG93bic7XG52YXIgTU9VU0VfV0lORE9XX0VWRU5UUyA9ICdtb3VzZW1vdmUgbW91c2V1cCc7XG5cbi8qKlxuICogTW91c2UgZXZlbnRzIGlucHV0XG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIElucHV0XG4gKi9cbmZ1bmN0aW9uIE1vdXNlSW5wdXQoKSB7XG4gICAgdGhpcy5ldkVsID0gTU9VU0VfRUxFTUVOVF9FVkVOVFM7XG4gICAgdGhpcy5ldldpbiA9IE1PVVNFX1dJTkRPV19FVkVOVFM7XG5cbiAgICB0aGlzLnByZXNzZWQgPSBmYWxzZTsgLy8gbW91c2Vkb3duIHN0YXRlXG5cbiAgICBJbnB1dC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5pbmhlcml0KE1vdXNlSW5wdXQsIElucHV0LCB7XG4gICAgLyoqXG4gICAgICogaGFuZGxlIG1vdXNlIGV2ZW50c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBldlxuICAgICAqL1xuICAgIGhhbmRsZXI6IGZ1bmN0aW9uIE1FaGFuZGxlcihldikge1xuICAgICAgICB2YXIgZXZlbnRUeXBlID0gTU9VU0VfSU5QVVRfTUFQW2V2LnR5cGVdO1xuXG4gICAgICAgIC8vIG9uIHN0YXJ0IHdlIHdhbnQgdG8gaGF2ZSB0aGUgbGVmdCBtb3VzZSBidXR0b24gZG93blxuICAgICAgICBpZiAoZXZlbnRUeXBlICYgSU5QVVRfU1RBUlQgJiYgZXYuYnV0dG9uID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnByZXNzZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGV2ZW50VHlwZSAmIElOUFVUX01PVkUgJiYgZXYud2hpY2ggIT09IDEpIHtcbiAgICAgICAgICAgIGV2ZW50VHlwZSA9IElOUFVUX0VORDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG1vdXNlIG11c3QgYmUgZG93blxuICAgICAgICBpZiAoIXRoaXMucHJlc3NlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGV2ZW50VHlwZSAmIElOUFVUX0VORCkge1xuICAgICAgICAgICAgdGhpcy5wcmVzc2VkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbGxiYWNrKHRoaXMubWFuYWdlciwgZXZlbnRUeXBlLCB7XG4gICAgICAgICAgICBwb2ludGVyczogW2V2XSxcbiAgICAgICAgICAgIGNoYW5nZWRQb2ludGVyczogW2V2XSxcbiAgICAgICAgICAgIHBvaW50ZXJUeXBlOiBJTlBVVF9UWVBFX01PVVNFLFxuICAgICAgICAgICAgc3JjRXZlbnQ6IGV2XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuXG52YXIgUE9JTlRFUl9JTlBVVF9NQVAgPSB7XG4gICAgcG9pbnRlcmRvd246IElOUFVUX1NUQVJULFxuICAgIHBvaW50ZXJtb3ZlOiBJTlBVVF9NT1ZFLFxuICAgIHBvaW50ZXJ1cDogSU5QVVRfRU5ELFxuICAgIHBvaW50ZXJjYW5jZWw6IElOUFVUX0NBTkNFTCxcbiAgICBwb2ludGVyb3V0OiBJTlBVVF9DQU5DRUxcbn07XG5cbi8vIGluIElFMTAgdGhlIHBvaW50ZXIgdHlwZXMgaXMgZGVmaW5lZCBhcyBhbiBlbnVtXG52YXIgSUUxMF9QT0lOVEVSX1RZUEVfRU5VTSA9IHtcbiAgICAyOiBJTlBVVF9UWVBFX1RPVUNILFxuICAgIDM6IElOUFVUX1RZUEVfUEVOLFxuICAgIDQ6IElOUFVUX1RZUEVfTU9VU0UsXG4gICAgNTogSU5QVVRfVFlQRV9LSU5FQ1QgLy8gc2VlIGh0dHBzOi8vdHdpdHRlci5jb20vamFjb2Jyb3NzaS9zdGF0dXMvNDgwNTk2NDM4NDg5ODkwODE2XG59O1xuXG52YXIgUE9JTlRFUl9FTEVNRU5UX0VWRU5UUyA9ICdwb2ludGVyZG93bic7XG52YXIgUE9JTlRFUl9XSU5ET1dfRVZFTlRTID0gJ3BvaW50ZXJtb3ZlIHBvaW50ZXJ1cCBwb2ludGVyY2FuY2VsJztcblxuLy8gSUUxMCBoYXMgcHJlZml4ZWQgc3VwcG9ydCwgYW5kIGNhc2Utc2Vuc2l0aXZlXG5pZiAod2luZG93Lk1TUG9pbnRlckV2ZW50ICYmICF3aW5kb3cuUG9pbnRlckV2ZW50KSB7XG4gICAgUE9JTlRFUl9FTEVNRU5UX0VWRU5UUyA9ICdNU1BvaW50ZXJEb3duJztcbiAgICBQT0lOVEVSX1dJTkRPV19FVkVOVFMgPSAnTVNQb2ludGVyTW92ZSBNU1BvaW50ZXJVcCBNU1BvaW50ZXJDYW5jZWwnO1xufVxuXG4vKipcbiAqIFBvaW50ZXIgZXZlbnRzIGlucHV0XG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIElucHV0XG4gKi9cbmZ1bmN0aW9uIFBvaW50ZXJFdmVudElucHV0KCkge1xuICAgIHRoaXMuZXZFbCA9IFBPSU5URVJfRUxFTUVOVF9FVkVOVFM7XG4gICAgdGhpcy5ldldpbiA9IFBPSU5URVJfV0lORE9XX0VWRU5UUztcblxuICAgIElucHV0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgICB0aGlzLnN0b3JlID0gKHRoaXMubWFuYWdlci5zZXNzaW9uLnBvaW50ZXJFdmVudHMgPSBbXSk7XG59XG5cbmluaGVyaXQoUG9pbnRlckV2ZW50SW5wdXQsIElucHV0LCB7XG4gICAgLyoqXG4gICAgICogaGFuZGxlIG1vdXNlIGV2ZW50c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBldlxuICAgICAqL1xuICAgIGhhbmRsZXI6IGZ1bmN0aW9uIFBFaGFuZGxlcihldikge1xuICAgICAgICB2YXIgc3RvcmUgPSB0aGlzLnN0b3JlO1xuICAgICAgICB2YXIgcmVtb3ZlUG9pbnRlciA9IGZhbHNlO1xuXG4gICAgICAgIHZhciBldmVudFR5cGVOb3JtYWxpemVkID0gZXYudHlwZS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJ21zJywgJycpO1xuICAgICAgICB2YXIgZXZlbnRUeXBlID0gUE9JTlRFUl9JTlBVVF9NQVBbZXZlbnRUeXBlTm9ybWFsaXplZF07XG4gICAgICAgIHZhciBwb2ludGVyVHlwZSA9IElFMTBfUE9JTlRFUl9UWVBFX0VOVU1bZXYucG9pbnRlclR5cGVdIHx8IGV2LnBvaW50ZXJUeXBlO1xuXG4gICAgICAgIHZhciBpc1RvdWNoID0gKHBvaW50ZXJUeXBlID09IElOUFVUX1RZUEVfVE9VQ0gpO1xuXG4gICAgICAgIC8vIGdldCBpbmRleCBvZiB0aGUgZXZlbnQgaW4gdGhlIHN0b3JlXG4gICAgICAgIHZhciBzdG9yZUluZGV4ID0gaW5BcnJheShzdG9yZSwgZXYucG9pbnRlcklkLCAncG9pbnRlcklkJyk7XG5cbiAgICAgICAgLy8gc3RhcnQgYW5kIG1vdXNlIG11c3QgYmUgZG93blxuICAgICAgICBpZiAoZXZlbnRUeXBlICYgSU5QVVRfU1RBUlQgJiYgKGV2LmJ1dHRvbiA9PT0gMCB8fCBpc1RvdWNoKSkge1xuICAgICAgICAgICAgaWYgKHN0b3JlSW5kZXggPCAwKSB7XG4gICAgICAgICAgICAgICAgc3RvcmUucHVzaChldik7XG4gICAgICAgICAgICAgICAgc3RvcmVJbmRleCA9IHN0b3JlLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnRUeXBlICYgKElOUFVUX0VORCB8IElOUFVUX0NBTkNFTCkpIHtcbiAgICAgICAgICAgIHJlbW92ZVBvaW50ZXIgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaXQgbm90IGZvdW5kLCBzbyB0aGUgcG9pbnRlciBoYXNuJ3QgYmVlbiBkb3duIChzbyBpdCdzIHByb2JhYmx5IGEgaG92ZXIpXG4gICAgICAgIGlmIChzdG9yZUluZGV4IDwgMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdXBkYXRlIHRoZSBldmVudCBpbiB0aGUgc3RvcmVcbiAgICAgICAgc3RvcmVbc3RvcmVJbmRleF0gPSBldjtcblxuICAgICAgICB0aGlzLmNhbGxiYWNrKHRoaXMubWFuYWdlciwgZXZlbnRUeXBlLCB7XG4gICAgICAgICAgICBwb2ludGVyczogc3RvcmUsXG4gICAgICAgICAgICBjaGFuZ2VkUG9pbnRlcnM6IFtldl0sXG4gICAgICAgICAgICBwb2ludGVyVHlwZTogcG9pbnRlclR5cGUsXG4gICAgICAgICAgICBzcmNFdmVudDogZXZcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHJlbW92ZVBvaW50ZXIpIHtcbiAgICAgICAgICAgIC8vIHJlbW92ZSBmcm9tIHRoZSBzdG9yZVxuICAgICAgICAgICAgc3RvcmUuc3BsaWNlKHN0b3JlSW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbnZhciBTSU5HTEVfVE9VQ0hfSU5QVVRfTUFQID0ge1xuICAgIHRvdWNoc3RhcnQ6IElOUFVUX1NUQVJULFxuICAgIHRvdWNobW92ZTogSU5QVVRfTU9WRSxcbiAgICB0b3VjaGVuZDogSU5QVVRfRU5ELFxuICAgIHRvdWNoY2FuY2VsOiBJTlBVVF9DQU5DRUxcbn07XG5cbnZhciBTSU5HTEVfVE9VQ0hfVEFSR0VUX0VWRU5UUyA9ICd0b3VjaHN0YXJ0JztcbnZhciBTSU5HTEVfVE9VQ0hfV0lORE9XX0VWRU5UUyA9ICd0b3VjaHN0YXJ0IHRvdWNobW92ZSB0b3VjaGVuZCB0b3VjaGNhbmNlbCc7XG5cbi8qKlxuICogVG91Y2ggZXZlbnRzIGlucHV0XG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIElucHV0XG4gKi9cbmZ1bmN0aW9uIFNpbmdsZVRvdWNoSW5wdXQoKSB7XG4gICAgdGhpcy5ldlRhcmdldCA9IFNJTkdMRV9UT1VDSF9UQVJHRVRfRVZFTlRTO1xuICAgIHRoaXMuZXZXaW4gPSBTSU5HTEVfVE9VQ0hfV0lORE9XX0VWRU5UUztcbiAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZTtcblxuICAgIElucHV0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5cbmluaGVyaXQoU2luZ2xlVG91Y2hJbnB1dCwgSW5wdXQsIHtcbiAgICBoYW5kbGVyOiBmdW5jdGlvbiBURWhhbmRsZXIoZXYpIHtcbiAgICAgICAgdmFyIHR5cGUgPSBTSU5HTEVfVE9VQ0hfSU5QVVRfTUFQW2V2LnR5cGVdO1xuXG4gICAgICAgIC8vIHNob3VsZCB3ZSBoYW5kbGUgdGhlIHRvdWNoIGV2ZW50cz9cbiAgICAgICAgaWYgKHR5cGUgPT09IElOUFVUX1NUQVJUKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0b3VjaGVzID0gbm9ybWFsaXplU2luZ2xlVG91Y2hlcy5jYWxsKHRoaXMsIGV2LCB0eXBlKTtcblxuICAgICAgICAvLyB3aGVuIGRvbmUsIHJlc2V0IHRoZSBzdGFydGVkIHN0YXRlXG4gICAgICAgIGlmICh0eXBlICYgKElOUFVUX0VORCB8IElOUFVUX0NBTkNFTCkgJiYgdG91Y2hlc1swXS5sZW5ndGggLSB0b3VjaGVzWzFdLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhbGxiYWNrKHRoaXMubWFuYWdlciwgdHlwZSwge1xuICAgICAgICAgICAgcG9pbnRlcnM6IHRvdWNoZXNbMF0sXG4gICAgICAgICAgICBjaGFuZ2VkUG9pbnRlcnM6IHRvdWNoZXNbMV0sXG4gICAgICAgICAgICBwb2ludGVyVHlwZTogSU5QVVRfVFlQRV9UT1VDSCxcbiAgICAgICAgICAgIHNyY0V2ZW50OiBldlxuICAgICAgICB9KTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiBAdGhpcyB7VG91Y2hJbnB1dH1cbiAqIEBwYXJhbSB7T2JqZWN0fSBldlxuICogQHBhcmFtIHtOdW1iZXJ9IHR5cGUgZmxhZ1xuICogQHJldHVybnMge3VuZGVmaW5lZHxBcnJheX0gW2FsbCwgY2hhbmdlZF1cbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplU2luZ2xlVG91Y2hlcyhldiwgdHlwZSkge1xuICAgIHZhciBhbGwgPSB0b0FycmF5KGV2LnRvdWNoZXMpO1xuICAgIHZhciBjaGFuZ2VkID0gdG9BcnJheShldi5jaGFuZ2VkVG91Y2hlcyk7XG5cbiAgICBpZiAodHlwZSAmIChJTlBVVF9FTkQgfCBJTlBVVF9DQU5DRUwpKSB7XG4gICAgICAgIGFsbCA9IHVuaXF1ZUFycmF5KGFsbC5jb25jYXQoY2hhbmdlZCksICdpZGVudGlmaWVyJywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFthbGwsIGNoYW5nZWRdO1xufVxuXG52YXIgVE9VQ0hfSU5QVVRfTUFQID0ge1xuICAgIHRvdWNoc3RhcnQ6IElOUFVUX1NUQVJULFxuICAgIHRvdWNobW92ZTogSU5QVVRfTU9WRSxcbiAgICB0b3VjaGVuZDogSU5QVVRfRU5ELFxuICAgIHRvdWNoY2FuY2VsOiBJTlBVVF9DQU5DRUxcbn07XG5cbnZhciBUT1VDSF9UQVJHRVRfRVZFTlRTID0gJ3RvdWNoc3RhcnQgdG91Y2htb3ZlIHRvdWNoZW5kIHRvdWNoY2FuY2VsJztcblxuLyoqXG4gKiBNdWx0aS11c2VyIHRvdWNoIGV2ZW50cyBpbnB1dFxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBJbnB1dFxuICovXG5mdW5jdGlvbiBUb3VjaElucHV0KCkge1xuICAgIHRoaXMuZXZUYXJnZXQgPSBUT1VDSF9UQVJHRVRfRVZFTlRTO1xuICAgIHRoaXMudGFyZ2V0SWRzID0ge307XG5cbiAgICBJbnB1dC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5pbmhlcml0KFRvdWNoSW5wdXQsIElucHV0LCB7XG4gICAgaGFuZGxlcjogZnVuY3Rpb24gTVRFaGFuZGxlcihldikge1xuICAgICAgICB2YXIgdHlwZSA9IFRPVUNIX0lOUFVUX01BUFtldi50eXBlXTtcbiAgICAgICAgdmFyIHRvdWNoZXMgPSBnZXRUb3VjaGVzLmNhbGwodGhpcywgZXYsIHR5cGUpO1xuICAgICAgICBpZiAoIXRvdWNoZXMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2FsbGJhY2sodGhpcy5tYW5hZ2VyLCB0eXBlLCB7XG4gICAgICAgICAgICBwb2ludGVyczogdG91Y2hlc1swXSxcbiAgICAgICAgICAgIGNoYW5nZWRQb2ludGVyczogdG91Y2hlc1sxXSxcbiAgICAgICAgICAgIHBvaW50ZXJUeXBlOiBJTlBVVF9UWVBFX1RPVUNILFxuICAgICAgICAgICAgc3JjRXZlbnQ6IGV2XG4gICAgICAgIH0pO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIEB0aGlzIHtUb3VjaElucHV0fVxuICogQHBhcmFtIHtPYmplY3R9IGV2XG4gKiBAcGFyYW0ge051bWJlcn0gdHlwZSBmbGFnXG4gKiBAcmV0dXJucyB7dW5kZWZpbmVkfEFycmF5fSBbYWxsLCBjaGFuZ2VkXVxuICovXG5mdW5jdGlvbiBnZXRUb3VjaGVzKGV2LCB0eXBlKSB7XG4gICAgdmFyIGFsbFRvdWNoZXMgPSB0b0FycmF5KGV2LnRvdWNoZXMpO1xuICAgIHZhciB0YXJnZXRJZHMgPSB0aGlzLnRhcmdldElkcztcblxuICAgIC8vIHdoZW4gdGhlcmUgaXMgb25seSBvbmUgdG91Y2gsIHRoZSBwcm9jZXNzIGNhbiBiZSBzaW1wbGlmaWVkXG4gICAgaWYgKHR5cGUgJiAoSU5QVVRfU1RBUlQgfCBJTlBVVF9NT1ZFKSAmJiBhbGxUb3VjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICB0YXJnZXRJZHNbYWxsVG91Y2hlc1swXS5pZGVudGlmaWVyXSA9IHRydWU7XG4gICAgICAgIHJldHVybiBbYWxsVG91Y2hlcywgYWxsVG91Y2hlc107XG4gICAgfVxuXG4gICAgdmFyIGksXG4gICAgICAgIHRhcmdldFRvdWNoZXMsXG4gICAgICAgIGNoYW5nZWRUb3VjaGVzID0gdG9BcnJheShldi5jaGFuZ2VkVG91Y2hlcyksXG4gICAgICAgIGNoYW5nZWRUYXJnZXRUb3VjaGVzID0gW10sXG4gICAgICAgIHRhcmdldCA9IHRoaXMudGFyZ2V0O1xuXG4gICAgLy8gZ2V0IHRhcmdldCB0b3VjaGVzIGZyb20gdG91Y2hlc1xuICAgIHRhcmdldFRvdWNoZXMgPSBhbGxUb3VjaGVzLmZpbHRlcihmdW5jdGlvbih0b3VjaCkge1xuICAgICAgICByZXR1cm4gaGFzUGFyZW50KHRvdWNoLnRhcmdldCwgdGFyZ2V0KTtcbiAgICB9KTtcblxuICAgIC8vIGNvbGxlY3QgdG91Y2hlc1xuICAgIGlmICh0eXBlID09PSBJTlBVVF9TVEFSVCkge1xuICAgICAgICBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCB0YXJnZXRUb3VjaGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGFyZ2V0SWRzW3RhcmdldFRvdWNoZXNbaV0uaWRlbnRpZmllcl0gPSB0cnVlO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gZmlsdGVyIGNoYW5nZWQgdG91Y2hlcyB0byBvbmx5IGNvbnRhaW4gdG91Y2hlcyB0aGF0IGV4aXN0IGluIHRoZSBjb2xsZWN0ZWQgdGFyZ2V0IGlkc1xuICAgIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgY2hhbmdlZFRvdWNoZXMubGVuZ3RoKSB7XG4gICAgICAgIGlmICh0YXJnZXRJZHNbY2hhbmdlZFRvdWNoZXNbaV0uaWRlbnRpZmllcl0pIHtcbiAgICAgICAgICAgIGNoYW5nZWRUYXJnZXRUb3VjaGVzLnB1c2goY2hhbmdlZFRvdWNoZXNbaV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2xlYW51cCByZW1vdmVkIHRvdWNoZXNcbiAgICAgICAgaWYgKHR5cGUgJiAoSU5QVVRfRU5EIHwgSU5QVVRfQ0FOQ0VMKSkge1xuICAgICAgICAgICAgZGVsZXRlIHRhcmdldElkc1tjaGFuZ2VkVG91Y2hlc1tpXS5pZGVudGlmaWVyXTtcbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgfVxuXG4gICAgaWYgKCFjaGFuZ2VkVGFyZ2V0VG91Y2hlcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiBbXG4gICAgICAgIC8vIG1lcmdlIHRhcmdldFRvdWNoZXMgd2l0aCBjaGFuZ2VkVGFyZ2V0VG91Y2hlcyBzbyBpdCBjb250YWlucyBBTEwgdG91Y2hlcywgaW5jbHVkaW5nICdlbmQnIGFuZCAnY2FuY2VsJ1xuICAgICAgICB1bmlxdWVBcnJheSh0YXJnZXRUb3VjaGVzLmNvbmNhdChjaGFuZ2VkVGFyZ2V0VG91Y2hlcyksICdpZGVudGlmaWVyJywgdHJ1ZSksXG4gICAgICAgIGNoYW5nZWRUYXJnZXRUb3VjaGVzXG4gICAgXTtcbn1cblxuLyoqXG4gKiBDb21iaW5lZCB0b3VjaCBhbmQgbW91c2UgaW5wdXRcbiAqXG4gKiBUb3VjaCBoYXMgYSBoaWdoZXIgcHJpb3JpdHkgdGhlbiBtb3VzZSwgYW5kIHdoaWxlIHRvdWNoaW5nIG5vIG1vdXNlIGV2ZW50cyBhcmUgYWxsb3dlZC5cbiAqIFRoaXMgYmVjYXVzZSB0b3VjaCBkZXZpY2VzIGFsc28gZW1pdCBtb3VzZSBldmVudHMgd2hpbGUgZG9pbmcgYSB0b3VjaC5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIElucHV0XG4gKi9cblxudmFyIERFRFVQX1RJTUVPVVQgPSAyNTAwO1xudmFyIERFRFVQX0RJU1RBTkNFID0gMjU7XG5cbmZ1bmN0aW9uIFRvdWNoTW91c2VJbnB1dCgpIHtcbiAgICBJbnB1dC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgdmFyIGhhbmRsZXIgPSBiaW5kRm4odGhpcy5oYW5kbGVyLCB0aGlzKTtcbiAgICB0aGlzLnRvdWNoID0gbmV3IFRvdWNoSW5wdXQodGhpcy5tYW5hZ2VyLCBoYW5kbGVyKTtcbiAgICB0aGlzLm1vdXNlID0gbmV3IE1vdXNlSW5wdXQodGhpcy5tYW5hZ2VyLCBoYW5kbGVyKTtcblxuICAgIHRoaXMucHJpbWFyeVRvdWNoID0gbnVsbDtcbiAgICB0aGlzLmxhc3RUb3VjaGVzID0gW107XG59XG5cbmluaGVyaXQoVG91Y2hNb3VzZUlucHV0LCBJbnB1dCwge1xuICAgIC8qKlxuICAgICAqIGhhbmRsZSBtb3VzZSBhbmQgdG91Y2ggZXZlbnRzXG4gICAgICogQHBhcmFtIHtIYW1tZXJ9IG1hbmFnZXJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gaW5wdXRFdmVudFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dERhdGFcbiAgICAgKi9cbiAgICBoYW5kbGVyOiBmdW5jdGlvbiBUTUVoYW5kbGVyKG1hbmFnZXIsIGlucHV0RXZlbnQsIGlucHV0RGF0YSkge1xuICAgICAgICB2YXIgaXNUb3VjaCA9IChpbnB1dERhdGEucG9pbnRlclR5cGUgPT0gSU5QVVRfVFlQRV9UT1VDSCksXG4gICAgICAgICAgICBpc01vdXNlID0gKGlucHV0RGF0YS5wb2ludGVyVHlwZSA9PSBJTlBVVF9UWVBFX01PVVNFKTtcblxuICAgICAgICBpZiAoaXNNb3VzZSAmJiBpbnB1dERhdGEuc291cmNlQ2FwYWJpbGl0aWVzICYmIGlucHV0RGF0YS5zb3VyY2VDYXBhYmlsaXRpZXMuZmlyZXNUb3VjaEV2ZW50cykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2hlbiB3ZSdyZSBpbiBhIHRvdWNoIGV2ZW50LCByZWNvcmQgdG91Y2hlcyB0byAgZGUtZHVwZSBzeW50aGV0aWMgbW91c2UgZXZlbnRcbiAgICAgICAgaWYgKGlzVG91Y2gpIHtcbiAgICAgICAgICAgIHJlY29yZFRvdWNoZXMuY2FsbCh0aGlzLCBpbnB1dEV2ZW50LCBpbnB1dERhdGEpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzTW91c2UgJiYgaXNTeW50aGV0aWNFdmVudC5jYWxsKHRoaXMsIGlucHV0RGF0YSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2FsbGJhY2sobWFuYWdlciwgaW5wdXRFdmVudCwgaW5wdXREYXRhKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogcmVtb3ZlIHRoZSBldmVudCBsaXN0ZW5lcnNcbiAgICAgKi9cbiAgICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLnRvdWNoLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5tb3VzZS5kZXN0cm95KCk7XG4gICAgfVxufSk7XG5cbmZ1bmN0aW9uIHJlY29yZFRvdWNoZXMoZXZlbnRUeXBlLCBldmVudERhdGEpIHtcbiAgICBpZiAoZXZlbnRUeXBlICYgSU5QVVRfU1RBUlQpIHtcbiAgICAgICAgdGhpcy5wcmltYXJ5VG91Y2ggPSBldmVudERhdGEuY2hhbmdlZFBvaW50ZXJzWzBdLmlkZW50aWZpZXI7XG4gICAgICAgIHNldExhc3RUb3VjaC5jYWxsKHRoaXMsIGV2ZW50RGF0YSk7XG4gICAgfSBlbHNlIGlmIChldmVudFR5cGUgJiAoSU5QVVRfRU5EIHwgSU5QVVRfQ0FOQ0VMKSkge1xuICAgICAgICBzZXRMYXN0VG91Y2guY2FsbCh0aGlzLCBldmVudERhdGEpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc2V0TGFzdFRvdWNoKGV2ZW50RGF0YSkge1xuICAgIHZhciB0b3VjaCA9IGV2ZW50RGF0YS5jaGFuZ2VkUG9pbnRlcnNbMF07XG5cbiAgICBpZiAodG91Y2guaWRlbnRpZmllciA9PT0gdGhpcy5wcmltYXJ5VG91Y2gpIHtcbiAgICAgICAgdmFyIGxhc3RUb3VjaCA9IHt4OiB0b3VjaC5jbGllbnRYLCB5OiB0b3VjaC5jbGllbnRZfTtcbiAgICAgICAgdGhpcy5sYXN0VG91Y2hlcy5wdXNoKGxhc3RUb3VjaCk7XG4gICAgICAgIHZhciBsdHMgPSB0aGlzLmxhc3RUb3VjaGVzO1xuICAgICAgICB2YXIgcmVtb3ZlTGFzdFRvdWNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgaSA9IGx0cy5pbmRleE9mKGxhc3RUb3VjaCk7XG4gICAgICAgICAgICBpZiAoaSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgbHRzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgc2V0VGltZW91dChyZW1vdmVMYXN0VG91Y2gsIERFRFVQX1RJTUVPVVQpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaXNTeW50aGV0aWNFdmVudChldmVudERhdGEpIHtcbiAgICB2YXIgeCA9IGV2ZW50RGF0YS5zcmNFdmVudC5jbGllbnRYLCB5ID0gZXZlbnREYXRhLnNyY0V2ZW50LmNsaWVudFk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxhc3RUb3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciB0ID0gdGhpcy5sYXN0VG91Y2hlc1tpXTtcbiAgICAgICAgdmFyIGR4ID0gTWF0aC5hYnMoeCAtIHQueCksIGR5ID0gTWF0aC5hYnMoeSAtIHQueSk7XG4gICAgICAgIGlmIChkeCA8PSBERURVUF9ESVNUQU5DRSAmJiBkeSA8PSBERURVUF9ESVNUQU5DRSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG52YXIgUFJFRklYRURfVE9VQ0hfQUNUSU9OID0gcHJlZml4ZWQoVEVTVF9FTEVNRU5ULnN0eWxlLCAndG91Y2hBY3Rpb24nKTtcbnZhciBOQVRJVkVfVE9VQ0hfQUNUSU9OID0gUFJFRklYRURfVE9VQ0hfQUNUSU9OICE9PSB1bmRlZmluZWQ7XG5cbi8vIG1hZ2ljYWwgdG91Y2hBY3Rpb24gdmFsdWVcbnZhciBUT1VDSF9BQ1RJT05fQ09NUFVURSA9ICdjb21wdXRlJztcbnZhciBUT1VDSF9BQ1RJT05fQVVUTyA9ICdhdXRvJztcbnZhciBUT1VDSF9BQ1RJT05fTUFOSVBVTEFUSU9OID0gJ21hbmlwdWxhdGlvbic7IC8vIG5vdCBpbXBsZW1lbnRlZFxudmFyIFRPVUNIX0FDVElPTl9OT05FID0gJ25vbmUnO1xudmFyIFRPVUNIX0FDVElPTl9QQU5fWCA9ICdwYW4teCc7XG52YXIgVE9VQ0hfQUNUSU9OX1BBTl9ZID0gJ3Bhbi15JztcbnZhciBUT1VDSF9BQ1RJT05fTUFQID0gZ2V0VG91Y2hBY3Rpb25Qcm9wcygpO1xuXG4vKipcbiAqIFRvdWNoIEFjdGlvblxuICogc2V0cyB0aGUgdG91Y2hBY3Rpb24gcHJvcGVydHkgb3IgdXNlcyB0aGUganMgYWx0ZXJuYXRpdmVcbiAqIEBwYXJhbSB7TWFuYWdlcn0gbWFuYWdlclxuICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gVG91Y2hBY3Rpb24obWFuYWdlciwgdmFsdWUpIHtcbiAgICB0aGlzLm1hbmFnZXIgPSBtYW5hZ2VyO1xuICAgIHRoaXMuc2V0KHZhbHVlKTtcbn1cblxuVG91Y2hBY3Rpb24ucHJvdG90eXBlID0ge1xuICAgIC8qKlxuICAgICAqIHNldCB0aGUgdG91Y2hBY3Rpb24gdmFsdWUgb24gdGhlIGVsZW1lbnQgb3IgZW5hYmxlIHRoZSBwb2x5ZmlsbFxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxuICAgICAqL1xuICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgLy8gZmluZCBvdXQgdGhlIHRvdWNoLWFjdGlvbiBieSB0aGUgZXZlbnQgaGFuZGxlcnNcbiAgICAgICAgaWYgKHZhbHVlID09IFRPVUNIX0FDVElPTl9DT01QVVRFKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHRoaXMuY29tcHV0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKE5BVElWRV9UT1VDSF9BQ1RJT04gJiYgdGhpcy5tYW5hZ2VyLmVsZW1lbnQuc3R5bGUgJiYgVE9VQ0hfQUNUSU9OX01BUFt2YWx1ZV0pIHtcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5lbGVtZW50LnN0eWxlW1BSRUZJWEVEX1RPVUNIX0FDVElPTl0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFjdGlvbnMgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICoganVzdCByZS1zZXQgdGhlIHRvdWNoQWN0aW9uIHZhbHVlXG4gICAgICovXG4gICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zZXQodGhpcy5tYW5hZ2VyLm9wdGlvbnMudG91Y2hBY3Rpb24pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBjb21wdXRlIHRoZSB2YWx1ZSBmb3IgdGhlIHRvdWNoQWN0aW9uIHByb3BlcnR5IGJhc2VkIG9uIHRoZSByZWNvZ25pemVyJ3Mgc2V0dGluZ3NcbiAgICAgKiBAcmV0dXJucyB7U3RyaW5nfSB2YWx1ZVxuICAgICAqL1xuICAgIGNvbXB1dGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYWN0aW9ucyA9IFtdO1xuICAgICAgICBlYWNoKHRoaXMubWFuYWdlci5yZWNvZ25pemVycywgZnVuY3Rpb24ocmVjb2duaXplcikge1xuICAgICAgICAgICAgaWYgKGJvb2xPckZuKHJlY29nbml6ZXIub3B0aW9ucy5lbmFibGUsIFtyZWNvZ25pemVyXSkpIHtcbiAgICAgICAgICAgICAgICBhY3Rpb25zID0gYWN0aW9ucy5jb25jYXQocmVjb2duaXplci5nZXRUb3VjaEFjdGlvbigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjbGVhblRvdWNoQWN0aW9ucyhhY3Rpb25zLmpvaW4oJyAnKSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHRoaXMgbWV0aG9kIGlzIGNhbGxlZCBvbiBlYWNoIGlucHV0IGN5Y2xlIGFuZCBwcm92aWRlcyB0aGUgcHJldmVudGluZyBvZiB0aGUgYnJvd3NlciBiZWhhdmlvclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICAgICAqL1xuICAgIHByZXZlbnREZWZhdWx0czogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgdmFyIHNyY0V2ZW50ID0gaW5wdXQuc3JjRXZlbnQ7XG4gICAgICAgIHZhciBkaXJlY3Rpb24gPSBpbnB1dC5vZmZzZXREaXJlY3Rpb247XG5cbiAgICAgICAgLy8gaWYgdGhlIHRvdWNoIGFjdGlvbiBkaWQgcHJldmVudGVkIG9uY2UgdGhpcyBzZXNzaW9uXG4gICAgICAgIGlmICh0aGlzLm1hbmFnZXIuc2Vzc2lvbi5wcmV2ZW50ZWQpIHtcbiAgICAgICAgICAgIHNyY0V2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYWN0aW9ucyA9IHRoaXMuYWN0aW9ucztcbiAgICAgICAgdmFyIGhhc05vbmUgPSBpblN0cihhY3Rpb25zLCBUT1VDSF9BQ1RJT05fTk9ORSkgJiYgIVRPVUNIX0FDVElPTl9NQVBbVE9VQ0hfQUNUSU9OX05PTkVdO1xuICAgICAgICB2YXIgaGFzUGFuWSA9IGluU3RyKGFjdGlvbnMsIFRPVUNIX0FDVElPTl9QQU5fWSkgJiYgIVRPVUNIX0FDVElPTl9NQVBbVE9VQ0hfQUNUSU9OX1BBTl9ZXTtcbiAgICAgICAgdmFyIGhhc1BhblggPSBpblN0cihhY3Rpb25zLCBUT1VDSF9BQ1RJT05fUEFOX1gpICYmICFUT1VDSF9BQ1RJT05fTUFQW1RPVUNIX0FDVElPTl9QQU5fWF07XG5cbiAgICAgICAgaWYgKGhhc05vbmUpIHtcbiAgICAgICAgICAgIC8vZG8gbm90IHByZXZlbnQgZGVmYXVsdHMgaWYgdGhpcyBpcyBhIHRhcCBnZXN0dXJlXG5cbiAgICAgICAgICAgIHZhciBpc1RhcFBvaW50ZXIgPSBpbnB1dC5wb2ludGVycy5sZW5ndGggPT09IDE7XG4gICAgICAgICAgICB2YXIgaXNUYXBNb3ZlbWVudCA9IGlucHV0LmRpc3RhbmNlIDwgMjtcbiAgICAgICAgICAgIHZhciBpc1RhcFRvdWNoVGltZSA9IGlucHV0LmRlbHRhVGltZSA8IDI1MDtcblxuICAgICAgICAgICAgaWYgKGlzVGFwUG9pbnRlciAmJiBpc1RhcE1vdmVtZW50ICYmIGlzVGFwVG91Y2hUaW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc1BhblggJiYgaGFzUGFuWSkge1xuICAgICAgICAgICAgLy8gYHBhbi14IHBhbi15YCBtZWFucyBicm93c2VyIGhhbmRsZXMgYWxsIHNjcm9sbGluZy9wYW5uaW5nLCBkbyBub3QgcHJldmVudFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhhc05vbmUgfHxcbiAgICAgICAgICAgIChoYXNQYW5ZICYmIGRpcmVjdGlvbiAmIERJUkVDVElPTl9IT1JJWk9OVEFMKSB8fFxuICAgICAgICAgICAgKGhhc1BhblggJiYgZGlyZWN0aW9uICYgRElSRUNUSU9OX1ZFUlRJQ0FMKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJldmVudFNyYyhzcmNFdmVudCk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogY2FsbCBwcmV2ZW50RGVmYXVsdCB0byBwcmV2ZW50IHRoZSBicm93c2VyJ3MgZGVmYXVsdCBiZWhhdmlvciAoc2Nyb2xsaW5nIGluIG1vc3QgY2FzZXMpXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHNyY0V2ZW50XG4gICAgICovXG4gICAgcHJldmVudFNyYzogZnVuY3Rpb24oc3JjRXZlbnQpIHtcbiAgICAgICAgdGhpcy5tYW5hZ2VyLnNlc3Npb24ucHJldmVudGVkID0gdHJ1ZTtcbiAgICAgICAgc3JjRXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIHdoZW4gdGhlIHRvdWNoQWN0aW9ucyBhcmUgY29sbGVjdGVkIHRoZXkgYXJlIG5vdCBhIHZhbGlkIHZhbHVlLCBzbyB3ZSBuZWVkIHRvIGNsZWFuIHRoaW5ncyB1cC4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFjdGlvbnNcbiAqIEByZXR1cm5zIHsqfVxuICovXG5mdW5jdGlvbiBjbGVhblRvdWNoQWN0aW9ucyhhY3Rpb25zKSB7XG4gICAgLy8gbm9uZVxuICAgIGlmIChpblN0cihhY3Rpb25zLCBUT1VDSF9BQ1RJT05fTk9ORSkpIHtcbiAgICAgICAgcmV0dXJuIFRPVUNIX0FDVElPTl9OT05FO1xuICAgIH1cblxuICAgIHZhciBoYXNQYW5YID0gaW5TdHIoYWN0aW9ucywgVE9VQ0hfQUNUSU9OX1BBTl9YKTtcbiAgICB2YXIgaGFzUGFuWSA9IGluU3RyKGFjdGlvbnMsIFRPVUNIX0FDVElPTl9QQU5fWSk7XG5cbiAgICAvLyBpZiBib3RoIHBhbi14IGFuZCBwYW4teSBhcmUgc2V0IChkaWZmZXJlbnQgcmVjb2duaXplcnNcbiAgICAvLyBmb3IgZGlmZmVyZW50IGRpcmVjdGlvbnMsIGUuZy4gaG9yaXpvbnRhbCBwYW4gYnV0IHZlcnRpY2FsIHN3aXBlPylcbiAgICAvLyB3ZSBuZWVkIG5vbmUgKGFzIG90aGVyd2lzZSB3aXRoIHBhbi14IHBhbi15IGNvbWJpbmVkIG5vbmUgb2YgdGhlc2VcbiAgICAvLyByZWNvZ25pemVycyB3aWxsIHdvcmssIHNpbmNlIHRoZSBicm93c2VyIHdvdWxkIGhhbmRsZSBhbGwgcGFubmluZ1xuICAgIGlmIChoYXNQYW5YICYmIGhhc1BhblkpIHtcbiAgICAgICAgcmV0dXJuIFRPVUNIX0FDVElPTl9OT05FO1xuICAgIH1cblxuICAgIC8vIHBhbi14IE9SIHBhbi15XG4gICAgaWYgKGhhc1BhblggfHwgaGFzUGFuWSkge1xuICAgICAgICByZXR1cm4gaGFzUGFuWCA/IFRPVUNIX0FDVElPTl9QQU5fWCA6IFRPVUNIX0FDVElPTl9QQU5fWTtcbiAgICB9XG5cbiAgICAvLyBtYW5pcHVsYXRpb25cbiAgICBpZiAoaW5TdHIoYWN0aW9ucywgVE9VQ0hfQUNUSU9OX01BTklQVUxBVElPTikpIHtcbiAgICAgICAgcmV0dXJuIFRPVUNIX0FDVElPTl9NQU5JUFVMQVRJT047XG4gICAgfVxuXG4gICAgcmV0dXJuIFRPVUNIX0FDVElPTl9BVVRPO1xufVxuXG5mdW5jdGlvbiBnZXRUb3VjaEFjdGlvblByb3BzKCkge1xuICAgIGlmICghTkFUSVZFX1RPVUNIX0FDVElPTikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciB0b3VjaE1hcCA9IHt9O1xuICAgIHZhciBjc3NTdXBwb3J0cyA9IHdpbmRvdy5DU1MgJiYgd2luZG93LkNTUy5zdXBwb3J0cztcbiAgICBbJ2F1dG8nLCAnbWFuaXB1bGF0aW9uJywgJ3Bhbi15JywgJ3Bhbi14JywgJ3Bhbi14IHBhbi15JywgJ25vbmUnXS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCkge1xuXG4gICAgICAgIC8vIElmIGNzcy5zdXBwb3J0cyBpcyBub3Qgc3VwcG9ydGVkIGJ1dCB0aGVyZSBpcyBuYXRpdmUgdG91Y2gtYWN0aW9uIGFzc3VtZSBpdCBzdXBwb3J0c1xuICAgICAgICAvLyBhbGwgdmFsdWVzLiBUaGlzIGlzIHRoZSBjYXNlIGZvciBJRSAxMCBhbmQgMTEuXG4gICAgICAgIHRvdWNoTWFwW3ZhbF0gPSBjc3NTdXBwb3J0cyA/IHdpbmRvdy5DU1Muc3VwcG9ydHMoJ3RvdWNoLWFjdGlvbicsIHZhbCkgOiB0cnVlO1xuICAgIH0pO1xuICAgIHJldHVybiB0b3VjaE1hcDtcbn1cblxuLyoqXG4gKiBSZWNvZ25pemVyIGZsb3cgZXhwbGFpbmVkOyAqXG4gKiBBbGwgcmVjb2duaXplcnMgaGF2ZSB0aGUgaW5pdGlhbCBzdGF0ZSBvZiBQT1NTSUJMRSB3aGVuIGEgaW5wdXQgc2Vzc2lvbiBzdGFydHMuXG4gKiBUaGUgZGVmaW5pdGlvbiBvZiBhIGlucHV0IHNlc3Npb24gaXMgZnJvbSB0aGUgZmlyc3QgaW5wdXQgdW50aWwgdGhlIGxhc3QgaW5wdXQsIHdpdGggYWxsIGl0J3MgbW92ZW1lbnQgaW4gaXQuICpcbiAqIEV4YW1wbGUgc2Vzc2lvbiBmb3IgbW91c2UtaW5wdXQ6IG1vdXNlZG93biAtPiBtb3VzZW1vdmUgLT4gbW91c2V1cFxuICpcbiAqIE9uIGVhY2ggcmVjb2duaXppbmcgY3ljbGUgKHNlZSBNYW5hZ2VyLnJlY29nbml6ZSkgdGhlIC5yZWNvZ25pemUoKSBtZXRob2QgaXMgZXhlY3V0ZWRcbiAqIHdoaWNoIGRldGVybWluZXMgd2l0aCBzdGF0ZSBpdCBzaG91bGQgYmUuXG4gKlxuICogSWYgdGhlIHJlY29nbml6ZXIgaGFzIHRoZSBzdGF0ZSBGQUlMRUQsIENBTkNFTExFRCBvciBSRUNPR05JWkVEIChlcXVhbHMgRU5ERUQpLCBpdCBpcyByZXNldCB0b1xuICogUE9TU0lCTEUgdG8gZ2l2ZSBpdCBhbm90aGVyIGNoYW5nZSBvbiB0aGUgbmV4dCBjeWNsZS5cbiAqXG4gKiAgICAgICAgICAgICAgIFBvc3NpYmxlXG4gKiAgICAgICAgICAgICAgICAgIHxcbiAqICAgICAgICAgICAgKy0tLS0tKy0tLS0tLS0tLS0tLS0tLStcbiAqICAgICAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgIHxcbiAqICAgICAgKy0tLS0tKy0tLS0tKyAgICAgICAgICAgICAgIHxcbiAqICAgICAgfCAgICAgICAgICAgfCAgICAgICAgICAgICAgIHxcbiAqICAgRmFpbGVkICAgICAgQ2FuY2VsbGVkICAgICAgICAgIHxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICArLS0tLS0tLSstLS0tLS0rXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgfCAgICAgICAgICAgICAgfFxuICogICAgICAgICAgICAgICAgICAgICAgUmVjb2duaXplZCAgICAgICBCZWdhblxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDaGFuZ2VkXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRW5kZWQvUmVjb2duaXplZFxuICovXG52YXIgU1RBVEVfUE9TU0lCTEUgPSAxO1xudmFyIFNUQVRFX0JFR0FOID0gMjtcbnZhciBTVEFURV9DSEFOR0VEID0gNDtcbnZhciBTVEFURV9FTkRFRCA9IDg7XG52YXIgU1RBVEVfUkVDT0dOSVpFRCA9IFNUQVRFX0VOREVEO1xudmFyIFNUQVRFX0NBTkNFTExFRCA9IDE2O1xudmFyIFNUQVRFX0ZBSUxFRCA9IDMyO1xuXG4vKipcbiAqIFJlY29nbml6ZXJcbiAqIEV2ZXJ5IHJlY29nbml6ZXIgbmVlZHMgdG8gZXh0ZW5kIGZyb20gdGhpcyBjbGFzcy5cbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqL1xuZnVuY3Rpb24gUmVjb2duaXplcihvcHRpb25zKSB7XG4gICAgdGhpcy5vcHRpb25zID0gYXNzaWduKHt9LCB0aGlzLmRlZmF1bHRzLCBvcHRpb25zIHx8IHt9KTtcblxuICAgIHRoaXMuaWQgPSB1bmlxdWVJZCgpO1xuXG4gICAgdGhpcy5tYW5hZ2VyID0gbnVsbDtcblxuICAgIC8vIGRlZmF1bHQgaXMgZW5hYmxlIHRydWVcbiAgICB0aGlzLm9wdGlvbnMuZW5hYmxlID0gaWZVbmRlZmluZWQodGhpcy5vcHRpb25zLmVuYWJsZSwgdHJ1ZSk7XG5cbiAgICB0aGlzLnN0YXRlID0gU1RBVEVfUE9TU0lCTEU7XG5cbiAgICB0aGlzLnNpbXVsdGFuZW91cyA9IHt9O1xuICAgIHRoaXMucmVxdWlyZUZhaWwgPSBbXTtcbn1cblxuUmVjb2duaXplci5wcm90b3R5cGUgPSB7XG4gICAgLyoqXG4gICAgICogQHZpcnR1YWxcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIGRlZmF1bHRzOiB7fSxcblxuICAgIC8qKlxuICAgICAqIHNldCBvcHRpb25zXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICAgKiBAcmV0dXJuIHtSZWNvZ25pemVyfVxuICAgICAqL1xuICAgIHNldDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICBhc3NpZ24odGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgICAgICAvLyBhbHNvIHVwZGF0ZSB0aGUgdG91Y2hBY3Rpb24sIGluIGNhc2Ugc29tZXRoaW5nIGNoYW5nZWQgYWJvdXQgdGhlIGRpcmVjdGlvbnMvZW5hYmxlZCBzdGF0ZVxuICAgICAgICB0aGlzLm1hbmFnZXIgJiYgdGhpcy5tYW5hZ2VyLnRvdWNoQWN0aW9uLnVwZGF0ZSgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogcmVjb2duaXplIHNpbXVsdGFuZW91cyB3aXRoIGFuIG90aGVyIHJlY29nbml6ZXIuXG4gICAgICogQHBhcmFtIHtSZWNvZ25pemVyfSBvdGhlclJlY29nbml6ZXJcbiAgICAgKiBAcmV0dXJucyB7UmVjb2duaXplcn0gdGhpc1xuICAgICAqL1xuICAgIHJlY29nbml6ZVdpdGg6IGZ1bmN0aW9uKG90aGVyUmVjb2duaXplcikge1xuICAgICAgICBpZiAoaW52b2tlQXJyYXlBcmcob3RoZXJSZWNvZ25pemVyLCAncmVjb2duaXplV2l0aCcsIHRoaXMpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzaW11bHRhbmVvdXMgPSB0aGlzLnNpbXVsdGFuZW91cztcbiAgICAgICAgb3RoZXJSZWNvZ25pemVyID0gZ2V0UmVjb2duaXplckJ5TmFtZUlmTWFuYWdlcihvdGhlclJlY29nbml6ZXIsIHRoaXMpO1xuICAgICAgICBpZiAoIXNpbXVsdGFuZW91c1tvdGhlclJlY29nbml6ZXIuaWRdKSB7XG4gICAgICAgICAgICBzaW11bHRhbmVvdXNbb3RoZXJSZWNvZ25pemVyLmlkXSA9IG90aGVyUmVjb2duaXplcjtcbiAgICAgICAgICAgIG90aGVyUmVjb2duaXplci5yZWNvZ25pemVXaXRoKHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBkcm9wIHRoZSBzaW11bHRhbmVvdXMgbGluay4gaXQgZG9lc250IHJlbW92ZSB0aGUgbGluayBvbiB0aGUgb3RoZXIgcmVjb2duaXplci5cbiAgICAgKiBAcGFyYW0ge1JlY29nbml6ZXJ9IG90aGVyUmVjb2duaXplclxuICAgICAqIEByZXR1cm5zIHtSZWNvZ25pemVyfSB0aGlzXG4gICAgICovXG4gICAgZHJvcFJlY29nbml6ZVdpdGg6IGZ1bmN0aW9uKG90aGVyUmVjb2duaXplcikge1xuICAgICAgICBpZiAoaW52b2tlQXJyYXlBcmcob3RoZXJSZWNvZ25pemVyLCAnZHJvcFJlY29nbml6ZVdpdGgnLCB0aGlzKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBvdGhlclJlY29nbml6ZXIgPSBnZXRSZWNvZ25pemVyQnlOYW1lSWZNYW5hZ2VyKG90aGVyUmVjb2duaXplciwgdGhpcyk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLnNpbXVsdGFuZW91c1tvdGhlclJlY29nbml6ZXIuaWRdO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogcmVjb2duaXplciBjYW4gb25seSBydW4gd2hlbiBhbiBvdGhlciBpcyBmYWlsaW5nXG4gICAgICogQHBhcmFtIHtSZWNvZ25pemVyfSBvdGhlclJlY29nbml6ZXJcbiAgICAgKiBAcmV0dXJucyB7UmVjb2duaXplcn0gdGhpc1xuICAgICAqL1xuICAgIHJlcXVpcmVGYWlsdXJlOiBmdW5jdGlvbihvdGhlclJlY29nbml6ZXIpIHtcbiAgICAgICAgaWYgKGludm9rZUFycmF5QXJnKG90aGVyUmVjb2duaXplciwgJ3JlcXVpcmVGYWlsdXJlJywgdGhpcykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJlcXVpcmVGYWlsID0gdGhpcy5yZXF1aXJlRmFpbDtcbiAgICAgICAgb3RoZXJSZWNvZ25pemVyID0gZ2V0UmVjb2duaXplckJ5TmFtZUlmTWFuYWdlcihvdGhlclJlY29nbml6ZXIsIHRoaXMpO1xuICAgICAgICBpZiAoaW5BcnJheShyZXF1aXJlRmFpbCwgb3RoZXJSZWNvZ25pemVyKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHJlcXVpcmVGYWlsLnB1c2gob3RoZXJSZWNvZ25pemVyKTtcbiAgICAgICAgICAgIG90aGVyUmVjb2duaXplci5yZXF1aXJlRmFpbHVyZSh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogZHJvcCB0aGUgcmVxdWlyZUZhaWx1cmUgbGluay4gaXQgZG9lcyBub3QgcmVtb3ZlIHRoZSBsaW5rIG9uIHRoZSBvdGhlciByZWNvZ25pemVyLlxuICAgICAqIEBwYXJhbSB7UmVjb2duaXplcn0gb3RoZXJSZWNvZ25pemVyXG4gICAgICogQHJldHVybnMge1JlY29nbml6ZXJ9IHRoaXNcbiAgICAgKi9cbiAgICBkcm9wUmVxdWlyZUZhaWx1cmU6IGZ1bmN0aW9uKG90aGVyUmVjb2duaXplcikge1xuICAgICAgICBpZiAoaW52b2tlQXJyYXlBcmcob3RoZXJSZWNvZ25pemVyLCAnZHJvcFJlcXVpcmVGYWlsdXJlJywgdGhpcykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgb3RoZXJSZWNvZ25pemVyID0gZ2V0UmVjb2duaXplckJ5TmFtZUlmTWFuYWdlcihvdGhlclJlY29nbml6ZXIsIHRoaXMpO1xuICAgICAgICB2YXIgaW5kZXggPSBpbkFycmF5KHRoaXMucmVxdWlyZUZhaWwsIG90aGVyUmVjb2duaXplcik7XG4gICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICB0aGlzLnJlcXVpcmVGYWlsLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGhhcyByZXF1aXJlIGZhaWx1cmVzIGJvb2xlYW5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBoYXNSZXF1aXJlRmFpbHVyZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1aXJlRmFpbC5sZW5ndGggPiAwO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBpZiB0aGUgcmVjb2duaXplciBjYW4gcmVjb2duaXplIHNpbXVsdGFuZW91cyB3aXRoIGFuIG90aGVyIHJlY29nbml6ZXJcbiAgICAgKiBAcGFyYW0ge1JlY29nbml6ZXJ9IG90aGVyUmVjb2duaXplclxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgICAqL1xuICAgIGNhblJlY29nbml6ZVdpdGg6IGZ1bmN0aW9uKG90aGVyUmVjb2duaXplcikge1xuICAgICAgICByZXR1cm4gISF0aGlzLnNpbXVsdGFuZW91c1tvdGhlclJlY29nbml6ZXIuaWRdO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBZb3Ugc2hvdWxkIHVzZSBgdHJ5RW1pdGAgaW5zdGVhZCBvZiBgZW1pdGAgZGlyZWN0bHkgdG8gY2hlY2tcbiAgICAgKiB0aGF0IGFsbCB0aGUgbmVlZGVkIHJlY29nbml6ZXJzIGhhcyBmYWlsZWQgYmVmb3JlIGVtaXR0aW5nLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICAgICAqL1xuICAgIGVtaXQ6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHN0YXRlID0gdGhpcy5zdGF0ZTtcblxuICAgICAgICBmdW5jdGlvbiBlbWl0KGV2ZW50KSB7XG4gICAgICAgICAgICBzZWxmLm1hbmFnZXIuZW1pdChldmVudCwgaW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gJ3BhbnN0YXJ0JyBhbmQgJ3Bhbm1vdmUnXG4gICAgICAgIGlmIChzdGF0ZSA8IFNUQVRFX0VOREVEKSB7XG4gICAgICAgICAgICBlbWl0KHNlbGYub3B0aW9ucy5ldmVudCArIHN0YXRlU3RyKHN0YXRlKSk7XG4gICAgICAgIH1cblxuICAgICAgICBlbWl0KHNlbGYub3B0aW9ucy5ldmVudCk7IC8vIHNpbXBsZSAnZXZlbnROYW1lJyBldmVudHNcblxuICAgICAgICBpZiAoaW5wdXQuYWRkaXRpb25hbEV2ZW50KSB7IC8vIGFkZGl0aW9uYWwgZXZlbnQocGFubGVmdCwgcGFucmlnaHQsIHBpbmNoaW4sIHBpbmNob3V0Li4uKVxuICAgICAgICAgICAgZW1pdChpbnB1dC5hZGRpdGlvbmFsRXZlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcGFuZW5kIGFuZCBwYW5jYW5jZWxcbiAgICAgICAgaWYgKHN0YXRlID49IFNUQVRFX0VOREVEKSB7XG4gICAgICAgICAgICBlbWl0KHNlbGYub3B0aW9ucy5ldmVudCArIHN0YXRlU3RyKHN0YXRlKSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgdGhhdCBhbGwgdGhlIHJlcXVpcmUgZmFpbHVyZSByZWNvZ25pemVycyBoYXMgZmFpbGVkLFxuICAgICAqIGlmIHRydWUsIGl0IGVtaXRzIGEgZ2VzdHVyZSBldmVudCxcbiAgICAgKiBvdGhlcndpc2UsIHNldHVwIHRoZSBzdGF0ZSB0byBGQUlMRUQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGlucHV0XG4gICAgICovXG4gICAgdHJ5RW1pdDogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgaWYgKHRoaXMuY2FuRW1pdCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbWl0KGlucHV0KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBpdCdzIGZhaWxpbmcgYW55d2F5XG4gICAgICAgIHRoaXMuc3RhdGUgPSBTVEFURV9GQUlMRUQ7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGNhbiB3ZSBlbWl0P1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGNhbkVtaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgIHdoaWxlIChpIDwgdGhpcy5yZXF1aXJlRmFpbC5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICghKHRoaXMucmVxdWlyZUZhaWxbaV0uc3RhdGUgJiAoU1RBVEVfRkFJTEVEIHwgU1RBVEVfUE9TU0lCTEUpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogdXBkYXRlIHRoZSByZWNvZ25pemVyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGlucHV0RGF0YVxuICAgICAqL1xuICAgIHJlY29nbml6ZTogZnVuY3Rpb24oaW5wdXREYXRhKSB7XG4gICAgICAgIC8vIG1ha2UgYSBuZXcgY29weSBvZiB0aGUgaW5wdXREYXRhXG4gICAgICAgIC8vIHNvIHdlIGNhbiBjaGFuZ2UgdGhlIGlucHV0RGF0YSB3aXRob3V0IG1lc3NpbmcgdXAgdGhlIG90aGVyIHJlY29nbml6ZXJzXG4gICAgICAgIHZhciBpbnB1dERhdGFDbG9uZSA9IGFzc2lnbih7fSwgaW5wdXREYXRhKTtcblxuICAgICAgICAvLyBpcyBpcyBlbmFibGVkIGFuZCBhbGxvdyByZWNvZ25pemluZz9cbiAgICAgICAgaWYgKCFib29sT3JGbih0aGlzLm9wdGlvbnMuZW5hYmxlLCBbdGhpcywgaW5wdXREYXRhQ2xvbmVdKSkge1xuICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IFNUQVRFX0ZBSUxFRDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlc2V0IHdoZW4gd2UndmUgcmVhY2hlZCB0aGUgZW5kXG4gICAgICAgIGlmICh0aGlzLnN0YXRlICYgKFNUQVRFX1JFQ09HTklaRUQgfCBTVEFURV9DQU5DRUxMRUQgfCBTVEFURV9GQUlMRUQpKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gU1RBVEVfUE9TU0lCTEU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5wcm9jZXNzKGlucHV0RGF0YUNsb25lKTtcblxuICAgICAgICAvLyB0aGUgcmVjb2duaXplciBoYXMgcmVjb2duaXplZCBhIGdlc3R1cmVcbiAgICAgICAgLy8gc28gdHJpZ2dlciBhbiBldmVudFxuICAgICAgICBpZiAodGhpcy5zdGF0ZSAmIChTVEFURV9CRUdBTiB8IFNUQVRFX0NIQU5HRUQgfCBTVEFURV9FTkRFRCB8IFNUQVRFX0NBTkNFTExFRCkpIHtcbiAgICAgICAgICAgIHRoaXMudHJ5RW1pdChpbnB1dERhdGFDbG9uZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIHRoZSBzdGF0ZSBvZiB0aGUgcmVjb2duaXplclxuICAgICAqIHRoZSBhY3R1YWwgcmVjb2duaXppbmcgaGFwcGVucyBpbiB0aGlzIG1ldGhvZFxuICAgICAqIEB2aXJ0dWFsXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGlucHV0RGF0YVxuICAgICAqIEByZXR1cm5zIHtDb25zdH0gU1RBVEVcbiAgICAgKi9cbiAgICBwcm9jZXNzOiBmdW5jdGlvbihpbnB1dERhdGEpIHsgfSwgLy8ganNoaW50IGlnbm9yZTpsaW5lXG5cbiAgICAvKipcbiAgICAgKiByZXR1cm4gdGhlIHByZWZlcnJlZCB0b3VjaC1hY3Rpb25cbiAgICAgKiBAdmlydHVhbFxuICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgKi9cbiAgICBnZXRUb3VjaEFjdGlvbjogZnVuY3Rpb24oKSB7IH0sXG5cbiAgICAvKipcbiAgICAgKiBjYWxsZWQgd2hlbiB0aGUgZ2VzdHVyZSBpc24ndCBhbGxvd2VkIHRvIHJlY29nbml6ZVxuICAgICAqIGxpa2Ugd2hlbiBhbm90aGVyIGlzIGJlaW5nIHJlY29nbml6ZWQgb3IgaXQgaXMgZGlzYWJsZWRcbiAgICAgKiBAdmlydHVhbFxuICAgICAqL1xuICAgIHJlc2V0OiBmdW5jdGlvbigpIHsgfVxufTtcblxuLyoqXG4gKiBnZXQgYSB1c2FibGUgc3RyaW5nLCB1c2VkIGFzIGV2ZW50IHBvc3RmaXhcbiAqIEBwYXJhbSB7Q29uc3R9IHN0YXRlXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBzdGF0ZVxuICovXG5mdW5jdGlvbiBzdGF0ZVN0cihzdGF0ZSkge1xuICAgIGlmIChzdGF0ZSAmIFNUQVRFX0NBTkNFTExFRCkge1xuICAgICAgICByZXR1cm4gJ2NhbmNlbCc7XG4gICAgfSBlbHNlIGlmIChzdGF0ZSAmIFNUQVRFX0VOREVEKSB7XG4gICAgICAgIHJldHVybiAnZW5kJztcbiAgICB9IGVsc2UgaWYgKHN0YXRlICYgU1RBVEVfQ0hBTkdFRCkge1xuICAgICAgICByZXR1cm4gJ21vdmUnO1xuICAgIH0gZWxzZSBpZiAoc3RhdGUgJiBTVEFURV9CRUdBTikge1xuICAgICAgICByZXR1cm4gJ3N0YXJ0JztcbiAgICB9XG4gICAgcmV0dXJuICcnO1xufVxuXG4vKipcbiAqIGRpcmVjdGlvbiBjb25zIHRvIHN0cmluZ1xuICogQHBhcmFtIHtDb25zdH0gZGlyZWN0aW9uXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5mdW5jdGlvbiBkaXJlY3Rpb25TdHIoZGlyZWN0aW9uKSB7XG4gICAgaWYgKGRpcmVjdGlvbiA9PSBESVJFQ1RJT05fRE9XTikge1xuICAgICAgICByZXR1cm4gJ2Rvd24nO1xuICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09IERJUkVDVElPTl9VUCkge1xuICAgICAgICByZXR1cm4gJ3VwJztcbiAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PSBESVJFQ1RJT05fTEVGVCkge1xuICAgICAgICByZXR1cm4gJ2xlZnQnO1xuICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09IERJUkVDVElPTl9SSUdIVCkge1xuICAgICAgICByZXR1cm4gJ3JpZ2h0JztcbiAgICB9XG4gICAgcmV0dXJuICcnO1xufVxuXG4vKipcbiAqIGdldCBhIHJlY29nbml6ZXIgYnkgbmFtZSBpZiBpdCBpcyBib3VuZCB0byBhIG1hbmFnZXJcbiAqIEBwYXJhbSB7UmVjb2duaXplcnxTdHJpbmd9IG90aGVyUmVjb2duaXplclxuICogQHBhcmFtIHtSZWNvZ25pemVyfSByZWNvZ25pemVyXG4gKiBAcmV0dXJucyB7UmVjb2duaXplcn1cbiAqL1xuZnVuY3Rpb24gZ2V0UmVjb2duaXplckJ5TmFtZUlmTWFuYWdlcihvdGhlclJlY29nbml6ZXIsIHJlY29nbml6ZXIpIHtcbiAgICB2YXIgbWFuYWdlciA9IHJlY29nbml6ZXIubWFuYWdlcjtcbiAgICBpZiAobWFuYWdlcikge1xuICAgICAgICByZXR1cm4gbWFuYWdlci5nZXQob3RoZXJSZWNvZ25pemVyKTtcbiAgICB9XG4gICAgcmV0dXJuIG90aGVyUmVjb2duaXplcjtcbn1cblxuLyoqXG4gKiBUaGlzIHJlY29nbml6ZXIgaXMganVzdCB1c2VkIGFzIGEgYmFzZSBmb3IgdGhlIHNpbXBsZSBhdHRyaWJ1dGUgcmVjb2duaXplcnMuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIFJlY29nbml6ZXJcbiAqL1xuZnVuY3Rpb24gQXR0clJlY29nbml6ZXIoKSB7XG4gICAgUmVjb2duaXplci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxuXG5pbmhlcml0KEF0dHJSZWNvZ25pemVyLCBSZWNvZ25pemVyLCB7XG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZVxuICAgICAqIEBtZW1iZXJvZiBBdHRyUmVjb2duaXplclxuICAgICAqL1xuICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAgICAgKiBAZGVmYXVsdCAxXG4gICAgICAgICAqL1xuICAgICAgICBwb2ludGVyczogMVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBVc2VkIHRvIGNoZWNrIGlmIGl0IHRoZSByZWNvZ25pemVyIHJlY2VpdmVzIHZhbGlkIGlucHV0LCBsaWtlIGlucHV0LmRpc3RhbmNlID4gMTAuXG4gICAgICogQG1lbWJlcm9mIEF0dHJSZWNvZ25pemVyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGlucHV0XG4gICAgICogQHJldHVybnMge0Jvb2xlYW59IHJlY29nbml6ZWRcbiAgICAgKi9cbiAgICBhdHRyVGVzdDogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgdmFyIG9wdGlvblBvaW50ZXJzID0gdGhpcy5vcHRpb25zLnBvaW50ZXJzO1xuICAgICAgICByZXR1cm4gb3B0aW9uUG9pbnRlcnMgPT09IDAgfHwgaW5wdXQucG9pbnRlcnMubGVuZ3RoID09PSBvcHRpb25Qb2ludGVycztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUHJvY2VzcyB0aGUgaW5wdXQgYW5kIHJldHVybiB0aGUgc3RhdGUgZm9yIHRoZSByZWNvZ25pemVyXG4gICAgICogQG1lbWJlcm9mIEF0dHJSZWNvZ25pemVyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGlucHV0XG4gICAgICogQHJldHVybnMgeyp9IFN0YXRlXG4gICAgICovXG4gICAgcHJvY2VzczogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgdmFyIHN0YXRlID0gdGhpcy5zdGF0ZTtcbiAgICAgICAgdmFyIGV2ZW50VHlwZSA9IGlucHV0LmV2ZW50VHlwZTtcblxuICAgICAgICB2YXIgaXNSZWNvZ25pemVkID0gc3RhdGUgJiAoU1RBVEVfQkVHQU4gfCBTVEFURV9DSEFOR0VEKTtcbiAgICAgICAgdmFyIGlzVmFsaWQgPSB0aGlzLmF0dHJUZXN0KGlucHV0KTtcblxuICAgICAgICAvLyBvbiBjYW5jZWwgaW5wdXQgYW5kIHdlJ3ZlIHJlY29nbml6ZWQgYmVmb3JlLCByZXR1cm4gU1RBVEVfQ0FOQ0VMTEVEXG4gICAgICAgIGlmIChpc1JlY29nbml6ZWQgJiYgKGV2ZW50VHlwZSAmIElOUFVUX0NBTkNFTCB8fCAhaXNWYWxpZCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZSB8IFNUQVRFX0NBTkNFTExFRDtcbiAgICAgICAgfSBlbHNlIGlmIChpc1JlY29nbml6ZWQgfHwgaXNWYWxpZCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50VHlwZSAmIElOUFVUX0VORCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZSB8IFNUQVRFX0VOREVEO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghKHN0YXRlICYgU1RBVEVfQkVHQU4pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFNUQVRFX0JFR0FOO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlIHwgU1RBVEVfQ0hBTkdFRDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gU1RBVEVfRkFJTEVEO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIFBhblxuICogUmVjb2duaXplZCB3aGVuIHRoZSBwb2ludGVyIGlzIGRvd24gYW5kIG1vdmVkIGluIHRoZSBhbGxvd2VkIGRpcmVjdGlvbi5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMgQXR0clJlY29nbml6ZXJcbiAqL1xuZnVuY3Rpb24gUGFuUmVjb2duaXplcigpIHtcbiAgICBBdHRyUmVjb2duaXplci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgdGhpcy5wWCA9IG51bGw7XG4gICAgdGhpcy5wWSA9IG51bGw7XG59XG5cbmluaGVyaXQoUGFuUmVjb2duaXplciwgQXR0clJlY29nbml6ZXIsIHtcbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlXG4gICAgICogQG1lbWJlcm9mIFBhblJlY29nbml6ZXJcbiAgICAgKi9cbiAgICBkZWZhdWx0czoge1xuICAgICAgICBldmVudDogJ3BhbicsXG4gICAgICAgIHRocmVzaG9sZDogMTAsXG4gICAgICAgIHBvaW50ZXJzOiAxLFxuICAgICAgICBkaXJlY3Rpb246IERJUkVDVElPTl9BTExcbiAgICB9LFxuXG4gICAgZ2V0VG91Y2hBY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZGlyZWN0aW9uID0gdGhpcy5vcHRpb25zLmRpcmVjdGlvbjtcbiAgICAgICAgdmFyIGFjdGlvbnMgPSBbXTtcbiAgICAgICAgaWYgKGRpcmVjdGlvbiAmIERJUkVDVElPTl9IT1JJWk9OVEFMKSB7XG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goVE9VQ0hfQUNUSU9OX1BBTl9ZKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlyZWN0aW9uICYgRElSRUNUSU9OX1ZFUlRJQ0FMKSB7XG4gICAgICAgICAgICBhY3Rpb25zLnB1c2goVE9VQ0hfQUNUSU9OX1BBTl9YKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWN0aW9ucztcbiAgICB9LFxuXG4gICAgZGlyZWN0aW9uVGVzdDogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgIHZhciBoYXNNb3ZlZCA9IHRydWU7XG4gICAgICAgIHZhciBkaXN0YW5jZSA9IGlucHV0LmRpc3RhbmNlO1xuICAgICAgICB2YXIgZGlyZWN0aW9uID0gaW5wdXQuZGlyZWN0aW9uO1xuICAgICAgICB2YXIgeCA9IGlucHV0LmRlbHRhWDtcbiAgICAgICAgdmFyIHkgPSBpbnB1dC5kZWx0YVk7XG5cbiAgICAgICAgLy8gbG9jayB0byBheGlzP1xuICAgICAgICBpZiAoIShkaXJlY3Rpb24gJiBvcHRpb25zLmRpcmVjdGlvbikpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmRpcmVjdGlvbiAmIERJUkVDVElPTl9IT1JJWk9OVEFMKSB7XG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uID0gKHggPT09IDApID8gRElSRUNUSU9OX05PTkUgOiAoeCA8IDApID8gRElSRUNUSU9OX0xFRlQgOiBESVJFQ1RJT05fUklHSFQ7XG4gICAgICAgICAgICAgICAgaGFzTW92ZWQgPSB4ICE9IHRoaXMucFg7XG4gICAgICAgICAgICAgICAgZGlzdGFuY2UgPSBNYXRoLmFicyhpbnB1dC5kZWx0YVgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb24gPSAoeSA9PT0gMCkgPyBESVJFQ1RJT05fTk9ORSA6ICh5IDwgMCkgPyBESVJFQ1RJT05fVVAgOiBESVJFQ1RJT05fRE9XTjtcbiAgICAgICAgICAgICAgICBoYXNNb3ZlZCA9IHkgIT0gdGhpcy5wWTtcbiAgICAgICAgICAgICAgICBkaXN0YW5jZSA9IE1hdGguYWJzKGlucHV0LmRlbHRhWSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaW5wdXQuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgICAgICByZXR1cm4gaGFzTW92ZWQgJiYgZGlzdGFuY2UgPiBvcHRpb25zLnRocmVzaG9sZCAmJiBkaXJlY3Rpb24gJiBvcHRpb25zLmRpcmVjdGlvbjtcbiAgICB9LFxuXG4gICAgYXR0clRlc3Q6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHJldHVybiBBdHRyUmVjb2duaXplci5wcm90b3R5cGUuYXR0clRlc3QuY2FsbCh0aGlzLCBpbnB1dCkgJiZcbiAgICAgICAgICAgICh0aGlzLnN0YXRlICYgU1RBVEVfQkVHQU4gfHwgKCEodGhpcy5zdGF0ZSAmIFNUQVRFX0JFR0FOKSAmJiB0aGlzLmRpcmVjdGlvblRlc3QoaW5wdXQpKSk7XG4gICAgfSxcblxuICAgIGVtaXQ6IGZ1bmN0aW9uKGlucHV0KSB7XG5cbiAgICAgICAgdGhpcy5wWCA9IGlucHV0LmRlbHRhWDtcbiAgICAgICAgdGhpcy5wWSA9IGlucHV0LmRlbHRhWTtcblxuICAgICAgICB2YXIgZGlyZWN0aW9uID0gZGlyZWN0aW9uU3RyKGlucHV0LmRpcmVjdGlvbik7XG5cbiAgICAgICAgaWYgKGRpcmVjdGlvbikge1xuICAgICAgICAgICAgaW5wdXQuYWRkaXRpb25hbEV2ZW50ID0gdGhpcy5vcHRpb25zLmV2ZW50ICsgZGlyZWN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3N1cGVyLmVtaXQuY2FsbCh0aGlzLCBpbnB1dCk7XG4gICAgfVxufSk7XG5cbi8qKlxuICogUGluY2hcbiAqIFJlY29nbml6ZWQgd2hlbiB0d28gb3IgbW9yZSBwb2ludGVycyBhcmUgbW92aW5nIHRvd2FyZCAoem9vbS1pbikgb3IgYXdheSBmcm9tIGVhY2ggb3RoZXIgKHpvb20tb3V0KS5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMgQXR0clJlY29nbml6ZXJcbiAqL1xuZnVuY3Rpb24gUGluY2hSZWNvZ25pemVyKCkge1xuICAgIEF0dHJSZWNvZ25pemVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5cbmluaGVyaXQoUGluY2hSZWNvZ25pemVyLCBBdHRyUmVjb2duaXplciwge1xuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2VcbiAgICAgKiBAbWVtYmVyb2YgUGluY2hSZWNvZ25pemVyXG4gICAgICovXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgZXZlbnQ6ICdwaW5jaCcsXG4gICAgICAgIHRocmVzaG9sZDogMCxcbiAgICAgICAgcG9pbnRlcnM6IDJcbiAgICB9LFxuXG4gICAgZ2V0VG91Y2hBY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gW1RPVUNIX0FDVElPTl9OT05FXTtcbiAgICB9LFxuXG4gICAgYXR0clRlc3Q6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdXBlci5hdHRyVGVzdC5jYWxsKHRoaXMsIGlucHV0KSAmJlxuICAgICAgICAgICAgKE1hdGguYWJzKGlucHV0LnNjYWxlIC0gMSkgPiB0aGlzLm9wdGlvbnMudGhyZXNob2xkIHx8IHRoaXMuc3RhdGUgJiBTVEFURV9CRUdBTik7XG4gICAgfSxcblxuICAgIGVtaXQ6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIGlmIChpbnB1dC5zY2FsZSAhPT0gMSkge1xuICAgICAgICAgICAgdmFyIGluT3V0ID0gaW5wdXQuc2NhbGUgPCAxID8gJ2luJyA6ICdvdXQnO1xuICAgICAgICAgICAgaW5wdXQuYWRkaXRpb25hbEV2ZW50ID0gdGhpcy5vcHRpb25zLmV2ZW50ICsgaW5PdXQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc3VwZXIuZW1pdC5jYWxsKHRoaXMsIGlucHV0KTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiBQcmVzc1xuICogUmVjb2duaXplZCB3aGVuIHRoZSBwb2ludGVyIGlzIGRvd24gZm9yIHggbXMgd2l0aG91dCBhbnkgbW92ZW1lbnQuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIFJlY29nbml6ZXJcbiAqL1xuZnVuY3Rpb24gUHJlc3NSZWNvZ25pemVyKCkge1xuICAgIFJlY29nbml6ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgIHRoaXMuX3RpbWVyID0gbnVsbDtcbiAgICB0aGlzLl9pbnB1dCA9IG51bGw7XG59XG5cbmluaGVyaXQoUHJlc3NSZWNvZ25pemVyLCBSZWNvZ25pemVyLCB7XG4gICAgLyoqXG4gICAgICogQG5hbWVzcGFjZVxuICAgICAqIEBtZW1iZXJvZiBQcmVzc1JlY29nbml6ZXJcbiAgICAgKi9cbiAgICBkZWZhdWx0czoge1xuICAgICAgICBldmVudDogJ3ByZXNzJyxcbiAgICAgICAgcG9pbnRlcnM6IDEsXG4gICAgICAgIHRpbWU6IDI1MSwgLy8gbWluaW1hbCB0aW1lIG9mIHRoZSBwb2ludGVyIHRvIGJlIHByZXNzZWRcbiAgICAgICAgdGhyZXNob2xkOiA5IC8vIGEgbWluaW1hbCBtb3ZlbWVudCBpcyBvaywgYnV0IGtlZXAgaXQgbG93XG4gICAgfSxcblxuICAgIGdldFRvdWNoQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFtUT1VDSF9BQ1RJT05fQVVUT107XG4gICAgfSxcblxuICAgIHByb2Nlc3M6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgICAgICB2YXIgdmFsaWRQb2ludGVycyA9IGlucHV0LnBvaW50ZXJzLmxlbmd0aCA9PT0gb3B0aW9ucy5wb2ludGVycztcbiAgICAgICAgdmFyIHZhbGlkTW92ZW1lbnQgPSBpbnB1dC5kaXN0YW5jZSA8IG9wdGlvbnMudGhyZXNob2xkO1xuICAgICAgICB2YXIgdmFsaWRUaW1lID0gaW5wdXQuZGVsdGFUaW1lID4gb3B0aW9ucy50aW1lO1xuXG4gICAgICAgIHRoaXMuX2lucHV0ID0gaW5wdXQ7XG5cbiAgICAgICAgLy8gd2Ugb25seSBhbGxvdyBsaXR0bGUgbW92ZW1lbnRcbiAgICAgICAgLy8gYW5kIHdlJ3ZlIHJlYWNoZWQgYW4gZW5kIGV2ZW50LCBzbyBhIHRhcCBpcyBwb3NzaWJsZVxuICAgICAgICBpZiAoIXZhbGlkTW92ZW1lbnQgfHwgIXZhbGlkUG9pbnRlcnMgfHwgKGlucHV0LmV2ZW50VHlwZSAmIChJTlBVVF9FTkQgfCBJTlBVVF9DQU5DRUwpICYmICF2YWxpZFRpbWUpKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaW5wdXQuZXZlbnRUeXBlICYgSU5QVVRfU1RBUlQpIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICAgICAgICAgIHRoaXMuX3RpbWVyID0gc2V0VGltZW91dENvbnRleHQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IFNUQVRFX1JFQ09HTklaRUQ7XG4gICAgICAgICAgICAgICAgdGhpcy50cnlFbWl0KCk7XG4gICAgICAgICAgICB9LCBvcHRpb25zLnRpbWUsIHRoaXMpO1xuICAgICAgICB9IGVsc2UgaWYgKGlucHV0LmV2ZW50VHlwZSAmIElOUFVUX0VORCkge1xuICAgICAgICAgICAgcmV0dXJuIFNUQVRFX1JFQ09HTklaRUQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFNUQVRFX0ZBSUxFRDtcbiAgICB9LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fdGltZXIpO1xuICAgIH0sXG5cbiAgICBlbWl0OiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSAhPT0gU1RBVEVfUkVDT0dOSVpFRCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlucHV0ICYmIChpbnB1dC5ldmVudFR5cGUgJiBJTlBVVF9FTkQpKSB7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQgKyAndXAnLCBpbnB1dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9pbnB1dC50aW1lU3RhbXAgPSBub3coKTtcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5lbWl0KHRoaXMub3B0aW9ucy5ldmVudCwgdGhpcy5faW5wdXQpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbi8qKlxuICogUm90YXRlXG4gKiBSZWNvZ25pemVkIHdoZW4gdHdvIG9yIG1vcmUgcG9pbnRlciBhcmUgbW92aW5nIGluIGEgY2lyY3VsYXIgbW90aW9uLlxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBBdHRyUmVjb2duaXplclxuICovXG5mdW5jdGlvbiBSb3RhdGVSZWNvZ25pemVyKCkge1xuICAgIEF0dHJSZWNvZ25pemVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5cbmluaGVyaXQoUm90YXRlUmVjb2duaXplciwgQXR0clJlY29nbml6ZXIsIHtcbiAgICAvKipcbiAgICAgKiBAbmFtZXNwYWNlXG4gICAgICogQG1lbWJlcm9mIFJvdGF0ZVJlY29nbml6ZXJcbiAgICAgKi9cbiAgICBkZWZhdWx0czoge1xuICAgICAgICBldmVudDogJ3JvdGF0ZScsXG4gICAgICAgIHRocmVzaG9sZDogMCxcbiAgICAgICAgcG9pbnRlcnM6IDJcbiAgICB9LFxuXG4gICAgZ2V0VG91Y2hBY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gW1RPVUNIX0FDVElPTl9OT05FXTtcbiAgICB9LFxuXG4gICAgYXR0clRlc3Q6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdXBlci5hdHRyVGVzdC5jYWxsKHRoaXMsIGlucHV0KSAmJlxuICAgICAgICAgICAgKE1hdGguYWJzKGlucHV0LnJvdGF0aW9uKSA+IHRoaXMub3B0aW9ucy50aHJlc2hvbGQgfHwgdGhpcy5zdGF0ZSAmIFNUQVRFX0JFR0FOKTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiBTd2lwZVxuICogUmVjb2duaXplZCB3aGVuIHRoZSBwb2ludGVyIGlzIG1vdmluZyBmYXN0ICh2ZWxvY2l0eSksIHdpdGggZW5vdWdoIGRpc3RhbmNlIGluIHRoZSBhbGxvd2VkIGRpcmVjdGlvbi5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMgQXR0clJlY29nbml6ZXJcbiAqL1xuZnVuY3Rpb24gU3dpcGVSZWNvZ25pemVyKCkge1xuICAgIEF0dHJSZWNvZ25pemVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59XG5cbmluaGVyaXQoU3dpcGVSZWNvZ25pemVyLCBBdHRyUmVjb2duaXplciwge1xuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2VcbiAgICAgKiBAbWVtYmVyb2YgU3dpcGVSZWNvZ25pemVyXG4gICAgICovXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgZXZlbnQ6ICdzd2lwZScsXG4gICAgICAgIHRocmVzaG9sZDogMTAsXG4gICAgICAgIHZlbG9jaXR5OiAwLjMsXG4gICAgICAgIGRpcmVjdGlvbjogRElSRUNUSU9OX0hPUklaT05UQUwgfCBESVJFQ1RJT05fVkVSVElDQUwsXG4gICAgICAgIHBvaW50ZXJzOiAxXG4gICAgfSxcblxuICAgIGdldFRvdWNoQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIFBhblJlY29nbml6ZXIucHJvdG90eXBlLmdldFRvdWNoQWN0aW9uLmNhbGwodGhpcyk7XG4gICAgfSxcblxuICAgIGF0dHJUZXN0OiBmdW5jdGlvbihpbnB1dCkge1xuICAgICAgICB2YXIgZGlyZWN0aW9uID0gdGhpcy5vcHRpb25zLmRpcmVjdGlvbjtcbiAgICAgICAgdmFyIHZlbG9jaXR5O1xuXG4gICAgICAgIGlmIChkaXJlY3Rpb24gJiAoRElSRUNUSU9OX0hPUklaT05UQUwgfCBESVJFQ1RJT05fVkVSVElDQUwpKSB7XG4gICAgICAgICAgICB2ZWxvY2l0eSA9IGlucHV0Lm92ZXJhbGxWZWxvY2l0eTtcbiAgICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gJiBESVJFQ1RJT05fSE9SSVpPTlRBTCkge1xuICAgICAgICAgICAgdmVsb2NpdHkgPSBpbnB1dC5vdmVyYWxsVmVsb2NpdHlYO1xuICAgICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiAmIERJUkVDVElPTl9WRVJUSUNBTCkge1xuICAgICAgICAgICAgdmVsb2NpdHkgPSBpbnB1dC5vdmVyYWxsVmVsb2NpdHlZO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3N1cGVyLmF0dHJUZXN0LmNhbGwodGhpcywgaW5wdXQpICYmXG4gICAgICAgICAgICBkaXJlY3Rpb24gJiBpbnB1dC5vZmZzZXREaXJlY3Rpb24gJiZcbiAgICAgICAgICAgIGlucHV0LmRpc3RhbmNlID4gdGhpcy5vcHRpb25zLnRocmVzaG9sZCAmJlxuICAgICAgICAgICAgaW5wdXQubWF4UG9pbnRlcnMgPT0gdGhpcy5vcHRpb25zLnBvaW50ZXJzICYmXG4gICAgICAgICAgICBhYnModmVsb2NpdHkpID4gdGhpcy5vcHRpb25zLnZlbG9jaXR5ICYmIGlucHV0LmV2ZW50VHlwZSAmIElOUFVUX0VORDtcbiAgICB9LFxuXG4gICAgZW1pdDogZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgdmFyIGRpcmVjdGlvbiA9IGRpcmVjdGlvblN0cihpbnB1dC5vZmZzZXREaXJlY3Rpb24pO1xuICAgICAgICBpZiAoZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLm1hbmFnZXIuZW1pdCh0aGlzLm9wdGlvbnMuZXZlbnQgKyBkaXJlY3Rpb24sIGlucHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubWFuYWdlci5lbWl0KHRoaXMub3B0aW9ucy5ldmVudCwgaW5wdXQpO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIEEgdGFwIGlzIGVjb2duaXplZCB3aGVuIHRoZSBwb2ludGVyIGlzIGRvaW5nIGEgc21hbGwgdGFwL2NsaWNrLiBNdWx0aXBsZSB0YXBzIGFyZSByZWNvZ25pemVkIGlmIHRoZXkgb2NjdXJcbiAqIGJldHdlZW4gdGhlIGdpdmVuIGludGVydmFsIGFuZCBwb3NpdGlvbi4gVGhlIGRlbGF5IG9wdGlvbiBjYW4gYmUgdXNlZCB0byByZWNvZ25pemUgbXVsdGktdGFwcyB3aXRob3V0IGZpcmluZ1xuICogYSBzaW5nbGUgdGFwLlxuICpcbiAqIFRoZSBldmVudERhdGEgZnJvbSB0aGUgZW1pdHRlZCBldmVudCBjb250YWlucyB0aGUgcHJvcGVydHkgYHRhcENvdW50YCwgd2hpY2ggY29udGFpbnMgdGhlIGFtb3VudCBvZlxuICogbXVsdGktdGFwcyBiZWluZyByZWNvZ25pemVkLlxuICogQGNvbnN0cnVjdG9yXG4gKiBAZXh0ZW5kcyBSZWNvZ25pemVyXG4gKi9cbmZ1bmN0aW9uIFRhcFJlY29nbml6ZXIoKSB7XG4gICAgUmVjb2duaXplci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgLy8gcHJldmlvdXMgdGltZSBhbmQgY2VudGVyLFxuICAgIC8vIHVzZWQgZm9yIHRhcCBjb3VudGluZ1xuICAgIHRoaXMucFRpbWUgPSBmYWxzZTtcbiAgICB0aGlzLnBDZW50ZXIgPSBmYWxzZTtcblxuICAgIHRoaXMuX3RpbWVyID0gbnVsbDtcbiAgICB0aGlzLl9pbnB1dCA9IG51bGw7XG4gICAgdGhpcy5jb3VudCA9IDA7XG59XG5cbmluaGVyaXQoVGFwUmVjb2duaXplciwgUmVjb2duaXplciwge1xuICAgIC8qKlxuICAgICAqIEBuYW1lc3BhY2VcbiAgICAgKiBAbWVtYmVyb2YgUGluY2hSZWNvZ25pemVyXG4gICAgICovXG4gICAgZGVmYXVsdHM6IHtcbiAgICAgICAgZXZlbnQ6ICd0YXAnLFxuICAgICAgICBwb2ludGVyczogMSxcbiAgICAgICAgdGFwczogMSxcbiAgICAgICAgaW50ZXJ2YWw6IDMwMCwgLy8gbWF4IHRpbWUgYmV0d2VlbiB0aGUgbXVsdGktdGFwIHRhcHNcbiAgICAgICAgdGltZTogMjUwLCAvLyBtYXggdGltZSBvZiB0aGUgcG9pbnRlciB0byBiZSBkb3duIChsaWtlIGZpbmdlciBvbiB0aGUgc2NyZWVuKVxuICAgICAgICB0aHJlc2hvbGQ6IDksIC8vIGEgbWluaW1hbCBtb3ZlbWVudCBpcyBvaywgYnV0IGtlZXAgaXQgbG93XG4gICAgICAgIHBvc1RocmVzaG9sZDogMTAgLy8gYSBtdWx0aS10YXAgY2FuIGJlIGEgYml0IG9mZiB0aGUgaW5pdGlhbCBwb3NpdGlvblxuICAgIH0sXG5cbiAgICBnZXRUb3VjaEFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBbVE9VQ0hfQUNUSU9OX01BTklQVUxBVElPTl07XG4gICAgfSxcblxuICAgIHByb2Nlc3M6IGZ1bmN0aW9uKGlucHV0KSB7XG4gICAgICAgIHZhciBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG4gICAgICAgIHZhciB2YWxpZFBvaW50ZXJzID0gaW5wdXQucG9pbnRlcnMubGVuZ3RoID09PSBvcHRpb25zLnBvaW50ZXJzO1xuICAgICAgICB2YXIgdmFsaWRNb3ZlbWVudCA9IGlucHV0LmRpc3RhbmNlIDwgb3B0aW9ucy50aHJlc2hvbGQ7XG4gICAgICAgIHZhciB2YWxpZFRvdWNoVGltZSA9IGlucHV0LmRlbHRhVGltZSA8IG9wdGlvbnMudGltZTtcblxuICAgICAgICB0aGlzLnJlc2V0KCk7XG5cbiAgICAgICAgaWYgKChpbnB1dC5ldmVudFR5cGUgJiBJTlBVVF9TVEFSVCkgJiYgKHRoaXMuY291bnQgPT09IDApKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mYWlsVGltZW91dCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2Ugb25seSBhbGxvdyBsaXR0bGUgbW92ZW1lbnRcbiAgICAgICAgLy8gYW5kIHdlJ3ZlIHJlYWNoZWQgYW4gZW5kIGV2ZW50LCBzbyBhIHRhcCBpcyBwb3NzaWJsZVxuICAgICAgICBpZiAodmFsaWRNb3ZlbWVudCAmJiB2YWxpZFRvdWNoVGltZSAmJiB2YWxpZFBvaW50ZXJzKSB7XG4gICAgICAgICAgICBpZiAoaW5wdXQuZXZlbnRUeXBlICE9IElOUFVUX0VORCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmZhaWxUaW1lb3V0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB2YWxpZEludGVydmFsID0gdGhpcy5wVGltZSA/IChpbnB1dC50aW1lU3RhbXAgLSB0aGlzLnBUaW1lIDwgb3B0aW9ucy5pbnRlcnZhbCkgOiB0cnVlO1xuICAgICAgICAgICAgdmFyIHZhbGlkTXVsdGlUYXAgPSAhdGhpcy5wQ2VudGVyIHx8IGdldERpc3RhbmNlKHRoaXMucENlbnRlciwgaW5wdXQuY2VudGVyKSA8IG9wdGlvbnMucG9zVGhyZXNob2xkO1xuXG4gICAgICAgICAgICB0aGlzLnBUaW1lID0gaW5wdXQudGltZVN0YW1wO1xuICAgICAgICAgICAgdGhpcy5wQ2VudGVyID0gaW5wdXQuY2VudGVyO1xuXG4gICAgICAgICAgICBpZiAoIXZhbGlkTXVsdGlUYXAgfHwgIXZhbGlkSW50ZXJ2YWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvdW50ID0gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb3VudCArPSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9pbnB1dCA9IGlucHV0O1xuXG4gICAgICAgICAgICAvLyBpZiB0YXAgY291bnQgbWF0Y2hlcyB3ZSBoYXZlIHJlY29nbml6ZWQgaXQsXG4gICAgICAgICAgICAvLyBlbHNlIGl0IGhhcyBiZWdhbiByZWNvZ25pemluZy4uLlxuICAgICAgICAgICAgdmFyIHRhcENvdW50ID0gdGhpcy5jb3VudCAlIG9wdGlvbnMudGFwcztcbiAgICAgICAgICAgIGlmICh0YXBDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIG5vIGZhaWxpbmcgcmVxdWlyZW1lbnRzLCBpbW1lZGlhdGVseSB0cmlnZ2VyIHRoZSB0YXAgZXZlbnRcbiAgICAgICAgICAgICAgICAvLyBvciB3YWl0IGFzIGxvbmcgYXMgdGhlIG11bHRpdGFwIGludGVydmFsIHRvIHRyaWdnZXJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaGFzUmVxdWlyZUZhaWx1cmVzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFNUQVRFX1JFQ09HTklaRUQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGltZXIgPSBzZXRUaW1lb3V0Q29udGV4dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBTVEFURV9SRUNPR05JWkVEO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cnlFbWl0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIG9wdGlvbnMuaW50ZXJ2YWwsIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gU1RBVEVfQkVHQU47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBTVEFURV9GQUlMRUQ7XG4gICAgfSxcblxuICAgIGZhaWxUaW1lb3V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5fdGltZXIgPSBzZXRUaW1lb3V0Q29udGV4dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSBTVEFURV9GQUlMRUQ7XG4gICAgICAgIH0sIHRoaXMub3B0aW9ucy5pbnRlcnZhbCwgdGhpcyk7XG4gICAgICAgIHJldHVybiBTVEFURV9GQUlMRUQ7XG4gICAgfSxcblxuICAgIHJlc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVyKTtcbiAgICB9LFxuXG4gICAgZW1pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlID09IFNUQVRFX1JFQ09HTklaRUQpIHtcbiAgICAgICAgICAgIHRoaXMuX2lucHV0LnRhcENvdW50ID0gdGhpcy5jb3VudDtcbiAgICAgICAgICAgIHRoaXMubWFuYWdlci5lbWl0KHRoaXMub3B0aW9ucy5ldmVudCwgdGhpcy5faW5wdXQpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbi8qKlxuICogU2ltcGxlIHdheSB0byBjcmVhdGUgYSBtYW5hZ2VyIHdpdGggYSBkZWZhdWx0IHNldCBvZiByZWNvZ25pemVycy5cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBIYW1tZXIoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIG9wdGlvbnMucmVjb2duaXplcnMgPSBpZlVuZGVmaW5lZChvcHRpb25zLnJlY29nbml6ZXJzLCBIYW1tZXIuZGVmYXVsdHMucHJlc2V0KTtcbiAgICByZXR1cm4gbmV3IE1hbmFnZXIoZWxlbWVudCwgb3B0aW9ucyk7XG59XG5cbi8qKlxuICogQGNvbnN0IHtzdHJpbmd9XG4gKi9cbkhhbW1lci5WRVJTSU9OID0gJzIuMC43JztcblxuLyoqXG4gKiBkZWZhdWx0IHNldHRpbmdzXG4gKiBAbmFtZXNwYWNlXG4gKi9cbkhhbW1lci5kZWZhdWx0cyA9IHtcbiAgICAvKipcbiAgICAgKiBzZXQgaWYgRE9NIGV2ZW50cyBhcmUgYmVpbmcgdHJpZ2dlcmVkLlxuICAgICAqIEJ1dCB0aGlzIGlzIHNsb3dlciBhbmQgdW51c2VkIGJ5IHNpbXBsZSBpbXBsZW1lbnRhdGlvbnMsIHNvIGRpc2FibGVkIGJ5IGRlZmF1bHQuXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICogQGRlZmF1bHQgZmFsc2VcbiAgICAgKi9cbiAgICBkb21FdmVudHM6IGZhbHNlLFxuXG4gICAgLyoqXG4gICAgICogVGhlIHZhbHVlIGZvciB0aGUgdG91Y2hBY3Rpb24gcHJvcGVydHkvZmFsbGJhY2suXG4gICAgICogV2hlbiBzZXQgdG8gYGNvbXB1dGVgIGl0IHdpbGwgbWFnaWNhbGx5IHNldCB0aGUgY29ycmVjdCB2YWx1ZSBiYXNlZCBvbiB0aGUgYWRkZWQgcmVjb2duaXplcnMuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAZGVmYXVsdCBjb21wdXRlXG4gICAgICovXG4gICAgdG91Y2hBY3Rpb246IFRPVUNIX0FDVElPTl9DT01QVVRFLFxuXG4gICAgLyoqXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICogQGRlZmF1bHQgdHJ1ZVxuICAgICAqL1xuICAgIGVuYWJsZTogdHJ1ZSxcblxuICAgIC8qKlxuICAgICAqIEVYUEVSSU1FTlRBTCBGRUFUVVJFIC0tIGNhbiBiZSByZW1vdmVkL2NoYW5nZWRcbiAgICAgKiBDaGFuZ2UgdGhlIHBhcmVudCBpbnB1dCB0YXJnZXQgZWxlbWVudC5cbiAgICAgKiBJZiBOdWxsLCB0aGVuIGl0IGlzIGJlaW5nIHNldCB0aGUgdG8gbWFpbiBlbGVtZW50LlxuICAgICAqIEB0eXBlIHtOdWxsfEV2ZW50VGFyZ2V0fVxuICAgICAqIEBkZWZhdWx0IG51bGxcbiAgICAgKi9cbiAgICBpbnB1dFRhcmdldDogbnVsbCxcblxuICAgIC8qKlxuICAgICAqIGZvcmNlIGFuIGlucHV0IGNsYXNzXG4gICAgICogQHR5cGUge051bGx8RnVuY3Rpb259XG4gICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAqL1xuICAgIGlucHV0Q2xhc3M6IG51bGwsXG5cbiAgICAvKipcbiAgICAgKiBEZWZhdWx0IHJlY29nbml6ZXIgc2V0dXAgd2hlbiBjYWxsaW5nIGBIYW1tZXIoKWBcbiAgICAgKiBXaGVuIGNyZWF0aW5nIGEgbmV3IE1hbmFnZXIgdGhlc2Ugd2lsbCBiZSBza2lwcGVkLlxuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKi9cbiAgICBwcmVzZXQ6IFtcbiAgICAgICAgLy8gUmVjb2duaXplckNsYXNzLCBvcHRpb25zLCBbcmVjb2duaXplV2l0aCwgLi4uXSwgW3JlcXVpcmVGYWlsdXJlLCAuLi5dXG4gICAgICAgIFtSb3RhdGVSZWNvZ25pemVyLCB7ZW5hYmxlOiBmYWxzZX1dLFxuICAgICAgICBbUGluY2hSZWNvZ25pemVyLCB7ZW5hYmxlOiBmYWxzZX0sIFsncm90YXRlJ11dLFxuICAgICAgICBbU3dpcGVSZWNvZ25pemVyLCB7ZGlyZWN0aW9uOiBESVJFQ1RJT05fSE9SSVpPTlRBTH1dLFxuICAgICAgICBbUGFuUmVjb2duaXplciwge2RpcmVjdGlvbjogRElSRUNUSU9OX0hPUklaT05UQUx9LCBbJ3N3aXBlJ11dLFxuICAgICAgICBbVGFwUmVjb2duaXplcl0sXG4gICAgICAgIFtUYXBSZWNvZ25pemVyLCB7ZXZlbnQ6ICdkb3VibGV0YXAnLCB0YXBzOiAyfSwgWyd0YXAnXV0sXG4gICAgICAgIFtQcmVzc1JlY29nbml6ZXJdXG4gICAgXSxcblxuICAgIC8qKlxuICAgICAqIFNvbWUgQ1NTIHByb3BlcnRpZXMgY2FuIGJlIHVzZWQgdG8gaW1wcm92ZSB0aGUgd29ya2luZyBvZiBIYW1tZXIuXG4gICAgICogQWRkIHRoZW0gdG8gdGhpcyBtZXRob2QgYW5kIHRoZXkgd2lsbCBiZSBzZXQgd2hlbiBjcmVhdGluZyBhIG5ldyBNYW5hZ2VyLlxuICAgICAqIEBuYW1lc3BhY2VcbiAgICAgKi9cbiAgICBjc3NQcm9wczoge1xuICAgICAgICAvKipcbiAgICAgICAgICogRGlzYWJsZXMgdGV4dCBzZWxlY3Rpb24gdG8gaW1wcm92ZSB0aGUgZHJhZ2dpbmcgZ2VzdHVyZS4gTWFpbmx5IGZvciBkZXNrdG9wIGJyb3dzZXJzLlxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAZGVmYXVsdCAnbm9uZSdcbiAgICAgICAgICovXG4gICAgICAgIHVzZXJTZWxlY3Q6ICdub25lJyxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGlzYWJsZSB0aGUgV2luZG93cyBQaG9uZSBncmlwcGVycyB3aGVuIHByZXNzaW5nIGFuIGVsZW1lbnQuXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqIEBkZWZhdWx0ICdub25lJ1xuICAgICAgICAgKi9cbiAgICAgICAgdG91Y2hTZWxlY3Q6ICdub25lJyxcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGlzYWJsZXMgdGhlIGRlZmF1bHQgY2FsbG91dCBzaG93biB3aGVuIHlvdSB0b3VjaCBhbmQgaG9sZCBhIHRvdWNoIHRhcmdldC5cbiAgICAgICAgICogT24gaU9TLCB3aGVuIHlvdSB0b3VjaCBhbmQgaG9sZCBhIHRvdWNoIHRhcmdldCBzdWNoIGFzIGEgbGluaywgU2FmYXJpIGRpc3BsYXlzXG4gICAgICAgICAqIGEgY2FsbG91dCBjb250YWluaW5nIGluZm9ybWF0aW9uIGFib3V0IHRoZSBsaW5rLiBUaGlzIHByb3BlcnR5IGFsbG93cyB5b3UgdG8gZGlzYWJsZSB0aGF0IGNhbGxvdXQuXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqIEBkZWZhdWx0ICdub25lJ1xuICAgICAgICAgKi9cbiAgICAgICAgdG91Y2hDYWxsb3V0OiAnbm9uZScsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNwZWNpZmllcyB3aGV0aGVyIHpvb21pbmcgaXMgZW5hYmxlZC4gVXNlZCBieSBJRTEwPlxuICAgICAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAgICAgKiBAZGVmYXVsdCAnbm9uZSdcbiAgICAgICAgICovXG4gICAgICAgIGNvbnRlbnRab29taW5nOiAnbm9uZScsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNwZWNpZmllcyB0aGF0IGFuIGVudGlyZSBlbGVtZW50IHNob3VsZCBiZSBkcmFnZ2FibGUgaW5zdGVhZCBvZiBpdHMgY29udGVudHMuIE1haW5seSBmb3IgZGVza3RvcCBicm93c2Vycy5cbiAgICAgICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgICAgICogQGRlZmF1bHQgJ25vbmUnXG4gICAgICAgICAqL1xuICAgICAgICB1c2VyRHJhZzogJ25vbmUnLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPdmVycmlkZXMgdGhlIGhpZ2hsaWdodCBjb2xvciBzaG93biB3aGVuIHRoZSB1c2VyIHRhcHMgYSBsaW5rIG9yIGEgSmF2YVNjcmlwdFxuICAgICAgICAgKiBjbGlja2FibGUgZWxlbWVudCBpbiBpT1MuIFRoaXMgcHJvcGVydHkgb2JleXMgdGhlIGFscGhhIHZhbHVlLCBpZiBzcGVjaWZpZWQuXG4gICAgICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICAgICAqIEBkZWZhdWx0ICdyZ2JhKDAsMCwwLDApJ1xuICAgICAgICAgKi9cbiAgICAgICAgdGFwSGlnaGxpZ2h0Q29sb3I6ICdyZ2JhKDAsMCwwLDApJ1xuICAgIH1cbn07XG5cbnZhciBTVE9QID0gMTtcbnZhciBGT1JDRURfU1RPUCA9IDI7XG5cbi8qKlxuICogTWFuYWdlclxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIE1hbmFnZXIoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHRoaXMub3B0aW9ucyA9IGFzc2lnbih7fSwgSGFtbWVyLmRlZmF1bHRzLCBvcHRpb25zIHx8IHt9KTtcblxuICAgIHRoaXMub3B0aW9ucy5pbnB1dFRhcmdldCA9IHRoaXMub3B0aW9ucy5pbnB1dFRhcmdldCB8fCBlbGVtZW50O1xuXG4gICAgdGhpcy5oYW5kbGVycyA9IHt9O1xuICAgIHRoaXMuc2Vzc2lvbiA9IHt9O1xuICAgIHRoaXMucmVjb2duaXplcnMgPSBbXTtcbiAgICB0aGlzLm9sZENzc1Byb3BzID0ge307XG5cbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIHRoaXMuaW5wdXQgPSBjcmVhdGVJbnB1dEluc3RhbmNlKHRoaXMpO1xuICAgIHRoaXMudG91Y2hBY3Rpb24gPSBuZXcgVG91Y2hBY3Rpb24odGhpcywgdGhpcy5vcHRpb25zLnRvdWNoQWN0aW9uKTtcblxuICAgIHRvZ2dsZUNzc1Byb3BzKHRoaXMsIHRydWUpO1xuXG4gICAgZWFjaCh0aGlzLm9wdGlvbnMucmVjb2duaXplcnMsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgdmFyIHJlY29nbml6ZXIgPSB0aGlzLmFkZChuZXcgKGl0ZW1bMF0pKGl0ZW1bMV0pKTtcbiAgICAgICAgaXRlbVsyXSAmJiByZWNvZ25pemVyLnJlY29nbml6ZVdpdGgoaXRlbVsyXSk7XG4gICAgICAgIGl0ZW1bM10gJiYgcmVjb2duaXplci5yZXF1aXJlRmFpbHVyZShpdGVtWzNdKTtcbiAgICB9LCB0aGlzKTtcbn1cblxuTWFuYWdlci5wcm90b3R5cGUgPSB7XG4gICAgLyoqXG4gICAgICogc2V0IG9wdGlvbnNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgICAqIEByZXR1cm5zIHtNYW5hZ2VyfVxuICAgICAqL1xuICAgIHNldDogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgICAgICBhc3NpZ24odGhpcy5vcHRpb25zLCBvcHRpb25zKTtcblxuICAgICAgICAvLyBPcHRpb25zIHRoYXQgbmVlZCBhIGxpdHRsZSBtb3JlIHNldHVwXG4gICAgICAgIGlmIChvcHRpb25zLnRvdWNoQWN0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnRvdWNoQWN0aW9uLnVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmlucHV0VGFyZ2V0KSB7XG4gICAgICAgICAgICAvLyBDbGVhbiB1cCBleGlzdGluZyBldmVudCBsaXN0ZW5lcnMgYW5kIHJlaW5pdGlhbGl6ZVxuICAgICAgICAgICAgdGhpcy5pbnB1dC5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLmlucHV0LnRhcmdldCA9IG9wdGlvbnMuaW5wdXRUYXJnZXQ7XG4gICAgICAgICAgICB0aGlzLmlucHV0LmluaXQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogc3RvcCByZWNvZ25pemluZyBmb3IgdGhpcyBzZXNzaW9uLlxuICAgICAqIFRoaXMgc2Vzc2lvbiB3aWxsIGJlIGRpc2NhcmRlZCwgd2hlbiBhIG5ldyBbaW5wdXRdc3RhcnQgZXZlbnQgaXMgZmlyZWQuXG4gICAgICogV2hlbiBmb3JjZWQsIHRoZSByZWNvZ25pemVyIGN5Y2xlIGlzIHN0b3BwZWQgaW1tZWRpYXRlbHkuXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBbZm9yY2VdXG4gICAgICovXG4gICAgc3RvcDogZnVuY3Rpb24oZm9yY2UpIHtcbiAgICAgICAgdGhpcy5zZXNzaW9uLnN0b3BwZWQgPSBmb3JjZSA/IEZPUkNFRF9TVE9QIDogU1RPUDtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogcnVuIHRoZSByZWNvZ25pemVycyFcbiAgICAgKiBjYWxsZWQgYnkgdGhlIGlucHV0SGFuZGxlciBmdW5jdGlvbiBvbiBldmVyeSBtb3ZlbWVudCBvZiB0aGUgcG9pbnRlcnMgKHRvdWNoZXMpXG4gICAgICogaXQgd2Fsa3MgdGhyb3VnaCBhbGwgdGhlIHJlY29nbml6ZXJzIGFuZCB0cmllcyB0byBkZXRlY3QgdGhlIGdlc3R1cmUgdGhhdCBpcyBiZWluZyBtYWRlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGlucHV0RGF0YVxuICAgICAqL1xuICAgIHJlY29nbml6ZTogZnVuY3Rpb24oaW5wdXREYXRhKSB7XG4gICAgICAgIHZhciBzZXNzaW9uID0gdGhpcy5zZXNzaW9uO1xuICAgICAgICBpZiAoc2Vzc2lvbi5zdG9wcGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBydW4gdGhlIHRvdWNoLWFjdGlvbiBwb2x5ZmlsbFxuICAgICAgICB0aGlzLnRvdWNoQWN0aW9uLnByZXZlbnREZWZhdWx0cyhpbnB1dERhdGEpO1xuXG4gICAgICAgIHZhciByZWNvZ25pemVyO1xuICAgICAgICB2YXIgcmVjb2duaXplcnMgPSB0aGlzLnJlY29nbml6ZXJzO1xuXG4gICAgICAgIC8vIHRoaXMgaG9sZHMgdGhlIHJlY29nbml6ZXIgdGhhdCBpcyBiZWluZyByZWNvZ25pemVkLlxuICAgICAgICAvLyBzbyB0aGUgcmVjb2duaXplcidzIHN0YXRlIG5lZWRzIHRvIGJlIEJFR0FOLCBDSEFOR0VELCBFTkRFRCBvciBSRUNPR05JWkVEXG4gICAgICAgIC8vIGlmIG5vIHJlY29nbml6ZXIgaXMgZGV0ZWN0aW5nIGEgdGhpbmcsIGl0IGlzIHNldCB0byBgbnVsbGBcbiAgICAgICAgdmFyIGN1clJlY29nbml6ZXIgPSBzZXNzaW9uLmN1clJlY29nbml6ZXI7XG5cbiAgICAgICAgLy8gcmVzZXQgd2hlbiB0aGUgbGFzdCByZWNvZ25pemVyIGlzIHJlY29nbml6ZWRcbiAgICAgICAgLy8gb3Igd2hlbiB3ZSdyZSBpbiBhIG5ldyBzZXNzaW9uXG4gICAgICAgIGlmICghY3VyUmVjb2duaXplciB8fCAoY3VyUmVjb2duaXplciAmJiBjdXJSZWNvZ25pemVyLnN0YXRlICYgU1RBVEVfUkVDT0dOSVpFRCkpIHtcbiAgICAgICAgICAgIGN1clJlY29nbml6ZXIgPSBzZXNzaW9uLmN1clJlY29nbml6ZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IHJlY29nbml6ZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgcmVjb2duaXplciA9IHJlY29nbml6ZXJzW2ldO1xuXG4gICAgICAgICAgICAvLyBmaW5kIG91dCBpZiB3ZSBhcmUgYWxsb3dlZCB0cnkgdG8gcmVjb2duaXplIHRoZSBpbnB1dCBmb3IgdGhpcyBvbmUuXG4gICAgICAgICAgICAvLyAxLiAgIGFsbG93IGlmIHRoZSBzZXNzaW9uIGlzIE5PVCBmb3JjZWQgc3RvcHBlZCAoc2VlIHRoZSAuc3RvcCgpIG1ldGhvZClcbiAgICAgICAgICAgIC8vIDIuICAgYWxsb3cgaWYgd2Ugc3RpbGwgaGF2ZW4ndCByZWNvZ25pemVkIGEgZ2VzdHVyZSBpbiB0aGlzIHNlc3Npb24sIG9yIHRoZSB0aGlzIHJlY29nbml6ZXIgaXMgdGhlIG9uZVxuICAgICAgICAgICAgLy8gICAgICB0aGF0IGlzIGJlaW5nIHJlY29nbml6ZWQuXG4gICAgICAgICAgICAvLyAzLiAgIGFsbG93IGlmIHRoZSByZWNvZ25pemVyIGlzIGFsbG93ZWQgdG8gcnVuIHNpbXVsdGFuZW91cyB3aXRoIHRoZSBjdXJyZW50IHJlY29nbml6ZWQgcmVjb2duaXplci5cbiAgICAgICAgICAgIC8vICAgICAgdGhpcyBjYW4gYmUgc2V0dXAgd2l0aCB0aGUgYHJlY29nbml6ZVdpdGgoKWAgbWV0aG9kIG9uIHRoZSByZWNvZ25pemVyLlxuICAgICAgICAgICAgaWYgKHNlc3Npb24uc3RvcHBlZCAhPT0gRk9SQ0VEX1NUT1AgJiYgKCAvLyAxXG4gICAgICAgICAgICAgICAgICAgICFjdXJSZWNvZ25pemVyIHx8IHJlY29nbml6ZXIgPT0gY3VyUmVjb2duaXplciB8fCAvLyAyXG4gICAgICAgICAgICAgICAgICAgIHJlY29nbml6ZXIuY2FuUmVjb2duaXplV2l0aChjdXJSZWNvZ25pemVyKSkpIHsgLy8gM1xuICAgICAgICAgICAgICAgIHJlY29nbml6ZXIucmVjb2duaXplKGlucHV0RGF0YSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlY29nbml6ZXIucmVzZXQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgdGhlIHJlY29nbml6ZXIgaGFzIGJlZW4gcmVjb2duaXppbmcgdGhlIGlucHV0IGFzIGEgdmFsaWQgZ2VzdHVyZSwgd2Ugd2FudCB0byBzdG9yZSB0aGlzIG9uZSBhcyB0aGVcbiAgICAgICAgICAgIC8vIGN1cnJlbnQgYWN0aXZlIHJlY29nbml6ZXIuIGJ1dCBvbmx5IGlmIHdlIGRvbid0IGFscmVhZHkgaGF2ZSBhbiBhY3RpdmUgcmVjb2duaXplclxuICAgICAgICAgICAgaWYgKCFjdXJSZWNvZ25pemVyICYmIHJlY29nbml6ZXIuc3RhdGUgJiAoU1RBVEVfQkVHQU4gfCBTVEFURV9DSEFOR0VEIHwgU1RBVEVfRU5ERUQpKSB7XG4gICAgICAgICAgICAgICAgY3VyUmVjb2duaXplciA9IHNlc3Npb24uY3VyUmVjb2duaXplciA9IHJlY29nbml6ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogZ2V0IGEgcmVjb2duaXplciBieSBpdHMgZXZlbnQgbmFtZS5cbiAgICAgKiBAcGFyYW0ge1JlY29nbml6ZXJ8U3RyaW5nfSByZWNvZ25pemVyXG4gICAgICogQHJldHVybnMge1JlY29nbml6ZXJ8TnVsbH1cbiAgICAgKi9cbiAgICBnZXQ6IGZ1bmN0aW9uKHJlY29nbml6ZXIpIHtcbiAgICAgICAgaWYgKHJlY29nbml6ZXIgaW5zdGFuY2VvZiBSZWNvZ25pemVyKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVjb2duaXplcjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciByZWNvZ25pemVycyA9IHRoaXMucmVjb2duaXplcnM7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVjb2duaXplcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChyZWNvZ25pemVyc1tpXS5vcHRpb25zLmV2ZW50ID09IHJlY29nbml6ZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVjb2duaXplcnNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGFkZCBhIHJlY29nbml6ZXIgdG8gdGhlIG1hbmFnZXJcbiAgICAgKiBleGlzdGluZyByZWNvZ25pemVycyB3aXRoIHRoZSBzYW1lIGV2ZW50IG5hbWUgd2lsbCBiZSByZW1vdmVkXG4gICAgICogQHBhcmFtIHtSZWNvZ25pemVyfSByZWNvZ25pemVyXG4gICAgICogQHJldHVybnMge1JlY29nbml6ZXJ8TWFuYWdlcn1cbiAgICAgKi9cbiAgICBhZGQ6IGZ1bmN0aW9uKHJlY29nbml6ZXIpIHtcbiAgICAgICAgaWYgKGludm9rZUFycmF5QXJnKHJlY29nbml6ZXIsICdhZGQnLCB0aGlzKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZW1vdmUgZXhpc3RpbmdcbiAgICAgICAgdmFyIGV4aXN0aW5nID0gdGhpcy5nZXQocmVjb2duaXplci5vcHRpb25zLmV2ZW50KTtcbiAgICAgICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZShleGlzdGluZyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlY29nbml6ZXJzLnB1c2gocmVjb2duaXplcik7XG4gICAgICAgIHJlY29nbml6ZXIubWFuYWdlciA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy50b3VjaEFjdGlvbi51cGRhdGUoKTtcbiAgICAgICAgcmV0dXJuIHJlY29nbml6ZXI7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIHJlbW92ZSBhIHJlY29nbml6ZXIgYnkgbmFtZSBvciBpbnN0YW5jZVxuICAgICAqIEBwYXJhbSB7UmVjb2duaXplcnxTdHJpbmd9IHJlY29nbml6ZXJcbiAgICAgKiBAcmV0dXJucyB7TWFuYWdlcn1cbiAgICAgKi9cbiAgICByZW1vdmU6IGZ1bmN0aW9uKHJlY29nbml6ZXIpIHtcbiAgICAgICAgaWYgKGludm9rZUFycmF5QXJnKHJlY29nbml6ZXIsICdyZW1vdmUnLCB0aGlzKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICByZWNvZ25pemVyID0gdGhpcy5nZXQocmVjb2duaXplcik7XG5cbiAgICAgICAgLy8gbGV0J3MgbWFrZSBzdXJlIHRoaXMgcmVjb2duaXplciBleGlzdHNcbiAgICAgICAgaWYgKHJlY29nbml6ZXIpIHtcbiAgICAgICAgICAgIHZhciByZWNvZ25pemVycyA9IHRoaXMucmVjb2duaXplcnM7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBpbkFycmF5KHJlY29nbml6ZXJzLCByZWNvZ25pemVyKTtcblxuICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHJlY29nbml6ZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgdGhpcy50b3VjaEFjdGlvbi51cGRhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBiaW5kIGV2ZW50XG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50c1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXJcbiAgICAgKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSB0aGlzXG4gICAgICovXG4gICAgb246IGZ1bmN0aW9uKGV2ZW50cywgaGFuZGxlcikge1xuICAgICAgICBpZiAoZXZlbnRzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaGFuZGxlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaGFuZGxlcnMgPSB0aGlzLmhhbmRsZXJzO1xuICAgICAgICBlYWNoKHNwbGl0U3RyKGV2ZW50cyksIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBoYW5kbGVyc1tldmVudF0gPSBoYW5kbGVyc1tldmVudF0gfHwgW107XG4gICAgICAgICAgICBoYW5kbGVyc1tldmVudF0ucHVzaChoYW5kbGVyKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiB1bmJpbmQgZXZlbnQsIGxlYXZlIGVtaXQgYmxhbmsgdG8gcmVtb3ZlIGFsbCBoYW5kbGVyc1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudHNcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaGFuZGxlcl1cbiAgICAgKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSB0aGlzXG4gICAgICovXG4gICAgb2ZmOiBmdW5jdGlvbihldmVudHMsIGhhbmRsZXIpIHtcbiAgICAgICAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaGFuZGxlcnMgPSB0aGlzLmhhbmRsZXJzO1xuICAgICAgICBlYWNoKHNwbGl0U3RyKGV2ZW50cyksIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoIWhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgaGFuZGxlcnNbZXZlbnRdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyc1tldmVudF0gJiYgaGFuZGxlcnNbZXZlbnRdLnNwbGljZShpbkFycmF5KGhhbmRsZXJzW2V2ZW50XSwgaGFuZGxlciksIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIGVtaXQgZXZlbnQgdG8gdGhlIGxpc3RlbmVyc1xuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAgICovXG4gICAgZW1pdDogZnVuY3Rpb24oZXZlbnQsIGRhdGEpIHtcbiAgICAgICAgLy8gd2UgYWxzbyB3YW50IHRvIHRyaWdnZXIgZG9tIGV2ZW50c1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmRvbUV2ZW50cykge1xuICAgICAgICAgICAgdHJpZ2dlckRvbUV2ZW50KGV2ZW50LCBkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG5vIGhhbmRsZXJzLCBzbyBza2lwIGl0IGFsbFxuICAgICAgICB2YXIgaGFuZGxlcnMgPSB0aGlzLmhhbmRsZXJzW2V2ZW50XSAmJiB0aGlzLmhhbmRsZXJzW2V2ZW50XS5zbGljZSgpO1xuICAgICAgICBpZiAoIWhhbmRsZXJzIHx8ICFoYW5kbGVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGRhdGEudHlwZSA9IGV2ZW50O1xuICAgICAgICBkYXRhLnByZXZlbnREZWZhdWx0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBkYXRhLnNyY0V2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IGhhbmRsZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgaGFuZGxlcnNbaV0oZGF0YSk7XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogZGVzdHJveSB0aGUgbWFuYWdlciBhbmQgdW5iaW5kcyBhbGwgZXZlbnRzXG4gICAgICogaXQgZG9lc24ndCB1bmJpbmQgZG9tIGV2ZW50cywgdGhhdCBpcyB0aGUgdXNlciBvd24gcmVzcG9uc2liaWxpdHlcbiAgICAgKi9cbiAgICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ICYmIHRvZ2dsZUNzc1Byb3BzKHRoaXMsIGZhbHNlKTtcblxuICAgICAgICB0aGlzLmhhbmRsZXJzID0ge307XG4gICAgICAgIHRoaXMuc2Vzc2lvbiA9IHt9O1xuICAgICAgICB0aGlzLmlucHV0LmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcbiAgICB9XG59O1xuXG4vKipcbiAqIGFkZC9yZW1vdmUgdGhlIGNzcyBwcm9wZXJ0aWVzIGFzIGRlZmluZWQgaW4gbWFuYWdlci5vcHRpb25zLmNzc1Byb3BzXG4gKiBAcGFyYW0ge01hbmFnZXJ9IG1hbmFnZXJcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gYWRkXG4gKi9cbmZ1bmN0aW9uIHRvZ2dsZUNzc1Byb3BzKG1hbmFnZXIsIGFkZCkge1xuICAgIHZhciBlbGVtZW50ID0gbWFuYWdlci5lbGVtZW50O1xuICAgIGlmICghZWxlbWVudC5zdHlsZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBwcm9wO1xuICAgIGVhY2gobWFuYWdlci5vcHRpb25zLmNzc1Byb3BzLCBmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgICBwcm9wID0gcHJlZml4ZWQoZWxlbWVudC5zdHlsZSwgbmFtZSk7XG4gICAgICAgIGlmIChhZGQpIHtcbiAgICAgICAgICAgIG1hbmFnZXIub2xkQ3NzUHJvcHNbcHJvcF0gPSBlbGVtZW50LnN0eWxlW3Byb3BdO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZVtwcm9wXSA9IHZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZVtwcm9wXSA9IG1hbmFnZXIub2xkQ3NzUHJvcHNbcHJvcF0gfHwgJyc7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIWFkZCkge1xuICAgICAgICBtYW5hZ2VyLm9sZENzc1Byb3BzID0ge307XG4gICAgfVxufVxuXG4vKipcbiAqIHRyaWdnZXIgZG9tIGV2ZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gKi9cbmZ1bmN0aW9uIHRyaWdnZXJEb21FdmVudChldmVudCwgZGF0YSkge1xuICAgIHZhciBnZXN0dXJlRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICBnZXN0dXJlRXZlbnQuaW5pdEV2ZW50KGV2ZW50LCB0cnVlLCB0cnVlKTtcbiAgICBnZXN0dXJlRXZlbnQuZ2VzdHVyZSA9IGRhdGE7XG4gICAgZGF0YS50YXJnZXQuZGlzcGF0Y2hFdmVudChnZXN0dXJlRXZlbnQpO1xufVxuXG5hc3NpZ24oSGFtbWVyLCB7XG4gICAgSU5QVVRfU1RBUlQ6IElOUFVUX1NUQVJULFxuICAgIElOUFVUX01PVkU6IElOUFVUX01PVkUsXG4gICAgSU5QVVRfRU5EOiBJTlBVVF9FTkQsXG4gICAgSU5QVVRfQ0FOQ0VMOiBJTlBVVF9DQU5DRUwsXG5cbiAgICBTVEFURV9QT1NTSUJMRTogU1RBVEVfUE9TU0lCTEUsXG4gICAgU1RBVEVfQkVHQU46IFNUQVRFX0JFR0FOLFxuICAgIFNUQVRFX0NIQU5HRUQ6IFNUQVRFX0NIQU5HRUQsXG4gICAgU1RBVEVfRU5ERUQ6IFNUQVRFX0VOREVELFxuICAgIFNUQVRFX1JFQ09HTklaRUQ6IFNUQVRFX1JFQ09HTklaRUQsXG4gICAgU1RBVEVfQ0FOQ0VMTEVEOiBTVEFURV9DQU5DRUxMRUQsXG4gICAgU1RBVEVfRkFJTEVEOiBTVEFURV9GQUlMRUQsXG5cbiAgICBESVJFQ1RJT05fTk9ORTogRElSRUNUSU9OX05PTkUsXG4gICAgRElSRUNUSU9OX0xFRlQ6IERJUkVDVElPTl9MRUZULFxuICAgIERJUkVDVElPTl9SSUdIVDogRElSRUNUSU9OX1JJR0hULFxuICAgIERJUkVDVElPTl9VUDogRElSRUNUSU9OX1VQLFxuICAgIERJUkVDVElPTl9ET1dOOiBESVJFQ1RJT05fRE9XTixcbiAgICBESVJFQ1RJT05fSE9SSVpPTlRBTDogRElSRUNUSU9OX0hPUklaT05UQUwsXG4gICAgRElSRUNUSU9OX1ZFUlRJQ0FMOiBESVJFQ1RJT05fVkVSVElDQUwsXG4gICAgRElSRUNUSU9OX0FMTDogRElSRUNUSU9OX0FMTCxcblxuICAgIE1hbmFnZXI6IE1hbmFnZXIsXG4gICAgSW5wdXQ6IElucHV0LFxuICAgIFRvdWNoQWN0aW9uOiBUb3VjaEFjdGlvbixcblxuICAgIFRvdWNoSW5wdXQ6IFRvdWNoSW5wdXQsXG4gICAgTW91c2VJbnB1dDogTW91c2VJbnB1dCxcbiAgICBQb2ludGVyRXZlbnRJbnB1dDogUG9pbnRlckV2ZW50SW5wdXQsXG4gICAgVG91Y2hNb3VzZUlucHV0OiBUb3VjaE1vdXNlSW5wdXQsXG4gICAgU2luZ2xlVG91Y2hJbnB1dDogU2luZ2xlVG91Y2hJbnB1dCxcblxuICAgIFJlY29nbml6ZXI6IFJlY29nbml6ZXIsXG4gICAgQXR0clJlY29nbml6ZXI6IEF0dHJSZWNvZ25pemVyLFxuICAgIFRhcDogVGFwUmVjb2duaXplcixcbiAgICBQYW46IFBhblJlY29nbml6ZXIsXG4gICAgU3dpcGU6IFN3aXBlUmVjb2duaXplcixcbiAgICBQaW5jaDogUGluY2hSZWNvZ25pemVyLFxuICAgIFJvdGF0ZTogUm90YXRlUmVjb2duaXplcixcbiAgICBQcmVzczogUHJlc3NSZWNvZ25pemVyLFxuXG4gICAgb246IGFkZEV2ZW50TGlzdGVuZXJzLFxuICAgIG9mZjogcmVtb3ZlRXZlbnRMaXN0ZW5lcnMsXG4gICAgZWFjaDogZWFjaCxcbiAgICBtZXJnZTogbWVyZ2UsXG4gICAgZXh0ZW5kOiBleHRlbmQsXG4gICAgYXNzaWduOiBhc3NpZ24sXG4gICAgaW5oZXJpdDogaW5oZXJpdCxcbiAgICBiaW5kRm46IGJpbmRGbixcbiAgICBwcmVmaXhlZDogcHJlZml4ZWRcbn0pO1xuXG4vLyB0aGlzIHByZXZlbnRzIGVycm9ycyB3aGVuIEhhbW1lciBpcyBsb2FkZWQgaW4gdGhlIHByZXNlbmNlIG9mIGFuIEFNRFxuLy8gIHN0eWxlIGxvYWRlciBidXQgYnkgc2NyaXB0IHRhZywgbm90IGJ5IHRoZSBsb2FkZXIuXG52YXIgZnJlZUdsb2JhbCA9ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6ICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDoge30pKTsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG5mcmVlR2xvYmFsLkhhbW1lciA9IEhhbW1lcjtcblxuaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIEhhbW1lcjtcbiAgICB9KTtcbn0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gSGFtbWVyO1xufSBlbHNlIHtcbiAgICB3aW5kb3dbZXhwb3J0TmFtZV0gPSBIYW1tZXI7XG59XG5cbn0pKHdpbmRvdywgZG9jdW1lbnQsICdIYW1tZXInKTtcbiIsImltcG9ydCAqIGFzIEhhbW1lciBmcm9tICdoYW1tZXJqcydcclxuaW1wb3J0IHsgVUlGcmFtZV9BYnN0cmFjdCwgQXZlcmFnZXIsIGZDb2xvciwgRkNvbG9yLCBGSFRNTCwgU29ydGVkTGlua2VkTGlzdCwgVUlFbGVtZW50IH0gZnJvbSBcIi4uL2ltcG9ydHNcIjtcclxuZXhwb3J0IGVudW0gQnJpc3RvbEhBbGlnbiB7XHJcbiAgICBMZWZ0ID0gJ2xlZnQnLCBDZW50ZXIgPSAnY2VudGVyJywgUmlnaHQgPSAncmlnaHQnXHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIEJyaXN0b2xWQWxpZ24ge1xyXG4gICAgVG9wID0gJ3RvcCcsXHJcbiAgICBCb3R0b20gPSAnYm90dG9tJyxcclxuICAgIE1pZGRsZSA9ICdtaWRkbGUnLFxyXG4gICAgQWxwaGFiZXRpYyA9ICdhbHBoYWJldGljJyxcclxuICAgIEhhbmdpbmcgPSAnaGFuZ2luZydcclxufVxyXG5leHBvcnQgZW51bSBCcmlzdG9sRm9udFN0eWxlIHtcclxuICAgIE5vcm1hbCA9ICdub3JtYWwnLFxyXG4gICAgSXRhbGljID0gJ2l0YWxpYycsXHJcbiAgICBPYmxpcXVlID0gJ29ibGlxdWUnXHJcbn1cclxuZXhwb3J0IGVudW0gQnJpc3RvbEZvbnRGYW1pbHkge1xyXG4gICAgQXJpYWwgPSAnQXJpYWwnLFxyXG4gICAgVmVyZGFuYSA9ICdWZXJkYW5hJyxcclxuICAgIFRpbWVzTmV3Um9tYW4gPSAnVGltZXNOZXdSb21hbicsXHJcbiAgICBDb3VyaWVyTmV3ID0gJ0NvdXJpZXIgTmV3JyxcclxuICAgIE1vbm9zcGFjZSA9ICdNb25vc3BhY2UnLFxyXG4gICAgQ2FzY2FkaWFDb2RlID0gJ0Nhc2NhZGlhIENvZGUnLFxyXG4gICAgTWF0ZXJpYWxJY29ucyA9IFwiTWF0ZXJpYWwgSWNvbnNcIixcclxuICAgIE1hdGVyaWFsSWNvbnNPdXRsaW5lZCA9IFwiTWF0ZXJpYWwgSWNvbnMgT3V0bGluZWRcIlxyXG59XHJcbmV4cG9ydCBlbnVtIEZvbnRTaXplIHtcclxuICAgIFNtYWxsID0gOCxcclxuICAgIE1lZGl1bSA9IDE2LFxyXG4gICAgTGFyZ2UgPSAyMFxyXG59XHJcbmV4cG9ydCBlbnVtIEJyaXN0b2xGb250V2VpZ2h0IHtcclxuXHJcbiAgICBub3JtYWwgPSAnbm9ybWFsJyxcclxuICAgIGJvbGQgPSAnYm9sZCcsXHJcbiAgICBib2xkZXIgPSAnYm9sZGVyJyxcclxuICAgIGxpZ2h0ZXIgPSAnbGlnaHRlcicsXHJcblxyXG59XHJcbmV4cG9ydCBjbGFzcyBCcmlzdG9sRm9udCB7XHJcbiAgICBzdHlsZTogQnJpc3RvbEZvbnRTdHlsZSA9IEJyaXN0b2xGb250U3R5bGUuTm9ybWFsXHJcbiAgICB3ZWlnaHQ6IEJyaXN0b2xGb250V2VpZ2h0IHwgbnVtYmVyID0gQnJpc3RvbEZvbnRXZWlnaHQubm9ybWFsO1xyXG4gICAgZmFtaWx5OiBCcmlzdG9sRm9udEZhbWlseSA9IEJyaXN0b2xGb250RmFtaWx5Lk1vbm9zcGFjZTtcclxuICAgIHNpemU6IG51bWJlciA9IDEyO1xyXG4gICAgdG9TdHJpbmcoKSB7XHJcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuc2l6ZX1weCAke3RoaXMuZmFtaWx5fWAvLyAke3RoaXMuc3R5bGV9ICR7dGhpcy53ZWlnaHR9XHJcbiAgICB9XHJcbn1cclxudmFyIE1PVVNFX0lOUFVUX01BUCA9IHtcclxuICAgIG1vdXNlZG93bjogSGFtbWVyLklOUFVUX1NUQVJULFxyXG4gICAgbW91c2Vtb3ZlOiBIYW1tZXIuSU5QVVRfTU9WRSxcclxuICAgIG1vdXNldXA6IEhhbW1lci5JTlBVVF9FTkRcclxufTtcclxuLy9vdmVycmlkZVxyXG5sZXQgYmFzZUNsYXNzID0gSGFtbWVyLk1vdXNlSW5wdXRcclxubmFtZXNwYWNlIEhhbW1lclN0YXRpYyB7XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIE1vdXNlSW5wdXQgZXh0ZW5kcyBGdW5jdGlvbiB7IH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIElucHV0RXZlbnQge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBlbnVtIElucHV0RXZlbnRBY3Rpb24ge1xyXG4gICAgRG93biwgVXBcclxufVxyXG5cclxuZXhwb3J0IGVudW0gS2V5Ym9hcmRJbnB1dEtleSB7XHJcbiAgICBhID0gJ2EnLCBiID0gJ2InLCBjID0gJ2MnLCBkID0gJ2QnLCBlID0gJ2UnLCBmID0gJ2YnLCBnID0gJ2cnLCBoID0gJ2gnLCBpID0gJ2knLCBqID0gJ2onLCBrID0gJ2snLCBsID0gJ2wnLCBtID0gJ20nLCBuID0gJ24nLCBvID0gJzAnLCBwID0gJ3AnLFxyXG4gICAgcSA9ICdxJywgciA9ICdyJywgcyA9ICdzJywgdCA9ICd0JywgdSA9ICd1JywgdiA9ICd2JywgdyA9ICd3JywgeCA9ICd4JywgeSA9ICd5JywgeiA9ICd6Jywgc2hpZnQgPSAnc2hpZnQnLCBlbnRlciA9ICdlbnRlcicsIGN0cmwgPSAnY3RybCcsIGFsdCA9ICdhbHQnXHJcbn1cclxuZXhwb3J0IGNsYXNzIEtleWJvYXJkSW5wdXRFdmVudCBleHRlbmRzIElucHV0RXZlbnQge1xyXG4gICAga2V5OiBzdHJpbmdcclxuICAgIGlzQWx0OiBib29sZWFuO1xyXG4gICAgaXNDdHJsOiBib29sZWFuO1xyXG4gICAgaXNTaGlmdDogYm9vbGVhbjtcclxuICAgIGFjdGlvbjogSW5wdXRFdmVudEFjdGlvblxyXG4gICAgY29uc3RydWN0b3IoYWN0aW9uOiBJbnB1dEV2ZW50QWN0aW9uLCBrZXk6IHN0cmluZywgaXNTaGlmdDogYm9vbGVhbiwgaXNDdHJsOiBib29sZWFuLCBpc0FsdDogYm9vbGVhbikge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb24gPSBhY3Rpb247XHJcbiAgICAgICAgdGhpcy5rZXkgPSBrZXk7XHJcbiAgICAgICAgdGhpcy5pc1NoaWZ0ID0gaXNTaGlmdDtcclxuICAgICAgICB0aGlzLmlzQ3RybCA9IGlzQ3RybDtcclxuICAgICAgICB0aGlzLmlzQWx0ID0gaXNBbHQ7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIE1vdXNlSW5wdXRFdmVudCBleHRlbmRzIElucHV0RXZlbnQge1xyXG4gICAgeDogbnVtYmVyO1xyXG4gICAgeTogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgTW91c2VCdG5JbnB1dEV2ZW50IGV4dGVuZHMgTW91c2VJbnB1dEV2ZW50IHtcclxuICAgIGJ0bjogbnVtYmVyO1xyXG4gICAgYWN0aW9uOiBJbnB1dEV2ZW50QWN0aW9uO1xyXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIsIGJ0bjogbnVtYmVyLCBhY3Rpb246IElucHV0RXZlbnRBY3Rpb24gPSBudWxsKSB7XHJcbiAgICAgICAgc3VwZXIoeCwgeSk7XHJcbiAgICAgICAgdGhpcy5hY3Rpb24gPSBhY3Rpb247XHJcbiAgICAgICAgdGhpcy5idG4gPSBidG47XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIE1vdXNlTW92ZWRJbnB1dEV2ZW50IGV4dGVuZHMgTW91c2VJbnB1dEV2ZW50IHtcclxuICAgIGRlbHRhWDogbnVtYmVyO1xyXG4gICAgZGVsdGFZOiBudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlciwgZGVsdGFYOiBudW1iZXIsIGRlbHRhWTogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIoeCwgeSk7XHJcbiAgICAgICAgdGhpcy5kZWx0YVggPSBkZWx0YVg7XHJcbiAgICAgICAgdGhpcy5kZWx0YVkgPSBkZWx0YVk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIE1vdXNlU2Nyb2xsZWRJbnB1dEV2ZW50IGV4dGVuZHMgTW91c2VJbnB1dEV2ZW50IHtcclxuICAgIGFtb3VudDogbnVtYmVyXHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlciwgYW1vdW50OiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlcih4LCB5KTtcclxuICAgICAgICB0aGlzLmFtb3VudCA9IGFtb3VudDtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgTW91c2VEcmFnZ2VkSW5wdXRFdmVudCBleHRlbmRzIE1vdXNlTW92ZWRJbnB1dEV2ZW50IHtcclxuICAgIGJ0bjogbnVtYmVyXHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlciwgYnRuOiBudW1iZXIsIGRlbHRhWDogbnVtYmVyLCBkZWx0YVk6IG51bWJlcikge1xyXG4gICAgICAgIHN1cGVyKHgsIHksIGRlbHRhWCwgZGVsdGFZKTtcclxuICAgICAgICB0aGlzLmJ0biA9IGJ0bjtcclxuICAgIH1cclxufVxyXG5leHBvcnQgaW50ZXJmYWNlIENvcm5lclJhZGl1cyB7XHJcbiAgICB1cHBlckxlZnQ6IG51bWJlclxyXG4gICAgdXBwZXJSaWdodDogbnVtYmVyXHJcbiAgICBsb3dlckxlZnQ6IG51bWJlclxyXG4gICAgbG93ZXJSaWdodDogbnVtYmVyXHJcbn1cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJyaXN0b2xCb2FyZCB7XHJcblxyXG4gICAgY29udGFpbmVyRGl2OiBGSFRNTDxIVE1MRGl2RWxlbWVudD47XHJcbiAgICBjYW52YXM6IEZIVE1MPEhUTUxDYW52YXNFbGVtZW50PjtcclxuICAgIGNhbnZhc0VsZW06IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgY29udGFpbmVyRGl2RWxlbTogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICAgIC8vIGpvYkV4ZWN1dG9yOiBKb2JFeGVjdXRvciA9IG51bGw7XHJcbiAgICBrZXlib2FyZFN0YXRlOiBNYXA8c3RyaW5nLCBib29sZWFuPiA9IG5ldyBNYXAoKVxyXG4gICAgaXNLZXlQcmVzc2VkKGtleTogS2V5Ym9hcmRJbnB1dEtleSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmtleWJvYXJkU3RhdGUuZ2V0KGtleSkgfHwgZmFsc2U7XHJcbiAgICB9XHJcbiAgICBkZWJ1Z2dlckZsYWdzOiB7XHJcbiAgICAgICAgdWlGcmFtZU91dGxpbmVzOiBib29sZWFuXHJcbiAgICB9ID0ge1xyXG4gICAgICAgICAgICB1aUZyYW1lT3V0bGluZXM6IGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgY29uc3RydWN0b3IoY29udGFpbmVyRGl2RWxlbTogSFRNTERpdkVsZW1lbnQsIG9uSW5pdGlhbGl6ZWQ6IChicmlzdDogQnJpc3RvbEJvYXJkKSA9PiBQcm9taXNlPHZvaWQ+KSB7XHJcbiAgICAgICAgbGV0IHRocyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy51aUVsZW1lbnRzID0gU29ydGVkTGlua2VkTGlzdC5DcmVhdGUoKGE6IFVJRWxlbWVudDxhbnk+LCBiOiBVSUVsZW1lbnQ8YW55PikgPT4gKGEuZGVwdGggLSBiLmRlcHRoKSk7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXYgPSBuZXcgRkhUTUwoY29udGFpbmVyRGl2RWxlbSk7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXJEaXZFbGVtID0gY29udGFpbmVyRGl2RWxlbTtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IG5ldyBGSFRNTChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKSk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuYXR0cignb25jb250ZXh0bWVudScsICdyZXR1cm4gZmFsc2UnKTtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmQodGhpcy5jYW52YXMpO1xyXG5cclxuICAgICAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmVsZW1lbnQuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICAvLyBpZiAodGhpcy5zaG91bGRFeGVjSm9icygpKSB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMuam9iRXhlY3V0b3IgPSBuZXcgSm9iRXhlY3V0b3IoKTtcclxuICAgICAgICAvLyAgICAgQ2VyZWFsQm94LmpvYkV4ZWN1dG9yID0gdGhpcy5qb2JFeGVjdXRvcjtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgdGhpcy5vblJlc2l6ZSgpO1xyXG4gICAgICAgIHRoaXMubGFzdERyYXdUaW1lID0gRGF0ZS5ub3coKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgKGV2dDogV2hlZWxFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICB0aHMubW91c2VTY3JvbGxlZChuZXcgTW91c2VTY3JvbGxlZElucHV0RXZlbnQodGhzLmlNb3VzZVgsIHRocy5pTW91c2VZLCBldnQuZGVsdGFZKSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLmhhbW1lck1hbmFnZXIgPSBuZXcgSGFtbWVyLk1hbmFnZXIodGhpcy5jYW52YXMuZWxlbWVudCk7XHJcbiAgICAgICAgdGhpcy5yb3RhdGVSZWNvZ25pemVyID0gbmV3IEhhbW1lci5Sb3RhdGUoKTtcclxuICAgICAgICB0aGlzLnBhblJlY29nbml6ZXIgPSBuZXcgSGFtbWVyLlBhbigpO1xyXG4gICAgICAgIHRoaXMuaGFtbWVyTWFuYWdlci5hZGQodGhpcy5yb3RhdGVSZWNvZ25pemVyKTtcclxuICAgICAgICB0aGlzLmhhbW1lck1hbmFnZXIuYWRkKHRoaXMucGFuUmVjb2duaXplcik7XHJcblxyXG4gICAgICAgIHRoaXMuaGFtbWVyTWFuYWdlci5vbigncGFuc3RhcnQnLCAoZXZ0OiBIYW1tZXJJbnB1dCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmxhc3RTY3JvbGxPZmZzZXQgPSBbMCwgMF07XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1vdXNlUHJlc3NlZChuZXcgTW91c2VCdG5JbnB1dEV2ZW50KGV2dC5jZW50ZXIueCwgZXZ0LmNlbnRlci55LCAxLCBJbnB1dEV2ZW50QWN0aW9uLkRvd24pKSkge1xyXG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMuaGFtbWVyTWFuYWdlci5vbigncGFuZW5kJywgKGV2dDogSGFtbWVySW5wdXQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5sYXN0U2Nyb2xsT2Zmc2V0ID0gWzAsIDBdO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMubW91c2VSZWxlYXNlZChuZXcgTW91c2VCdG5JbnB1dEV2ZW50KGV2dC5jZW50ZXIueCwgZXZ0LmNlbnRlci55LCAxLCBJbnB1dEV2ZW50QWN0aW9uLlVwKSkpIHtcclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLmhhbW1lck1hbmFnZXIub24oJ3BhbicsIChldnQ6IEhhbW1lcklucHV0KSA9PiB7XHJcbiAgICAgICAgICAgIHRocy5zY3JvbGxEZWx0YVggKz0gZXZ0LmRlbHRhWCAtIHRocy5sYXN0U2Nyb2xsT2Zmc2V0WzBdO1xyXG4gICAgICAgICAgICB0aHMuc2Nyb2xsRGVsdGFZICs9IGV2dC5kZWx0YVkgLSB0aHMubGFzdFNjcm9sbE9mZnNldFsxXTtcclxuICAgICAgICAgICAgdGhzLmxhc3RTY3JvbGxPZmZzZXRbMF0gPSBldnQuZGVsdGFYO1xyXG4gICAgICAgICAgICB0aHMubGFzdFNjcm9sbE9mZnNldFsxXSA9IGV2dC5kZWx0YVk7XHJcbiAgICAgICAgICAgIGlmIChNYXRoLm1heChNYXRoLmFicyh0aGlzLnNjcm9sbERlbHRhWCksIE1hdGguYWJzKHRoaXMuc2Nyb2xsRGVsdGFZKSkgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgY29uc29sZS5sb2coYCR7dGhpcy5zY3JvbGxEZWx0YVh9LCAke3RoaXMuc2Nyb2xsRGVsdGFZfWApO1xyXG4gICAgICAgICAgICAgICAgdGhzLm1vdXNlRHJhZ2dlZChuZXcgTW91c2VEcmFnZ2VkSW5wdXRFdmVudChldnQuY2VudGVyLngsIGV2dC5jZW50ZXIueSwgMSwgdGhzLnNjcm9sbERlbHRhWCwgdGhzLnNjcm9sbERlbHRhWSkpXHJcbiAgICAgICAgICAgICAgICAvLyB0aHMubW91c2VEcmFnZ2VkKGV2dCwgdGhpcy5zY3JvbGxEZWx0YVgsIHRoaXMuc2Nyb2xsRGVsdGFZKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsRGVsdGFYID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsRGVsdGFZID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZ0OiBLZXlib2FyZEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIC8vIHZhciBpbnB1dEtleTogS2V5Ym9hcmRJbnB1dEtleVxyXG4gICAgICAgICAgICAvLyBpZihldnQuc2hpZnRLZXkpe1xyXG4gICAgICAgICAgICAvLyAgICAgaW5wdXRLZXkgPSBLZXlib2FyZElucHV0S2V5LnNoaWZ0O1xyXG4gICAgICAgICAgICAvLyB9IGVsc2UgaWYoZXZ0LmN0cmxLZXkpe1xyXG4gICAgICAgICAgICAvLyAgICAgaW5wdXRLZXkgPSBLZXlib2FyZElucHV0S2V5LmN0cmw7XHJcbiAgICAgICAgICAgIC8vIH0gZWxzZSBpZihldnQuYWx0S2V5KXtcclxuICAgICAgICAgICAgLy8gICAgIGlucHV0S2V5ID0gS2V5Ym9hcmRJbnB1dEtleS5hbHQ7XHJcblxyXG4gICAgICAgICAgICAvLyB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyAgICAgaW5wdXRLZXkgPSBLZXlib2FyZElucHV0S2V5W2V2dC5rZXkudG9Mb3dlckNhc2UoKV07XHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgdGhpcy5rZXlib2FyZFN0YXRlLnNldChldnQua2V5LCB0cnVlKTtcclxuICAgICAgICAgICAgbGV0IGV2ZW50ID0gbmV3IEtleWJvYXJkSW5wdXRFdmVudChJbnB1dEV2ZW50QWN0aW9uLkRvd24sIGV2dC5rZXksIHRoaXMuaXNLZXlQcmVzc2VkKEtleWJvYXJkSW5wdXRLZXkuc2hpZnQpLCB0aGlzLmlzS2V5UHJlc3NlZChLZXlib2FyZElucHV0S2V5LmN0cmwpLCB0aGlzLmlzS2V5UHJlc3NlZChLZXlib2FyZElucHV0S2V5LmFsdCkpXHJcbiAgICAgICAgICAgIGlmICh0aHMua2V5RG93bihldmVudCkpIHtcclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChldnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMua2V5Ym9hcmRTdGF0ZS5zZXQoZXZ0LmtleSwgZmFsc2UpO1xyXG4gICAgICAgICAgICBsZXQgZXZlbnQgPSBuZXcgS2V5Ym9hcmRJbnB1dEV2ZW50KElucHV0RXZlbnRBY3Rpb24uRG93biwgZXZ0LmtleSwgdGhpcy5pc0tleVByZXNzZWQoS2V5Ym9hcmRJbnB1dEtleS5zaGlmdCksIHRoaXMuaXNLZXlQcmVzc2VkKEtleWJvYXJkSW5wdXRLZXkuY3RybCksIHRoaXMuaXNLZXlQcmVzc2VkKEtleWJvYXJkSW5wdXRLZXkuYWx0KSlcclxuICAgICAgICAgICAgaWYgKHRocy5rZXlVcChldmVudCkpIHtcclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoZXZ0OiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBwYXJlbnRPZmZzZXQgPSB0aHMuY2FudmFzLm9mZnNldCgpO1xyXG4gICAgICAgICAgICAvL29yICQodGhpcykub2Zmc2V0KCk7IGlmIHlvdSByZWFsbHkganVzdCB3YW50IHRoZSBjdXJyZW50IGVsZW1lbnQncyBvZmZzZXRcclxuICAgICAgICAgICAgdmFyIHJlbFggPSBldnQucGFnZVggLSBwYXJlbnRPZmZzZXQubGVmdDtcclxuICAgICAgICAgICAgdmFyIHJlbFkgPSBldnQucGFnZVkgLSBwYXJlbnRPZmZzZXQudG9wO1xyXG4gICAgICAgICAgICBsZXQgZGVsdGFYID0gcmVsWCAtIHRocy5pTW91c2VYO1xyXG4gICAgICAgICAgICBsZXQgZGVsdGFZID0gcmVsWSAtIHRocy5pTW91c2VZO1xyXG4gICAgICAgICAgICB0aHMuaU1vdXNlWCA9IHJlbFg7XHJcbiAgICAgICAgICAgIHRocy5pTW91c2VZID0gcmVsWTtcclxuICAgICAgICAgICAgdGhzLm1vdXNlTW92ZWQobmV3IE1vdXNlTW92ZWRJbnB1dEV2ZW50KHJlbFgsIHJlbFksIGRlbHRhWCwgZGVsdGFZKSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZXZ0OiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBwYXJlbnRPZmZzZXQgPSB0aHMuY2FudmFzLm9mZnNldCgpO1xyXG4gICAgICAgICAgICAvL29yICQodGhpcykub2Zmc2V0KCk7IGlmIHlvdSByZWFsbHkganVzdCB3YW50IHRoZSBjdXJyZW50IGVsZW1lbnQncyBvZmZzZXRcclxuICAgICAgICAgICAgdmFyIHJlbFggPSBldnQucGFnZVggLSBwYXJlbnRPZmZzZXQubGVmdDtcclxuICAgICAgICAgICAgdmFyIHJlbFkgPSBldnQucGFnZVkgLSBwYXJlbnRPZmZzZXQudG9wO1xyXG4gICAgICAgICAgICBpZiAocmVsWCA+PSAwICYmIHJlbFggPD0gcGFyZW50T2Zmc2V0LmxlZnQgKyB0aHMuY2FudmFzLndpZHRoICYmXHJcbiAgICAgICAgICAgICAgICByZWxZID49IDAgJiYgcmVsWSA8PSBwYXJlbnRPZmZzZXQudG9wICsgdGhzLmNhbnZhcy5oZWlnaHQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tb3VzZVByZXNzZWQobmV3IE1vdXNlQnRuSW5wdXRFdmVudChyZWxYLCByZWxZLCBldnQud2hpY2gsIElucHV0RXZlbnRBY3Rpb24uRG93bikpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoZXZ0OiBNb3VzZUV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBwYXJlbnRPZmZzZXQgPSB0aHMuY2FudmFzLm9mZnNldCgpO1xyXG4gICAgICAgICAgICAvL29yICQodGhpcykub2Zmc2V0KCk7IGlmIHlvdSByZWFsbHkganVzdCB3YW50IHRoZSBjdXJyZW50IGVsZW1lbnQncyBvZmZzZXRcclxuICAgICAgICAgICAgdmFyIHJlbFggPSBldnQucGFnZVggLSBwYXJlbnRPZmZzZXQubGVmdDtcclxuICAgICAgICAgICAgdmFyIHJlbFkgPSBldnQucGFnZVkgLSBwYXJlbnRPZmZzZXQudG9wO1xyXG4gICAgICAgICAgICBpZiAocmVsWCA+PSAwICYmIHJlbFggPD0gcGFyZW50T2Zmc2V0LmxlZnQgKyB0aHMuY2FudmFzLndpZHRoICYmXHJcbiAgICAgICAgICAgICAgICByZWxZID49IDAgJiYgcmVsWSA8PSBwYXJlbnRPZmZzZXQudG9wICsgdGhzLmNhbnZhcy5oZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1vdXNlUmVsZWFzZWQobmV3IE1vdXNlQnRuSW5wdXRFdmVudChyZWxYLCByZWxZLCBldnQud2hpY2gsIElucHV0RXZlbnRBY3Rpb24uVXApKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAvLyB0aGlzLmNhbnZhcy5vbigna2V5ZG93bicsIChldmVudDogSlF1ZXJ5LktleURvd25FdmVudDxIVE1MQ2FudmFzRWxlbWVudCwgbnVsbCwgSFRNTENhbnZhc0VsZW1lbnQsIEhUTUxDYW52YXNFbGVtZW50Pik9PntcclxuICAgICAgICAvLyAgICAgcmV0dXJuIHRocy5rZXlEb3duKGV2ZW50KTtcclxuICAgICAgICAvLyB9KVxyXG4gICAgICAgIC8vIHRoaXMuY2FudmFzLm9uKCdrZXl1cCcsKGV2ZW50OiBLZXlib2FyZEV2ZW50KT0+e1xyXG4gICAgICAgIC8vICAgICByZXR1cm4gdGhzLmtleVVwKGV2ZW50KTtcclxuICAgICAgICAvLyB9KVxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5vbkluaXQoKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5kcmF3KCk7XHJcbiAgICAgICAgfSkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIG9uSW5pdGlhbGl6ZWQodGhzKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHVpRWxlbWVudHM6IFNvcnRlZExpbmtlZExpc3Q8VUlFbGVtZW50PGFueT4+XHJcbiAgICBtb3VzZVByZXNzZWQoZXZ0OiBNb3VzZUJ0bklucHV0RXZlbnQpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBtb3VzZVJlbGVhc2VkKGV2dDogTW91c2VCdG5JbnB1dEV2ZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgbW91c2VNb3ZlZChldmVudDogTW91c2VNb3ZlZElucHV0RXZlbnQpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBrZXlVcChldmVudDogS2V5Ym9hcmRJbnB1dEV2ZW50KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAga2V5RG93bihldmVudDogS2V5Ym9hcmRJbnB1dEV2ZW50KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcGl4ZWxEZW5zaXR5KCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBsYXN0U2Nyb2xsT2Zmc2V0OiBbbnVtYmVyLCBudW1iZXJdID0gWzAsIDBdO1xyXG4gICAgcHJpdmF0ZSBzY3JvbGxEZWx0YVk6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIHNjcm9sbERlbHRhWDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgaGFtbWVyTWFuYWdlcjogSGFtbWVyTWFuYWdlclxyXG4gICAgcHJpdmF0ZSByb3RhdGVSZWNvZ25pemVyOiBSb3RhdGVSZWNvZ25pemVyO1xyXG4gICAgcHJpdmF0ZSBwYW5SZWNvZ25pemVyOiBQYW5SZWNvZ25pemVyO1xyXG4gICAgcHJpdmF0ZSBsYXN0RHJhd1RpbWU6IG51bWJlcjtcclxuICAgIHByaXZhdGUgY3VycmVudERyYXdUaW1lOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIGRlbHRhRHJhd1RpbWU6IG51bWJlcjtcclxuICAgIGdldCB0YXJnZXRGcmFtZVRpbWUoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gMTAwMCAvIHRoaXMudGFyZ2V0RnBzO1xyXG4gICAgfVxyXG4gICAgZ2V0IGZwcygpIHtcclxuICAgICAgICByZXR1cm4gMSAvICh0aGlzLmRlbHRhRHJhd1RpbWUgLyAxMDAwKVxyXG4gICAgfVxyXG4gICAgZ2V0IHBlcmZvcm1hbmNlUmF0aW8oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGFyZ2V0RnBzIC8gdGhpcy5kZWx0YURyYXdUaW1lXHJcbiAgICB9XHJcbiAgICBnZXQgYXZnUGVyZlJhdGlvKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBlcmZBdmcudmFsO1xyXG4gICAgfVxyXG4gICAgcGVyZkF2ZzogQXZlcmFnZXIgPSBuZXcgQXZlcmFnZXIoMjApO1xyXG4gICAgdGFyZ2V0RnBzOiBudW1iZXIgPSAyMDtcclxuICAgIHByaXZhdGUgZHJhd1Byb206IFByb21pc2U8dm9pZD4gPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBhc3luYyBkcmF3KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRyYXdQcm9tICE9IG51bGwpIHtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5kcmF3UHJvbTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmN1cnJlbnREcmF3VGltZSA9IERhdGUubm93KCk7XHJcbiAgICAgICAgdGhpcy5kZWx0YURyYXdUaW1lID0gKHRoaXMuY3VycmVudERyYXdUaW1lIC0gdGhpcy5sYXN0RHJhd1RpbWUpO1xyXG4gICAgICAgIHRoaXMucGVyZkF2Zy5hZGQodGhpcy5wZXJmb3JtYW5jZVJhdGlvKTtcclxuICAgICAgICB0aGlzLmRyYXdQcm9tID0gdGhpcy5vbkRyYXcodGhpcy5kZWx0YURyYXdUaW1lKTtcclxuICAgICAgICBhd2FpdCB0aGlzLmRyYXdQcm9tO1xyXG4gICAgICAgIHRoaXMubGFzdERyYXdUaW1lID0gdGhpcy5jdXJyZW50RHJhd1RpbWU7XHJcbiAgICAgICAgbGV0IHRocyA9IHRoaXM7XHJcbiAgICAgICAgLy8gaWYgKHRoaXMuc2hvdWxkRXhlY0pvYnMoKSkge1xyXG4gICAgICAgIC8vICAgICBhd2FpdCB0aGlzLmpvYkV4ZWN1dG9yLmV4ZWNKb2JzKCk7XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIHRoaXMuZHJhd1Byb20gPSBudWxsO1xyXG4gICAgICAgIGlmICh0aGlzLmF1dG9GcmFtZXMpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcclxuICAgICAgICAgICAgfSwgTWF0aC5tYXgodGhpcy50YXJnZXRGcmFtZVRpbWUgLSB0aGlzLmRlbHRhRHJhd1RpbWUsIDApKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBkcmF3RnJhbWUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZHJhd1Byb20gPT0gbnVsbCAmJiAhdGhpcy5hdXRvRnJhbWVzKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5kcmF3LmJpbmQodGhpcykpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgYXV0b0ZyYW1lczogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBnZXQgd2lkdGgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaVdpZHRoO1xyXG4gICAgfVxyXG4gICAgZ2V0IGhlaWdodCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pSGVpZ2h0O1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBpV2lkdGg6IG51bWJlcjtcclxuICAgIHByaXZhdGUgaUhlaWdodDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBpTW91c2VYOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIGlNb3VzZVk6IG51bWJlcjtcclxuICAgIGdldCBtb3VzZVgoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pTW91c2VYO1xyXG4gICAgfVxyXG4gICAgZ2V0IG1vdXNlWSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmlNb3VzZVk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIG9uUmVzaXplKCkge1xyXG4gICAgICAgIHRoaXMuaVdpZHRoID0gdGhpcy5jb250YWluZXJEaXYud2lkdGg7XHJcbiAgICAgICAgdGhpcy5pSGVpZ2h0ID0gdGhpcy5jb250YWluZXJEaXYuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmVsZW1lbnQud2lkdGggPSB0aGlzLmlXaWR0aDtcclxuICAgICAgICB0aGlzLmNhbnZhcy5lbGVtZW50LmhlaWdodCA9IHRoaXMuaUhlaWdodDtcclxuICAgICAgICB0aGlzLmNhbnZhcy5zZXRDc3MoJ3dpZHRoJywgYCR7dGhpcy5pV2lkdGh9cHhgKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5zZXRDc3MoJ2hlaWdodCcsIGAke3RoaXMuaUhlaWdodH1weGApO1xyXG4gICAgfVxyXG4gICAgZGlzcGxheURlbnNpdHkoKSB7XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgbm9TdHlsZTogc3RyaW5nID0gJydcclxuICAgIHN0cm9rZUNvbG9yKHN0eWxlOiBGQ29sb3IpIHtcclxuICAgICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IHN0eWxlPy50b0hleFN0cmluZygpID8/ICcjMDAwMDAwJztcclxuICAgIH1cclxuICAgIHJvdW5kZWRSZWN0KHg6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlciwgcmFkOiBudW1iZXIgfCBDb3JuZXJSYWRpdXMpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHJhZCA9PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgICByYWQgPSB7XHJcbiAgICAgICAgICAgICAgICBsb3dlckxlZnQ6IHJhZCxcclxuICAgICAgICAgICAgICAgIGxvd2VyUmlnaHQ6IHJhZCxcclxuICAgICAgICAgICAgICAgIHVwcGVyTGVmdDogcmFkLFxyXG4gICAgICAgICAgICAgICAgdXBwZXJSaWdodDogcmFkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHVwcGVyTGVmdDogW251bWJlciwgbnVtYmVyXSA9IFt4LCB5XTtcclxuICAgICAgICBsZXQgdXBwZXJSaWdodDogW251bWJlciwgbnVtYmVyXSA9IFt4ICsgdywgeV07XHJcbiAgICAgICAgbGV0IGxvd2VyUmlnaHQ6IFtudW1iZXIsIG51bWJlcl0gPSBbeCArIHcsIHkgKyBoXTtcclxuICAgICAgICBsZXQgbG93ZXJMZWZ0OiBbbnVtYmVyLCBudW1iZXJdID0gW3gsIHkgKyBoXTtcclxuXHJcbiAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgdGhpcy5jdHgubW92ZVRvKHVwcGVyTGVmdFswXSArIHJhZC51cHBlckxlZnQsIHVwcGVyTGVmdFsxXSk7XHJcbiAgICAgICAgdGhpcy5jdHgubGluZVRvKHVwcGVyUmlnaHRbMF0gLSByYWQudXBwZXJSaWdodCwgdXBwZXJSaWdodFsxXSk7XHJcbiAgICAgICAgdGhpcy5jdHguYXJjVG8odXBwZXJSaWdodFswXSwgdXBwZXJSaWdodFsxXSwgdXBwZXJSaWdodFswXSwgdXBwZXJSaWdodFsxXSArIHJhZC51cHBlclJpZ2h0LCByYWQudXBwZXJSaWdodCk7XHJcbiAgICAgICAgdGhpcy5jdHgubGluZVRvKGxvd2VyUmlnaHRbMF0sIGxvd2VyUmlnaHRbMV0gLSByYWQubG93ZXJSaWdodCk7XHJcbiAgICAgICAgdGhpcy5jdHguYXJjVG8obG93ZXJSaWdodFswXSwgbG93ZXJSaWdodFsxXSwgbG93ZXJSaWdodFswXSAtIHJhZC5sb3dlclJpZ2h0LCBsb3dlclJpZ2h0WzFdLCByYWQubG93ZXJSaWdodCk7XHJcbiAgICAgICAgdGhpcy5jdHgubGluZVRvKGxvd2VyTGVmdFswXSArIHJhZC5sb3dlckxlZnQsIGxvd2VyTGVmdFsxXSk7XHJcbiAgICAgICAgdGhpcy5jdHguYXJjVG8obG93ZXJMZWZ0WzBdLCBsb3dlckxlZnRbMV0sIGxvd2VyTGVmdFswXSwgbG93ZXJMZWZ0WzFdIC0gcmFkLmxvd2VyTGVmdCwgcmFkLmxvd2VyTGVmdCk7XHJcbiAgICAgICAgdGhpcy5jdHgubGluZVRvKHVwcGVyTGVmdFswXSwgdXBwZXJMZWZ0WzFdICsgcmFkLnVwcGVyTGVmdCk7XHJcbiAgICAgICAgdGhpcy5jdHguYXJjVG8odXBwZXJMZWZ0WzBdLCB1cHBlckxlZnRbMV0sIHVwcGVyTGVmdFswXSArIHJhZC51cHBlckxlZnQsIHVwcGVyTGVmdFsxXSwgcmFkLnVwcGVyTGVmdCk7XHJcbiAgICAgICAgdGhpcy5jdHguY2xvc2VQYXRoKCk7XHJcbiAgICB9XHJcbiAgICByb3VuZGVkUmVjdEZyYW1lKGZyYW1lOiBVSUZyYW1lX0Fic3RyYWN0LCByYWQ6IG51bWJlciB8IENvcm5lclJhZGl1cywgZmlsbDogYm9vbGVhbiA9IGZhbHNlLCBzdHJva2U6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgcmFkID09ICdudW1iZXInKSB7XHJcbiAgICAgICAgICAgIHJhZCA9IHtcclxuICAgICAgICAgICAgICAgIGxvd2VyTGVmdDogcmFkLFxyXG4gICAgICAgICAgICAgICAgbG93ZXJSaWdodDogcmFkLFxyXG4gICAgICAgICAgICAgICAgdXBwZXJMZWZ0OiByYWQsXHJcbiAgICAgICAgICAgICAgICB1cHBlclJpZ2h0OiByYWRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdXBwZXJMZWZ0OiBbbnVtYmVyLCBudW1iZXJdID0gW2ZyYW1lLmxlZnRYKCksIGZyYW1lLnRvcFkoKV07XHJcbiAgICAgICAgbGV0IHVwcGVyUmlnaHQ6IFtudW1iZXIsIG51bWJlcl0gPSBbZnJhbWUucmlnaHRYKCksIGZyYW1lLnRvcFkoKV07XHJcbiAgICAgICAgbGV0IGxvd2VyUmlnaHQ6IFtudW1iZXIsIG51bWJlcl0gPSBbZnJhbWUucmlnaHRYKCksIGZyYW1lLmJvdHRvbVkoKV07XHJcbiAgICAgICAgbGV0IGxvd2VyTGVmdDogW251bWJlciwgbnVtYmVyXSA9IFtmcmFtZS5sZWZ0WCgpLCBmcmFtZS5ib3R0b21ZKCldO1xyXG5cclxuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICB0aGlzLmN0eC5tb3ZlVG8odXBwZXJMZWZ0WzBdICsgcmFkLnVwcGVyTGVmdCwgdXBwZXJMZWZ0WzFdKTtcclxuICAgICAgICB0aGlzLmN0eC5saW5lVG8odXBwZXJSaWdodFswXSAtIHJhZC51cHBlclJpZ2h0LCB1cHBlclJpZ2h0WzFdKTtcclxuICAgICAgICB0aGlzLmN0eC5hcmNUbyh1cHBlclJpZ2h0WzBdLCB1cHBlclJpZ2h0WzFdLCB1cHBlclJpZ2h0WzBdLCB1cHBlclJpZ2h0WzFdICsgcmFkLnVwcGVyUmlnaHQsIHJhZC51cHBlclJpZ2h0KTtcclxuICAgICAgICB0aGlzLmN0eC5saW5lVG8obG93ZXJSaWdodFswXSwgbG93ZXJSaWdodFsxXSAtIHJhZC5sb3dlclJpZ2h0KTtcclxuICAgICAgICB0aGlzLmN0eC5hcmNUbyhsb3dlclJpZ2h0WzBdLCBsb3dlclJpZ2h0WzFdLCBsb3dlclJpZ2h0WzBdIC0gcmFkLmxvd2VyUmlnaHQsIGxvd2VyUmlnaHRbMV0sIHJhZC5sb3dlclJpZ2h0KTtcclxuICAgICAgICB0aGlzLmN0eC5saW5lVG8obG93ZXJMZWZ0WzBdICsgcmFkLmxvd2VyTGVmdCwgbG93ZXJMZWZ0WzFdKTtcclxuICAgICAgICB0aGlzLmN0eC5hcmNUbyhsb3dlckxlZnRbMF0sIGxvd2VyTGVmdFsxXSwgbG93ZXJMZWZ0WzBdLCBsb3dlckxlZnRbMV0gLSByYWQubG93ZXJMZWZ0LCByYWQubG93ZXJMZWZ0KTtcclxuICAgICAgICB0aGlzLmN0eC5saW5lVG8odXBwZXJMZWZ0WzBdLCB1cHBlckxlZnRbMV0gKyByYWQudXBwZXJMZWZ0KTtcclxuICAgICAgICB0aGlzLmN0eC5hcmNUbyh1cHBlckxlZnRbMF0sIHVwcGVyTGVmdFsxXSwgdXBwZXJMZWZ0WzBdICsgcmFkLnVwcGVyTGVmdCwgdXBwZXJMZWZ0WzFdLCByYWQudXBwZXJMZWZ0KTtcclxuICAgICAgICB0aGlzLmN0eC5jbG9zZVBhdGgoKTtcclxuXHJcbiAgICAgICAgaWYgKGZpbGwpIHtcclxuICAgICAgICAgICAgdGhpcy5jdHguZmlsbCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc3Ryb2tlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIHJlY3RGcmFtZShmcmFtZTogVUlGcmFtZSwgcmFkOiBudW1iZXIgfCBDb3JuZXJSYWRpdXMpIHtcclxuICAgIC8vICAgICBsZXQgdXBwZXJMZWZ0OiBbbnVtYmVyLCBudW1iZXJdID0gW2ZyYW1lLnVwTGVmdFgoKSwgZnJhbWUudG9wWSgpXTtcclxuICAgIC8vICAgICBsZXQgdXBwZXJSaWdodDogW251bWJlciwgbnVtYmVyXSA9IFtmcmFtZS51cFJpZ2h0WCgpLCBmcmFtZS51cFJpZ2h0WSgpXTtcclxuICAgIC8vICAgICBsZXQgbG93ZXJSaWdodDogW251bWJlciwgbnVtYmVyXSA9IFtmcmFtZS5yaWdodFgoKSwgZnJhbWUuYm90dG9tWSgpXTtcclxuICAgIC8vICAgICBsZXQgbG93ZXJMZWZ0OiBbbnVtYmVyLCBudW1iZXJdID0gW2ZyYW1lLmxlZnRYKCksIGZyYW1lLmJvdHRvbVkoKV07XHJcblxyXG4gICAgLy8gICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgLy8gICAgIHRoaXMuY3R4Lm1vdmVUbyhmcmFtZS51cExlZnRYKCksIGZyYW1lLnRvcFkoKSk7XHJcbiAgICAvLyAgICAgdGhpcy5jdHgubGluZVRvKGZyYW1lLnVwUmlnaHRYKCksIGZyYW1lLnVwUmlnaHRZKCkpO1xyXG4gICAgLy8gICAgIHRoaXMuY3R4LmxpbmVUbyhmcmFtZS5yaWdodFgoKSwgZnJhbWUuYm90dG9tWSgpKTtcclxuICAgIC8vICAgICB0aGlzLmN0eC5saW5lVG8oZnJhbWUubGVmdFgoKSwgZnJhbWUuZG93bkxlZnRZKCkpO1xyXG4gICAgLy8gICAgIHRoaXMuY3R4LmxpbmVUbyhmcmFtZS51cExlZnRYKCksIGZyYW1lLnRvcFkoKSk7XHJcbiAgICAvLyAgICAgdGhpcy5jdHguY2xvc2VQYXRoKCk7XHJcbiAgICAvLyB9XHJcblxyXG5cclxuICAgIGNhbmRsZUljb24oeDogbnVtYmVyLCB5OiBudW1iZXIsIHc6IG51bWJlciwgaDogbnVtYmVyLCByYWQ6IG51bWJlciA9IDIsIHdpc2tlclNpemU6IFtudW1iZXIsIG51bWJlcl0gPSBbMC4yLCAwLjldLCBib3hTaXplOiBbbnVtYmVyLCBudW1iZXJdID0gWzAuNCwgMC42XSwgcGFkZGluZzogbnVtYmVyID0gMikge1xyXG4gICAgICAgIGxldCBib3hWUGFkZGluZyA9IChoIC0gKGggKiBib3hTaXplWzFdKSkgLyAyO1xyXG4gICAgICAgIGxldCBib3hXUGFkZGluZyA9ICh3IC0gKHcgKiBib3hTaXplWzBdKSkgLyAyO1xyXG4gICAgICAgIGxldCB3aXNrZXJWUGFkZGluZyA9IChoIC0gKGggKiB3aXNrZXJTaXplWzFdKSkgLyAyO1xyXG4gICAgICAgIGxldCB3aXNrZXJXUGFkZGluZyA9ICh3IC0gKHcgKiB3aXNrZXJTaXplWzBdKSkgLyAyO1xyXG4gICAgICAgIGxldCBib3hUb3AgPSB5ICsgYm94VlBhZGRpbmc7XHJcbiAgICAgICAgbGV0IGJveEJvdHRvbSA9IHkgKyBoIC0gYm94VlBhZGRpbmc7XHJcbiAgICAgICAgbGV0IGJveExlZnQgPSB4ICsgYm94V1BhZGRpbmc7XHJcbiAgICAgICAgbGV0IGJveFJpZ2h0ID0geCArIHcgLSBib3hXUGFkZGluZztcclxuXHJcbiAgICAgICAgbGV0IHdpc2tlclRvcCA9IHkgKyB3aXNrZXJWUGFkZGluZztcclxuICAgICAgICBsZXQgd2lza2VyQm90dG9tID0geSArIGggLSB3aXNrZXJWUGFkZGluZztcclxuICAgICAgICBsZXQgd2lza2VyTGVmdCA9IHggKyB3aXNrZXJXUGFkZGluZztcclxuICAgICAgICBsZXQgd2lza2VyUmlnaHQgPSB4ICsgdyAtIHdpc2tlcldQYWRkaW5nO1xyXG4gICAgICAgIGxldCBkYXRhOiBBcnJheTxbbnVtYmVyLCBudW1iZXJdIHwgW1tudW1iZXIsIG51bWJlcl0sIFtudW1iZXIsIG51bWJlcl0sIFtudW1iZXIsIG51bWJlcl0sIG51bWJlcl0+ID0gW1xyXG4gICAgICAgICAgICBbd2lza2VyTGVmdCwgYm94VG9wXSxcclxuICAgICAgICAgICAgW1t3aXNrZXJMZWZ0LCB3aXNrZXJUb3AgKyByYWRdLCBbd2lza2VyTGVmdCwgd2lza2VyVG9wXSwgW3dpc2tlckxlZnQgKyByYWQsIHdpc2tlclRvcF0sIHJhZF0sXHJcblxyXG4gICAgICAgICAgICBbW3dpc2tlclJpZ2h0IC0gcmFkLCB3aXNrZXJUb3BdLCBbd2lza2VyUmlnaHQsIHdpc2tlclRvcF0sIFt3aXNrZXJSaWdodCwgd2lza2VyVG9wICsgcmFkXSwgcmFkXSxcclxuICAgICAgICAgICAgW3dpc2tlclJpZ2h0LCBib3hUb3BdLFxyXG4gICAgICAgICAgICBbW2JveFJpZ2h0IC0gcmFkLCBib3hUb3BdLCBbYm94UmlnaHQsIGJveFRvcF0sIFtib3hSaWdodCwgYm94VG9wICsgcmFkXSwgcmFkXSxcclxuICAgICAgICAgICAgW1tib3hSaWdodCwgYm94Qm90dG9tIC0gcmFkXSwgW2JveFJpZ2h0LCBib3hCb3R0b21dLCBbYm94UmlnaHQgLSByYWQsIGJveEJvdHRvbV0sIHJhZF0sXHJcbiAgICAgICAgICAgIFt3aXNrZXJSaWdodCwgYm94Qm90dG9tXSxcclxuICAgICAgICAgICAgW1t3aXNrZXJSaWdodCwgd2lza2VyQm90dG9tIC0gcmFkXSwgW3dpc2tlclJpZ2h0LCB3aXNrZXJCb3R0b21dLCBbd2lza2VyUmlnaHQgLSByYWQsIHdpc2tlckJvdHRvbV0sIHJhZF0sXHJcbiAgICAgICAgICAgIFtbd2lza2VyTGVmdCArIHJhZCwgd2lza2VyQm90dG9tXSwgW3dpc2tlckxlZnQsIHdpc2tlckJvdHRvbV0sIFt3aXNrZXJMZWZ0LCB3aXNrZXJCb3R0b20gLSByYWRdLCByYWRdLFxyXG4gICAgICAgICAgICBbd2lza2VyTGVmdCwgYm94Qm90dG9tXSxcclxuICAgICAgICAgICAgW1tib3hMZWZ0ICsgcmFkLCBib3hCb3R0b21dLCBbYm94TGVmdCwgYm94Qm90dG9tXSwgW2JveExlZnQsIGJveEJvdHRvbSAtIHJhZF0sIHJhZF0sXHJcbiAgICAgICAgICAgIFtbYm94TGVmdCwgYm94VG9wICsgcmFkXSwgW2JveExlZnQsIGJveFRvcF0sIFtib3hMZWZ0ICsgcmFkLCBib3hUb3BdLCByYWRdLFxyXG4gICAgICAgICAgICBbd2lza2VyTGVmdCwgYm94VG9wXVxyXG4gICAgICAgIF1cclxuICAgICAgICAvL1t4LCB5XSB8IFtbeCx5XSxbeCx5XSxbeCx5XSxyYWRpdXNdXHJcbiAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcblxyXG4gICAgICAgIHZhciBzdGFydFBvaW50OiBbbnVtYmVyLCBudW1iZXJdID0gZGF0YVswXSBhcyBbbnVtYmVyLCBudW1iZXJdO1xyXG4gICAgICAgIHRoaXMuY3R4Lm1vdmVUbyhzdGFydFBvaW50WzBdLCBzdGFydFBvaW50WzFdKTtcclxuICAgICAgICB2YXIgcG9pbnRzOiBbW251bWJlciwgbnVtYmVyXSwgW251bWJlciwgbnVtYmVyXSwgW251bWJlciwgbnVtYmVyXSwgbnVtYmVyXVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZGF0YVtpXS5sZW5ndGggPT0gMikgey8vW3gseV1cclxuICAgICAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVUbyhkYXRhW2ldWzBdIGFzIG51bWJlciwgZGF0YVtpXVsxXSBhcyBudW1iZXIpO1xyXG4gICAgICAgICAgICB9IGVsc2Ugey8vW1t4LCB5XSwgW3gsIHldLCBbeCwgeV0sIHJhZGl1c11cclxuICAgICAgICAgICAgICAgIHBvaW50cyA9IGRhdGFbaV0gYXMgYW55O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdHgubGluZVRvKHBvaW50c1swXVswXSwgcG9pbnRzWzBdWzFdKTsvL0FcclxuICAgICAgICAgICAgICAgIHRoaXMuY3R4LmFyY1RvKHBvaW50c1sxXVswXSwgcG9pbnRzWzFdWzFdLCBwb2ludHNbMl1bMF0sIHBvaW50c1syXVsxXSwgcG9pbnRzWzNdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZpbGxDb2xvcihzdHlsZTogRkNvbG9yKSB7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gc3R5bGUudG9IZXhTdHJpbmcoKTtcclxuICAgIH1cclxuICAgIG5vU3Ryb2tlKCkge1xyXG4gICAgICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gQnJpc3RvbEJvYXJkLm5vU3R5bGU7XHJcbiAgICB9XHJcbiAgICBub0ZpbGwoKSB7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gQnJpc3RvbEJvYXJkLm5vU3R5bGVcclxuICAgIH1cclxuICAgIHN0cm9rZVdlaWdodCh3ZWlnaHQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IHdlaWdodDtcclxuICAgIH1cclxuICAgIGN1cnNvcihjdXJzb3JDc3M6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuY2FudmFzLnNldENzcygnY3Vyc29yJywgY3Vyc29yQ3NzKTtcclxuICAgIH1cclxuICAgIGJhY2tncm91bmQoY29sb3I6IEZDb2xvcikge1xyXG4gICAgICAgIHRoaXMubm9TdHJva2UoKTtcclxuICAgICAgICB0aGlzLmZpbGxDb2xvcihjb2xvcik7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG4gICAgfVxyXG4gICAgbGluZSh4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgdGhpcy5jdHgubW92ZVRvKHgxLCB5MSk7XHJcbiAgICAgICAgdGhpcy5jdHgubGluZVRvKHgyLCB5Mik7XHJcbiAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XHJcbiAgICB9XHJcbiAgICBlbGxpcHNlKGNlbnRlclg6IG51bWJlciwgY2VudGVyWTogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgc3Ryb2tlOiBib29sZWFuID0gdHJ1ZSwgZmlsbDogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgdGhpcy5lbGxpcHNlQm91bmRzKGNlbnRlclggLSB3aWR0aCAvIDIuMCwgY2VudGVyWSAtIGhlaWdodCAvIDIuMCwgd2lkdGgsIGhlaWdodCwgc3Ryb2tlLCBmaWxsKTtcclxuICAgIH1cclxuICAgIGVsbGlwc2VGcmFtZSh1aUZyYW1lOiBVSUZyYW1lX0Fic3RyYWN0LCBzdHJva2U6IGJvb2xlYW4gPSB0cnVlLCBmaWxsOiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgICAgICB0aGlzLmVsbGlwc2VCb3VuZHModWlGcmFtZS5sZWZ0WCgpLCB1aUZyYW1lLnRvcFkoKSwgdWlGcmFtZS5tZWFzdXJlV2lkdGgoKSwgdWlGcmFtZS5tZWFzdXJlSGVpZ2h0KCkpXHJcbiAgICB9XHJcbiAgICBlbGxpcHNlQm91bmRzKGNvcm5lclg6IG51bWJlciwgY29ybmVyWTogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlciwgc3Ryb2tlOiBib29sZWFuID0gdHJ1ZSwgZmlsbDogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgdmFyIGthcHBhID0gLjU1MjI4NDgsXHJcbiAgICAgICAgICAgIG94ID0gKHcgLyAyKSAqIGthcHBhLCAvLyBjb250cm9sIHBvaW50IG9mZnNldCBob3Jpem9udGFsXHJcbiAgICAgICAgICAgIG95ID0gKGggLyAyKSAqIGthcHBhLCAvLyBjb250cm9sIHBvaW50IG9mZnNldCB2ZXJ0aWNhbFxyXG4gICAgICAgICAgICB4ZSA9IGNvcm5lclggKyB3LCAgICAgICAgICAgLy8geC1lbmRcclxuICAgICAgICAgICAgeWUgPSBjb3JuZXJZICsgaCwgICAgICAgICAgIC8vIHktZW5kXHJcbiAgICAgICAgICAgIHhtID0gY29ybmVyWCArIHcgLyAyLCAgICAgICAvLyB4LW1pZGRsZVxyXG4gICAgICAgICAgICB5bSA9IGNvcm5lclkgKyBoIC8gMjsgICAgICAgLy8geS1taWRkbGVcclxuXHJcbiAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgdGhpcy5jdHgubW92ZVRvKGNvcm5lclgsIHltKTtcclxuICAgICAgICB0aGlzLmN0eC5iZXppZXJDdXJ2ZVRvKGNvcm5lclgsIHltIC0gb3ksIHhtIC0gb3gsIGNvcm5lclksIHhtLCBjb3JuZXJZKTtcclxuICAgICAgICB0aGlzLmN0eC5iZXppZXJDdXJ2ZVRvKHhtICsgb3gsIGNvcm5lclksIHhlLCB5bSAtIG95LCB4ZSwgeW0pO1xyXG4gICAgICAgIHRoaXMuY3R4LmJlemllckN1cnZlVG8oeGUsIHltICsgb3ksIHhtICsgb3gsIHllLCB4bSwgeWUpO1xyXG4gICAgICAgIHRoaXMuY3R4LmJlemllckN1cnZlVG8oeG0gLSBveCwgeWUsIGNvcm5lclgsIHltICsgb3ksIGNvcm5lclgsIHltKTtcclxuXHJcbiAgICAgICAgaWYgKHN0cm9rZSkge1xyXG4gICAgICAgICAgICB0aGlzLmN0eC5zdHJva2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGZpbGwpIHtcclxuICAgICAgICAgICAgdGhpcy5jdHguZmlsbCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHRleHQoc3RyOiBzdHJpbmcsIHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFRleHQoc3RyLCB4LCB5KTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBmb250OiBCcmlzdG9sRm9udCA9IG5ldyBCcmlzdG9sRm9udCgpO1xyXG4gICAgZ2V0Rm9udFRleHQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9udC50b1N0cmluZygpO1xyXG4gICAgfVxyXG4gICAgdGV4dFdlaWdodCh3ZWlnaHQ6IEJyaXN0b2xGb250V2VpZ2h0KSB7XHJcbiAgICAgICAgdGhpcy5mb250LndlaWdodCA9IHdlaWdodDtcclxuICAgICAgICB0aGlzLmN0eC5mb250ID0gdGhpcy5mb250LnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcbiAgICB0ZXh0U2l6ZShzaXplOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmZvbnQuc2l6ZSA9IHNpemU7XHJcbiAgICAgICAgdGhpcy5jdHguZm9udCA9IHRoaXMuZm9udC50b1N0cmluZygpXHJcbiAgICB9XHJcbiAgICBmb250RmFtaWx5KGZhbWlseTogQnJpc3RvbEZvbnRGYW1pbHkpIHtcclxuICAgICAgICB0aGlzLmZvbnQuZmFtaWx5ID0gZmFtaWx5O1xyXG4gICAgICAgIHRoaXMuY3R4LmZvbnQgPSB0aGlzLmZvbnQudG9TdHJpbmcoKTtcclxuICAgIH1cclxuICAgIHRleHRBbGlnbihob3Jpem9udGFsOiBCcmlzdG9sSEFsaWduLCB2ZXJ0aWNhbDogQnJpc3RvbFZBbGlnbikge1xyXG4gICAgICAgIHRoaXMuY3R4LnRleHRBbGlnbiA9IGhvcml6b250YWw7XHJcbiAgICAgICAgdGhpcy5jdHgudGV4dEJhc2VsaW5lID0gdmVydGljYWw7XHJcbiAgICB9XHJcbiAgICB0ZXh0V2lkdGgodGV4dDogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdHgubWVhc3VyZVRleHQodGV4dCkud2lkdGg7XHJcbiAgICB9XHJcbiAgICByZWN0KHg6IG51bWJlciwgeTogbnVtYmVyLCB3OiBudW1iZXIsIGg6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuY3R4LnJlY3QoeCwgeSwgdywgaClcclxuICAgIH1cclxuICAgIHJlY3RGcmFtZShmcmFtZTogVUlGcmFtZV9BYnN0cmFjdCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN0eC5yZWN0KGZyYW1lLmxlZnRYKCksIGZyYW1lLnRvcFkoKSwgZnJhbWUubWVhc3VyZVdpZHRoKCksIGZyYW1lLm1lYXN1cmVIZWlnaHQoKSk7XHJcbiAgICB9XHJcbiAgICBmaWxsUmVjdEZyYW1lKGZyYW1lOiBVSUZyYW1lX0Fic3RyYWN0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3R4LmZpbGxSZWN0KGZyYW1lLmxlZnRYKCksIGZyYW1lLnRvcFkoKSwgZnJhbWUubWVhc3VyZVdpZHRoKCksIGZyYW1lLm1lYXN1cmVIZWlnaHQoKSk7XHJcbiAgICB9XHJcbiAgICBtb3VzZVNjcm9sbGVkKGV2ZW50OiBNb3VzZVNjcm9sbGVkSW5wdXRFdmVudCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBtb3VzZURyYWdnZWQoZXZlbnQ6IE1vdXNlRHJhZ2dlZElucHV0RXZlbnQpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLy9vdmVycmlkYWJsZSBtZXRob2RzLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIHNob3VsZEV4ZWNKb2JzKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGFic3RyYWN0IG9uSW5pdCgpOiBQcm9taXNlPHZvaWQ+O1xyXG4gICAgYWRkVWlFbGVtZW50KGVsZW1lbnQ6IFVJRWxlbWVudDxhbnk+KSB7XHJcbiAgICAgICAgZWxlbWVudC5wYXJlbnQgPSB0aGlzIGFzIGFueTsvL2JhZCB0eXBlXHJcbiAgICAgICAgdGhpcy51aUVsZW1lbnRzLmFkZChlbGVtZW50KTtcclxuICAgICAgICAvLyBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudWlFbGVtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIC8vICAgICBpZiAodGhpcy51aUVsZW1lbnRzW2ldLmRlcHRoID49IGVsZW1lbnQuZGVwdGgpIHtcclxuICAgICAgICAvLyAgICAgICAgIHRoaXMudWlFbGVtZW50cy5zcGxpY2UoaSwgMCwgZWxlbWVudCk7XHJcbiAgICAgICAgLy8gICAgICAgICByZXR1cm47XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8gdGhpcy51aUVsZW1lbnRzLnB1c2goZWxlbWVudCk7XHJcblxyXG4gICAgfVxyXG4gICAgcmVtb3ZlVUlFbGVtZW50KGVsZW1lbnQ6IFVJRWxlbWVudDxhbnk+KSB7XHJcbiAgICAgICAgZWxlbWVudC5wYXJlbnQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMudWlFbGVtZW50cy5yZW1vdmUoKGVsZW06IFVJRWxlbWVudDxhbnk+KSA9PiAoZWxlbS5pZCA9PSBlbGVtZW50LmlkKSk7XHJcbiAgICAgICAgLy8gdmFyIHJlbW92ZUluZGV4ID0gdGhpcy51aUVsZW1lbnRzLm1hcChpdGVtID0+IGl0ZW0uaWQpXHJcbiAgICAgICAgLy8gICAgIC5pbmRleE9mKGVsZW1lbnQuaWQpO1xyXG4gICAgICAgIC8vIGlmIChyZW1vdmVJbmRleCAhPT0gLTEpIHtcclxuICAgICAgICAvLyAgICAgfnJlbW92ZUluZGV4ICYmIHRoaXMudWlFbGVtZW50cy5zcGxpY2UocmVtb3ZlSW5kZXgsIDEpO1xyXG4gICAgICAgIC8vIH1cclxuICAgIH1cclxuICAgIGFzeW5jIG9uRHJhdyhkZWx0YU1zOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBsZXQgdGhzID0gdGhpcztcclxuICAgICAgICB0aGlzLm5vU3Ryb2tlKCk7XHJcbiAgICAgICAgdGhpcy5maWxsQ29sb3IoZkNvbG9yLmdyZXkuZGFya2VuMyk7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xyXG5cclxuICAgICAgICAvLyB0aGlzLmN1cnJlbnRDb250ZW50UGFuZWwuZHJhd0JhY2tncm91bmQoZGVsdGFNcyk7XHJcblxyXG4gICAgICAgIC8vICB0aGlzLmN0eC5maWxsU3R5bGUgPSBmQ29sb3IuZ3JlZW4uZGFya2VuMi50b0hleFN0cmluZygpO1xyXG4gICAgICAgIC8vIHRoaXMuY3R4LmZpbGxSZWN0KDAsMCwgNTAwLCA1MDApO1xyXG4gICAgICAgIC8vICAgICAgICAgY29uc29sZS5sb2codGhpcy5jdHgpO1xyXG4gICAgICAgIHRoaXMudWlFbGVtZW50cy5mb3JFYWNoKChlbGVtZW50OiBVSUVsZW1lbnQ8YW55PikgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQuZnJhbWUuaXNWaXNpYmxlKCkpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuZHJhdyhkZWx0YU1zLCB0aHMuY3R4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLy8gaWYgKHRoaXMuZGVidWdnZXJGbGFncy51aUZyYW1lT3V0bGluZXMgJiYgdGhpcy5sYXN0TW91c2VPdmVyRWxlbSAhPSBudWxsKSB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMubGFzdE1vdXNlT3ZlckVsZW0uZHJhd1VJRnJhbWUodHJ1ZSwgMSk7XHJcbiAgICAgICAgLy8gICAgIHRoaXMuZmlsbENvbG9yKHRoaXMubGFzdE1vdXNlT3ZlckVsZW0uZGVidWdGcmFtZUNvbG9yKTtcclxuICAgICAgICAvLyAgICAgdGhpcy50ZXh0QWxpZ24oQnJpc3RvbEhBbGlnbi5MZWZ0LCBCcmlzdG9sVkFsaWduLkJvdHRvbSlcclxuICAgICAgICAvLyAgICAgdGhpcy50ZXh0U2l6ZSg4KTtcclxuICAgICAgICAvLyAgICAgdGhpcy5jdHguZmlsbFRleHQodGhpcy5sYXN0TW91c2VPdmVyRWxlbS5pZCwgdGhpcy5tb3VzZVgsIHRoaXMubW91c2VZKVxyXG4gICAgICAgIC8vIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIH1cclxufSIsIlxyXG5cclxuaW1wb3J0IHtTcGVjaWFsTWVzc2FnZSwgVUlGcmFtZV9SZWN0X0Nvcm5lclNpemVkLCBTbG90TWFjaGluZVdoZWVsLCBTbG90TWFjaGluZVdoZWVscywgVUlFbGVtZW50LCBCcmlzdG9sQm9hcmQsIGZDb2xvciwgU29ydGVkTGlua2VkTGlzdCwgRm9vdGJhbGxGaWVsZCwgU2t5LCBTbG90TWFjaGluZSwgTW91c2VCdG5JbnB1dEV2ZW50LCBNb3VzZURyYWdnZWRJbnB1dEV2ZW50IH0gZnJvbSBcIi4uL2ltcG9ydHNcIjtcclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIENhcmRCcmlzdG9sIGV4dGVuZHMgQnJpc3RvbEJvYXJkIHtcclxuXHJcbiAgICBwYWRkaW5nOiBudW1iZXIgPSA4O1xyXG4gICAgbWFjaGluZTogU2xvdE1hY2hpbmU7XHJcbiAgICBtZXNzYWdlOiBTcGVjaWFsTWVzc2FnZTtcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lckRpdkVsZW06IEhUTUxEaXZFbGVtZW50LCBvbkluaXRpYWxpemVkOiAoYnJpc3Q6IENhcmRCcmlzdG9sKSA9PiBQcm9taXNlPHZvaWQ+KSB7XHJcbiAgICAgICAgc3VwZXIoY29udGFpbmVyRGl2RWxlbSwgb25Jbml0aWFsaXplZCk7XHJcbiAgICAgICAgbGV0IHRocyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5tYWNoaW5lID0gbmV3IFNsb3RNYWNoaW5lKCd0aGVNYWNoaW5lJywgbmV3IFVJRnJhbWVfUmVjdF9Db3JuZXJTaXplZCgwLCAwLCB0aGlzLndpZHRoKSwgdGhpcyk7XHJcbiAgICAgICAgdGhpcy5tYWNoaW5lLmZyYW1lLnJlbFkgPSAoKSA9PiAodGhzLmhlaWdodCAvIDIgLSB0aHMubWFjaGluZS5mcmFtZS5tZWFzdXJlSGVpZ2h0KCkgLyAyKTtcclxuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBuZXcgU3BlY2lhbE1lc3NhZ2UoJ21lc3NhZ2UnLCAoKT0+J0hhcHB5IEJpcnRoZGF5IENocmlzdGluYSEnLCBuZXcgVUlGcmFtZV9SZWN0X0Nvcm5lclNpemVkKDAsMCwgdGhzLndpZHRoLCB0aHMubWFjaGluZS5mcmFtZS5yZWxZKSwgdGhpcylcclxuICAgICAgICB0aGlzLmFkZFVpRWxlbWVudCh0aGlzLm1lc3NhZ2UpXHJcbiAgICAgICAgdGhpcy5hZGRVaUVsZW1lbnQodGhpcy5tYWNoaW5lKTtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkluaXQoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgbGV0IHRocyA9IHRoaXM7XHJcblxyXG4gICAgfVxyXG4gICAgbW91c2VQcmVzc2VkKGV2dDogTW91c2VCdG5JbnB1dEV2ZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFjaGluZS5sZXZlci5tb3VzZVByZXNzZWQoZXZ0KTtcclxuICAgIH1cclxuXHJcbiAgICBtb3VzZVJlbGVhc2VkKGV2dDogTW91c2VCdG5JbnB1dEV2ZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFjaGluZS5sZXZlci5tb3VzZVJlbGVhc2VkKGV2dCk7XHJcbiAgICB9XHJcbiAgICBtb3VzZURyYWdnZWQoZXZ0OiBNb3VzZURyYWdnZWRJbnB1dEV2ZW50KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubWFjaGluZS5sZXZlci5tb3VzZURyYWdnZWQoZXZ0KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbn0iLCJpbXBvcnQgeyBTb3J0ZWRMaW5rZWRMaXN0LCBDYXJkQnJpc3RvbCwgS2V5Ym9hcmRJbnB1dEV2ZW50LCBNb3VzZUJ0bklucHV0RXZlbnQsIE1vdXNlRHJhZ2dlZElucHV0RXZlbnQsIE1vdXNlSW5wdXRFdmVudCwgTW91c2VNb3ZlZElucHV0RXZlbnQsIE1vdXNlU2Nyb2xsZWRJbnB1dEV2ZW50LCBVSUZyYW1lX0Fic3RyYWN0LCBmQ29sb3IgfSBmcm9tIFwiLi4vaW1wb3J0c1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFVJRWxlbWVudDxGcmFtZVR5cGUgZXh0ZW5kcyBVSUZyYW1lX0Fic3RyYWN0PiB7XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgcGFyZW50OiBVSUVsZW1lbnQ8YW55PiB8IENhcmRCcmlzdG9sID0gbnVsbDtcclxuICAgIGNFbGVtZW50czogU29ydGVkTGlua2VkTGlzdDxVSUVsZW1lbnQ8YW55Pj4gPSBTb3J0ZWRMaW5rZWRMaXN0LkNyZWF0ZSgoYTogVUlFbGVtZW50PGFueT4sIGI6IFVJRWxlbWVudDxhbnk+KSA9PiAoYS5kZXB0aCAtIGIuZGVwdGgpKTtcclxuICAgIC8vIGNoaWxkRWxlbWVudHM6IEFycmF5PFVJRWxlbWVudDxhbnk+PiA9IFtdO1xyXG4gICAgek9mZnNldDogbnVtYmVyID0gMDtcclxuICAgIGZyYW1lOiBGcmFtZVR5cGU7XHJcbiAgICBicmlzdDogQ2FyZEJyaXN0b2w7XHJcbiAgICAvLyBwYW5lbDogVUlDb250ZW50UGFuZWw7XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIGdldCBkZXB0aCgpIHtcclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQgPT0gbnVsbCB8fCB0aGlzLnBhcmVudCBpbnN0YW5jZW9mIENhcmRCcmlzdG9sKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnpPZmZzZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQgaW5zdGFuY2VvZiBVSUVsZW1lbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50LmRlcHRoICsgMSArIHRoaXMuek9mZnNldDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdHJ1Y3Rvcih1aWQ6IHN0cmluZywgdWlGcmFtZTogRnJhbWVUeXBlLCBicmlzdDogQ2FyZEJyaXN0b2wpIHtcclxuICAgICAgICB0aGlzLmlkID0gdWlkO1xyXG4gICAgICAgIHRoaXMuYnJpc3QgPSBicmlzdDtcclxuICAgICAgICAvLyB0aGlzLnBhbmVsID0gcGFuZWw7XHJcbiAgICAgICAgdGhpcy5mcmFtZSA9IHVpRnJhbWU7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZENoaWxkKGNoaWxkSWQ6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNFbGVtZW50cy5maW5kKChlbGVtKSA9PiAoZWxlbS5pZCA9PSBjaGlsZElkKSk7XHJcbiAgICAgICAgLy8gZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkRWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAvLyAgICAgaWYgKHRoaXMuY2hpbGRFbGVtZW50c1tpXS5pZCA9PSBjaGlsZElkKSB7XHJcbiAgICAgICAgLy8gICAgICAgICByZXR1cm4gdGhpcy5jaGlsZEVsZW1lbnRzW2ldO1xyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfVxyXG4gICAgICAgIC8vIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgYWRkQ2hpbGQoY2hpbGRFbGVtZW50OiBVSUVsZW1lbnQ8YW55Pikge1xyXG4gICAgICAgIC8vIGxldCBpbmRleDogbnVtYmVyID0gLTE7XHJcblxyXG4gICAgICAgIC8vIGluZGV4ID0gdGhpcy5jaGlsZEVsZW1lbnRzLnB1c2goY2hpbGRFbGVtZW50KSAtIDE7XHJcblxyXG4gICAgICAgIGxldCBpID0gdGhpcy5jRWxlbWVudHMuYWRkKGNoaWxkRWxlbWVudCk7XHJcbiAgICAgICAgY2hpbGRFbGVtZW50LnBhcmVudCA9IHRoaXM7XHJcbiAgICAgICAgY2hpbGRFbGVtZW50LmZyYW1lLnBhcmVudCA9IHRoaXMuZnJhbWU7XHJcbiAgICAgICAgY2hpbGRFbGVtZW50Lm9uQWRkVG9QYXJlbnQoKTtcclxuICAgICAgICByZXR1cm4gaTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcmVtb3ZlRnJvbVBhcmVudCgpIHtcclxuICAgICAgICBpZiAodGhpcy5wYXJlbnQgaW5zdGFuY2VvZiBVSUVsZW1lbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJlbnQucmVtb3ZlVUlFbGVtZW50KHRoaXMuaWQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICh0aGlzLnBhcmVudCBhcyBhbnkgYXMgQ2FyZEJyaXN0b2wpLnJlbW92ZVVJRWxlbWVudCh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZW1vdmVVSUVsZW1lbnQoY2hpbGRJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5jRWxlbWVudHMucmVtb3ZlKChlbGVtOiBVSUVsZW1lbnQ8YW55PikgPT4gKGVsZW0uaWQgPT0gY2hpbGRJZCkpXHJcbiAgICAgICAgLy8gZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkRWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAvLyAgICAgaWYgKHRoaXMuY2hpbGRFbGVtZW50c1tpXS5pZCA9PSBjaGlsZElkKSB7XHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLmNoaWxkRWxlbWVudHNbaV0ub25SZW1vdmVGcm9tUGFyZW50KCk7XHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLmNoaWxkRWxlbWVudHNbaV0ucGFyZW50ID0gbnVsbDtcclxuICAgICAgICAvLyAgICAgICAgIHRoaXMuY2hpbGRFbGVtZW50cy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAvLyB9XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXJDaGlsZEVsZW1lbnRzKCkge1xyXG4gICAgICAgIHRoaXMuY0VsZW1lbnRzLmNsZWFyKCk7XHJcblxyXG4gICAgfVxyXG4gICAgZHJhdyhkZWx0YVRpbWU6IG51bWJlciwgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcclxuICAgICAgICB0aGlzLm9uRHJhd0JhY2tncm91bmQoZGVsdGFUaW1lLCBjdHgpO1xyXG5cclxuICAgICAgICB0aGlzLmNFbGVtZW50cy5mb3JFYWNoKChlbGVtOiBVSUVsZW1lbnQ8YW55PikgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKGVsZW0uZnJhbWUuaXNWaXNpYmxlKCkpIHtcclxuICAgICAgICAgICAgICAgIGVsZW0uZHJhdyhkZWx0YVRpbWUsIGN0eCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICB0aGlzLm9uRHJhd0ZvcmVncm91bmQoZGVsdGFUaW1lLCBjdHgpO1xyXG4gICAgfVxyXG4gICAgb25EcmF3QmFja2dyb3VuZChkZWx0YVRpbWU6IG51bWJlciwgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcclxuXHJcbiAgICB9XHJcbiAgICBvbkRyYXdGb3JlZ3JvdW5kKGRlbHRhVGltZTogbnVtYmVyLCBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xyXG5cclxuICAgIH1cclxuICAgIGlzSW5zaWRlKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZnJhbWUuaXNJbnNpZGUoeCwgeSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25BZGRUb1BhcmVudCgpIHtcclxuICAgIH1cclxuICAgIG9uUmVtb3ZlRnJvbVBhcmVudCgpIHtcclxuICAgIH1cclxuICAgIG9uUGFuZWxTaG93KCkge1xyXG4gICAgICAgIHRoaXMuY0VsZW1lbnRzLmZvckVhY2goKGVsZW06IFVJRWxlbWVudDxhbnk+KSA9PiB7XHJcbiAgICAgICAgICAgIGVsZW0ub25QYW5lbFNob3coKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG4gICAgb25QYW5lbEhpZGUoKSB7XHJcbiAgICAgICAgdGhpcy5jRWxlbWVudHMuZm9yRWFjaCgoZWxlbTogVUlFbGVtZW50PGFueT4pID0+IHtcclxuICAgICAgICAgICAgZWxlbS5vblBhbmVsSGlkZSgpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBtb3VzZVByZXNzZWQoZXZ0OiBNb3VzZUJ0bklucHV0RXZlbnQpIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICBtb3VzZVJlbGVhc2VkKGV2dDogTW91c2VCdG5JbnB1dEV2ZW50KSB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgbW91c2VFbnRlcihldnQ6IE1vdXNlSW5wdXRFdmVudCkgeyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgbW91c2VFeGl0KGV2dDogTW91c2VJbnB1dEV2ZW50KSB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgbW91c2VNb3ZlZChldnQ6IE1vdXNlTW92ZWRJbnB1dEV2ZW50KSB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgbW91c2VEcmFnZ2VkKGV2dDogTW91c2VEcmFnZ2VkSW5wdXRFdmVudCkgeyByZXR1cm4gZmFsc2U7IH1cclxuICAgIG1vdXNlV2hlZWwoZGVsdGE6IE1vdXNlU2Nyb2xsZWRJbnB1dEV2ZW50KSB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAga2V5UHJlc3NlZChldnQ6IEtleWJvYXJkSW5wdXRFdmVudCkgeyByZXR1cm4gZmFsc2U7IH1cclxuICAgIGtleVJlbGVhc2VkKGV2dDogS2V5Ym9hcmRJbnB1dEV2ZW50KSB7IHJldHVybiBmYWxzZTsgfVxyXG5cclxuXHJcbiAgICBwcml2YXRlIGRmYyA9IG51bGw7XHJcbiAgICBnZXQgZGVidWdGcmFtZUNvbG9yKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRmYyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGxldCBjb2xvcnMgPSBbJ3JlZCcsICdibHVlJywgJ2dyZWVuJywgJ3B1cnBsZScsICdvcmFuZ2UnLCAnY3lhbiddO1xyXG4gICAgICAgICAgICBsZXQgY29sb3IgPSBjb2xvcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY29sb3JzLmxlbmd0aCldXHJcbiAgICAgICAgICAgIGxldCBzdWJDb2xvcnMgPSBbJ2FjY2VudDEnLCAnYWNjZW50MycsICdsaWdodGVuMicsICdsaWdodGVuNCddO1xyXG4gICAgICAgICAgICBsZXQgc3ViQ29sb3IgPSBzdWJDb2xvcnNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogc3ViQ29sb3JzLmxlbmd0aCldXHJcbiAgICAgICAgICAgIHRoaXMuZGZjID0gZkNvbG9yW2NvbG9yXVtzdWJDb2xvcl1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGZjO1xyXG4gICAgfVxyXG4gICAgZHJhd1VJRnJhbWUoZHJhd0NoaWxkRnJhbWVzOiBib29sZWFuID0gdHJ1ZSwgd2VpZ2h0OiBudW1iZXIgPSAxKSB7XHJcbiAgICAgICAgdGhpcy5icmlzdC5zdHJva2VDb2xvcih0aGlzLmRlYnVnRnJhbWVDb2xvcik7XHJcbiAgICAgICAgdGhpcy5icmlzdC5zdHJva2VXZWlnaHQod2VpZ2h0KTtcclxuICAgICAgICB0aGlzLmJyaXN0LmVsbGlwc2UodGhpcy5mcmFtZS5sZWZ0WCgpLCB0aGlzLmZyYW1lLnRvcFkoKSwgd2VpZ2h0ICogMiwgd2VpZ2h0ICogMik7XHJcbiAgICAgICAgdGhpcy5icmlzdC5saW5lKHRoaXMuZnJhbWUubGVmdFgoKSwgdGhpcy5mcmFtZS50b3BZKCksIHRoaXMuZnJhbWUucmlnaHRYKCksIHRoaXMuZnJhbWUudG9wWSgpKTtcclxuICAgICAgICB0aGlzLmJyaXN0LmVsbGlwc2UodGhpcy5mcmFtZS5yaWdodFgoKSwgdGhpcy5mcmFtZS50b3BZKCksIHdlaWdodCAqIDIsIHdlaWdodCAqIDIpO1xyXG4gICAgICAgIHRoaXMuYnJpc3QubGluZSh0aGlzLmZyYW1lLnJpZ2h0WCgpLCB0aGlzLmZyYW1lLnRvcFkoKSwgdGhpcy5mcmFtZS5yaWdodFgoKSwgdGhpcy5mcmFtZS5ib3R0b21ZKCkpO1xyXG4gICAgICAgIHRoaXMuYnJpc3QuZWxsaXBzZSh0aGlzLmZyYW1lLnJpZ2h0WCgpLCB0aGlzLmZyYW1lLmJvdHRvbVkoKSwgd2VpZ2h0ICogMiwgd2VpZ2h0ICogMik7XHJcbiAgICAgICAgdGhpcy5icmlzdC5saW5lKHRoaXMuZnJhbWUucmlnaHRYKCksIHRoaXMuZnJhbWUuYm90dG9tWSgpLCB0aGlzLmZyYW1lLmxlZnRYKCksIHRoaXMuZnJhbWUuYm90dG9tWSgpKTtcclxuICAgICAgICB0aGlzLmJyaXN0LmVsbGlwc2UodGhpcy5mcmFtZS5sZWZ0WCgpLCB0aGlzLmZyYW1lLmJvdHRvbVkoKSwgd2VpZ2h0ICogMiwgd2VpZ2h0ICogMik7XHJcbiAgICAgICAgdGhpcy5icmlzdC5saW5lKHRoaXMuZnJhbWUubGVmdFgoKSwgdGhpcy5mcmFtZS5ib3R0b21ZKCksIHRoaXMuZnJhbWUubGVmdFgoKSwgdGhpcy5mcmFtZS50b3BZKCkpO1xyXG4gICAgICAgIHRoaXMuYnJpc3QuZWxsaXBzZSh0aGlzLmZyYW1lLmNlbnRlclgoKSwgdGhpcy5mcmFtZS5jZW50ZXJZKCksIHdlaWdodCAqIDIsIHdlaWdodCAqIDIpO1xyXG4gICAgICAgIC8vIHRoaXMuYnJpc3QuY3R4LnN0cm9rZVJlY3QodGhpcy5mcmFtZS51cExlZnRYKCksIHRoaXMuZnJhbWUudG9wWSgpLCB0aGlzLmZyYW1lLm1lYXN1cmVXaWR0aCgpLCB0aGlzLmZyYW1lLm1lYXN1cmVIZWlnaHQoKSk7XHJcblxyXG4gICAgICAgIGlmIChkcmF3Q2hpbGRGcmFtZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5jRWxlbWVudHMuZm9yRWFjaCgoZWxlbTogVUlFbGVtZW50PGFueT4pID0+IHtcclxuICAgICAgICAgICAgICAgIGVsZW0uZHJhd1VJRnJhbWUodHJ1ZSwgd2VpZ2h0KTtcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgb3B0RnVuYywgZXZhbE9wdGlvbmFsRnVuYyB9IGZyb20gJy4uL2ltcG9ydHMnXHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVUlGcmFtZV9BYnN0cmFjdCB7XHJcbiAgICB2aXNpYmxlOiBvcHRGdW5jPGJvb2xlYW4+ID0gdHJ1ZTtcclxuICAgIGlzVmlzaWJsZSgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gZXZhbE9wdGlvbmFsRnVuYyh0aGlzLnZpc2libGUpXHJcbiAgICB9XHJcbiAgICBhYnN0cmFjdCBsZWZ0WCgpOiBudW1iZXJcclxuICAgIFxyXG5cclxuICAgIGFic3RyYWN0IHJpZ2h0WCgpOiBudW1iZXJcclxuICAgIFxyXG5cclxuICAgIGFic3RyYWN0IHRvcFkoKTogbnVtYmVyXHJcbiAgICBcclxuXHJcblxyXG4gICAgYWJzdHJhY3QgYm90dG9tWSgpOiBudW1iZXJcclxuXHJcblxyXG4gICAgYWJzdHJhY3QgaXNJbnNpZGUoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBib29sZWFuXHJcbiAgICBjZW50ZXJYKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLmxlZnRYKCkgKyB0aGlzLnJpZ2h0WCgpKSAvIDJcclxuICAgIH1cclxuXHJcbiAgICBjZW50ZXJZKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLmJvdHRvbVkoKSArIHRoaXMudG9wWSgpKSAvIDJcclxuICAgIH1cclxuXHJcbiAgICBnZXRDb3JuZXJYKGNvcm5lcjogVUlDb3JuZXIpIHtcclxuICAgICAgICBzd2l0Y2ggKGNvcm5lcikge1xyXG4gICAgICAgICAgICBjYXNlIFVJQ29ybmVyLnVwTGVmdDpcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxlZnRYKCk7XHJcbiAgICAgICAgICAgIGNhc2UgVUlDb3JuZXIudXBSaWdodDpcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJpZ2h0WCgpO1xyXG4gICAgICAgICAgICBjYXNlIFVJQ29ybmVyLmRvd25SaWdodDpcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJpZ2h0WCgpO1xyXG4gICAgICAgICAgICBjYXNlIFVJQ29ybmVyLmRvd25MZWZ0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVmdFgoKTtcclxuICAgICAgICAgICAgY2FzZSBVSUNvcm5lci5jZW50ZXI6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jZW50ZXJYKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZ2V0Q29ybmVyWShjb3JuZXI6IFVJQ29ybmVyKSB7XHJcbiAgICAgICAgc3dpdGNoIChjb3JuZXIpIHtcclxuICAgICAgICAgICAgY2FzZSBVSUNvcm5lci51cExlZnQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50b3BZKCk7XHJcbiAgICAgICAgICAgIGNhc2UgVUlDb3JuZXIudXBSaWdodDpcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRvcFkoKTtcclxuICAgICAgICAgICAgY2FzZSBVSUNvcm5lci5kb3duUmlnaHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ib3R0b21ZKCk7XHJcbiAgICAgICAgICAgIGNhc2UgVUlDb3JuZXIuZG93bkxlZnQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ib3R0b21ZKCk7XHJcbiAgICAgICAgICAgIGNhc2UgVUlDb3JuZXIuY2VudGVyOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2VudGVyWSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIG1lYXN1cmVXaWR0aCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJpZ2h0WCgpIC0gdGhpcy5sZWZ0WCgpO1xyXG4gICAgfVxyXG4gICAgbWVhc3VyZUhlaWdodCgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmJvdHRvbVkoKSAtIHRoaXMudG9wWSgpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBlbnVtIFVJQ29ybmVyIHtcclxuICAgIHVwTGVmdCwgdXBSaWdodCwgZG93blJpZ2h0LCBkb3duTGVmdCwgY2VudGVyXHJcbn1cclxuZXhwb3J0IGNsYXNzIFVJRnJhbWVfUmVjdF9Db3JuZXJTaXplZCBleHRlbmRzIFVJRnJhbWVfQWJzdHJhY3Qge1xyXG4gICAgaXNJbnNpZGUoeDogbnVtYmVyLCB5OiBudW1iZXIpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gKHggPj0gdGhpcy5sZWZ0WCgpICYmIHggPD0gdGhpcy5yaWdodFgoKSkgJiYgKHkgPj0gdGhpcy50b3BZKCkgJiYgeSA8PSB0aGlzLmJvdHRvbVkoKSlcclxuICAgIH1cclxuICAgIGxlZnRYKCk6IG51bWJlciB7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLm1lYXN1cmVDb3JuZXIpIHtcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgY2FzZSBVSUNvcm5lci5kb3duTGVmdDpcclxuICAgICAgICAgICAgY2FzZSBVSUNvcm5lci51cExlZnQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZXZhbE9wdGlvbmFsRnVuYyh0aGlzLmFic1gpO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBVSUNvcm5lci51cFJpZ2h0OlxyXG4gICAgICAgICAgICBjYXNlIFVJQ29ybmVyLmRvd25SaWdodDpcclxuICAgICAgICAgICAgICAgIHJldHVybiBldmFsT3B0aW9uYWxGdW5jKHRoaXMuYWJzWCkgLSBldmFsT3B0aW9uYWxGdW5jKHRoaXMud2lkdGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHRvcFkoKTogbnVtYmVyIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMubWVhc3VyZUNvcm5lcikge1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBjYXNlIFVJQ29ybmVyLmRvd25MZWZ0OlxyXG4gICAgICAgICAgICBjYXNlIFVJQ29ybmVyLmRvd25SaWdodDpcclxuICAgICAgICAgICAgICAgIHJldHVybiBldmFsT3B0aW9uYWxGdW5jKHRoaXMuYWJzWSkgLSBldmFsT3B0aW9uYWxGdW5jKHRoaXMuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgIGNhc2UgVUlDb3JuZXIudXBMZWZ0OlxyXG4gICAgICAgICAgICBjYXNlIFVJQ29ybmVyLnVwUmlnaHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZXZhbE9wdGlvbmFsRnVuYyh0aGlzLmFic1kpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJpZ2h0WCgpOiBudW1iZXIge1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5tZWFzdXJlQ29ybmVyKSB7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIGNhc2UgVUlDb3JuZXIuZG93bkxlZnQ6XHJcbiAgICAgICAgICAgIGNhc2UgVUlDb3JuZXIudXBMZWZ0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGV2YWxPcHRpb25hbEZ1bmModGhpcy5hYnNYKSArIGV2YWxPcHRpb25hbEZ1bmModGhpcy53aWR0aCk7XHJcblxyXG4gICAgICAgICAgICBjYXNlIFVJQ29ybmVyLnVwUmlnaHQ6XHJcbiAgICAgICAgICAgIGNhc2UgVUlDb3JuZXIuZG93blJpZ2h0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGV2YWxPcHRpb25hbEZ1bmModGhpcy5hYnNYKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgIFxyXG4gICBcclxuICAgIGJvdHRvbVkoKTogbnVtYmVyIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMubWVhc3VyZUNvcm5lcikge1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBjYXNlIFVJQ29ybmVyLmRvd25MZWZ0OlxyXG4gICAgICAgICAgICBjYXNlIFVJQ29ybmVyLmRvd25SaWdodDpcclxuICAgICAgICAgICAgICAgIHJldHVybiBldmFsT3B0aW9uYWxGdW5jKHRoaXMuYWJzWSlcclxuXHJcbiAgICAgICAgICAgIGNhc2UgVUlDb3JuZXIudXBMZWZ0OlxyXG4gICAgICAgICAgICBjYXNlIFVJQ29ybmVyLnVwUmlnaHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZXZhbE9wdGlvbmFsRnVuYyh0aGlzLmFic1kpICsgZXZhbE9wdGlvbmFsRnVuYyh0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gIFxyXG4gICAgXHJcbiAgICBtZWFzdXJlV2lkdGgoKSB7XHJcbiAgICAgICAgcmV0dXJuIGV2YWxPcHRpb25hbEZ1bmModGhpcy53aWR0aCk7XHJcbiAgICB9XHJcbiAgICBtZWFzdXJlSGVpZ2h0KCkge1xyXG4gICAgICAgIHJldHVybiBldmFsT3B0aW9uYWxGdW5jKHRoaXMuaGVpZ2h0KTtcclxuICAgIH1cclxuICAgIHJlbFg6IG9wdEZ1bmM8bnVtYmVyPlxyXG4gICAgcmVsWTogb3B0RnVuYzxudW1iZXI+XHJcblxyXG4gICAgYWJzWDogb3B0RnVuYzxudW1iZXI+O1xyXG4gICAgYWJzWTogb3B0RnVuYzxudW1iZXI+O1xyXG4gICAgd2lkdGg6IG9wdEZ1bmM8bnVtYmVyPjtcclxuICAgIGhlaWdodDogb3B0RnVuYzxudW1iZXI+O1xyXG4gICAgbWVhc3VyZUNvcm5lcjogb3B0RnVuYzxVSUNvcm5lcj5cclxuICAgIHBhcmVudENvcm5lcjogb3B0RnVuYzxVSUNvcm5lcj47XHJcbiAgICBwYXJlbnQ6IFVJRnJhbWVfQWJzdHJhY3RcclxuICAgIGdldCBoYXNQYXJlbnQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50ICE9IG51bGw7XHJcbiAgICB9XHJcbiAgICBjb25zdHJ1Y3Rvcih4OiBvcHRGdW5jPG51bWJlcj4sIHk6IG9wdEZ1bmM8bnVtYmVyPiwgd2lkdGg6IG9wdEZ1bmM8bnVtYmVyPiA9IDAsIGhlaWdodDogb3B0RnVuYzxudW1iZXI+ID0gMCwgbWVhc3VyZUNvcm5lcjogb3B0RnVuYzxVSUNvcm5lcj4gPSBVSUNvcm5lci51cExlZnQsIHBhcmVudDogVUlGcmFtZV9BYnN0cmFjdCA9IG51bGwsIHBhcmVudENvcm5lcjogb3B0RnVuYzxVSUNvcm5lcj4gPSBVSUNvcm5lci51cExlZnQpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMubWVhc3VyZUNvcm5lciA9IG1lYXN1cmVDb3JuZXI7XHJcbiAgICAgICAgdGhpcy5wYXJlbnRDb3JuZXIgPSBwYXJlbnRDb3JuZXI7XHJcbiAgICAgICAgdGhpcy5yZWxYID0geDtcclxuICAgICAgICB0aGlzLnJlbFkgPSB5O1xyXG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcclxuICAgICAgICBsZXQgdGhzID0gdGhpcztcclxuICAgICAgICB0aGlzLmFic1ggPSAoKSA9PiAodGhzLmhhc1BhcmVudCA/IGV2YWxPcHRpb25hbEZ1bmModGhzLnJlbFgpICsgdGhzLnBhcmVudC5nZXRDb3JuZXJYKGV2YWxPcHRpb25hbEZ1bmModGhzLnBhcmVudENvcm5lcikpIDogZXZhbE9wdGlvbmFsRnVuYyh0aHMucmVsWCkpO1xyXG4gICAgICAgIHRoaXMuYWJzWSA9ICgpID0+ICh0aHMuaGFzUGFyZW50ID8gZXZhbE9wdGlvbmFsRnVuYyh0aHMucmVsWSkgKyB0aHMucGFyZW50LmdldENvcm5lclkoZXZhbE9wdGlvbmFsRnVuYyh0aHMucGFyZW50Q29ybmVyKSkgOiBldmFsT3B0aW9uYWxGdW5jKHRocy5yZWxZKSk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4iLCJpbXBvcnQge0ltYWdlRWxlbWVudCwgQ2FyZEJyaXN0b2wsIGZDb2xvciwgRm9vdGJhbGxGaWVsZCwgU2t5LCBVSUVsZW1lbnQsIFVJRnJhbWVfUmVjdF9Db3JuZXJTaXplZCB9IGZyb20gXCIuLi9pbXBvcnRzXCI7XHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEJhY2tncm91bmRFbGVtZW50IGV4dGVuZHMgVUlFbGVtZW50PFVJRnJhbWVfUmVjdF9Db3JuZXJTaXplZD57XHJcbiAgICBjb25zdHJ1Y3Rvcih1aWQ6IHN0cmluZywgYnJpc3Q6IENhcmRCcmlzdG9sKSB7XHJcbiAgICAgICAgc3VwZXIodWlkLCBuZXcgVUlGcmFtZV9SZWN0X0Nvcm5lclNpemVkKDAsIDApLCBicmlzdCk7XHJcblxyXG4gICAgICAgIHRoaXMuZnJhbWUud2lkdGggPSAoKSA9PiB7IHJldHVybiBicmlzdC53aWR0aCB9O1xyXG4gICAgICAgIHRoaXMuZnJhbWUuaGVpZ2h0ID0gKCkgPT4geyByZXR1cm4gYnJpc3QuaGVpZ2h0IH1cclxuXHJcbiAgICAgICAgbGV0IGZpZWxkID0gbmV3IEZvb3RiYWxsRmllbGQoJ2ZpZWxkJywgYnJpc3QpO1xyXG4gICAgICAgIGxldCBza3kgPSBuZXcgU2t5KCdza3knLCBicmlzdCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgbGV0IGNyb3dkID0gbmV3IEltYWdlRWxlbWVudCgnYnJpY2tBJywgW1wiLi9jcm93ZC5qcGdcIl0sIG5ldyBVSUZyYW1lX1JlY3RfQ29ybmVyU2l6ZWQoMCwgMCksIGJyaXN0KTtcclxuICAgICAgICBjcm93ZC5mcmFtZS5yZWxZID0gKCkgPT4gKDApO1xyXG4gICAgICAgIGNyb3dkLmZyYW1lLnJlbFggPSAoKT0+KGZpZWxkLmN1cnJlbnRPZmZzZXQgKiAwLjIpO1xyXG4gICAgICAgIGNyb3dkLnNldFNjYWxlKDIuNSk7XHJcbiAgICAgICAgY3Jvd2QudGlsZVgoMyk7XHJcblxyXG5cclxuICAgICAgICBsZXQgYnJpY2tzID0gbmV3IEltYWdlRWxlbWVudCgnYnJpY2tBJywgW1wiLi9icmlja3MuanBnXCJdLCBuZXcgVUlGcmFtZV9SZWN0X0Nvcm5lclNpemVkKDAsIDApLCBicmlzdCk7XHJcbiAgICAgICAgYnJpY2tzLmZyYW1lLnJlbFkgPSAoKSA9PiAoYnJpc3QuaGVpZ2h0ICogMiAvIDMgLSBicmlja3MuZnJhbWUubWVhc3VyZUhlaWdodCgpKTtcclxuICAgICAgICBicmlja3MuZnJhbWUucmVsWCA9ICgpPT4oZmllbGQuY3VycmVudE9mZnNldCAqIDAuMik7XHJcbiAgICAgICAgYnJpY2tzLnNldFNjYWxlKDAuMTApO1xyXG4gICAgICAgIGJyaWNrcy50aWxlWCgyMCk7XHJcblxyXG4gICAgICAgIGxldCBtZXNzYWdlID0gbmV3IEltYWdlRWxlbWVudCgnbWVzc2FnZScsIFtcIi4vSGFwcHlGYXRoZXJzZGF5LmpwZ1wiXSwgbmV3IFVJRnJhbWVfUmVjdF9Db3JuZXJTaXplZCgwLCAwKSwgYnJpc3QpO1xyXG4gICAgICAgIG1lc3NhZ2UuZnJhbWUucmVsWSA9ICgpID0+IChicmlzdC5oZWlnaHQgKiAyIC8gMyAtIGJyaWNrcy5mcmFtZS5tZWFzdXJlSGVpZ2h0KCkgKiAwLjUgLSBtZXNzYWdlLmZyYW1lLm1lYXN1cmVIZWlnaHQoKSAqIDAuNSk7XHJcbiAgICAgICAgbWVzc2FnZS5mcmFtZS5yZWxYID0gKCk9PihmaWVsZC5jdXJyZW50T2Zmc2V0ICogMC4yKTtcclxuICAgICAgICBtZXNzYWdlLnNldFNjYWxlKDAuMik7XHJcbiAgICAgICAgbWVzc2FnZS50aWxlWCgyMCk7XHJcblxyXG4gICAgICBcclxuXHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZChtZXNzYWdlKTtcclxuICAgICAgICB0aGlzLmFkZENoaWxkKGJyaWNrcyk7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZChjcm93ZCk7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZChza3kpO1xyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQoZmllbGQpO1xyXG4gICAgfVxyXG4gICAgb25EcmF3Rm9yZWdyb3VuZChkZWx0YU1zOiBudW1iZXIsKSB7XHJcblxyXG4gICAgICAgIC8vIHRoaXMuYnJpc3QuZmlsbENvbG9yKGZDb2xvci5ncmVlbi5kYXJrZW4yKTtcclxuICAgICAgICAvLyB0aGlzLmJyaXN0LmZpbGxSZWN0RnJhbWUodGhpcy5mcmFtZSk7XHJcblxyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgQ2FyZEJyaXN0b2wsIGZDb2xvciwgVUlFbGVtZW50IH0gZnJvbSBcIi4uL2ltcG9ydHNcIjtcclxuaW1wb3J0IHsgVUlGcmFtZV9SZWN0X0Nvcm5lclNpemVkIH0gZnJvbSBcIi4uL0JyaXN0b2wvVUlGcmFtZVwiO1xyXG5pbXBvcnQgeyBJbWFnZUVsZW1lbnQgfSBmcm9tIFwiLi9JbWFnZUVsZW1cIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBGb290YmFsbEZpZWxkIGV4dGVuZHMgVUlFbGVtZW50PFVJRnJhbWVfUmVjdF9Db3JuZXJTaXplZD57XHJcbiAgICBjb25zdHJ1Y3Rvcih1aWQ6IHN0cmluZywgYnJpc3Q6IENhcmRCcmlzdG9sKSB7XHJcbiAgICAgICAgc3VwZXIodWlkLCBuZXcgVUlGcmFtZV9SZWN0X0Nvcm5lclNpemVkKDAsIDApLCBicmlzdCk7XHJcbiAgICAgICAgdGhpcy5mcmFtZS5yZWxZID0gKCkgPT4geyByZXR1cm4gYnJpc3QuaGVpZ2h0ICogMiAvIDMgfTtcclxuICAgICAgICB0aGlzLmZyYW1lLndpZHRoID0gKCkgPT4geyByZXR1cm4gYnJpc3Qud2lkdGggfTtcclxuICAgICAgICB0aGlzLmZyYW1lLmhlaWdodCA9ICgpID0+IHsgcmV0dXJuIGJyaXN0LmhlaWdodCAvIDM7IH1cclxuICAgICAgICBcclxuICAgICAgICBpZihicmlzdC53aWR0aCA8IGJyaXN0LmhlaWdodCl7XHJcbiAgICAgICAgICAgIHRoaXMuZGlzdGFuY2UgPSBNYXRoLm1pbih0aGlzLmRpc3RhbmNlLCBicmlzdC53aWR0aCApO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRpc3RhbmNlVmFyaWFuY2UgPSB0aGlzLmRpc3RhbmNlICogMC41O1xyXG4gICAgfVxyXG4gICAgZGlzdGFuY2U6IG51bWJlciA9IDEwMDA7XHJcbiAgICBkaXN0YW5jZVZhcmlhbmNlOiBudW1iZXIgPSA2MDA7XHJcbiAgICBsaW5lV2lkdGg6IG51bWJlciA9IDg7XHJcbiAgICB3aWR0aFZhcmlhbmNlOiBudW1iZXIgPSA1O1xyXG5cclxuICAgIHJ1bkRpc3RhbmNlOiBudW1iZXIgPSAwO1xyXG4gICAgZ2V0IGN1cnJlbnRPZmZzZXQoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ydW5EaXN0YW5jZSAlIHRoaXMuZGlzdGFuY2U7XHJcbiAgICB9XHJcbiAgICBvbkRyYXdCYWNrZ3JvdW5kKGRlbHRhTXM6IG51bWJlciwpIHtcclxuICAgICAgICB0aGlzLnJ1bkRpc3RhbmNlIC09IGRlbHRhTXMgKiAwLjI7XHJcblxyXG4gICAgICAgIHRoaXMuYnJpc3QuZmlsbENvbG9yKGZDb2xvci5ncmVlbi5kYXJrZW4yKTtcclxuICAgICAgICB0aGlzLmJyaXN0LmZpbGxSZWN0RnJhbWUodGhpcy5mcmFtZSk7XHJcblxyXG4gICAgfVxyXG4gICAgb25EcmF3Rm9yZWdyb3VuZChkZWx0YU1zOiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgdG9wID0gdGhpcy5mcmFtZS50b3BZKCk7XHJcbiAgICAgICAgbGV0IGJvdHRvbSA9IHRoaXMuZnJhbWUuYm90dG9tWSgpO1xyXG4gICAgICAgIHRoaXMuYnJpc3QuZmlsbENvbG9yKGZDb2xvci53aGl0ZSk7XHJcblxyXG4gICAgICAgIGxldCBmcmFtZVdpZHRoID0gdGhpcy5mcmFtZS5tZWFzdXJlV2lkdGgoKTtcclxuICAgICAgICBsZXQgc3RhcnRYID0gdGhpcy5jdXJyZW50T2Zmc2V0IC0gdGhpcy5kaXN0YW5jZSAqIDEwMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gc3RhcnRYOyBpIDwgZnJhbWVXaWR0aCArIHRoaXMuZGlzdGFuY2UgKiAxMDA7IGkgKz0gdGhpcy5kaXN0YW5jZSkge1xyXG4gICAgICAgICAgICBsZXQgd2FycEFscGhhID0gKChmcmFtZVdpZHRoIC8gMiAtIGkpIC8gZnJhbWVXaWR0aCkgKiAyO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5icmlzdC5jdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIHRoaXMuYnJpc3QuY3R4Lm1vdmVUbyhpICsgd2FycEFscGhhICogdGhpcy5kaXN0YW5jZVZhcmlhbmNlLCB0b3ApO1xyXG4gICAgICAgICAgICB0aGlzLmJyaXN0LmN0eC5saW5lVG8oaSArIHRoaXMubGluZVdpZHRoICsgd2FycEFscGhhICogdGhpcy5kaXN0YW5jZVZhcmlhbmNlLCB0b3ApO1xyXG4gICAgICAgICAgICB0aGlzLmJyaXN0LmN0eC5saW5lVG8oaSArIHRoaXMubGluZVdpZHRoICsgdGhpcy53aWR0aFZhcmlhbmNlLCBib3R0b20pO1xyXG4gICAgICAgICAgICB0aGlzLmJyaXN0LmN0eC5saW5lVG8oaSwgYm90dG9tKTtcclxuICAgICAgICAgICAgdGhpcy5icmlzdC5jdHgubGluZVRvKGkgKyB3YXJwQWxwaGEgKiB0aGlzLmRpc3RhbmNlVmFyaWFuY2UsIHRvcCk7XHJcbiAgICAgICAgICAgIHRoaXMuYnJpc3QuY3R4LmNsb3NlUGF0aCgpO1xyXG4gICAgICAgICAgICB0aGlzLmJyaXN0LmN0eC5maWxsKCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBldmFsT3B0aW9uYWxGdW5jIH0gZnJvbSBcIi4uL0hlbHBlci9IZWxwZXJcIjtcclxuaW1wb3J0IHsgQ2FyZEJyaXN0b2wsIGZDb2xvciwgb3B0RnVuYywgVUlFbGVtZW50IH0gZnJvbSBcIi4uL2ltcG9ydHNcIjtcclxuaW1wb3J0IHsgVUlGcmFtZV9SZWN0X0Nvcm5lclNpemVkIH0gZnJvbSBcIi4uL0JyaXN0b2wvVUlGcmFtZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEltYWdlRWxlbWVudCBleHRlbmRzIFVJRWxlbWVudDxVSUZyYW1lX1JlY3RfQ29ybmVyU2l6ZWQ+e1xyXG4gICAgaW1hZ2VzOiBIVE1MSW1hZ2VFbGVtZW50W107XHJcbiAgICBjdXJyZW50RnJhbWVJbmRleDogb3B0RnVuYzxudW1iZXI+ID0gMDtcclxuICAgIGltZ0Rvd25sb2FkZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIHJvdGF0aW9uUGl2b3Q6IFtvcHRGdW5jPG51bWJlcj4sIG9wdEZ1bmM8bnVtYmVyPl0gPSBbMCwgMF07XHJcbiAgICByb3RhdGlvbjogb3B0RnVuYzxudW1iZXI+ID0gMDtcclxuICAgIGNvbnN0cnVjdG9yKHVpZDogc3RyaW5nLCB1cmw6IHN0cmluZ1tdLCBmcmFtZTogVUlGcmFtZV9SZWN0X0Nvcm5lclNpemVkLCBicmlzdDogQ2FyZEJyaXN0b2wpIHtcclxuICAgICAgICBzdXBlcih1aWQsIGZyYW1lLCBicmlzdCk7XHJcbiAgICAgICAgLy90aGlzLmZyYW1lLmFic1kgPSAoKSA9PiB7IHJldHVybiBicmlzdC5oZWlnaHQgLyAyIH07XHJcblxyXG4gICAgICAgIC8vIHRoaXMuZnJhbWUuaGVpZ2h0ID0gKCkgPT4geyByZXR1cm4gYnJpc3QuaGVpZ2h0ICogMiAvIDM7IH1cclxuICAgICAgICBsZXQgdGhzID0gdGhpcztcclxuICAgICAgICB0aGlzLmltYWdlcyA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdXJsLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2VzW2ldID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgICAgIGxldCB0bXAgPSBpO1xyXG4gICAgICAgICAgICB0aGlzLmltYWdlc1tpXS5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aHMub25Mb2FkZWQodG1wKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmltYWdlc1tpXS5zcmMgPSB1cmxbaV07XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgLy8gdGhpcy5yb3RhdGlvbiA9ICgpID0+IHsgcmV0dXJuIE1hdGguUEkgKiB0aHMudGltZSB9O1xyXG4gICAgICAgIC8vIHRoaXMuc2V0UGl2b3RUb0NlbnRlcigpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBnZXQgY3VycmVudEZyYW1lKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmltYWdlc1tNYXRoLm1pbih0aGlzLmltYWdlcy5sZW5ndGggLSAxLCBldmFsT3B0aW9uYWxGdW5jKHRoaXMuY3VycmVudEZyYW1lSW5kZXgsIDApKV0gPz8gbnVsbDtcclxuICAgIH1cclxuICAgIGFuaW1hdGVGcmFtZXMoZnBzOiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgdGltZUJldHdlZW5GcmFtZXMgPSAxIC8gZnBzO1xyXG4gICAgICAgIGxldCB0aW1lQmV0d2Vlbkxvb3BzID0gdGltZUJldHdlZW5GcmFtZXMgKiB0aGlzLmltYWdlcy5sZW5ndGg7XHJcbiAgICAgICAgbGV0IHRocyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50RnJhbWVJbmRleCA9ICgpID0+IHtcclxuICAgICAgICAgICAgbGV0IGFscGhhID0gKHRocy50aW1lICUgdGltZUJldHdlZW5Mb29wcykgLyB0aW1lQmV0d2Vlbkxvb3BzO1xyXG4gICAgICAgICAgICBsZXQgY3VycmVudEZyYW1lID0gTWF0aC5yb3VuZChhbHBoYSAqICh0aGlzLmltYWdlcy5sZW5ndGggLSAxKSk7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coY3VycmVudEZyYW1lKTtcclxuICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnRGcmFtZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzZXRTY2FsZShzY2FsZTogbnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IHRocyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5mcmFtZS53aWR0aCA9ICgpID0+IHsgcmV0dXJuIHRocy5jdXJyZW50RnJhbWU/Lm5hdHVyYWxXaWR0aCAqIHNjYWxlID8/IDEwIH07XHJcbiAgICAgICAgdGhpcy5mcmFtZS5oZWlnaHQgPSAoKSA9PiB7IHJldHVybiB0aHMuY3VycmVudEZyYW1lPy5uYXR1cmFsSGVpZ2h0ICogc2NhbGUgPz8gMTAgfTtcclxuICAgIH1cclxuICAgIHNldEZyYW1lSW5kZXgoZnJhbWVJbmRleDogb3B0RnVuYzxudW1iZXI+KSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50RnJhbWVJbmRleCA9IGZyYW1lSW5kZXg7XHJcbiAgICB9XHJcbiAgICBzZXRQaXZvdFRvQ2VudGVyKHVzZUZ1bmM6IGJvb2xlYW4gPSB0cnVlKSB7XHJcbiAgICAgICAgaWYgKHVzZUZ1bmMpIHtcclxuICAgICAgICAgICAgbGV0IHRocyA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMucm90YXRpb25QaXZvdFswXSA9ICgpID0+ICh0aHMuZnJhbWUubWVhc3VyZVdpZHRoKCkgLyAyKTtcclxuICAgICAgICAgICAgdGhpcy5yb3RhdGlvblBpdm90WzFdID0gKCkgPT4gKHRocy5mcmFtZS5tZWFzdXJlSGVpZ2h0KCkgLyAyKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnJvdGF0aW9uUGl2b3RbMF0gPSAodGhpcy5mcmFtZS5tZWFzdXJlV2lkdGgoKSAvIDIpO1xyXG4gICAgICAgICAgICB0aGlzLnJvdGF0aW9uUGl2b3RbMV0gPSAodGhpcy5mcmFtZS5tZWFzdXJlSGVpZ2h0KCkgLyAyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzZXRQaXZvdEJ5UGVyY2VudCh4QWxwaGE6IG9wdEZ1bmM8bnVtYmVyPiwgeUFscGhhOiBvcHRGdW5jPG51bWJlcj4pIHtcclxuICAgICAgICB0aGlzLnJvdGF0aW9uUGl2b3RbMF0gPSAoKSA9PiAodGhpcy5mcmFtZS5tZWFzdXJlV2lkdGgoKSAqIGV2YWxPcHRpb25hbEZ1bmMoeEFscGhhLCAwKSk7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvblBpdm90WzFdID0gKCkgPT4gKHRoaXMuZnJhbWUubWVhc3VyZUhlaWdodCgpICogZXZhbE9wdGlvbmFsRnVuYyh5QWxwaGEsIDApKTtcclxuICAgIH1cclxuICAgIG9uTG9hZGVkKGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmltZ0Rvd25sb2FkZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgdGltZTogbnVtYmVyID0gMDtcclxuXHJcbiAgICBvbkRyYXdCYWNrZ3JvdW5kKGRlbHRhTXM6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMudGltZSArPSBkZWx0YU1zICogMC4wMDE7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1nRG93bmxvYWRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmJyaXN0LmN0eC5zYXZlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuYnJpc3QuY3R4LnRyYW5zbGF0ZSh0aGlzLmZyYW1lLmxlZnRYKCksIHRoaXMuZnJhbWUudG9wWSgpKTtcclxuICAgICAgICAgICAgdGhpcy5icmlzdC5jdHgucm90YXRlKGV2YWxPcHRpb25hbEZ1bmModGhpcy5yb3RhdGlvbiwgMCkpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5icmlzdC5jdHguZHJhd0ltYWdlKHRoaXMuY3VycmVudEZyYW1lLCAwIC0gZXZhbE9wdGlvbmFsRnVuYyh0aGlzLnJvdGF0aW9uUGl2b3RbMF0sIDApLCAwIC0gZXZhbE9wdGlvbmFsRnVuYyh0aGlzLnJvdGF0aW9uUGl2b3RbMV0sIDApLCB0aGlzLmZyYW1lLm1lYXN1cmVXaWR0aCgpLCB0aGlzLmZyYW1lLm1lYXN1cmVIZWlnaHQoKSk7XHJcbiAgICAgICAgICAgIC8vIHRoaXMuYnJpc3Quc3Ryb2tlV2VpZ2h0KDEpO1xyXG4gICAgICAgICAgICAvLyAgdGhpcy5icmlzdC5zdHJva2VDb2xvcihmQ29sb3IucmVkLmFjY2VudDEpO1xyXG4gICAgICAgICAgICAvLyAgdGhpcy5icmlzdC5jdHguc3Ryb2tlUmVjdCgwIC0gZXZhbE9wdGlvbmFsRnVuYyh0aGlzLnJvdGF0aW9uUGl2b3RbMF0sIDApLCAwIC0gZXZhbE9wdGlvbmFsRnVuYyh0aGlzLnJvdGF0aW9uUGl2b3RbMV0sIDApLCB0aGlzLmZyYW1lLm1lYXN1cmVXaWR0aCgpLCB0aGlzLmZyYW1lLm1lYXN1cmVIZWlnaHQoKSk7XHJcbiAgICAgICAgICAgIHRoaXMuYnJpc3QuY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB0aWxlWCh0aWxlQ291bnQ6IG51bWJlcikge1xyXG4gICAgICAgIGxldCB0aHMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMub25EcmF3QmFja2dyb3VuZCA9IGZ1bmN0aW9uIChkZWx0YU1zOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgdGhzLnRpbWUgKz0gZGVsdGFNcyAqIDAuMDAxO1xyXG4gICAgICAgICAgICBpZiAodGhzLmltZ0Rvd25sb2FkZWQpIHtcclxuICAgICAgICAgICAgICAgIHRocy5icmlzdC5jdHguc2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhzLmJyaXN0LmN0eC50cmFuc2xhdGUodGhzLmZyYW1lLmxlZnRYKCksIHRocy5mcmFtZS50b3BZKCkpO1xyXG4gICAgICAgICAgICAgICAgdGhzLmJyaXN0LmN0eC5yb3RhdGUoZXZhbE9wdGlvbmFsRnVuYyh0aHMucm90YXRpb24sIDApKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRpbGVDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhzLmJyaXN0LmN0eC5kcmF3SW1hZ2UodGhzLmN1cnJlbnRGcmFtZSAsIDAgLSBldmFsT3B0aW9uYWxGdW5jKHRocy5yb3RhdGlvblBpdm90WzBdLCAwKSArIGkgKiB0aHMuZnJhbWUubWVhc3VyZVdpZHRoKCksIDAgLSBldmFsT3B0aW9uYWxGdW5jKHRoaXMucm90YXRpb25QaXZvdFsxXSwgMCksIHRoaXMuZnJhbWUubWVhc3VyZVdpZHRoKCksIHRoaXMuZnJhbWUubWVhc3VyZUhlaWdodCgpKTtcclxuICAgICAgICAgICAgICAgIH0vLyB0aGlzLmJyaXN0LnN0cm9rZVdlaWdodCgxKTtcclxuICAgICAgICAgICAgICAgIC8vICB0aGlzLmJyaXN0LnN0cm9rZUNvbG9yKGZDb2xvci5yZWQuYWNjZW50MSk7XHJcbiAgICAgICAgICAgICAgICAvLyAgdGhpcy5icmlzdC5jdHguc3Ryb2tlUmVjdCgwIC0gZXZhbE9wdGlvbmFsRnVuYyh0aGlzLnJvdGF0aW9uUGl2b3RbMF0sIDApLCAwIC0gZXZhbE9wdGlvbmFsRnVuYyh0aGlzLnJvdGF0aW9uUGl2b3RbMV0sIDApLCB0aGlzLmZyYW1lLm1lYXN1cmVXaWR0aCgpLCB0aGlzLmZyYW1lLm1lYXN1cmVIZWlnaHQoKSk7XHJcbiAgICAgICAgICAgICAgICB0aHMuYnJpc3QuY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgQ2FyZEJyaXN0b2wgfSBmcm9tIFwiLi4vQnJpc3RvbC9NYWluQnJpc3RvbFwiO1xyXG5pbXBvcnQgeyBldmFsT3B0aW9uYWxGdW5jIH0gZnJvbSBcIi4uL0hlbHBlci9IZWxwZXJcIjtcclxuaW1wb3J0IHsgQnJpc3RvbEZvbnRGYW1pbHksIEJyaXN0b2xIQWxpZ24sIEJyaXN0b2xWQWxpZ24sIG9wdEZ1bmMsIFVJRWxlbWVudCB9IGZyb20gXCIuLi9pbXBvcnRzXCI7XHJcbmltcG9ydCB7IFVJRnJhbWVfUmVjdF9Db3JuZXJTaXplZCB9IGZyb20gXCIuLi9CcmlzdG9sL1VJRnJhbWVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTcGVjaWFsTWVzc2FnZSBleHRlbmRzIFVJRWxlbWVudDxVSUZyYW1lX1JlY3RfQ29ybmVyU2l6ZWQ+e1xyXG4gICAgZ2V0VGV4dDogKCkgPT4gc3RyaW5nO1xyXG4gICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgdGV4dDogb3B0RnVuYzxzdHJpbmc+LCBmcmFtZTogVUlGcmFtZV9SZWN0X0Nvcm5lclNpemVkLCBicmlzdDogQ2FyZEJyaXN0b2wpIHtcclxuICAgICAgICBzdXBlcihpZCwgZnJhbWUsIGJyaXN0KTtcclxuICAgICAgICB0aGlzLmdldFRleHQgPSAoKSA9PiBldmFsT3B0aW9uYWxGdW5jKHRleHQpO1xyXG4gICAgfVxyXG4gICAgb25EcmF3QmFja2dyb3VuZChkZWx0YU1zOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmJyaXN0LmZpbGxDb2xvcihmQ29sb3Iud2hpdGUpO1xyXG4gICAgICAgIHRoaXMuYnJpc3QuZmlsbFJlY3RGcmFtZSh0aGlzLmZyYW1lKTtcclxuICAgICAgICB0aGlzLmJyaXN0Lm5vU3Ryb2tlKCk7XHJcbiAgICAgICAgdGhpcy5icmlzdC5maWxsQ29sb3IoZkNvbG9yLmdyZWVuLmRhcmtlbjEpO1xyXG4gICAgICAgIHRoaXMuYnJpc3QudGV4dEFsaWduKEJyaXN0b2xIQWxpZ24uTGVmdCwgQnJpc3RvbFZBbGlnbi5NaWRkbGUpO1xyXG4gICAgICAgIHRoaXMuYnJpc3QuZm9udEZhbWlseShCcmlzdG9sRm9udEZhbWlseS5WZXJkYW5hKTtcclxuICAgICAgICB0aGlzLmJyaXN0LnRleHRTaXplKDE4KTtcclxuICAgICAgICB0aGlzLmJyaXN0LnRleHQodGhpcy5nZXRUZXh0KCksIHRoaXMuZnJhbWUubGVmdFgoKSArIHRoaXMuZnJhbWUubWVhc3VyZUhlaWdodCgpLzIsIHRoaXMuZnJhbWUuY2VudGVyWSgpKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IENhcmRCcmlzdG9sLCBmQ29sb3IsIFVJRWxlbWVudCB9IGZyb20gXCIuLi9pbXBvcnRzXCI7XHJcbmltcG9ydCB7IFVJRnJhbWVfUmVjdF9Db3JuZXJTaXplZCB9IGZyb20gXCIuLi9CcmlzdG9sL1VJRnJhbWVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTa3kgZXh0ZW5kcyBVSUVsZW1lbnQ8VUlGcmFtZV9SZWN0X0Nvcm5lclNpemVkPntcclxuICAgIGNvbnN0cnVjdG9yKHVpZDogc3RyaW5nLCBicmlzdDogQ2FyZEJyaXN0b2wpIHtcclxuICAgICAgICBzdXBlcih1aWQsIG5ldyBVSUZyYW1lX1JlY3RfQ29ybmVyU2l6ZWQoMCwgMCksIGJyaXN0KTtcclxuICAgICAgICAvL3RoaXMuZnJhbWUuYWJzWSA9ICgpID0+IHsgcmV0dXJuIGJyaXN0LmhlaWdodCAvIDIgfTtcclxuICAgICAgICB0aGlzLmZyYW1lLndpZHRoID0gKCkgPT4geyByZXR1cm4gYnJpc3Qud2lkdGggfTtcclxuICAgICAgICB0aGlzLmZyYW1lLmhlaWdodCA9ICgpID0+IHsgcmV0dXJuIGJyaXN0LmhlaWdodCAqIDIgLyAzOyB9XHJcbiAgICB9XHJcbiAgICBvbkRyYXdCYWNrZ3JvdW5kKGRlbHRhTXM6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuYnJpc3QuZmlsbENvbG9yKGZDb2xvci5ibHVlLmxpZ2h0ZW4xKTtcclxuICAgICAgICB0aGlzLmJyaXN0LmZpbGxSZWN0RnJhbWUodGhpcy5mcmFtZSk7XHJcbiAgICB9XHJcbiAgICBcclxufSIsImltcG9ydCB7IENhcmRCcmlzdG9sLCBsZXJwLCBNb3VzZUJ0bklucHV0RXZlbnQsIE1vdXNlRHJhZ2dlZElucHV0RXZlbnQsIFVJRWxlbWVudCwgVUlGcmFtZV9SZWN0X0Nvcm5lclNpemVkIH0gZnJvbSBcIi4uL2ltcG9ydHNcIjtcclxuaW1wb3J0IHsgSW1hZ2VFbGVtZW50IH0gZnJvbSBcIi4vSW1hZ2VFbGVtXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2xvdExldmVyQXNzZW1ibHkgZXh0ZW5kcyBVSUVsZW1lbnQ8VUlGcmFtZV9SZWN0X0Nvcm5lclNpemVkPntcclxuICAgIHB1bGxBbHBoYTogbnVtYmVyID0gMC4wO1xyXG4gICAgbWFjaGluZTogU2xvdE1hY2hpbmU7XHJcbiAgICByYW5kb21OZXNzOiBudW1iZXIgPSAwLjVcclxuICAgIHBhdzogSFRNTEltYWdlRWxlbWVudDtcclxuICAgIGNvbnN0cnVjdG9yKHVpZDogc3RyaW5nLCBtYWNoaW5lOiBTbG90TWFjaGluZSkge1xyXG4gICAgICAgIHN1cGVyKHVpZCwgbmV3IFVJRnJhbWVfUmVjdF9Db3JuZXJTaXplZCgwLCAwLCBtYWNoaW5lLmNvbFdpZHRoLCBtYWNoaW5lLmNvbEhlaWdodCAqIDIpLCBtYWNoaW5lLmJyaXN0KTtcclxuICAgICAgICB0aGlzLm1hY2hpbmUgPSBtYWNoaW5lO1xyXG4gICAgICAgIHRoaXMucGF3ID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgdGhpcy5wYXcuc3JjID0gJy4vUGFqYW1hUGF3LnBuZyc7XHJcbiAgICAgICAgdGhpcy56T2Zmc2V0ID0gMlxyXG4gICAgfVxyXG4gICAgaXNQcmVzc2VkOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBtb3VzZVByZXNzZWQoZXZ0OiBNb3VzZUJ0bklucHV0RXZlbnQpIHtcclxuICAgICAgICB0aGlzLmlzUHJlc3NlZCA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBtb3VzZVJlbGVhc2VkKGV2dDogTW91c2VCdG5JbnB1dEV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5pc1ByZXNzZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmxhc3REcmFnVGltZSA9IC0xO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgbGFzdERyYWdUaW1lOiBudW1iZXIgPSAtMTtcclxuICAgIG1vdXNlRHJhZ2dlZChldnQ6IE1vdXNlRHJhZ2dlZElucHV0RXZlbnQpIHtcclxuICAgICAgICBsZXQgY3VycmVudCA9IERhdGUubm93KCk7XHJcbiAgICAgICAgdGhpcy5pc1ByZXNzZWQgPSB0cnVlO1xyXG4gICAgICAgIGxldCBwZXJjZW50RGVsdGEgPSBldnQuZGVsdGFZIC8gKHRoaXMuZnJhbWUubWVhc3VyZUhlaWdodCgpIC0gdGhpcy5tYWNoaW5lLnBhZGRpbmcgKiAyKVxyXG4gICAgICAgIGxldCBkZWx0YVNlYyA9IChjdXJyZW50IC0gdGhpcy5sYXN0RHJhZ1RpbWUpIC8gMTA7XHJcbiAgICAgICAgaWYgKGRlbHRhU2VjID09IDApIHtcclxuICAgICAgICAgICAgZGVsdGFTZWMgPSAwLjAwMVxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcHVsbFZlbG9jaXR5ID0gKGV2dC5kZWx0YVkgLyBkZWx0YVNlYykgLyB0aGlzLm1hY2hpbmUud2hlZWxzLndoZWVsc1swXS50aWxlU2l6ZTtcclxuICAgICAgICBjb25zb2xlLmxvZyhwdWxsVmVsb2NpdHkpO1xyXG4gICAgICAgIHRoaXMubWFjaGluZS53aGVlbHMud2hlZWxzWzBdLnNwaW5UaW1lTGVmdCA9IDVcclxuICAgICAgICB0aGlzLm1hY2hpbmUud2hlZWxzLndoZWVsc1sxXS5zcGluVGltZUxlZnQgPSA1XHJcbiAgICAgICAgdGhpcy5tYWNoaW5lLndoZWVscy53aGVlbHNbMl0uc3BpblRpbWVMZWZ0ID0gNVxyXG4gICAgICAgIGlmICghTnVtYmVyLmlzTmFOKHB1bGxWZWxvY2l0eSkpIHtcclxuICAgICAgICAgICAgdGhpcy5tYWNoaW5lLndoZWVscy53aGVlbHNbMF0udmVsb2NpdHkgKz0gcHVsbFZlbG9jaXR5ICogKE1hdGgucmFuZG9tKCkgKiB0aGlzLnJhbmRvbU5lc3MgKyAoMSAtIHRoaXMucmFuZG9tTmVzcykpO1xyXG4gICAgICAgICAgICB0aGlzLm1hY2hpbmUud2hlZWxzLndoZWVsc1sxXS52ZWxvY2l0eSArPSBwdWxsVmVsb2NpdHkgKiAoTWF0aC5yYW5kb20oKSAqIHRoaXMucmFuZG9tTmVzcyArICgxIC0gdGhpcy5yYW5kb21OZXNzKSk7XHJcbiAgICAgICAgICAgIHRoaXMubWFjaGluZS53aGVlbHMud2hlZWxzWzJdLnZlbG9jaXR5ICs9IHB1bGxWZWxvY2l0eSAqIChNYXRoLnJhbmRvbSgpICogdGhpcy5yYW5kb21OZXNzICsgKDEgLSB0aGlzLnJhbmRvbU5lc3MpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wdWxsQWxwaGEgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxLCB0aGlzLnB1bGxBbHBoYSArIHBlcmNlbnREZWx0YSkpXHJcblxyXG4gICAgICAgIHRoaXMubGFzdERyYWdUaW1lID0gY3VycmVudDtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBvbkRyYXdCYWNrZ3JvdW5kKGRlbHRhTXM6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuYnJpc3QuZmlsbENvbG9yKGZDb2xvci5ncmVlbi5kYXJrZW4yKTtcclxuICAgICAgICB0aGlzLmJyaXN0LnJvdW5kZWRSZWN0RnJhbWUodGhpcy5mcmFtZSwgdGhpcy5tYWNoaW5lLnBhZGRpbmcsIHRydWUpO1xyXG4gICAgICAgIHRoaXMuYnJpc3Quc3Ryb2tlQ29sb3IoZkNvbG9yLmdyZXkuZGFya2VuMik7XHJcbiAgICAgICAgdGhpcy5icmlzdC5zdHJva2VXZWlnaHQoNCk7XHJcbiAgICAgICAgbGV0IHRyYWNrU3RhcnQgPSBbdGhpcy5mcmFtZS5jZW50ZXJYKCksIHRoaXMuZnJhbWUudG9wWSgpICsgdGhpcy5tYWNoaW5lLnBhZGRpbmddO1xyXG4gICAgICAgIGxldCB0cmFja0VuZCA9IFt0aGlzLmZyYW1lLmNlbnRlclgoKSwgdGhpcy5mcmFtZS5ib3R0b21ZKCkgLSB0aGlzLm1hY2hpbmUucGFkZGluZ107XHJcbiAgICAgICAgdGhpcy5icmlzdC5saW5lKHRyYWNrU3RhcnRbMF0sIHRyYWNrU3RhcnRbMV0sIHRyYWNrRW5kWzBdLCB0cmFja0VuZFsxXSk7XHJcbiAgICAgICAgdGhpcy5icmlzdC5maWxsQ29sb3IoZkNvbG9yLmxpZ2h0R3JlZW4uYWNjZW50Myk7Ly90aGlzLmlzUHJlc3NlZCA/IGZDb2xvci5ibHVlLmFjY2VudDEgOiBmQ29sb3IucmVkLmFjY2VudDEpO1xyXG4gICAgICAgIGxldCBsZXZlclkgPSBsZXJwKHRyYWNrU3RhcnRbMV0sIHRyYWNrRW5kWzFdLCB0aGlzLnB1bGxBbHBoYSk7XHJcbiAgICAgICAgbGV0IGxldmVyU2l6ZSA9IHRoaXMuZnJhbWUubWVhc3VyZVdpZHRoKCkgLSB0aGlzLm1hY2hpbmUucGFkZGluZztcclxuXHJcblxyXG4gICAgICAgIHRoaXMuYnJpc3QuY3R4LmRyYXdJbWFnZSh0aGlzLnBhdywgdHJhY2tTdGFydFswXSAtIGxldmVyU2l6ZSAqIDAuOSwgbGV2ZXJZIC0gbGV2ZXJTaXplICogKHRoaXMuaXNQcmVzc2VkID8gMS4yIDogMS41KSwgbGV2ZXJTaXplICogdGhpcy5wYXcud2lkdGggLyB0aGlzLnBhdy5oZWlnaHQsIGxldmVyU2l6ZSlcclxuICAgICAgICB0aGlzLmJyaXN0LmVsbGlwc2UodHJhY2tTdGFydFswXSwgbGV2ZXJZLCBsZXZlclNpemUsIGxldmVyU2l6ZSwgZmFsc2UsIHRydWUpO1xyXG4gICAgICAgIGlmICh0aGlzLnB1bGxBbHBoYSA+IDAgJiYgIXRoaXMuaXNQcmVzc2VkKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHVsbEFscGhhID0gTWF0aC5tYXgoMCwgdGhpcy5wdWxsQWxwaGEgLSAoZGVsdGFNcyAvIDEwMDApKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIFNsb3RNYWNoaW5lV2hlZWwgZXh0ZW5kcyBVSUVsZW1lbnQ8VUlGcmFtZV9SZWN0X0Nvcm5lclNpemVkPntcclxuICAgIG9mZnNldDogbnVtYmVyID0gMDtcclxuICAgIHRpbGVTaXplOiBudW1iZXIgPSAwXHJcbiAgICBpbWFnZXM6IEhUTUxJbWFnZUVsZW1lbnRbXTtcclxuICAgIG1hY2hpbmU6IFNsb3RNYWNoaW5lO1xyXG4gICAgdmVsb2NpdHk6IG51bWJlciA9IDA7XHJcbiAgICBzcGluVGltZUxlZnQ6IG51bWJlciA9IDNcclxuICAgIGNvbnN0cnVjdG9yKHVpZDogc3RyaW5nLCBmcmFtZTogVUlGcmFtZV9SZWN0X0Nvcm5lclNpemVkLCBtYWNoaW5lOiBTbG90TWFjaGluZSkge1xyXG4gICAgICAgIHN1cGVyKHVpZCwgZnJhbWUsIG1hY2hpbmUuYnJpc3QpO1xyXG4gICAgICAgIHRoaXMubWFjaGluZSA9IG1hY2hpbmU7XHJcbiAgICAgICAgbGV0IHRocyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy50aWxlU2l6ZSA9IHRoaXMuZnJhbWUubWVhc3VyZVdpZHRoKCkgLSBtYWNoaW5lLnBhZGRpbmcgKiAyO1xyXG4gICAgICAgIGxldCBpbWdVcmxzID0gWycuL2RvZ2dvL2RvZ2dvMC5wbmcnLCAnLi9kb2dnby9kb2dnbzEucG5nJywgJy4vZG9nZ28vZG9nZ28yLnBuZycsICcuL2RvZ2dvL2RvZ2dvMy5wbmcnLCAnLi9kb2dnby9wdXBwMS5wbmcnLCAnLi9kb2dnby9wdXBweTIucG5nJ107XHJcbiAgICAgICAgdGhpcy5pbWFnZXMgPSBbXTtcclxuXHJcblxyXG5cclxuICAgICAgICBsZXQgdGlsZXMgPSBbXTtcclxuICAgICAgICB0aGlzLmltYWdlcy5sZW5ndGggPSBpbWdVcmxzLmxlbmd0aDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGltZ1VybHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5pbWFnZXNbaV0gPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgdGhpcy5pbWFnZXNbaV0uc3JjID0gaW1nVXJsc1tpXTtcclxuXHJcbiAgICAgICAgICAgIC8vIGxldCBmcmVzaFRpbGUgPSBuZXcgSW1hZ2VFbGVtZW50KGBTbG90VGlsZSR7aX1gLCBbaW1nVXJsc1tpXV0sIG5ldyBVSUZyYW1lX1JlY3RfQ29ybmVyU2l6ZWQobWFjaGluZS5wYWRkaW5nLCAwKSwgbWFjaGluZS5icmlzdCk7XHJcbiAgICAgICAgICAgIC8vIGZyZXNoVGlsZVsndGlsZUluZGV4J10gPSBpO1xyXG4gICAgICAgICAgICAvLyBmcmVzaFRpbGUuZnJhbWUud2lkdGggPSB0aHMudGlsZVNpemU7XHJcbiAgICAgICAgICAgIC8vIGZyZXNoVGlsZS5mcmFtZS5oZWlnaHQgPSB0aHMudGlsZVNpemU7XHJcbiAgICAgICAgICAgIC8vIGZyZXNoVGlsZS5mcmFtZS5yZWxZID0gKCk9PntcclxuICAgICAgICAgICAgLy8gICAgIGxldCBzdGFydFkgPSAwIC0gKHRocy50aWxlU2l6ZSArIG1hY2hpbmUucGFkZGluZykgKyBmcmVzaFRpbGVbJ3RpbGVJbmRleCddICogKHRocy50aWxlU2l6ZSArIG1hY2hpbmUucGFkZGluZylcclxuICAgICAgICAgICAgLy8gICAgIHJldHVybiBzdGFydFkgKyB0aGlzLm9mZnNldDtcclxuICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAvLyB0aWxlcy5wdXNoKGZyZXNoVGlsZSk7XHJcbiAgICAgICAgICAgIC8vIHRoaXMuYWRkQ2hpbGQoZnJlc2hUaWxlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnZXQgZnVsbFRpbGVXaWR0aCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50aWxlU2l6ZSArIHRoaXMubWFjaGluZS5wYWRkaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGlzU3Bpbm5pbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIG9uRHJhd0JhY2tncm91bmQoZGVsdGFNczogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5icmlzdC5maWxsQ29sb3IoZkNvbG9yLmdyZXkubGlnaHRlbjQpO1xyXG4gICAgICAgIHRoaXMuYnJpc3QuZmlsbFJlY3RGcmFtZSh0aGlzLmZyYW1lKTtcclxuICAgICAgICB0aGlzLm9mZnNldCArPSAoZGVsdGFNcyAvIDEwMDApICogdGhpcy52ZWxvY2l0eSAqIHRoaXMuZnVsbFRpbGVXaWR0aDtcclxuXHJcbiAgICAgICAgLy8gbGV0IGltZ0luZGV4ID0gc3RhcnRJbmRleDtcclxuICAgICAgICAvLyBmb3IobGV0IGltZ1kgPSB0aGlzLmZyYW1lLmNlbnRlclkoKSAtIHRoaXMudGlsZVNpemUvMiAtIHRoaXMuZnVsbFRpbGVXaWR0aCArIHRoaXMub2Zmc2V0OyBpbWdZIDwgdGhpcy5mcmFtZS5ib3R0b21ZKCkgKyB0aGlzLmZ1bGxUaWxlV2lkdGg7IGltZ1kgKz0gdGhpcy5mdWxsVGlsZVdpZHRoKXtcclxuICAgICAgICAvLyAgICAgdGhpcy5icmlzdC5jdHguZHJhd0ltYWdlKHRoaXMuaW1hZ2VzW2ltZ0luZGV4ICUgKCB0aGlzLmltYWdlcy5sZW5ndGggLSAxKV0sIHRoaXMuZnJhbWUubGVmdFgoKSArIHRoaXMubWFjaGluZS5wYWRkaW5nLCBpbWdZLCB0aGlzLnRpbGVTaXplLCB0aGlzLnRpbGVTaXplKVxyXG4gICAgICAgIC8vICAgICBpbWdJbmRleCsrO1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgbGV0IGRpc3RhbmNlVG9FbnRyeSA9IE1hdGguYWJzKDEuNSAtIDIgKiAoKHRoaXMub2Zmc2V0ICUgdGhpcy50aWxlU2l6ZSkgLyB0aGlzLnRpbGVTaXplKSk7XHJcbiAgICAgICAgaWYgKHRoaXMuc3BpblRpbWVMZWZ0ID4gMyB8fCBkaXN0YW5jZVRvRW50cnkgPiAwLjIpIHtcclxuICAgICAgICAgICAgLy8gdGhpcy52ZWxvY2l0eSA9IDI7XHJcbiAgICAgICAgICAgIHRoaXMuaXNTcGlubmluZyA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIGlmIChNYXRoLmFicyh0aGlzLnZlbG9jaXR5KSA8IDAuMDEpIHtcclxuICAgICAgICAgICAgdGhpcy52ZWxvY2l0eSA9IDA7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzU3Bpbm5pbmcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25MYW5kKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5pc1NwaW5uaW5nID0gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5pc1NwaW5uaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy52ZWxvY2l0eSA9ICh0aGlzLnZlbG9jaXR5IC0gZGlzdGFuY2VUb0VudHJ5KSAqIDAuNjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vdGhpcy5icmlzdC5jdHguZmlsbFN0eWxlID0gYHJnYigwLDAsJHtsZXJwKDAsIDI1NSwgZGlzdGFuY2VUb0VudHJ5KX0pYDtcclxuICAgICAgICB0aGlzLmJyaXN0LmN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICB0aGlzLmJyaXN0LnJlY3RGcmFtZSh0aGlzLmZyYW1lKTtcclxuICAgICAgICB0aGlzLmJyaXN0LmN0eC5zYXZlKCk7XHJcbiAgICAgICAgdGhpcy5icmlzdC5jdHguY2xpcCgpO1xyXG5cclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhkaXN0YW5jZVRvRW50cnkpO1xyXG4gICAgICAgIGZvciAobGV0IGltYWdlSW5kZXggPSAwOyBpbWFnZUluZGV4IDwgdGhpcy5pbWFnZXMubGVuZ3RoOyBpbWFnZUluZGV4KyspIHtcclxuICAgICAgICAgICAgbGV0IGltZ1kgPSB0aGlzLmZyYW1lLmNlbnRlclkoKSAtIHRoaXMudGlsZVNpemUgLyAyIC0gdGhpcy5mdWxsVGlsZVdpZHRoICogKHRoaXMuaW1hZ2VzLmxlbmd0aCAtIDIpICsgKCh0aGlzLm9mZnNldCArIHRoaXMuZnVsbFRpbGVXaWR0aCAqIGltYWdlSW5kZXgpICUgKHRoaXMuZnVsbFRpbGVXaWR0aCAqIHRoaXMuaW1hZ2VzLmxlbmd0aCkpO1xyXG5cclxuXHJcblxyXG5cclxuICAgICAgICAgICAgdGhpcy5icmlzdC5jdHguZHJhd0ltYWdlKHRoaXMuaW1hZ2VzW2ltYWdlSW5kZXhdLCB0aGlzLmZyYW1lLmxlZnRYKCkgKyB0aGlzLm1hY2hpbmUucGFkZGluZywgaW1nWSwgdGhpcy50aWxlU2l6ZSwgdGhpcy50aWxlU2l6ZSlcclxuXHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmJyaXN0LmN0eC5yZXN0b3JlKCk7XHJcbiAgICAgICAgdGhpcy5zcGluVGltZUxlZnQgLT0gZGVsdGFNcyAvIDEwMDA7XHJcbiAgICB9XHJcbiAgICBvbkxhbmQoKSB7XHJcbiAgICAgICAgdGhpcy5pc1NwaW5uaW5nID0gZmFsc2U7XHJcbiAgICAgICAgbGV0IGxhbmRlZE9uID0gTWF0aC5mbG9vcigodGhpcy5vZmZzZXQgJSB0aGlzLmZ1bGxUaWxlV2lkdGggKiB0aGlzLmltYWdlcy5sZW5ndGgpICUgdGhpcy5mdWxsVGlsZVdpZHRoIC0gMSkgJSB0aGlzLmltYWdlcy5sZW5ndGg7XHJcbiAgICAgICAgY29uc29sZS5sb2coYCR7dGhpcy5pZH0gbGFuZGVkICR7bGFuZGVkT259YClcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubWFjaGluZS53aGVlbHMud2hlZWxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1hY2hpbmUud2hlZWxzLndoZWVsc1tpXS52ZWxvY2l0eSA+IDAuMDEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm1hY2hpbmUuaG9sZS5zaG93KHRoaXMuaW1hZ2VzW2xhbmRlZE9uXSlcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgU2xvdE1hY2hpbmVXaGVlbHMgZXh0ZW5kcyBVSUVsZW1lbnQ8VUlGcmFtZV9SZWN0X0Nvcm5lclNpemVkPntcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih1aWQ6IHN0cmluZywgZnJhbWU6IFVJRnJhbWVfUmVjdF9Db3JuZXJTaXplZCwgbWFjaGluZTogU2xvdE1hY2hpbmUpIHtcclxuICAgICAgICBzdXBlcih1aWQsIGZyYW1lLCBtYWNoaW5lLmJyaXN0KTtcclxuICAgICAgICBsZXQgdGhzID0gdGhpcztcclxuICAgICAgICB0aGlzLndoZWVscyA9IFtcclxuICAgICAgICAgICAgbmV3IFNsb3RNYWNoaW5lV2hlZWwoJ3doZWVsMScsIG5ldyBVSUZyYW1lX1JlY3RfQ29ybmVyU2l6ZWQobWFjaGluZS5wYWRkaW5nLCBtYWNoaW5lLnBhZGRpbmcsIG1hY2hpbmUuY29sV2lkdGgsIG1hY2hpbmUuY29sSGVpZ2h0KSwgbWFjaGluZSksXHJcbiAgICAgICAgICAgIG5ldyBTbG90TWFjaGluZVdoZWVsKCd3aGVlbDInLCBuZXcgVUlGcmFtZV9SZWN0X0Nvcm5lclNpemVkKDAsIDAsIG1hY2hpbmUuY29sV2lkdGgsIG1hY2hpbmUuY29sSGVpZ2h0KSwgbWFjaGluZSksXHJcbiAgICAgICAgICAgIG5ldyBTbG90TWFjaGluZVdoZWVsKCd3aGVlbDMnLCBuZXcgVUlGcmFtZV9SZWN0X0Nvcm5lclNpemVkKDAsIDAsIG1hY2hpbmUuY29sV2lkdGgsIG1hY2hpbmUuY29sSGVpZ2h0KSwgbWFjaGluZSlcclxuICAgICAgICBdXHJcblxyXG4gICAgICAgIHRoaXMud2hlZWxzWzFdLmZyYW1lLmFic1ggPSAoKSA9PiAodGhzLndoZWVsc1swXS5mcmFtZS5yaWdodFgoKSArIG1hY2hpbmUucGFkZGluZylcclxuICAgICAgICB0aGlzLndoZWVsc1sxXS5mcmFtZS5hYnNZID0gKCkgPT4gKHRocy53aGVlbHNbMF0uZnJhbWUudG9wWSgpKVxyXG5cclxuICAgICAgICB0aGlzLndoZWVsc1syXS5mcmFtZS5hYnNYID0gKCkgPT4gKHRocy53aGVlbHNbMV0uZnJhbWUucmlnaHRYKCkgKyBtYWNoaW5lLnBhZGRpbmcpXHJcbiAgICAgICAgdGhpcy53aGVlbHNbMl0uZnJhbWUuYWJzWSA9ICgpID0+ICh0aHMud2hlZWxzWzFdLmZyYW1lLnRvcFkoKSlcclxuICAgICAgICB0aGlzLmZyYW1lLndpZHRoID0gKCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbWFjaGluZS5jb2xXaWR0aCAqIDMgKyBtYWNoaW5lLnBhZGRpbmcgKiA0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5mcmFtZS5oZWlnaHQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBtYWNoaW5lLmNvbEhlaWdodCArIG1hY2hpbmUucGFkZGluZyAqIDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy53aGVlbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLndoZWVsc1tpXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgd2hlZWxzOiBbU2xvdE1hY2hpbmVXaGVlbCwgU2xvdE1hY2hpbmVXaGVlbCwgU2xvdE1hY2hpbmVXaGVlbF1cclxuICAgIG9uRHJhd0JhY2tncm91bmQoKSB7XHJcbiAgICAgICAgdGhpcy5icmlzdC5maWxsQ29sb3IoZkNvbG9yLmdyZWVuLmRhcmtlbjIpO1xyXG4gICAgICAgIHRoaXMuYnJpc3QuZmlsbFJlY3RGcmFtZSh0aGlzLmZyYW1lKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgUmV3YXJkSG9sZSBleHRlbmRzIFVJRWxlbWVudDxVSUZyYW1lX1JlY3RfQ29ybmVyU2l6ZWQ+IHtcclxuICAgIGdyYWRpZW50OiBDYW52YXNHcmFkaWVudDtcclxuICAgIG1hY2hpbmU6IFNsb3RNYWNoaW5lO1xyXG4gICAgY2hpbGQ6IEltYWdlRWxlbWVudDtcclxuICAgIGNvbnN0cnVjdG9yKHVpZDogc3RyaW5nLCBmcmFtZTogVUlGcmFtZV9SZWN0X0Nvcm5lclNpemVkLCBtYWNoaW5lOiBTbG90TWFjaGluZSkge1xyXG4gICAgICAgIHN1cGVyKHVpZCwgZnJhbWUsIG1hY2hpbmUuYnJpc3QpO1xyXG4gICAgICAgIHRoaXMubWFjaGluZSA9IG1hY2hpbmU7XHJcbiAgICAgICAgbGV0IHRocyA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuY2hpbGQgPSBuZXcgSW1hZ2VFbGVtZW50KCcnLCBbJy4vaW1nc291cmNlL2F1c3N5MDEuanBnJ10sIG5ldyBVSUZyYW1lX1JlY3RfQ29ybmVyU2l6ZWQoKCkgPT4gKHRocy5mcmFtZS5tZWFzdXJlV2lkdGgoKSAvIDIgLSB0aHMuY2hpbGQuZnJhbWUubWVhc3VyZVdpZHRoKCkgLyAyKSwgKCkgPT4gKFxyXG4gICAgICAgICAgICBsZXJwKDAgLSB0aHMuY2hpbGQuZnJhbWUubWVhc3VyZUhlaWdodCgpLCB0aHMuZnJhbWUubWVhc3VyZUhlaWdodCgpLCB0aHMuc2hvd25DaGlsZEFscGhhKSksICgpID0+ICh0aHMuZnJhbWUubWVhc3VyZVdpZHRoKCkgKiAwLjUpLCAoKSA9PiAodGhzLmNoaWxkLmZyYW1lLm1lYXN1cmVXaWR0aCgpIC8gKHRocy5jaGlsZC5pbWFnZXNbMF0ud2lkdGggLyB0aHMuY2hpbGQuaW1hZ2VzWzBdLmhlaWdodCkpKSwgbWFjaGluZS5icmlzdCk7XHJcbiAgICAgICAgdGhpcy5jaGlsZC5mcmFtZS5hYnNZID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgb3V0ID0gdGhzLmZyYW1lLnRvcFkoKSAtIHRocy5jaGlsZC5mcmFtZS5tZWFzdXJlSGVpZ2h0KCkgKiAyICsgbGVycCgwLCB0aHMuY2hpbGQuZnJhbWUubWVhc3VyZUhlaWdodCgpICogMS41ICsgdGhzLmZyYW1lLm1lYXN1cmVIZWlnaHQoKSwgdGhzLnNob3duQ2hpbGRBbHBoYSk7XHJcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy5jaGlsZCk7XHJcbiAgICB9XHJcbiAgICBzaG93blRpbWU6IG51bWJlciA9IC0xO1xyXG4gICAgZ2V0IHNob3duQ2hpbGRBbHBoYSgpOiBudW1iZXIge1xyXG4gICAgICAgIGlmICh0aGlzLnNob3duVGltZSA9PSAtMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5sb2coTWF0aC5taW4oRGF0ZS5ub3coKSAtIHRoaXMuc2hvd25UaW1lLCAzMDAwKSAvIDMwMDApXHJcbiAgICAgICAgcmV0dXJuIE1hdGgubWluKERhdGUubm93KCkgLSB0aGlzLnNob3duVGltZSwgMzAwMCkgLyAzMDAwXHJcbiAgICB9XHJcbiAgICAvLyBnZXQgc2hvd25DaGlsZEFscGhhKCk6IG51bWJlciB7XHJcbiAgICAvLyAgICAgY29uc29sZS5sb2coKE1hdGguY29zKERhdGUubm93KCkgLyAxMDAwKSArIDEpIC8gMilcclxuICAgIC8vICAgICAgICAgcmV0dXJuIChNYXRoLmNvcyhEYXRlLm5vdygpIC8gMTAwMCkgKyAxKSAvIDJcclxuICAgIC8vICAgICB9XHJcbiAgICBzaG93KGltZzogSFRNTEltYWdlRWxlbWVudCA9IG51bGwpIHtcclxuICAgICAgICB0aGlzLnNob3duVGltZSA9IERhdGUubm93KCk7XHJcblxyXG4gICAgICAgIGlmIChpbWcgIT0gbnVsbClcclxuICAgICAgICAgICAgdGhpcy5jaGlsZC5pbWFnZXNbMF0gPSBpbWc7XHJcblxyXG4gICAgfVxyXG4gICAgaGlkZSgpIHtcclxuXHJcbiAgICB9XHJcbiAgICBvbkRyYXdCYWNrZ3JvdW5kKCkge1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy5zZWxlY3RDdHhQYXRoKCk7XHJcbiAgICAgICAgdGhpcy5icmlzdC5maWxsQ29sb3IoZkNvbG9yLmJsYWNrKTtcclxuICAgICAgICB0aGlzLmJyaXN0LmN0eC5maWxsKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2VsZWN0Q3R4UGF0aCh0cnVlLCBmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5icmlzdC5jdHgubGluZVRvKHRoaXMuYnJpc3Qud2lkdGgsIHRoaXMuZnJhbWUuYm90dG9tWSgpKTtcclxuICAgICAgICB0aGlzLmJyaXN0LmN0eC5saW5lVG8odGhpcy5icmlzdC53aWR0aCwgdGhpcy5icmlzdC5oZWlnaHQpO1xyXG4gICAgICAgIHRoaXMuYnJpc3QuY3R4LmxpbmVUbygwLCB0aGlzLmJyaXN0LmhlaWdodCk7XHJcbiAgICAgICAgdGhpcy5icmlzdC5jdHgubGluZVRvKDAsIHRoaXMuZnJhbWUuYm90dG9tWSgpKTtcclxuICAgICAgICB0aGlzLmJyaXN0LmN0eC5saW5lVG8odGhpcy5mcmFtZS5sZWZ0WCgpLCB0aGlzLmZyYW1lLmJvdHRvbVkoKSk7XHJcbiAgICAgICAgdGhpcy5icmlzdC5jdHguc2F2ZSgpO1xyXG4gICAgICAgIC8vdGhpcy5icmlzdC5maWxsQ29sb3IoZkNvbG9yLnJlZC5iYXNlKTtcclxuICAgICAgICAvL3RoaXMuYnJpc3QuY3R4LmZpbGwoKTtcclxuICAgICAgICB0aGlzLmJyaXN0LmN0eC5jbGlwKCk7XHJcbiAgICB9XHJcbiAgICBvbkRyYXdGb3JlZ3JvdW5kKCkge1xyXG4gICAgICAgIHRoaXMuZ3JhZGllbnQgPSB0aGlzLmJyaXN0LmN0eC5jcmVhdGVMaW5lYXJHcmFkaWVudCh0aGlzLmZyYW1lLmNlbnRlclgoKSwgdGhpcy5mcmFtZS50b3BZKCksIHRoaXMuZnJhbWUuY2VudGVyWCgpLCB0aGlzLmZyYW1lLmJvdHRvbVkoKSk7XHJcbiAgICAgICAgdGhpcy5ncmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJyMwMDAwMDBGRicpO1xyXG4gICAgICAgIHRoaXMuZ3JhZGllbnQuYWRkQ29sb3JTdG9wKDEsICcjMDAwMDAwMDAnKTtcclxuXHJcblxyXG5cclxuICAgICAgICB0aGlzLnNlbGVjdEN0eFBhdGgoKVxyXG4gICAgICAgIHRoaXMuYnJpc3QuY3R4LmZpbGxTdHlsZSA9IHRoaXMuZ3JhZGllbnQ7XHJcbiAgICAgICAgdGhpcy5icmlzdC5jdHguZmlsbCgpO1xyXG4gICAgICAgIHRoaXMuYnJpc3QuY3R4LnJlc3RvcmUoKTtcclxuICAgICAgICB0aGlzLnNlbGVjdEN0eFBhdGgodHJ1ZSwgZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuYnJpc3Quc3Ryb2tlQ29sb3IoZkNvbG9yLmdyZWVuLmRhcmtlbjIpO1xyXG4gICAgICAgIHRoaXMuYnJpc3Quc3Ryb2tlV2VpZ2h0KHRoaXMubWFjaGluZS5wYWRkaW5nKTtcclxuICAgICAgICB0aGlzLmJyaXN0LmN0eC5zdHJva2UoKTtcclxuICAgIH1cclxuICAgIHNlbGVjdEN0eFBhdGgoYmVnaW5QYXRoOiBib29sZWFuID0gdHJ1ZSwgY2xvc2VQYXRoOiBib29sZWFuID0gdHJ1ZSkge1xyXG4gICAgICAgIGlmIChiZWdpblBhdGgpIHtcclxuICAgICAgICAgICAgdGhpcy5icmlzdC5jdHguYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYnJpc3QuY3R4Lm1vdmVUbyh0aGlzLmZyYW1lLmxlZnRYKCksIHRoaXMuZnJhbWUuYm90dG9tWSgpKTtcclxuICAgICAgICBsZXQgYmFzZUNvbnRyb2xZID0gdGhpcy5mcmFtZS5ib3R0b21ZKCkgLSB0aGlzLmZyYW1lLm1lYXN1cmVIZWlnaHQoKSAvIDRcclxuICAgICAgICB0aGlzLmJyaXN0LmN0eC5iZXppZXJDdXJ2ZVRvKHRoaXMuZnJhbWUubGVmdFgoKSwgYmFzZUNvbnRyb2xZLCB0aGlzLmZyYW1lLmxlZnRYKCkgKyB0aGlzLmZyYW1lLm1lYXN1cmVXaWR0aCgpIC8gOCwgdGhpcy5mcmFtZS50b3BZKCksIHRoaXMuZnJhbWUuY2VudGVyWCgpLCB0aGlzLmZyYW1lLnRvcFkoKSk7XHJcbiAgICAgICAgdGhpcy5icmlzdC5jdHguYmV6aWVyQ3VydmVUbyh0aGlzLmZyYW1lLnJpZ2h0WCgpIC0gdGhpcy5mcmFtZS5tZWFzdXJlV2lkdGgoKSAvIDgsIHRoaXMuZnJhbWUudG9wWSgpLCB0aGlzLmZyYW1lLnJpZ2h0WCgpLCBiYXNlQ29udHJvbFksIHRoaXMuZnJhbWUucmlnaHRYKCksIHRoaXMuZnJhbWUuYm90dG9tWSgpKTtcclxuICAgICAgICBpZiAoY2xvc2VQYXRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnJpc3QuY3R4LmxpbmVUbyh0aGlzLmZyYW1lLmxlZnRYKCksIHRoaXMuZnJhbWUuYm90dG9tWSgpKTtcclxuICAgICAgICAgICAgdGhpcy5icmlzdC5jdHguY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBTbG90TWFjaGluZSBleHRlbmRzIFVJRWxlbWVudDxVSUZyYW1lX1JlY3RfQ29ybmVyU2l6ZWQ+e1xyXG4gICAgcGFkZGluZzogbnVtYmVyID0gODtcclxuICAgIC8vY29sU2l6ZTogW251bWJlciwgbnVtYmVyXSA9IFsyMCwgMTUwXVxyXG4gICAgZ2V0IGNvbFdpZHRoKCkge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5mcmFtZS5tZWFzdXJlV2lkdGgoKSAtIHRoaXMucGFkZGluZyAqIDYpIC8gNFxyXG4gICAgfVxyXG4gICAgZ2V0IGNvbEhlaWdodCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb2xXaWR0aCAqIDI7XHJcbiAgICB9XHJcbiAgICB3aGVlbHM6IFNsb3RNYWNoaW5lV2hlZWxzO1xyXG4gICAgbGV2ZXI6IFNsb3RMZXZlckFzc2VtYmx5XHJcbiAgICBob2xlOiBSZXdhcmRIb2xlXHJcbiAgICBjb25zdHJ1Y3Rvcih1aWQ6IHN0cmluZywgZnJhbWU6IFVJRnJhbWVfUmVjdF9Db3JuZXJTaXplZCwgYnJpc3Q6IENhcmRCcmlzdG9sKSB7XHJcbiAgICAgICAgc3VwZXIodWlkLCBmcmFtZSwgYnJpc3QpO1xyXG4gICAgICAgIGxldCB0aHMgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLndoZWVscyA9IG5ldyBTbG90TWFjaGluZVdoZWVscygnd2hlZWxzJywgbmV3IFVJRnJhbWVfUmVjdF9Db3JuZXJTaXplZCh0aHMucGFkZGluZywgMCksIHRoaXMpO1xyXG4gICAgICAgIHRoaXMuYWRkQ2hpbGQodGhpcy53aGVlbHMpO1xyXG4gICAgICAgIHRoaXMubGV2ZXIgPSBuZXcgU2xvdExldmVyQXNzZW1ibHkoJ2xldmVyJywgdGhpcyk7XHJcbiAgICAgICAgLy90aGlzLmZyYW1lLndpZHRoID0gKCkgPT4gKHRocy53aGVlbHMuZnJhbWUubWVhc3VyZVdpZHRoKCkgKyB0aHMubGV2ZXIuZnJhbWUubWVhc3VyZVdpZHRoKCkgKyB0aHMucGFkZGluZyk7XHJcbiAgICAgICAgdGhpcy5mcmFtZS5oZWlnaHQgPSAoKSA9PiAodGhzLmxldmVyLmZyYW1lLm1lYXN1cmVIZWlnaHQoKSArIHRocy5ob2xlLmZyYW1lLm1lYXN1cmVIZWlnaHQoKSArIHRocy5wYWRkaW5nICogNCk7XHJcbiAgICAgICAgdGhpcy5sZXZlci5mcmFtZS5hYnNYID0gKCkgPT4gKHRocy53aGVlbHMuZnJhbWUucmlnaHRYKCkpXHJcbiAgICAgICAgdGhpcy5sZXZlci5mcmFtZS5yZWxZID0gKCkgPT4gKHRocy5wYWRkaW5nKVxyXG4gICAgICAgIHRoaXMud2hlZWxzLmZyYW1lLmFic1kgPSAoKSA9PiAodGhzLmxldmVyLmZyYW1lLmNlbnRlclkoKSAtIHRocy53aGVlbHMuZnJhbWUubWVhc3VyZUhlaWdodCgpIC8gMik7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLmxldmVyKVxyXG5cclxuICAgICAgICB0aGlzLmhvbGUgPSBuZXcgUmV3YXJkSG9sZSgnaG9sZScsIG5ldyBVSUZyYW1lX1JlY3RfQ29ybmVyU2l6ZWQoMCwgMCwgdGhzLmNvbFdpZHRoICogNCwgdGhzLmNvbFdpZHRoICogMyksIHRoaXMpO1xyXG4gICAgICAgIHRoaXMuaG9sZS5mcmFtZS5yZWxYID0gKCkgPT4gKHRocy5mcmFtZS5tZWFzdXJlV2lkdGgoKSAvIDIgLSB0aHMuaG9sZS5mcmFtZS5tZWFzdXJlV2lkdGgoKSAvIDIpO1xyXG4gICAgICAgIHRoaXMuaG9sZS5mcmFtZS5hYnNZID0gKCkgPT4gKHRocy5sZXZlci5mcmFtZS5ib3R0b21ZKCkgKyB0aHMucGFkZGluZyk7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLmhvbGUpO1xyXG4gICAgfVxyXG4gICAgb25EcmF3QmFja2dyb3VuZCgpIHtcclxuICAgICAgICB0aGlzLmJyaXN0LmZpbGxDb2xvcihmQ29sb3IuZ3JlZW4uYmFzZSk7XHJcbiAgICAgICAgdGhpcy5icmlzdC5maWxsUmVjdEZyYW1lKHRoaXMuZnJhbWUpO1xyXG5cclxuICAgIH1cclxufVxyXG4iLCJcclxuaW1wb3J0IHsgb3B0RnVuYyB9IGZyb20gJy4uL2ltcG9ydHMnO1xyXG5leHBvcnQgY2xhc3MgRkNvbG9yU3dhdGgge1xyXG4gICAgY29uc3RydWN0b3IoZGF0YTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5saWdodGVuNCA9IEZDb2xvci5mcm9tSGV4KGRhdGFbJzEwMCddKTtcclxuICAgICAgICB0aGlzLmxpZ2h0ZW4zID0gRkNvbG9yLmZyb21IZXgoZGF0YVsnMjAwJ10pO1xyXG4gICAgICAgIHRoaXMubGlnaHRlbjIgPSBGQ29sb3IuZnJvbUhleChkYXRhWyczMDAnXSk7XHJcbiAgICAgICAgdGhpcy5saWdodGVuMSA9IEZDb2xvci5mcm9tSGV4KGRhdGFbJzQwMCddKTtcclxuICAgICAgICB0aGlzLmJhc2UgPSAgICAgRkNvbG9yLmZyb21IZXgoZGF0YVsnNTAwJ10pO1xyXG4gICAgICAgIHRoaXMuZGFya2VuMSA9ICBGQ29sb3IuZnJvbUhleChkYXRhWyc2MDAnXSk7XHJcbiAgICAgICAgdGhpcy5kYXJrZW4yID0gIEZDb2xvci5mcm9tSGV4KGRhdGFbJzcwMCddKTtcclxuICAgICAgICB0aGlzLmRhcmtlbjMgPSAgRkNvbG9yLmZyb21IZXgoZGF0YVsnODAwJ10pO1xyXG4gICAgICAgIHRoaXMuZGFya2VuNCA9ICBGQ29sb3IuZnJvbUhleChkYXRhWyc5MDAnXSk7XHJcbiAgICAgICAgdGhpcy5hY2NlbnQxID0gIEZDb2xvci5mcm9tSGV4KGRhdGFbJ2ExMDAnXSA/PyAnIzAwMCcpO1xyXG4gICAgICAgIHRoaXMuYWNjZW50MiA9ICBGQ29sb3IuZnJvbUhleChkYXRhWydhMjAwJ10gPz8gJyMwMDAnKTtcclxuICAgICAgICB0aGlzLmFjY2VudDMgPSAgRkNvbG9yLmZyb21IZXgoZGF0YVsnYTQwMCddID8/ICcjMDAwJyk7XHJcbiAgICAgICAgdGhpcy5hY2NlbnQ0ID0gIEZDb2xvci5mcm9tSGV4KGRhdGFbJ2E3MDAnXSA/PyAnIzAwMCcpO1xyXG4gICAgfVxyXG4gICAgbGlnaHRlbjU6IEZDb2xvcjtcclxuICAgIGxpZ2h0ZW40OiBGQ29sb3I7XHJcbiAgICBsaWdodGVuMzogRkNvbG9yO1xyXG4gICAgbGlnaHRlbjI6IEZDb2xvcjtcclxuICAgIGxpZ2h0ZW4xOiBGQ29sb3I7XHJcbiAgICBiYXNlOiBGQ29sb3I7XHJcbiAgICBkYXJrZW4xOiBGQ29sb3I7XHJcbiAgICBkYXJrZW4yOiBGQ29sb3I7XHJcbiAgICBkYXJrZW4zOiBGQ29sb3I7XHJcbiAgICBkYXJrZW40OiBGQ29sb3I7XHJcbiAgICBhY2NlbnQxOiBGQ29sb3I7XHJcbiAgICBhY2NlbnQyOiBGQ29sb3I7XHJcbiAgICBhY2NlbnQzOiBGQ29sb3I7XHJcbiAgICBhY2NlbnQ0OiBGQ29sb3I7XHJcbn1cclxuZXhwb3J0IGNsYXNzIEZDb2xvciB7XHJcbiAgICBwcml2YXRlIGFhOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIGJiOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIGdnOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIHJyOiBudW1iZXI7XHJcbiAgICB0b3RhbDogbnVtYmVyID0gMjU1O1xyXG4gICAgY29uc3RydWN0b3IocjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlciwgYTogbnVtYmVyLCB0b3RhbDogbnVtYmVyID0gMjU1KSB7XHJcbiAgICAgICAgdGhpcy5yciA9IHI7XHJcbiAgICAgICAgdGhpcy5nZyA9IGc7XHJcbiAgICAgICAgdGhpcy5iYiA9IGI7XHJcbiAgICAgICAgdGhpcy5hYSA9IGE7XHJcbiAgICAgICAgdGhpcy50b3RhbCA9IHRvdGFsO1xyXG5cclxuICAgIH1cclxuICAgIHN0YXRpYyBmcm9tSGV4KGNvbG9ySGV4OiBzdHJpbmcpIHtcclxuICAgICAgICBjb2xvckhleCA9IGNvbG9ySGV4LnJlcGxhY2VBbGwoJyMnLCAnJykucmVwbGFjZUFsbCgnICcsICcnKTtcclxuXHJcbiAgICAgICAgbGV0IHIgPSBwYXJzZUludChjb2xvckhleC5zdWJzdHIoMCwgMiksIDE2KTtcclxuICAgICAgICBsZXQgZyA9IHBhcnNlSW50KGNvbG9ySGV4LnN1YnN0cigyLCAyKSwgMTYpO1xyXG4gICAgICAgIGxldCBiID0gcGFyc2VJbnQoY29sb3JIZXguc3Vic3RyKDQsIDIpLCAxNik7XHJcblxyXG4gICAgICAgIGxldCBhID0gY29sb3JIZXgubGVuZ3RoID4gNiA/IHBhcnNlSW50KGNvbG9ySGV4LnN1YnN0cig2LCAyKSwgMTYpIDogLTE7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBGQ29sb3IociwgZywgYiwgYSk7XHJcbiAgICB9XHJcbiAgICBsYXN0SGV4OiBzdHJpbmcgPSBudWxsO1xyXG4gICAgc2V0SGV4KGNvbG9ySGV4OiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmxhc3RIZXggPSBjb2xvckhleDtcclxuICAgICAgICBjb2xvckhleCA9IGNvbG9ySGV4LnJlcGxhY2VBbGwoJyMnLCAnJykucmVwbGFjZUFsbCgnICcsICcnKTtcclxuXHJcbiAgICAgICAgbGV0IHIgPSBwYXJzZUludChjb2xvckhleC5zdWJzdHIoMCwgMiksIDE2KTtcclxuICAgICAgICBsZXQgZyA9IHBhcnNlSW50KGNvbG9ySGV4LnN1YnN0cigyLCAyKSwgMTYpO1xyXG4gICAgICAgIGxldCBiID0gcGFyc2VJbnQoY29sb3JIZXguc3Vic3RyKDQsIDIpLCAxNik7XHJcblxyXG4gICAgICAgIGxldCBhID0gY29sb3JIZXgubGVuZ3RoID4gNiA/IHBhcnNlSW50KGNvbG9ySGV4LnN1YnN0cig2LCAyKSwgMTYpIDogLTE7XHJcbiAgICAgICAgdGhpcy5yciA9IHI7XHJcbiAgICAgICAgdGhpcy5nZyA9IGc7XHJcbiAgICAgICAgdGhpcy5iYiA9IGI7XHJcbiAgICAgICAgdGhpcy5hYSA9IGE7XHJcbiAgICAgICAgdGhpcy50b3RhbCA9IDI1NTtcclxuICAgIH1cclxuICAgIGdldCByKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLnJyIC8gdGhpcy50b3RhbCkgKiAyNTVcclxuICAgIH1cclxuICAgIGdldCBnKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLmdnIC8gdGhpcy50b3RhbCkgKiAyNTVcclxuICAgIH1cclxuICAgIGdldCBiKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLmJiIC8gdGhpcy50b3RhbCkgKiAyNTVcclxuICAgIH1cclxuICAgIGdldCBhKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuICh0aGlzLmFhIC8gdGhpcy50b3RhbCkgKiAyNTVcclxuICAgIH1cclxuICAgIGdldCBoYXNDaGFuZ2VkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5vbGRWYWxzWzBdICE9IHRoaXMucikgfHwgKHRoaXMub2xkVmFsc1sxXSAhPSB0aGlzLmcpIHx8ICh0aGlzLm9sZFZhbHNbMl0gIT0gdGhpcy5iKSB8fCAodGhpcy5vbGRWYWxzWzNdICE9IHRoaXMuYSk7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGdlblN0cigpIHtcclxuICAgICAgICB0aGlzLm9sZFN0ciA9IGByZ2Ike3RoaXMuYSAhPSAtMSA/ICdhJyA6ICcnfSgke3RoaXMucn0sICR7dGhpcy5nfSwgJHt0aGlzLmJ9JHt0aGlzLmEgIT0gLTEgPyAoJywgJyArIHRoaXMuYSkgOiAnJ30pYDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgb2xkU3RyOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIG9sZFZhbHM6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyLCBudW1iZXJdID0gWy0xLCAtMSwgLTEsIC0xXTtcclxuICAgIHRvSGV4U3RyaW5nKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmhhc0NoYW5nZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5nZW5TdHIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub2xkU3RyO1xyXG4gICAgfVxyXG4gICAgY29weSgpe1xyXG4gICAgICAgIHJldHVybiBuZXcgRkNvbG9yKHRoaXMucnIsIHRoaXMuZ2csIHRoaXMuYmIsIHRoaXMuYWEsIHRoaXMudG90YWwpO1xyXG4gICAgfVxyXG4gICAgLy9vcGFjaXR5IDAtMjU1XHJcbiAgICBzZXRBbHBoYShhOiBudW1iZXIpe1xyXG4gICAgICAgIHRoaXMuYWEgPSBhXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICAvL29wYWNpdHkgMC0xXHJcbiAgICBzZXRPcGFjaXR5KGRlY2ltYWxQZXJjZW50OiBudW1iZXIpe1xyXG4gICAgICAgIHRoaXMuc2V0QWxwaGEodGhpcy50b3RhbCAqIGRlY2ltYWxQZXJjZW50KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgRkNvbG9yRGlyZWN0b3J5IHtcclxuICAgIHN0YXRpYyBtYXRlcmlhbENvbG9ycyA9IHtcclxuICAgICAgICBcInJlZFwiOiB7XHJcbiAgICAgICAgICAgIFwiNTBcIjogXCIjZmZlYmVlXCIsXHJcbiAgICAgICAgICAgIFwiMTAwXCI6IFwiI2ZmY2RkMlwiLFxyXG4gICAgICAgICAgICBcIjIwMFwiOiBcIiNlZjlhOWFcIixcclxuICAgICAgICAgICAgXCIzMDBcIjogXCIjZTU3MzczXCIsXHJcbiAgICAgICAgICAgIFwiNDAwXCI6IFwiI2VmNTM1MFwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOiBcIiNmNDQzMzZcIixcclxuICAgICAgICAgICAgXCI2MDBcIjogXCIjZTUzOTM1XCIsXHJcbiAgICAgICAgICAgIFwiNzAwXCI6IFwiI2QzMmYyZlwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOiBcIiNjNjI4MjhcIixcclxuICAgICAgICAgICAgXCI5MDBcIjogXCIjYjcxYzFjXCIsXHJcbiAgICAgICAgICAgIFwiYTEwMFwiOiBcIiNmZjhhODBcIixcclxuICAgICAgICAgICAgXCJhMjAwXCI6IFwiI2ZmNTI1MlwiLFxyXG4gICAgICAgICAgICBcImE0MDBcIjogXCIjZmYxNzQ0XCIsXHJcbiAgICAgICAgICAgIFwiYTcwMFwiOiBcIiNkNTAwMDBcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJwaW5rXCI6IHtcclxuICAgICAgICAgICAgXCI1MFwiOiBcIiNmY2U0ZWNcIixcclxuICAgICAgICAgICAgXCIxMDBcIjogXCIjZjhiYmQwXCIsXHJcbiAgICAgICAgICAgIFwiMjAwXCI6IFwiI2Y0OGZiMVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOiBcIiNmMDYyOTJcIixcclxuICAgICAgICAgICAgXCI0MDBcIjogXCIjZWM0MDdhXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6IFwiI2U5MWU2M1wiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOiBcIiNkODFiNjBcIixcclxuICAgICAgICAgICAgXCI3MDBcIjogXCIjYzIxODViXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6IFwiI2FkMTQ1N1wiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOiBcIiM4ODBlNGZcIixcclxuICAgICAgICAgICAgXCJhMTAwXCI6IFwiI2ZmODBhYlwiLFxyXG4gICAgICAgICAgICBcImEyMDBcIjogXCIjZmY0MDgxXCIsXHJcbiAgICAgICAgICAgIFwiYTQwMFwiOiBcIiNmNTAwNTdcIixcclxuICAgICAgICAgICAgXCJhNzAwXCI6IFwiI2M1MTE2MlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInB1cnBsZVwiOiB7XHJcbiAgICAgICAgICAgIFwiNTBcIjogXCIjZjNlNWY1XCIsXHJcbiAgICAgICAgICAgIFwiMTAwXCI6IFwiI2UxYmVlN1wiLFxyXG4gICAgICAgICAgICBcIjIwMFwiOiBcIiNjZTkzZDhcIixcclxuICAgICAgICAgICAgXCIzMDBcIjogXCIjYmE2OGM4XCIsXHJcbiAgICAgICAgICAgIFwiNDAwXCI6IFwiI2FiNDdiY1wiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOiBcIiM5YzI3YjBcIixcclxuICAgICAgICAgICAgXCI2MDBcIjogXCIjOGUyNGFhXCIsXHJcbiAgICAgICAgICAgIFwiNzAwXCI6IFwiIzdiMWZhMlwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOiBcIiM2YTFiOWFcIixcclxuICAgICAgICAgICAgXCI5MDBcIjogXCIjNGExNDhjXCIsXHJcbiAgICAgICAgICAgIFwiYTEwMFwiOiBcIiNlYTgwZmNcIixcclxuICAgICAgICAgICAgXCJhMjAwXCI6IFwiI2UwNDBmYlwiLFxyXG4gICAgICAgICAgICBcImE0MDBcIjogXCIjZDUwMGY5XCIsXHJcbiAgICAgICAgICAgIFwiYTcwMFwiOiBcIiNhYTAwZmZcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJkZWVwUHVycGxlXCI6IHtcclxuICAgICAgICAgICAgXCI1MFwiOiBcIiNlZGU3ZjZcIixcclxuICAgICAgICAgICAgXCIxMDBcIjogXCIjZDFjNGU5XCIsXHJcbiAgICAgICAgICAgIFwiMjAwXCI6IFwiI2IzOWRkYlwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOiBcIiM5NTc1Y2RcIixcclxuICAgICAgICAgICAgXCI0MDBcIjogXCIjN2U1N2MyXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6IFwiIzY3M2FiN1wiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOiBcIiM1ZTM1YjFcIixcclxuICAgICAgICAgICAgXCI3MDBcIjogXCIjNTEyZGE4XCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6IFwiIzQ1MjdhMFwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOiBcIiMzMTFiOTJcIixcclxuICAgICAgICAgICAgXCJhMTAwXCI6IFwiI2IzODhmZlwiLFxyXG4gICAgICAgICAgICBcImEyMDBcIjogXCIjN2M0ZGZmXCIsXHJcbiAgICAgICAgICAgIFwiYTQwMFwiOiBcIiM2NTFmZmZcIixcclxuICAgICAgICAgICAgXCJhNzAwXCI6IFwiIzYyMDBlYVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcImluZGlnb1wiOiB7XHJcbiAgICAgICAgICAgIFwiNTBcIjogXCIjZThlYWY2XCIsXHJcbiAgICAgICAgICAgIFwiMTAwXCI6IFwiI2M1Y2FlOVwiLFxyXG4gICAgICAgICAgICBcIjIwMFwiOiBcIiM5ZmE4ZGFcIixcclxuICAgICAgICAgICAgXCIzMDBcIjogXCIjNzk4NmNiXCIsXHJcbiAgICAgICAgICAgIFwiNDAwXCI6IFwiIzVjNmJjMFwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOiBcIiMzZjUxYjVcIixcclxuICAgICAgICAgICAgXCI2MDBcIjogXCIjMzk0OWFiXCIsXHJcbiAgICAgICAgICAgIFwiNzAwXCI6IFwiIzMwM2Y5ZlwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOiBcIiMyODM1OTNcIixcclxuICAgICAgICAgICAgXCI5MDBcIjogXCIjMWEyMzdlXCIsXHJcbiAgICAgICAgICAgIFwiYTEwMFwiOiBcIiM4YzllZmZcIixcclxuICAgICAgICAgICAgXCJhMjAwXCI6IFwiIzUzNmRmZVwiLFxyXG4gICAgICAgICAgICBcImE0MDBcIjogXCIjM2Q1YWZlXCIsXHJcbiAgICAgICAgICAgIFwiYTcwMFwiOiBcIiMzMDRmZmVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJibHVlXCI6IHtcclxuICAgICAgICAgICAgXCI1MFwiOiBcIiNlM2YyZmRcIixcclxuICAgICAgICAgICAgXCIxMDBcIjogXCIjYmJkZWZiXCIsXHJcbiAgICAgICAgICAgIFwiMjAwXCI6IFwiIzkwY2FmOVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOiBcIiM2NGI1ZjZcIixcclxuICAgICAgICAgICAgXCI0MDBcIjogXCIjNDJhNWY1XCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6IFwiIzIxOTZmM1wiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOiBcIiMxZTg4ZTVcIixcclxuICAgICAgICAgICAgXCI3MDBcIjogXCIjMTk3NmQyXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6IFwiIzE1NjVjMFwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOiBcIiMwZDQ3YTFcIixcclxuICAgICAgICAgICAgXCJhMTAwXCI6IFwiIzgyYjFmZlwiLFxyXG4gICAgICAgICAgICBcImEyMDBcIjogXCIjNDQ4YWZmXCIsXHJcbiAgICAgICAgICAgIFwiYTQwMFwiOiBcIiMyOTc5ZmZcIixcclxuICAgICAgICAgICAgXCJhNzAwXCI6IFwiIzI5NjJmZlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcImxpZ2h0Qmx1ZVwiOiB7XHJcbiAgICAgICAgICAgIFwiNTBcIjogXCIjZTFmNWZlXCIsXHJcbiAgICAgICAgICAgIFwiMTAwXCI6IFwiI2IzZTVmY1wiLFxyXG4gICAgICAgICAgICBcIjIwMFwiOiBcIiM4MWQ0ZmFcIixcclxuICAgICAgICAgICAgXCIzMDBcIjogXCIjNGZjM2Y3XCIsXHJcbiAgICAgICAgICAgIFwiNDAwXCI6IFwiIzI5YjZmNlwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOiBcIiMwM2E5ZjRcIixcclxuICAgICAgICAgICAgXCI2MDBcIjogXCIjMDM5YmU1XCIsXHJcbiAgICAgICAgICAgIFwiNzAwXCI6IFwiIzAyODhkMVwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOiBcIiMwMjc3YmRcIixcclxuICAgICAgICAgICAgXCI5MDBcIjogXCIjMDE1NzliXCIsXHJcbiAgICAgICAgICAgIFwiYTEwMFwiOiBcIiM4MGQ4ZmZcIixcclxuICAgICAgICAgICAgXCJhMjAwXCI6IFwiIzQwYzRmZlwiLFxyXG4gICAgICAgICAgICBcImE0MDBcIjogXCIjMDBiMGZmXCIsXHJcbiAgICAgICAgICAgIFwiYTcwMFwiOiBcIiMwMDkxZWFcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJjeWFuXCI6IHtcclxuICAgICAgICAgICAgXCI1MFwiOiBcIiNlMGY3ZmFcIixcclxuICAgICAgICAgICAgXCIxMDBcIjogXCIjYjJlYmYyXCIsXHJcbiAgICAgICAgICAgIFwiMjAwXCI6IFwiIzgwZGVlYVwiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOiBcIiM0ZGQwZTFcIixcclxuICAgICAgICAgICAgXCI0MDBcIjogXCIjMjZjNmRhXCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6IFwiIzAwYmNkNFwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOiBcIiMwMGFjYzFcIixcclxuICAgICAgICAgICAgXCI3MDBcIjogXCIjMDA5N2E3XCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6IFwiIzAwODM4ZlwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOiBcIiMwMDYwNjRcIixcclxuICAgICAgICAgICAgXCJhMTAwXCI6IFwiIzg0ZmZmZlwiLFxyXG4gICAgICAgICAgICBcImEyMDBcIjogXCIjMThmZmZmXCIsXHJcbiAgICAgICAgICAgIFwiYTQwMFwiOiBcIiMwMGU1ZmZcIixcclxuICAgICAgICAgICAgXCJhNzAwXCI6IFwiIzAwYjhkNFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInRlYWxcIjoge1xyXG4gICAgICAgICAgICBcIjUwXCI6IFwiI2UwZjJmMVwiLFxyXG4gICAgICAgICAgICBcIjEwMFwiOiBcIiNiMmRmZGJcIixcclxuICAgICAgICAgICAgXCIyMDBcIjogXCIjODBjYmM0XCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6IFwiIzRkYjZhY1wiLFxyXG4gICAgICAgICAgICBcIjQwMFwiOiBcIiMyNmE2OWFcIixcclxuICAgICAgICAgICAgXCI1MDBcIjogXCIjMDA5Njg4XCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6IFwiIzAwODk3YlwiLFxyXG4gICAgICAgICAgICBcIjcwMFwiOiBcIiMwMDc5NmJcIixcclxuICAgICAgICAgICAgXCI4MDBcIjogXCIjMDA2OTVjXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6IFwiIzAwNGQ0MFwiLFxyXG4gICAgICAgICAgICBcImExMDBcIjogXCIjYTdmZmViXCIsXHJcbiAgICAgICAgICAgIFwiYTIwMFwiOiBcIiM2NGZmZGFcIixcclxuICAgICAgICAgICAgXCJhNDAwXCI6IFwiIzFkZTliNlwiLFxyXG4gICAgICAgICAgICBcImE3MDBcIjogXCIjMDBiZmE1XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiZ3JlZW5cIjoge1xyXG4gICAgICAgICAgICBcIjUwXCI6IFwiI2U4ZjVlOVwiLFxyXG4gICAgICAgICAgICBcIjEwMFwiOiBcIiNjOGU2YzlcIixcclxuICAgICAgICAgICAgXCIyMDBcIjogXCIjYTVkNmE3XCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6IFwiIzgxYzc4NFwiLFxyXG4gICAgICAgICAgICBcIjQwMFwiOiBcIiM2NmJiNmFcIixcclxuICAgICAgICAgICAgXCI1MDBcIjogXCIjNGNhZjUwXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6IFwiIzQzYTA0N1wiLFxyXG4gICAgICAgICAgICBcIjcwMFwiOiBcIiMzODhlM2NcIixcclxuICAgICAgICAgICAgXCI4MDBcIjogXCIjMmU3ZDMyXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6IFwiIzFiNWUyMFwiLFxyXG4gICAgICAgICAgICBcImExMDBcIjogXCIjYjlmNmNhXCIsXHJcbiAgICAgICAgICAgIFwiYTIwMFwiOiBcIiM2OWYwYWVcIixcclxuICAgICAgICAgICAgXCJhNDAwXCI6IFwiIzAwZTY3NlwiLFxyXG4gICAgICAgICAgICBcImE3MDBcIjogXCIjMDBjODUzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwibGlnaHRHcmVlblwiOiB7XHJcbiAgICAgICAgICAgIFwiNTBcIjogXCIjZjFmOGU5XCIsXHJcbiAgICAgICAgICAgIFwiMTAwXCI6IFwiI2RjZWRjOFwiLFxyXG4gICAgICAgICAgICBcIjIwMFwiOiBcIiNjNWUxYTVcIixcclxuICAgICAgICAgICAgXCIzMDBcIjogXCIjYWVkNTgxXCIsXHJcbiAgICAgICAgICAgIFwiNDAwXCI6IFwiIzljY2M2NVwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOiBcIiM4YmMzNGFcIixcclxuICAgICAgICAgICAgXCI2MDBcIjogXCIjN2NiMzQyXCIsXHJcbiAgICAgICAgICAgIFwiNzAwXCI6IFwiIzY4OWYzOFwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOiBcIiM1NThiMmZcIixcclxuICAgICAgICAgICAgXCI5MDBcIjogXCIjMzM2OTFlXCIsXHJcbiAgICAgICAgICAgIFwiYTEwMFwiOiBcIiNjY2ZmOTBcIixcclxuICAgICAgICAgICAgXCJhMjAwXCI6IFwiI2IyZmY1OVwiLFxyXG4gICAgICAgICAgICBcImE0MDBcIjogXCIjNzZmZjAzXCIsXHJcbiAgICAgICAgICAgIFwiYTcwMFwiOiBcIiM2NGRkMTdcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJsaW1lXCI6IHtcclxuICAgICAgICAgICAgXCI1MFwiOiBcIiNmOWZiZTdcIixcclxuICAgICAgICAgICAgXCIxMDBcIjogXCIjZjBmNGMzXCIsXHJcbiAgICAgICAgICAgIFwiMjAwXCI6IFwiI2U2ZWU5Y1wiLFxyXG4gICAgICAgICAgICBcIjMwMFwiOiBcIiNkY2U3NzVcIixcclxuICAgICAgICAgICAgXCI0MDBcIjogXCIjZDRlMTU3XCIsXHJcbiAgICAgICAgICAgIFwiNTAwXCI6IFwiI2NkZGMzOVwiLFxyXG4gICAgICAgICAgICBcIjYwMFwiOiBcIiNjMGNhMzNcIixcclxuICAgICAgICAgICAgXCI3MDBcIjogXCIjYWZiNDJiXCIsXHJcbiAgICAgICAgICAgIFwiODAwXCI6IFwiIzllOWQyNFwiLFxyXG4gICAgICAgICAgICBcIjkwMFwiOiBcIiM4Mjc3MTdcIixcclxuICAgICAgICAgICAgXCJhMTAwXCI6IFwiI2Y0ZmY4MVwiLFxyXG4gICAgICAgICAgICBcImEyMDBcIjogXCIjZWVmZjQxXCIsXHJcbiAgICAgICAgICAgIFwiYTQwMFwiOiBcIiNjNmZmMDBcIixcclxuICAgICAgICAgICAgXCJhNzAwXCI6IFwiI2FlZWEwMFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcInllbGxvd1wiOiB7XHJcbiAgICAgICAgICAgIFwiNTBcIjogXCIjZmZmZGU3XCIsXHJcbiAgICAgICAgICAgIFwiMTAwXCI6IFwiI2ZmZjljNFwiLFxyXG4gICAgICAgICAgICBcIjIwMFwiOiBcIiNmZmY1OWRcIixcclxuICAgICAgICAgICAgXCIzMDBcIjogXCIjZmZmMTc2XCIsXHJcbiAgICAgICAgICAgIFwiNDAwXCI6IFwiI2ZmZWU1OFwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOiBcIiNmZmViM2JcIixcclxuICAgICAgICAgICAgXCI2MDBcIjogXCIjZmRkODM1XCIsXHJcbiAgICAgICAgICAgIFwiNzAwXCI6IFwiI2ZiYzAyZFwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOiBcIiNmOWE4MjVcIixcclxuICAgICAgICAgICAgXCI5MDBcIjogXCIjZjU3ZjE3XCIsXHJcbiAgICAgICAgICAgIFwiYTEwMFwiOiBcIiNmZmZmOGRcIixcclxuICAgICAgICAgICAgXCJhMjAwXCI6IFwiI2ZmZmYwMFwiLFxyXG4gICAgICAgICAgICBcImE0MDBcIjogXCIjZmZlYTAwXCIsXHJcbiAgICAgICAgICAgIFwiYTcwMFwiOiBcIiNmZmQ2MDBcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJhbWJlclwiOiB7XHJcbiAgICAgICAgICAgIFwiNTBcIjogXCIjZmZmOGUxXCIsXHJcbiAgICAgICAgICAgIFwiMTAwXCI6IFwiI2ZmZWNiM1wiLFxyXG4gICAgICAgICAgICBcIjIwMFwiOiBcIiNmZmUwODJcIixcclxuICAgICAgICAgICAgXCIzMDBcIjogXCIjZmZkNTRmXCIsXHJcbiAgICAgICAgICAgIFwiNDAwXCI6IFwiI2ZmY2EyOFwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOiBcIiNmZmMxMDdcIixcclxuICAgICAgICAgICAgXCI2MDBcIjogXCIjZmZiMzAwXCIsXHJcbiAgICAgICAgICAgIFwiNzAwXCI6IFwiI2ZmYTAwMFwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOiBcIiNmZjhmMDBcIixcclxuICAgICAgICAgICAgXCI5MDBcIjogXCIjZmY2ZjAwXCIsXHJcbiAgICAgICAgICAgIFwiYTEwMFwiOiBcIiNmZmU1N2ZcIixcclxuICAgICAgICAgICAgXCJhMjAwXCI6IFwiI2ZmZDc0MFwiLFxyXG4gICAgICAgICAgICBcImE0MDBcIjogXCIjZmZjNDAwXCIsXHJcbiAgICAgICAgICAgIFwiYTcwMFwiOiBcIiNmZmFiMDBcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJvcmFuZ2VcIjoge1xyXG4gICAgICAgICAgICBcIjUwXCI6IFwiI2ZmZjNlMFwiLFxyXG4gICAgICAgICAgICBcIjEwMFwiOiBcIiNmZmUwYjJcIixcclxuICAgICAgICAgICAgXCIyMDBcIjogXCIjZmZjYzgwXCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6IFwiI2ZmYjc0ZFwiLFxyXG4gICAgICAgICAgICBcIjQwMFwiOiBcIiNmZmE3MjZcIixcclxuICAgICAgICAgICAgXCI1MDBcIjogXCIjZmY5ODAwXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6IFwiI2ZiOGMwMFwiLFxyXG4gICAgICAgICAgICBcIjcwMFwiOiBcIiNmNTdjMDBcIixcclxuICAgICAgICAgICAgXCI4MDBcIjogXCIjZWY2YzAwXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6IFwiI2U2NTEwMFwiLFxyXG4gICAgICAgICAgICBcImExMDBcIjogXCIjZmZkMTgwXCIsXHJcbiAgICAgICAgICAgIFwiYTIwMFwiOiBcIiNmZmFiNDBcIixcclxuICAgICAgICAgICAgXCJhNDAwXCI6IFwiI2ZmOTEwMFwiLFxyXG4gICAgICAgICAgICBcImE3MDBcIjogXCIjZmY2ZDAwXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiZGVlcE9yYW5nZVwiOiB7XHJcbiAgICAgICAgICAgIFwiNTBcIjogXCIjZmJlOWU3XCIsXHJcbiAgICAgICAgICAgIFwiMTAwXCI6IFwiI2ZmY2NiY1wiLFxyXG4gICAgICAgICAgICBcIjIwMFwiOiBcIiNmZmFiOTFcIixcclxuICAgICAgICAgICAgXCIzMDBcIjogXCIjZmY4YTY1XCIsXHJcbiAgICAgICAgICAgIFwiNDAwXCI6IFwiI2ZmNzA0M1wiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOiBcIiNmZjU3MjJcIixcclxuICAgICAgICAgICAgXCI2MDBcIjogXCIjZjQ1MTFlXCIsXHJcbiAgICAgICAgICAgIFwiNzAwXCI6IFwiI2U2NGExOVwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOiBcIiNkODQzMTVcIixcclxuICAgICAgICAgICAgXCI5MDBcIjogXCIjYmYzNjBjXCIsXHJcbiAgICAgICAgICAgIFwiYTEwMFwiOiBcIiNmZjllODBcIixcclxuICAgICAgICAgICAgXCJhMjAwXCI6IFwiI2ZmNmU0MFwiLFxyXG4gICAgICAgICAgICBcImE0MDBcIjogXCIjZmYzZDAwXCIsXHJcbiAgICAgICAgICAgIFwiYTcwMFwiOiBcIiNkZDJjMDBcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCJicm93blwiOiB7XHJcbiAgICAgICAgICAgIFwiNTBcIjogXCIjZWZlYmU5XCIsXHJcbiAgICAgICAgICAgIFwiMTAwXCI6IFwiI2Q3Y2NjOFwiLFxyXG4gICAgICAgICAgICBcIjIwMFwiOiBcIiNiY2FhYTRcIixcclxuICAgICAgICAgICAgXCIzMDBcIjogXCIjYTE4ODdmXCIsXHJcbiAgICAgICAgICAgIFwiNDAwXCI6IFwiIzhkNmU2M1wiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOiBcIiM3OTU1NDhcIixcclxuICAgICAgICAgICAgXCI2MDBcIjogXCIjNmQ0YzQxXCIsXHJcbiAgICAgICAgICAgIFwiNzAwXCI6IFwiIzVkNDAzN1wiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOiBcIiM0ZTM0MmVcIixcclxuICAgICAgICAgICAgXCI5MDBcIjogXCIjM2UyNzIzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiZ3JleVwiOiB7XHJcbiAgICAgICAgICAgIFwiNTBcIjogXCIjZmFmYWZhXCIsXHJcbiAgICAgICAgICAgIFwiMTAwXCI6IFwiI2Y1ZjVmNVwiLFxyXG4gICAgICAgICAgICBcIjIwMFwiOiBcIiNlZWVlZWVcIixcclxuICAgICAgICAgICAgXCIzMDBcIjogXCIjZTBlMGUwXCIsXHJcbiAgICAgICAgICAgIFwiNDAwXCI6IFwiI2JkYmRiZFwiLFxyXG4gICAgICAgICAgICBcIjUwMFwiOiBcIiM5ZTllOWVcIixcclxuICAgICAgICAgICAgXCI2MDBcIjogXCIjNzU3NTc1XCIsXHJcbiAgICAgICAgICAgIFwiNzAwXCI6IFwiIzYxNjE2MVwiLFxyXG4gICAgICAgICAgICBcIjgwMFwiOiBcIiM0MjQyNDJcIixcclxuICAgICAgICAgICAgXCI5MDBcIjogXCIjMjEyMTIxXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiYmx1ZUdyZXlcIjoge1xyXG4gICAgICAgICAgICBcIjUwXCI6IFwiI2VjZWZmMVwiLFxyXG4gICAgICAgICAgICBcIjEwMFwiOiBcIiNjZmQ4ZGNcIixcclxuICAgICAgICAgICAgXCIyMDBcIjogXCIjYjBiZWM1XCIsXHJcbiAgICAgICAgICAgIFwiMzAwXCI6IFwiIzkwYTRhZVwiLFxyXG4gICAgICAgICAgICBcIjQwMFwiOiBcIiM3ODkwOWNcIixcclxuICAgICAgICAgICAgXCI1MDBcIjogXCIjNjA3ZDhiXCIsXHJcbiAgICAgICAgICAgIFwiNjAwXCI6IFwiIzU0NmU3YVwiLFxyXG4gICAgICAgICAgICBcIjcwMFwiOiBcIiM0NTVhNjRcIixcclxuICAgICAgICAgICAgXCI4MDBcIjogXCIjMzc0NzRmXCIsXHJcbiAgICAgICAgICAgIFwiOTAwXCI6IFwiIzI2MzIzOFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBcImJsYWNrXCI6IFwiIzAwMDAwMFwiLFxyXG4gICAgICAgIFwid2hpdGVcIjogXCIjZmZmZmZmXCJcclxuXHJcbiAgICB9XHJcbiAgICByZWQ6IEZDb2xvclN3YXRoO1xyXG4gICAgcGluazogRkNvbG9yU3dhdGg7XHJcbiAgICBwdXJwbGU6IEZDb2xvclN3YXRoO1xyXG4gICAgZGVlcFB1cnBsZTogRkNvbG9yU3dhdGg7XHJcbiAgICBpbmRpZ286IEZDb2xvclN3YXRoO1xyXG4gICAgYmx1ZTogRkNvbG9yU3dhdGg7XHJcbiAgICBsaWdodEJsdWU6IEZDb2xvclN3YXRoO1xyXG4gICAgY3lhbjogRkNvbG9yU3dhdGg7XHJcbiAgICB0ZWFsOiBGQ29sb3JTd2F0aDtcclxuICAgIGdyZWVuOiBGQ29sb3JTd2F0aDtcclxuICAgIGxpZ2h0R3JlZW46IEZDb2xvclN3YXRoO1xyXG4gICAgbGltZTogRkNvbG9yU3dhdGg7XHJcbiAgICB5ZWxsb3c6IEZDb2xvclN3YXRoO1xyXG4gICAgYW1iZXI6IEZDb2xvclN3YXRoO1xyXG4gICAgb3JhbmdlOiBGQ29sb3JTd2F0aDtcclxuICAgIGRlZXBPcmFuZ2U6IEZDb2xvclN3YXRoO1xyXG4gICAgYnJvd246IEZDb2xvclN3YXRoO1xyXG4gICAgZ3JleTogRkNvbG9yU3dhdGg7XHJcbiAgICBibHVlR3JleTogRkNvbG9yU3dhdGg7XHJcbiAgICBibGFjazogRkNvbG9yO1xyXG4gICAgd2hpdGU6IEZDb2xvcjtcclxuICAgIGRhcmtNb2RlOiBbRkNvbG9yLCBGQ29sb3IsIEZDb2xvciwgRkNvbG9yLCBGQ29sb3IsIEZDb2xvciwgRkNvbG9yLCBGQ29sb3IsIEZDb2xvciwgRkNvbG9yLCBGQ29sb3IsIEZDb2xvcl0gPSBbbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbF1cclxuICAgIGxpZ2h0VGV4dDogW0ZDb2xvciwgRkNvbG9yXSA9IFtGQ29sb3IuZnJvbUhleCgnIzlFOUU5RScpLCBGQ29sb3IuZnJvbUhleCgnI0UwRTBFMCcpXVxyXG4gICAgcHVibGljIHN0YXRpYyBmQ29sb3I6IEZDb2xvckRpcmVjdG9yeSA9IG51bGw7Ly9zaW5nbHRvbiBpbnN0YW5jZVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIC8vICAgICAgICAgIDAgIDEgICAyICAgMyAgIDQgICA1ICAgNiAgIDcgICA4ICAgOSAgIDEwICAxMVxyXG4gICAgICAgIGxldCBkbWNzID0gWzAsIDE1LCAyMCwgMjUsIDMwLCAzNCwgMzgsIDQyLCA0NywgNTQsIDYwLCA3MF07XHJcbiAgICAgICAgbGV0IGdldERhcmtNb2RlQ29sb3IgPSAoaSkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcyA9IGRtY3NbaV0gLy9NYXRoLmZsb29yKDcwICogTWF0aC5wb3coaSAvIDEwLjAsIDIpKTtcclxuICAgICAgICAgICAgdmFyIHAgPSBzLnRvU3RyaW5nKDE2KTtcclxuICAgICAgICAgICAgaWYgKHAubGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgICAgICAgIHAgPSBgMCR7cH1gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBvdXQgPSBgIyR7cH0ke3B9JHtwfWBcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhgQnVpbHQgZGFyayBtb2RlIGNvbG9yICR7c30gZm9yIGluZGV4ICR7aX06ICR7b3V0fSBgKVxyXG4gICAgICAgICAgICByZXR1cm4gRkNvbG9yLmZyb21IZXgob3V0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGRhcmtNb2RlQ29sb3JDb3VudCA9IDExO1xyXG4gICAgICAgIHZhciBnZW5Dc3MgPSBcIiBcIjtcclxuICAgICAgICBsZXQgY3NzRWxlbTogSFRNTFN0eWxlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IGRhcmtNb2RlQ29sb3JDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGFya01vZGVbaV0gPSBnZXREYXJrTW9kZUNvbG9yKGkpO1xyXG4gICAgICAgICAgICBnZW5Dc3MgPSBnZW5Dc3MgKyBgXFxuLmRhcmtCYWNrZ3JvdW5kJHtpfXtiYWNrZ3JvdW5kLWNvbG9yOiAke2dldERhcmtNb2RlQ29sb3IoaSkudG9IZXhTdHJpbmcoKX19XFxuYDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9sZXQgdHN0ID0gLy9uZXcgRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKGAke2dlbkNzc308L3N0eWxlPmAsICd0ZXh0L2h0bWwnKVxyXG4gICAgICAgIGNzc0VsZW0uaW5uZXJIVE1MID0gZ2VuQ3NzO1xyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2hlYWQnKS5hcHBlbmQoY3NzRWxlbSk7XHJcbiAgICAgICAgLy8kKGAke2dlbkNzc308L3N0eWxlPmApLmFwcGVuZFRvKFwiaGVhZFwiKTtcclxuXHJcbiAgICAgICAgbGV0IGNvbG9yTmFtZXMgPSBPYmplY3Qua2V5cyhGQ29sb3JEaXJlY3RvcnkubWF0ZXJpYWxDb2xvcnMpO1xyXG4gICAgICAgIHZhciBjb2xvckxhYmVscyA9IFtdO1xyXG4gICAgICAgIHZhciBlbmdsaXNoTGFiZWwgPSBcIlwiO1xyXG4gICAgICAgIHZhciBjdXJyZW50Q29sb3I7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIk1hcHBpbmcgY29sb3JzXCIpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29sb3JOYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiTWFwcGluZyBcIiArIGNvbG9yTmFtZXNbaV0pO1xyXG4gICAgICAgICAgICBjdXJyZW50Q29sb3IgPSBGQ29sb3JEaXJlY3RvcnkubWF0ZXJpYWxDb2xvcnNbY29sb3JOYW1lc1tpXV07XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGN1cnJlbnRDb2xvciA9PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgY29sb3JMYWJlbHMgPSBPYmplY3Qua2V5cyhjdXJyZW50Q29sb3IpO1xyXG4gICAgICAgICAgICAgICAgdGhpc1tjb2xvck5hbWVzW2ldXSA9IG5ldyBGQ29sb3JTd2F0aChGQ29sb3JEaXJlY3RvcnkubWF0ZXJpYWxDb2xvcnNbY29sb3JOYW1lc1tpXV0pO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjb2xvckxhYmVscy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoY29sb3JMYWJlbHNbal0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIjUwXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdsaXNoTGFiZWwgPSBcImxpZ2h0ZW4tNVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCIxMDBcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2xpc2hMYWJlbCA9IFwibGlnaHRlbi00XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIjIwMFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5nbGlzaExhYmVsID0gXCJsaWdodGVuLTNcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiMzAwXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdsaXNoTGFiZWwgPSBcImxpZ2h0ZW4tMlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCI0MDBcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2xpc2hMYWJlbCA9IFwibGlnaHRlbi0xXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIjUwMFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5nbGlzaExhYmVsID0gXCJiYXNlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIjYwMFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5nbGlzaExhYmVsID0gXCJkYXJrZW4tMVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCI3MDBcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2xpc2hMYWJlbCA9IFwiZGFya2VuLTJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiODAwXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdsaXNoTGFiZWwgPSBcImRhcmtlbi0zXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIjkwMFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5nbGlzaExhYmVsID0gXCJkYXJrZW4tNFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJhMTAwXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdsaXNoTGFiZWwgPSBcImFjY2VudC0xXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImEyMDBcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2xpc2hMYWJlbCA9IFwiYWNjZW50LTJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiYTQwMFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5nbGlzaExhYmVsID0gXCJhY2NlbnQtM1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJhNzAwXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdsaXNoTGFiZWwgPSBcImFjY2VudC00XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2xpc2hMYWJlbCA9IGNvbG9yTGFiZWxzW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiW1wiICsgaSArIFwiLCBcIiArIGogKyBcIl0gTWFwcGluZyBjb2xvcnMuXCIgKyBjb2xvck5hbWVzW2pdICsgXCIuXCIgKyBlbmdsaXNoTGFiZWwgKyBcIiA9IFwiICsgY3VycmVudENvbG9yW2NvbG9yTGFiZWxzW2pdXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpc1tjb2xvck5hbWVzW2ldXVtlbmdsaXNoTGFiZWxdID0gRkNvbG9yLmZyb21IZXgoY3VycmVudENvbG9yW2NvbG9yTGFiZWxzW2pdXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzW2NvbG9yTmFtZXNbaV1dID0gRkNvbG9yLmZyb21IZXgoY3VycmVudENvbG9yID8/IFwiI2ZmMDBmZlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJcclxuaW1wb3J0IHsgQnJpc3RvbEJvYXJkLCBDYXJkQnJpc3RvbCB9IGZyb20gXCIuLi9pbXBvcnRzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRkhUTUw8VFlQRSBleHRlbmRzIEhUTUxFbGVtZW50PiB7XHJcbiAgICBvZmZzZXQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTs7XHJcbiAgICB9XHJcblxyXG4gICAgZWxlbWVudDogVFlQRVxyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudDogVFlQRSB8IHN0cmluZykge1xyXG4gICAgICAgIGlmICh0eXBlb2YgZWxlbWVudCA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnZXQgd2lkdGgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5vZmZzZXRXaWR0aDtcclxuICAgIH1cclxuICAgIGdldCBoZWlnaHQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5vZmZzZXRIZWlnaHQ7XHJcbiAgICB9XHJcbiAgICBzZXRDc3MobmFtZTogc3RyaW5nIHwgQXJyYXk8W3N0cmluZywgc3RyaW5nXT4sIHZhbHVlOiBzdHJpbmcgPSBudWxsKTogdGhpcyB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBuYW1lID09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZVtuYW1lXSA9IHZhbHVlOy8vKG5hbWUsIHZhbHVlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuYW1lLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldENzcyhuYW1lW2ldWzBdLCBuYW1lW2ldWzFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxuICAgIGFwcGVuZChjYW52YXM6IEZIVE1MPEhUTUxDYW52YXNFbGVtZW50Pikge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmQoY2FudmFzLmVsZW1lbnQpO1xyXG4gICAgfVxyXG4gICAgZ2V0Q3NzKG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5zdHlsZVtuYW1lXTtcclxuICAgIH1cclxuICAgIGF0dHIobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nID0gbnVsbCk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKHZhbHVlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZ2V0QXR0cmlidXRlKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNyZWF0ZUNoaWxkRGl2KGlkOiBzdHJpbmcpOiBGSFRNTDxIVE1MRGl2RWxlbWVudD4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUNoaWxkRWxlbTxcImRpdlwiPihpZCwgXCJkaXZcIik7XHJcbiAgICB9XHJcbiAgICBjcmVhdGVDaGlsZEVsZW08RnJlc2hUeXBlIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPihpZDogc3RyaW5nLCB0YWdUeXBlOiBGcmVzaFR5cGUpOiBGSFRNTDxIVE1MRWxlbWVudFRhZ05hbWVNYXBbRnJlc2hUeXBlXT4ge1xyXG4gICAgICAgIGxldCBlbGVtOiBIVE1MRWxlbWVudFRhZ05hbWVNYXBbRnJlc2hUeXBlXSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQ8RnJlc2hUeXBlPih0YWdUeXBlKTtcclxuICAgICAgICBsZXQgb3V0cHV0OiBGSFRNTDxIVE1MRWxlbWVudFRhZ05hbWVNYXBbRnJlc2hUeXBlXT4gPSBuZXcgRkhUTUwoZWxlbSk7XHJcbiAgICAgICAgb3V0cHV0LmF0dHIoXCJpZFwiLCBpZCk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKGVsZW0pO1xyXG4gICAgICAgIHJldHVybiBvdXRwdXQ7XHJcbiAgICB9XHJcbiAgICBcclxufSIsImltcG9ydCB7ICB9IGZyb20gXCIuLi9CcmlzdG9sL01haW5CcmlzdG9sXCI7XHJcbmltcG9ydCB7IH0gZnJvbSBcIi4uL0ZIVE1ML0ZDb2xvclwiO1xyXG5pbXBvcnQgeyBGQ29sb3JEaXJlY3RvcnksIENhcmRCcmlzdG9sIH0gZnJvbSBcIi4uL2ltcG9ydHNcIjtcclxuXHJcbmV4cG9ydCB0eXBlIG9wdEZ1bmM8VD4gPSBUIHwgKCgpID0+IFQpO1xyXG5leHBvcnQgdHlwZSBvcHRUcmFuc2Zvcm08SSxPPiA9IE8gfCAoKGlucHV0OiBJKSA9PiBPKTtcclxuXHJcbmRlY2xhcmUgZ2xvYmFsIHtcclxuXHJcbiAgICBpbnRlcmZhY2UgU3RyaW5nIHtcclxuICAgICAgICByZXBsYWNlQWxsKGE6IHN0cmluZywgYjogc3RyaW5nKTogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBjYXJkOiBDYXJkQnJpc3RvbFxyXG4gICAgdmFyIGZDb2xvcjogRkNvbG9yRGlyZWN0b3J5XHJcblxyXG59XHJcblxyXG5TdHJpbmcucHJvdG90eXBlLnJlcGxhY2VBbGwgPSBmdW5jdGlvbiAoYTogc3RyaW5nLCBiOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiB0aGlzLnNwbGl0KGEpLmpvaW4oYik7XHJcbn07XHJcbmV4cG9ydCBmdW5jdGlvbiBpc051bWJlcihpbnB1dDogbnVtYmVyIHwgc3RyaW5nKSB7XHJcbiAgICByZXR1cm4gIWlzTmFOKGlucHV0IGFzIGFueSlcclxufVxyXG5leHBvcnQgZnVuY3Rpb24gbGVycChzdGFydDogbnVtYmVyLCBlbmQ6IG51bWJlciwgYWxwaGE6IG51bWJlcil7XHJcbiAgICByZXR1cm4gc3RhcnQgKyAoZW5kIC0gc3RhcnQpICogYWxwaGE7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBldmFsT3B0aW9uYWxGdW5jPFQ+KGlucHV0OiBvcHRGdW5jPFQ+LCBkZWY6IFQgPSBudWxsKSB7XHJcbiAgICBpZiAoaW5wdXQgPT0gbnVsbCB8fCBpbnB1dCA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXR1cm4gZGVmO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBpbnB1dCA9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgcmV0dXJuIChpbnB1dCBhcyAoKCkgPT4gVCkpKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJldHVybiBpbnB1dDtcclxufVxyXG5leHBvcnQgY2xhc3MgQXZlcmFnZXIge1xyXG4gICAgbWF4SW5kOiBudW1iZXIgPSAwO1xyXG4gICAgYXJyOiBudW1iZXJbXTtcclxuICAgIGluZGV4OiBudW1iZXIgPSAwO1xyXG4gICAgY29uc3RydWN0b3Ioc2l6ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5hcnIgPSBuZXcgQXJyYXk8bnVtYmVyPihzaXplKTtcclxuICAgIH1cclxuICAgIGFkZCh2YWw6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuYXJyW3RoaXMuaW5kZXhdID0gdmFsO1xyXG4gICAgICAgIHRoaXMuaW5kZXgrKztcclxuICAgICAgICBpZiAodGhpcy5pbmRleCA+PSB0aGlzLmFyci5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5pbmRleCA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLm1heEluZCA8IHRoaXMuYXJyLmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgdGhpcy5tYXhJbmQrKztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIHRvdGFsOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIGFkZEhlbHBlcih2YWw6IG51bWJlciwgaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGlmIChpbmRleCA8PSB0aGlzLm1heEluZCkge1xyXG4gICAgICAgICAgICB0aGlzLnRvdGFsICs9IHZhbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnZXQgdmFsKCkge1xyXG4gICAgICAgIHRoaXMudG90YWwgPSAwO1xyXG4gICAgICAgIHRoaXMuYXJyLmZvckVhY2godGhpcy5hZGRIZWxwZXIuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudG90YWwgLyB0aGlzLm1heEluZDtcclxuICAgIH1cclxufSIsImltcG9ydCB7IGlzTnVtYmVyIH0gZnJvbSBcIi4uL2ltcG9ydHNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBTb3J0ZWRMaW5rZWRMaXN0PFQ+IHtcclxuICAgIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb3VudDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgY291bnQ6IG51bWJlciA9IDA7XHJcbiAgICBjbGVhcihvblJlbW92ZTogKHZhbHVlOiBUKSA9PiB2b2lkID0gKHY6IFQpID0+IHsgfSkge1xyXG4gICAgICAgIGxldCB0bXAgPSB0aGlzLmhlYWQ7XHJcbiAgICAgICAgdGhpcy5oZWFkID0gbnVsbDtcclxuICAgICAgICBsZXQgbmV4dDogU29ydGVkTGlua2VkTGlzdE5vZGU8VD47XHJcbiAgICAgICAgd2hpbGUgKHRtcCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIG5leHQgPSB0bXAubmV4dDtcclxuICAgICAgICAgICAgb25SZW1vdmUodG1wLnZhbHVlKTtcclxuICAgICAgICAgICAgdG1wLm5leHQgPSBudWxsO1xyXG4gICAgICAgICAgICB0bXAubGFzdCA9IG51bGw7XHJcbiAgICAgICAgICAgIHRtcC52YWx1ZSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRtcCA9IG5leHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbXBhcmF0b3I6IChhOiBULCBiOiBUKSA9PiBudW1iZXI7XHJcbiAgICBoZWFkOiBTb3J0ZWRMaW5rZWRMaXN0Tm9kZTxUPiA9IG51bGw7XHJcbiAgICBnZXQgdGFpbCgpOiBTb3J0ZWRMaW5rZWRMaXN0Tm9kZTxUPiB7XHJcbiAgICAgICAgbGV0IG4gPSB0aGlzLmhlYWQ7XHJcbiAgICAgICAgaWYgKG4gPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2hpbGUgKG4ubmV4dCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIG4gPSBuLm5leHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHN0YXRpYyBDcmVhdGU8VD4oY29tcGFyYXRvcjogKGE6IFQsIGI6IFQpID0+IG51bWJlcikge1xyXG4gICAgICAgIGxldCBvdXQgPSBuZXcgU29ydGVkTGlua2VkTGlzdDxUPihjb21wYXJhdG9yKTtcclxuICAgICAgICByZXR1cm4gbmV3IFByb3h5KG91dCwge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICh0YXJnZXQ6IFNvcnRlZExpbmtlZExpc3Q8VD4sIG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChuYW1lIGluIHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXRbbmFtZV1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNOdW1iZXIobmFtZSBhcyBhbnkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRhcmdldEluZGV4ID0gTnVtYmVyKG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBvdXQ6IFQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldC5mb3JFYWNoKCh2OiBULCBpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PSB0YXJnZXRJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3V0ID0gdjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKGNvbXBhcmF0b3I6IChhOiBULCBiOiBUKSA9PiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmNvbXBhcmF0b3IgPSBjb21wYXJhdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIGlzQUdyZWF0ZXIoYTogVCwgYjogVCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBhcmF0b3IoYSwgYikgPiAwO1xyXG4gICAgfVxyXG4gICAgaXNBTGVzc2VyKGE6IFQsIGI6IFQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb21wYXJhdG9yKGEsIGIpIDwgMDtcclxuICAgIH1cclxuICAgIGlzRXF1YWwoYTogVCwgYjogVCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBhcmF0b3IoYSwgYikgPT0gMDtcclxuICAgIH1cclxuICAgIGFkZCh2YWx1ZTogVCkge1xyXG4gICAgICAgIHRoaXMuY291bnQrKztcclxuICAgICAgICBpZiAodGhpcy5oZWFkID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5oZWFkID0gbmV3IFNvcnRlZExpbmtlZExpc3ROb2RlPFQ+KHZhbHVlKTtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZnJlc2g6IFNvcnRlZExpbmtlZExpc3ROb2RlPFQ+ID0gbmV3IFNvcnRlZExpbmtlZExpc3ROb2RlPFQ+KHZhbHVlKTtcclxuICAgICAgICBsZXQgbiA9IHRoaXMuaGVhZDtcclxuICAgICAgICBpZiAodGhpcy5pc0FMZXNzZXIodmFsdWUsIG4udmFsdWUpKSB7XHJcblxyXG4gICAgICAgICAgICBmcmVzaC5uZXh0ID0gdGhpcy5oZWFkO1xyXG4gICAgICAgICAgICB0aGlzLmhlYWQubGFzdCA9IGZyZXNoO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5oZWFkID0gZnJlc2g7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgaSA9IDE7XHJcbiAgICAgICAgd2hpbGUgKG4ubmV4dCAhPSBudWxsICYmICh0aGlzLmNvbXBhcmF0b3IodmFsdWUsIG4ubmV4dC52YWx1ZSkgPj0gMCkpIHtcclxuICAgICAgICAgICAgbiA9IG4ubmV4dDtcclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdG1wID0gbi5uZXh0O1xyXG4gICAgICAgIG4ubmV4dCA9IGZyZXNoO1xyXG4gICAgICAgIGZyZXNoLmxhc3QgPSBuO1xyXG4gICAgICAgIGZyZXNoLm5leHQgPSB0bXA7XHJcbiAgICAgICAgaWYgKHRtcCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRtcC5sYXN0ID0gZnJlc2g7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vcmVtb3ZlcyBmaXJzdCBlbGVtZW50IHRoYXQgY29uZGl0aW9uKFQpIHJldHVybnMgdHJ1ZSBmb3JcclxuICAgIHJlbW92ZShjb25kaXRpb246ICgodjogVCkgPT4gYm9vbGVhbikpIHtcclxuICAgICAgICBpZiAoY29uZGl0aW9uKHRoaXMuaGVhZC52YWx1ZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5oZWFkID0gdGhpcy5oZWFkLm5leHQ7XHJcbiAgICAgICAgICAgIHRoaXMuaGVhZC5sYXN0ID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5jb3VudC0tO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBuID0gdGhpcy5oZWFkLm5leHQ7XHJcbiAgICAgICAgbGV0IGxhc3ROID0gdGhpcy5oZWFkO1xyXG4gICAgICAgIHdoaWxlIChuICE9IG51bGwpIHtcclxuICAgICAgICAgICAgaWYgKGNvbmRpdGlvbihuLnZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgbGFzdE4ubmV4dCA9IG4ubmV4dDtcclxuICAgICAgICAgICAgICAgIGlmIChuLm5leHQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG4ubmV4dC5sYXN0ID0gbGFzdE47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvdW50LS07XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsYXN0TiA9IG47XHJcbiAgICAgICAgICAgIG4gPSBuLm5leHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZmluZChjb25kaXRpb246IChlbGVtOiBUKSA9PiBib29sZWFuKTogVCB7XHJcbiAgICAgICAgbGV0IG4gPSB0aGlzLmhlYWQ7XHJcbiAgICAgICAgd2hpbGUgKG4gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAoY29uZGl0aW9uKG4udmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbi52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBuID0gbi5uZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvL3JldHVybiB0cnVlIHRvIGJyZWFrXHJcbiAgICBmb3JFYWNoKGNhbGxiYWNrOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+ICh2b2lkIHwgYm9vbGVhbikpIHtcclxuICAgICAgICBsZXQgbiA9IHRoaXMuaGVhZDtcclxuICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgd2hpbGUgKG4gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2sobi52YWx1ZSwgaSkgPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICBuID0gbi5uZXh0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vcmV0dXJuIHRydWUgdG8gYnJlYWtcclxuICAgIGZvckVhY2hSZXZlcnNlKGNhbGxiYWNrOiAodmFsdWU6IFQpID0+ICh2b2lkIHwgYm9vbGVhbikpIHtcclxuICAgICAgICBsZXQgbiA9IHRoaXMudGFpbDtcclxuICAgICAgICB3aGlsZSAobiAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmIChjYWxsYmFjayhuLnZhbHVlKSA9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBuID0gbi5sYXN0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuZXhwb3J0IGNsYXNzIFNvcnRlZExpbmtlZExpc3ROb2RlPFQ+IHtcclxuICAgIHZhbHVlOiBUXHJcbiAgICBuZXh0OiBTb3J0ZWRMaW5rZWRMaXN0Tm9kZTxUPlxyXG4gICAgbGFzdDogU29ydGVkTGlua2VkTGlzdE5vZGU8VD5cclxuICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBULCBuZXh0OiBTb3J0ZWRMaW5rZWRMaXN0Tm9kZTxUPiA9IG51bGwsIGxhc3Q6IFNvcnRlZExpbmtlZExpc3ROb2RlPFQ+ID0gbnVsbCkge1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLm5leHQgPSBuZXh0O1xyXG4gICAgICAgIHRoaXMubGFzdCA9IGxhc3Q7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgKiBmcm9tIFwiLi9GSFRNTC9GSFRNTFwiO1xyXG5leHBvcnQgKiBmcm9tIFwiLi9CcmlzdG9sL0JyaXN0b2xCb2FyZFwiO1xyXG5leHBvcnQgKiBmcm9tIFwiLi9IZWxwZXIvSGVscGVyXCI7XHJcbmltcG9ydCB7IEZDb2xvciwgRkNvbG9yRGlyZWN0b3J5LCBGQ29sb3JTd2F0aCB9IGZyb20gJy4vRkhUTUwvRkNvbG9yJ1xyXG5sZXQgZkNvbG9yID0gbmV3IEZDb2xvckRpcmVjdG9yeSgpO1xyXG5leHBvcnQgeyBGQ29sb3IsIGZDb2xvciwgRkNvbG9yU3dhdGgsIEZDb2xvckRpcmVjdG9yeSB9XHJcbndpbmRvdy5mQ29sb3IgPSBmQ29sb3I7XHJcbmV4cG9ydCAqIGZyb20gXCIuL0JyaXN0b2wvVUlGcmFtZVwiO1xyXG5leHBvcnQgKiBmcm9tIFwiLi9CcmlzdG9sL01haW5CcmlzdG9sXCI7XHJcbmV4cG9ydCAqIGZyb20gXCIuL0JyaXN0b2wvVUlFbGVtZW50XCI7XHJcbmV4cG9ydCAqIGZyb20gXCIuL0hlbHBlci9Tb3J0ZWRMaW5rZWRMaXN0XCI7XHJcbmV4cG9ydCAqIGZyb20gXCIuL0VsZW1lbnRzL0Zvb3RiYWxsRmllbGRcIjtcclxuZXhwb3J0ICogZnJvbSBcIi4vRWxlbWVudHMvU2t5XCI7XHJcblxyXG5leHBvcnQgKiBmcm9tIFwiLi9FbGVtZW50cy9NZXNzYWdlXCI7XHJcbmV4cG9ydCAqIGZyb20gXCIuL0VsZW1lbnRzL0JhY2tncm91bmRcIjtcclxuZXhwb3J0ICogZnJvbSBcIi4vRWxlbWVudHMvSW1hZ2VFbGVtXCJcclxuIFxyXG5leHBvcnQgKiBmcm9tIFwiLi9FbGVtZW50cy9TbG90TWFjaGluZVwiIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIlxyXG5cclxuaW1wb3J0IHsgRkhUTUwsIENhcmRCcmlzdG9sLCBldmFsT3B0aW9uYWxGdW5jIH0gZnJvbSBcIi4vaW1wb3J0c1wiO1xyXG5cclxuXHJcbmxldCBib2R5OiBGSFRNTDxIVE1MQm9keUVsZW1lbnQ+ID0gbmV3IEZIVE1MPEhUTUxCb2R5RWxlbWVudD4oXCJib2R5XCIpO1xyXG5sZXQgY29udGFpbmVyRGl2OiBGSFRNTDxIVE1MRGl2RWxlbWVudD4gPSBib2R5LmNyZWF0ZUNoaWxkRGl2KCdjb250YWluZXInKVxyXG5jb250YWluZXJEaXYuc2V0Q3NzKFtcclxuICAgIFtcIndpZHRoXCIsIFwiMTAwdndcIl0sXHJcbiAgICBbJ2hlaWdodCcsJzEwMHZoJ10sXHJcbiAgICBbJ3Bvc2l0aW9uJywnYWJzb2x1dGUnXSxcclxuICAgIFsnbGVmdCcsICcwcHgnXSxcclxuICAgIFsndG9wJywgJzBweCddXHJcbl0pO1xyXG53aW5kb3cuY2FyZCA9IG5ldyBDYXJkQnJpc3RvbChjb250YWluZXJEaXYuZWxlbWVudCwgYXN5bmMgKGJyaXN0OiBDYXJkQnJpc3RvbCk9PntcclxuICAgIFxyXG5cclxuXHJcbn0pO1xyXG5cclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9