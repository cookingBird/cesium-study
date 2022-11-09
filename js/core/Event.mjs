
import CallbackRunner from '../utils/CallbackRunner.mjs';
import debounce from '../utils/debounce.mjs';
export default class Event {
	constructor(viewer,entity) {
		this.viewer = viewer;
		this.entity = entity;
		this.handler = null;
		this.picker = this.viewer.scene.pick;
		this.clickCbs = new CallbackRunner();
		this.postClick = new CallbackRunner();
		this.rightClickCbs = new CallbackRunner();
		this.postRightClick = new CallbackRunner();
		this.moveCbs = new CallbackRunner();
		this.postMove = new CallbackRunner();
		this.movingCbs = new CallbackRunner();
		this.postMoving = new CallbackRunner();
		this.movedCbs = new CallbackRunner();
		this.postMoved = new CallbackRunner();
		this.isMoving = false;
		this.movedConfirmor = 300;
	}
	initEvents () {
		this.handler = new Cesium.ScreenSpaceEventHandler(
			this.viewer.scene.canvas
		);
		handler.setInputAction((event) => {
			const picked = this.picker(event.position);
			if (Cesium.defined(picked) && pick.id.id === this.entity.id) {
				//cartesian2(screen 2D)  x,y
				const earthPosition = viewer.camera.pickEllipsoid(
					event.position,
					viewer.scene.globe.ellipsoid
				);
				//longitude<arc>,latitude<arc>,height<H>
				const cartographic = Cesium.Cartographic.fromCartesian(
					earthPosition,
					viewer.scene.globe.ellipsoid,
					new Cesium.Cartographic()
				);
				const cartesian3 = Cesium.Cartesian3.fromRadians(
					cartographic.longitude,
					cartographic.latitude,
					cartographic.height
				);
				//longitude<wgs84.lon>,latitude<wgs84.lon.lat>,height<H>
				const wgs84 = {
					lat: Cesium.Math.toDegrees(cartographic.latitude),
					lng: Cesium.Math.toDegrees(cartographic.longitude),
					height: cartographic.height
				}
				const result = this.postClick.reduce({
					cartesian2: earthPosition,
					cartesian3: cartesian3,
					cartographic: cartographic,
					wgs84: wgs84,
					entity: this.entity
				});
				this.clickCbs.run(result);
			}
		},Cesium.ScreenSpaceEventType.LEFT_CLICK);
		handler.setInputAction((event) => {
			const picked = this.picker(event.position);
			if (Cesium.defined(picked) && pick.id.id === this.entity.id) {
				//cartesian2(screen)  x,y
				const earthPosition = viewer.camera.pickEllipsoid(
					event.position,
					viewer.scene.globe.ellipsoid
				);
				//longitude<arc>,latitude<arc>,height<H>
				const cartographic = Cesium.Cartographic.fromCartesian(
					earthPosition,
					viewer.scene.globe.ellipsoid,
					new Cesium.Cartographic()
				);
				const cartesian3 = Cesium.Cartesian3.fromRadians(
					cartographic.longitude,
					cartographic.latitude,
					cartographic.height
				);
				//longitude<wgs84.lon>,latitude<wgs84.lon.lat>,height<H>
				const wgs84 = {
					lat: Cesium.Math.toDegrees(cartographic.latitude),
					lng: Cesium.Math.toDegrees(cartographic.longitude),
					height: cartographic.height
				}
				const result = this.postRightClick.reduce({
					cartesian2: earthPosition,
					cartesian3: cartesian3,
					cartographic: cartographic,
					wgs84: wgs84,
					entity: this.entity
				});
				this.rightClickCbs.run(result);
			}
		},Cesium.ScreenSpaceEventType.RIGHT_CLICK);
		handler.setInputAction((event) => {
			const picked = this.picker(event.position);
			if (Cesium.defined(picked) && pick.id.id === this.entity.id) {
				//cartesian2(screen)  x,y
				const earthPosition = viewer.camera.pickEllipsoid(
					event.position,
					viewer.scene.globe.ellipsoid
				);
				//longitude<arc>,latitude<arc>,height<H>
				const cartographic = Cesium.Cartographic.fromCartesian(
					earthPosition,
					viewer.scene.globe.ellipsoid,
					new Cesium.Cartographic()
				);
				const cartesian3 = Cesium.Cartesian3.fromRadians(
					cartographic.longitude,
					cartographic.latitude,
					cartographic.height
				);
				//longitude<wgs84.lon>,latitude<wgs84.lon.lat>,height<H>
				const wgs84 = {
					lat: Cesium.Math.toDegrees(cartographic.latitude),
					lng: Cesium.Math.toDegrees(cartographic.longitude),
					height: cartographic.height
				}
				const result = ({
					cartesian2: earthPosition,
					cartesian3: cartesian3,
					cartographic: cartographic,
					wgs84: wgs84,
					entity: this.entity
				});
				if (!this.isMoving) {
					this.moveCbs.run(this.postMove.reduce(result));
				}
				this.isMoving = true;
				this.movingCbs.run(this.postMoving.reduce(result));
				debounce(() => {
					this.movedCbs.run(this.postMoved.reduce(result));
					this.isMoving = false;
				},this.movedConfirmor)
			}
		},Cesium.ScreenSpaceEventType.MOUSE_MOVE);
	}
	on (event,callback) {
		switch (event) {
			case 'click':
				this.clickCbs.push(callback);
			case 'rightclick':
				this.rightClickCbs.push(callback);
			case 'moving':
				this.movingCbs.push(callback);
			case 'moved':
				this.movedCbs.push(callback);
			case 'move':
				this.moveCbs.push(callback);
			default:
				throw Error('on event type error;type is ' + event)
		}
	}
	off (event,callback) {
		switch (event) {
			case 'click':
				this.clickCbs.remove(callback);
			case 'rightclick':
				this.rightClickCbs.remove(callback);
			case 'moving':
				this.movingCbs.remove(callback);
			case 'moved':
				this.movedCbs.remove(callback);
			case 'move':
				this.moveCbs.remove(callback);
			default:
				throw Error('off event type error;type is ' + event)
		}
	}
	destory () {
		this.handler.destory()
	}
}
