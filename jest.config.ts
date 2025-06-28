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
            ...packages,
            // ['@mui'] as [name: string, directory?: string],
        ].map(toPackageDirectory).join('|')})/`,
        // `node_modules/?!(@mui)/`,
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
    },
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node',
    ],
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
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
