import { default as React, useState, useEffect } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { TheMap } from './the-map'
import { NavigationBarComponent } from './components/navigation-bar.component'
import { useTranslation } from 'react-i18next'
import { HudButtons } from './components/hud-buttons.component'
import { RouteSelectDialog } from './components/route-select.dialog'
import { useDocumentTitle } from './shared/document-title.hook'
import { i18n, resources } from './i18n'

export function AppComponent() {
  const { t } = useTranslation()
  useDocumentTitle(t('label.title'))
  const [isOpenRouteSelect, setIsOpenRouteSelect] = useState(false)
  // Maybe keep it in local storage?
  const [showUserLocation, setShowUserLocation] = useState(false)
  const [selectedRoutes, setSelectedRoutes] = useState<Set<string>>(new Set())

  useEffect(() => {
    let lang = localStorage.getItem('language')
    if (!lang) {
      let client = new XMLHttpRequest()
      client.open('GET', window.location.origin, true)
      client.send()

      client.onreadystatechange = function() {
        if (this.readyState === this.HEADERS_RECEIVED) {
          let serverLang = client.getResponseHeader('Accept-Language')
          // let serverLang = 'en-US,en;q=0.9,ar;q=0.8,de;q=0.7,ko;q=0.6,it;q=0.5,nl;q=0.4,pt;q=0.3,ru;q=0.2,es;q=0.1,ga;q=0.1,af;q=0.1,ca;q=0.1,gd;q=0.1,fr;q=0.1';
          if (!serverLang) {
            localStorage.setItem('language', 'en')
            i18n.changeLanguage('en')
          } else {
            serverLang = serverLang.split(',')[0].split('-')[0]
            if (serverLang in resources) {
              localStorage.setItem('language', serverLang)
              i18n.changeLanguage(serverLang)
            }
          }
        }
      }
    } else {
      i18n.changeLanguage(lang)
    }
  }, [])

  return (
    <React.Fragment>
      <CssBaseline />

      <NavigationBarComponent />

      <HudButtons
        isOpenRouteSelect={isOpenRouteSelect}
        setIsOpenRouteSelect={setIsOpenRouteSelect}
        setShowUserLocation={setShowUserLocation}
      />

      <RouteSelectDialog
        isOpen={isOpenRouteSelect}
        setOpen={setIsOpenRouteSelect}
        selectedRoutes={selectedRoutes}
        setSelectedRoutes={setSelectedRoutes}
      />

      <TheMap
        selectedRoutes={selectedRoutes}
        showUserLocation={showUserLocation}
      />
    </React.Fragment>
  )
}
