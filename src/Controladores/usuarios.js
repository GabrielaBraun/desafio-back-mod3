const conexao = require('../conexao');
const securePassword = require('secure-password');
const jwt = require('jsonwebtoken');
const verfificarAutenticacao = require('../autenticacao');

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

const loginCadastrado = async function (req, res){
    const { email, senha } = req.body;

    if(!email || !senha){
        return res.status(400).json("Email e senha são obrigatórios!")
    }
    
    try {
        const queryEmail = 'select * from usuarios where email = $1';
        const usuarios = await conexao.query(queryEmail, [email]);

        if(usuarios.rowCount === 0) {
        return res.status(400).json("Email ou senha inválidos!");
        }

        const usuario = usuarios.rows[0];

        const result = await pwd.verify(Buffer.from(senha), Buffer.from(usuario.senha, "hex"));
        
            switch (result) {
              case securePassword.INVALID_UNRECOGNIZED_HASH:
              case securePassword.INVALID:
                return res.status(400).json("Email ou senha incorretos!");
              case securePassword.VALID:
                break;
              case securePassword.VALID_NEEDS_REHASH:      
                try {
                    const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");
                    const query = 'update usuarios set senha = $1 where email = $2';
                    const usuario = await conexao.query(query, [hash, email]);

                } catch (error) {
                }
                break;
            }

            const token = jwt.sign({
                id: usuario.id
            }, "chaveSecreta123");

            return res.status(200).json({
                id: usuario.id,
                nome: usuario.nome,
                email:usuario.email,
                nome_loja:usuario.nome_loja,
                token: token}); 

    } catch (error) {
        return res.status(400).json(error.message)
    }
};

const perfilUsuario = async function (req, res){
    const {usuario} = req;
   
    try {
        return res.status(200).json(usuario);
    
    } catch (error) {
        return res.status(400).json(error.message)
    }
};

const atualizarPerfil = async function (req, res) {
    const {id, nome, email, senha, nome_loja} = req.body;
    const {usuario} = req;

    try {
        
        if(id) {
            return res.status(400).json("O id não pode ser modificado!")
        }
    
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
    
        const queryEmail = 'select * from usuarios where email = $1';
        const emailUsuarios = await conexao.query(queryEmail, [email]);

        if(emailUsuarios.rowCount > 0) {
            return res.status(400).json("Este email já foi cadastrado!");
        }

        const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");
        const queryAtualizar = 'update usuarios set nome = $1, email = $2, senha = $3, nome_loja = $4 where id = $5';
        const perfilAtualizado = await conexao.query(queryAtualizar, [nome, email, hash, nome_loja, usuario.id])

        if(perfilAtualizado.rowCount === 0){
            return res.status(404).json('Perfil não encontrado');
        }

        return res.status(200).json("Perfil atualizado com sucesso!")

    } catch (error) {
        return res.status(400).json(error.message)
    }
}

module.exports = {
    cadastrarUsuario,
    loginCadastrado,
    perfilUsuario,
    atualizarPerfil
};