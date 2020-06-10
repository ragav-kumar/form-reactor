const path = require('path');
const glob = require('glob');

module.exports = (env, options) => ({
	entry: glob.sync('./src/*.js').reduce((obj, el) => {
		obj[path.parse(el).name] = el;
		return obj;
	}, {}),
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'js'),
	},
	devtool: (options.mode == 'development' ? 'source-map' : false),
	resolve: {
		alias: {
			common: path.resolve(__dirname, 'src/common'),
		},
		extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx|ts|tsx)$/,
				resolve: {
					extensions: [".js", ".jsx", ".ts", ".tsx"]
				},
				include: path.resolve(__dirname, 'src'),
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							'@babel/preset-env',
							'@babel/preset-react',
						]
					}
				}, 
			}
		]
	}
});