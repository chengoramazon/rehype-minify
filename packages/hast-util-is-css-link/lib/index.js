/**
 * @typedef {import('hast').Nodes} Nodes
 */

import {collapseWhiteSpace} from 'collapse-white-space'

/**
 * Check whether a hast node is a `<link>` that references CSS.
 *
 * Returns `true` if `node` is a `<link>` element with a `rel` list that
 * contains `'stylesheet'` and has no `type`, an empty `type`, or `'text/css'`
 * as its `type`.
 *
 * @param {Nodes} node
 *   Node to check.
 * @returns {boolean}
 *   Whether `node` is a CSS link.
 */
export function isCssLink(node) {
  if (node.type !== 'element' || node.tagName !== 'link') {
    return false
  }

  const rel = node.properties.rel

  if (!rel || !Array.isArray(rel) || !rel.includes('stylesheet')) {
    return false
  }

  const value = collapseWhiteSpace(String(node.properties.type || ''), {
    style: 'html',
    trim: true
  }).toLowerCase()

  return value === '' || value === 'text/css'
}
