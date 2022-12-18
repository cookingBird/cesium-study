/**
 * @author dengTao
 * @Date: 2022-11-1
 * @Last Modified by: dengTao
 * @Last Modified time: 2022-11-13
 ***********************************Cesium.Version 1.97*******************************************
 */
import Event from './core/Event.js';
import EntityController from './core/EntityController.js';
import DataManager from './core/DataManager.js';

export const VERSION = 1.0;

export class Entity extends EntityController {
  constructor(viewer, entity, options) {
    super(viewer, entity);
    this.listenersMap = new WeakMap();
    this.entity = null;
    this.viewer = null;
    this.event = null;
    this.options = options;
    this.data = new DataManager(options);
    if (viewer && viewer instanceof Cesium.Viewer) {
      this.viewer = viewer;
      if (entity && entity instanceof Cesium.Entity) {
        this.entity = entity;
      }
      if (entity === false) {
        this.entity = this.viewer.entities.add(this.options);
      }
      if (this.entity) {
        this.setEntity(this.entity);
      }
    } else {
      console.warn('CesiumEntity init require Cesium.Viewer');
    }
  }
  on(event, cb, options = {}) {
    if (this.listenersMap.has(cb)) return;
    const type = options.type || 'cartesian3';
    const target = options.target || 'camera'; //'globe' 'scene' 'camera'
    const once = options.once;
    const viewer = this.viewer;
    const camera = viewer.camera;
    const scene = viewer.scene;
    const globe = scene.globe;
    3;
    const ellipsoid = globe.ellipsoid;
    let callback = cb;
    if (event === 'move' || event === 'moving' || event === 'moved' || event === 'drag') {
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
              cartesian3: endPosition,
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
                lng: Cesium.Math.toDegrees(startPosition.longitude),
                height: startPosition.height,
              };
            }
            if (endPosition) {
              endPosition = {
                lat: Cesium.Math.toDegrees(endPosition.latitude),
                lng: Cesium.Math.toDegrees(endPosition.longitude),
                height: endPosition.height,
              };
            }
            const result = {
              startPosition,
              endPosition,
              wgs84: endPosition,
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
              cartographic: endPosition,
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
    } else {
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
                lng: Cesium.Math.toDegrees(cartographic.longitude),
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
    this.listenersMap.set(cb, callback);
    return this.event.on(event, callback);
  }
  off(event, cb) {
    const callback = this.listenersMap.get(cb);
    if (callback) {
      this.listenersMap.delete(cb);
      return this.event.off(event, callback);
    } else {
      throw Error("callback don't exist");
    }
  }
  destory() {
    super.remove();
    this.event.destory();
    this.listenersMap = null;
    if (this.popup) {
      this._popCallbackCancel();
      this._popCallbackCancel = null;
      this.popup.remove();
      this.popup = null;
    }
  }
  remove() {
    this.destory();
  }
  initEvent(viewer, entity) {
    return new Event(viewer, entity);
  }
  initDragEvents() {
    return this.on('drag', (result) => {
      this._updatePos(result.cartesian3);
    });
  }
  initPopEvents(pop) {
    const entity = this.entity;
    const viewer = this.viewer;
    const position = entity.position;
    return this.on('click', (res) => {
      if (!this.popup) {
        this.popup = new CesiumPopup(pop).setPosition(res.position).addTo(viewer);
        if (position instanceof Cesium.CallbackProperty) {
          const rawPositionCallback = entity.position._callback;
          this._popCallbackCancel = viewer.scene.postRender.addEventListener(() => {
            this.popup.setPosition(rawPositionCallback());
          });
        }
        this.popup.on('close', () => {
          this._popCallbackCancel();
          this._popCallbackCancel = null;
          this.popup = null;
        });
      } else {
        //重复点击更新位置
        this.popup.setPosition(res.position);
      }
    });
  }
  setViewer(viewer) {
    if (viewer && viewer instanceof Cesium.Viewer) {
      this.viewer = viewer;
      this.event.setViewer(this.viewer);
      this.viewer.entities.add(this.entity);
      this.popup.addTo(viewer);
    }
  }
  setEntity(entity) {
    if (entity instanceof Cesium.Entity) {
      if (!this.isEntityExist(entity)) {
        this.entity = this.viewer.entities.add(entity);
      }
      super.setEntity(this.entity);
      this.event = this.initEvent(this.viewer, this.entity);
      const drag = this.options.drag;
      if (drag === true) {
        this.initDragEvents();
      }
      const pop = this.options.pop;
      if (pop) {
        this.initPopEvents(pop);
      }
    } else {
      throw Error('CesiumGraphic entity type error');
    }
  }
  isEntityExist(entity) {
    if (this.viewer) {
      return !!this.viewer.entities.getById(entity._id);
    } else {
      throw Error("viewer don't exist");
    }
  }
  _updatePos(pos) {
    if (Cesium.defined(pos)) {
      this.entity.position = pos;
    }
  }
}

export default {
  Entity,
  VERSION,
};
