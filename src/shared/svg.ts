export function svg(path: string, style = ''): string {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="${style}">`,
    `<path d="${path}"></path>`,
    `</svg>`,
  ].join('')
}

export function svgDataUri(path: string, style = '') {
  return `data:image/svg+xml,${svg(path, style)}`
}
