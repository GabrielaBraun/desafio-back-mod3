const conexao = require('../conexao');

const listarProdutos = async function (req, res) {
    const {usuario} = req;
    const {categoria, preco} = req.query;

    try {
        if(categoria) {
            const {rows: produtosPorCategoria} = await conexao.query('select * from produtos where categoria = $1 and usuario_id = $2', [categoria, usuario.id]);
            return res.status(200).json(produtosPorCategoria);
        } 

        if(preco) {
            const {rows: produtosPorPreco} = await conexao.query('select * from produtos where preco = $1 and usuario_id = $2', [preco, usuario.id]);
            return res.status(200).json(produtosPorPreco);
        } 
        
        if(!categoria && !preco) {
            const queryProdutos = 'select * from produtos where usuario_id = $1';
            const produtosEncontrados = await conexao.query(queryProdutos, [usuario.id]);

            return res.status(200).json(produtosEncontrados.rows);
        }
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
    const {nome, categoria, estoque, preco, descricao, imagem} = req.body;
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

        const queryCadastroProduto = 'insert into produtos (usuario_id, nome, categoria, estoque, preco, descricao, imagem) values ($1, $2, $3, $4, $5,$6, $7)';
        const produtoCadastrado = await conexao.query(queryCadastroProduto, [usuario.id, nome, categoria, estoque, preco, descricao, imagem]);

        return res.status(200).json("Produto cadastrado com sucesso!");

    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const atualizarProduto = async function (req, res) {
    const {id} = req.params;
    const {usuario} = req;
    const {nome, estoque, categoria, preco, descricao, imagem} = req.body;

    try {
        const queryProdutos = 'select * from produtos where id = $1 and usuario_id = $2';
        const produtosEncontrados = await conexao.query(queryProdutos, [id, usuario.id]);

        if(produtosEncontrados.rowCount === 0) {
            return res.status(404).json("Produto não encontrado!");
        }
        
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

        const queryAtualizarProduto = 'update produtos set nome =$1, categoria =$2, estoque =$3, preco =$4, descricao =$5, imagem =$6 where id = $7 and usuario_id = $8 ';
        const produtoAtualizado = await conexao.query(queryAtualizarProduto, [nome, categoria, estoque, preco, descricao, imagem, id, usuario.id]);
        
        if(produtoAtualizado.rowCount === 0) {
            return res.status(404).json("Não foi possível atualizar o produto!");
        }

        return res.status(200).json("Produto atualizado com sucesso!");

    } catch (error) {
        return res.status(400).json(error.message);
    }

};

const deletarProduto = async function (req, res){
    const {id} = req.params;
    const {usuario} = req;

    try {
        const queryProdutos = 'select * from produtos where id = $1 and usuario_id = $2';
        const produtosEncontrados = await conexao.query(queryProdutos, [id, usuario.id]);

        if(produtosEncontrados.rowCount === 0) {
            return res.status(404).json("Produto não encontrado!");
        }

        const queryDeletar = 'delete from produtos where id = $1 and usuario_id = $2';
        const produtoDeletado = await conexao.query(queryDeletar, [id, usuario.id]);

        if(produtoDeletado.rowCount === 0){
            return res.status(400).json("Não foi possível excluir o produto!");
        }

        return res.status(200).json("Produto deletado com sucesso!");
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports ={
    listarProdutos,
    obterProduto,
    cadastrarProduto,
    atualizarProduto,
    deletarProduto
}