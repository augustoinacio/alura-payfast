module.exports = function (app) {

    const PAGAMENTO_CRIADO = "CRIADO";
    const PAGAMENTO_CONFIRMADO = "CONFIRMADO";
    const PAGAMENTO_CANCELADO = "CANCELADO";

    app.get('/pagamentos', function (req, res) {
        console.log('Recebida requisicao de teste na porta 3000.')
        res.send('OK.');
    });

    app.delete('/pagamentos/pagamento/:id', function (req, res) {
        var id = req.params.id;
        var pagamento = {};
        pagamento.id = id;
        pagamento.status = PAGAMENTO_CANCELADO;
        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDao(connection);
        pagamentoDao.atualiza(pagamento, function (err) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.status(204);
        })
    });
    app.put('/pagamentos/pagamento/:id', function (req, res) {
        var id = req.params.id;
        var pagamento = {};
        pagamento.id = id;
        pagamento.status = PAGAMENTO_CONFIRMADO;
        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDao(connection);
        pagamentoDao.atualiza(pagamento, function (err) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.send(pagamento);
        })
    });

    app.post('/pagamentos/pagamento', function (req, res) {
        req.assert("pagamento.forma_de_pagamento",
            "Forma de pagamento eh obrigatorio").notEmpty();
        req.assert("pagamento.valor",
                "Valor eh obrigatorio e deve ser um decimal")
            .notEmpty().isFloat();
        var erros = req.validationErrors();
        if (erros) {
            console.log('Erros de validacao encontrados');
            res.status(400).send(erros);
            return;
        }
        var pagamento = req.body['pagamento'];
        console.log('processando uma requisicao de um novo pagamento');
        pagamento.status = PAGAMENTO_CRIADO;
        pagamento.data = new Date;
        var connection = app.persistencia.connectionFactory();
        var pagamentoDao = new app.persistencia.PagamentoDao(connection);
        pagamentoDao.salva(pagamento, function (erro, resultado) {
            if (erro) {
                console.log('Erro ao inserir no banco:' + erro);
                res.status(500).send(erro);
            } else {
                pagamento.id = resultado.insertId;
                if (pagamento.forma_de_pagamento == 'cartao') {
                    console.log('\nForma de pagamento : ' + pagamento.forma_de_pagamento);
                    var cartao = req.body["cartao"];
                    console.log('\nCartao: ' + JSON.stringify(cartao));
                    var clienteCartoes = new app.servicos.clienteCartoes();
                    clienteCartoes.autoriza(cartao, function (exception, request, response, retorno) {
                        if (exception) {
                            console.log('Autoriza error: ' + exception);
                            res.status(400).send(exception);
                            return;
                        }
                        res.location('/pagamentos/pagamento/' + pagamento.id);
                        var response = {
                            dados_do_pagamento: pagamento,
                            cartao: cartao,
                            links: [{
                                href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                                rel: "confirmar",
                                method: "PUT"
                            }, {
                                href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                                rel: "cancelar",
                                method: "DELETE"
                            }]
                        }
                        res.status(201).json(response);
                        return;
                    });
                } else {
                    res.location('/pagamentos/pagamento/' + pagamento.id);
                    var response = {
                        dados_do_pagamento: pagamento,
                        links: [{
                            href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                            rel: "confirmar",
                            method: "PUT"
                        }, {
                            href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                            rel: "cancelar",
                            method: "DELETE"
                        }]
                    }
                    res.status(201).json(response);
                }
            }
        });
    });
}