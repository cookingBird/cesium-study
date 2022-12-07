const path = require('path');
const { merge } = require('webpack-merge');
const base = require('./webpack.config.base');

const prod = {
	mode: 'production',
	// devtool: 'source-map',
	entry: {
		// CesiumGraphic: path.resolve(__dirname, './js/Entity.js'),
		CesiumMeasure: path.resolve(__dirname, './plugin/cesium-measure.js'),
		// CesiumPopup: path.resolve(__dirname, './plugin/cesium-popup/CesiumPopup.js'),
	},
	output: {
		path: path.resolve(__dirname, 'Build'),
		filename: '[name].min.js',
		library: {
			name: '[name]',
			type: 'umd',
			// export: 'default',
			// auxiliaryComment: "Test Comment"
		},
	},
};

module.exports = merge(base, prod);
