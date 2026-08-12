import { describe, expect, it } from 'vitest'
import { renderDocument } from './document'

describe('renderDocument', () => {
  it('combines authored HTML, CSS, and JavaScript', () => {
    const result = renderDocument({ html: '<h1>Hello</h1>', css: 'h1{color:red}', javascript: 'document.body.dataset.ready=1' })
    expect(result).toContain('<h1>Hello</h1>')
    expect(result).toContain('h1{color:red}')
    expect(result).toContain('document.body.dataset.ready=1')
  })
  it('does not let closing tags escape generated containers', () => {
    const result = renderDocument({ css: '</style><script>bad()</script>', javascript: '</script><h1>bad</h1>' })
    expect(result).toContain('<\\/style>')
    expect(result).toContain('<\\/script>')
  })
})
