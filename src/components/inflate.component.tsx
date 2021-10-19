import { cloneElement, PropsWithChildren, ReactElement, Fragment } from 'react'

/**
 * Nests all elements from top to bottom
 * https://dev.to/iamandrewluca/flat-react-doom-pyramid-in-1loc-3j7p
 */
export function Inflate(props: PropsWithChildren<{ elements: ReactElement[] }>) {
  const { elements: e, children: init } = props
  return <Fragment>{e.reduceRight((c, e) => cloneElement(e, { children: c }), init)}</Fragment>
}
