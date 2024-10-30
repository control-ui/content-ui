import path from 'path'
import {fileURLToPath} from 'url'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import ESLintPlugin from 'eslint-webpack-plugin'
import InlineChunkHtmlPlugin from 'react-dev-utils/InlineChunkHtmlPlugin.js'
import eslintFormatter from 'react-dev-utils/eslintFormatter.js'
import CopyPlugin from 'copy-webpack-plugin'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import reactRefreshBabel from 'react-refresh/babel'
import webpack from 'webpack'
import * as dotenv from 'dotenv'
import {TsconfigPathsPlugin} from 'tsconfig-paths-webpack-plugin'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

dotenv.config({
    path: path.join(__dirname, '.env'),
})

const isProd = process.env.NODE_ENV === 'production'
const minimize = isProd

const safeEnvVars = ['NODE_ENV']
const baseDir = __dirname
const contentBase = path.join(baseDir, 'public')
const template = path.join(contentBase, 'index.html')
const publicPath = '/'
const src = path.join(baseDir, 'src')
const build = path.join(baseDir, 'build')

export default {
    entry: {
        main: path.join(src, 'index.tsx'),
    },
    output: {
        filename: 'assets/[name].[fullhash:8].js',
        path: build,
        chunkFilename: 'assets/[name].chunk.[fullhash:8].js',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
        extensionAlias: {
            '.js': ['.ts', '.js', '.tsx', '.jsx'],
        },
        modules: [
            // path.join(baseDir, 'src'),
            'node_modules',
        ],
        alias: {},
        plugins: [new TsconfigPathsPlugin({/* options: see below */})],
    },
    target: 'web',
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        cacheCompression: false,
                        compact: minimize,
                        rootMode: 'upward',
                        plugins: isProd ? [] : [reactRefreshBabel],
                    },
                }],
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                ],
            },
        ],
    },
    optimization: {
        minimize: minimize,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        ecma: 2016,
                        warnings: false,
                        comparisons: false,
                        inline: 2,
                    },
                    mangle: {
                        safari10: true,
                    },
                    keep_classnames: false,
                    keep_fnames: false,
                    output: {
                        ecma: 2016,
                        comments: false,
                        ascii_only: true,
                    },
                },
            }),
        ],
        ...isProd ? {
            runtimeChunk: 'single',
            concatenateModules: true,
            providedExports: true,
            usedExports: true,
        } : {},
    },
    stats: {
        chunkRelations: true,
        excludeModules: [
            'moment',
            '@codemirror',
            '@lezer',
            // /filter/,
            // (moduleSource) => true,
        ],
        orphanModules: true, // enabled orphan helps to see more in depth details for bundled files
        // modulesSpace: 99999,
        nestedModulesSpace: 5,
    },
    // stats: 'errors-only',
    devServer: {
        static: [
            {
                directory: contentBase,
                publicPath: publicPath,
            },
        ],
        client: {
            logging: 'info',
            overlay: false,
            progress: true,
        },
        // host: undefined,
        open: false,
        compress: true,
        hot: true,
        liveReload: false,
        // http2: false,
        // https: false,
        // magicHtml: false,
        historyApiFallback: true,
        port: process.env.PORT || 8080,
    },
    plugins: [
        ...[!isProd && new ReactRefreshWebpackPlugin()].filter(Boolean),
        new webpack.DefinePlugin({
            'process.env': (() => {
                const safeEnv = {}
                Object.keys(process.env)
                    .filter(k =>
                        safeEnvVars.includes(k) ||
                        k.indexOf('REACT_APP_') === 0 ||
                        k.indexOf('WEB_APP_') === 0,
                    )
                    .map(k =>
                        safeEnv[k] = JSON.stringify(process.env[k]),
                    )
                return safeEnv
            })(),
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: template,
            publicPath: '/',
            ...minimize ? {
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true,
                },
            } : {},
        }),
        new ESLintPlugin({
            extensions: ['js', 'jsx', 'ts', 'tsx'],
            formatter: eslintFormatter,
            eslintPath: 'eslint',
            emitWarning: !isProd,
            failOnError: isProd,
            failOnWarning: isProd,
        }),
        ...isProd ? [new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/])] : [],
        ...isProd ? [new CopyPlugin({
            patterns: [
                {
                    from: contentBase,
                    to: build,
                    globOptions: {
                        ignore: template && template.indexOf(contentBase) === 0 ? [
                            '**/' + template.slice(contentBase.length + 1).replace(/\\/g, '/'),
                            // ...contentBaseCopyIgnore,
                        ] : [],
                    },
                },
                // ...copy,
            ],
        })] : [],
    ],
}
