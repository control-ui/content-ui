# Markdown `<details>` / `<summary>` Demo

This document demonstrates how to use `<details>` and `<summary>` in Markdown for collapsible content.

## Basic Toggle

<details>
  <summary>Click to expand</summary>

This is hidden content that appears when you click **"Click to expand"**.

It can include **Markdown** *formatting*, lists, and more.

</details>

## Nested Details

<details>
  <summary>Outer Details</summary>

This is the outer block.

<details>
  <summary>Inner Details</summary>

You can nest details for layered toggle sections.

<details>
  <summary>Inner Inner Details</summary>

Third level of nested details.


<details>
  <summary>Inner Inner Inner Details</summary>

Fourth level of nested details.

</details>

</details>

</details>

</details>

## Details with Lists and Code

<details>
  <summary>Show List and Code</summary>

### Grocery List

* 🍎 Apples
* 🥦 Broccoli
* 🥖 Bread

### Code Sample

```js
function sayHello(name) {
    console.log(`Hello, ${name}!`);
}

sayHello('World');
```

</details>

## Pre-Expanded Details

<details open>
  <summary>Always Expanded by Default</summary>

This section uses the `open` attribute, so it's shown by default.

You can remove `open` to collapse it initially.

</details>

## Use Case: FAQ Section

<details>
  <summary>❓ What is this for?</summary>

The `<details>`/`<summary>` tag pair is useful for collapsible content like FAQs, explanations, or optional sections in documents.

</details>

<details>
  <summary>🔒 Does it work in all Markdown renderers?</summary>

No — support depends on the Markdown engine. GitHub, Docusaurus, and many modern tools support it, but some Markdown-only renderers may strip out HTML.

</details>

## Styling Caveats

You can’t style `<summary>` with Markdown alone, but custom CSS can be applied if you're using it on a site you control.
