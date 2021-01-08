export function generateMailto(to: string, subject: string, body: string, cc?: string): string {
  /**
   * Produce a mailto link with predefined subject and body.
   *
   * @param to - To whom we send the email
   * @param subject - Subject of the email
   * @param body - Message text
   * @param cc - Optional, carbon copy to send to
   * @returns The URL ready for use in the HREF attribute of the A tag
   */

  // use https://mailtolinkgenerator.com for experiments with the structure of such links

  if (cc) {
    return `mailto:${to}?cc=${cc}&subject=${encodeURI(subject)}&body=${encodeURI(body)}`
  }

  return `mailto:${to}?subject=${encodeURI(subject)}&body=${encodeURI(body)}`
}
