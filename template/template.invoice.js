module.exports.contentEmailInvoice = (id, kiosko, restaurant, date_invoice, type_payment, mount_discount, mount_propina, mount_sub_total, mount_total, line, type_discount, order_id, payment_id, iva, table_id) => {

    let amountBeforeTax = [];
    let amountAfterTax = [];
    let contentHtml;

   contentHtml = `<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title>Recibo Electrónico Momo Coffee</title>
</head>

<body style="font-family: Arial; sans-serif; font-size: 14px; background: #f1f1f1; padding: 10px">
    <div style="margin: auto; width: 340px; background: #fff; border-radius: 8px; padding: 10px">
        <div style="text-align: center; padding-bottom: 10px;">
            <img width="200" style="margin:auto" src="https://momoadmin.duckdns.org/assets/icons/momo_logo_email.png" alt="momo_coffe">
            <p style="font-size: 18px; font-weight: bold; margin:0px">MOMO Coffee</p>
            <p style="font-size: 16px; font-weight: bold; margin:0px">Café diferente para todos</p>
            <p style="font-size: 16px; font-weight: bold; margin:0px">momocoffee.mx</p>
            <p style="font-size: 16px; font-weight: bold; margin:0px"># ${id}</p>
            <p style="font-size: 16px; font-weight: bold; margin:0px">Ticket Mesa V${table_id}</p>
        </div>
        <p style='text-align:center' >----------------------------------------------------------------------</p>
        <table style='width: 100%; text-align: left; border-collapse: collapse; display:block'>
            <tr>
                <td style='width: 160px'>Pedido: </td>
                <td>${order_id}</td>
            </tr>
            <tr>
                <td style='width: 160px'>Fecha: </td>
                <td>${date_invoice}</td>
            </tr>
            <tr>
                <td style='width: 160px'>Restaurante: </td>
                <td>${restaurant}</td>
            </tr>
            <tr>
                <td style='width: 160px'>Kiosko: </td>
                <td>${kiosko}</td>
            </tr>
        </table>

        <table style='margin: 10px 0px; width: 100%; text-align: left; border-collapse: collapse' >
            <tr>
                <th style='width: 10%;'>Cant</th>
                <th style='width: 43%;'>Producto</th>
                <th style='width: 20%;'>Iva</th>
                <th style='width: 20%;'>Precio Unit</th>
            </tr>`;
            line.map( value => {
                if (value?.unitPriceAfterTax.toFixed(2) > 0.00) {
                    amountBeforeTax.push(value?.amountBeforeTax);
                    amountAfterTax.push(value?.amountAfterTax);
            contentHtml += `
            <tr style='border-bottom: 1px solid #eee;'>
            <td style='width:20px'>${value?.quantity}</td>
            <td style='width:220px'>${value?.productName.replace(/,/g, "")}</td>
            <td style='width:80px'>${Number.isNaN(parseFloat(value?.tax[0]?.value?.toFixed(2))) ? '' : parseFloat(value?.tax[0]?.value?.toFixed(2))}</td>
            <td style='width:80px'>$ ${value?.unitPriceAfterTax.toFixed(2)}</td>
            </tr>
            `
                }else{
                    return null;
                }
            })
       
            contentHtml +=  `</table>
        <table style="width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; display:block">
            <tr>
                <td style="width: 240px">Medio de pago:</td>
                <td>${type_payment == "effecty" ? "Efectivo" : "Tarjeta"}</td>
            </tr>
            <tr>
                <td>Sub-Total:</td>
                <td>$ ${mount_sub_total}</td>
            </tr>
            <tr>
                <td>Cupón:</td>
                <td> ${`$ - ${mount_discount}`}</td>
            </tr>
            <tr>
                <td>Total c/Descuento:</td>
                <td> 
                $ ${(mount_sub_total - mount_discount).toFixed(2)}
                </td>
            </tr>
            <tr>
                <td>Propina:</td>
                <td>$ ${mount_propina}</td>
            </tr>
            <tr>
                <td style="width: 240px;">
                <h2 style="margin:0px; font-size:16px">Total: </h2>
                <p style="margin:0px; fon-size:14px">(${mount_sub_total - mount_discount} + ${mount_propina})</p>
                </td>
                <td style="width: 80px;"><h3>$ ${mount_total}</h3></td>
            </tr>
            <tr>
                <td style="width: 240px;">Base impuesto:</td>
                <td>$ ${amountBeforeTax.reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2)}</td>
            </tr>
            <tr>
                <td style="width: 240px;">Iva 16%</td>
                <td>$ ${Number(iva)}</td>
            </tr> 
            <tr>
                <td style="width: 240px;">Total c/impuesto:</td>
                <td>$ ${amountAfterTax.reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2)}</td>
            </tr>
        </table>
        <div style="text-align: center; padding-top: 20px; font-size: 12px;">
            <div>Recibo Electrónico</div>
        </div>
        <div style="text-align: center">
        <p style="text-align: center; font-size: 16px; margin: 0px">Puedes obtener tu factura aquí:</p>
        <a style="text-align: center; font-size: 16px; margin: 0px" href="https://autofactura-mx.toteat.com">https://autofactura-mx.toteat.com</a>
        <p style="text-align: center; font-size: 16px; margin: 0px">Disponible sólo en el mes del consumo.</p>
        <p style="text-align: center; font-size: 14px;">##################################</p>
        <p style="text-align: center; font-size: 14px;"><b>${order_id}/${payment_id}</b></p>
        <p style="text-align: center; font-size: 14px;">##################################</p>
        </div>
    </div>
</body>

</html>

`

return contentHtml;
}