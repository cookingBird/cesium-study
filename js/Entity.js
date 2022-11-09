import Event from "./core/event.mjs"
export class Entity {
	constructor(viewer,options) {
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
		this.viewer.entities.add(this.entity)
	}
	on (event,cb) {
		this.event.on(event.cb)
	}
	off (event,cb) {
		this.event.off(event.cb)
	}
	remove () {
		this.event.destory();
		this.viewer.entities.remove(this.entity);
	}
	show () {
		this.entity.show = true
	}
	hidden () {
		this.entity.show = false
	}
	initDragEvents () {
		this.on('move',(result) => {
			this.position = result.cartesian3
		})
	}
	/**
	 * 
	 * @param {array} position 
	 * @param {string} position[0]  lng
	 * @param {string} position[1] lat 
	 * @param {string} position[2] height
	 */
	update (position) {
		this.position = Cesium.Cartesian3.fromDegrees(
			position[0],position[1],position[2])
	}
}
