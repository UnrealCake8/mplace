export function renderDocument({ html = '', css = '', javascript = '' }) {
  // Closing tags are escaped so authored content cannot terminate the containers
  // used to assemble srcdoc and turn CSS/text into executable parent markup.
  const safeCss = css.replace(/<\/style/gi, '<\\/style')
  const safeScript = javascript.replace(/<\/script/gi, '<\\/script')
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{min-height:100%;margin:0}${safeCss}</style></head><body>${html}<script>${safeScript}<\/script></body></html>`
}
