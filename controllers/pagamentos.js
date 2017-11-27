module.exports = function (app) {
    app.get('/pagamentos', function(req, res){
        res.send('OK.');
    });
    app.post('/pagamentos/pagamento', function(req,res){
        var pagamento = req.body;
        console.log('Processando uma requisicao de um novo pagamento');
        pagamento.status = 'CRIADO';
        pagamento.data = new Date;

        res.send(pagamento)
    })
}