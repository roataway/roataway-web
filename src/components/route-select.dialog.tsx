import { useState, forwardRef } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import Slide, { SlideProps } from '@mui/material/Slide'
import useMediaQuery from '@mui/material/useMediaQuery'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { useTranslation } from 'react-i18next'
import { routes as allRoutes } from '../shared/routes'
import { useTheme } from '@mui/material'
import { useSelectedRoutes } from '../selected-routes.context'
import { useAnalytics } from '../analytics.context'

const Transition = forwardRef(function (props: SlideProps, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

type Props = {
  isOpen: boolean
  setOpen: (isOpen: boolean) => void
}

export function RouteSelectDialog(props: Props) {
  const { isOpen, setOpen } = props
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [selectMultiple, setSelectMultiple] = useSelectMultiple()
  const [l10n] = useTranslation()
  const { routes, setRoutes } = useSelectedRoutes()
  const analytics = useAnalytics()

  function selectRoute(id: string) {
    if (!routes.has(id)) analytics.track('Route Select', { id })

    if (selectMultiple) {
      // When multiple, add or exclude and don't close dialog
      const newRoutes = routes.has(id) ? [...routes].filter((r) => r !== id) : [...routes, id]
      setRoutes(new Set(newRoutes))
    } else {
      // When single, add or remove single only
      const newRoutes = routes.has(id) ? [] : [id]
      setRoutes(new Set(newRoutes))
      // Close Dialog only if we have at least 1 selected
      if (newRoutes.length) setOpen(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      fullScreen={fullScreen}
      onClose={() => setOpen(false)}
      TransitionComponent={Transition}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{l10n('explanation.pickRoute')}</DialogTitle>
      <DialogContent
        dividers
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignContent: 'start',
        }}
      >
        {allRoutes.map((r) => (
          <Button
            sx={{ margin: (t) => t.spacing(1 / 2) }}
            onClick={() => selectRoute(r.id_upstream)}
            color="secondary"
            variant={routes.has(r.id_upstream) ? 'outlined' : 'text'}
            key={r.id_upstream}
          >
            {r.name_concise}
          </Button>
        ))}
      </DialogContent>
      <DialogActions
        disableSpacing
        sx={{
          justifyContent: 'space-between',
          paddingLeft: (t) => t.spacing(2),
        }}
      >
        <FormControlLabel
          label={l10n('label.selectMultiple')}
          control={
            <Checkbox
              checked={selectMultiple}
              onChange={() => setSelectMultiple(!selectMultiple)}
              value="selectMultiple"
              color="primary"
            />
          }
        />
        <Button color="primary" onClick={() => setOpen(false)}>
          {l10n('label.close')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function useSelectMultiple(): [boolean, (value: boolean) => void] {
  const [selectMultiple, setSelectMultiple] = useState<boolean>(() => {
    try {
      const fromStorage = localStorage.getItem('select-multiple')
      return fromStorage ? JSON.parse(fromStorage) : false
    } catch {
      return false
    }
  })

  function _setSelectMultiple(value: boolean) {
    localStorage.setItem('select-multiple', value.toString())
    return setSelectMultiple(value)
  }

  return [selectMultiple, _setSelectMultiple]
}
