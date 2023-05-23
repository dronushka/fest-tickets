import nodemailer from 'nodemailer'

export const emailTransporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: process.env.MAIL_PORT === "465",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
    // debug: true,
    // logger: true
})

export async function sendVerificationRequest({ identifier, url }: { identifier: string, url: string }) {
    const result = await emailTransporter.sendMail({
        to: identifier,
        from: `"Нян-фест 2023" <${process.env.MAIL_FROM}>`,
        subject: "Нян-фест 2023 | Одноразовая ссылка для входа в систему приобретения билетов",
        text: url
    })

    const failed = result.rejected.concat(result.pending).filter(Boolean)
    if (failed.length) {
        throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
    }
}