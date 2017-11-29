var soap = require('soap');
CorreiosSOAPClient.prototype.calculaPrazo = function (args, callback) {
    soap.createClient(this._url, function (erro, cliente) {
        console.log('Cliente soap criado');
        cliente.CalcPrazo(args, callback);
    });
}
function CorreiosSOAPClient() {
    this._url = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?WSDL';
}
module.exports = function () {
    return CorreiosSOAPClient;
}