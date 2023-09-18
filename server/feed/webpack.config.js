import path from 'path'
import {fileURLToPath} from 'url'
import TerserPlugin from 'terser-webpack-plugin'
import ESLintPlugin from 'eslint-webpack-plugin'
import eslintFormatter from 'react-dev-utils/eslintFormatter.js'
import webpack from 'webpack'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isProd = process.env.NODE_ENV === 'production'
const minimize = isProd

const safeEnvVars = ['NODE_ENV']
const baseDir = __dirname
const src = path.join(baseDir, 'src')
const build = path.join(baseDir, 'build-2')

/*
 * A temporary webpack config for NodeJS, as long as @mui doesn't support ESM
 * - https://github.com/mui/material-ui/issues/35233
 * - https://github.com/mui/material-ui/issues/30671
 * - https://github.com/mui/material-ui/issues/30525
 */
export default {
    entry: {
        server: path.join(src, 'server.ts'),
    },
    output: {
        filename: '[name].js',
        path: build,
        chunkFilename: '[name].chunk.js',
        chunkFormat: 'module',
        module: true,
        library: {
            type: 'module',
        },
    },
    experiments: {
        outputModule: true,
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
        alias: {
            // react: path.join(baseDir, 'node_modules', 'react'),
        },
    },
    target: 'async-node',
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
                        // plugins: isProd ? [] : [reactRefreshBabel],
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
        splitChunks: false,
    },
    plugins: [
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
        new ESLintPlugin({
            extensions: ['js', 'jsx', 'ts', 'tsx'],
            formatter: eslintFormatter,
            eslintPath: 'eslint',
            emitWarning: !isProd,
            failOnError: isProd,
            failOnWarning: isProd,
        }),
    ],
}
