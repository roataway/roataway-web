const basename = '/exchange/e_public_rtec_Sho0ohCiephoh2waeM9t'

export const route = <T extends string>(path: T) => {
  return `${basename}/${path}` as T
}
