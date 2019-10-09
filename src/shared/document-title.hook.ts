import { useEffect } from 'react'

export function useDocumentTitle(title: string) {
  useEffect(
    function() {
      document.title = title
    },
    [title],
  )
}
