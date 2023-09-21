# Content-UI

> ⚗ experimental content viewer & editor

## Packages

- [@content-ui/md](./packages/md) [![MIT license](https://img.shields.io/npm/l/@content-ui/md?style=flat-square)](https://github.com/control-ui/content-ui/blob/main/LICENSE) [![npm (scoped)](https://img.shields.io/npm/v/@content-ui/md?style=flat-square)](https://www.npmjs.com/package/@content-ui/md) [![JS compatibility](https://img.shields.io/badge/ESM--f7e018?style=flat-square&logo=javascript)](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)
    - markdown / html to AST, using [remark / rehype](https://unifiedjs.com/) for parsing
- [@content-ui/react](./packages/react) [![MIT license](https://img.shields.io/npm/l/@content-ui/react?style=flat-square)](https://github.com/control-ui/content-ui/blob/main/LICENSE) [![npm (scoped)](https://img.shields.io/npm/v/@content-ui/react?style=flat-square)](https://www.npmjs.com/package/@content-ui/react) [![react compatibility](https://img.shields.io/badge/React-%3E%3D17-success?style=flat-square&logo=react)](https://reactjs.org/) [![JS compatibility](https://img.shields.io/badge/ESM--f7e018?style=flat-square&logo=javascript)](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)
    - ReactJS hooks and providers for the other react packages
- [@content-ui/md-mui](./packages/md-mui) [![MIT license](https://img.shields.io/npm/l/@content-ui/md-mui?style=flat-square)](https://github.com/control-ui/content-ui/blob/main/LICENSE) [![npm (scoped)](https://img.shields.io/npm/v/@content-ui/md-mui?style=flat-square)](https://www.npmjs.com/package/@content-ui/md-mui) [![react compatibility](https://img.shields.io/badge/React-%3E%3D17-success?style=flat-square&logo=react)](https://reactjs.org/) [![depends on MUI](https://img.shields.io/badge/MUI-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=mui)](https://mui.com)
    - MUI leafs for content-leafs, using [@tactic-ui](https://github.com/ui-schema/tactic-ui) for rendering
- [@content-ui/input](./packages/input) [![MIT license](https://img.shields.io/npm/l/@content-ui/input?style=flat-square)](https://github.com/control-ui/content-ui/blob/main/LICENSE) [![npm (scoped)](https://img.shields.io/npm/v/@content-ui/input?style=flat-square)](https://www.npmjs.com/package/@content-ui/input) [![react compatibility](https://img.shields.io/badge/React-%3E%3D17-success?style=flat-square&logo=react)](https://reactjs.org/) [![depends on MUI](https://img.shields.io/badge/MUI-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=mui)](https://mui.com)
    - MUI styled code / text input field based on `CodeMirror`
- [@content-ui/struct](./packages/struct) [![MIT license](https://img.shields.io/npm/l/@content-ui/struct?style=flat-square)](https://github.com/control-ui/content-ui/blob/main/LICENSE) [![npm (scoped)](https://img.shields.io/npm/v/@content-ui/struct?style=flat-square)](https://www.npmjs.com/package/@content-ui/struct) [![JS compatibility](https://img.shields.io/badge/ESM--f7e018?style=flat-square&logo=javascript)](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)
    - structural content analyzer and information aggregation

```shell
npm i -S @content-ui/md @content-ui/react @content-ui/md-mui @content-ui/input
# peer-dependencies:
npm i -S @tactic-ui/react @mui/material @mui/icons-material react-progress-state @ui-controls/progress
# peer-dependencies for CodeMirror
npm i -S @ui-schema/kit-codemirror @codemirror/state .. todo ..
```

> all packages are ESM-only, those with the `ESM` flag support strict-ESM for browser + NodeJS

See [WidgetMarkdownEditor.tsx](./apps/demo/src/components/CustomWidgets/WidgetMarkdownEditor.tsx) for an example [UI-Schema widget](https://ui-schema.bemit.codes) with Markdown editor, linting and preview.

## Development

Clone repository, then install all NodeJS deps:

```shell
npm i

cd server/feed
npm i
```

Start development servers from root folder:

```shell
npm run start
```

Now open the [app at `localhost:4221`](http://localhost:4221) or the [server at `localhost:4222`](http://localhost:4222).

Lint, build typings + JS:

```shell
npm run build
```

## License

This project is distributed as **free software** under the **MIT License**, see [License](https://github.com/control-ui/content-ui/blob/main/LICENSE).

© 2023 bemit UG (haftungsbeschränkt)
