const serverless = require("serverless-http");
const express = require("express");
const app = express();
const nodemailer = require('nodemailer');
const AWS = require('aws-sdk');
const { contentEmail } = require("./template/template");
const { PublishCommand } = require('@aws-sdk/client-sns');
const config = require("./config.json");
require('dotenv').config();

app.use(express.json());

const sns = new AWS.SNS({
  region: config.region,
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey
  }
});

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

app.post("/sms", async (req, res, next) => {
  try {
    const params = {
      Message: `Your OTP code is: ${Math.random().toString().substring(2, 8)}`,
      PhoneNumber: '+573011625380',
      MessageAttributes: {
        'AWS.SNS.SMS.SenderID': {
          'DataType': 'String',
          'StringValue': 'YourSenderID'
        }
      }
    };

    await sendSMSMessage(params);

    return res.status(200).json({
      message: "SMS sent successfully",
    });
  } catch (error) {
    console.error("Error sending SMS:", error);
    return res.status(500).json({
      message: "Error sending SMS",
      error: error.message
    });
  }
});

async function sendSMSMessage(params) {
  const command = new PublishCommand(params);
  await sns.send(command);
}



module.exports.handler = serverless(app);
