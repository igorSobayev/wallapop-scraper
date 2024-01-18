import { transporter } from "./index.js";

async function run () {
    return transporter.sendMail({
        from: '"Er admin 👻" <isobayev@gmail.com>', // sender address
        to: "k0sacov01@gmail.com", // list of receivers
        subject: "Sesión iniciada", // Subject line
        text: "Texto plano bro", // plain text body
        html: "<b>Sesión iniciada, lets gooo</b>", // html body
    });
}

export default { run }