import { default as React, useState, useEffect } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import { TheMap } from './the-map'
import { NavigationBarComponent } from './components/navigation-bar.component'
import { useTranslation } from 'react-i18next'
import { HudButtons } from './components/hud-buttons.component'
import { RouteSelectDialog } from './components/route-select.dialog'
import { useDocumentTitle } from './shared/document-title.hook'

export function AppComponent() {
  const { t, i18n } = useTranslation()
  useDocumentTitle(t('label.title'))
  const [isOpenRouteSelect, setIsOpenRouteSelect] = useState(false)
  // Maybe keep it in local storage?
  const [showUserLocation, setShowUserLocation] = useState(false)
  const [selectedRoutes, setSelectedRoutes] = useState<Set<string>>(new Set())
  const [leftHanded, setLeftHanded] = useLeftHanded()

  useEffect(() => {
    const language =
      localStorage.getItem('language') || navigator.language.split('-')[0]
    const existingLanguage = i18n.hasResourceBundle(language, 'translation')
      ? language
      : 'en'
    localStorage.setItem('language', existingLanguage)
    i18n.changeLanguage(existingLanguage)
  }, [i18n])

  return (
    <React.Fragment>
      <CssBaseline />

      <NavigationBarComponent
        leftHanded={leftHanded}
        setLeftHanded={setLeftHanded}
      />

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
        leftHanded={leftHanded}
      />
    </React.Fragment>
  )
}

function useLeftHanded(): [boolean, (value: boolean) => void] {
  const [leftHanded, setLeftHanded] = React.useState(
    // || 'true' covers the case when no `left-handed` in storage
    (localStorage.getItem('left-handed') || 'true') === 'true',
  )

  function changeLeftHanded(value: boolean) {
    localStorage.setItem('left-handed', value.toString())
    setLeftHanded(value)
  }

  return [leftHanded, changeLeftHanded]
}
