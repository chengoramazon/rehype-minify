# ![rehype-minify][logo]

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Chat][chat-badge]][chat]

**rehype-preset-minify** is an HTML minifier based on [**rehype**][rehype].

##### In

```html
<!doctype html>
<html lang="en-GB">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="content-language" content="en-US">
    <script src="index.js" type="text/javascript" language="javascript">
      alert(true);
    </script>
    <link rel="stylesheet" href="index.css" type="text/css">
    <title>Foo  &amp;  bar</title>
  </head>
  <body>
    <h1 class="foo foo">bar  bar</h1>
    <p id="alfred" id="alfred">  <strong>foo</strong> <em>bar</em> </p>
    <button type="BUTTON" onclick="javascript:return false">Alpha</button>
  </body>
</html>
```

##### Out

```html
<!doctype html><html lang=en-US><meta charset=utf8><script src=index.js></script><link rel=stylesheet href=index.css><title>Foo &amp bar</title><h1 class=foo>bar bar</h1><p id=alfred><strong>foo</strong> <em>bar</em></p><button type=button onclick=return!1>Alpha</button>
```

## Install

Install:

```sh
npm install rehype-preset-minify
```

## Use

*   [Use on the API »][api]
*   [Use on the CLI »][cli]

## Plugins

The following plugins are included in the preset.  They are mostly
harmless (disclaimer: **rehype-minify** is quite young).

<!--plugins-core start-->

*   [`rehype-minify-attribute-whitespace`](./packages/rehype-minify-attribute-whitespace)
*   [`rehype-minify-css-style`](./packages/rehype-minify-css-style)
*   [`rehype-minify-enumerated-attribute`](./packages/rehype-minify-enumerated-attribute)
*   [`rehype-minify-event-handler`](./packages/rehype-minify-event-handler)
*   [`rehype-minify-javascript-script`](./packages/rehype-minify-javascript-script)
*   [`rehype-minify-javascript-url`](./packages/rehype-minify-javascript-url)
*   [`rehype-minify-json-script`](./packages/rehype-minify-json-script)
*   [`rehype-minify-media-attribute`](./packages/rehype-minify-media-attribute)
*   [`rehype-minify-meta-color`](./packages/rehype-minify-meta-color)
*   [`rehype-minify-meta-content`](./packages/rehype-minify-meta-content)
*   [`rehype-minify-style-attribute`](./packages/rehype-minify-style-attribute)
*   [`rehype-minify-whitespace`](./packages/rehype-minify-whitespace)
*   [`rehype-normalize-attribute-value-case`](./packages/rehype-normalize-attribute-value-case)
*   [`rehype-remove-comments`](./packages/rehype-remove-comments)
*   [`rehype-remove-duplicate-attribute-values`](./packages/rehype-remove-duplicate-attribute-values)
*   [`rehype-remove-empty-attribute`](./packages/rehype-remove-empty-attribute)
*   [`rehype-remove-external-script-content`](./packages/rehype-remove-external-script-content)
*   [`rehype-remove-meta-http-equiv`](./packages/rehype-remove-meta-http-equiv)
*   [`rehype-remove-script-type-javascript`](./packages/rehype-remove-script-type-javascript)
*   [`rehype-remove-style-type-css`](./packages/rehype-remove-style-type-css)
*   [`rehype-sort-attribute-values`](./packages/rehype-sort-attribute-values)
*   [`rehype-sort-attributes`](./packages/rehype-sort-attributes)

<!--plugins-core end-->

## Other Plugins

The following plugins are not included because they are potentially
**dangerous**.  Read their READMEs carefully before using!

<!--plugins-other start-->

*   [`rehype-concat-css-style`](./packages/rehype-concat-css-style)
*   [`rehype-concat-javascript`](./packages/rehype-concat-javascript)
*   [`rehype-css-to-top`](./packages/rehype-css-to-top)
*   [`rehype-javascript-to-bottom`](./packages/rehype-javascript-to-bottom)
*   [`rehype-minify-doctype`](./packages/rehype-minify-doctype)
*   [`rehype-minify-url`](./packages/rehype-minify-url)
*   [`rehype-prevent-favicon-request`](./packages/rehype-prevent-favicon-request)

<!--plugins-other end-->

## Related

*   [`rehype-format`](https://github.com/wooorm/rehype-format)
    — Format HTML

## Contribute

See [`contributing.md` in `rehypejs/rehype`][contribute] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/rehypejs/rehype-minify.svg

[build]: https://travis-ci.org/rehypejs/rehype-minify

[coverage-badge]: https://img.shields.io/codecov/c/github/rehypejs/rehype-minify.svg

[coverage]: https://codecov.io/github/rehypejs/rehype-minify

[downloads-badge]: https://img.shields.io/npm/dm/rehype-minify.svg

[downloads]: https://www.npmjs.com/package/rehype-minify

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/rehype

[license]: license

[author]: https://wooorm.com

[rehype]: https://github.com/rehypejs/rehype

[logo]: https://raw.githubusercontent.com/rehypejs/rehype-minify/942349c/logo.svg?sanitize=true

[cli]: ./packages/rehype-preset-minify/readme.md#cli

[api]: ./packages/rehype-preset-minify/readme.md#api

[contribute]: https://github.com/rehypejs/rehype/blob/master/contributing.md

[coc]: https://github.com/rehypejs/rehype/blob/master/code-of-conduct.md
