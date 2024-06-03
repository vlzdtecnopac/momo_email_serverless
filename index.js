const serverless = require("serverless-http");
const express = require("express");
const app = express();
const nodemailer = require('nodemailer');
const { contentEmail } = require("./template/template");

require('dotenv').config();

var AWS = require('aws-sdk');
const { contentEmailInvoice } = require("./template/template.invoice");
const sns = new AWS.SNS({ apiVersion: '2010-03-31' })

app.use(express.json());

app.post("/", async (req, res, next) => {
  const { from, to, subject, client_id } = req.body;

  if (!from || !to || !subject || !client_id) {
    return res.status(400).json({
      message: 'Se requieren las propiedades "from", "to", "subject" y "client_id" en el cuerpo de la solicitud.'
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
      html: contentEmail(client_id)
    };

    let info = await transporter.sendMail(mailOptions);

    return res.status(200).json({
      message: "Correo enviado...",
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

app.post('/sms', (req, res) => {
  const { phone, subject, message, topic, client_id } = req.body;

  if (!phone || !subject || !message || !topic || !client_id) {
    return res.status(400).json({
      message: 'Se requieren las propiedades "phone", "subject", "topic", "message" y "client_id" en el cuerpo de la solicitud.'
    });
  }

  const params_sub = {
    Protocol: 'sms', 
    TopicArn: topic, 
    Endpoint: phone 
  };

 sns.subscribe(params_sub, (err, data) => {
    if (err) {
      console.error("Error al suscribirse al tema SNS:", err);
      return res.status(500).json({
        message: "Error al enviar el correo",
        error: err
      });
    } else {

      const params = {
        Message: message,
        PhoneNumber: phone,
        MessageAttributes: {
          'AWS.SNS.SMS.SenderID': {
            'DataType': 'String',
            'StringValue': subject
          }
        }
      };

      var publishTextPromise = sns.publish(params).promise();

      publishTextPromise.then(
        function (data) {
          return res.status(200).json({
            message: "SMS enviado exitosamente",
            messageId: data.MessageId
          });
        }).catch(
          function (err) {
            return res.status(500).json({
              message: "SMS error, no fue enviado",
              error: err
            });
          });

    }
  });
});

app.post('/invoice',  async (req, res, next) => {
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
      html: contentEmailInvoice("#FIUWIIE")
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
})


module.exports.handler = serverless(app);
