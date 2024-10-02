import type { Config } from '@jest/types'
import { createDefaultEsmPreset } from 'ts-jest'

const packages: [name: string, folder?: string][] = [
    ['@content-ui/diff', 'diff'],
    ['@content-ui/input', 'input'],
    ['@content-ui/md', 'md'],
    ['@content-ui/md-mui', 'md-mui'],
    ['@content-ui/react', 'react'],
    ['@content-ui/struct', 'struct'],
]

const toPackageFolder = (pkg: [name: string, folder?: string]) => {
    return pkg[1] || pkg[0]
}

// todo: For tests in ESM sometimes `React` is undefined, yet somehow could not make it reproducible.
//       It is the `import React from 'react'` vs `import * as React from 'react'` thing.
//       - somehow it first failed, then worked with `"jsx": "react-jsxdev"`, afterwards some kind of caching?!
//       - not depending on disabling transform of packages
const base: Config.InitialProjectOptions = {
    cacheDirectory: '<rootDir>/node_modules/.cache/jest-tmp',
    transformIgnorePatterns: [
        `node_modules/?!(${[
            ...packages,
            ['@mui'] as [name: string, folder?: string],
            // ['@ui-schema'] as [name: string, folder?: string],
        ].map(toPackageFolder).join('|')})/`,
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
            nameMapper[`^${pkg[0]}\\/(.*)$`] = `<rootDir>/packages/${toPackageFolder(pkg)}/$1`
            nameMapper[`^${pkg[0]}$`] = `<rootDir>/packages/${toPackageFolder(pkg)}`
            return nameMapper
        }, {}),
    },
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node',
    ],
    coveragePathIgnorePatterns: [
        '(tests/.*.mock).(jsx?|tsx?|ts?|js?)$',
        '.*.(test|spec).(js|ts|tsx)$',
        '<rootDir>/apps/demo',
        '<rootDir>/apps/sandbox',
        '<rootDir>/server/sandbox',
    ],
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
}

const config: Config.InitialOptions = {
    ...base,
    collectCoverage: true,
    verbose: true,
    testPathIgnorePatterns: ['<rootDir>/build', '<rootDir>/dist'],
    modulePathIgnorePatterns: [
        '<rootDir>/build',
        '<rootDir>/dist',
        '<rootDir>/apps/demo/build',
        '<rootDir>/server/feed/build',
    ],
    coverageDirectory: '<rootDir>/coverage',
    projects: [
        // todo: enable app tests again when fixed ESM/CJS issues
        // {
        //     displayName: 'test-apps-demo',
        //     ...base,
        //     moduleDirectories: ['node_modules', '<rootDir>/apps/demo/node_modules'],
        //     testMatch: [
        //         '<rootDir>/apps/demo/src/**/*.(test|spec).(js|ts|tsx)',
        //         '<rootDir>/apps/demo/tests/**/*.(test|spec).(js|ts|tsx)',
        //     ],
        // },
        ...packages.map(pkg => ({
            displayName: 'test-' + pkg[0],
            ...base,
            moduleDirectories: [
                'node_modules', '<rootDir>/packages/' + toPackageFolder(pkg) + '/node_modules',
            ],
            testMatch: [
                '<rootDir>/packages/' + toPackageFolder(pkg) + '/src/**/*.(test|spec).(js|ts|tsx)',
                '<rootDir>/packages/' + toPackageFolder(pkg) + '/tests/**/*.(test|spec).(js|ts|tsx)',
            ],
        })),
    ],
}

export default config
