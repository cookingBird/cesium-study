import Event from "./core/Event.js"
function MyEntity (viewer,options) {
	this.viewer = viewer;
	this.options = options;
	this.position = Cesium.Cartesian3.fromDegrees(
		options.position[0],options.position[1],options.position[2]
	);
	this.draggable = !!options.draggable;
	if (this.draggable) {
		this.initDragEvents();
	}
	this.entity = new Cesium.Entity({
		...options,
		position: new Cesium.CallbackProperty(
			() => (this.position),
			this.draggable
		)
	});
	this.event = new Event(viewer,this.entity);
	this.viewer.entities.add(this.entity);
}

MyEntity.prototype.on = function (event,cb) {
	this.event.on(event.cb)
};
MyEntity.prototype.off = function (event,cb) {
	this.event.off(event.cb)
};
MyEntity.prototype.remove = function () {
	this.event.destory();
	this.viewer.entities.remove(this.entity);
}
MyEntity.prototype.initDragEvents = function () {
	this.on('move',(result) => {
		this.position = result.cartesian3
	})
}
MyEntity.prototype.update = function (position) {
	this.position = Cesium.Cartesian3.fromDegrees(
		position[0],position[1],position[2])
}
MyEntity.prototype.show = function () {
	this.entity.show = true
}
MyEntity.prototype.hidden = function () {
	this.entity.show = false
}
