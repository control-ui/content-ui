# Content-UI: Markdown

...

## License

This project is distributed as **free software** under the **MIT License**, see [License](https://github.com/control-ui/content-ui/blob/main/LICENSE).

Includes modified copies of [micromark/micromark-extension-gfm-strikethrough/1.0.4/dev/lib/syntax.js](https://github.com/micromark/micromark-extension-gfm-strikethrough/blob/1.0.4/dev/lib/syntax.js), see [(MIT) LICENSE_GFM](https://github.com/control-ui/content-ui/blob/main/packages/md/LICENSE_GFM).

Adjusted to Typescript and used as base for similar plugins:

- `remarkSubSuper` to support `~`/`^` `<sub`/`<sup`
- `remarkInsert` to support `++`/`~~` `<ins`/`<del`
- `remarkUnderline` to support `__` `<u`
- `remarkMark` to support `==` `<mark`

© 2023 bemit UG (haftungsbeschränkt)
