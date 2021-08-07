const conexao = require('../conexao');

const listarProdutos = async function(req, res){
    const {usuario} = req;

    try {
        const queryProdutos = 'select * from produtos where id = $1';
        const produtosEncontrados = await conexao.query(queryProdutos, [usuario.id]);

        return res.status(200).json(produtosEncontrados.rows);
    } catch (error) {
        return res.status(400).json(error.message)
    }
};

module.exports ={
    listarProdutos
}