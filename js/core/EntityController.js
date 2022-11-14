export default class EntityController {
  constructor(viewer, entity) {
    if (viewer && viewer instanceof Cesium.Viewer) {
      this.viewer = viewer;
    }
    if (entity && entity instanceof Cesium.Entity) {
      this.entity = entity;
    }
  }
  show() {
    if (this.entity) {
      this.entity.show = true
    }
  }
  hide() {
    if (this.entity) {
      this.entity.show = false
    }
  }
  remove() {
    if (this.viewer && this.viewer instanceof Cesium.Viewer && this.entity && this.entity instanceof Cesium.Entity) {
      this.viewer.entities.remove(this.entity)
    }
  }
  setEntity(entity) {
    if (entity && entity instanceof Cesium.Entity) {
      this.entity = entity;
    }
  }
  updatePosition(lng, lat, height) {
    if (lng instanceof Cesium.Cartesian3) {
      this.entity.position = lng
    } else if (Array.isArray(lng)) {
      this.entity.position = new Cesium.Cartesian3.fromDegreesArray(lng)[0]
    } else {
      this.entity.position = new Cesium.Cartesian3.fromDegrees(lng, lat, height)
    }
  }
}