# Test Note 1

## Intro

This is some [markdown](https://github.github.com/gfm/) supported `CodeMirror` input widget field for **UI-Schema**.

Supporting *nested highlighting* features thanks to **CodeMirror**.

> MD Editor should handle @elbakerino tags sometime.

MD Editor should handle @elbakerino and #89 tags sometime.

- @elbakerino and #89

## `Advanced` *Features*

```js
const woho = true
```

```html
<p class="body1 p2 o o-divider">Get started.</p>
```

```scss
table.striped {
    tbody tr:nth-child(2n+1) {
        background: $table-bg-cell
    }
}
```

```StandardSQL
SELECT id, name, city
FROM business
WHERE region in ('eu', 'sea') OR hightlight is true
ORDER BY name asc
LIMIT 10, 10
```

*Linting markdown* is great, it warns when strange stuff is used:

~~~strange
const woho = true
~~~
