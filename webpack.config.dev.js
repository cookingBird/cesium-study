const path = require('path');

module.exports = {
	mode: 'development',
	entry: {
		Test: path.resolve(__dirname,'./js/test.js')
	},
	output: {
		library: "[name]",
		libraryTarget: "global",
		filename: "[name].js",
		auxiliaryComment: "Test Comment"
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
