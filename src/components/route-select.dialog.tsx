import { useState, forwardRef } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'
import { TransitionProps } from '@material-ui/core/transitions'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { useTranslation } from 'react-i18next'
import { routes as allRoutes } from '../shared/routes'
import { useTheme } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/core'
import { useSelectedRoutes } from '../selected-routes.context'

const Transition = forwardRef(function (props: TransitionProps, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const useStyles = makeStyles((theme) => ({
  buttonMargin: {
    margin: theme.spacing(1) / 2,
  },
  routesSpacing: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'start',
  },
  contentSplit: {
    display: 'flex',
    alignContent: 'space-between',
  },
  actions: {
    justifyContent: 'space-between',
    paddingLeft: theme.spacing(2),
  },
}))

type Props = {
  isOpen: boolean
  setOpen: (isOpen: boolean) => void
}

export function RouteSelectDialog(props: Props) {
  const { isOpen, setOpen } = props
  const theme = useTheme<Theme>()
  const classes = useStyles()
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'))
  const [selectMultiple, setSelectMultiple] = useSelectMultiple()
  const [l10n] = useTranslation()
  const { routes, setRoutes } = useSelectedRoutes()

  function selectRoute(id: string) {
    if (routes.has(id)) {
      routes.delete(id)
    } else {
      routes.add(id)
    }
    setRoutes(new Set(routes))
    if (!selectMultiple) {
      setOpen(false)
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
      <DialogContent dividers className={classes.routesSpacing}>
        {allRoutes.map((r) => (
          <Button
            className={classes.buttonMargin}
            onClick={() => selectRoute(r.id_upstream)}
            color="secondary"
            variant={routes.has(r.id_upstream) ? 'outlined' : 'text'}
            key={r.id_upstream}
          >
            {r.name_concise}
          </Button>
        ))}
      </DialogContent>
      <DialogActions disableSpacing className={classes.actions}>
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
