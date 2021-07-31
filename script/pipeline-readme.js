import fs from 'fs'
import path from 'path'
import {inspect} from 'util'
import dox from 'dox'
import remark from 'remark'
import rehype from 'rehype'
import u from 'unist-builder'
import vfile from 'to-vfile'
import trough from 'trough'
import author from 'parse-author'
import strip from 'strip-indent'
import preset from 'remark-preset-wooorm'

var pkg = JSON.parse(fs.readFileSync('package.json'))

var proc = remark().use({settings: preset.settings})

export const pipelineReadme = trough()
  .use(function (ctx, next) {
    vfile.read(path.join(ctx.root, 'package.json'), function (error, file) {
      ctx.config = file ? JSON.parse(String(file)) : {}
      next(error)
    })
  })
  .use(function (ctx, next) {
    vfile.read(path.join(ctx.root, 'index.js'), function (error, script) {
      var comments

      if (error) {
        next(error.code === 'ENOENT' ? null : error)
      } else {
        ctx.script = script

        comments = dox.parseComments(String(script))[0] || {}
        ;(comments.tags || []).forEach(function (comment) {
          ctx.config[comment.type] = comment.string
        })

        next()
      }
    })
  })
  .use(async function (ctx) {
    var config = ctx.config
    var overview = config.fileoverview || config.description
    var licensee = author(config.author)
    var example = config.example
    var repo = pkg.repository
    var org = repo.split('/').slice(0, -1).join('/')
    var branchBase = repo + '/blob/main'
    var health = org + '/.github'
    var hBranchBase = health + '/blob/main'
    var slug = repo.split('/').slice(-2).join('/')
    var options

    var tree = [
      u('html', '<!--This file is generated by `build-packages.js`-->'),
      u('heading', {depth: 1}, [u('text', config.name)])
    ]

    tree.push(
      u('paragraph', [
        u('linkReference', {identifier: 'build'}, [
          u('imageReference', {identifier: 'build-badge', alt: 'Build'})
        ]),
        u('text', '\n'),
        u('linkReference', {identifier: 'coverage'}, [
          u('imageReference', {identifier: 'coverage-badge', alt: 'Coverage'})
        ]),
        u('text', '\n'),
        u('linkReference', {identifier: 'downloads'}, [
          u('imageReference', {identifier: 'downloads-badge', alt: 'Downloads'})
        ]),
        u('text', '\n'),
        u('linkReference', {identifier: 'size'}, [
          u('imageReference', {identifier: 'size-badge', alt: 'Size'})
        ]),
        u('text', '\n'),
        u('linkReference', {identifier: 'collective'}, [
          u('imageReference', {identifier: 'sponsors-badge', alt: 'Sponsors'})
        ]),
        u('text', '\n'),
        u('linkReference', {identifier: 'collective'}, [
          u('imageReference', {identifier: 'backers-badge', alt: 'Backers'})
        ]),
        u('text', '\n'),
        u('linkReference', {identifier: 'chat'}, [
          u('imageReference', {identifier: 'chat-badge', alt: 'Chat'})
        ])
      ])
    )

    tree = tree.concat(
      proc.parse(
        strip(
          overview + (overview.charAt(overview.length - 1) === '.' ? '' : '.')
        )
      ).children
    )

    tree.push(
      u('heading', {depth: 2}, [u('text', 'Install')]),
      u('paragraph', [
        u('linkReference', {identifier: 'npm', referenceType: 'collapsed'}, [
          u('text', 'npm')
        ]),
        u('text', ':')
      ]),
      u('code', {lang: 'sh'}, 'npm install ' + config.name)
    )

    if (ctx.plugins.indexOf(config.name) !== -1) {
      tree.push(
        u('heading', {depth: 2}, [u('text', 'Use')]),
        u('paragraph', [u('text', 'On the API:')]),
        u(
          'code',
          {lang: 'diff'},
          [
            ' unified()',
            "   .use(require('rehype-parse'))",
            "+  .use(require('" + config.name + "'))",
            "   .use(require('rehype-stringify'))",
            "   .process('<span>some html</span>', function (err, file) {",
            '     console.error(report(err || file))',
            '     console.log(String(file))',
            '   })'
          ].join('\n')
        ),
        u('paragraph', [u('text', 'On the CLI:')]),
        u(
          'code',
          {lang: 'sh'},
          'rehype input.html --use ' +
            config.name.replace(/^rehype-/, '') +
            ' > output.html'
        )
      )
    }

    if (config.longdescription) {
      tree = tree.concat(proc.parse(strip(config.longdescription)).children)
    }

    if (example && ctx.script) {
      options = example.slice(0, example.indexOf('\n'))

      if (options.trim()) {
        try {
          options = JSON.parse(options)
          example = example.slice(example.indexOf('\n') + 1)
        } catch (_) {
          options = {}
        }
      }

      example = strip(example)

      tree.push(u('heading', {depth: 2}, [u('text', 'Example')]))

      if (options.plugin) {
        tree.push(
          u('paragraph', [
            u('text', 'With '),
            u('inlineCode', inspect(options.plugin)),
            u('text', ' as options.')
          ])
        )
      }

      tree.push(
        u('heading', {depth: 5}, [u('text', 'In')]),
        u('code', {lang: 'html'}, example),
        u('heading', {depth: 5}, [u('text', 'Out')])
      )

      const mod = await import(ctx.script.path)

      if (!('default' in mod)) {
        throw new Error('Expected plugin to `export default`')
      }

      tree.push(
        u(
          'code',
          {lang: 'html'},
          rehype()
            .data('settings', options.processor || {fragment: true})
            .use(mod.default, options.plugin || undefined)
            .processSync(example)
            .toString()
            .trim()
        )
      )
    }

    tree.push(
      u('heading', {depth: 2}, [u('text', 'Contribute')]),
      u('paragraph', [
        u('text', 'See '),
        u('linkReference', {identifier: 'contributing'}, [
          u('inlineCode', 'contributing.md')
        ]),
        u('text', ' in '),
        u('linkReference', {identifier: 'health'}, [
          u('inlineCode', 'rehypejs/.github')
        ]),
        u('text', ' for ways\nto get started.\nSee '),
        u('linkReference', {identifier: 'support'}, [
          u('inlineCode', 'support.md')
        ]),
        u('text', ' for ways to get help.')
      ]),
      u('paragraph', [
        u('text', 'This project has a '),
        u('linkReference', {identifier: 'coc'}, [u('text', 'code of conduct')]),
        u(
          'text',
          '.\nBy interacting with this repository, organization, or community you agree to\nabide by its terms.'
        )
      ])
    )

    tree.push(
      u('heading', {depth: 2}, [u('text', 'License')]),
      u('paragraph', [
        u('linkReference', {identifier: 'license'}, [
          u('text', config.license)
        ]),
        u('text', ' © '),
        u('linkReference', {identifier: 'author'}, [u('text', licensee.name)])
      ])
    )

    tree.push(
      u('definition', {
        identifier: 'build-badge',
        url: 'https://github.com/' + slug + '/workflows/main/badge.svg'
      }),
      u('definition', {
        identifier: 'build',
        url: 'https://github.com/' + slug + '/actions'
      }),
      u('definition', {
        identifier: 'coverage-badge',
        url: 'https://img.shields.io/codecov/c/github/' + slug + '.svg'
      }),
      u('definition', {
        identifier: 'coverage',
        url: 'https://codecov.io/github/' + slug
      }),
      u('definition', {
        identifier: 'downloads-badge',
        url: 'https://img.shields.io/npm/dm/' + config.name + '.svg'
      }),
      u('definition', {
        identifier: 'downloads',
        url: 'https://www.npmjs.com/package/' + config.name
      }),
      u('definition', {
        identifier: 'size-badge',
        url:
          'https://img.shields.io/bundlephobia/minzip/' + config.name + '.svg'
      }),
      u('definition', {
        identifier: 'size',
        url: 'https://bundlephobia.com/result?p=' + config.name
      }),
      u('definition', {
        identifier: 'sponsors-badge',
        url: 'https://opencollective.com/unified/sponsors/badge.svg'
      }),
      u('definition', {
        identifier: 'backers-badge',
        url: 'https://opencollective.com/unified/backers/badge.svg'
      }),
      u('definition', {
        identifier: 'collective',
        url: 'https://opencollective.com/unified'
      }),
      u('definition', {
        identifier: 'chat-badge',
        url: 'https://img.shields.io/badge/chat-discussions-success.svg'
      }),
      u('definition', {
        identifier: 'chat',
        url: 'https://github.com/rehypejs/rehype/discussions'
      }),
      u('definition', {
        identifier: 'npm',
        url: 'https://docs.npmjs.com/cli/install'
      }),
      u('definition', {identifier: 'health', url: health}),
      u('definition', {
        identifier: 'contributing',
        url: hBranchBase + '/contributing.md'
      }),
      u('definition', {
        identifier: 'support',
        url: hBranchBase + '/support.md'
      }),
      u('definition', {
        identifier: 'coc',
        url: hBranchBase + '/code-of-conduct.md'
      }),
      u('definition', {identifier: 'license', url: branchBase + '/license'}),
      u('definition', {identifier: 'author', url: licensee.url})
    )

    ctx.readme = vfile(path.join(ctx.root, 'readme.md'))
    ctx.readme.contents = proc.stringify(u('root', tree), ctx.readme)
  })
  .use(function (ctx, next) {
    fs.writeFile(ctx.readme.path, String(ctx.readme), next)
  })
  .use(function (ctx) {
    ctx.readme.stored = true
  })
