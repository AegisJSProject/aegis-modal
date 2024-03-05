# `@aegisjsproject/aegis-modal`

An `<aegis-modal>` component built using [`@aegisjsproject/component`](https://npmjs.org/package/@aegisjsproject/component),
offering full built-in accessibility, customization, and enhanced security.

[![CodeQL](https://@github.com/AegisJSProject/aegis-modal/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/shgysk8zer0/npm-template/actions/workflows/codeql-analysis.yml)
![Node CI](https://@github.com/AegisJSProject/aegis-modal/workflows/Node%20CI/badge.svg)
![Lint Code Base](https://@github.com/AegisJSProject/aegis-modal/workflows/Lint%20Code%20Base/badge.svg)

[![GitHub license](https://img.shields.io/github/license/AegisJSProject/aegis-modal.svg)](https://@github.com/AegisJSProject/aegis-modal/blob/master/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/AegisJSProject/aegis-modal.svg)](https://@github.com/AegisJSProject/aegis-modal/commits/master)
[![GitHub release](https://img.shields.io/github/release/AegisJSProject/aegis-modal?logo=github)](https://@github.com/AegisJSProject/aegis-modal/releases)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/shgysk8zer0?logo=github)](https://github.com/sponsors/shgysk8zer0)

[![npm](https://img.shields.io/npm/v/@aegisjsproject/aegis-modal)](https://www.npmjs.com/package/@aegisjsproject/aegis-modal)
![node-current](https://img.shields.io/node/v/@aegisjsproject/aegis-modal)
![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/%40aegisjsproject%aegis-modal)
[![npm](https://img.shields.io/npm/dw/@aegisjsproject/aegis-modal?logo=npm)](https://www.npmjs.com/package/@aegisjsproject/aegis-modal)

[![GitHub followers](https://img.shields.io/github/followers/AegisJSProject.svg?style=social)](https://github.com/AegisJSProoject)
![GitHub forks](https://img.shields.io/github/forks/AegisJSProject/aegis-modal.svg?style=social)
![GitHub stars](https://img.shields.io/github/stars/AegisJSProject/aegis-modal.svg?style=social)
[![Twitter Follow](https://img.shields.io/twitter/follow/shgysk8zer0.svg?style=social)](https://twitter.com/shgysk8zer0)

[![Donate using Liberapay](https://img.shields.io/liberapay/receives/shgysk8zer0.svg?logo=liberapay)](https://liberapay.com/shgysk8zer0/donate "Donate using Liberapay")
- - -

- [Code of Conduct](./.github/CODE_OF_CONDUCT.md)
- [Contributing](./.github/CONTRIBUTING.md)
<!-- - [Security Policy](./.github/SECURITY.md) -->

## Important differences compared to [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)

- `<aegis-modal>` is modal-only
- `<aegis-modal>` **SHOULD** only be appended as a direct child of `<body>`
- `<aegis-modal>` automatically adds a sticky header and close button
- Provides simple open/close animations
- Has an `autoremove` attribute to automatically remove the element once closed
- Supports an optional `AbortController` in the `show({ signal })` method
- Adds `whenOpened` and `whenClosed` getter methods, returning relevant promises
- Adds a static `create()` method, which creates and optionally appends and opens if given a `signal`

## Compatibility / polyfills

The entire AegisJSProject ecosystem requires support for [`Element.prototype.setHTML()`](https://github.com/WICG/sanitizer-api)
and [Constructable Stylesheets](https://web.dev/articles/constructable-stylesheets).
Additionally, [`Promise.withResolvers()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers)
as well as [`inert`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert)
are also required for proper functionality.

Such polyfills are *not* included to avoid the bloat/duplication of polyfills. However,
an extensive polyfill script that ensures compatibility is available via:

```html
<script type="application/javascript" defer="" referrerpolicy="no-referrer" crossorigin="anonymous" integrity="sha384-Shkrmxly5RI9mCU8DQr6l4VLVJzjPzgx9KP/f5i7pEcl7ZUt0wHiAweGjbpjU2d5" src="https://unpkg.com/@shgysk8zer0/polyfills@0.3.1/all.min.js" fetchpriority="auto"></script>
```

## Installation

### Via CDN:

```html
<script type="module" src="https://unpkg.com/@aegisjsproject/aegis-modal[@:version]/aegis-modal.js" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
```

### Via npm

```bash
npm i @aegisjsproject/aegis-markdown
```

### Via [Git Submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules)

```bash
git subomdule add https://github.com/AegisJSProject/aegis-modal [:destination]
```

## Using [`<script type="importmap">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap)

All `@aegisjsproject/*` libraries are available and ready to use without a build
process such as webpack, but will require a `<script type="importmap">` that includes
all dependencies:


### Short & Basic

```html
<script type="importmap">
{
  "imports": {
    "@aegisjsproject/": "https://unpkg.com/@aegisjsproject/"
  }
}
</script>
```

### More detailed & with versions

```html
{
  "imports": {
    "@aegisjsproject/core/": "https://unpkg.com/@aegisjsproject/core@0.1.2/",
    "@aegisjsproject/styles/": "https://unpkg.com/@aegisjsproject/styles@0.1.1/",
    "@aegisjsproject/component/": "https://unpkg.com/@aegisjsproject/component@0.1.1/",
    "@aegisjsproject/aegis-modal/": "https://unpkg.com/@aegisjsproject/aegis-modal@0.0.1/"
  }
}
```

... or ...

```html
<script type="importmap">
{
  "imports": {
    "@aegisjsproject/": "/node_modules/@aegisjsproject/"
  }
}
</script>
```

## Example

```html
<aegis-modal>
  <h1 slot="heading">Lorem Ipsum</h1>
  <p>Error aut mollitia qui alias aut. Temporibus vitae impedit deserunt repellat voluptatibus et. Minima aut et tempore. Ut officiis sed consectetur. Voluptas praesentium ipsam rerum eligendi dolorum. Voluptatem similique omnis quis quidem.</p>
</aegis-modal>
```
