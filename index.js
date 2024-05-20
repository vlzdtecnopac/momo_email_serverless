const serverless = require("serverless-http");
const express = require("express");
const app = express();
const nodemailer = require('nodemailer');
const { contentEmail } = require("./template/template");

require('dotenv').config();

app.use(express.json());

app.post("/", async (req, res, next) => {
  const { from, to, subject } = req.body;

  if (!from || !to || !subject) {
    return res.status(400).json({
      message: 'Se requieren las propiedades "from", "to" y "subject" en el cuerpo de la solicitud.'
    });
  }

  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    let mailOptions = {
      from,
      to,
      subject,
      text: 'Error en el email.',
      html: contentEmail
    };

    let info = await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "Correo enviado exitosamente",
      messageId: info.messageId
    });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    return res.status(500).json({
      message: "Error al enviar el correo",
      error: error.message
    });
  }
});


module.exports.handler = serverless(app);
