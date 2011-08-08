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



/*
 * built in effects
 * wanted to keep it separate
 */

( function( $ ) {

	
	function animation( css, event, settings ) {

		var $dot = $( "<div />" ).css( css ).appendTo( $( event.element ) );

		var fadeIn = function() {
			$dot.animate(
				{
					"left": event.position.left - settings.radius * 0.5,
					"top": event.position.top - settings.radius * 0.5,
					"width": settings.radius,
					"height": settings.radius,
					"opacity": 1
				},
				settings.duration * 0.5,
				"linear",
				fadeOut
			);
		};
		var fadeOut = function () {
			$dot.animate(
				{
					"left": event.position.left - settings.radius,
					"top": event.position.top - settings.radius,
					"width": settings.radius * 2,
					"height": settings.radius * 2,
					"opacity": 0
				},
				settings.duration * 0.5,
				"linear",
				cleanUp
			);
		};
		var cleanUp = function () {
			$dot.remove();
		};

		fadeIn();
	};


	
	function splash( event, options ) {

		var defaults = {
			"color": "rgba(255,0,0,0.5)",
			"radius": 300,
			"duration": 1000
		};
		var settings = $.extend( {}, defaults, options );

		var css = {
		    "position": "absolute",
	    	"z-index": 1000,
	    	"display": "block",
	    	"border-radius": settings.radius,
	    	"background-color": settings.color,
	    	"box-shadow": "0 0 30px " + settings.color,
			"left": event.position.left,
			"top": event.position.top,
			"width": 0,
			"height": 0,
			"opacity": 0.4
		};

		animation( css, event, settings );
	};

	function drop( event, options ) {

		var defaults = {
			"color": "rgba(255,0,0,0.5)",
			"radius": 300,
			"duration": 1000,
			"width": 2
		};
		var settings = $.extend( {}, defaults, options );

		var css = {
		    "position": "absolute",
	    	"z-index": 1000,
	    	"display": "block",
	    	"border-radius": settings.radius,
	    	"border": "" + settings.width + "px solid " + settings.color,
			"left": event.position.left,
			"top": event.position.top,
			"width": 0,
			"height": 0,
			"opacity": 0.4
		};

		animation( css, event, settings );
	};

	function drops( event, options ) {

		var defaults = {
			"color": "rgba(255,0,0,0.5)",
			"radius": 300,
			"duration": 1000,
			"width": 2,
			"count": 3,
			"delay": 300
		};
		var settings = $.extend( {}, defaults, options );

		var delay = 0;
		for ( var i = 0; i < settings.count; i++ ) {
			setTimeout( function () {
				drop( event, settings );
			}, delay );
			delay += settings.delay;
		};
	};

	$.twinkle.add( { id: "splash", run: splash } );
	$.twinkle.add( { id: "drop", run: drop } );
	$.twinkle.add( { id: "drops", run: drops } );

} )( jQuery );


