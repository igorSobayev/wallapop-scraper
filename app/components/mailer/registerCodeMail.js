import { transporter } from "./index.js";

async function run ({ user, code }) {
    return transporter.sendMail({
        from: `"Wallatracker" <${process.env.MAILER_USER}>`, // sender address
        to: user.email, // list of receivers
        subject: "Codigo de verificación", // Subject line
        text: `Tu código de verificación es el siguiente: ${code}`, // plain text body
        html: `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <meta http-equiv="x-ua-compatible" content="ie=edge">
                <title>Codigo de verificación</title>
            </head>
            <body>
                <h2>Hola! </h2>
                <p>Tu código de verificación es <b>${code}</b>. </p>
                <a href="${process.env.DOMAIN_URL}/signup/verify?username=${user.username}&code=${code}">Verificar</a>
            </body>
        </html>
        `,
    });
}

export default { run }