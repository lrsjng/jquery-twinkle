/*
 * jQuery.twinkle 0.2
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
 * jQuery.twinkle 0.2
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


/*
 * jQuery.twinkle 0.2
 * Canvas Effects
 * http://larsjung.de/twinkle
 * 
 * provided under the terms of the MIT License
 */

( function( $ ) {


	var Interpolator = function ( values ) {

		var equiDist = function( values ) {

			var dist = 1 / ( values.length - 1 );
			var points = [];
			for ( var i = 0; i < values.length; i++ ) {
				points.push( { x: dist * i , y: values[i] } );
			};
			return points;
		};

		var interpolate = function ( p1, p2, x ) {
			
			var m = ( p2.y - p1.y ) / ( p2.x - p1.x );
			var y = p1.y + m * ( x - p1.x );
			return y;
		};
		
		var findSection = function ( x ) {
			
			for ( var i = 0; i < points.length; i++ ) {
				
				if ( i === 0 ) {
					continue;
				};
				
				var prev = points[i-1];
				var current = points[i];
				if ( x >= prev.x && x <= current.x ) {
					return [ prev, current ];
				};
			};
			return undefined;
		};

		var points = equiDist( values );
		
		this.get = function ( x ) {

			x = Math.max( 0, Math.min( 1, x ) );
			var secPts = findSection( x );
			return interpolate( secPts[0], secPts[1], x );
		};
	
	};
	Interpolator.scale = function ( x, scale, offset ) {
		
		scale = scale || 1;
		offset = offset || 0;
		x = ( x - offset ) / scale;
		return x >= 0 && x <= 1 ? x : undefined;
	};


	var FrameEvent = function ( ctx, frac, millis ) {

		this.ctx = ctx;
		this.frac = frac;
		this.millis = millis;
	};


	var CanvasEffect = function ( twinkleEvent, width, height, frame ) {

		this.element = twinkleEvent.element;
		this.x = twinkleEvent.position.left;
		this.y = twinkleEvent.position.top;
		this.width = width;
		this.height = height;
		this.frame = frame;
		this.$canvas = undefined;
		this.ctx = undefined;

		this.init = function () {
			
			var css = {
				"position": "absolute",
				"z-index": 1000,
				"display": "block",
				"left": this.x - this.width * 0.5,
				"top": this.y - this.height * 0.5,
				"width": this.width,
				"height": this.height
			};

			this.$canvas = $( "<canvas width='" + this.width + "' height='" + this.height + "' />" ).css( css ).appendTo( this.element );
			this.ctx = new Ctx( this.$canvas.get( 0 ).getContext( "2d" ) );
		};

		this.destroy = function () {

			this.$canvas.remove();
			this.$canvas = undefined;
			this.ctx = undefined;
		};

		this.run = function ( duration, fps ) {

			this.init();

			var THIS = this;
			var frameCount = duration / 1000 * fps;
			var delta = 1 / frameCount;
			for ( var i = 0; i < frameCount + 1; i++ ) {
				( function ( frac ) {
					setTimeout( function () {
						if ( THIS.ctx ) {
							THIS.frame( new FrameEvent( THIS.ctx, frac, duration * frac ) );
						};
					}, duration * frac );
				} )( i * delta );
			};

			setTimeout( $.proxy( this.destroy, this ), duration );
		};

	};

	
	var Path = function ( ctx ) {

		var context = ctx.context;
		context.beginPath();

		this.circle = function ( x, y, radius ) {
			
			context.arc( x, y, radius, 0, 2 * Math.PI, false );
			return this;
		};

		this.stroke = function ( strokeWidth, strokeStyle ) {

			context.lineWidth = strokeWidth;
			context.strokeStyle = strokeStyle;
			context.stroke();
			return ctx;
		};
		
		this.fill = function ( fillStyle ) {

			context.fillStyle = fillStyle;
			context.fill();
			return ctx;
		};
		
		this.draw = function ( strokeWidth, strokeStyle, fillStyle ) {

			this.stroke( strokeWidth, strokeStyle );
			this.fill( fillStyle );
			return ctx;
		};
	};


	var Ctx = function ( context ) {
		
		this.context = context;
		this.width = $( context.canvas ).width();
		this.height = $( context.canvas ).height();
		
		this.clear = function () {

			this.resetTransform();
			this.context.clearRect( 0, 0, this.width, this.height );
			return this;
		};

		this.resetTransform = function () {
			
			this.context.setTransform( 1, 0, 0, 1, 0, 0 );
			return this;
		};
		
		this.translate = function ( x, y ) {

			this.context.translate( x, y );
			return this;
		};

		this.rotate = function ( alpha ) {
			
			this.context.rotate( Math.PI * alpha / 180 );
			return this;
		};

		this.opacity = function ( opacity ) {
			
			this.context.globalAlpha = opacity;			
			return this;
		};

		this.path = function () {
			
			return new Path( this );
		};
	};



	var SplashEffect = function () {

		var defaults = {
			"color": "rgba(255,0,0,0.5)",
			"radius": 300,
			"duration": 1000
		};

		this.id = "splash";

		this.run = function ( twinkleEvent, options ) {

			var settings = $.extend( {}, defaults, options );
			var size = settings.radius * 2;
			var opacityIpl = new Interpolator( [ 0.4, 1, 0 ] );
			var radiusIpl = new Interpolator( [ 0, settings.radius ] );
			var frame = function ( frameEvent ) {
				
				var radius = radiusIpl.get( frameEvent.frac );
				var opacity = opacityIpl.get( frameEvent.frac );
				
				this.ctx
					.clear()
					.opacity( opacity )
					.path()
					.circle( this.width * 0.5, this.height * 0.5, radius )
					.fill( settings.color );
			};
			
			new CanvasEffect( twinkleEvent, size, size, frame ).run( settings.duration, 25 );
		};
	};

	$.twinkle.add( new SplashEffect() );



	var DropEffect = function () {

		var defaults = {
			"color": "rgba(255,0,0,0.5)",
			"radius": 300,
			"duration": 1000,
			"width": 2
		};

		this.id = "drop";

		this.run = function ( twinkleEvent, options ) {

			var settings = $.extend( {}, defaults, options );
			var size = settings.radius * 2;
			var opacityIpl = new Interpolator( [ 0.4, 1, 0 ] );
			var radiusIpl = new Interpolator( [ 0, settings.radius ] );
			var frame = function ( frameEvent ) {
				
				var radius = radiusIpl.get( frameEvent.frac );
				var opacity = opacityIpl.get( frameEvent.frac );

				this.ctx
					.clear()
					.opacity( opacity )
					.path()
					.circle( this.width * 0.5, this.height * 0.5, radius )
					.stroke( settings.width, settings.color );
			};
			
			new CanvasEffect( twinkleEvent, size, size, frame ).run( settings.duration, 25 );
		};
	};

	$.twinkle.add( new DropEffect() );



	var DropsEffect = function () {

		var defaults = {
			"color": "rgba(255,0,0,0.5)",
			"radius": 300,
			"duration": 1000,
			"width": 2,
			"count": 3,
			"delay": 100
		};

		this.id = "drops";

		this.run = function ( twinkleEvent, options ) {

			var settings = $.extend( {}, defaults, options );
			var size = settings.radius * 2;
			var opacityIpl = new Interpolator( [ 0.4, 1, 0 ] );
			var radiusIpl = new Interpolator( [ 0, settings.radius ] );
			var scale = ( settings.duration - ( settings.count - 1 ) * settings.delay ) / settings.duration;
			var offset = settings.delay / settings.duration;
			
			var frame = function ( frameEvent ) {
				
				this.ctx.clear();
				for ( var i = 0; i < settings.count; i++ ) {
					var frac = Interpolator.scale( frameEvent.frac, scale, offset * i );

					if ( frac !== undefined ) {
						var radius = radiusIpl.get( frac );
						var opacity = opacityIpl.get( frac );
						this.ctx
							.opacity( opacity )
							.path()
							.circle( this.width * 0.5, this.height * 0.5, radius )
							.stroke( settings.width, settings.color );
					};
				};
			};
			
			new CanvasEffect( twinkleEvent, size, size, frame ).run( settings.duration, 25 );
		};
	};

	$.twinkle.add( new DropsEffect() );



	var PulseEffect = function () {

		var defaults = {
			"color": "rgba(255,0,0,0.5)",
			"radius": 100,
			"duration": 3000
		};

		this.id = "pulse";

		this.run = function ( twinkleEvent, options ) {
	
			var settings = $.extend( {}, defaults, options );
			var size = settings.radius * 2;
			var opacityIpl = new Interpolator( [ 0, 1, 0.6, 1, 0.6, 1, 0 ] );
			var radiusIpl = new Interpolator( [ 0, settings.radius, settings.radius * 0.6, settings.radius, settings.radius * 0.6, settings.radius, 0 ] );
			var frame = function ( frameEvent ) {
				
				var x = this.width * 0.5;
				var y = this.height * 0.5;
				var radius = radiusIpl.get( frameEvent.frac );
				var opacity = opacityIpl.get( frameEvent.frac );
	
				this.ctx
					.clear()
					.opacity( opacity )
					.path()
					.circle( this.width * 0.5, this.height * 0.5, radius )
					.fill( settings.color );
			};
	
			new CanvasEffect( twinkleEvent, size, size, frame ).run( settings.duration, 25 );
		};
	};

	$.twinkle.add( new PulseEffect() );



	var OrbitEffect = function () {

		var defaults = {
			"color": "rgba(255,0,0,0.5)",
			"radius": 100,
			"duration": 3000,
			"satellites": 10,
			"satellitesRadius": 10,
			"circulations": 1.5
		};

		this.id = "orbit";

		this.run = function ( twinkleEvent, options ) {
	
			var settings = $.extend( {}, defaults, options );
			var size = settings.radius * 2;
			var opacityIpl = new Interpolator( [ 0.4, 1, 1, 0.4 ] );
			var r = settings.radius - settings.satellitesRadius;
			var radiusIpl = new Interpolator( [ 0, r, r, 0 ] );
			var frame = function ( frameEvent ) {
				
				var radius = radiusIpl.get( frameEvent.frac );
				var opacity = opacityIpl.get( frameEvent.frac );
				var bog = Math.PI * 2 * settings.circulations * frameEvent.frac;
	
				this.ctx
					.clear()
					.opacity( opacity )
					.translate( this.width * 0.5, this.height * 0.5 );
				
				var path = this.ctx.path();
				for ( var i = 0; i < settings.satellites; i++ ) {

					bog += Math.PI * 2 / settings.satellites;
					var x = Math.cos( bog ) * radius;
					var y = Math.sin( bog ) * radius;
					path.circle( x, y, settings.satellitesRadius );
				};
				path.fill( settings.color );
			};
	
			new CanvasEffect( twinkleEvent, size, size, frame ).run( settings.duration, 25 );
		};
	};

	$.twinkle.add( new OrbitEffect() );



} )( jQuery );




