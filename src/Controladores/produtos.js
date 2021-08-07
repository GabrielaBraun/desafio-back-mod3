const conexao = require('../conexao');

const listarProdutos = async function (req, res) {
    const {usuario} = req;
    const {categoria} = req.query;

    try {
        const produtosPorCategoria = await conexao.query('select * from produtos where categoria = $1 and usuario_id = $2', [categoria, usuario.id])

        if(categoria > 0) {
            return res.status(200).status(produtosPorCategoria.rows);
        } 
        
        const queryProdutos = 'select * from produtos where usuario_id = $1';
        const produtosEncontrados = await conexao.query(queryProdutos, [usuario.id]);

        return res.status(200).json(produtosEncontrados.rows);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const obterProduto = async function (req, res) {
    const {id} = req.params;
    const {usuario} = req;

    try {
        const queryProdutos = 'select * from produtos where id = $1 and usuario_id = $2';
        const produtosEncontrados = await conexao.query(queryProdutos, [id, usuario.id]);

        if(produtosEncontrados.rowCount === 0) {
            return res.status(404).json("Produto não encontrado!");
        }

        return res.status(200).json(produtosEncontrados.rows);

    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const cadastrarProduto = async function (req, res){
    const {nome, estoque, preco, descricao} = req.body;
    const {usuario} = req;

    try {

        if(!nome){
            return res.status(400).json("O nome do produto é obrigatório!");
        }
        if(!estoque){
            return res.status(400).json("A quantidade em estoque do produto é obrigatória!");
        }
        if(!preco){
            return res.status(400).json("O preço do produto é obrigatório!");
        }
        if(!descricao){
            return res.status(400).json("A descrição do produto é obrigatória!");
        }

        const queryCadastroProduto = 'insert into produtos (usuario_id, nome, estoque, preco, descricao) values ($1, $2, $3, $4, $5)';
        const produtoCadastrado = await conexao.query(queryCadastroProduto, [usuario.id, nome, estoque, preco, descricao]);

        return res.status(200).json("Produto cadastrado com sucesso!");

    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports ={
    listarProdutos,
    obterProduto,
    cadastrarProduto
}