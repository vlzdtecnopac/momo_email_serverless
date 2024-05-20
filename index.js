const serverless = require("serverless-http");
const express = require("express");
const app = express();
const nodemailer = require('nodemailer');
const { contentEmail } = require("./template/template");

require('dotenv').config();

var AWS = require('aws-sdk');
const sns = new AWS.SNS({ apiVersion: '2010-03-31' })

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

app.post('/sms', (req, res) => {
  const { phone, subject } = req.body;

  if (!from || !to || !subject) {
    return res.status(400).json({
      message: 'Se requieren las propiedades "phone", "subject" en el cuerpo de la solicitud.'
    });
  }

  const params_sub = {
    Protocol: 'sms', 
    TopicArn: 'arn:aws:sns:us-east-1:946074075589:Momo', 
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
        Message: "Bienvenido a Momo Coffe, ingresando aqui puedes verificar tu cuenta.",
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
          res.end(JSON.stringify({ MessageID: data.MessageId }));
        }).catch(
          function (err) {
            res.end(JSON.stringify({ Error: err }));
          });

    }
  });
});


module.exports.handler = serverless(app);
