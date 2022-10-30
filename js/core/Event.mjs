
import CallbackRunner from './CallbackRunner.mjs';
export default class Event {
	constructor(viewer) {
		this.viewer = viewer;
		this.clickCbs = new CallbackRunner();
		this.doubleClickCbs = new CallbackRunner();
		this.rightClickCbs = new CallbackRunner();
		this.dragStartCbs = new CallbackRunner();
		this.draggingCbs = new CallbackRunner();
		this.dragEndCbs = new CallbackRunner();
	}
	initEvents () {
		const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
		handler.setInputAction(function (event) {
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
			console.log("cartographic---------------------------------",cartographic);
			//longitude<wgs84.lon>,latitude<wgs84.lon.lat>,height<H>
			const lat = Cesium.Math.toDegrees(cartographic.latitude);
			const lng = Cesium.Math.toDegrees(cartographic.longitude);
			const height = cartographic.height;
			this.clickCbs.run({
				lon: lng,
				lat: lat,
				height: height
			});
		},Cesium.ScreenSpaceEventType.LEFT_CLICK);
	}
	on (event,callback) {

	}
}
