// ui.js

// renderiza os cartões do dashboard
function atualizarDashboard(){
  const lista = pegarFuncionarios();

  const total = lista.length;
  const salarios = lista.map(x => Number(x.salario) || 0);
  const soma = salarios.reduce((a,b)=>a+b,0);
  const media = total ? (soma / total) : 0;
  const maior = salarios.length ? Math.max(...salarios) : 0;
  const menor = salarios.length ? Math.min(...salarios) : 0;

  const elTotal = document.getElementById('card-total');
  const elMedia = document.getElementById('card-media');
  const elMaior = document.getElementById('card-maior');
  const elMenor = document.getElementById('card-menor');

  if(elTotal) elTotal.textContent = total;
  if(elMedia) elMedia.textContent = 'R$ ' + media.toFixed(2);
  if(elMaior) elMaior.textContent = 'R$ ' + maior.toFixed(2);
  if(elMenor) elMenor.textContent = 'R$ ' + menor.toFixed(2);
}

// monta a tabela de funcionários com filtros e ordenação
function listarFuncionariosTela(){
  const tbody = document.querySelector('#tabelaFuncionarios tbody');
  if(!tbody) return;

  let lista = pegarFuncionarios();

  // aplicar filtros
  const nomeBusca = (document.getElementById('buscarNome')?.value || '').toLowerCase();
  const cargoFiltro = (document.getElementById('filtrarCargo')?.value || '').toLowerCase();
  const minSal = Number(document.getElementById('minSalario')?.value || 0);
  const maxSal = Number(document.getElementById('maxSalario')?.value || 0);

  lista = lista.filter(f => {
    const okNome = f.nome.toLowerCase().includes(nomeBusca);
    const okCargo = cargoFiltro ? f.cargo.toLowerCase().includes(cargoFiltro) : true;
    const salarioNum = Number(f.salario) || 0;
    const okMin = minSal ? salarioNum >= minSal : true;
    const okMax = maxSal ? salarioNum <= maxSal : true;
    return okNome && okCargo && okMin && okMax;
  });

  // ordenação
  const orden = document.getElementById('ordenarPor')?.value || '';
  if(orden === 'nome'){
    lista.sort((a,b) => a.nome.localeCompare(b.nome));
  } else if(orden === 'salario'){
    lista.sort((a,b) => Number(b.salario) - Number(a.salario));
  }

  tbody.innerHTML = '';
  lista.forEach(f => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${f.nome}</td>
      <td>${f.idade}</td>
      <td>${f.cargo}</td>
      <td>R$ ${Number(f.salario).toFixed(2)}</td>
      <td>
        <button class="acao editar" data-id="${f.id}">Editar</button>
        <button class="acao excluir" data-id="${f.id}">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // eventos de editar/excluir
  tbody.querySelectorAll('.editar').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      editarFuncionarioTela(id);
    });
  });
  tbody.querySelectorAll('.excluir').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if(confirm('Confirma exclusão desse funcionário?')){
        excluirFuncionario(id);
      }
    });
  });
}

// função para preencher o formulário se houver hash de edição
function preencherEdicaoSePreciso(){
  if(!window.location.hash) return;
  if(!window.location.hash.startsWith('#editar-')) return;
  const id = window.location.hash.replace('#editar-','');
  const lista = pegarFuncionarios();
  const reg = lista.find(x => x.id === id);
  if(!reg) return;

  document.getElementById('nome').value = reg.nome;
  document.getElementById('idade').value = reg.idade;
  document.getElementById('cargo').value = reg.cargo;
  document.getElementById('salario').value = reg.salario;
  document.getElementById('idEdicao').value = reg.id;
}

// editar: redireciona para página de cadastro com hash
function editarFuncionarioTela(id){
  window.location.href = 'cadastro.html#editar-' + id;
}

// excluir registro
function excluirFuncionario(id){
  let lista = pegarFuncionarios();
  lista = lista.filter(x => x.id !== id);
  gravarFuncionarios(lista);
  listarFuncionariosTela();
  atualizarDashboard();
}

// limpar filtros
function ligarFiltros(){
  const inputs = ['buscarNome','minSalario','maxSalario','filtrarCargo','ordenarPor'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if(el) el.addEventListener('input', listarFuncionariosTela);
    if(el) el.addEventListener('change', listarFuncionariosTela);
  });

  const btnLimpar = document.getElementById('btnLimpar');
  if(btnLimpar) btnLimpar.addEventListener('click', () => {
    document.getElementById('buscarNome').value = '';
    document.getElementById('minSalario').value = '';
    document.getElementById('maxSalario').value = '';
    document.getElementById('filtrarCargo').value = '';
    document.getElementById('ordenarPor').value = '';
    listarFuncionariosTela();
  });
}
