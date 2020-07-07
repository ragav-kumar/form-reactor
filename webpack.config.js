const defaults = require("@wordpress/scripts/config/webpack.config");
const path = require('path');
const glob = require('glob');

module.exports = (env, options) => ({
	...defaults,
	externals: {
		"react": "React",
		"react-dom": "ReactDOM",
		"@wordpress/api-fetch": "wp.apiFetch"
	},
	entry: glob.sync('./src/**.js').reduce((obj, el) => {
		obj[path.parse(el).name] = el;
		return obj;
	}, {}),
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'js'),
	},
	devtool: (env.NODE_ENV == 'development' ? 'source-map' : false),
	resolve: {
		...defaults.resolve,
		alias: {
			common: path.resolve(__dirname, 'src/common'),
		},
		extensions: [".ts", ".tsx", ".js", ".jsx"],
	},
	module: {
		...defaults.module,
		rules: [
			...defaults.module.rules,
			{
				test: /\.[jt]s(x?)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							'@babel/preset-env',
							'@babel/preset-react',
							'@babel/preset-typescript',
						]
					},
				},
			}, { // The only time we load CSS is when a dependency requires it
				test: /\.css$/i,
				include: /node_modules/,
				use: ['style-loader', 'css-loader']
			}, {
				enforce: "pre",
				test: /\.js$/,
				loader: "source-map-loader"
			}
		]
	}
});