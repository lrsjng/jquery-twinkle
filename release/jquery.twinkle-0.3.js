/*
 * jQuery.twinkle 0.3
 * http://larsjung.de/twinkle
 *
 * provided under the terms of the MIT License
 */

/*
 * ModPlug 0.4
 * http://larsjung.de/modplug
 *
 * provided under the terms of the MIT License
 */

(function ($) {
    "use strict";

    var reference = "_mp_api";

    $.ModPlug = $.ModPlug || {
        plugin: function (namespace, options) {

            if (!namespace || $[namespace] || $.fn[namespace]) {
                // 1: no namespace specified
                // 2: static namespace not available
                // 3: namespace not available
                return !namespace ? 1 : ($[namespace] ? 2 : 3);
            }

            var defaults = {
                    statics: {},
                    methods: {},
                    defaultStatic: undefined,
                    defaultMethod: undefined
                },
                settings = $.extend({}, defaults, options),
                staticPlug = function () {

                    var args, defaultMethod;

                    args = Array.prototype.slice.call(arguments);
                    defaultMethod = settings.defaultStatic instanceof Function ? settings.defaultStatic.apply(this, args) : settings.defaultStatic;
                    if (staticPlug[defaultMethod] instanceof Function) {
                        return staticPlug[defaultMethod].apply(this, args);
                    }
                    $.error("Static method defaulted to '" + defaultMethod + "' does not exist on 'jQuery." + namespace + "'");
                },
                methods = {},
                methodPlug = function (method) {

                    var args, defaultMethod;

                    if (methods[method] instanceof Function) {
                        args = Array.prototype.slice.call(arguments, 1);
                        return methods[method].apply(this, args);
                    }

                    args = Array.prototype.slice.call(arguments);
                    defaultMethod = settings.defaultMethod instanceof Function ? settings.defaultMethod.apply(this, args) : settings.defaultMethod;
                    if (methods[defaultMethod] instanceof Function) {
                        return methods[defaultMethod].apply(this, args);
                    }
                    $.error("Method '" + method + "' defaulted to '" + defaultMethod + "' does not exist on 'jQuery." + namespace + "'");
                },
                api = {
                    addStatics: function (newStatics) {

                        $.extend(staticPlug, newStatics);
                        staticPlug[reference] = api;
                        return this;
                    },
                    addMethods: function (newMethods) {

                        $.extend(methods, newMethods);
                        return this;
                    }
                };

            api.addStatics(settings.statics).addMethods(settings.methods);
            $[namespace] = staticPlug;
            $.fn[namespace] = methodPlug;
            return 0;
        },
        module: function (namespace, options) {

            if (!$[namespace] || !$[namespace][reference]) {
                // 1: namespace not found
                // 2: namespace not a ModPlug plugin
                return !$[namespace] ? 1 : 2;
            }

            var defaults = {
                    statics: {},
                    methods: {}
                },
                settings = $.extend({}, defaults, options);

            $[namespace][reference].addStatics(settings.statics).addMethods(settings.methods);
            return 0;
        }
    };

}(jQuery));



(function ($, undefined) {
    "use strict";

    var defaults = {
            widthRatio: 0.5,
            heightRatio: 0.5,
            delay: 0,
            gap: 0,
            effect: "splash",
            effectOptions: undefined,
            callback: undefined
        },
        Event = function (offX, offY, element, posX, posY) {

            this.offset = {left: offX, top: offY};
            this.element = element;
            this.position = {left: posX, top: posY};
        },
        Twinkler = function () {

            var effects = {};

            this.add = function (effect) {

                if (!effects[effect.id]) {
                    effects[effect.id] = effect;
                }
                return this;
            };

            this.remove = function (effect) {

                if (effects[effect]) {
                    delete effects[effect];
                } else if (effect.id && effects[effect.id]) {
                    delete effects[effect.id];
                }
                return this;
            };

            this.twinkle = function (event, options) {

                var settings = $.extend({}, defaults, options),
                    effect = effects[settings.effect];

                if (effect) {
                    event.element = event.element || "body";
                    effect.run(event, settings.effectOptions, settings.callback);
                }
                return this;
            };

            this.twinkleAtElement = function (htmlElement, options) {

                var settings = $.extend({}, defaults, options),
                    $htmlElement = $(htmlElement),
                    offset = $htmlElement.offset(),
                    position = $htmlElement.position(),
                    width = $htmlElement.outerWidth(true),
                    height = $htmlElement.outerHeight(true),
                    offX = offset.left + width * settings.widthRatio,
                    offY = offset.top + height * settings.heightRatio,
                    posX = position.left + width * settings.widthRatio,
                    posY = position.top + height * settings.heightRatio;

                return this.twinkle(new Event(offX, offY, htmlElement, posX, posY), options);
            };

            this.twinkleAtElements = function (htmlElements, options) {

                var self = this,
                    settings = $.extend({}, defaults, options),
                    delay = settings.delay,
                    $htmlElements = $(htmlElements),
                    size = $htmlElements.size();

                $htmlElements.each(function (idx) {

                    var htmlElement = this,
                        opts = $.extend({}, options);

                    if (idx !== size - 1) {
                        delete opts.callback;
                    }

                    setTimeout(function () {
                        self.twinkleAtElement(htmlElement, opts);
                    }, delay);

                    delay += settings.gap;
                });
                return this;
            };
        },
        twinkler = new Twinkler(),
        plugin = {
            statics: {
                twinkle: function (element, left, top, options) {

                    twinkler.twinkle(new Event(0, 0, element, left, top), options);
                    return this;
                },
                add: function (effect) {

                    twinkler.add(effect);
                    return this;
                },
                remove: function (effect) {

                    twinkler.remove(effect);
                    return this;
                }
            },
            methods: {
                twinkle: function (options) {

                    twinkler.twinkleAtElements(this, options);
                    return this;
                }
            },
            defaultStatic: function () {

                return "twinkle";
            },
            defaultMethod: function () {

                return "twinkle";
            }
        };

    $.ModPlug.plugin("twinkle", plugin);

}(jQuery));

/*
 * jQuery.twinkle 0.3
 * CSS Effects
 * http://larsjung.de/twinkle
 *
 * provided under the terms of the MIT License
 */

(function ($, undefined) {
    "use strict";

    var blockEvents = function (event) {

            event.stopImmediatePropagation();
            event.preventDefault();
            return false;
        },
        animation = function (css, event, settings, callback) {

            var $dot = $("<div />").css(css).appendTo(event.element)
                            .bind("click dblclick mousedown mouseenter mouseover mousemove", blockEvents),
                cleanUp = function () {
                    $dot.remove();
                    if (callback instanceof Function) {
                        callback();
                    }
                },
                fadeOut = function () {
                    $dot.animate(
                        {
                            left: event.position.left - settings.radius,
                            top: event.position.top - settings.radius,
                            width: settings.radius * 2,
                            height: settings.radius * 2,
                            opacity: 0
                        },
                        settings.duration * 0.5,
                        "linear",
                        cleanUp
                    );
                },
                fadeIn = function () {
                    $dot.animate(
                        {
                            left: event.position.left - settings.radius * 0.5,
                            top: event.position.top - settings.radius * 0.5,
                            width: settings.radius,
                            height: settings.radius,
                            opacity: 1
                        },
                        settings.duration * 0.5,
                        "linear",
                        fadeOut
                    );
                };

            fadeIn();
        },
        splashDefaults = {
            color: "rgba(255,0,0,0.5)",
            radius: 300,
            duration: 1000
        },
        SplashEffect = function () {

            this.id = "splash-css";

            this.run = function (event, options, callback) {

                var settings = $.extend({}, splashDefaults, options),
                    css = {
                        position: "absolute",
                        zIndex: 1000,
                        display: "block",
                        borderRadius: settings.radius,
                        backgroundColor: settings.color,
                        boxShadow: "0 0 30px " + settings.color,
                        left: event.position.left,
                        top: event.position.top,
                        width: 0,
                        height: 0,
                        opacity: 0.4
                    };

                animation(css, event, settings, callback);
            };
        },
        dropsDefaults = {
            color: "rgba(255,0,0,0.5)",
            radius: 300,
            duration: 1000,
            width: 2,
            count: 3,
            delay: 300
        },
        DropsEffect = function () {

            this.id = "drops-css";

            this.run = function (event, options, callback) {

                var settings = $.extend({}, dropsDefaults, options),
                    css = {
                        position: "absolute",
                        zIndex: 1000,
                        display: "block",
                        borderRadius: settings.radius,
                        border: "" + settings.width + "px solid " + settings.color,
                        left: event.position.left,
                        top: event.position.top,
                        width: 0,
                        height: 0,
                        opacity: 0.4
                    },
                    setTimer = function (delay, callback) {
                        setTimeout(function () {
                            animation(css, event, settings, callback);
                        }, delay);
                    },
                    delay = 0,
                    i;

                for (i = 0; i < settings.count; i++) {
                    setTimer(delay, i === settings.count - 1 ? callback : undefined);
                    delay += settings.delay;
                }
            };
        },
        DropEffect = function () {

            var drops = new DropsEffect();

            this.id = "drop-css";

            this.run = function (event, options, callback) {

                drops.run(event, $.extend(options, { count: 1 }), callback);
            };
        };


    $.twinkle.add(new SplashEffect());
    $.twinkle.add(new DropEffect());
    $.twinkle.add(new DropsEffect());

}(jQuery));


/*
 * jQuery.twinkle 0.3
 * Canvas Effects
 * http://larsjung.de/twinkle
 *
 * provided under the terms of the MIT License
 */


(function (window, $, undefined) {

    var Twinkle = window.Twinkle = window.Twinkle || {},
        Path = function (ctx) {

            var context = ctx.getContext();

            context.beginPath();

            this.fill = function (fillStyle) {

                context.fillStyle = fillStyle;
                context.fill();
                return ctx;
            };

            this.stroke = function (lineWidth, strokeStyle) {

                context.lineWidth = lineWidth;
                context.strokeStyle = strokeStyle;
                context.stroke();
                return ctx;
            };

            this.draw = function (lineWidth, strokeStyle, fillStyle) {

                this.fill(fillStyle);
                this.stroke(lineWidth, strokeStyle);
                return ctx;
            };

            this.circle = function (x, y, radius) {

                context.arc(x, y, radius, 0, 2 * Math.PI, false);
                return this;
            };
        };


    Twinkle.Ctx = function (context) {

        if (!context || !context.canvas) {
            return undefined;
        } else if (!(this instanceof Twinkle.Ctx)) {
            return new Twinkle.Ctx(context);
        }

        var width = $(context.canvas).width(),
            height = $(context.canvas).height();

        this.getContext = function () {

            return context;
        };

        this.getWidth = function () {

            return width;
        };

        this.getHeight = function () {

            return height;
        };

        this.clear = function () {

            this.resetTransform();
            context.clearRect(0, 0, width, height);
            return this;
        };

        this.resetTransform = function () {

            context.setTransform(1, 0, 0, 1, 0, 0);
            return this;
        };

        this.translate = function (x, y) {

            context.translate(x, y);
            return this;
        };

        this.rotate = function (alpha) {

            context.rotate(Math.PI * alpha / 180);
            return this;
        };

        this.opacity = function (opacity) {

            context.globalAlpha = opacity;
            return this;
        };

        this.path = function () {

            return new Path(this);
        };
    };

}(window, jQuery));


(function (window, $, undefined) {

    var Twinkle = window.Twinkle = window.Twinkle || {};


    Twinkle.CanvasEffect = function (twinkleEvent, width, height, frame, callback) {

        if (!(this instanceof Twinkle.CanvasEffect)) {
            return new Twinkle.CanvasEffect(twinkleEvent, width, height, frame, callback);
        }

        var element = twinkleEvent.element,
            x = twinkleEvent.position.left,
            y = twinkleEvent.position.top,
            css = {
                position: "absolute",
                zIndex: 1000,
                display: "block",
                left: x - width * 0.5,
                top: y - height * 0.5,
                width: width,
                height: height
            };

        this.run = function (duration, fps) {

            var $canvas, ctx, i,
                frameCount = duration / 1000 * fps,
                delta = 1 / frameCount,
                setFrameTimer = function (fraction) {

                    setTimeout(function () {

                        if (ctx) {
                            frame({
                                ctx: ctx,
                                frac: fraction,
                                millis: duration * fraction
                            });
                        }
                    }, duration * fraction);
                },
                cleanUp = function () {

                    $canvas.remove();
                    $canvas = undefined;
                    ctx = undefined;
                    if (callback instanceof Function) {
                        callback();
                    }
                },
                blockEvents = function (event) {

                    event.stopImmediatePropagation();
                    event.preventDefault();
                    return false;
                };

            $canvas = $("<canvas />").attr("width", width).attr("height", height).css(css).appendTo(element);
            $canvas.bind("click dblclick mousedown mouseenter mouseover mousemove", blockEvents);
            ctx = new Twinkle.Ctx($canvas.get(0).getContext("2d"));

            for (i = 0; i <= frameCount; i++) {
                setFrameTimer(i * delta);
            }

            setTimeout(cleanUp, duration);
        };
    };

}(window, jQuery));


(function (window, $, undefined) {
    "use strict";

    var Twinkle = window.Twinkle = window.Twinkle || {};


    Twinkle.Interpolator = function (values) {

        var points,
            equiDist = function (values) {

                var dist = 1 / (values.length - 1),
                    points = [],
                    i;

                for (i = 0; i < values.length; i++) {
                    points.push({ x: dist * i , y: values[i] });
                }
                return points;
            },
            interpolate = function (p1, p2, x) {

                var m = (p2.y - p1.y) / (p2.x - p1.x),
                    y = p1.y + m * (x - p1.x);

                return y;
            },
            findSection = function (x) {

                for (var i = 0; i < points.length; i++) {

                    if (i === 0) {
                        continue;
                    }

                    var prev = points[i-1];
                    var current = points[i];
                    if (x >= prev.x && x <= current.x) {
                        return [ prev, current ];
                    }
                }
                return undefined;
            };

        points = equiDist(values);

        this.get = function (x) {

            var secPts;

            x = Math.max(0, Math.min(1, x));
            secPts = findSection(x);
            return interpolate(secPts[0], secPts[1], x);
        };

    };

    Twinkle.Interpolator.scale = function (x, scale, offset) {

        scale = scale || 1;
        offset = offset || 0;
        x = (x - offset) / scale;
        return x >= 0 && x <= 1 ? x : undefined;
    };

}(window, jQuery));


(function (window, $, undefined) {
    "use strict";

    var Twinkle = window.Twinkle = window.Twinkle || {},
        SplashEffect = function () {

            var defaults = {
                    color: "rgba(255,0,0,0.5)",
                    radius: 300,
                    duration: 1000
                };

            this.id = "splash";

            this.run = function (twinkleEvent, options, callback) {

                var settings = $.extend({}, defaults, options),
                    size = settings.radius * 2,
                    opacityIpl = new Twinkle.Interpolator([ 0.4, 1, 0 ]),
                    radiusIpl = new Twinkle.Interpolator([ 0, settings.radius ]),
                    frame = function (frameEvent) {

                        var radius = radiusIpl.get(frameEvent.frac),
                            opacity = opacityIpl.get(frameEvent.frac),
                            ctx = frameEvent.ctx;

                        ctx
                            .clear()
                            .opacity(opacity)
                            .path()
                            .circle(ctx.getWidth() * 0.5, ctx.getHeight() * 0.5, radius)
                            .fill(settings.color);
                    };

                new Twinkle.CanvasEffect(twinkleEvent, size, size, frame, callback).run(settings.duration, 25);
            };
        },
        DropEffect = function () {

            var defaults = {
                    color: "rgba(255,0,0,0.5)",
                    radius: 300,
                    duration: 1000,
                    width: 2
                };

            this.id = "drop";

            this.run = function (twinkleEvent, options, callback) {

                var settings = $.extend({}, defaults, options),
                    size = settings.radius * 2,
                    opacityIpl = new Twinkle.Interpolator([ 0.4, 1, 0 ]),
                    radiusIpl = new Twinkle.Interpolator([ 0, settings.radius ]),
                    frame = function (frameEvent) {

                        var radius = radiusIpl.get(frameEvent.frac),
                            opacity = opacityIpl.get(frameEvent.frac),
                            ctx = frameEvent.ctx;

                        ctx
                            .clear()
                            .opacity(opacity)
                            .path()
                            .circle(ctx.getWidth() * 0.5, ctx.getHeight() * 0.5, radius)
                            .stroke(settings.width, settings.color);
                    };

                new Twinkle.CanvasEffect(twinkleEvent, size, size, frame, callback).run(settings.duration, 25);
            };
        },
        DropsEffect = function () {

            var defaults = {
                    color: "rgba(255,0,0,0.5)",
                    radius: 300,
                    duration: 1000,
                    width: 2,
                    count: 3,
                    delay: 100
                };

            this.id = "drops";

            this.run = function (twinkleEvent, options, callback) {

                var settings = $.extend({}, defaults, options),
                    size = settings.radius * 2,
                    opacityIpl = new Twinkle.Interpolator([ 0.4, 1, 0 ]),
                    radiusIpl = new Twinkle.Interpolator([ 0, settings.radius ]),
                    scale = (settings.duration - (settings.count - 1) * settings.delay) / settings.duration,
                    offset = settings.delay / settings.duration,
                    frame = function (frameEvent) {

                        var i, frac, radius, opacity,
                            ctx = frameEvent.ctx,
                            width = ctx.getWidth(),
                            height = ctx.getHeight();

                        ctx.clear();
                        for (i = 0; i < settings.count; i++) {
                            frac = Twinkle.Interpolator.scale(frameEvent.frac, scale, offset * i);

                            if (frac !== undefined) {
                                radius = radiusIpl.get(frac);
                                opacity = opacityIpl.get(frac);
                                ctx
                                    .opacity(opacity)
                                    .path()
                                    .circle(width * 0.5, height * 0.5, radius)
                                    .stroke(settings.width, settings.color);
                            }
                        }
                    };

                new Twinkle.CanvasEffect(twinkleEvent, size, size, frame, callback).run(settings.duration, 25);
            };
        },
        PulseEffect = function () {

            var defaults = {
                    color: "rgba(255,0,0,0.5)",
                    radius: 100,
                    duration: 3000
                };

            this.id = "pulse";

            this.run = function (twinkleEvent, options, callback) {

                var settings = $.extend({}, defaults, options),
                    size = settings.radius * 2,
                    opacityIpl = new Twinkle.Interpolator([ 0, 1, 0.6, 1, 0.6, 1, 0 ]),
                    radiusIpl = new Twinkle.Interpolator([ 0, settings.radius, settings.radius * 0.6, settings.radius, settings.radius * 0.6, settings.radius, 0 ]),
                    frame = function (frameEvent) {

                        var radius = radiusIpl.get(frameEvent.frac),
                            opacity = opacityIpl.get(frameEvent.frac),
                            ctx = frameEvent.ctx;

                        ctx
                            .clear()
                            .opacity(opacity)
                            .path()
                            .circle(ctx.getWidth() * 0.5, ctx.getHeight() * 0.5, radius)
                            .fill(settings.color);
                    };

                new Twinkle.CanvasEffect(twinkleEvent, size, size, frame, callback).run(settings.duration, 25);
            };
        },
        OrbitEffect = function () {

            var defaults = {
                    color: "rgba(255,0,0,0.5)",
                    radius: 100,
                    duration: 3000,
                    satellites: 10,
                    satellitesRadius: 10,
                    circulations: 1.5
                };

            this.id = "orbit";

            this.run = function (twinkleEvent, options, callback) {

                var settings = $.extend({}, defaults, options),
                    size = settings.radius * 2,
                    opacityIpl = new Twinkle.Interpolator([ 0.4, 1, 1, 0.4 ]),
                    r = settings.radius - settings.satellitesRadius,
                    radiusIpl = new Twinkle.Interpolator([ 0, r, r, 0 ]),
                    frame = function (frameEvent) {

                        var radius = radiusIpl.get(frameEvent.frac),
                            opacity = opacityIpl.get(frameEvent.frac),
                            bog = Math.PI * 2 * settings.circulations * frameEvent.frac,
                            ctx = frameEvent.ctx,
                            path, i, x, y;

                        ctx
                            .clear()
                            .opacity(opacity)
                            .translate(ctx.getWidth() * 0.5, ctx.getHeight() * 0.5);

                        path = ctx.path();
                        for (i = 0; i < settings.satellites; i++) {

                            bog += Math.PI * 2 / settings.satellites;
                            x = Math.cos(bog) * radius;
                            y = Math.sin(bog) * radius;
                            path.circle(x, y, settings.satellitesRadius);
                        }
                        path.fill(settings.color);
                    };

                new Twinkle.CanvasEffect(twinkleEvent, size, size, frame, callback).run(settings.duration, 25);
            };
        };


    $.twinkle.add(new SplashEffect());
    $.twinkle.add(new DropEffect());
    $.twinkle.add(new DropsEffect());
    $.twinkle.add(new PulseEffect());
    $.twinkle.add(new OrbitEffect());

}(window, jQuery));


