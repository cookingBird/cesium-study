const path = require('path');
module.exports = {
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
