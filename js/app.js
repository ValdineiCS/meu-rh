// app.js
document.addEventListener('DOMContentLoaded', () => {
  const pagina = document.body.id;

  if(pagina === 'pagina-dashboard'){
    atualizarDashboard();
  }

  if(pagina === 'pagina-funcionarios'){
    listarFuncionariosTela();
    ligarFiltros();
  }

  if(pagina === 'pagina-cadastro'){
    // submeter formulario
    const form = document.getElementById('formFuncionario');
    const idEdicaoInput = document.getElementById('idEdicao');

    preencherEdicaoSePreciso();

    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const nome = document.getElementById('nome').value.trim();
      const idade = Number(document.getElementById('idade').value);
      const cargo = document.getElementById('cargo').value.trim();
      const salario = Number(document.getElementById('salario').value);

      if(!nome || !idade || !cargo || !salario){
        alert('Preencha todos os campos corretamente.');
        return;
      }

      let lista = pegarFuncionarios();
      const idEdicao = document.getElementById('idEdicao').value;

      if(idEdicao){ // atualizar
        const idx = lista.findIndex(x => x.id === idEdicao);
        if(idx >= 0){
          lista[idx].nome = nome;
          lista[idx].idade = idade;
          lista[idx].cargo = cargo;
          lista[idx].salario = salario;
          gravarFuncionarios(lista);
          alert('Funcionário atualizado.');
          window.location.href = 'funcionarios.html';
          return;
        }
      }

      // criar novo
      const novo = {
        id: gerarId(),
        nome,
        idade,
        cargo,
        salario
      };
      lista.push(novo);
      gravarFuncionarios(lista);
      alert('Funcionário cadastrado.');
      form.reset();
    });


    // cancelar volta para lista
    const btnCancelar = document.getElementById('btnCancelar');
    if(btnCancelar) btnCancelar.addEventListener('click', () => {
      window.location.href = 'funcionarios.html';
    });
  }

  // atualizar dashboard se LocalStorage mudou (outra aba)
  window.addEventListener('storage', () => {
    if(document.body.id === 'pagina-dashboard') atualizarDashboard();
    if(document.body.id === 'pagina-funcionarios') listarFuncionariosTela();
  });
});
