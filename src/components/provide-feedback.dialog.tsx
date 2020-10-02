import React from 'react'
import { useForm } from 'react-hook-form'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core'
import { useTranslation } from 'react-i18next'

type Props = {
  isOpen: boolean
  setOpen: (isOpen: boolean) => void
}

type FeedbackFormValues = {
  name: string
  email: string
  content: string
}

export function ProvideFeedbackDialog(props: Props) {
  const { register, handleSubmit, errors } = useForm<FeedbackFormValues>()
  const { t } = useTranslation()

  function handleClose() {
    props.setOpen(false)
  }

  function handleSubmitFeedback() {
    handleClose()
  }

  console.log({ errors })

  return (
    <Dialog open={props.isOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
      <form onSubmit={handleSubmit(handleSubmitFeedback)}>
        <DialogTitle id="form-dialog-title"> {t('label.feedback')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('label.feedback.description')}</DialogContentText>
          <TextField
            ref={register}
            variant="outlined"
            autoFocus
            id="name"
            label={t('label.name')}
            type="text"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            ref={register}
            variant="outlined"
            id="email"
            label={t('label.email')}
            type="email"
            margin="normal"
            fullWidth
            required
          />

          <TextField
            ref={register}
            variant="outlined"
            id="content"
            label={t('label.content')}
            rows={5}
            multiline
            fullWidth
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {t('button.cancel')}
          </Button>
          <Button type="submit" color="primary">
            {t('button.submit')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
