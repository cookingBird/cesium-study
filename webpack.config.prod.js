const path = require('path');

module.exports = {
	mode: 'production',
	entry: {
		CesiumGraphic: path.resolve(__dirname,'./js/MyEntity.js'),
	},
	output: {
		filename: "[name].min.js",
		library: {
			name: "[name]",
			type: "var",
			// auxiliaryComment: "Test Comment"
		},
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
