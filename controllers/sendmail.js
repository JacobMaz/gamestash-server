const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transport = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}))

transport.sendMail({
    to: 'jakemazanowski@gmail.com',
    from: 'jmgamingcompany@gmail.com',
    subject: 'Hello World!',
    html: '<h2>HELLLLLLO WOOOOORRRRRLLLLLDD!</h2>'
})
.catch(err=>console.log(err))