/**
 * @description 设置cesium entity hover样式
 * @param {Cesium.Viewer} viewer
 * @returns
 */
export function SetEntityCursor(viewer, hoverStyle = 'cursor') {
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction((event) => {
    const { endPosition } = event;
    const pickedObj = viewer.scene.pick(endPosition);
    if (!pickedObj) {
      const raw = viewer._container.style.cursor;
      if (raw !== 'default') {
        viewer._container.style.cursor = 'default';
      }
    } else {
      const raw = viewer._container.style.cursor;
      if (raw !== hoverStyle) {
        viewer._container.style.cursor = hoverStyle;
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  return function () {
    handler.destory();
  };
}
