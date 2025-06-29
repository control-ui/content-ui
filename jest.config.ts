import type { Config } from '@jest/types'
import { createDefaultEsmPreset } from 'ts-jest'

const packages: [name: string, directory?: string, sourceDirectory?: string][] = [
    ['@content-ui/diff', 'diff'],
    ['@content-ui/input', 'input'],
    ['@content-ui/md', 'md'],
    ['@content-ui/md-mui', 'md-mui'],
    ['@content-ui/react', 'react'],
    ['@content-ui/struct', 'struct'],
]

const toPackageDirectory = (pkg: [name: string, directory?: string, sourceDirectory?: string]) => {
    return pkg[1] || pkg[0]
}

const toPackageSourceDirectory = (pkg: [name: string, directory?: string, sourceDirectory?: string]) => {
    return pkg[2] ? '/' + pkg[2] : ''
}

// todo: For tests in ESM sometimes `React` is undefined, yet somehow could not make it reproducible.
//       It is the `import React from 'react'` vs `import * as React from 'react'` thing.
//       - somehow it first failed, then worked with `"jsx": "react-jsxdev"`, afterwards some kind of caching?!
//       - not depending on disabling transform of packages
const base: Config.InitialProjectOptions = {
    cacheDirectory: '<rootDir>/node_modules/.cache/jest-tmp',
    setupFiles: ['<rootDir>/setupJest.mjs'],
    transformIgnorePatterns: [
        `node_modules/?!(${[
            // todo: this was never necessary for packages?! as previously used the wrong dir, impossible that it matched
            ...packages,
            // ['@mui'] as [name: string, directory?: string],
        ].map(p => p[0]).join('|')})/`,
        // `node_modules/?!(@mui)/`,
        //`node_modules/?!(@ui-schema/material-code)/`,
    ],
    transform: {
        ...createDefaultEsmPreset({
            babelConfig: {
                plugins: [
                    './babelImportDefaultPlugin.js',
                    // ['transform-imports', { // not validated/checked
                    //     'react': {
                    //         // 'transform': 'import * as React from 'react'',
                    //         // 'preventFullImport': true,
                    //     },
                    // }],
                ],
            },
        }).transform,// ts/tsx to ESM, js/jsx as-is
        //'^.+/node_modules/@ui-schema/material-code/.+\\.js$': 'babel-jest',
    },
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
        // '^(\\.{1,2}/.*)\\.ts$': '$1',
        // '^(\\.{1,2}/.*)\\.tsx$': '$1',
        ...packages.reduce((nameMapper, pkg) => {
            nameMapper[`^${pkg[0]}\\/(.*)$`] = `<rootDir>/packages/${toPackageDirectory(pkg)}${toPackageSourceDirectory(pkg)}/$1`
            nameMapper[`^${pkg[0]}$`] = `<rootDir>/packages/${toPackageDirectory(pkg)}${toPackageSourceDirectory(pkg)}`
            return nameMapper
        }, {}),
        // '^react-router$': 'react-router/dist/development/main.js',

        // note: need to use CJS version, as not using `type: module` for better MUI compat.,
        //      JEST relies on `has the nearest package json 'type: module'` or is it a `.mjs` file,
        //      while conditional `exports` are enough for bundlers/nodejs to know "i'm coming from module, so i've followed import, so i expect a ESM file"
        //
        //      but not for ts-node with "strict esm loader TS moduleResolution Node16", this still needs `type: module` to work.
        //      plain Node.js works, I think due to the consumer having `type: module`,
        //      **so that should then be a ts-node/esm bug!** (scheck server/feed/src/cli.ts for demo)
        '^@ui-schema/material-code\\/(.*)$': '<rootDir>/node_modules/@ui-schema/material-code/$1/index.cjs',
    },
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node',
    ],
    extensionsToTreatAsEsm: [
        '.ts', '.tsx', '.mts',
        // '.js'
    ],
    coveragePathIgnorePatterns: [
        '(tests/.*.mock).(jsx?|tsx?|ts?|js?)$',
        '.*.(test|spec).(js|ts|tsx)$',
        '<rootDir>/apps/demo',
        '<rootDir>/apps/sandbox',
        '<rootDir>/server/feed',
    ],
    testPathIgnorePatterns: [
        '<rootDir>/dist',
        '<rootDir>/apps/demo/build',
        '<rootDir>/server/feed/build',
    ],
    watchPathIgnorePatterns: [
        '<rootDir>/dist',
        '<rootDir>/node_modules',
        '<rootDir>/apps/.+/node_modules',
        '<rootDir>/server/.+/node_modules',
        '<rootDir>/packages/.+/node_modules',
    ],
    modulePathIgnorePatterns: [
        '<rootDir>/dist',
        '<rootDir>/apps/.+/build',
        '<rootDir>/server/.+/build',
    ],
}

const config: Config.InitialOptions = {
    ...base,
    collectCoverage: true,
    verbose: true,
    coverageDirectory: '<rootDir>/coverage',
    projects: [
        {
            displayName: 'test-apps-demo',
            ...base,
            moduleDirectories: ['node_modules', '<rootDir>/apps/demo/node_modules'],
            testMatch: [
                '<rootDir>/apps/demo/src/**/*.(test|spec).(js|ts|tsx)',
                '<rootDir>/apps/demo/tests/**/*.(test|spec).(js|ts|tsx)',
            ],
        },
        ...packages.map(pkg => ({
            displayName: 'test-' + pkg[0],
            ...base,
            moduleDirectories: [
                'node_modules', '<rootDir>/packages/' + toPackageDirectory(pkg) + '/node_modules',
            ],
            testMatch: [
                '<rootDir>/packages/' + toPackageDirectory(pkg) + toPackageSourceDirectory(pkg) + '/**/*.(test|spec).(js|ts|tsx)',
                '<rootDir>/packages/' + toPackageDirectory(pkg) + '/tests/**/*.(test|spec).(js|ts|tsx)',
            ],
        })),
    ],
}

export default config
