/*
 * ModPlug 0.6
 * http://larsjung.de/modplug
 *
 * provided under the terms of the MIT License
 */
/*globals jQuery */
(function ($) {
    "use strict";

    var reference = "_ModPlug_0.6_API",
        slice = Array.prototype.slice,
        isFn = function (fn) {
            return fn instanceof Function;
        },
        defaults = {
            statics: {},
            methods: {},
            defaultStatic: undefined,
            defaultMethod: undefined
        },
        ModPlug = {
            /*
             * return code
             *   0: ok
             *   1: no namespace specified
             *   2: static namespace not available
             *   3: namespace not available
             */
            plugin: function (namespace, options) {

                if (!namespace || $[namespace] || $.fn[namespace]) {
                    return !namespace ? 1 : ($[namespace] ? 2 : 3);
                }

                var settings = $.extend({}, defaults, options),
                    staticPlug = function () {

                        var args, defaultMethod;

                        args = slice.call(arguments);
                        defaultMethod = isFn(settings.defaultStatic) ? settings.defaultStatic.apply(this, args) : settings.defaultStatic;
                        if (isFn(staticPlug[defaultMethod])) {
                            return staticPlug[defaultMethod].apply(this, args);
                        }
                        $.error("Static method defaulted to '" + defaultMethod + "' does not exist on 'jQuery." + namespace + "'");
                    },
                    methods = {},
                    methodPlug = function (method) {

                        var args, defaultMethod;

                        if (isFn(methods[method])) {
                            args = slice.call(arguments, 1);
                            return methods[method].apply(this, args);
                        }

                        args = slice.call(arguments);
                        defaultMethod = isFn(settings.defaultMethod) ? settings.defaultMethod.apply(this, args) : settings.defaultMethod;
                        if (isFn(methods[defaultMethod])) {
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
            /*
             * return code
             *   0: ok
             *   1: namespace not found
             *   2: namespace not a ModPlug plugin
             */
            module: function (namespace, options) {

                if (!$[namespace] || !$[namespace][reference]) {
                    return !$[namespace] ? 1 : 2;
                }

                var settings = $.extend({}, defaults, options);

                $[namespace][reference].addStatics(settings.statics).addMethods(settings.methods);
                return 0;
            }
        };

    $.ModPlug = ModPlug;

}(jQuery));
