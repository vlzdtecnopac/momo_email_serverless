module.exports.contentEmailInvoice = (kiosko, restaurant, date_invoice, type_payment, mount_discount, mount_propina, mount_sub_total, mount_total, line, type_discount) => `<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recibo Electrónico Momo Coffee</title>
</head>

<body style="font-family: Arial, sans-serif; font-size: 14px; background: #f1f1f1; padding: 10px">
    <div style="margin: auto; width: 340px; background: #fff; border-radius: 8px; padding: 10px">
        <div style="text-align: center; padding-bottom: 10px;">
            <img width="200" src="http://a9e6711b2eaee4936bce3493c7d60035-1308584783.us-east-1.elb.amazonaws.com/assets/icons/momo_logo_email.png" alt="momo_coffe">
            <p style="font-size: 18px; font-weight: bold; margin:0px">MOMO Coffe</p>
            <p style="font-size: 16px; font-weight: bold; margin:0px">Café diferente para todos.</p>
            <p style="font-size: 16px; font-weight: bold; margin:0px">momocoffe.mx</p>
        </div>
        <table style="width: 100%; text-align: left; border-collapse: collapse; display:block">
            <tr>
                <td style="width: 160px;">Restaurante:</td>
                <td>${restaurant}</td>
              
            </tr>
            <tr>
                <td style="width: 160px;">Kiosko:</td>
                <td>${kiosko}</td>
            </tr>
            <tr>
                <td style="width: 160px;">Fecha:</td>
                <td>${date_invoice}</td>
            </tr>
        </table>
        <table style="margin: 10px 0px; width: 100%; text-align: left; border-collapse: collapse">
            <tr>
                <th style="width: 10%;">Cant</th>
                <th style="width: 43%;">Producto</th>
                <th style="width: 20%;">Iva</th>
                <th style="width: 20%;">Precio Unit</th>
            </tr>
            ${line.map(value => `
            <tr style="border-bottom: 1px solid #eee;">
            <td style="width:20px">${value?.quantity}</td>
            <td style="width:220px">${value?.productName}</td>
            <td style="width:80px">${Number.isNaN(parseFloat(value?.tax[0]?.value?.toFixed(2)))? "" : parseFloat(value?.tax[0]?.value?.toFixed(2)) }</td>
            <td style="width:80px">$ ${value?.unitPriceAfterTax.toFixed(2)}</td>
        </tr>
            `)}
        </table>
        <table style="width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; display:block">
            <tr>
                <td style="width: 240px;">Medio de pago:</td>
                <td>${type_payment == "effecty" ? "Efectivo" : "Tarjeta" }</td>
            </tr>
            <tr>
                <td>Sub-Total:</td>
                <td>$ ${mount_sub_total}</td>
            </tr>
            <tr>
                <td>Cupón:</td>
                <td> ${type_discount == '1' ? `${mount_discount} %` : `$ - ${mount_discount}`}</td>
            </tr>
            <tr>
                <td>Propina:</td>
                <td>$ ${mount_propina}</td>
            </tr>
            <tr>
                <td style="width: 240px;"><h2>Total: </h2></td>
                <td style="width: 80px;"><h3>$ ${mount_total}</h3></td>
            </tr>
        </table>
        <div style="text-align: center; padding-top: 20px; font-size: 12px;">
            <div>Recibo Electrónico</div>
        </div>
    </div>
</body>

</html>

`