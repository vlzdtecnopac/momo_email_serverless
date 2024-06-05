module.exports.contentEmailInvoice = (kiosko, restaurant, date_invoice, type_payment, mount_cupon, mount_propina, mount_sub_total, mount_total, line) => `<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Factura MoMo Coffe</title>
</head>

<body style="font-family: Arial, sans-serif; font-size: 14px; background: #f1f1f1; padding: 10px">
    <div style="margin: auto; width: 340px; background: #fff; border-radius: 8px; padding: 10px">
        <div style="text-align: center; padding-bottom: 10px;">
            <img width="200" src="http://momocoffe-lb-401505225.us-east-1.elb.amazonaws.com:83/assets/icons/momo_logo_email.png" alt="momo_coffe">
            <p style="font-size: 20px; font-weight: bold;">Factura</p>
        </div>
        <table style="width: 100%; text-align: left; border-collapse: collapse; display:block">
            <tr>
                <td style="width: 120px;">Restaurante:</td>
                <td>${restaurant}</td>
              
            </tr>
            <tr>
                <td style="width: 120px;">Kiosko:</td>
                <td>${kiosko}</td>
            </tr>
            <tr>
                <td style="width: 120px;">Fecha:</td>
                <td>${date_invoice}</td>
            </tr>
        </table>
        <table style="margin: 10px 0px; width: 100%; text-align: left; border-collapse: collapse">
            <tr>
                <th style="width: 20%;">Cant</th>
                <th style="width: 40%;">Producto</th>
                <th style="width: 20%;">Iva</th>
                <th style="width: 20%;">Precio Unit</th>
            </tr>
            ${line.map(value => `
            <tr style="border-bottom: 1px solid #eee;">
            <td style="width:20px">${value?.quantity}</td>
            <td style="width:220px">${value?.productName}</td>
            <td style="width:80px">${value?.tax[0].name} ${parseFloat(value?.tax[0].value.toFixed(2))}</td>
            <td style="width:80px">$ ${value?.amountBeforeTax.toFixed(2)}</td>
        </tr>
            `)}
        </table>
        <table style="width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; display:block">
            <tr>
                <td style="width: 82%;">Medio de pago:</td>
                <td>${type_payment}</td>
            </tr>
            <tr>
                <td>Cupón:</td>
                <td>$ ${mount_cupon}</td>
            </tr>
            <tr>
                <td>Propina:</td>
                <td>$ ${mount_propina}</td>
             </tr>
            <tr>
                <td>Sub-Total:</td>
                <td>$ ${mount_sub_total}</td>
             </tr>
            <tr>
                <td style="width: 82%;"><h2>Total: </h2></td>
                <td><h2>$ ${mount_total}</h2></td>
            </tr>
        </table>
        <div style="text-align: center; padding-top: 20px; font-size: 12px;">
            <div>Factura Electrónica</div>
            <div><a href="https://autofactura-mx.toteat.com/">https://autofactura-mx.toteat.com/</a></div>
        </div>
    </div>
</body>

</html>

`