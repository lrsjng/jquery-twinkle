/*
 * %BUILD_NAME% %BUILD_VERSION%
 * http://larsjung.de/twinkle
 * 
 * provided under the terms of the MIT License
 */

( function( $ ) {


	var TwinkleEvent = function ( offX, offY, element, posX, posY ) {

		this.offset = { "left": offX, "top": offY };
		this.element = element;
		this.position = { "left": posX, "top": posY };
	};


	var Twinkler = function () {

		this.defaults = {
			"widthRatio": 0.5,
			"heightRatio": 0.5,
			"delay": 0,
			"gap": 0,
			"effect": "splash",
			"effectOptions": undefined 
		};
		this.effects = {};


		this.twinkle = function ( event, options ) {

			var settings = $.extend( {}, this.defaults, options );

			var effect = this.effects[settings.effect];
			if ( effect !== undefined ) {
				event.element = event.element || "body";
				effect.run( event, settings.effectOptions );
			};
		};


		this.twinkleAtElement = function ( htmlElement, options ) {

			var settings = $.extend( {}, this.defaults, options );
			
			var $ele = $( htmlElement );
			
			var off = $ele.offset();
			var offX = off.left + $ele.outerWidth( true ) * settings.widthRatio;
			var offY = off.top + $ele.outerHeight( true ) * settings.heightRatio;

			var pos = $ele.position();
			var posX = pos.left + $ele.outerWidth( true ) * settings.widthRatio;
			var posY = pos.top + $ele.outerHeight( true ) * settings.heightRatio;

			var event = new TwinkleEvent( offX, offY, htmlElement, posX, posY );

			this.twinkle( event, options );
		};

		
		this.twinkleAtElements = function ( htmlElements, options ) {

			var THIS = this;
			var settings = $.extend( {}, this.defaults, options );

			var delay = settings.delay;
			$( htmlElements ).each( function () {
				var htmlElement = this;
				setTimeout( function () {
					THIS.twinkleAtElement( htmlElement, options );
				}, delay );
				delay += settings.gap;
			} );
		};
	};
	


	var twinkler = new Twinkler();
	var namespace = "twinkle";


	var globals = {

		twinkle: function ( element, left, top, options ) {

			var event = new TwinkleEvent( 0, 0, element, left, top );
			twinkler.twinkle( event, options );
			return globals;
		},

		add: function ( effect ) {
			
			if ( twinkler.effects[effect.id] === undefined ) {
				twinkler.effects[effect.id] = effect;
			};
			return globals;
		},

		remove: function ( effect ) {
			
			if ( twinkler.effects[effect.id] !== undefined ) {
				delete twinkler.effects[effect.id];
			};
			return globals;
		}
	};


	var methods = {

		twinkle: function ( options ) {
			
			twinkler.twinkleAtElements( this, options );
			return this;
		}
	};


	$[namespace] = globals;
	$.fn[namespace] = function( method ) {

		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ) );
		} else if ( method === undefined || method instanceof Object ) {
			return methods.twinkle.apply( this, arguments );
		} else {
			$.error( "Method " +  method + " does not exist on jQuery." + namespace );
		};
	};


} )( jQuery );


// @include "css-effects.js"
// @include "canvas-effects.js"

