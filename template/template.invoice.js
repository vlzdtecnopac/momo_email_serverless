module.exports.contentEmailInvoice =  (number_invoice) =>`<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Factura</title>
</head>

<body style="font-family: Arial, sans-serif; font-size: 14px; background: #f1f1f1; padding: 10px">
    <div style="margin: auto; width: 340px; background: #fff; border-radius: 8px; padding: 10px">
        <div style="text-align: center; padding-bottom: 10px;">
            <img width="200" src="http://momocoffe-lb-885579517.us-east-1.elb.amazonaws.com:83/assets/icons/momo_logo_email.png" alt="momo_coffe">
            <p style="font-size: 20px; font-weight: bold;">Factura</p>
            <p>Av Paseo de la Reforma #296, Piso 24</p>
            <p>#EnjoyGastronomy</p>
        </div>
        <table style="width: 100%; text-align: left; border-collapse: collapse; display:block">
            <tr>
                <td style="width: 80%;">Pedido:</td>
                <td>4776937021505536</td>
            </tr>
            <tr>
                <td>Fecha:</td>
                <td>19-04-24 2:08 p.m.</td>
            </tr>
        </table>
        <table style="margin: 10px 0px; width: 100%; text-align: left; border-collapse: collapse">
            <tr>
                <th style="width: 20%;">Cant</th>
                <th style="width: 40%;">Producto</th>
                <th style="width: 20%;">Punit</th>
                <th style="width: 20%;">Valor</th>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
                <td>1</td>
                <td>Pan Francés</td>
                <td>$90.00</td>
                <td>$90.00</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
                <td>1</td>
                <td>Hot Cakes</td>
                <td>$90.00</td>
                <td>$90.00</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
                <td>1</td>
                <td>Pan Francés</td>
                <td>$90.00</td>
                <td>$90.00</td>
            </tr>
            <tr style="border-bottom: none;">
                <td>1</td>
                <td>Hot Cakes</td>
                <td>$90.00</td>
                <td>$90.00</td>
            </tr>
            <tr style="font-weight: bold;">
                <td colspan="3"></td>
                <td>Total: $360.00</td>
            </tr>
        </table>
        <table style="width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; display:block">
            <tr>
                <td style="width: 300px;">DETALLE DE RECAUDACIÓN:</td>
                <td>Efectivo</td>
            </tr>
            <tr>
                <td>Base Impuestos:</td>
                <td> $310.34</td>
            </tr>
            <tr>
                <td>I.V.A. 16%:</td>
                <td>$49.66</td>
            </tr>
            <tr>
                <td>Total c/impuestos:</td>
                <td>$360.00</td>
            </tr>
        </table>
        <div style="text-align: center; padding-top: 20px; font-size: 12px;">
            <div>Factura Electrónica</div>
            <div><a href="https://autofactura-mx.toteat.com/">https://autofactura-mx.toteat.com/</a></div>
            <div>Disponible durante el mes en curso</div>
        </div>
        <div style="text-align: center; padding-top: 20px;">
            <div>#####################################</div>
            <div>4776937021505536/1713374299222299</div>
            <div>#####################################</div>
        </div>
    </div>
</body>

</html>

`