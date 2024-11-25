const QRCode = require('qrcode');

const url = 'http://192.168.1.80:3000/MenuView';

QRCode.toFile('localhost_qr.png', url, function (err) {
    if (err) {
        console.error('Error al generar el QR:', err);
    } else {
        console.log('Código QR generado como localhost_qr.png');
    }
});