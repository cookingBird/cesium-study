const path = require('path');

module.exports = {
	mode: 'development',
	entry: {
		Test: path.resolve(__dirname,'./js/test.js'),
		CesiumUtils: path.resolve(__dirname,'./js/Entity.js'),
	},
	output: {
		filename: "[name].js",
		library: {
			name: "[name]",
			type: "var",
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
