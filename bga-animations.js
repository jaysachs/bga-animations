"use strict";
var __extends = (this && this.__extends) || (function () {
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var BgaAnimation = /** @class */ (function () {
    function BgaAnimation(settings) {
        this.settings = settings;
        this.result = null;
        this.playWhenNoAnimation = false;
        this.timeoutId = null;
    }
    BgaAnimation.prototype.preAnimate = function (animationManager) { };
    BgaAnimation.prototype.postAnimate = function (animationManager) { };
    BgaAnimation.prototype.play = function (animationManager) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __awaiter(this, void 0, void 0, function () {
            var shouldPlay, _l;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        shouldPlay = this.playWhenNoAnimation || animationManager.animationsActive();
                        if (!shouldPlay) return [3 /*break*/, 2];
                        (_b = (_a = this.settings).animationStart) === null || _b === void 0 ? void 0 : _b.call(_a, this);
                        this.settings = __assign({ duration: (_f = (_d = (_c = this.settings) === null || _c === void 0 ? void 0 : _c.duration) !== null && _d !== void 0 ? _d : (_e = animationManager.getSettings()) === null || _e === void 0 ? void 0 : _e.duration) !== null && _f !== void 0 ? _f : 500 }, this.settings);
                        this.preAnimate(animationManager);
                        _l = this;
                        return [4 /*yield*/, this.doAnimate(animationManager)];
                    case 1:
                        _l.result = _m.sent();
                        this.postAnimate(animationManager);
                        (_h = (_g = this.settings).animationEnd) === null || _h === void 0 ? void 0 : _h.call(_g, this);
                        return [3 /*break*/, 3];
                    case 2:
                        (_k = (_j = this.settings).animationEnd) === null || _k === void 0 ? void 0 : _k.call(_j, this);
                        return [2 /*return*/, Promise.resolve(this)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BgaAnimation.prototype.wireUp = function (element, duration, success) {
        var _this = this;
        var originalZIndex = element.style.zIndex;
        var originalTransition = element.style.transition;
        var cleanOnTransitionEnd = function () {
            element.style.zIndex = originalZIndex;
            element.style.transition = originalTransition;
            success();
            element.removeEventListener('transitioncancel', cleanOnTransitionEnd);
            element.removeEventListener('transitionend', cleanOnTransitionEnd);
            element.removeEventListener("animationend", cleanOnTransitionEnd);
            document.removeEventListener('visibilitychange', cleanOnTransitionEnd);
            if (_this.timeoutId) {
                clearTimeout(_this.timeoutId);
            }
        };
        var cleanOnTransitionCancel = function () {
            element.style.transition = "";
            element.offsetHeight;
            //            element.style.transform = this.settings?.finalTransform ?? null;
            element.offsetHeight;
            cleanOnTransitionEnd();
        };
        element.addEventListener("animationend", cleanOnTransitionEnd, false);
        element.addEventListener('transitioncancel', cleanOnTransitionEnd);
        element.addEventListener('transitionend', cleanOnTransitionEnd);
        document.addEventListener('visibilitychange', cleanOnTransitionCancel);
        // safety in case transitionend and transitioncancel are not called
        this.timeoutId = setTimeout(cleanOnTransitionEnd, duration + 100);
    };
    return BgaAnimation;
}());
var BgaElementAnimation = /** @class */ (function (_super) {
    __extends(BgaElementAnimation, _super);
    function BgaElementAnimation(settings) {
        return _super.call(this, settings) || this;
    }
    BgaElementAnimation.prototype.preAnimate = function (animationManager) {
        var _a, _b, _c, _d, _e;
        this.settings = __assign({ scale: (_d = (_b = (_a = this.settings) === null || _a === void 0 ? void 0 : _a.scale) !== null && _b !== void 0 ? _b : (_c = animationManager.getZoomManager()) === null || _c === void 0 ? void 0 : _c.zoom) !== null && _d !== void 0 ? _d : undefined }, this.settings);
        this.settings.element.classList.add((_e = this.settings.animationClass) !== null && _e !== void 0 ? _e : 'bga-animations_animated');
    };
    BgaElementAnimation.prototype.postAnimate = function (animationManager) {
        var _a;
        this.settings.element.classList.remove((_a = this.settings.animationClass) !== null && _a !== void 0 ? _a : 'bga-animations_animated');
    };
    return BgaElementAnimation;
}(BgaAnimation));
/**
 * Fade the element.
 */
var BgaFadeAnimation = /** @class */ (function (_super) {
    __extends(BgaFadeAnimation, _super);
    function BgaFadeAnimation(settings) {
        return _super.call(this, settings) || this;
    }
    BgaFadeAnimation.prototype.doAnimate = function (animationManager) {
        var _this = this;
        return new Promise(function (success) {
            var _a, _b, _c, _d;
            var element = _this.settings.element;
            var duration = (_b = (_a = _this.settings) === null || _a === void 0 ? void 0 : _a.duration) !== null && _b !== void 0 ? _b : 500;
            _this.wireUp(element, duration, success);
            // this gets saved/restored in wireUp
            // element.style.zIndex = `${this.settings?.zIndex ?? 10}`;
            var frames = [];
            switch (_this.settings.kind) {
                case "in":
                    frames.push({ opacity: 0 }, { opacity: 1 });
                    break;
                case "out":
                    frames.push({ opacity: 1 }, { opacity: 0 });
                    break;
                case "outin":
                    frames.push({ opacity: 1 }, { opacity: 0 }, { opacity: 1 });
                    break;
            }
            var a = new Animation(new KeyframeEffect(element, frames, {
                duration: duration,
                easing: (_c = _this.settings.transitionTimingFunction) !== null && _c !== void 0 ? _c : 'linear',
                fill: "forwards",
                iterations: (_d = _this.settings.iterations) !== null && _d !== void 0 ? _d : 1,
            }));
            a.onfinish = function (e) {
                a.commitStyles();
                // element.style.transform = this.settings?.finalTransform ?? null;
            };
            a.play();
        });
    };
    return BgaFadeAnimation;
}(BgaElementAnimation));
/**
 * Slide of the element from origin to destination.
 */
var BgaSlideAnimation = /** @class */ (function (_super) {
    __extends(BgaSlideAnimation, _super);
    function BgaSlideAnimation(settings) {
        return _super.call(this, settings) || this;
    }
    BgaSlideAnimation.prototype.doAnimate = function (animationManager) {
        var _this = this;
        return new Promise(function (success) {
            var _a, _b, _c, _d, _e;
            var element = _this.settings.element;
            var transitionTimingFunction = (_a = _this.settings.transitionTimingFunction) !== null && _a !== void 0 ? _a : 'linear';
            var duration = (_c = (_b = _this.settings) === null || _b === void 0 ? void 0 : _b.duration) !== null && _c !== void 0 ? _c : 500;
            var _f = animationManager.getDeltaCoordinates(element, _this.settings), x = _f.x, y = _f.y;
            _this.wireUp(element, duration, success);
            // this gets saved/restored in wireUp
            element.style.zIndex = "".concat((_e = (_d = _this.settings) === null || _d === void 0 ? void 0 : _d.zIndex) !== null && _e !== void 0 ? _e : 10);
            var a = new Animation(new KeyframeEffect(element, [
                { transform: "translate3D(0, 0, 0)" },
                { transform: "translate3D(".concat(-x, "px, ").concat(-y, "px, 0)") }
            ], {
                iterations: _this.settings.iterations || 1,
                direction: _this.settings.direction || "normal",
                duration: duration,
                easing: transitionTimingFunction,
                fill: "forwards"
            }));
            a.onfinish = function (e) {
                a.commitStyles();
                //    element.style.transform = this.settings?.finalTransform ?? null;
            };
            a.play();
        });
    };
    return BgaSlideAnimation;
}(BgaElementAnimation));
/**
 * Slide of the element from origin to destination.
 */
var BgaSlideTempAnimation = /** @class */ (function (_super) {
    __extends(BgaSlideTempAnimation, _super);
    function BgaSlideTempAnimation(settings) {
        return _super.call(this, settings) || this;
    }
    BgaSlideTempAnimation.prototype.boundingRectForId = function (id) {
        var elem = document.getElementById(id);
        if (!elem) {
            throw new Error("Unable to find parent ".concat(id));
        }
        return elem.getBoundingClientRect();
    };
    BgaSlideTempAnimation.prototype.doAnimate = function (animationManager) {
        var _this = this;
        var delta = { x: 0, y: 0 };
        var div;
        return new Promise(function (success) {
            var _a, _b;
            var parent = document.getElementById(_this.settings.parentId);
            if (!parent) {
                throw new Error("Unable to find parent ".concat(_this.settings.parentId));
            }
            var parentRect = parent.getBoundingClientRect();
            var toRect = _this.boundingRectForId(_this.settings.toId);
            var fromRect = _this.boundingRectForId(_this.settings.fromId);
            var top = fromRect.top - parentRect.top;
            var left = fromRect.left - parentRect.left;
            div = document.createElement('div');
            div.id = "bbl_tmp_slideTmpDiv".concat(BgaSlideTempAnimation.lastId++);
            if (_this.settings.className) {
                div.className = _this.settings.className;
            }
            if (_this.settings.attrs) {
                for (var name_1 in _this.settings.attrs) {
                    div.attributes[name_1] = _this.settings.attrs[name_1];
                }
            }
            // Unclear why setting `style` attribute directly doesn't work.
            div.style.position = 'absolute';
            div.style.top = "".concat(top, "px");
            div.style.left = "".concat(left, "px");
            div.style.zIndex = '100';
            parent.appendChild(div);
            var duration = (_b = (_a = _this.settings) === null || _a === void 0 ? void 0 : _a.duration) !== null && _b !== void 0 ? _b : 500;
            _this.wireUp(div, duration, success);
            var divRect = div.getBoundingClientRect();
            var toTop = toRect.top - parentRect.top + (toRect.height - divRect.height) / 2;
            var toLeft = toRect.left - parentRect.left + (toRect.width - divRect.width) / 2;
            delta = {
                x: left - toLeft,
                y: top - toTop
            };
            return new BgaSlideAnimation({ duration: duration, element: div, fromDelta: delta }).play(animationManager).then(function () { return div.remove(); });
        });
    };
    BgaSlideTempAnimation.lastId = 0;
    return BgaSlideTempAnimation;
}(BgaAnimation));
/**
 * Show the element at the center of the screen
 */
var BgaShowScreenCenterAnimation = /** @class */ (function (_super) {
    __extends(BgaShowScreenCenterAnimation, _super);
    function BgaShowScreenCenterAnimation(settings) {
        return _super.call(this, settings) || this;
    }
    BgaShowScreenCenterAnimation.prototype.doAnimate = function (animationManager) {
        var _this = this;
        return new Promise(function (success) {
            var _a, _b, _c, _d, _e;
            var element = _this.settings.element;
            var elementBR = animationManager.game.getBoundingClientRectIgnoreZoom(element);
            var xCenter = (elementBR.left + elementBR.right) / 2;
            var yCenter = (elementBR.top + elementBR.bottom) / 2;
            var x = xCenter - (window.innerWidth / 2);
            var y = yCenter - (window.innerHeight / 2);
            var transitionTimingFunction = (_a = _this.settings.transitionTimingFunction) !== null && _a !== void 0 ? _a : 'linear';
            var duration = (_c = (_b = _this.settings) === null || _b === void 0 ? void 0 : _b.duration) !== null && _c !== void 0 ? _c : 500;
            _this.wireUp(element, duration, success);
            element.style.zIndex = "".concat((_e = (_d = _this.settings) === null || _d === void 0 ? void 0 : _d.zIndex) !== null && _e !== void 0 ? _e : 10);
            // element.offsetHeight;
            var a = new Animation(new KeyframeEffect(element, [
                { transform: "translate3D(0, 0, 0)" },
                { transform: "translate3D(".concat(-x, "px, ").concat(-y, "px, 0)") }
                // { transform: `translate3D(0, 0, 0)` }
            ], {
                duration: duration,
                fill: "forwards",
                easing: transitionTimingFunction
            }));
            // element.offsetHeight;
            a.onfinish = function (e) {
                a.commitStyles();
                // element.style.transform = this.settings?.finalTransform ?? null;
            };
            a.play();
        });
    };
    return BgaShowScreenCenterAnimation;
}(BgaElementAnimation));
/**
 * spin/grow temp text.
 */
var BgaSpinGrowAnimation = /** @class */ (function (_super) {
    __extends(BgaSpinGrowAnimation, _super);
    function BgaSpinGrowAnimation(settings) {
        return _super.call(this, settings) || this;
    }
    BgaSpinGrowAnimation.prototype.doAnimate = function (animationManager) {
        var _this = this;
        var delta = { x: 0, y: 0 };
        var div;
        return new Promise(function (success) {
            var _a, _b;
            var parent = document.getElementById(_this.settings.parentId);
            if (!parent) {
                throw new Error("No parent element with id ".concat(_this.settings.parentId));
            }
            var id = "bbl_tmp_spinGrowFx-".concat(BgaSpinGrowAnimation.lastId++);
            var outer = document.createElement('span');
            outer.id = id;
            outer.append(_this.settings.text);
            parent.appendChild(outer);
            outer.style.color = "blue";
            outer.style.color = "transparent";
            outer.style.position = "absolute";
            outer.style.fontSize = (_this.settings.fontSize || 128) + "pt";
            outer.style.display = "inline-block";
            outer.style.justifyContent = "center";
            outer.style.alignItems = "center";
            outer.style.display = "flex";
            // probably should allow a class to be passed in and used for these two
            outer.style.fontFamily = "Helvetica";
            outer.style.fontStyle = "bold";
            // get the ultimate dimensions of the container span
            var nrect = outer.getBoundingClientRect();
            outer.style.width = "".concat(nrect.width);
            outer.style.height = "".concat(nrect.height);
            // center the container on the center of the appropriate node
            var centerNode = document.getElementById(_this.settings.centeredOnId || _this.settings.parentId);
            if (!centerNode) {
                throw new Error("No center node found for ".concat(_this.settings));
            }
            var prect = parent.getBoundingClientRect();
            var crect = centerNode.getBoundingClientRect();
            var left = (crect.left + crect.width / 2 - nrect.width / 2 - prect.left);
            var top = (crect.top + crect.height / 2 - nrect.height / 2 - prect.top);
            outer.style.left = left + "px";
            outer.style.top = top + "px";
            // now create the node we're animating
            var node = document.createElement('span');
            node.append(_this.settings.text);
            outer.append(node);
            node.style.position = "absolute";
            node.style.display = "inline-block";
            node.style.justifyContent = "center";
            node.style.alignItems = "center";
            node.style.display = "flex";
            node.style.color = _this.settings.color || 'black';
            // this maybe ought to be a parameter, or part of the incoming class.
            // it also causes multiples of the text to show up!?!?
            // node.style.textShadow = "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000";
            node.style.setProperty('-webkit-text-stroke', 'thin black');
            var fontSize = _this.settings.fontSize || 190;
            node.style.fontSize = "".concat(fontSize, "pt");
            node.style.opacity = '0';
            var duration = (_b = (_a = _this.settings) === null || _a === void 0 ? void 0 : _a.duration) !== null && _b !== void 0 ? _b : 1000;
            var degrees = (_this.settings.spinCount || 2) * 360;
            _this.wireUp(node, duration, success);
            var a = new Animation(new KeyframeEffect(node, [
                { opacity: 1, transform: "rotate(0deg) scale(0.01)" },
                { opacity: 1, transform: "rotate(".concat(degrees, "deg) scale(1)") },
                { opacity: 0, transform: "rotate(".concat(degrees, "deg) scale(1)") },
            ], { duration: duration }));
            a.onfinish = function (e) {
                //    element.style.transform = this.settings?.finalTransform ?? null;
                outer.remove();
            };
            a.play();
        });
    };
    BgaSpinGrowAnimation.lastId = 0;
    return BgaSpinGrowAnimation;
}(BgaAnimation));
/**
 * Just does nothing for the duration
 */
var BgaPauseAnimation = /** @class */ (function (_super) {
    __extends(BgaPauseAnimation, _super);
    function BgaPauseAnimation(settings) {
        return _super.call(this, settings) || this;
    }
    BgaPauseAnimation.prototype.doAnimate = function (animationManager) {
        var _this = this;
        return new Promise(function (success) {
            var _a, _b;
            var duration = (_b = (_a = _this.settings) === null || _a === void 0 ? void 0 : _a.duration) !== null && _b !== void 0 ? _b : 500;
            setTimeout(function () { return success(); }, duration);
        });
    };
    return BgaPauseAnimation;
}(BgaAnimation));
/**
 * Just use playSequence from animationManager
 */
var BgaAttachWithAnimation = /** @class */ (function (_super) {
    __extends(BgaAttachWithAnimation, _super);
    function BgaAttachWithAnimation(settings) {
        var _this = _super.call(this, settings) || this;
        _this.playWhenNoAnimation = true;
        return _this;
    }
    BgaAttachWithAnimation.prototype.doAnimate = function (animationManager) {
        var _a;
        var settings = this.settings;
        var element = settings.animation.settings.element;
        element.offsetHeight;
        var fromRect = animationManager.game.getBoundingClientRectIgnoreZoom(element);
        settings.animation.settings.fromRect = fromRect;
        settings.attachElement.appendChild(element);
        (_a = settings.afterAttach) === null || _a === void 0 ? void 0 : _a.call(settings, element, settings.attachElement);
        return animationManager.play(settings.animation);
    };
    return BgaAttachWithAnimation;
}(BgaAnimation));
/**
 * Just use playSequence from animationManager
 */
var BgaCompoundAnimation = /** @class */ (function (_super) {
    __extends(BgaCompoundAnimation, _super);
    function BgaCompoundAnimation(settings) {
        var _this = _super.call(this, settings) || this;
        _this.playWhenNoAnimation = true;
        return _this;
    }
    BgaCompoundAnimation.prototype.doAnimate = function (animationManager) {
        if (this.settings.mode == "parallel") {
            return animationManager.playParallel(this.settings.animations);
        }
        else {
            return animationManager.playSequence(this.settings.animations);
        }
    };
    return BgaCompoundAnimation;
}(BgaAnimation));
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var NoopZoomManager = /** @class */ (function () {
    function NoopZoomManager() {
        this.zoom = 1;
    }
    return NoopZoomManager;
}());
var AnimationManager = /** @class */ (function () {
    /**
     * @param game the BGA game class, usually it will be `this`
     * @param settings: a `AnimationManagerSettings` object
     */
    function AnimationManager(game, settings) {
        this.game = game;
        this.settings = settings;
        this.zoomManager = (settings === null || settings === void 0 ? void 0 : settings.zoomManager) || new NoopZoomManager();
        if (!game) {
            throw new Error('You must set your game as the first parameter of AnimationManager');
        }
    }
    AnimationManager.prototype.getZoomManager = function () {
        return this.zoomManager;
    };
    /**
     * Set the zoom manager, to get the scale of the current game.
     *
     * @param zoomManager the zoom manager
     */
    AnimationManager.prototype.setZoomManager = function (zoomManager) {
        this.zoomManager = zoomManager;
    };
    AnimationManager.prototype.getSettings = function () {
        return this.settings;
    };
    /**
     * Returns if the animations are active. Animation aren't active when the window is not visible (`document.visibilityState === 'hidden'`), or `game.instantaneousMode` is true.
     *
     * @returns if the animations are active.
     */
    AnimationManager.prototype.animationsActive = function () {
        return document.visibilityState !== 'hidden' && !this.game.instantaneousMode;
    };
    /**
     * Plays an animation if the animations are active. Animation aren't active when the window is not visible (`document.visibilityState === 'hidden'`), or `game.instantaneousMode` is true.
     *
     * @param animation the animation to play
     * @returns the animation promise.
     */
    AnimationManager.prototype.play = function (animation) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, animation.play(this)];
            });
        });
    };
    /**
     * Plays multiple animations in parallel.
     *
     * @param animations the animations to play
     * @returns a promise for all animations.
     */
    AnimationManager.prototype.playParallel = function (animations) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.all(animations.map(function (animation) { return _this.play(animation); }))];
            });
        });
    };
    /**
     * Plays multiple animations in sequence (the second when the first ends, ...).
     *
     * @param animations the animations to play
     * @returns a promise for all animations.
     */
    AnimationManager.prototype.playSequence = function (animations) {
        return __awaiter(this, void 0, void 0, function () {
            var result, animations_1, animations_1_1, a, _a, _b, e_1_1;
            var e_1, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        result = [];
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 8]);
                        animations_1 = __values(animations), animations_1_1 = animations_1.next();
                        _d.label = 2;
                    case 2:
                        if (!!animations_1_1.done) return [3 /*break*/, 5];
                        a = animations_1_1.value;
                        _b = (_a = result).push;
                        return [4 /*yield*/, this.play(a)];
                    case 3:
                        _b.apply(_a, [_d.sent()]);
                        _d.label = 4;
                    case 4:
                        animations_1_1 = animations_1.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (animations_1_1 && !animations_1_1.done && (_c = animations_1.return)) _c.call(animations_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/, Promise.resolve(result)];
                }
            });
        });
    };
    /**
     * Plays multiple animations with a delay between each animation start.
     *
     * @param animations the animations to play
     * @param delay the delay (in ms)
     * @returns a promise for all animations.
     */
    AnimationManager.prototype.playWithDelay = function (animations, delay) {
        return __awaiter(this, void 0, void 0, function () {
            var promise;
            var _this = this;
            return __generator(this, function (_a) {
                promise = new Promise(function (success) {
                    var e_2, _a;
                    var promises = [];
                    var _loop_1 = function (i, animation) {
                        setTimeout(function () {
                            promises.push(_this.play(animation));
                            if (i == animations.length - 1) {
                                Promise.all(promises).then(function (result) {
                                    success(result);
                                });
                            }
                        }, i * delay);
                    };
                    try {
                        for (var _b = __values(animations.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var _d = __read(_c.value, 2), i = _d[0], animation = _d[1];
                            _loop_1(i, animation);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                });
                return [2 /*return*/, promise];
            });
        });
    };
    /**
     * Attach an element to a parent, then play animation from element's origin to its new position.
     *
     * @param animation the animation function
     * @param attachElement the destination parent
     * @returns a promise when animation ends
     */
    AnimationManager.prototype.attachWithAnimation = function (animation, attachElement) {
        var attachWithAnimation = new BgaAttachWithAnimation({
            animation: animation,
            duration: undefined,
            attachElement: attachElement
        });
        return this.play(attachWithAnimation);
    };
    /**
     * Return the x and y delta, based on the animation settings;
     *
     * @param settings an `AnimationSettings` object
     * @returns a promise when animation ends
     */
    AnimationManager.prototype.getDeltaCoordinates = function (element, settings) {
        var _a;
        if (!settings.fromDelta && !settings.fromRect && !settings.fromElement) {
            throw new Error("[bga-animation] fromDelta, fromRect or fromElement need to be set");
        }
        var x = 0;
        var y = 0;
        if (settings.fromDelta) {
            x = settings.fromDelta.x;
            y = settings.fromDelta.y;
        }
        else {
            var originBR = (_a = settings.fromRect) !== null && _a !== void 0 ? _a : this.game.getBoundingClientRectIgnoreZoom(settings.fromElement);
            // TODO make it an option ?
            var originalTransform = element.style.transform;
            element.style.transform = '';
            var destinationBR = this.game.getBoundingClientRectIgnoreZoom(element);
            element.style.transform = originalTransform;
            x = (destinationBR.left + destinationBR.right) / 2 - (originBR.left + originBR.right) / 2;
            y = (destinationBR.top + destinationBR.bottom) / 2 - (originBR.top + originBR.bottom) / 2;
        }
        if (settings.scale) {
            x /= settings.scale;
            y /= settings.scale;
        }
        return { x: x, y: y };
    };
    return AnimationManager;
}());
