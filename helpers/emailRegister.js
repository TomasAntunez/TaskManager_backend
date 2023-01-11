import nodemailer from 'nodemailer';

const emailRegister = async data => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const { name, email, token } = data;

    const info = await transporter.sendMail({
      from: 'Tasks Manager',
      to: email,
      subject: 'Confirm your TM account',
      text: 'Confirm your TM account',
      html: `
        <p>Hi ${name}, check your account in TM.</p>
        <p>Your account is ready, you must confirm it in the following link:
        <a href="${process.env.FRONTEND_URL}/confirm-account/${token}">Confirm Account</a></p>

        <p>If you did not create this account you can ignore this message</p>
      `
    });

    console.log('Mensaje enviado: %s', info.messageId);
};

export default emailRegister;