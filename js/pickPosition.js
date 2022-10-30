function pickPosition (viewer,cb) {
	const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
	handler.setInputAction(function (event) {
		console.log("event.position---------------------------------",event.position);
		const earthPosition = viewer.camera.pickEllipsoid(
			event.position,
			viewer.scene.globe.ellipsoid
		);
		const cartographic = Cesium.Cartographic.fromCartesian(
			earthPosition,
			viewer.scene.globe.ellipsoid,
			new Cesium.Cartographic()
		);
		console.log("cartographic---------------------------------",cartographic);
		const lat = Cesium.Math.toDegrees(cartographic.latitude);
		const lng = Cesium.Math.toDegrees(cartographic.longitude);
		const height = cartographic.height;
		console.log('[Lng=>' + lng + ',Lat=>' + lat + ',H=>' + height + ']');
		cb && cb({
			lon: lon,lat: lat,height: height,
		})
	},Cesium.ScreenSpaceEventType.LEFT_CLICK);
}
