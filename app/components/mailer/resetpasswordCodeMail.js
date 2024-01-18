import { transporter } from "./index.js";

async function run ({ to, code }) {
    return transporter.sendMail({
        from: '"Nautilus Kitchen" <isobayev@gmail.com>', // sender address
        to: to, // list of receivers
        subject: "Reset password code", // Subject line
        text: `TU código de recuperación es el siguiente: ${code}`, // plain text body
        html: `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <meta http-equiv="x-ua-compatible" content="ie=edge">
                <title>Reset password code</title>
            </head>
            <body>
                <h2>Hola! </h2>
                <p>Tu código de recuperación es <b>${code}</b>. </p>
            </body>
        </html>
        `,
    });
}

export default { run }