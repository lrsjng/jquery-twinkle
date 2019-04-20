/*! jquery-twinkle v0.9.0 - https://larsjung.de/jquery-twinkle/ */
"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(function () {
  var WIN = window; // eslint-disable-line no-undef

  var JQ = WIN.jQuery;

  var is_fn = function is_fn(x) {
    return typeof x === 'function';
  };

  var DEFAULTS = {
    widthRatio: 0.5,
    heightRatio: 0.5,
    delay: 0,
    gap: 0,
    effect: 'splash',
    effectOptions: undefined,
    callback: undefined
  };

  function TwinkleEvent(offX, offY, el, posX, posY) {
    this.offset = {
      left: offX,
      top: offY
    };
    this.element = el;
    this.position = {
      left: posX,
      top: posY
    };
  }

  var Twinkler =
  /*#__PURE__*/
  function () {
    function Twinkler() {
      _classCallCheck(this, Twinkler);

      this.effects = {};
    }

    _createClass(Twinkler, [{
      key: "add",
      value: function add(effect) {
        if (!this.effects[effect.id]) {
          this.effects[effect.id] = effect;
        }
      }
    }, {
      key: "start",
      value: function start(ev, options) {
        var settings = _objectSpread({}, DEFAULTS, options);

        var effect = this.effects[settings.effect];

        if (effect) {
          ev.element = ev.element || 'body';
          effect.run(ev, settings.effectOptions, function () {
            if (is_fn(settings.callback)) {
              settings.callback();
            }
          });
        }
      }
    }, {
      key: "start_el",
      value: function start_el(el, options) {
        var settings = _objectSpread({}, DEFAULTS, options);

        var $el = JQ(el);
        var offset = $el.offset();
        var position = $el.position();
        var width = $el.outerWidth(true);
        var height = $el.outerHeight(true);
        var offX = offset.left + width * settings.widthRatio;
        var offY = offset.top + height * settings.heightRatio;
        var posX = position.left + width * settings.widthRatio;
        var posY = position.top + height * settings.heightRatio;
        return this.start(new TwinkleEvent(offX, offY, el, posX, posY), options);
      }
    }, {
      key: "start_els",
      value: function start_els(els, options) {
        var _this = this;

        var settings = _objectSpread({}, DEFAULTS, options);

        var delay = settings.delay;
        els = Array.from(els);
        var last = els.length - 1;
        els.forEach(function (el, idx) {
          var opts = _objectSpread({}, options);

          if (idx !== last) {
            opts.callback = null;
          }

          setTimeout(function () {
            return _this.start_el(el, opts);
          }, delay);
          delay += settings.gap;
        });
      }
    }]);

    return Twinkler;
  }();

  var twinkler = new Twinkler();

  JQ.twinkle = function (el, left, top, opts) {
    return twinkler.start(new TwinkleEvent(0, 0, el, left, top), opts);
  };

  JQ.twinkle.add = function (effect) {
    return twinkler.add(effect);
  };

  JQ.fn.twinkle = function main(options) {
    twinkler.start_els(this, options);
    return this;
  };
})();

(function () {
  /* CSS Effects */
  var JQ = window.jQuery; // eslint-disable-line no-undef

  var drop_ev = function drop_ev(event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    return false;
  };

  var animation = function animation(css, event, settings, callback) {
    var $dot;

    var clean_up = function clean_up() {
      $dot.remove();

      if (callback instanceof Function) {
        callback();
      }
    };

    var fade_out = function fade_out() {
      $dot.animate({
        left: event.position.left - settings.radius,
        top: event.position.top - settings.radius,
        width: settings.radius * 2,
        height: settings.radius * 2,
        opacity: 0
      }, settings.duration * 0.5, 'linear', clean_up);
    };

    var fade_in = function fade_in() {
      $dot = JQ('<div />').css(css).bind('click dblclick mousedown mouseenter mouseover mousemove', drop_ev);
      JQ(event.element).after($dot);
      $dot.animate({
        left: event.position.left - settings.radius * 0.5,
        top: event.position.top - settings.radius * 0.5,
        width: settings.radius,
        height: settings.radius,
        opacity: 1
      }, settings.duration * 0.5, 'linear', fade_out);
    };

    fade_in();
  };

  var SPLASH_DEFAULTS = {
    color: 'rgba(255,0,0,0.5)',
    radius: 300,
    duration: 1000
  };

  function SplashEffect() {
    this.id = 'splash-css';

    this.run = function run(event, options, callback) {
      var settings = _objectSpread({}, SPLASH_DEFAULTS, options);

      var css = {
        position: 'absolute',
        zIndex: 1000,
        display: 'block',
        borderRadius: settings.radius,
        backgroundColor: settings.color,
        boxShadow: '0 0 30px ' + settings.color,
        left: event.position.left,
        top: event.position.top,
        width: 0,
        height: 0,
        opacity: 0.4
      };
      animation(css, event, settings, callback);
    };
  }

  var DROPS_DEFAULTS = {
    color: 'rgba(255,0,0,0.5)',
    radius: 300,
    duration: 1000,
    width: 2,
    count: 3,
    delay: 300
  };

  function DropsEffect() {
    this.id = 'drops-css';

    this.run = function run(event, options, callback) {
      var settings = _objectSpread({}, DROPS_DEFAULTS, options);

      var css = {
        position: 'absolute',
        zIndex: 1000,
        display: 'block',
        borderRadius: settings.radius,
        border: settings.width + 'px solid ' + settings.color,
        left: event.position.left,
        top: event.position.top,
        width: 0,
        height: 0,
        opacity: 0.4
      };

      var set_timer = function set_timer(delay, cb) {
        setTimeout(function () {
          return animation(css, event, settings, cb);
        }, delay);
      };

      for (var i = 0, delay = 0; i < settings.count; i += 1) {
        set_timer(delay, i === settings.count - 1 ? callback : undefined);
        delay += settings.delay;
      }
    };
  }

  function DropEffect() {
    var drops = new DropsEffect();
    this.id = 'drop-css';

    this.run = function (event, options, callback) {
      drops.run(event, _objectSpread({}, options, {
        count: 1
      }), callback);
    };
  }

  JQ.twinkle.add(new SplashEffect());
  JQ.twinkle.add(new DropEffect());
  JQ.twinkle.add(new DropsEffect());
})();

(function () {
  /* Canvas Effects */
  var WIN = window; // eslint-disable-line no-undef

  var $ = WIN.jQuery; // eslint-disable-line no-unused-vars

  var JQ = WIN.jQuery; // eslint-disable-line no-unused-vars

  var Objects = {}; // eslint-disable-line no-unused-vars

  (function () {
    /* globals Objects */
    function Interpolator(values) {
      function equiDist(vals) {
        var dist = 1 / (vals.length - 1);
        var pts = [];

        for (var i = 0; i < vals.length; i += 1) {
          pts.push({
            x: dist * i,
            y: vals[i]
          });
        }

        return pts;
      }

      var points = equiDist(values);

      function interpolate(p1, p2, x) {
        var m = (p2.y - p1.y) / (p2.x - p1.x);
        var y = p1.y + m * (x - p1.x);
        return y;
      }

      function findSection(x) {
        for (var i = 1; i < points.length; i += 1) {
          var prev = points[i - 1];
          var current = points[i];

          if (x >= prev.x && x <= current.x) {
            return [prev, current];
          }
        }

        return undefined;
      }

      this.get = function (x) {
        x = Math.max(0, Math.min(1, x));
        var secPts = findSection(x);
        return interpolate(secPts[0], secPts[1], x);
      };
    }

    function scaleit(x, scale, offset) {
      scale = scale || 1;
      offset = offset || 0;
      x = (x - offset) / scale;
      return x >= 0 && x <= 1 ? x : undefined;
    }

    Objects.Interpolator = Interpolator;
    Objects.Interpolator.scale = scaleit;
  })();

  (function () {
    /* globals JQ Objects */
    function Path(ctx) {
      var self = this;
      var context = ctx.getContext();
      context.beginPath();

      self.fill = function (fillStyle) {
        context.fillStyle = fillStyle;
        context.fill();
        return ctx;
      };

      self.stroke = function (lineWidth, strokeStyle) {
        context.lineWidth = lineWidth;
        context.strokeStyle = strokeStyle;
        context.stroke();
        return ctx;
      };

      self.draw = function (lineWidth, strokeStyle, fillStyle) {
        self.fill(fillStyle);
        self.stroke(lineWidth, strokeStyle);
        return ctx;
      };

      self.circle = function (x, y, radius) {
        context.arc(x, y, radius, 0, 2 * Math.PI, false);
        return self;
      };
    }

    function Ctx(context) {
      if (!context || !context.canvas) {
        return undefined;
      }

      var self = this;
      var width = JQ(context.canvas).width();
      var height = JQ(context.canvas).height();

      self.getContext = function () {
        return context;
      };

      self.getWidth = function () {
        return width;
      };

      self.getHeight = function () {
        return height;
      };

      self.clear = function () {
        self.resetTransform();
        context.clearRect(0, 0, width, height);
        return self;
      };

      self.resetTransform = function () {
        context.setTransform(1, 0, 0, 1, 0, 0);
        return self;
      };

      self.translate = function (x, y) {
        context.translate(x, y);
        return self;
      };

      self.rotate = function (alpha) {
        context.rotate(Math.PI * alpha / 180);
        return self;
      };

      self.opacity = function (opacity) {
        context.globalAlpha = opacity;
        return self;
      };

      self.path = function () {
        return new Path(self);
      };
    }

    Objects.Ctx = Ctx;
  })();

  (function () {
    /* globals JQ Objects */
    function CanvasEffect(twinkleEvent, width, height, frame, callback) {
      if (!(this instanceof Objects.CanvasEffect)) {
        return new Objects.CanvasEffect(twinkleEvent, width, height, frame, callback);
      }

      var element = twinkleEvent.element;
      var x = twinkleEvent.position.left;
      var y = twinkleEvent.position.top;
      var css = {
        position: 'absolute',
        zIndex: 1000,
        display: 'block',
        left: x - width * 0.5,
        top: y - height * 0.5,
        width: width,
        height: height
      };

      this.run = function (duration, fps) {
        var $canvas;
        var ctx;
        var i;
        var frameCount = duration / 1000 * fps;
        var delta = 1 / frameCount;

        function setFrameTimer(fraction) {
          setTimeout(function () {
            if (ctx) {
              frame({
                ctx: ctx,
                frac: fraction,
                millis: duration * fraction
              });
            }
          }, duration * fraction);
        }

        function cleanUp() {
          $canvas.remove();
          $canvas = undefined;
          ctx = undefined;

          if (callback instanceof Function) {
            callback();
          }
        }

        function blockEvents(event) {
          event.stopImmediatePropagation();
          event.preventDefault();
          return false;
        }

        $canvas = JQ('<canvas />').attr('width', width).attr('height', height).css(css);
        JQ(element).after($canvas);
        $canvas.bind('click dblclick mousedown mouseenter mouseover mousemove', blockEvents);
        ctx = new Objects.Ctx($canvas.get(0).getContext('2d'));

        for (i = 0; i <= frameCount; i += 1) {
          setFrameTimer(i * delta);
        }

        setTimeout(cleanUp, duration);
      };
    }

    Objects.CanvasEffect = CanvasEffect;
  })();

  (function () {
    /* globals JQ Objects */
    var DEFAULTS = {
      color: 'rgba(255,0,0,0.5)',
      radius: 300,
      duration: 1000
    };

    function SplashEffect() {
      this.id = 'splash';

      this.run = function (twinkleEvent, options, callback) {
        var settings = _objectSpread({}, DEFAULTS, options);

        var size = settings.radius * 2;
        var opacityIpl = new Objects.Interpolator([0.4, 1, 0]);
        var radiusIpl = new Objects.Interpolator([0, settings.radius]);

        var frame = function frame(ev) {
          var radius = radiusIpl.get(ev.frac);
          var opacity = opacityIpl.get(ev.frac);
          var ctx = ev.ctx;
          ctx.clear().opacity(opacity).path().circle(ctx.getWidth() * 0.5, ctx.getHeight() * 0.5, radius).fill(settings.color);
        };

        new Objects.CanvasEffect(twinkleEvent, size, size, frame, callback).run(settings.duration, 25);
      };
    }

    JQ.twinkle.add(new SplashEffect());
  })();

  (function () {
    /* globals JQ Objects */
    var DEFAULTS = {
      color: 'rgba(255,0,0,0.5)',
      radius: 300,
      duration: 1000,
      width: 2
    };

    function DropEffect() {
      this.id = 'drop';

      this.run = function (twinkleEvent, options, callback) {
        var settings = _objectSpread({}, DEFAULTS, options);

        var size = settings.radius * 2;
        var opa_ipl = new Objects.Interpolator([0.4, 1, 0]);
        var radius_ipl = new Objects.Interpolator([0, settings.radius]);

        var frame = function frame(ev) {
          var radius = radius_ipl.get(ev.frac);
          var opacity = opa_ipl.get(ev.frac);
          var ctx = ev.ctx;
          ctx.clear().opacity(opacity).path().circle(ctx.getWidth() * 0.5, ctx.getHeight() * 0.5, radius).stroke(settings.width, settings.color);
        };

        new Objects.CanvasEffect(twinkleEvent, size, size, frame, callback).run(settings.duration, 25);
      };
    }

    JQ.twinkle.add(new DropEffect());
  })();

  (function () {
    /* globals JQ Objects */
    var DEFAULTS = {
      color: 'rgba(255,0,0,0.5)',
      radius: 300,
      duration: 1000,
      width: 2,
      count: 3,
      delay: 100
    };

    function DropsEffect() {
      this.id = 'drops';

      this.run = function (twinkleEvent, options, callback) {
        var settings = _objectSpread({}, DEFAULTS, options);

        var size = settings.radius * 2;
        var opa_ipl = new Objects.Interpolator([0.4, 1, 0]);
        var radius_ipl = new Objects.Interpolator([0, settings.radius]);
        var scale = (settings.duration - (settings.count - 1) * settings.delay) / settings.duration;
        var offset = settings.delay / settings.duration;

        var frame = function frame(ev) {
          var i;
          var frac;
          var radius;
          var opacity;
          var ctx = ev.ctx;
          var width = ctx.getWidth();
          var height = ctx.getHeight();
          ctx.clear();

          for (i = 0; i < settings.count; i += 1) {
            frac = Objects.Interpolator.scale(ev.frac, scale, offset * i);

            if (frac !== undefined) {
              radius = radius_ipl.get(frac);
              opacity = opa_ipl.get(frac);
              ctx.opacity(opacity).path().circle(width * 0.5, height * 0.5, radius).stroke(settings.width, settings.color);
            }
          }
        };

        new Objects.CanvasEffect(twinkleEvent, size, size, frame, callback).run(settings.duration, 25);
      };
    }

    JQ.twinkle.add(new DropsEffect());
  })();

  (function () {
    /* globals JQ Objects */
    var DEFAULTS = {
      color: 'rgba(255,0,0,0.5)',
      radius: 100,
      duration: 3000
    };

    function PulseEffect() {
      this.id = 'pulse';

      this.run = function (twinkleEvent, options, callback) {
        var settings = _objectSpread({}, DEFAULTS, options);

        var size = settings.radius * 2;
        var opacityIpl = new Objects.Interpolator([0, 1, 0.6, 1, 0.6, 1, 0]);
        var radiusIpl = new Objects.Interpolator([0, settings.radius, settings.radius * 0.6, settings.radius, settings.radius * 0.6, settings.radius, 0]);

        var frame = function frame(ev) {
          var radius = radiusIpl.get(ev.frac);
          var opacity = opacityIpl.get(ev.frac);
          var ctx = ev.ctx;
          ctx.clear().opacity(opacity).path().circle(ctx.getWidth() * 0.5, ctx.getHeight() * 0.5, radius).fill(settings.color);
        };

        new Objects.CanvasEffect(twinkleEvent, size, size, frame, callback).run(settings.duration, 25);
      };
    }

    JQ.twinkle.add(new PulseEffect());
  })();

  (function () {
    /* globals JQ Objects */
    var DEFAULTS = {
      color: 'rgba(255,0,0,0.5)',
      radius: 100,
      duration: 3000,
      satellites: 10,
      satellitesRadius: 10,
      circulations: 1.5
    };

    function OrbitEffect() {
      this.id = 'orbit';

      this.run = function (twinkleEvent, options, callback) {
        var settings = _objectSpread({}, DEFAULTS, options);

        var size = settings.radius * 2;
        var opa_ipl = new Objects.Interpolator([0.4, 1, 1, 0.4]);
        var r = settings.radius - settings.satellitesRadius;
        var radius_ipl = new Objects.Interpolator([0, r, r, 0]);

        function frame(frameEvent) {
          var radius = radius_ipl.get(frameEvent.frac);
          var opacity = opa_ipl.get(frameEvent.frac);
          var bog = Math.PI * 2 * settings.circulations * frameEvent.frac;
          var ctx = frameEvent.ctx;
          var i;
          var x;
          var y;
          ctx.clear().opacity(opacity).translate(ctx.getWidth() * 0.5, ctx.getHeight() * 0.5);
          var path = ctx.path();

          for (i = 0; i < settings.satellites; i += 1) {
            bog += Math.PI * 2 / settings.satellites;
            x = Math.cos(bog) * radius;
            y = Math.sin(bog) * radius;
            ctx.getContext().moveTo(x, y);
            path.circle(x, y, settings.satellitesRadius);
          }

          path.fill(settings.color);
        }

        new Objects.CanvasEffect(twinkleEvent, size, size, frame, callback).run(settings.duration, 25);
      };
    }

    JQ.twinkle.add(new OrbitEffect());
  })();
})();