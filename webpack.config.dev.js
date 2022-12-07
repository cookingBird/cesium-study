const path = require('path');
const { merge } = require('webpack-merge');
const base = require('./webpack.config.base');

const dev = {
	mode: 'development',
	// devtool: 'eval',
	entry: {
		// CesiumGraphic: path.resolve(__dirname, './js/Entity.js'),
		// CesiumMeasure: path.resolve(__dirname, './plugin/cesium-measure.js'),
		// CesiumPopup: path.resolve(__dirname, './plugin/cesium-popup/CesiumPopup.js'),
		CesiumPolyEditorPlugin: path.resolve(__dirname, './plugin/cesium-poly-editor.js'),
	},
	output: {
		path: path.resolve(__dirname, 'Build'),
		filename: '[name].js',
		library: {
			name: '[name]',
			type: 'umd',
			export: 'default',
		},
		// globalObject: 'window',//default 'self'
		scriptType: 'text/javascript',
	},
};

module.exports = merge(base, dev);
