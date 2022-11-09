/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
var CesiumUtils;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/Entity.js":
/*!**********************!*\
  !*** ./js/Entity.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Entity\": () => (/* binding */ Entity)\n/* harmony export */ });\n/* harmony import */ var _core_event_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/event.mjs */ \"./js/core/event.mjs\");\nfunction ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }\nfunction _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, \"prototype\", { writable: false }); return Constructor; }\n\nvar Entity = /*#__PURE__*/function () {\n  function Entity(viewer, options) {\n    var _this = this;\n    _classCallCheck(this, Entity);\n    this.viewer = viewer;\n    this.options = options;\n    this.position = Cesium.Cartesian3.fromDegrees(options.position[0], options.position[1], options.position[2]);\n    this.draggable = !!options.draggable;\n    if (this.draggable) {\n      this.initDragEvents();\n    }\n    this.entity = new Cesium.Entity(_objectSpread(_objectSpread({}, options), {}, {\n      position: new Cesium.CallbackProperty(function () {\n        return _this.position;\n      }, this.draggable)\n    }));\n    this.event = new _core_event_mjs__WEBPACK_IMPORTED_MODULE_0__[\"default\"](viewer, this.entity);\n    this.viewer.entities.add(this.entity);\n  }\n  _createClass(Entity, [{\n    key: \"on\",\n    value: function on(event, cb) {\n      this.event.on(event.cb);\n    }\n  }, {\n    key: \"off\",\n    value: function off(event, cb) {\n      this.event.off(event.cb);\n    }\n  }, {\n    key: \"remove\",\n    value: function remove() {\n      this.event.destory();\n      this.viewer.entities.remove(this.entity);\n    }\n  }, {\n    key: \"show\",\n    value: function show() {\n      this.entity.show = true;\n    }\n  }, {\n    key: \"hidden\",\n    value: function hidden() {\n      this.entity.show = false;\n    }\n  }, {\n    key: \"initDragEvents\",\n    value: function initDragEvents() {\n      var _this2 = this;\n      this.on('move', function (result) {\n        _this2.position = result.cartesian3;\n      });\n    }\n    /**\r\n     * \r\n     * @param {array} position \r\n     * @param {string} position[0]  lng\r\n     * @param {string} position[1] lat \r\n     * @param {string} position[2] height\r\n     */\n  }, {\n    key: \"update\",\n    value: function update(position) {\n      this.position = Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]);\n    }\n  }]);\n  return Entity;\n}();\n\n//# sourceURL=webpack://cesium-study-demo/./js/Entity.js?");

/***/ }),

/***/ "./js/core/event.mjs":
/*!***************************!*\
  !*** ./js/core/event.mjs ***!
  \***************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Event)\n/* harmony export */ });\n/* harmony import */ var _utils_CallbackRunner_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/CallbackRunner.mjs */ \"./js/utils/CallbackRunner.mjs\");\n/* harmony import */ var _utils_debounce_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/debounce.mjs */ \"./js/utils/debounce.mjs\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, \"prototype\", { writable: false }); return Constructor; }\n\n\nvar Event = /*#__PURE__*/function () {\n  function Event(viewer, entity) {\n    _classCallCheck(this, Event);\n    this.viewer = viewer;\n    this.entity = entity;\n    this.handler = null;\n    this.picker = this.viewer.scene.pick;\n    this.clickCbs = new _utils_CallbackRunner_mjs__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n    this.postClick = new _utils_CallbackRunner_mjs__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n    this.rightClickCbs = new _utils_CallbackRunner_mjs__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n    this.postRightClick = new _utils_CallbackRunner_mjs__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n    this.moveCbs = new _utils_CallbackRunner_mjs__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n    this.postMove = new _utils_CallbackRunner_mjs__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n    this.movingCbs = new _utils_CallbackRunner_mjs__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n    this.postMoving = new _utils_CallbackRunner_mjs__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n    this.movedCbs = new _utils_CallbackRunner_mjs__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n    this.postMoved = new _utils_CallbackRunner_mjs__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n    this.isMoving = false;\n    this.movedConfirmor = 300;\n  }\n  _createClass(Event, [{\n    key: \"initEvents\",\n    value: function initEvents() {\n      var _this = this;\n      this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);\n      handler.setInputAction(function (event) {\n        var picked = _this.picker(event.position);\n        if (Cesium.defined(picked) && pick.id.id === _this.entity.id) {\n          //cartesian2(screen 2D)  x,y\n          var earthPosition = viewer.camera.pickEllipsoid(event.position, viewer.scene.globe.ellipsoid);\n          //longitude<arc>,latitude<arc>,height<H>\n          var cartographic = Cesium.Cartographic.fromCartesian(earthPosition, viewer.scene.globe.ellipsoid, new Cesium.Cartographic());\n          var cartesian3 = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);\n          //longitude<wgs84.lon>,latitude<wgs84.lon.lat>,height<H>\n          var wgs84 = {\n            lat: Cesium.Math.toDegrees(cartographic.latitude),\n            lng: Cesium.Math.toDegrees(cartographic.longitude),\n            height: cartographic.height\n          };\n          var result = _this.postClick.reduce({\n            cartesian2: earthPosition,\n            cartesian3: cartesian3,\n            cartographic: cartographic,\n            wgs84: wgs84,\n            entity: _this.entity\n          });\n          _this.clickCbs.run(result);\n        }\n      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);\n      handler.setInputAction(function (event) {\n        var picked = _this.picker(event.position);\n        if (Cesium.defined(picked) && pick.id.id === _this.entity.id) {\n          //cartesian2(screen)  x,y\n          var earthPosition = viewer.camera.pickEllipsoid(event.position, viewer.scene.globe.ellipsoid);\n          //longitude<arc>,latitude<arc>,height<H>\n          var cartographic = Cesium.Cartographic.fromCartesian(earthPosition, viewer.scene.globe.ellipsoid, new Cesium.Cartographic());\n          var cartesian3 = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);\n          //longitude<wgs84.lon>,latitude<wgs84.lon.lat>,height<H>\n          var wgs84 = {\n            lat: Cesium.Math.toDegrees(cartographic.latitude),\n            lng: Cesium.Math.toDegrees(cartographic.longitude),\n            height: cartographic.height\n          };\n          var result = _this.postRightClick.reduce({\n            cartesian2: earthPosition,\n            cartesian3: cartesian3,\n            cartographic: cartographic,\n            wgs84: wgs84,\n            entity: _this.entity\n          });\n          _this.rightClickCbs.run(result);\n        }\n      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);\n      handler.setInputAction(function (event) {\n        var picked = _this.picker(event.position);\n        if (Cesium.defined(picked) && pick.id.id === _this.entity.id) {\n          //cartesian2(screen)  x,y\n          var earthPosition = viewer.camera.pickEllipsoid(event.position, viewer.scene.globe.ellipsoid);\n          //longitude<arc>,latitude<arc>,height<H>\n          var cartographic = Cesium.Cartographic.fromCartesian(earthPosition, viewer.scene.globe.ellipsoid, new Cesium.Cartographic());\n          var cartesian3 = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);\n          //longitude<wgs84.lon>,latitude<wgs84.lon.lat>,height<H>\n          var wgs84 = {\n            lat: Cesium.Math.toDegrees(cartographic.latitude),\n            lng: Cesium.Math.toDegrees(cartographic.longitude),\n            height: cartographic.height\n          };\n          var result = {\n            cartesian2: earthPosition,\n            cartesian3: cartesian3,\n            cartographic: cartographic,\n            wgs84: wgs84,\n            entity: _this.entity\n          };\n          if (!_this.isMoving) {\n            _this.moveCbs.run(_this.postMove.reduce(result));\n          }\n          _this.isMoving = true;\n          _this.movingCbs.run(_this.postMoving.reduce(result));\n          (0,_utils_debounce_mjs__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(function () {\n            _this.movedCbs.run(_this.postMoved.reduce(result));\n            _this.isMoving = false;\n          }, _this.movedConfirmor);\n        }\n      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);\n    }\n  }, {\n    key: \"on\",\n    value: function on(event, callback) {\n      switch (event) {\n        case 'click':\n          this.clickCbs.push(callback);\n        case 'rightclick':\n          this.rightClickCbs.push(callback);\n        case 'moving':\n          this.movingCbs.push(callback);\n        case 'moved':\n          this.movedCbs.push(callback);\n        case 'move':\n          this.moveCbs.push(callback);\n        default:\n          throw Error('on event type error;type is ' + event);\n      }\n    }\n  }, {\n    key: \"off\",\n    value: function off(event, callback) {\n      switch (event) {\n        case 'click':\n          this.clickCbs.remove(callback);\n        case 'rightclick':\n          this.rightClickCbs.remove(callback);\n        case 'moving':\n          this.movingCbs.remove(callback);\n        case 'moved':\n          this.movedCbs.remove(callback);\n        case 'move':\n          this.moveCbs.remove(callback);\n        default:\n          throw Error('off event type error;type is ' + event);\n      }\n    }\n  }, {\n    key: \"destory\",\n    value: function destory() {\n      this.handler.destory();\n    }\n  }]);\n  return Event;\n}();\n\n\n//# sourceURL=webpack://cesium-study-demo/./js/core/event.mjs?");

/***/ }),

/***/ "./js/utils/CallbackRunner.mjs":
/*!*************************************!*\
  !*** ./js/utils/CallbackRunner.mjs ***!
  \*************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Runner)\n/* harmony export */ });\nfunction _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\nfunction _iterableToArray(iter) { if (typeof Symbol !== \"undefined\" && iter[Symbol.iterator] != null || iter[\"@@iterator\"] != null) return Array.from(iter); }\nfunction _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, \"prototype\", { writable: false }); return Constructor; }\nvar Runner = /*#__PURE__*/function () {\n  function Runner() {\n    _classCallCheck(this, Runner);\n    this.queue = [];\n  }\n  /**\r\n   * 加入一个回调函数到执行队列\r\n   * @param { Function } callback 回调函数\r\n   * @returns { Function } remove函数 从队列中移除回调\r\n   */\n  _createClass(Runner, [{\n    key: \"push\",\n    value: function push(callback) {\n      var _this = this;\n      var i = this.queue.push(callback) - 1;\n      return function () {\n        return _this.queue.splice(i, 1);\n      };\n    }\n    /**\r\n     * 执行回调队列中的回调函数\r\n     * @param  {...any} params 回调参数\r\n     */\n  }, {\n    key: \"run\",\n    value: function run() {\n      for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {\n        params[_key] = arguments[_key];\n      }\n      if (this.queue.length > 0) {\n        this.queue.forEach(function (fn) {\n          return fn.apply(void 0, params);\n        });\n      }\n    }\n  }, {\n    key: \"remove\",\n    value: function remove(callback) {\n      var index = this.queue.findIndex(function (cb) {\n        return cb === callback;\n      });\n      if (index > -1) {\n        this.queue.splice(index, 1);\n        return true;\n      } else {\n        return false;\n      }\n    }\n  }, {\n    key: \"destory\",\n    value: function destory() {\n      this.queue.splice(0);\n    }\n  }, {\n    key: \"reduce\",\n    value: function reduce(first) {\n      for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {\n        params[_key2 - 1] = arguments[_key2];\n      }\n      if (this.queue.length > 0) {\n        this.queue.reduce(function (pre, cur) {\n          return cur.apply(void 0, _toConsumableArray(pre));\n        }, [first].concat(params));\n      } else {\n        return params.length ? [first].concat(params) : first;\n      }\n    }\n  }]);\n  return Runner;\n}();\n\n\n//# sourceURL=webpack://cesium-study-demo/./js/utils/CallbackRunner.mjs?");

/***/ }),

/***/ "./js/utils/debounce.mjs":
/*!*******************************!*\
  !*** ./js/utils/debounce.mjs ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(func, delay) {\n  var timer = void 0;\n  if (!timer) {\n    timer = setTimeout(func, delay);\n  } else {\n    clearTimeout(timer);\n    timer = setTimeout(func, delay);\n  }\n}\n\n//# sourceURL=webpack://cesium-study-demo/./js/utils/debounce.mjs?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./js/Entity.js");
/******/ 	CesiumUtils = __webpack_exports__;
/******/ 	
/******/ })()
;