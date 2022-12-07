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
		this.postClick = new CallbackRunner();
		//LEFT_DOUBLE_CLICK
		this.doubleClickCbs = new CallbackRunner();
		this.postDoubleClick = new CallbackRunner();
		//RIGHT_CLICK
		this.rightClickCbs = new CallbackRunner();
		this.postRightClick = new CallbackRunner();
		//MOUSE_MOVE start EVENTS
		this.moveCbs = new CallbackRunner();
		this.postMove = new CallbackRunner();
		//MOUSE_MOVE EVENTS
		this.movingCbs = new CallbackRunner();
		this.postMoving = new CallbackRunner();
		//MOUSE_MOVE end EVENTS
		this.movedCbs = new CallbackRunner();
		this.postMoved = new CallbackRunner();
		//LEFT_DOWN EVENTS
		this.leftDownCbs = new CallbackRunner();
		this.postLeftDownCbs = new CallbackRunner();
		//LEFT_UP EVENTS
		this.leftUpCbs = new CallbackRunner();
		this.postLeftUpCbs = new CallbackRunner();
		//RIGHT_DOWN EVENTS
		this.rightDownCbs = new CallbackRunner();
		this.postRightDownCbs = new CallbackRunner();
		//RIGHT_UP EVENTS
		this.rightUpCbs = new CallbackRunner();
		this.postRightUpCbs = new CallbackRunner();
		//MOUSE_MOVE EVENTS
		this.mouseMoveCbs = new CallbackRunner();
		this.postMouseMoveCbs = new CallbackRunner();
		//MIDDLE_CLICK EVENTS
		this.middleClickCbs = new CallbackRunner();
		this.postMiddleClickCbs = new CallbackRunner();
		//WHEEL EVENTS
		this.wheelCbs = new CallbackRunner();
		this.postWheelCbs = new CallbackRunner();
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
		//******************************LEFT_CLICK */
		handler.setInputAction((event) => {
			const { position } = event;
			const pickedObj = viewer.scene.pick(position);
			if (Cesium.defined(pickedObj) && pickedObj.id.id === entity.id) {
				//xy
				const pxPosition = viewer.scene.pickPosition(position);
				//cartesian3
				const cartesian3 = viewer.camera.pickEllipsoid(
					position,
					viewer.scene.globe.ellipsoid
				);
				//longitude<arc>,latitude<arc>,height<H>
				const cartographic =
					cartesian3 &&
					Cesium.Cartographic.fromCartesian(
						cartesian3,
						viewer.scene.globe.ellipsoid,
						new Cesium.Cartographic()
					);
				// const cartesian3 = Cesium.Cartesian3.fromRadians(
				// 	cartographic.longitude,
				// 	cartographic.latitude,
				// 	cartographic.height
				// );
				//longitude<wgs84.lon>,latitude<wgs84.lon.lat>,height<H>
				const wgs84 = cartesian3 && {
					lat: Cesium.Math.toDegrees(cartographic.latitude),
					lng: Cesium.Math.toDegrees(cartographic.longitude),
					height: cartographic.height,
				};
				const result = this.postClick.reduce({
					position: pxPosition,
					cartesian2: position,
					cartesian3: cartesian3,
					cartographic: cartographic,
					wgs84: wgs84,
					entity: entity,
				});
				this.clickCbs.run(result);
			}
		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
		//*******************************LEFT_DOUBLE_CLICK */
		handler.setInputAction((event) => {
			const { position } = event;
			const pickedObj = viewer.scene.pick(position);
			if (Cesium.defined(pickedObj) && pickedObj.id.id === entity.id) {
				//xy
				const pxPosition = viewer.scene.pickPosition(position);
				//cartesian3
				const cartesian3 = viewer.camera.pickEllipsoid(
					position,
					viewer.scene.globe.ellipsoid
				);
				//longitude<arc>,latitude<arc>,height<H>
				const cartographic =
					cartesian3 &&
					Cesium.Cartographic.fromCartesian(
						cartesian3,
						viewer.scene.globe.ellipsoid,
						new Cesium.Cartographic()
					);
				const wgs84 = cartesian3 && {
					lat: Cesium.Math.toDegrees(cartographic.latitude),
					lng: Cesium.Math.toDegrees(cartographic.longitude),
					height: cartographic.height,
				};
				const result = this.postDoubleClick.reduce({
					position: pxPosition,
					cartesian2: position,
					cartesian3: cartesian3,
					cartographic: cartographic,
					wgs84: wgs84,
					entity: entity,
				});
				this.doubleClickCbs.run(result);
			}
		}, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
		//******************************RIGHT_CLICK */
		handler.setInputAction(({ position }) => {
			const pickedObj = viewer.scene.pick(position);
			if (Cesium.defined(pickedObj) && pickedObj.id.id === entity.id) {
				//xy
				const pxPosition = viewer.scene.pickPosition(position);
				//cartesian3
				const cartesian3 = viewer.camera.pickEllipsoid(
					position,
					viewer.scene.globe.ellipsoid
				);
				//longitude<arc>,latitude<arc>,height<H>
				const cartographic =
					cartesian3 &&
					Cesium.Cartographic.fromCartesian(
						cartesian3,
						viewer.scene.globe.ellipsoid,
						new Cesium.Cartographic()
					);
				// const cartesian3 = Cesium.Cartesian3.fromRadians(
				// 	cartographic.longitude,
				// 	cartographic.latitude,
				// 	cartographic.height
				// );
				//longitude<wgs84.lon>,latitude<wgs84.lon.lat>,height<H>
				const wgs84 = cartesian3 && {
					lat: Cesium.Math.toDegrees(cartographic.latitude),
					lng: Cesium.Math.toDegrees(cartographic.longitude),
					height: cartographic.height,
				};
				const result = this.postRightClick.reduce({
					position: pxPosition,
					cartesian2: position,
					cartesian3: cartesian3,
					cartographic: cartographic,
					wgs84: wgs84,
					entity: entity,
				});
				this.rightClickCbs.run(result);
			}
		}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
		//******************************MOUSE_MOVE */
		handler.setInputAction(({ endPosition }) => {
			const pickedObj = viewer.scene.pick(endPosition);
			if (Cesium.defined(pickedObj) && pickedObj.id.id === entity.id) {
				//xy
				const pxPosition = viewer.scene.pickPosition(endPosition);
				//cartesian3
				const cartesian3 = viewer.camera.pickEllipsoid(
					endPosition,
					viewer.scene.globe.ellipsoid
				);
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
					cartesian2: endPosition,
					cartesian3: cartesian3,
					cartographic: cartographic,
					wgs84: wgs84,
					entity: entity,
				};
				if (!this.isMoving) {
					this.moveCbs.run(this.postMove.reduce(result));
				}
				this.isMoving = true;
				this.movingCbs.run(this.postMoving.reduce(result));
				debounce(() => {
					this.movedCbs.run(this.postMoved.reduce(result));
					this.isMoving = false;
				}, this.movedConfirmTimer);
			}
		}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
		//******************************LEFT_DOWN */
		handler.setInputAction(({ position }) => {
			const pickedObj = viewer.scene.pick(position);
			if (Cesium.defined(pickedObj) && pickedObj.id.id === entity.id) {
				//xy
				const pxPosition = viewer.scene.pickPosition(position);
				//cartesian3
				const cartesian3 = viewer.camera.pickEllipsoid(
					position,
					viewer.scene.globe.ellipsoid
				);
				//longitude<arc>,latitude<arc>,height<H>
				const cartographic =
					cartesian3 &&
					Cesium.Cartographic.fromCartesian(
						cartesian3,
						viewer.scene.globe.ellipsoid,
						new Cesium.Cartographic()
					);
				// const cartesian3 = Cesium.Cartesian3.fromRadians(
				// 	cartographic.longitude,
				// 	cartographic.latitude,
				// 	cartographic.height
				// );
				//longitude<wgs84.lon>,latitude<wgs84.lon.lat>,height<H>
				const wgs84 = cartesian3 && {
					lat: Cesium.Math.toDegrees(cartographic.latitude),
					lng: Cesium.Math.toDegrees(cartographic.longitude),
					height: cartographic.height,
				};
				const result = {
					position: pxPosition,
					cartesian2: position,
					cartesian3: cartesian3,
					cartographic: cartographic,
					wgs84: wgs84,
					entity: entity,
				};
				this.leftDownCbs.run(this.postLeftDownCbs.reduce(result));
			}
		}, Cesium.ScreenSpaceEventType.LEFT_DOWN);
		//******************************LEFT_UP */
		handler.setInputAction(({ position }) => {
			const pickedObj = viewer.scene.pick(position);
			if (Cesium.defined(pickedObj) && pickedObj.id.id === entity.id) {
				//xy
				const pxPosition = viewer.scene.pickPosition(position);
				//cartesian3
				const cartesian3 = viewer.camera.pickEllipsoid(
					position,
					viewer.scene.globe.ellipsoid
				);
				//longitude<arc>,latitude<arc>,height<H>
				const cartographic =
					cartesian3 &&
					Cesium.Cartographic.fromCartesian(
						cartesian3,
						viewer.scene.globe.ellipsoid,
						new Cesium.Cartographic()
					);
				// const cartesian3 = Cesium.Cartesian3.fromRadians(
				// 	cartographic.longitude,
				// 	cartographic.latitude,
				// 	cartographic.height
				// );
				//longitude<wgs84.lon>,latitude<wgs84.lon.lat>,height<H>
				const wgs84 = cartesian3 && {
					lat: Cesium.Math.toDegrees(cartographic.latitude),
					lng: Cesium.Math.toDegrees(cartographic.longitude),
					height: cartographic.height,
				};
				const result = {
					position: pxPosition,
					cartesian2: position,
					cartesian3: cartesian3,
					cartographic: cartographic,
					wgs84: wgs84,
					entity: entity,
				};
				this.leftUpCbs.run(this.postLeftUpCbs.reduce(result));
			}
		}, Cesium.ScreenSpaceEventType.LEFT_UP);
		//******************************RIGHT_DOWN */
		handler.setInputAction(({ position }) => {
			const pickedObj = viewer.scene.pick(position);
			if (Cesium.defined(pickedObj) && pickedObj.id.id === entity.id) {
				//xy
				const pxPosition = viewer.scene.pickPosition(position);
				//cartesian3
				const cartesian3 = viewer.camera.pickEllipsoid(
					position,
					viewer.scene.globe.ellipsoid
				);
				//longitude<arc>,latitude<arc>,height<H>
				const cartographic =
					cartesian3 &&
					Cesium.Cartographic.fromCartesian(
						cartesian3,
						viewer.scene.globe.ellipsoid,
						new Cesium.Cartographic()
					);
				// const cartesian3 = Cesium.Cartesian3.fromRadians(
				// 	cartographic.longitude,
				// 	cartographic.latitude,
				// 	cartographic.height
				// );
				//longitude<wgs84.lon>,latitude<wgs84.lon.lat>,height<H>
				const wgs84 = cartesian3 && {
					lat: Cesium.Math.toDegrees(cartographic.latitude),
					lng: Cesium.Math.toDegrees(cartographic.longitude),
					height: cartographic.height,
				};
				const result = {
					position: pxPosition,
					cartesian2: position,
					cartesian3: cartesian3,
					cartographic: cartographic,
					wgs84: wgs84,
					entity: entity,
				};
				this.rightDownCbs.run(this.postRightDownCbs.reduce(result));
			}
		}, Cesium.ScreenSpaceEventType.RIGHT_DOWN);
		//******************************RIGHT_UP */
		handler.setInputAction(({ position }) => {
			const pickedObj = viewer.scene.pick(position);
			if (Cesium.defined(pickedObj) && pickedObj.id.id === entity.id) {
				//xy
				const pxPosition = viewer.scene.pickPosition(position);
				//cartesian3
				const cartesian3 = viewer.camera.pickEllipsoid(
					position,
					viewer.scene.globe.ellipsoid
				);
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
					cartesian2: position,
					cartesian3: cartesian3,
					cartographic: cartographic,
					wgs84: wgs84,
					entity: entity,
				};
				this.rightUpCbs.run(this.postRightUpCbs.reduce(result));
			}
		}, Cesium.ScreenSpaceEventType.RIGHT_UP);
		//******************************MIDDLE_CLICK */
		handler.setInputAction(({ position }) => {
			const pickedObj = viewer.scene.pick(position);
			if (Cesium.defined(pickedObj) && pickedObj.id.id === entity.id) {
				//xy
				const pxPosition = viewer.scene.pickPosition(position);
				//cartesian3
				const cartesian3 = viewer.camera.pickEllipsoid(
					position,
					viewer.scene.globe.ellipsoid
				);
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
					cartesian2: position,
					cartesian3: cartesian3,
					cartographic: cartographic,
					wgs84: wgs84,
					entity: entity,
				};
				this.middleClickCbs.run(this.postMiddleClickCbs.reduce(result));
			}
		}, Cesium.ScreenSpaceEventType.MIDDLE_CLICK);
		//******************************WHEEL */
		handler.setInputAction((res) => {
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
			this.wheelCbs.run(this.postWheelCbs.reduce(result));
		}, Cesium.ScreenSpaceEventType.WHEEL);
	}
	on(event, callback) {
		let has = void 0;
		switch (event) {
			case 'click':
				has = this.clickCbs.has(callback);
				return has ? has : this.clickCbs.push(callback);
			case 'doubleclick':
				has = this.doubleClickCbs.has(callback);
				return has ? has : this.doubleClickCbs.push(callback);
			case 'rightclick':
				has = this.rightClickCbs.has(callback);
				return has ? has : this.rightClickCbs.push(callback);
			case 'move':
				has = this.moveCbs.has(callback);
				return has ? has : this.moveCbs.push(callback);
			case 'moving':
				has = this.movingCbs.has(callback);
				return has ? has : this.movingCbs.push(callback);
			case 'moved':
				has = this.movedCbs.has(callback);
				return has ? has : this.movedCbs.push(callback);
			case 'leftdown':
				has = this.leftDownCbs.has(callback);
				return has ? has : this.leftDownCbs.push(callback);
			case 'leftup':
				has = this.leftUpCbs.has(callback);
				return has ? has : this.leftUpCbs.push(callback);
			case 'rightdown':
				has = this.rightDownCbs.has(callback);
				return has ? has : this.rightDownCbs.push(callback);
			case 'rightup':
				has = this.rightUpCbs.has(callback);
				return has ? has : this.rightUpCbs.push(callback);
			case 'middleclick':
				has = this.middleClickCbs.has(callback);
				return has ? has : this.middleClickCbs.push(callback);
			case 'wheel':
				has = this.wheelCbs.has(callback);
				return has ? has : this.wheelCbs.push(callback);
			case 'drag':
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
		this.postClick.destory();
		//RIGHT_CLICK
		this.rightClickCbs.destory();
		this.postRightClick.destory();
		//start move EVENTS
		this.moveCbs.destory();
		this.postMove.destory();
		//moving EVENTS
		this.movingCbs.destory();
		this.postMoving.destory();
		//moved EVENTS
		this.movedCbs.destory();
		this.postMoved.destory();
		//LEFT_DOWN EVENTS
		this.leftDownCbs.destory();
		this.postLeftDownCbs.destory();
		//LEFT_UP EVENTS
		this.leftUpCbs.destory();
		this.postLeftUpCbs.destory();
		//RIGHT_DOWN EVENTS
		this.rightDownCbs.destory();
		this.postRightDownCbs.destory();
		//RIGHT_UP EVENTS
		this.rightUpCbs.destory();
		this.postRightUpCbs.destory();
	}
	initDragEvents() {
		this.on('leftdown', () => {
			if (this._moveCancel) this._moveCancel();
			this.viewer.scene.screenSpaceCameraController.enableRotate = false;
			this._moveCancel = this.on('moving', (result) => {
				this.dragCbs.run(result);
			});
		});
		this.on('leftup', () => {
			this.viewer.scene.screenSpaceCameraController.enableRotate = true;
			this._moveCancel && this._moveCancel();
			this._moveCancel = null;
		});
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
