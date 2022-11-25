
/**
 * 笛卡尔空间直角坐标转WGS
 * @param { Cesium.Cartesian3 } cartesian3
 * @returns { WGS } {lon,lat,height}
 */
 export function wgsFromCartesian3(cartesian3) {
  //转弧度
  const cartographic = Cesium.Cartographic.fromCartesian(cartesian3);
  // let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian3);
  // const ellipsoid = viewer.scene.globe.ellipsoid;
  // const cartographic = ellipsoid.cartesianToCartographic(cartesian3);
  //根据弧度计算经纬度，高度
  let lat = Cesium.Math.toDegrees(cartographic.latitude);
  let lon = Cesium.Math.toDegrees(cartographic.longitude);
  let height = cartographic.height;
  return {
    lon: lon,
    lat: lat,
    height: height,
  };
}
/**
 * 屏幕坐标转WGS坐标，（包含椭球面、地形高度，不包含模型，倾斜摄影面高度）
 * @param { Cesium.Viewer } viewer 屏幕x坐标
 * @param {*} x 屏幕x坐标
 * @param {*} y 屏幕y坐标
 * @returns { WGS } {lon,lat,height}|undefined
 */
export function wgsFromWindowPosition(viewer, x, y) {
  return viewer.scene.globe.pick(viewer.camera.getPickRay(new Cesium.Cartesian2(Number(x), Number(y))), viewer.scene);
}

/**
 * @param { Cesium.Cartographic } cartographic 坐标弧度表示 Cesium.Cartographic
 * @returns { WGS }
 */
export function wgsFromCartographic(cartographic) {
  //构造Cartographic类
  // let cartographic = Cesium.Cartographic(lon, lat, height);
  //计算经纬度坐标表示
  return {
    lon: Cesium.Math.toDegrees(cartographic.longitude),
    lat: Cesium.Math.toDegrees(cartographic.latitude),
    height: cartographic.height,
  };
}

/**
 * 经纬度的弧度表示、高度，转笛卡尔空间直角坐标系；弧度=弧长/半径；(所以弧度的最大值为PI)
 * @param { float } lon 经度的弧度表示
 * @param { float } lat 纬度的弧度表示
 * @param { float } height 高度
 * @returns { Cartesian3 } 笛卡尔空间直角坐标
 */
export function cartesian3FromRadians(lon, lat, height) {
  return Cesium.Cartesian3.fromRadians(Number(lon), Number(lat), Number(height));
}

/**
 * 屏幕坐标转三维直角坐标（只包含椭球面坐标，不包含地形，模型，倾斜摄影面）
 * @param {*} cartesian2 屏幕二维直角坐标
 * @param {*} viewer
 * @returns {Cartesian3} 笛卡尔三维直角坐标
 */
export function cartesian3fromWindowPositionByPickEllipsoid(cartesian2, viewer) {
  return viewer.scene.camera.pickEllipsoid(cartesian2)
}


/**
 * @describe 屏幕坐标转三维直角坐标（既包含椭球面坐标，也包含地形，模型，倾斜摄影面）
 * @param {*} cartesian2 屏幕二维直角坐标
 * @param {*} viewer
 * @returns { Cartesian3 } 笛卡尔三维直角坐标
 */
export function cartesian3fromWindowPositionByPickPosition(cartesian2, viewer) {
  return viewer.scene.pickPosition(cartesian2)
}
/**
 * @describe 屏幕x,y转三维直角坐标（只求交地形，不包含模型等其它）
 * @param {*} cartesian2
 * @param {*} viewer
 * @returns {Cartesian3}
 */
export function cartesian3fromWindowPositionByPickRay(cartesian2, viewer) {
  return viewer.scene.globe.pick(viewer.camera.getPickRay(cartesian2), viewer.scene);
}


/**
 * 笛卡尔空间直角坐标系转平面坐标系
 * @param {Cesium.Cartesian3} cartesian3 笛卡尔空间直角坐标
 * @param {Cesium.Viewer} viewer
 * @returns { windowPosition } 屏幕坐标
 */
export function cartesian3ToWindowPosition(cartesian3, viewer) {
  return Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, cartesian3)
}

/**
 * @param {number} lng 经度
 * @param {number} lat 纬度
 * @param {number} height 高度
 * @returns { Cesium.Cartesian3 }
 */
export function cartesian3FromWGS(lng, lat, height) {
  return Cesium.Cartesian3.fromDegrees(Number(lng), Number(lat), Number(height))
}
