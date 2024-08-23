# Content-UI

> ⚗ experimental content viewer & editor

🕹️ [codesandbox](https://codesandbox.io/p/devbox/github/control-ui/content-ui/tree/main/apps/sandbox?file=%2Fsrc%2Fmain.tsx) | [stackblitz](https://stackblitz.com/github/control-ui/content-ui/tree/main/apps/sandbox) | [source in apps/sandbox](./apps/sandbox)

## Packages

- [@content-ui/md](./packages/md) [![MIT license](https://img.shields.io/npm/l/@content-ui/md?style=flat-square)](https://github.com/control-ui/content-ui/blob/main/LICENSE) [![npm (scoped)](https://img.shields.io/npm/v/@content-ui/md?style=flat-square)](https://www.npmjs.com/package/@content-ui/md) [![JS compatibility](https://img.shields.io/badge/ESM--f7e018?style=flat-square&logo=javascript)](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)
    - markdown to AST, using [unifiedjs / remarkjs](https://unifiedjs.com/) for parsing
- [@content-ui/react](./packages/react) [![MIT license](https://img.shields.io/npm/l/@content-ui/react?style=flat-square)](https://github.com/control-ui/content-ui/blob/main/LICENSE) [![npm (scoped)](https://img.shields.io/npm/v/@content-ui/react?style=flat-square)](https://www.npmjs.com/package/@content-ui/react) [![react compatibility](https://img.shields.io/badge/React-%3E%3D17-success?style=flat-square&logo=react)](https://reactjs.org/) [![JS compatibility](https://img.shields.io/badge/ESM--f7e018?style=flat-square&logo=javascript)](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)
    - ReactJS hooks and providers for the other react packages
- [@content-ui/md-mui](./packages/md-mui) [![MIT license](https://img.shields.io/npm/l/@content-ui/md-mui?style=flat-square)](https://github.com/control-ui/content-ui/blob/main/LICENSE) [![npm (scoped)](https://img.shields.io/npm/v/@content-ui/md-mui?style=flat-square)](https://www.npmjs.com/package/@content-ui/md-mui) [![react compatibility](https://img.shields.io/badge/React-%3E%3D17-success?style=flat-square&logo=react)](https://reactjs.org/) [![depends on MUI](https://img.shields.io/badge/MUI-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=mui)](https://mui.com)
    - MUI leafs for content-leafs
- [@content-ui/input](./packages/input) [![MIT license](https://img.shields.io/npm/l/@content-ui/input?style=flat-square)](https://github.com/control-ui/content-ui/blob/main/LICENSE) [![npm (scoped)](https://img.shields.io/npm/v/@content-ui/input?style=flat-square)](https://www.npmjs.com/package/@content-ui/input) [![react compatibility](https://img.shields.io/badge/React-%3E%3D17-success?style=flat-square&logo=react)](https://reactjs.org/) [![depends on MUI](https://img.shields.io/badge/MUI-green?labelColor=1a237e&color=0d47a1&logoColor=ffffff&style=flat-square&logo=mui)](https://mui.com)
    - MUI styled code / text input field based on `CodeMirror` with preview and linting
- [@content-ui/struct](./packages/struct) [![MIT license](https://img.shields.io/npm/l/@content-ui/struct?style=flat-square)](https://github.com/control-ui/content-ui/blob/main/LICENSE) [![npm (scoped)](https://img.shields.io/npm/v/@content-ui/struct?style=flat-square)](https://www.npmjs.com/package/@content-ui/struct) [![JS compatibility](https://img.shields.io/badge/ESM--f7e018?style=flat-square&logo=javascript)](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)
    - structural helper utils and mdast typing extensions

```shell
npm i -S @content-ui/md @content-ui/react @content-ui/md-mui
# peer-dependencies:
npm i -S @mui/material @mui/icons-material
npm i -D @types/mdast

# input component with CodeMirror:
npm i -S @content-ui/md @content-ui/react @content-ui/md-mui @content-ui/input
# peer-dependencies:
npm i -S react-progress-state @ui-controls/progress @ui-schema/kit-codemirror @codemirror/state
```

> all packages are ESM-only, those with the `ESM` flag support strict-ESM for browser + NodeJS

See [CustomCodeMirror.tsx](./apps/demo/src/components/CustomCodeMirror.tsx) for an example CodeMirror component, for viewer and input, with nested syntax highlighting and quite some other things.

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
npm run dev
```

Now open the [app at `localhost:4221`](http://localhost:4221) or the [server at `localhost:4222`](http://localhost:4222).

---

Only start the simplified sandbox:

```shell
npm run start -w content-ui-sandbox
```

And open the [app at `localhost:5173`](http://localhost:5173/).

---

Lint, build typings + JS:

```shell
npm run build
```

Create new lock-file for sandbox/server requires setting `workspaces` to false.

```shell
# updating lock file requires already published packages
# first release, then update lock, then push again
cd apps/sandbox && npm i --package-lock-only --workspaces false
```

## License

This project is distributed as **free software** under the **MIT License**, see [License](https://github.com/control-ui/content-ui/blob/main/LICENSE).

© 2024 bemit UG (haftungsbeschränkt)
