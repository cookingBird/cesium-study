import { Entity } from '../js/Entity';
import { debounce, merge } from 'lodash-es';
import icon from '/data/location4.png';
import CallbackProperty from '../js/utils/CallbackRunner.mjs';

export const VERSION = 1.0;

export default class CesiumPloylineEditorPlugin {
	_viewer = null;
	_polylineEntity = null;
	_options = null;
	_movePointerEntity = null;
	_updateCb = new CallbackProperty();
	_defaultOptions = {
		drag: true,
		billboard: {
			image: icon,
		},
	};
	constructor(viewer, polylineEntity, options) {
		this._viewer = viewer;
		this._updatePos = debounce(this._updatePos, 100, true);
		this._polylineEntity = polylineEntity;
		this._options = options;
		const img = this._options?.billboard?.image || icon;
		const position = this._options?.billboard?.position || 'center-bottom';
		this.getOffset(img, position).then((_) => {
			this._initPoint();
		});
	}
	getOffset(img, position) {
		const imgInstance = new Image();
		imgInstance.src = img;
		return new Promise((resolve, reject) => {
			imgInstance.onload = (res) => {
				const width = imgInstance.naturalHeight;
				const height = imgInstance.naturalWidth;
				const p = position?.split('-');
				let xOffset = 0;
				let yOffset = 0;
				if (p) {
					const xTag = p[0];
					const yTag = p[1];
					if (xTag) {
						if (xTag === 'left') {
							xOffset = -(width / 2);
						}
						if (xTag === 'center') {
							xOffset = 0;
						}
						if (xTag === 'right') {
							xOffset = width / 2;
						}
					}
					if (yTag) {
						if (yTag === 'top') {
							yOffset = height / 2;
						}
						if (yTag === 'middle') {
							yOffset = 0;
						}
						if (yTag === 'bottom') {
							yOffset = -(height / 2);
						}
					}
				}
				this._defaultOptions.billboard.pixelOffset = new Cesium.Cartesian2(
					xOffset,
					yOffset
				);
				console.log('_defaultOptions', this._defaultOptions);
				resolve();
			};
		});
	}
	onupdate(callback) {
		const has = this._updateCb.has(callback);
		return has ? has : () => this._updateCb.off(callback);
	}
	_getPostions() {
		const positions = this._polylineEntity.polyline.positions;
		if (positions instanceof Cesium.ConstantProperty) {
			const pos = positions._value;
			return pos;
		}
		if (positions instanceof Cesium.CallbackProperty) {
			const pos = position._callback();
			return pos;
		}
	}
	_initPoint() {
		const positions = this._getPostions();
		this._movePointerEntity = this._getPointsAndInitEvents(positions);
	}
	_updatePos(cartesian3Arr, cartesian3, index) {
		const viewer = this._viewer;
		const positions = cartesian3Arr.slice();
		positions.splice(index, 1, cartesian3);
		this._polylineEntity.polyline.positions = positions;
		//转换成经纬度坐标
		const wgs84Positions = positions.map((cartesian3) => {
			//longitude<arc>,latitude<arc>,height<H>
			const cartographic = Cesium.Cartographic.fromCartesian(
				cartesian3,
				viewer.scene.globe.ellipsoid,
				new Cesium.Cartographic()
			);
			//longitude<wgs84.lon>,latitude<wgs84.lon.lat>,height<H>
			const wgs84 = {
				lat: Cesium.Math.toDegrees(cartographic.latitude),
				lng: Cesium.Math.toDegrees(cartographic.longitude),
				height: cartographic.height,
			};
			return wgs84;
		});
		this._updateCb.run({
			positions,
			wgs84Positions,
		});
	}
	_getPointsAndInitEvents(cartesian3Arr) {
		//添加实体
		const entities = cartesian3Arr.map((cartesian3) => {
			return new Entity(this._viewer, false, {
				...merge(this._defaultOptions, this._options),
				position: cartesian3,
			});
		});
		//添加事件
		for (let index = 0; index < entities.length; index++) {
			const entity = entities[index];
			entity.on('drag', ({ cartesian3 }) => {
				const positions = this._getPostions();
				this._updatePos(positions, cartesian3, index);
			});
		}
		return entities;
	}
	destory() {
		this._movePointerEntity.forEach((entity) => {
			entity.destory();
		});
		this._updateCb.destory();
		this._updateCb = null;
		this._movePointerEntity = null;
		this._viewer = null;
		this._polylineEntity = null;
	}
}
