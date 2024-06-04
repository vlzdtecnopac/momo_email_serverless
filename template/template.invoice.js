module.exports.contentEmailInvoice = (orderId, restaurantId, dateInvoice, typePayment, mountCupon, mountPropina, mountSubtotal, mountTotal, line) => `<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Factura MoMo Coffe</title>
</head>

<body style="font-family: Arial, sans-serif; font-size: 14px; background: #f1f1f1; padding: 10px">
    <div style="margin: auto; width: 340px; background: #fff; border-radius: 8px; padding: 10px">
        <div style="text-align: center; padding-bottom: 10px;">
            <img width="200" src="http://momocoffe-lb-885579517.us-east-1.elb.amazonaws.com:83/assets/icons/momo_logo_email.png" alt="momo_coffe">
            <p style="font-size: 20px; font-weight: bold;">Factura</p>
        </div>
        <table style="width: 100%; text-align: left; border-collapse: collapse; display:block">
            <tr>
                <td style="width: 80%;">Pedido:</td>
                <td>${orderId}</td>
            </tr>
            <tr>
                <td style="width: 80%;">Restaurante:</td>
                <td>${restaurantId}</td>
            </tr>
            <tr>
                <td>Fecha:</td>
                <td>${dateInvoice}</td>
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
            <td>${value.quantity}</td>
            <td>${value.productName}</td>
            <td>${value.tax[0].name} ${parseFloat(value.tax[0].value.toFixed(2))}</td>
            <td>$ ${value.amountAfterTax}</td>
        </tr>
            `)}
        </table>
        <table style="width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; display:block">
            <tr>
                <td style="width: 300px;">Medio de pago:</td>
                <td>${typePayment}</td>
            </tr>
            <tr>
                <td>Cupón:</td>
                <td>$${mountCupon}</td>
            </tr>
            <tr>
                <td>Propina:</td>
                <td>$${mountPropina}</td>
             </tr>
            <tr>
                <td>Sub-Total:</td>
                <td>$${mountSubtotal}</td>
             </tr>
            <tr>
                <td>Total:</td>
                <td>$${mountTotal}</td>
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