const path = require('path');

module.exports = {
	mode: 'development',
	entry: {
		CesiumGraphic: path.resolve(__dirname, './js/Entity.js'),
		CesiumMeasure: path.resolve(__dirname, './plugin/cesium-measure.js'),
	},
	output: {
		path: path.resolve(__dirname, 'Build'),
		filename: "[name].js",
		library: {
			name: "[name]",
			type: "var",
			// export: 'default'
			// auxiliaryComment: "Test Comment"
		},
		scriptType: 'text/javascript'
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ['@babel/preset-env']
					}
				}
			}
		]
	}
}
