// armazenamento.js
const CHAVE = 'rh_funcionarios_v1';

function pegarFuncionarios(){
  const raw = localStorage.getItem(CHAVE);
  return raw ? JSON.parse(raw) : [];
}

function gravarFuncionarios(lista){
  localStorage.setItem(CHAVE, JSON.stringify(lista));
}

function gerarId(){
  return 'id_' + Date.now() + '_' + Math.floor(Math.random()*900 + 100);
}
