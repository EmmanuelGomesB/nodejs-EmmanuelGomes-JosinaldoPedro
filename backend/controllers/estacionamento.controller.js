const banco = require('../config/banco');

module.exports = server => {
    const urlBase = `/estacionamento`;

    //**Metodo para  adicionar um objeto*/
    server.post(`${urlBase}`, (req, res) => {

        const sql = `INSERT INTO estacionamento(placa, valor, entrada, saida) VALUES(?,?,?,?)`;

        banco.DB.run(sql, [req.body.placa, req.body.valor, req.body.entrada, req.body.saida], (err) => {
            if (err) {
                console.log(err.message);
                res.send("Error ao inserir registro");
                res.status(500);
            }
            console.log("Novo veículo cadastrado");
            res.status(201);
            res.send("Novo veículo cadastrado com sucesso! Placa: " + req.body.placa);
        });
    });

    //**Buscando a lista de todos objetos */
    server.get(`${urlBase}`, (req, res) => {

        const sql = `SELECT id, placa, valor, entrada, saida FROM estacionamento 
                      ORDER BY id`;

        banco.DB.all(sql, [], (err, rows) => {
            if (err) {
                res.send("Error ao listar os veículos");
                res.status(500);
                throw err;
            }
            console.log("Veículos localizados");
            res.status(200);
            res.send(rows);
        });
    });

    //**Buscando por ID um objeto*/
    server.get(`${urlBase}/:id`, (req, res) => {

        const sql = `SELECT placa, valor, entrada, saida FROM estacionamento 
                     WHERE id = ?`;

        banco.DB.each(sql, [req.params.id], (err, row) => {
            if (err) {
                res.send("Veículo não cadastrado no sistema!");
                res.status(500);
                throw err;
            }
            console.log("Veículo encontrado!");
            res.status(200);
            res.send(row);
        });
    });

    //**Metodo para fazer update em um objeto*/
    server.put(`${urlBase}`, (req, res) => {

        const sql = `UPDATE estacionamento
                     SET placa = ?, valor = ?, entrada = ?, saida = ?
                     WHERE id = ?`;

        banco.DB.run(sql, [req.body.placa, req.body.valor, req.body.entrada, req.body.saida, req.body.id], function (err) {
            if (err) {
                res.send("Error ao atualizar o veículo");
                res.status(500);
                console.error(err.message);
            }
            console.log(`Veículo atualizado: ${this.changes}`);
            res.status(202);
            res.send(`Veículo atualizado`);
        });
    });


        //**Metodo para Deletar um objeto pelo id*/
    server.delete(`${urlBase}/:id`, (req, res) => {

        const sql = `DELETE FROM estacionamento
                        WHERE id = ?`;

        banco.DB.run(sql, [req.params.id], function (err) {
            if (err) {
                res.send("Error ao remover o veículo");
                res.status(500);
                console.error(err.message);
            }
            console.log(`Veículo removido`);
            res.send(`Veículo removido`);
        });
    });
}