/*!
{{pkg.displayName}} {{pkg.version}}
{{pkg.url}}
MIT License
*/

(function ($) {
	'use strict';

	// @include "lib/modplug-1.0.js"

	var defaults = {
			widthRatio: 0.5,
			heightRatio: 0.5,
			delay: 0,
			gap: 0,
			effect: 'splash',
			effectOptions: undefined,
			callback: function(){}
		},
		stopDefaults = {
			id: undefined,
			effectOptions: undefined,
			callback: function(){}
		},
		TwinkleEvent = function (offX, offY, element, posX, posY) {

			this.offset = {left: offX, top: offY};
			this.element = element;
			this.position = {left: posX, top: posY};
		},
		StopEvent = function (element) {

			this.element = element;
		},
		Twinkler = function () {

			var effects = {},
				running = {}, // element => {id: handle}
				effectStarted = function (element, id, handle) {

				},
				effectStopped = function (element, id) {

				};

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
					event.element = event.element || 'body';
					effect.run(event, settings.effectOptions, function () {
						settings.callback();
					});
				}
				return this;
			};

			this.stop = function (event, options) {

				var settings = $.extend({}, stopDefaults, options),
					effect = effects[settings.effect];

				if (effect) {
					event.element = event.element || 'body';
					effect.stop(event, settings.effectOptions, settings.callback);
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

				return this.twinkle(new TwinkleEvent(offX, offY, htmlElement, posX, posY), options);
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

			this.stopAtElement = function (htmlElement, options) {

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

				return this.twinkle(new TwinkleEvent(offX, offY, htmlElement, posX, posY), options);
			};

			this.stopAtElements = function (htmlElements, options) {

				var self = this,
					settings = $.extend({}, stopDefaults, options),
					delay = settings.delay,
					$htmlElements = $(htmlElements),
					size = $htmlElements.size();

				$htmlElements.each(function (idx) {

					var htmlElement = this,
						opts = $.extend({}, options);

					if (idx !== size - 1) {
						delete opts.callback;
					}

					self.stopAtElement(htmlElement, opts);
				});
				return this;
			};
		},
		twinkler = new Twinkler();

	modplug('twinkle', {
		statics: {
			twinkle: function (element, left, top, options) {

				twinkler.twinkle(new TwinkleEvent(0, 0, element, left, top), options);
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
			},
			stop: function (options) {

				twinkler.stopAtElements(this, options);
				return this;
			}
		},
		defaultStatic: 'twinkle',
		defaultMethod: 'twinkle'
	});

}(jQuery));

// @include "inc/css-effects.js"
// @include "inc/canvas-effects.js"
