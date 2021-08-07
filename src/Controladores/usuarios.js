const conexao = require('../conexao');
const securePassword = require('secure-password')

const pwd = securePassword();

const cadastrarUsuario = async function (req, res) {
    const { nome, email, senha, nome_loja } = req.body; 

    if(!nome){
        return res.status(400).json("O campo nome é obrigatório!")
    }

    if(!email){
        return res.status(400).json("O campo email é obrigatório!")
    }
    if(!senha){
        return res.status(400).json("O campo senha é obrigatório!")
    }

    if(!nome_loja){
        return res.status(400).json("O campo nome da loja é obrigatório!")
    }

    try {
        const queryEmail = 'select * from usuarios where email = $1';
        const emailUsuarios = await conexao.query(queryEmail, [email]);

        if(emailUsuarios.rowCount > 0) {
        return res.status(400).json("Este email já foi cadastrado!");
        }
        
        const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");

        const queryCadastro = 'insert into usuarios (nome, email, senha, nome_loja) values ($1, $2, $3, $4)';
        const cadastroUsuarios = await conexao.query(queryCadastro, [nome, email, hash, nome_loja]);

        if (cadastroUsuarios.rowCount === 0) {
            return res.status(400).json('Não foi possivel cadastrar o usuário');
        }

        return res.status(200).json('Usuário cadastrado com sucesso.')

    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    cadastrarUsuario
};