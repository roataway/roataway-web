import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Snackbar,
} from '@mui/material'
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
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null)
  const { handleSubmit, control } = useForm<FeedbackFormValues>()
  const { t } = useTranslation()

  function handleClose() {
    props.setOpen(false)
  }

  async function handleSubmitFeedback(data: FeedbackFormValues) {
    const { REACT_APP_SENTRY_DSN, REACT_APP_SENTRY_ORGANIZATION_SLUG, REACT_APP_SENTRY_PROJECT_SLUG } = process.env

    const body = {
      event_id: Date.now(),
      name: data.name,
      email: data.email,
      comments: data.content,
    }

    fetch(
      `https://sentry.io/api/0/projects/${REACT_APP_SENTRY_ORGANIZATION_SLUG}/${REACT_APP_SENTRY_PROJECT_SLUG}/user-feedback/`,
      {
        method: 'POST',
        headers: {
          Authorization: `DSN ${REACT_APP_SENTRY_DSN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    )
      .then(() => {
        setSnackbarMessage(t('message.submitFeedback.success'))
      })
      .catch(() => {
        setSnackbarMessage(t('message.submitFeedback.error'))
      })

    handleClose()
  }

  function handleCloseSnackbar() {
    setSnackbarMessage('')
  }

  return (
    <>
      <Dialog open={props.isOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
        <form onSubmit={handleSubmit(handleSubmitFeedback)}>
          <DialogTitle> {t('label.feedback')}</DialogTitle>
          <DialogContent>
            <DialogContentText>{t('label.feedback.description')}</DialogContentText>
            <Controller
              as={TextField}
              control={control}
              name="name"
              defaultValue=""
              variant="outlined"
              autoFocus
              label={t('label.name')}
              type="text"
              fullWidth
              margin="normal"
              required
            />

            <Controller
              as={TextField}
              control={control}
              name="email"
              defaultValue=""
              variant="outlined"
              label={t('label.email')}
              type="email"
              margin="normal"
              fullWidth
              required
            />

            <Controller
              as={TextField}
              control={control}
              name="content"
              defaultValue=""
              variant="outlined"
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

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        autoHideDuration={3000}
        open={Boolean(snackbarMessage)}
        message={snackbarMessage}
        onClose={handleCloseSnackbar}
      />
    </>
  )
}
