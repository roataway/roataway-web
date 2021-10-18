const MAX_COLOR_INTENSITY = 255
const LUMA_THRESHOLD = 150
const LIGHT_CONTRAST = '#d3d3d3'
const DARK_CONTRAST = '#696969'
const PREDEFINED_COLORS = Object.freeze([
  {
    primary: '#a6cee3',
    secondary: '#a6dee3',
    contrast: DARK_CONTRAST,
  },
  {
    primary: '#b2df8a',
    secondary: '#b2ef8a',
    contrast: DARK_CONTRAST,
  },
  {
    primary: '#fb9a99',
    secondary: '#fbaa99',
    contrast: DARK_CONTRAST,
  },
  {
    primary: '#fdbf6f',
    secondary: '#fdcf6f',
    contrast: DARK_CONTRAST,
  },
  {
    primary: '#cab2d6',
    secondary: '#cac2d6',
    contrast: DARK_CONTRAST,
  },
  {
    primary: '#ffff99',
    secondary: '#ffffaa',
    contrast: DARK_CONTRAST,
  },
  {
    primary: '#b15928',
    secondary: '#b16928',
    contrast: LIGHT_CONTRAST,
  },
  {
    primary: '#e41a1c',
    secondary: '#ef5350',
    contrast: LIGHT_CONTRAST,
  },
  {
    primary: '#377eb8',
    secondary: '#64b5f6',
    contrast: LIGHT_CONTRAST,
  },
  {
    primary: '#4daf4a',
    secondary: '#81c784',
    contrast: LIGHT_CONTRAST,
  },
  {
    primary: '#984ea3',
    secondary: '#ba68c8',
    contrast: LIGHT_CONTRAST,
  },
  {
    primary: '#ff7f00',
    secondary: '#ffb74d',
    contrast: LIGHT_CONTRAST,
  },
])
const DEFAULT_BRIGHTNESS = 5

type Palette = { primary: string; secondary: string; contrast: string }

export const colorPalette = {
  colors: [...PREDEFINED_COLORS],
  get palette(): Palette {
    if (!this.colors.length) return randomColorPalette()

    return this.colors.pop()!
  },
  restoreAll() {
    this.colors = [...PREDEFINED_COLORS]
  },
  /**
   * Return predefined colors back to the colors pool
   * @param unusedColors - primary color(s) from palette
   */
  restore(...unusedColors: string[]) {
    this.colors.push(...PREDEFINED_COLORS.filter((predefinedColor) => unusedColors.includes(predefinedColor.primary)))
  },
}

export function randomColorPalette(brightness: number | undefined = DEFAULT_BRIGHTNESS): Palette {
  if (brightness >= MAX_COLOR_INTENSITY) brightness = MAX_COLOR_INTENSITY - 1
  const r = randomChannel(brightness)
  const g = randomChannel(brightness)
  const b = randomChannel(brightness)

  const primary = r + g + b

  // calculate luma coefficient https://en.wikipedia.org/wiki/Rec._709#Luma_coefficients
  const luma = 0.2126 * parseInt(r, 16) + 0.7152 * parseInt(g, 16) + 0.0722 * parseInt(b, 16)

  return {
    primary: '#' + primary,
    // make it a little bit lighter
    secondary: '#' + (parseInt(primary, 16) + 0x010101).toString(16),
    // consider luma > 150 as bright primary color
    contrast: luma > LUMA_THRESHOLD ? DARK_CONTRAST : LIGHT_CONTRAST,
  }
}

function randomChannel(brightness: number): string {
  const r = MAX_COLOR_INTENSITY - brightness
  const n = Math.floor(Math.random() * r + brightness)
  const s = n.toString(16)
  return s.length === 1 ? '0' + s : s
}
