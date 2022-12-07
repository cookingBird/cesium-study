const path = require('path');

module.exports = {
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
	resolve: {
		extensions: ['.js', '.mjs', '.css'],
		fallback: {
			cesium: path.resolve(__dirname, 'Cesium/Source/Cesium.js'),
		},
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset',
			},
		],
	},
};
