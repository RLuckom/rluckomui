(function() {
  var SVGTreeNode, exports, module, registerGlobal,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  exports = exports != null ? exports : this;

  registerGlobal = function(uniqueName, objectToRegister) {
    if (objectToRegister == null) {
      objectToRegister = module;
    }
    exports[uniqueName] = objectToRegister;
    return window[uniqueName] = objectToRegister;
  };

  module = {};

  registerGlobal('DOGWOOD', module);

  SVGTreeNode = (function() {
    SVGTreeNode.prototype.svgElement = function(tag, attributes) {
      var attr, el, value;
      if (attributes == null) {
        attributes = {};
      }
      el = document.createElementNS("http://www.w3.org/2000/svg", tag);
      if (attributes.version == null) {
        attributes.version = "1.1";
      }
      if (attributes.xmlns == null) {
        attributes.xmlns = "http://www.w3.org/2000/svg";
      }
      for (attr in attributes) {
        value = attributes[attr];
        el.setAttribute(attr, value);
      }
      return el;
    };

    SVGTreeNode.prototype.interpolation = function(fromValues, toValues) {
      var diff, diffs, i, t;
      if (isNaN(fromValues) && isNaN(toValues)) {
        diffs = (function() {
          var _i, _len, _results;
          _results = [];
          for (i = _i = 0, _len = toValues.length; _i < _len; i = ++_i) {
            t = toValues[i];
            _results.push(t - fromValues[i]);
          }
          return _results;
        })();
        return function(percent) {
          var f, _i, _len, _results;
          _results = [];
          for (i = _i = 0, _len = fromValues.length; _i < _len; i = ++_i) {
            f = fromValues[i];
            _results.push(f + diffs[i] * percent);
          }
          return _results;
        };
      } else {
        diff = toValues - fromValues;
        return function(percent) {
          return fromValues + diff * percent;
        };
      }
    };

    SVGTreeNode.prototype.transition = function(el, attr, fromValues, toValues, formatter) {
      var interpolator;
      interpolator = this.interpolation(fromValues, toValues);
      return function(percent) {
        return el.setAttribute(attr, formatter(interpolator(percent)));
      };
    };

    SVGTreeNode.prototype.animation = function(el, attr, from, to, step, duration, formatter, callback) {
      var f, startTime, transition;
      transition = this.transition(el, attr, from, to, formatter);
      startTime = null;
      f = function() {
        var dT;
        if (startTime == null) {
          startTime = new Date().getTime();
        }
        dT = new Date().getTime() - startTime;
        if (dT >= duration) {
          transition(1);
          if (callback != null) {
            return callback();
          }
        } else {
          transition(dT / duration);
          return window.setTimeout(f, step);
        }
      };
      return f;
    };

    SVGTreeNode.prototype.animateElement = function(spec, parentElement, callback) {
      var duration, formatter, from, to, x, _ref;
      if (callback == null) {
        callback = null;
      }
      duration = this.animateDuration;
      if ((_ref = spec.attributeName) === 'y' || _ref === 'cy') {
        formatter = function(x) {
          return "" + x + "px";
        };
        this.animation(parentElement, spec.attributeName, spec.from, spec.to, 20, duration, formatter, callback)();
      }
      if (spec.attributeName === 'points') {
        from = (function() {
          var _i, _len, _ref1, _results;
          _ref1 = spec.from.split(' ');
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            x = _ref1[_i];
            _results.push(parseInt(x));
          }
          return _results;
        })();
        to = (function() {
          var _i, _len, _ref1, _results;
          _ref1 = spec.to.split(' ');
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            x = _ref1[_i];
            _results.push(parseInt(x));
          }
          return _results;
        })();
        formatter = function(x) {
          return x.join(' ');
        };
        this.animation(parentElement, spec.attributeName, from, to, 20, duration, formatter, callback)();
      }
      if (spec.attributeName === 'transform') {
        from = (function() {
          var _i, _len, _ref1, _results;
          _ref1 = spec.from.split(' ');
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            x = _ref1[_i];
            _results.push(parseInt(x));
          }
          return _results;
        })();
        to = (function() {
          var _i, _len, _ref1, _results;
          _ref1 = spec.to.split(' ');
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            x = _ref1[_i];
            _results.push(parseInt(x));
          }
          return _results;
        })();
        formatter = function(x) {
          return "" + spec.type + "(" + (x.join(' ')) + ")";
        };
        return this.animation(parentElement, spec.attributeName, from, to, 20, duration, formatter, callback)();
      }
    };

    SVGTreeNode.prototype.toString = function() {
      var child, line, ret, s, _i, _j, _len, _len1, _ref, _ref1;
      s = "name: " + this.name + "\n isHidden: " + this.isHidden + " x: " + this.x + " y: " + this.y;
      s += " textDX: " + this.textDX + " textDY: " + this.textDY + " textX: " + this.textX;
      s += " textY: " + this.textY + " linePoints: " + this.linePoints + " circleX: " + this.circleX;
      s += " circleY " + this.circleY;
      s += " scale: " + this.scale;
      s += "\n";
      _ref = this.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        s += child.toString();
      }
      ret = '';
      _ref1 = s.split("\n");
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        line = _ref1[_j];
        ret += '   ' + line + "\n";
      }
      return ret;
    };

    function SVGTreeNode(options) {
      this.circleClick = __bind(this.circleClick, this);
      this.textClick = __bind(this.textClick, this);
      this.animateVisible = __bind(this.animateVisible, this);
      this.visibleChildren = __bind(this.visibleChildren, this);
      this.hide = __bind(this.hide, this);
      this.hideChildren = __bind(this.hideChildren, this);
      this.showChildren = __bind(this.showChildren, this);
      this.animateCircle = __bind(this.animateCircle, this);
      this.makeCircle = __bind(this.makeCircle, this);
      this.animateText = __bind(this.animateText, this);
      this.makeText = __bind(this.makeText, this);
      this.animateLine = __bind(this.animateLine, this);
      this.makeLine = __bind(this.makeLine, this);
      this.numDescendants = __bind(this.numDescendants, this);
      this.getLinePoints = __bind(this.getLinePoints, this);
      this.moveChildren = __bind(this.moveChildren, this);
      this.updateChild = __bind(this.updateChild, this);
      this.updateChildren = __bind(this.updateChildren, this);
      this.move = __bind(this.move, this);
      this.updatePosition = __bind(this.updatePosition, this);
      this.requestUpdate = __bind(this.requestUpdate, this);
      this.newChild = __bind(this.newChild, this);
      this.toString = __bind(this.toString, this);
      this.animateElement = __bind(this.animateElement, this);
      var child, model, _i, _len, _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      this.el = options.el;
      this.children = [];
      model = (_ref = options.parent) != null ? _ref : options;
      this.name = (_ref1 = options.text) != null ? _ref1 : "Root";
      this.indent = (_ref2 = model.indent) != null ? _ref2 : 40;
      this.textDX = (_ref3 = model.textDX) != null ? _ref3 : 5;
      this.textDY = (_ref4 = model.textDY) != null ? _ref4 : -10;
      this.circleRadius = (_ref5 = model.circleRadius) != null ? _ref5 : 4;
      this.circleDY = (_ref6 = model.circleDY) != null ? _ref6 : 0;
      this.nodeHeight = (_ref7 = model.nodeHeight) != null ? _ref7 : 35;
      this.flagpoleLength = this.circleDY + this.circleRadius;
      this.animateDuration = (_ref8 = model.animateDuration) != null ? _ref8 : 400;
      this.isHidden = (_ref9 = options.isHidden) != null ? _ref9 : false;
      this.scale = this.isHidden ? "0 1" : "1 1";
      this.emptyColor = (_ref10 = model.emptyColor) != null ? _ref10 : 'white';
      this.treeColor = (_ref11 = model.treeColor) != null ? _ref11 : 'blue';
      this.x = (_ref12 = options.x) != null ? _ref12 : 5;
      this.y = (_ref13 = options.y) != null ? _ref13 : 40;
      if (options.parent != null) {
        this.parent = options.parent;
      } else {
        this.isRoot = true;
      }
      this.makeLine();
      this.makeText();
      if (this.isHidden && (options.children != null)) {
        this.circleY = this.y + this.circleDY;
        this.circleX = this.indent;
      }
      if (options.children != null) {
        _ref14 = options.children;
        for (_i = 0, _len = _ref14.length; _i < _len; _i++) {
          child = _ref14[_i];
          child.isHidden = true;
          this.newChild(child);
        }
      }
    }

    SVGTreeNode.prototype.newChild = function(options) {
      var child, child_el, scale, spacer_el, transform_spec;
      if (options == null) {
        options = {};
      }
      if (!((this.circle != null) || this.isHidden)) {
        this.makeCircle();
      }
      transform_spec = {
        transform: "translate(" + this.indent + ", 0)"
      };
      spacer_el = this.svgElement("g", transform_spec);
      scale = options.isHidden ? "0 1" : "1 1";
      transform_spec = {
        transform: "scale(" + scale + ")"
      };
      child_el = this.svgElement("g", transform_spec);
      spacer_el.appendChild(child_el);
      this.el.appendChild(spacer_el);
      options.el = child_el;
      options.parent = this;
      if (options.text == null) {
        options.text = 'child';
      }
      options.x = this.x + this.indent;
      if (options.isHidden) {
        options.y = this.y;
      } else {
        options.y = this.y + this.numDescendants() * this.nodeHeight;
      }
      child = new SVGTreeNode(options);
      return this.children.push(child);
    };

    SVGTreeNode.prototype.requestUpdate = function() {
      if (this.parent != null) {
        return this.parent.requestUpdate();
      } else {
        return this.updatePosition();
      }
    };

    SVGTreeNode.prototype.updatePosition = function(callback) {
      if (callback == null) {
        callback = null;
      }
      this.updateChildren();
      this.moveChildren();
      return this.move();
    };

    SVGTreeNode.prototype.move = function() {
      this.animateLine();
      this.animateText();
      this.animateCircle();
      return this.animateVisible();
    };

    SVGTreeNode.prototype.updateChildren = function() {
      var child, descendants, _i, _len, _ref, _results;
      descendants = 0;
      _ref = this.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        descendants += 1;
        this.updateChild(child, descendants);
        _results.push(descendants += child.numDescendants());
      }
      return _results;
    };

    SVGTreeNode.prototype.updateChild = function(child, index) {
      child.x = this.x + this.indent;
      return child.y = !child.isHidden ? this.y + this.nodeHeight * index : this.y;
    };

    SVGTreeNode.prototype.moveChildren = function(callback) {
      var child, _i, _len, _ref, _results;
      if (callback == null) {
        callback = null;
      }
      if (this.children.length === 0 && (callback != null)) {
        callback();
      }
      _ref = this.children;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push(child.updatePosition(callback));
      }
      return _results;
    };

    SVGTreeNode.prototype.getLinePoints = function() {
      var last, n;
      last = this.children[this.children.length - 1];
      n = last ? last.numDescendants() : 0;
      this.flagpoleLength = (this.numDescendants() - n) * this.nodeHeight;
      return "" + 0 + " " + this.y + " " + this.indent + " " + this.y + " " + this.indent + " " + (this.y + this.flagpoleLength);
    };

    SVGTreeNode.prototype.numDescendants = function() {
      var c, n, _i, _len, _ref;
      n = 0;
      _ref = this.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        if (!c.isHidden) {
          n += c.numDescendants() + 1;
        }
      }
      return n;
    };

    SVGTreeNode.prototype.makeLine = function() {
      this.linePoints = this.getLinePoints();
      this.line = this.svgElement("polyline", {
        fill: "none",
        points: this.linePoints,
        'stroke-width': "2px",
        stroke: this.treeColor
      });
      return this.el.appendChild(this.line);
    };

    SVGTreeNode.prototype.animateLine = function(callback) {
      var newPoints;
      if (callback == null) {
        callback = null;
      }
      if (this.line == null) {
        if (this.isHidden) {
          this.linePoints = this.getLinePoints();
          return;
        }
        this.makeLine();
      }
      newPoints = this.getLinePoints();
      this.animateElement({
        attributeName: 'points',
        from: this.linePoints,
        to: newPoints
      }, this.line, callback);
      return this.linePoints = newPoints;
    };

    SVGTreeNode.prototype.makeText = function() {
      this.textX = this.textDX;
      this.textY = this.y + this.textDY;
      this.text = this.svgElement("text", {
        fill: "black",
        x: this.textDX,
        y: this.y + this.textDY
      });
      this.text.appendChild(document.createTextNode(this.name));
      this.text.addEventListener("click", this.textClick);
      return this.el.appendChild(this.text);
    };

    SVGTreeNode.prototype.animateText = function(callback) {
      var newY;
      if (callback == null) {
        callback = null;
      }
      if (this.text == null) {
        if (this.isHidden) {
          return;
        }
        this.makeText();
      }
      newY = this.y + this.textDY;
      this.animateElement({
        attributeName: 'y',
        to: newY,
        from: this.textY
      }, this.text, callback);
      return this.textY = newY;
    };

    SVGTreeNode.prototype.makeCircle = function() {
      this.circleX = this.indent;
      if (this.circleY == null) {
        this.circleY = this.y + this.circleDY;
      }
      this.circle = this.svgElement("circle", {
        fill: this.treeColor,
        cx: this.indent,
        cy: this.y + this.circleDY,
        r: this.circleRadius,
        "stroke-width": "2px",
        stroke: this.treeColor
      });
      this.circle.addEventListener("click", this.circleClick);
      return this.el.appendChild(this.circle);
    };

    SVGTreeNode.prototype.animateCircle = function(callback) {
      var color, new_cy;
      if (callback == null) {
        callback = null;
      }
      if (this.circle == null) {
        if ((this.children.length === 0) || this.isHidden) {
          return;
        } else {
          this.makeCircle();
        }
      }
      new_cy = this.y + this.circleDY;
      this.animateElement({
        attributeName: 'cy',
        to: new_cy,
        from: this.circleY
      }, this.circle, callback);
      this.circleY = new_cy;
      color = this.visibleChildren().length === 0 ? this.treeColor : this.emptyColor;
      return this.circle.setAttribute('fill', color);
    };

    SVGTreeNode.prototype.showChildren = function() {
      var child, _i, _len, _ref;
      _ref = this.children;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        child.isHidden = false;
      }
      this.updateChildren();
      return this.requestUpdate();
    };

    SVGTreeNode.prototype.hideChildren = function() {
      var child, f, test, trigger, _i, _len, _ref, _results;
      test = (function(_this) {
        return function() {
          return _this.visibleChildren().length === 0;
        };
      })(this);
      trigger = (function(_this) {
        return function() {
          return _this.requestUpdate();
        };
      })(this);
      f = this.groupActionCallback(trigger, test);
      if (this.isRoot) {
        f = this.groupActionCallback(this.updatePosition, test);
      }
      _ref = this.visibleChildren();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push(child.hide(f));
      }
      return _results;
    };

    SVGTreeNode.prototype.hide = function(callback) {
      var cb, child, hideCallback, test, _i, _len, _ref, _results;
      if (this.visibleChildren().length === 0) {
        this.isHidden = true;
        callback(this);
      }
      hideCallback = (function(_this) {
        return function() {
          _this.isHidden = true;
          return callback(_this);
        };
      })(this);
      test = (function(_this) {
        return function() {
          return _this.visibleChildren().length === 0;
        };
      })(this);
      cb = this.groupActionCallback(hideCallback, test);
      _ref = this.visibleChildren();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push(child.hide(cb));
      }
      return _results;
    };

    SVGTreeNode.prototype.groupActionCallback = function(callback, test) {
      return function(opts) {
        if (test(opts) && (callback != null)) {
          return callback();
        }
      };
    };

    SVGTreeNode.prototype.visibleChildren = function() {
      return this.children.filter(function(x) {
        return !x.isHidden;
      });
    };

    SVGTreeNode.prototype.animateVisible = function(callback) {
      var newScale, spec;
      if (callback == null) {
        callback = null;
      }
      newScale = this.isHidden ? "0 1" : "1 1";
      spec = {
        attributeName: 'transform',
        type: 'scale',
        from: this.scale,
        to: newScale
      };
      this.scale = newScale;
      return this.animateElement(spec, this.el, callback);
    };

    SVGTreeNode.prototype.textClick = function(evt) {
      var options;
      options = {};
      if (this.visibleChildren().length !== this.children.length) {
        options.isHidden = true;
      }
      this.newChild(options);
      if (options.isHidden) {
        return this.showChildren();
      }
    };

    SVGTreeNode.prototype.circleClick = function(evt) {
      if (this.visibleChildren().length !== this.children.length) {
        return this.showChildren();
      } else {
        return this.hideChildren();
      }
    };

    return SVGTreeNode;

  })();

  module.SVGTreeNode = SVGTreeNode;

  module.drawSVG = drawSVG;

}).call(this);
