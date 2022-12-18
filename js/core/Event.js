/**
 * @author dengTao
 * @Date: 2022-11-1
 * @Last Modified by: dengTao
 * @Last Modified time: 2022-11-14
 */
import CallbackRunner from '../utils/CallbackRunner.mjs';
import debounce from '../utils/debounce.mjs';
import * as Validator from '../utils/validType.js';
import * as Transform from '../utils/PositionTransform';
export default class Event {
  _handler = null;
  handler = null;
  constructor(viewer, entity) {
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
    if (viewer && viewer instanceof Cesium.Viewer) {
      this.viewer = viewer;
    }
    if (entity && entity instanceof Cesium.Entity) {
      this.entity = entity;
    }

    this.isMoving = false;
    this.movedConfirmTimer = 500;
    if (this.viewer && this.entity) {
      this.initEvents(this.viewer, this.entity);
      this.initDragEvents();
    }
  }
  initEvents(viewer, entity) {
    this._handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    const handler = this._handler;
    this.handler = handler;
  }
  //******************************LEFT_CLICK */
  initLeftClick() {
    const viewer = this.viewer;
    const entity = this.entity;
    this.handler.setInputAction((movement) => {
      const { position } = movement;
      const pickedObj = viewer.scene.pick(position);
      if (Cesium.defined(pickedObj) && pickedObj.id.id === entity.id) {
        this.clickCbs.run(movement);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    return true;
  }
  //*******************************LEFT_DOUBLE_CLICK */
  initLeftDoubleClick() {
    const viewer = this.viewer;
    const entity = this.entity;
    this.handler.setInputAction((movement) => {
      const { position } = movement;
      const pickedObj = viewer.scene.pick(position);
      if (Cesium.defined(pickedObj) && pickedObj.id.id === entity.id) {
        this.doubleClickCbs.run(movement);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    return true;
  }
  //******************************RIGHT_CLICK */
  initRightClick() {
    const viewer = this.viewer;
    const entity = this.entity;
    this.handler.setInputAction((movement) => {
      const { position } = movement;
      const pickedObj = viewer.scene.pick(position);
      if (Cesium.defined(pickedObj) && pickedObj.id.id === entity.id) {
        this.rightClickCbs.run(movement);
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    return true;
  }
  //******************************MOUSE_MOVE */
  initMove() {
    const viewer = this.viewer;
    const entity = this.entity;
    this.handler.setInputAction((movement) => {
      const { endPosition } = movement;
      const pickedObj = viewer.scene.pick(endPosition);
      if (Cesium.defined(pickedObj) && pickedObj.id.id === entity.id) {
        if (!this.isMoving) {
          this.moveCbs.run(movement);
        }
        this.isMoving = true;
        this.movingCbs.run(movement);
        debounce(() => {
          this.movedCbs.run(movement);
          this.isMoving = false;
        }, this.movedConfirmTimer);
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    return true;
  }
  //******************************LEFT_DOWN */
  initLeftDown() {
    const viewer = this.viewer;
    const entity = this.entity;
    this.handler.setInputAction((movement) => {
      const { position } = movement;
      const pickedObj = viewer.scene.pick(position);
      if (Cesium.defined(pickedObj) && pickedObj.id.id === entity.id) {
        this.leftDownCbs.run(movement);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    return true;
  }
  //******************************LEFT_UP */
  initLeftUp() {
    const viewer = this.viewer;
    const entity = this.entity;
    this.handler.setInputAction((movement) => {
      const { position } = movement;
      const pickedObj = viewer.scene.pick(position);
      if (Cesium.defined(pickedObj) && pickedObj.id.id === entity.id) {
        this.leftUpCbs.run(movement);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_UP);
    return true;
  }
  //******************************RIGHT_DOWN */
  initRightDown() {
    const viewer = this.viewer;
    const entity = this.entity;
    this.handler.setInputAction((movement) => {
      const { position } = movement;
      const pickedObj = viewer.scene.pick(position);
      if (Cesium.defined(pickedObj) && pickedObj.id.id === entity.id) {
        this.rightDownCbs.run(movement);
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_DOWN);
    return true;
  }
  //******************************RIGHT_UP */
  initRightUp() {
    const viewer = this.viewer;
    const entity = this.entity;
    this.handler.setInputAction((movement) => {
      const { position } = movement;
      const pickedObj = viewer.scene.pick(position);
      if (Cesium.defined(pickedObj) && pickedObj.id.id === entity.id) {
        this.rightUpCbs.run(movement);
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_UP);
    return true;
  }
  //******************************WHEEL */
  initWheel() {
    const viewer = this.viewer;
    const entity = this.entity;
    this.handler.setInputAction((res) => {
      // res < zoom >
      //cartesian3
      let cartesian3 = this.entity.position;
      if (cartesian3 instanceof Cesium.CallbackProperty) {
        cartesian3 = cartesian3._callback();
      }
      //xy
      const pxPosition = Transform.cartesian3ToWindowPosition(cartesian3, this.viewer);
      //longitude<arc>,latitude<arc>,height<H>
      const cartographic =
        cartesian3 &&
        Cesium.Cartographic.fromCartesian(
          cartesian3,
          viewer.scene.globe.ellipsoid,
          new Cesium.Cartographic()
        );
      //longitude<wgs84.lon>,latitude<wgs84.lon.lat>,height<H>
      const wgs84 = cartesian3 && {
        lat: Cesium.Math.toDegrees(cartographic.latitude),
        lng: Cesium.Math.toDegrees(cartographic.longitude),
        height: cartographic.height,
      };
      const result = {
        position: pxPosition,
        cartesian2: pxPosition,
        cartesian3: cartesian3,
        cartographic: cartographic,
        zoom: res,
        wgs84: wgs84,
        entity: entity,
      };
      this.wheelCbs.run(result);
    }, Cesium.ScreenSpaceEventType.WHEEL);
    return true;
  }
  //******************************MIDDLE_CLICK */
  initMiddleClick() {
    const viewer = this.viewer;
    const entity = this.entity;
    this.handler.setInputAction((movement) => {
      const { position } = movement;
      const pickedObj = viewer.scene.pick(position);
      if (Cesium.defined(pickedObj) && pickedObj.id.id === entity.id) {
        this.middleClickCbs.run(movement);
      }
    }, Cesium.ScreenSpaceEventType.MIDDLE_CLICK);
    return true;
  }
  on(event, callback) {
    let has = void 0;
    switch (event) {
      case 'click':
        if (!this._isInitLeftClick) {
          this._isInitLeftClick = this.initLeftClick();
        }
        has = this.clickCbs.has(callback);
        return has ? has : this.clickCbs.push(callback);
      case 'doubleclick':
        if (!this._isInitLeftDoubleClick) {
          this._isInitLeftDoubleClick = this.initLeftDoubleClick();
        }
        has = this.doubleClickCbs.has(callback);
        return has ? has : this.doubleClickCbs.push(callback);
      case 'rightclick':
        if (!this._isInitRightClick) {
          this._isInitRightClick = this.initRightClick();
        }
        has = this.rightClickCbs.has(callback);
        return has ? has : this.rightClickCbs.push(callback);
      case 'move':
        if (!this._isInitMove) {
          this._isInitMove = this.initMove();
        }
        has = this.moveCbs.has(callback);
        return has ? has : this.moveCbs.push(callback);
      case 'moving':
        if (!this._isInitMove) {
          this._isInitMove = this.initMove();
        }
        has = this.movingCbs.has(callback);
        return has ? has : this.movingCbs.push(callback);
      case 'moved':
        if (!this._isInitMove) {
          this._isInitMove = this.initMove();
        }
        has = this.movedCbs.has(callback);
        return has ? has : this.movedCbs.push(callback);
      case 'leftdown':
        if (!this._isInitLeftDown) {
          this._isInitLeftDown = this.initLeftDown();
        }
        has = this.leftDownCbs.has(callback);
        return has ? has : this.leftDownCbs.push(callback);
      case 'leftup':
        if (!this._isInitLeftUp) {
          this._isInitLeftUp = this.initLeftUp();
        }
        has = this.leftUpCbs.has(callback);
        return has ? has : this.leftUpCbs.push(callback);
      case 'rightdown':
        if (!this._isInitRightDown) {
          this._isInitRightDown = this.initRightDown();
        }
        has = this.rightDownCbs.has(callback);
        return has ? has : this.rightDownCbs.push(callback);
      case 'rightup':
        if (!this._isInitRightUp) {
          this._isInitRightUp = this.initRightUp();
        }
        has = this.rightUpCbs.has(callback);
        return has ? has : this.rightUpCbs.push(callback);
      case 'middleclick':
        if (!this._isInitMiddleClick) {
          this._isInitMiddleClick = this.initMiddleClick();
        }
        has = this.middleClickCbs.has(callback);
        return has ? has : this.middleClickCbs.push(callback);
      case 'wheel':
        if (!this._isInitWheel) {
          this._isInitWheel = this.initWheel();
        }
        has = this.wheelCbs.has(callback);
        return has ? has : this.wheelCbs.push(callback);
      case 'drag':
        if (!this._isInitDrag) {
          this._isInitDrag = this.initDragEvents();
        }
        has = this.dragCbs.has(callback);
        return has ? has : this.dragCbs.push(callback);
      default:
        throw Error('on event type error;type is ' + event);
    }
  }
  off(event, callback) {
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
  initDragEvents() {
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
      this.__dragLeftUp.destroy();
      this.__dragLeftUp = null;
    }
  }
  setViewer(viewer) {
    if (viewer && viewer instanceof Cesium.Viewer) {
      this.viewer = viewer;
    } else {
      const type = Validator.typeIs(viewer);
      throw Error(`setViewer Error, type is ${type}`);
    }
    if (this.entity) {
      this.initEvents(this.viewer, this.entity);
    }
  }
  setEntity(entity) {
    if (entity && entity instanceof Cesium.Entity) {
      this.entity = entity;
    } else {
      const type = Validator.typeIs(entity);
      throw Error(`setViewer Error, type is ${type}`);
    }
    if (this.viewer) {
      this.initEvents(this.viewer, this.entity);
      this.initDragEvents();
    }
  }
}
