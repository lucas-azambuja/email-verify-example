const express = require('express')
const { verifyEmail, isDisposableEmail, isFreeEmail } = require('@devmehq/email-validator-js')

const app = express()
const port = process.env.PORT || 3001

app.get('/email-verify/:email', async (req, res) => {
  const emailAddress = req.params.email
  const { validFormat, validSmtp, validMx } = await verifyEmail({ emailAddress, verifyMx: true, verifySmtp: true, timeout: 3000 });
  const isDisposable = isDisposableEmail(emailAddress)
  const isFree = isFreeEmail(emailAddress)

  let success = true
  let message = 'Email is valid!'

  if (!validFormat) {
    success = false
    message = 'Invalid email format'
  }

  if (!validSmtp) {
    success = false
    message = 'Invalid SMTP'
  }

  if (!validMx) {
    success = false
    message = 'Invalid MX'
  }

  if (isDisposable) {
    success = false
    message = 'Disposable email'
  }

  res.json({
    success,
    message,
    details: {
      validFormat,
      validSmtp,
      validMx,
      isDisposable,
      isFree
    }
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})