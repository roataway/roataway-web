import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'
import { TransitionProps } from '@material-ui/core/transitions'
import { useTranslation } from 'react-i18next'
import { routes } from '../data/routes'

const Transition = React.forwardRef(function(props: TransitionProps, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

type Props = {
  isOpen: boolean
  setOpen: (isOpen: boolean) => void
  setSelectedRoutes: (selectedRoutes: Set<string>) => void
  selectedRoutes: Set<string>
}

export function RouteSelectDialog(props: Props) {
  const { isOpen, setOpen, setSelectedRoutes, selectedRoutes } = props
  const [l10n] = useTranslation()

  function selectRoute(id: string) {
    if (selectedRoutes.has(id)) {
      selectedRoutes.delete(id)
    } else {
      selectedRoutes.add(id)
    }
    setSelectedRoutes(selectedRoutes)
    setOpen(false)
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => setOpen(false)}
      TransitionComponent={Transition}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">
        {l10n('explanation.pickRoute')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {routes.map(r => (
            <Button
              onClick={() => selectRoute(r.name_concise)}
              color="secondary"
              key={r.id_upstream}>
              {r.name_concise}
            </Button>
          ))}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}
