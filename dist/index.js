'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _bar = require('./bar');

var _bar2 = _interopRequireDefault(_bar);

require('./os.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Content = function (_Component) {
	_inherits(Content, _Component);

	function Content() {
		_classCallCheck(this, Content);

		var _this = _possibleConstructorReturn(this, (Content.__proto__ || Object.getPrototypeOf(Content)).call(this));

		_this.wheel = function (e) {
			var _this$state = _this.state,
			    sH = _this$state.sH,
			    cH = _this$state.cH,
			    barHeight = _this$state.barHeight,
			    contenTop = _this$state.contenTop;

			var barRatio = sH / cH;
			var barTop = e.deltaY / barRatio + _this.state.barTop;
			var barFade = false;
			contenTop += e.deltaY;
			if (barTop <= 0) {
				barTop = 0;
				contenTop = 0;
			} else if (barTop + barHeight > cH) {
				barTop = cH - barHeight;
				contenTop = sH - cH;
			}
			_this.setState({ barTop: barTop, contenTop: contenTop, barFade: barFade, barRatio: barRatio });
			_this.fadeBar();
		};

		_this.fadeBar = function () {
			window.clearTimeout(_this.timer);
			_this.timer = setTimeout(function () {
				_this.setState({
					barFade: true
				});
			}, 1000);
		};

		_this.eventStop = function (e) {
			if (e.cancelable && !e.defaultPrevented) {
				e.preventDefault();
			}
			e.stopPropagation();
		};

		_this.barMouseOver = function (e) {
			_this.eventStop(e);
			var isDrag = _this.state.isDrag;

			if (isDrag) return;
			_this.setState({
				barFade: false
			});
		};

		_this.barMouseLeave = function (e) {
			_this.eventStop(e);
			var isDrag = _this.state.isDrag;

			if (isDrag) return;
			_this.setState({
				barFade: true
			});
		};

		_this.barMouseDown = function (e) {
			_this.eventStop(e);
			_this.setState({
				dragStart: e.screenY,
				isDrag: true,
				clickBarTop: _this.state.barTop
			});
		};

		_this.barMouseMove = function (e) {
			_this.eventStop(e);
			var _this$state2 = _this.state,
			    dragStart = _this$state2.dragStart,
			    barRatio = _this$state2.barRatio,
			    isDrag = _this$state2.isDrag,
			    barHeight = _this$state2.barHeight,
			    cH = _this$state2.cH,
			    sH = _this$state2.sH,
			    clickBarTop = _this$state2.clickBarTop;

			if (!isDrag) return;
			var step = e.screenY - dragStart + clickBarTop;
			var contenTop = step * barRatio;
			if (step <= 0) {
				step = 0;
				contenTop = 0;
			} else if (step + barHeight > cH) {
				step = cH - barHeight;
				contenTop = sH - cH;
			}
			_this.setState({
				barTop: step,
				contenTop: contenTop
			});
		};

		_this.barMouseUp = function (e) {
			_this.eventStop(e);
			if (e.cancelable && !e.defaultPrevented) {
				e.preventDefault();
			}
			e.stopPropagation();
			_this.setState({
				isDrag: false
			});
		};

		_this.touchStart = function (e) {
			_this.eventStop(e);
			_this.setState({
				touchPos: e.targetTouches[0].clientY,
				touchContentTop: _this.state.contenTop,
				barFade: false
			});
		};

		_this.touchMove = function (e) {
			_this.eventStop(e);
			var _this$state3 = _this.state,
			    touchPos = _this$state3.touchPos,
			    touchContentTop = _this$state3.touchContentTop,
			    sH = _this$state3.sH,
			    cH = _this$state3.cH,
			    barRatio = _this$state3.barRatio,
			    barHeight = _this$state3.barHeight;

			var move = (e.targetTouches[0].clientY - touchPos) * 1.5;
			var contenTop = touchContentTop - move;
			var barTop = contenTop / barRatio;
			if (contenTop <= 0) {
				contenTop = 0;
				barTop = 0;
			} else if (contenTop > sH - cH) {
				contenTop = sH - cH;
				barTop = cH - barHeight;
			}
			_this.setState({
				contenTop: contenTop,
				barTop: barTop
			});
		};

		_this.touchEnd = function (e) {
			_this.eventStop(e);
			setTimeout(function () {
				_this.setState({
					barFade: true
				});
			}, 1000);
		};

		_this.barInit = function () {
			var contenTop = _this.state.contenTop;

			var c = _this.content;
			var cH = c.clientHeight;
			var sH = c.scrollHeight < c.clientHeight ? c.clientHeight : c.scrollHeight;
			var barHeight = cH / (sH / cH) < cH / 5 ? cH / 5 : cH / (sH / cH);
			var barTop = (contenTop + cH) / sH * cH - barHeight;
			var barRatio = sH / cH;
			if (barTop < 0) {
				barTop = 0;
				contenTop = 0;
			} else if (barTop + barHeight > cH) {
				barTop = cH - barHeight;
				contenTop = sH - cH;
			}

			_this.setState({
				sH: sH,
				cH: cH,
				barHeight: barHeight,
				barTop: barTop,
				contenTop: contenTop,
				barRatio: barRatio
			});
		};

		_this.content = null;
		_this.timer = null;
		_this.state = {
			// content wrap
			sH: 0,
			cH: 0,
			// touch
			touchPos: 0,

			// content
			contenTop: 0,
			touchContentTop: 0,

			// Bar
			barTop: 0,
			barHeight: 0,
			barRatio: 1,
			dragStart: 0,
			dragEnd: 0,
			clickBarTop: 0,
			isDrag: false,
			barFade: true
			// touchShowBar:true
		};
		return _this;
	}

	_createClass(Content, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.barInit();
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate() {
			if (this.state.isDrag) {
				document.addEventListener('mousemove', this.barMouseMove);
				document.addEventListener('mouseup', this.barMouseUp);
			} else {
				document.removeEventListener('mousemove', this.barMouseMove);
				document.removeEventListener('mouseup', this.barMouseUp);
			}
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			var _this2 = this;

			setTimeout(function () {
				_this2.barInit();
			}, 200);
		}
	}, {
		key: 'render',
		value: function render() {
			var _this3 = this;

			var _state = this.state,
			    contenTop = _state.contenTop,
			    barTop = _state.barTop,
			    barHeight = _state.barHeight,
			    barFade = _state.barFade,
			    isDrag = _state.isDrag;
			var showBar = this.props.showBar;

			var barStyle = {
				top: barTop,
				height: barHeight,
				background: barFade ? 'rgba(47, 47, 47,0.4)' : '',
				isDrag: isDrag
			};
			var contentStyle = {
				transform: 'translateY(' + (-contenTop || 0) + 'px)',
				transition: isDrag ? 'none' : ''
			};
			var barMethod = {
				barMouseOver: this.barMouseOver,
				barMouseLeave: this.barMouseLeave,
				barMouseDown: this.barMouseDown
			};
			return _react2.default.createElement(
				'div',
				{ className: 's-content',
					onTouchMove: this.touchMove,
					onTouchStart: this.touchStart,
					onTouchEnd: this.touchEnd,
					onWheel: this.wheel,
					ref: function ref(_ref) {
						_this3.content = _ref;
					} },
				showBar ? _react2.default.createElement(_bar2.default, { method: barMethod, style: barStyle }) : '',
				_react2.default.createElement(
					'div',
					{ className: 's-c', style: contentStyle },
					this.props.children || null
				)
			);
		}
	}]);

	return Content;
}(_react.Component);

exports.default = Content;