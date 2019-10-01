import React from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slide from '@material-ui/core/Slide'

import Card from '@material-ui/core/Card'
// import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent'
// import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography'

import { withStyles, StyleRulesCallback } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'

const styles: StyleRulesCallback<any, any> = theme => ({
  routeTile: {
    backgroundColor: 'green',
  },
})

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

// export default function AlertDialogSlide() {

// }

function RouteSelector(props) {
  const { t } = useTranslation()
  const { classes } = props

  // TODO load these dynamically from the CSV
  let routes: string[] = ['30', '32', '22']

  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    console.log('Clicked open')
    setOpen(true)
  }

  const handleClose = () => {
    console.log('Clicked close')
    setOpen(false)
  }

  const tileClick = () => {
    // TODO get its ID into this function somehow
    console.log('Route tile was clicked')
    // console.log("Route tile was clicked with " + tileId)
  }

  return (
    // <div className="routeTile"></div>
    <Dialog
      open={open}
      // TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description">
      <DialogTitle id="alert-dialog-slide-title">
        {t('label.pickRoute')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {t('explanation.pickRoute')}
        </DialogContentText>

        {/* TODO render cards here, one for each route */}
        {/* {
        for (const [index, value] of elements.entries()) {
          items.push(<li key={index}>{value}</li>)
        }
      } */}

        <Card onClick={tileClick}>
          <CardContent>
            <Typography variant="h5" component="h2">
              "30"
            </Typography>
          </CardContent>
        </Card>

        <Card onClick={tileClick}>
          <CardContent>
            <Typography variant="h5" component="h2">
              "32"
            </Typography>
          </CardContent>
        </Card>

        <Card onClick={tileClick}>
          <CardContent>
            <Typography variant="h5" component="h2">
              "22"
            </Typography>
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Disagree
        </Button>
        <Button onClick={handleClose} color="primary">
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export const RouteSelectorComponent = withStyles(styles)(RouteSelector)
