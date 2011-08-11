/*
 * %BUILD_NAME% %BUILD_VERSION%
 * CSS Effects
 * http://larsjung.de/twinkle
 * 
 * provided under the terms of the MIT License
 */

( function( $ ) {

	
	function animation( css, event, settings ) {

		var $dot = $( "<div />" ).css( css ).appendTo( event.element );

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

	
	var SplashEffect = function () {

		var defaults = {
			"color": "rgba(255,0,0,0.5)",
			"radius": 300,
			"duration": 1000
		};

		this.id = "splash-css";

		this.run = function ( event, options ) {
	
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
	};


	var DropEffect = function () {

		var drops = new DropsEffect();

		this.id = "drop-css";

		this.run = function ( event, options ) {
	
			drops.run( event, $.extend( options, { count: 1 } ) );
		};
	};


	var DropsEffect = function () {

		var defaults = {
			"color": "rgba(255,0,0,0.5)",
			"radius": 300,
			"duration": 1000,
			"width": 2,
			"count": 3,
			"delay": 300
		};

		this.id = "drops-css";

		this.run = function ( event, options ) {
	
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

			var delay = 0;
			for ( var i = 0; i < settings.count; i++ ) {
				setTimeout( function () {
					animation( css, event, settings );
				}, delay );
				delay += settings.delay;
			};
		};
	};


	$.twinkle.add( new SplashEffect() );
	$.twinkle.add( new DropEffect() );
	$.twinkle.add( new DropsEffect() );


} )( jQuery );

