const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email,name) => {
    sgMail.send({
        to: email,
        from: 'mirmadmood@yahoo.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the App, ${name}. Let me know how you get along with the app.`
    })
}

const sendGoodbyeEmail = (email,name) => {
    sgMail.send({
        to: email,
        from: 'mirmadmood@yahoo.com',
        subject: 'Sorry to see you go!',
        text: `It was a pleasure having you, ${name}. Let me know how the app was.`
    })
}
module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
}