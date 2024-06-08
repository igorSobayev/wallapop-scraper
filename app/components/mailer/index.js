import nodemailer from 'nodemailer'
import testMail from './testMail.js'
import resetPasswordCodeMail from './resetpasswordCodeMail.js'
import registerCodeMail from './registerCodeMail.js'
import paymentConfirmMail from './paymentConfirmMail.js'

export const transporter = nodemailer.createTransport({
  host: process.env.MAILER_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS,
  },
})

transporter.verify().then(() => {
    console.log('Mailer is ready!')
})

async function sendEmail ({ templateName, info }) {
  switch(templateName) {
    case 'TEST':
      return testMail.run()
    case 'RESET_PASSWORD':
      return resetPasswordCodeMail.run({ to: info.to, code: info.code })
    case 'REGISTER_CODE':
      return registerCodeMail.run({ user: info.user, code: info.code })
    case 'PAYMENT_CONFIRM':
      return paymentConfirmMail.run({ user: info.user })
    default:
      break
  }
}

const Mailer = {
  sendEmail,
}

export default Mailer