# Content-UI

> ⚗ experimental content viewer & editor

## Packages

- [@content-ui/input](./packages/input) [![MIT license](https://img.shields.io/npm/l/@content-ui/input?style=flat-square)](https://github.com/control-ui/content-ui/blob/main/LICENSE) [![npm (scoped)](https://img.shields.io/npm/v/@content-ui/input?style=flat-square)](https://www.npmjs.com/package/@content-ui/input)
    - provides input contexts and code / text input field based on `CodeMirror`
- [@content-ui/md](./packages/md) [![MIT license](https://img.shields.io/npm/l/@content-ui/md?style=flat-square)](https://github.com/control-ui/content-ui/blob/main/LICENSE) [![npm (scoped)](https://img.shields.io/npm/v/@content-ui/md?style=flat-square)](https://www.npmjs.com/package/@content-ui/md)
    - markdown / html to AST, using [`remark`/`rehype`](https://unifiedjs.com/) for parsing
- [@content-ui/md-mui](./packages/md-mui) [![MIT license](https://img.shields.io/npm/l/@content-ui/md-mui?style=flat-square)](https://github.com/control-ui/content-ui/blob/main/LICENSE) [![npm (scoped)](https://img.shields.io/npm/v/@content-ui/md-mui?style=flat-square)](https://www.npmjs.com/package/@content-ui/md-mui)
    - MUI leafs for content-leafs, using `@tactic-ui` for rendering
- [@content-ui/react](./packages/react) [![MIT license](https://img.shields.io/npm/l/@content-ui/react?style=flat-square)](https://github.com/control-ui/content-ui/blob/main/LICENSE) [![npm (scoped)](https://img.shields.io/npm/v/@content-ui/react?style=flat-square)](https://www.npmjs.com/package/@content-ui/react)
    - React hooks and providers for the other react packages
- [@content-ui/struct](./packages/struct) [![MIT license](https://img.shields.io/npm/l/@content-ui/struct?style=flat-square)](https://github.com/control-ui/content-ui/blob/main/LICENSE) [![npm (scoped)](https://img.shields.io/npm/v/@content-ui/struct?style=flat-square)](https://www.npmjs.com/package/@content-ui/struct)
    - structural content analyzer and information aggregation

```shell
npm i -S @content-ui/md @content-ui/react @content-ui/md-mui @content-ui/input
# peer-dependencies:
npm i -S @tactic-ui/react @mui/material @mui/icons-material react-progress-state @ui-controls/progress
# peer-dependencies for CodeMirror
npm i -S @ui-schema/kit-codemirror @codemirror/state .. todo ..
```

## License

This project is distributed as **free software** under the **MIT License**, see [License](https://github.com/control-ui/content-ui/blob/main/LICENSE).

© 2023 bemit UG (haftungsbeschränkt)
