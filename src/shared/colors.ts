const MAX_COLOR_INTENSITY = 255
const LUMA_THRESHOLD = 150
const PREDEFINED_COLORS = Object.freeze([
  {
    primary: '#e41a1c',
    secondary: '#ef5350',
  },
  {
    primary: '#377eb8',
    secondary: '#64b5f6',
  },
  {
    primary: '#4daf4a',
    secondary: '#81c784',
  },
  {
    primary: '#984ea3',
    secondary: '#ba68c8',
  },
  {
    primary: '#ff7f00',
    secondary: '#ffb74d',
  },
])
const LIGHT_CONTRAST = '#d3d3d3'
const DARK_CONTRAST = '#696969'
const DEFAULT_BRIGHTNESS = 5

type Palette = { primary: string; secondary: string; contrast: string }

export const colorPalette = {
  colors: [...PREDEFINED_COLORS],
  get palette(): Palette {
    if (!this.colors.length) return randomColorPalette()

    const { primary, secondary } = this.colors.pop()!

    return {
      primary,
      secondary,
      contrast: LIGHT_CONTRAST,
    }
  },
  restore() {
    this.colors = [...PREDEFINED_COLORS]
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

function randomChannel(brightness): string {
  const r = MAX_COLOR_INTENSITY - brightness
  const n = Math.floor(Math.random() * r + brightness)
  const s = n.toString(16)
  return s.length === 1 ? '0' + s : s
}
