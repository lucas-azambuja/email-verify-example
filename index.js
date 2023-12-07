const express = require('express')
const cors = require('cors')
const { verifyEmail, isDisposableEmail, isFreeEmail } = require('@devmehq/email-validator-js')

const port = process.env.PORT || 3001

const app = express()
app.use(cors())

app.get('/email-verify/:email', async (req, res) => {
  const emailAddress = req.params.email
  const { validFormat, validSmtp, validMx } = await verifyEmail({ emailAddress, verifyMx: true, verifySmtp: true, timeout: 8000 });
  const isDisposable = isDisposableEmail(emailAddress)
  const isFree = isFreeEmail(emailAddress)

  let success = true
  let message = 'Email is valid!'

  if (!validFormat) {
    success = false
    message = 'Invalid email format'
  }

  if (validSmtp === false) { // SMTP can be null
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

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

server.keepAliveTimeout = 120 * 1000
server.headersTimeout = 120 * 1000