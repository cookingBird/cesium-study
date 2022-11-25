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
export class Entity extends EntityController {
  _moveCancel = null;
  constructor(viewer, entity, options) {
    super(viewer, entity);
    this.entity = null;
    this.viewer = null;
    this.event = null;
    this.options = options;
    this.data = new DataManager(options);
    if (viewer && viewer instanceof Cesium.Viewer) {
      this.viewer = viewer;
      if (entity && entity instanceof Cesium.Entity) {
        this.entity = entity;
      } else if (entity === false) {
        this.entity = this.viewer.entities.add(this.options);
      } else {
        console.warn('CesiumEntity init require Cesium.Entity');
      }
      if (this.entity) {
        this.setEntity(this.entity);
      }
    } else {
      console.warn('CesiumEntity init require Cesium.Viewer');
    }
  }
  on(event, cb) {
    return this.event.on(event, cb);
  }
  off(event, cb) {
    return this.event.off(event, cb);
  }
  destory() {
    this.event.destory();
    super.remove();
    if (this.popup) {
      this.popup.remove();
    }
  }
  remove() {
    this.destory();
  }
  initEvent(viewer, entity) {
    return new Event(viewer, entity);
  }
  initDragEvents() {
    const drag = this.options.drag;
    if (drag === true) {
      this.on('leftdown', () => {
        if (this._moveCancel) this._moveCancel();
        this.viewer.scene.screenSpaceCameraController.enableRotate = false;
        this._moveCancel = this.on('moving', (result) => {
          this._updatePos(result.cartesian3);
        });
      });
      this.on('leftup', () => {
        this.viewer.scene.screenSpaceCameraController.enableRotate = true;
        this._moveCancel && this._moveCancel();
        this._moveCancel = null;
      });
    }
  }
  initPopEvents() {
    const pop = this.options.pop;
    if (pop) {
      this.on('click', (res) => {
        if (!this.popup) {
          this.popup = new CesiumPopup(pop).setPosition(res.position).addTo(this.viewer);
          this.popup.on('close', () => {
            this.popup = null;
          });
        } else {
          //重复点击更新位置
          this.popup.setPosition(res.position);
        }
      });
    }
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
      this.initPopEvents();
      this.initDragEvents();
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
