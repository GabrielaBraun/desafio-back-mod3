const express = require('express');
const usuarios = require('./Controladores/usuarios');
const produtos = require('./Controladores/produtos');
const verfificarAutenticacao = require('./autenticacao');

const rotas = express();

rotas.post('/cadastro', usuarios.cadastrarUsuario);
rotas.post('/login', usuarios.loginCadastrado);

rotas.use(verfificarAutenticacao);

rotas.get('/perfil', usuarios.perfilUsuario);
rotas.put('/perfil', usuarios.atualizarPerfil);

rotas.get('/produtos', produtos.listarProdutos);
rotas.get('/produtos/:id', produtos.obterProduto);
rotas.post('/produtos', produtos.cadastrarProduto);
//rotas.put('/produtos/:id', produtos);
//rotas.delete('/produtos/:id', produtos);



module.exports = rotas;