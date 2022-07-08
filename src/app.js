const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser')
const database = require('./database')
const md5 = require('md5');
const uuid = require('uuid');
const app = require('express')();
app.use(morgan('dev'), bodyParser.urlencoded({ extended: false }), cors());

app.get('/', (req, res) => {
    res.status(200).send();
});

app.get('/users', (req, res) => {
    database.query('select name, email, password from users').then(result => {
        const [rows] = result
        res.status(200).json(rows)
    });
});

app.post('/users', (req, res) => {
    const sql = 'insert into usuarios(nome, uuid, email, login, senha, permissao) VALUES (?, ?, ?, ?, ?, ?);';
    const values = [req.body.nome, uuid.v4(), req.body.email, req.body.login, md5(req.body.senha), req.body.permissao];

    database.query(sql, values).then(result => {
            res.status(200).json(result)
    });
});

app.put('/users/:id', (req, res) => {
    const sql = 'update usuarios set nome = ?, email = ?, login = ?, senha = ?, permissao = ? where uuid = ?;';
    const values = [req.body.nome, req.body.email, req.body.login, md5(req.body.senha), req.body.permissao, req.params.id];

    database.query(sql, values).then(result => {
        if(result.affectedRows > 0){
            res.status(200).json(result)
        } else {
            res.status(200).json(result.error)
        }
    });
});

app.delete('/users/:id', (req, res) => {
    const sql = 'DELETE FROM usuarios WHERE uuid = ?;';

    database.query(sql, req.params.id).then(result => {
        if(result.affectedRows > 0){
            res.status(200).json(result)
        } else {
            res.status(200).json(result.error)
        }
    });
});

///////////////////////////////////// *************************************************** ////////////////////////////////////////////

app.get('/expense', (req, res) => {
    database.query('select id_usuario, descricao, data, valor from despesas').then(result => {
        const [rows] = result
        res.status(200).json(rows)
    });
});

app.post('/expense', (req, res) => {
    const sql = 'insert into despesas(uuid, id_usuario, descricao, data, valor) VALUES (?, ?, ?, ?, ?);';
    const values = [uuid.v4(), req.body.id_usuario, req.body.descricao, req.body.data, req.body.valor];

    database.query(sql, values).then(result => {
            res.status(200).json(result)
    });
});

app.put('/expense/:id', (req, res) => {
    const sql = 'UPDATE despesas SET id_usuario = ?, descricao = ?, data = ?, valor = ? WHERE uuid = ?;';
    const values = [req.body.id_usuario, req.body.descricao, req.body.data, req.body.valor, req.params.id];

    database.query(sql, values).then(result => {
        if(result.affectedRows > 0){
            res.status(200).json(result)
        } else {
            res.status(200).json(result.error)
        }
    });
});

app.delete('/expense/:id', (req, res) => {
    const sql = 'DELETE FROM despesas WHERE uuid = ?;';

    database.query(sql, req.params.id).then(result => {
        if(result.affectedRows > 0){
            res.status(200).json(result)
        } else {
            res.status(200).json(result.error)
        }
    });
});

module.exports = app;
