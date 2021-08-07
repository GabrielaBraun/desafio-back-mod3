const conexao = require('./conexao');
const jwt = require('jsonwebtoken');

const verfificarAutenticacao = async function (req, res, next) {
    const { authorization } =req.headers;

    if(!authorization){
        return res.status(400).json("O token não foi informado!")
    }

    try {
        const token = authorization.replace('Bearer', '').trim();
        const {id} = jwt.verify(token, "chaveSecreta123");

        const queryPerfil = 'select * from usuarios where id = $1';
        const {rows, rowCount} = await conexao.query(queryPerfil, [id]);

        if(rowCount === 0){
            return res.status(404).json("Usuário não encontrado");
        }

        const {senha, ...usuario} = rows[0];
        
        req.usuario = usuario;

        next();
    } catch (error) {
        return res.status(400).json(error.message)
    }
};

module.exports = verfificarAutenticacao;