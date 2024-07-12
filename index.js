const serverless = require("serverless-http");
const express = require("express");
const app = express();
const nodemailer = require('nodemailer');
const cors = require("cors");
const { contentEmail } = require("./template/template");
var moment = require('moment-timezone');
const zonaHoraria = 'America/Mexico_City';

const { createConnection, endConnection } = require("./db/index");
require('dotenv').config();

var AWS = require('aws-sdk');
const { contentEmailInvoice } = require("./template/template.invoice");
const sns = new AWS.SNS({ apiVersion: '2010-03-31' })

app.use(express.json());
app.use(cors());

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
  const { from, to, subject, bilding_id} = req.body;
 
  if (!from || !to || !subject || !bilding_id) {
    return res.status(400).json({
      message: 'Se requieren las propiedades "from", "to", "subject", "bilding_id" en el cuerpo de la solicitud.'
    });
  }

  const db = await createConnection();

  const query = `
  SELECT b.id, b.shopping_id, b.kiosko_id, s.name_shopping, k.nombre,  bilding_id, b.shopping_id, b.kiosko_id, "name", 
  type_payment, propina, cupon, iva, subtotal, total, b.state, b.create_at, b.update_at, mount_receive, mount_discount, 
  product_toteat, c.type_discount, c.type_vigente, b.order_id, b.payment_id, b.iva, b.table_id
FROM "Bilding" b
LEFT JOIN "Shopping" s ON b.shopping_id = s.shopping_id
LEFT JOIN "Kiosko" k ON b.kiosko_id = k.kiosko_id
LEFT JOIN "Cupones" c on c.name_cupon = b.cupon 
WHERE b.bilding_id=$1;`;

  try {
    const results = await db.query(query,[bilding_id]);

    let transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SMTP,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    let line = JSON.parse(results.rows[0].product_toteat)

    if(results.rows[0].product_toteat == null){
      return res.status(401).json({
        message: [
          "Este error lo puedes tener por dos factores:",
          " * EL toteat_check de los parametros para actualizar el building o invoice lo tienes como false",
          " * Hoy el array de los productos se encuentra vacio en el campo  product_toteat en la tabla bilding"
        ]
      });
    }

 
    let mailOptions = {
      from,
      to,
      subject,
      text: 'Error en el email.',
      html: contentEmailInvoice( results.rows[0].id, results.rows[0].nombre, results.rows[0].name_shopping, moment().tz(zonaHoraria).format('MMMM DD YYYY, h:mm:ss a'), results.rows[0].type_payment,  results.rows[0].mount_discount, results.rows[0].propina, results.rows[0].subtotal, results.rows[0].total, line, results.rows[0].type_discount, results.rows[0].order_id, results.rows[0].payment_id, results.rows[0].iva, results.rows[0].table_id )
    };

    await transporter.sendMail(mailOptions);
    
    return res.status(200).json({
      message: "Correo enviado exitosamente"
    });
  } catch (e) {
    console.error("Error al enviar el correo:", e);
    return res.status(500).json({
      message: "Error al enviar el correo",
      error: e.message
    });
  }
})


module.exports.handler = serverless(app);
