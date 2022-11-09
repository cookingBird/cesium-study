const path = require('path');

module.exports = {
	mode: 'production',
	entry: {
		MyEntity: path.resolve(__dirname,'./js/MyEntity.js'),
		Test: path.resolve(__dirname,'./js/test.js')
	},
	output: {
		library: "[name]",
		libraryTarget: "umd",
		filename: "[name].min.js",
		// auxiliaryComment: "Test Comment"
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
