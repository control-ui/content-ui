import { useEditorTheme } from '@ui-schema/material-code/useEditorTheme'

console.log('useEditorTheme', useEditorTheme)

/**
 * This is just a demo file, for verifying ESM resolution behaviour in TS.
 * - ts-node: depends on moduleResolution Node16 and that the dependency has `type: module` to work
 * - node: works without `type: module` in the dependency
 *
 * Run from root, ts-node version:
 * npm run server:feed:cli
 *
 * Run from inside server feed folder, native node version:
 * node ./build/cli.js
 */
