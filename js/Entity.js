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
		this.entity = null;
		this.viewer = null;
		this.event = null;
		this.options = options;
		this.data = new DataManager(options);
		if (viewer && viewer instanceof Cesium.Viewer) {
			this.viewer = viewer;
			if (entity && entity instanceof Cesium.Entity) {
				this.entity = entity;
			} else if (!entity) {
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
		this.__cursorHandler.destory();
		super.remove();
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
	setCursor() {
		const viewer = this.viewer;
		const cursor = this.options.cursor || 'pointer';
		this.on('moving', () => {
			const raw = viewer._container.style.cursor;
			if (raw !== cursor) {
				viewer._container.style.cursor = cursor;
			}
		});
		//不在entity上时，cursor为默认样式；
		if (!this.__cursorHandler) {
			const viewer = this.viewer;
			const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
			this.__cursorHandler = handler;
			handler.setInputAction((event) => {
				const { endPosition } = event;
				const pickedObj = viewer.scene.pick(endPosition);
				if (!pickedObj) {
					const raw = viewer._container.style.cursor;
					if (raw !== 'default') {
						viewer._container.style.cursor = 'default';
					}
				}
			}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
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
			const drag = this.options.drag;
			if (drag === true) {
				this.initDragEvents();
			}
			const pop = this.options.pop;
			if (pop) {
				this.initPopEvents(pop);
			}
			this.setCursor();
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
