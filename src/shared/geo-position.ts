export async function getLocation(): Promise<GeolocationPosition> {
  if (navigator?.geolocation) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })
  }

  throw new Error('Geolocation not supported by the browser')
}
