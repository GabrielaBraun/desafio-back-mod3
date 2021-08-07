create database market_cubos;

drop table if exists usuarios;

create table usuarios(
  id serial primary key,
  nome text not null,
  nome_loja text not null,
  email text not null unique,
  senha text not null
);

drop table if exists produtos;

create table produtos(
  id serial primary key,
  usuario_id integer references usuarios(id) not null,
  nome text not null,
  estoque smallint not null,
  categoria varchar(20),
  preco integer not null,
  descricao text not null,
  imagem text not null
);






