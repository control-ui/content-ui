---
"title": "Pattern Content"
"lang": "en"
---

# Markdown Features

## Table of content

This should be an intro - let's see where it shows up.

## Extended Markdown Features

A lot of stuff is supported. Alright let me check how i normally write and if that gives enough buffer to get some more fluent preview.

:rocket: :+1:

### Markdown Footnotes

Here is a footnote reference,[^1] and another.[^longnote]

[^1]: Here is the footnote.

[^longnote]: Here's one with multiple blocks.

    Subsequent paragraphs are indented to show that they
    belong to the previous footnote. (which isn't highlighted correctly.)

### Markdown Abbr

*[HTML]: Hyper Text Markup Language
*[W3C]:  World Wide Web Consortium
The HTML specification is maintained by the W3C.

### Definition List

First Term
: This is the definition of the first term.

Second Term
: This is one definition of the second term.
: This is another definition of the second term.

Lorem ipsum dolor sit amet consectutor adipisci.

### Strike through & Inserted

~~The world is flat.~~ We now know that the world is ++round++

### Mark

==marked==

Line with ==something marked== in the middle.

### Sub- & super

~subscript~, e.g. a~i~

^superscript^, e.g. e^x^

## Plain Code

A plain code block:

```
status *= wepModel + password_hyper;
var ldap_leaderboard_lpi = kilobit_recursion_server * heat_wan + cadDotConstant
        + carrier_language_bin;
var ppi = ssid_codec_restore + graymailBoot + vlbVersionMonochrome + jfs;
gigabyteText = png_firewall_emoticon;
wordVersion = ppc_hard_key;
```

Intended code block:

    title;score;
    Home;1;
    About;0.5;
    Products;0.8;

## Text with Links

Quae in promisa numina, *diva* artes [ea](https://example.org/) regem classem. Moli **et vir** locuta, et fixis atrides est peto.

Orbem Neptunia ora [oravere fatum](https://example.org/peremi) medio voce flexos quo  [inridet *una et* tusto](https://example.org/peremi) linguam potitus, sed!

Ad recepto tura pectore sanguine, receperunt in somno, est posita oculos dempsisse; ossa. Regique patriorum iterata relicto Phlegyanque curis posuitque **faciat ratibus**, et exspiravit perde mixtae.

## Text and Lists

Quod non lacrimaeque et se pumice denique.

1. Illic dubitat tot cum data marmora in
2. Phoebe Panes
3. Arbor hic oblivia spes tellus
4. Vires Iovis pectore credere Herculis more
5. Non de prosum

### Tasks and Team Mention

- [ ] open task
- [x] done task
- [ ] milestone
    - [x] subtask 1
    - [ ] subtask 2
    - [ ] subtask 3
        1. [x] subtasks in numbered list
        2. [ ] subtask 3 b
        3. normal item in between
        4. [ ] subtask 3 c
    - [ ] subtask 4
    - normal at the end
- mentions at tasks:
    - [ ] @jane_d
    - [x] @joe.x

Take a look @lead.

## Haec inmotosque volet

In ille, spe tale Chimaera et licet! A duobus distabat, inque primo errat si et
contudit, deam, quod, duros militiam incessit et?

| Country | Code |
| -- | -- |
| Germany | DEU |
| France | FRA |
| Austria | AUT |
| Australia | AUS |
| Switzerland | CHE |
| Sweden | SWE |

Unum super de sensisse et moveres *acerbo tum* populos nec oleis ex bracchia
flexit et? Parente umor **versat** summoque quidem utramque **piceae**. Cur
virgo aequora autumnos postquam!

## Markdown Code

```md
1. List
2. Paragraph
3. Table

Lorem ipsum dolor sit amet.

| Time | Name | Energy |
| ---- | ---- | ---- |
| 8am  | *Morning* | 40.5 |
| 12am | **Noon** | 80.42 |
```

## GitHub Alerts

> [!NOTE]
> Useful information that users should know, even when skimming content.

> [!TIP]
> Helpful advice for doing things better or more easily.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.

See [Github Alerts](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#alerts).

## Liquid

Contact **{{customers | size}} customers**:

{% for customer in customers %}- [ ] **{{ customer.name }}**
{% endfor %}}

```ts
function render(text: string) {
    return text.replaceAll('{}', '')
}

render(`hello {{customers[0].name}}`)

render('hello ' + 'Max')
```
