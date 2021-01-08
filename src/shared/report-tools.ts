/**
 * Produce a mailto link with predefined subject and body.
 * Use https://mailtolinkgenerator.com for experiments with the structure of such links
 *
 * @param to - To whom we send the email
 * @param subject - Subject of the email
 * @param body - Message text
 * @param cc - Optional, carbon copy to send to
 * @returns The URL ready for use in the HREF attribute of the A tag
 */
export function generateMailto(to: string, subject: string, body: string, cc?: string): string {
  return cc
    ? `mailto:${to}?cc=${cc}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    : `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
