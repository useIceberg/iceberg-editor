const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const FixStyleOnlyEntriesPlugin = require( 'webpack-fix-style-only-entries' );
const BrowserSyncPlugin = require( 'browser-sync-webpack-plugin' );
const OptimizeCssAssetsPlugin = require( 'optimize-css-assets-webpack-plugin' );
const ReplaceInFileWebpackPlugin = require( 'replace-in-file-webpack-plugin' );
const isProduction = process.env.NODE_ENV === 'production';
const pkg = require( './package.json' );

// Check if local.json exists
try {
	var localEnv = require( './local.json' ).devURL;
} catch ( err ) {
	// Fallback if it does not
	var localEnv = 'https://iceberg.test';
}

module.exports = {
	...defaultConfig,

	entry: {
		iceberg: path.resolve( process.cwd(), 'src/index.js' ),
		'iceberg-style': path.resolve( process.cwd(), 'src/style.scss' ),
	},

	module: {
		...defaultConfig.module,
		rules: [
			...defaultConfig.module.rules,
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: { url: false, sourceMap: ! isProduction },
					},
					{
						loader: 'sass-loader',
						options: { sourceMap: ! isProduction },
					},
				],
			},
		],
	},

	plugins: [
		...defaultConfig.plugins,
		new FixStyleOnlyEntriesPlugin(),
		new MiniCssExtractPlugin( { filename: '[name].css' } ),
		new BrowserSyncPlugin(
			{
				host: 'localhost',
				port: 8092,
				proxy: localEnv,
				open: true,
				files: [ 'build/*.php', 'build/*.js', 'build/*.css' ],
			},
			{
				injectCss: true,
				reload: false,
			}
		),
		new OptimizeCssAssetsPlugin( {
			assetNameRegExp: /\.*\.css$/g,
			cssProcessor: require( 'cssnano' ),
			cssProcessorPluginOptions: {
				preset: [ 'default' ],
			},
			canPrint: true,
		} ),
		new ReplaceInFileWebpackPlugin( [
			{
				files: [ 'iceberg.php' ],
				rules: [
					{
						search: /Version:(\s*?)[a-zA-Z0-9\.\-\+]+$/m,
						replace: 'Version:$1' + pkg.version,
					},
				],
			},
			{
				files: [ 'readme.txt' ],
				rules: [
					{
						search: /^(\*\*|)Stable tag:(\*\*|)(\s*?)[a-zA-Z0-9.-]+(\s*?)$/im,
						replace: '$1Stable tag:$2$3' + pkg.version,
					},
				],
			},
			{
				dir: 'includes/',
				files: [ 'class-iceberg.php' ],
				rules: [
					{
						search: /define\(\s*'ICEBERG_VERSION',\s*'(.*)'\s*\);/,
						replace:
							"define( 'ICEBERG_VERSION', '" +
							pkg.version +
							"' );",
					},
				],
			},
		] ),
	],
};
