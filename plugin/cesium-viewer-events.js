import { CallbackRunner } from '../js/utils/CallbackRunner.mjs';
import debounce from '../js/utils/debounce.mjs';
export class ViewerEvents {
  constructor(viewer) {
    if (viewer && viewer instanceof Cesium.Viewer) {
      this.viewer = viewer;
    } else {
      throw Error('viewer error');
    }
    this.isMoving = false;
    this.movedConfirmTimer = 700;
    this.callbackMap = new WeakMap();
    this.eventsMap = {
      LEFT_CLICK: Cesium.ScreenSpaceEventType.LEFT_CLICK,
      LEFT_DOUBLE_CLICK: Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
      LEFT_DOWN: Cesium.ScreenSpaceEventType.LEFT_DOWN,
      LEFT_UP: Cesium.ScreenSpaceEventType.LEFT_UP,
      RIGHT_CLICK: Cesium.ScreenSpaceEventType.RIGHT_CLICK,
      RIGHT_DOWN: Cesium.ScreenSpaceEventType.RIGHT_DOWN,
      RIGHT_UP: Cesium.ScreenSpaceEventType.RIGHT_UP,
      MIDDLE_CLICK: Cesium.ScreenSpaceEventType.MIDDLE_CLICK,
      MOUSE_MOVE: Cesium.ScreenSpaceEventType.MOUSE_MOVE,
      WHEEL: Cesium.ScreenSpaceEventType.WHEEL,
    };
    //LEFT_CLICK
    this.clickCbs = new CallbackRunner();

    //LEFT_DOUBLE_CLICK
    this.doubleClickCbs = new CallbackRunner();

    //RIGHT_CLICK
    this.rightClickCbs = new CallbackRunner();

    //MOUSE_MOVE start move EVENTS
    this.moveCbs = new CallbackRunner();

    //MOUSE_MOVE moving EVENTS
    this.movingCbs = new CallbackRunner();

    //MOUSE_MOVE end move EVENTS
    this.movedCbs = new CallbackRunner();

    //LEFT_DOWN EVENTS
    this.leftDownCbs = new CallbackRunner();

    //LEFT_UP EVENTS
    this.leftUpCbs = new CallbackRunner();

    //RIGHT_DOWN EVENTS
    this.rightDownCbs = new CallbackRunner();

    //RIGHT_UP EVENTS
    this.rightUpCbs = new CallbackRunner();

    //MIDDLE_CLICK EVENTS
    this.middleClickCbs = new CallbackRunner();

    //WHEEL EVENTS
    this.wheelCbs = new CallbackRunner();

    //custom event drag
    this.dragCbs = new CallbackRunner();
    this.initHandler(this.viewer);
  }
  initHandler(viewer) {
    this._handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    return this._handler;
  }
  //******************************LEFT_CLICK */
  initLeftClick(handler) {
    handler.setInputAction((movement) => {
      this.clickCbs.run(movement);
    }, this.eventsMap.LEFT_CLICK);
    return true;
  }
  //*******************************LEFT_DOUBLE_CLICK */
  initLeftDoubleClick(handler) {
    handler.setInputAction((movement) => {
      const { position } = movement;
      this.doubleClickCbs.run(movement);
    }, this.eventsMap.LEFT_DOUBLE_CLICK);
    return true;
  }
  //******************************LEFT_DOWN */
  initLeftDown(handler) {
    handler.setInputAction((movement) => {
      const { position } = movement;
      this.leftDownCbs.run(movement);
    }, this.eventsMap.LEFT_DOWN);
    return true;
  }
  //******************************LEFT_UP */
  initLeftUp(handler) {
    handler.setInputAction((movement) => {
      const { position } = movement;
      this.leftUpCbs.run(movement);
    }, this.eventsMap.LEFT_UP);
    return true;
  }
  //******************************RIGHT_CLICK */
  initRightClick(handler) {
    handler.setInputAction((movement) => {
      const { position } = movement;
      this.leftUpCbs.run(movement);
    }, this.eventsMap.RIGHT_CLICK);
    return true;
  }
  //******************************MOUSE_MOVE */
  initMove(handler) {
    handler.setInputAction((movement) => {
      if (!this.isMoving) {
        this.moveCbs.run(movement);
      }
      this.isMoving = true;
      this.movingCbs.run(movement);
      debounce(() => {
        this.movedCbs.run(movement);
        this.isMoving = false;
      }, this.movedConfirmTimer);
    }, this.eventsMap.MOUSE_MOVE);
    return true;
  }
  //******************************WHEEL */
  initWheel(handler) {
    handler.setInputAction((res) => {
      this.wheelCbs.run(res);
    }, this.eventsMap.WHEEL);
    return true;
  }
  initDrag() {
    const viewer = this.viewer;
    if (!this.__dragLeftDown) {
      this.__dragLeftDown = this.on('leftdown', () => {
        if (this._moveCancel) this._moveCancel();
        this.viewer.scene.screenSpaceCameraController.enableRotate = false;
        this._moveCancel = this.on('moving', (result) => {
          this.dragCbs.run(result);
        });
      });
    }
    if (!this.__dragLeftUp) {
      this.__dragLeftUp = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      this.__dragLeftUp.setInputAction(() => {
        this._moveCancel && this._moveCancel();
        this._moveCancel = null;
        this.viewer.scene.screenSpaceCameraController.enableRotate = true;
      }, Cesium.ScreenSpaceEventType.LEFT_UP);
    }
    return true;
  }
  cancelDrag() {
    if (this.__dragLeftDown) {
      this.__dragLeftDown();
      this.__dragLeftDown = null;
    }
    if (this._moveCancel) {
      this._moveCancel();
      this._moveCancel = null;
    }
    if (this.__dragLeftUp) {
      this.__dragLeftUp &&
        !this.__dragLeftUp.isDestroyed() &&
        this.__dragLeftUp.destroy();
      this.__dragLeftUp = null;
    }
  }
  on(event, cb, options = {}) {
    const handler = this._handler;
    let has = void 0;
    const callback = this._wrapperCallback(event, cb, options);
    switch (event) {
      case 'click':
        if (!this._leftClickTag) {
          this._leftClickTag = this.initLeftClick(handler);
        }
        has = this.clickCbs.has(callback);
        return has ? has : this.clickCbs.push(callback);
      case 'doubleclick':
        if (!this._leftDoubleClickTag) {
          this._leftDoubleClickTag = this.initLeftDoubleClick(handler);
        }
        has = this.doubleClickCbs.has(callback);
        return has ? has : this.doubleClickCbs.push(callback);
      case 'rightclick':
        if (!this._rightClickTag) {
          this._rightClickTag = this.initRightClick(handler);
        }
        has = this.rightClickCbs.has(callback);
        return has ? has : this.rightClickCbs.push(callback);
      case 'move':
        if (!this._moveTag) {
          this._moveTag = this.initMove(handler);
        }
        has = this.moveCbs.has(callback);
        return has ? has : this.moveCbs.push(callback);
      case 'moving':
        if (!this._moveTag) {
          this._moveTag = this.initMove(handler);
        }
        has = this.movingCbs.has(callback);
        return has ? has : this.movingCbs.push(callback);
      case 'moved':
        if (!this._moveTag) {
          this._moveTag = this.initMove(handler);
        }
        has = this.movedCbs.has(callback);
        return has ? has : this.movedCbs.push(callback);
      case 'leftdown':
        if (!this._leftDownTag) {
          this._leftDownTag = this.initLeftDown(handler);
        }
        has = this.leftDownCbs.has(callback);
        return has ? has : this.leftDownCbs.push(callback);
      case 'leftup':
        if (!this._leftUpTag) {
          this._leftUpTag = this.initLeftUp(handler);
        }
        has = this.leftUpCbs.has(callback);
        return has ? has : this.leftUpCbs.push(callback);
      case 'drag':
        if (!this._dragTag) {
          this._dragTag = this.initDrag(options);
        }
        has = this.dragCbs.has(callback);
        return has ? has : this.dragCbs.push(callback);
      case 'wheel':
        if (!this._wheelTag) {
          this._wheelTag = this.initWheel(handler);
        }
        has = this.wheelCbs.has(callback);
        return has ? has : this.wheelCbs.push(callback);
      default:
        throw Error('on event type error;type is ' + event);
    }
  }
  off(event, cb) {
    const callback = this._getWrapperedCallback(cb);
    switch (event) {
      case 'click':
        return this.clickCbs.remove(callback);
      case 'doubleclick':
        return this.doubleClickCbs.remove(callback);
      case 'rightclick':
        return this.rightClickCbs.remove(callback);
      case 'move':
        return this.moveCbs.remove(callback);
      case 'moving':
        return this.movingCbs.remove(callback);
      case 'moved':
        return this.movedCbs.remove(callback);
      case 'leftdown':
        return this.leftDownCbs.remove(callback);
      case 'leftup':
        return this.leftUpCbs.remove(callback);
      case 'rightdown':
        return this.rightDownCbs.remove(callback);
      case 'rightup':
        return this.rightUpCbs.remove(callback);
      case 'middelclick':
        return this.middleClickCbs.remove(callback);
      case 'wheel':
        return this.wheelCbs.remove(callback);
      case 'drag':
        return this.dragCbs.remove(callback);
      default:
        throw Error('off event type error;type is ' + event);
    }
  }
  destory() {
    if (this._handler && !this._handler.isDestroyed()) {
      this.handler.destroy();
      this.handler = null;
    }
    //LEFT_CLICK
    this.clickCbs.destory();
    this.clickCbs = null;
    //RIGHT_CLICK
    this.rightClickCbs.destory();
    this.rightClickCbs = null;
    //start move EVENTS
    this.moveCbs.destory();
    this.moveCbs = null;
    //moving EVENTS
    this.movingCbs.destory();
    this.movingCbs = null;
    //moved EVENTS
    this.movedCbs.destory();
    this.movedCbs = null;
    //LEFT_DOWN EVENTS
    this.leftDownCbs.destory();
    this.leftDownCbs = null;
    //LEFT_UP EVENTS
    this.leftUpCbs.destory();
    this.leftUpCbs = null;
    //RIGHT_DOWN EVENTS
    this.rightDownCbs.destory();
    this.rightDownCbs = null;
    //RIGHT_UP EVENTS
    this.rightUpCbs.destory();
    this.rightUpCbs = null;
  }
  _wrapperCallback(event, cb, options) {
    if (this.callbackMap.has(cb)) return;
    const type = options.type || 'cartesian3';
    const target = options.target || 'camera'; //'globe' 'scene' 'camera'
    const once = options.once;
    const viewer = this.viewer;
    const camera = viewer.camera;
    const scene = viewer.scene;
    const globe = scene.globe;
    const ellipsoid = globe.ellipsoid;
    let callback = cb;
    if (event === 'move' || event === 'moving' || event === 'moved') {
      callback = (movement) => {
        let startPosition = movement.startPosition;
        let endPosition = movement.endPosition;
        switch (type) {
          case 'cartesian3': {
            //cartesian3
            if (target === 'scene') {
              //场景坐标（3dTile上的坐标点）
              startPosition = scene.pickPosition(startPosition);
              endPosition = scene.pickPosition(endPosition);
            }
            if (target === 'globe') {
              //地标坐标（经纬度、高程）
              startPosition = globe.pick(camera.getPickRay(startPosition), scene);
              endPosition = globe.pick(camera.getPickRay(endPosition), scene);
            }
            if (target === 'camera') {
              //世界坐标（获取椭球面位置）
              startPosition = camera.pickEllipsoid(startPosition, ellipsoid);
              endPosition = camera.pickEllipsoid(endPosition, ellipsoid);
            }
            const result = {
              startPosition,
              endPosition,
            };
            cb(result);
            return;
          }
          case 'wgs84':
          case 'lonLat': {
            //cartesian3
            if (target === 'scene') {
              //场景坐标（3dTile上的坐标点）
              startPosition = scene.pickPosition(startPosition);
              endPosition = scene.pickPosition(endPosition);
            } else if (target === 'globe') {
              //地标坐标（经纬度、高程）
              startPosition = globe.pick(camera.getPickRay(startPosition), scene);
              endPosition = globe.pick(camera.getPickRay(endPosition), scene);
            } else {
              //世界坐标（获取椭球面位置）
              startPosition = viewer.camera.pickEllipsoid(startPosition, ellipsoid);
              endPosition = viewer.camera.pickEllipsoid(endPosition, ellipsoid);
            }
            if (startPosition) {
              startPosition = ellipsoid.cartesianToCartographic(startPosition);
            }
            if (endPosition) {
              endPosition = ellipsoid.cartesianToCartographic(endPosition);
            }
            if (startPosition) {
              startPosition = {
                lat: Cesium.Math.toDegrees(startPosition.latitude),
                lon: Cesium.Math.toDegrees(startPosition.longitude),
                height: startPosition.height,
              };
            }
            if (endPosition) {
              endPosition = {
                lat: Cesium.Math.toDegrees(endPosition.latitude),
                lon: Cesium.Math.toDegrees(endPosition.longitude),
                height: endPosition.height,
              };
            }
            const result = {
              startPosition,
              endPosition,
            };
            cb(result);
            return;
          }
          case 'cartographic': {
            if (target === 'scene') {
              //场景坐标（3dTile上的坐标点）
              startPosition = scene.pickPosition(startPosition);
              endPosition = scene.pickPosition(endPosition);
            } else if (target === 'globe') {
              //地标坐标（经纬度、高程）
              startPosition = globe.pick(camera.getPickRay(startPosition), scene);
              endPosition = globe.pick(camera.getPickRay(endPosition), scene);
            } else {
              //世界坐标（获取椭球面位置）
              startPosition = viewer.camera.pickEllipsoid(startPosition, ellipsoid);
              endPosition = viewer.camera.pickEllipsoid(endPosition, ellipsoid);
            }
            if (startPosition) {
              startPosition = ellipsoid.cartesianToCartographic(startPosition);
            }
            if (endPosition) {
              endPosition = ellipsoid.cartesianToCartographic(endPosition);
            }
            const result = {
              startPosition,
              endPosition,
            };
            cb(result);
            return;
          }
          case 'default': {
            const result = {
              startPosition,
              endPosition,
            };
            cb(result);
            return;
          }
          default: {
            throw Error('convert type error,type is ' + type);
          }
        }
      };
    } else if (event !== 'drag') {
      callback = (movement) => {
        const windowsPosition = movement.position;
        if (once) this.off(event, cb);
        switch (type) {
          case 'cartesian3': {
            let cartesian3 = null;
            //cartesian3
            if (target === 'scene') {
              //场景坐标（3dTile上的坐标点）
              cartesian3 = scene.pickPosition(windowsPosition);
            }
            if (target === 'globe') {
              //地标坐标（经纬度、高程）
              cartesian3 = globe.pick(camera.getPickRay(windowsPosition), scene);
            }
            if (target === 'camera') {
              //世界坐标（获取椭球面位置）
              cartesian3 = camera.pickEllipsoid(windowsPosition, ellipsoid);
            }
            const result = {
              windowsPosition,
              cartesian3,
            };
            cb(result);
            return;
          }
          case 'wgs84':
          case 'lonLat': {
            let cartesian3 = null;
            let cartographic = null;
            let wgs84 = null;
            //cartesian3
            if (target === 'scene') {
              //场景坐标（3dTile上的坐标点）
              cartesian3 = scene.pickPosition(windowsPosition);
            } else if (target === 'globe') {
              //地标坐标（经纬度、高程）
              cartesian3 = globe.pick(camera.getPickRay(windowsPosition), scene);
            } else {
              //世界坐标（获取椭球面位置）
              cartesian3 = viewer.camera.pickEllipsoid(windowsPosition, ellipsoid);
            }
            if (cartesian3) {
              //longitude<arc>,latitude<arc>,height<H>
              cartographic = ellipsoid.cartesianToCartographic(cartesian3);
            }
            if (cartographic) {
              wgs84 = {
                lat: Cesium.Math.toDegrees(cartographic.latitude),
                lon: Cesium.Math.toDegrees(cartographic.longitude),
                height: cartographic.height,
              };
            }
            const result = {
              windowsPosition,
              cartesian3,
              cartographic,
              wgs84,
            };
            cb(result);
            return;
          }
          case 'cartographic': {
            let cartesian3 = null;
            let cartographic = null;
            //cartesian3
            if (target === 'scene') {
              //场景坐标（3dTile上的坐标点）
              cartesian3 = scene.pickPosition(windowsPosition);
            } else if (target === 'globe') {
              //地标坐标（经纬度、高程）
              cartesian3 = globe.pick(camera.getPickRay(windowsPosition), scene);
            } else {
              //世界坐标（获取椭球面位置）
              cartesian3 = viewer.camera.pickEllipsoid(windowsPosition, ellipsoid);
            }
            if (cartesian3) {
              //longitude<arc>,latitude<arc>,height<H>
              cartographic = ellipsoid.cartesianToCartographic(cartesian3);
            }
            const result = {
              windowsPosition,
              cartesian3,
              cartographic,
            };
            cb(result);
            return;
          }
          case 'default': {
            const result = {
              windowsPosition,
            };
            cb(result);
            return;
          }
          default: {
            throw Error('convert type error,type is ' + type);
          }
        }
      };
    }
    this.callbackMap.set(cb, callback);
    return callback;
  }
  _getWrapperedCallback(cb) {
    if (this.callbackMap.has(cb)) {
      return this.callbackMap.get(cb);
    } else {
      return cb;
    }
  }
}

export default ViewerEvents;
