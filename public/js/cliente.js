// Função para cadastrar cliente
async function cadastrarCliente(event) {
    event.preventDefault();
    
    let nome_cliente = document.getElementById("cliente-nome").value;
    
    // Monta o endereço completo baseado nos campos do HTML
    let endereco_completo = '';
    const logradouro = document.getElementById("cliente-logradouro").value;
    const numero = document.getElementById("cliente-numero").value;
    const complemento = document.getElementById("cliente-complemento").value;
    const bairro = document.getElementById("cliente-bairro").value;
    const cidade = document.getElementById("cliente-cidade").value;
    const estado = document.getElementById("cliente-estado").value;
    const cep = document.getElementById("cliente-cep").value;
    
    // Constrói endereço completo apenas com campos preenchidos
    if (logradouro) endereco_completo += logradouro;
    if (numero) endereco_completo += ', ' + numero;
    if (complemento) endereco_completo += ', ' + complemento;
    if (bairro) endereco_completo += ', ' + bairro;
    if (cidade) endereco_completo += ', ' + cidade;
    if (estado) endereco_completo += '/' + estado;
    if (cep) endereco_completo += ' - CEP: ' + cep;

    const cliente = {
        nome: nome_cliente,
        telefone: document.getElementById("cliente-telefone").value,
        email: document.getElementById("cliente-email").value,
        cpf: document.getElementById("cliente-cpf").value,
        endereco: endereco_completo
    };

    try {
        const response = await fetch('/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        });

        const result = await response.json();
        if (response.ok) {
            alert("Cliente cadastrado com sucesso!");
            document.querySelector('form').reset();
            listarClientes(); // Atualiza a lista após cadastrar
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (err) {
        console.error("Erro na solicitação:", err);
        alert("Erro ao cadastrar cliente.");
    }
}

// Função para listar todos os clientes ou buscar clientes por CPF
async function listarClientes() {
    const cpf = document.getElementById('buscar-cliente').value.trim();  // Pega o valor do input de busca

    let url = '/clientes';  // URL padrão para todos os clientes

    if (cpf) {
        // Se CPF foi digitado, adiciona o parâmetro de consulta
        url += `?cpf=${cpf}`;
    }

    try {
        const response = await fetch(url);
        const clientes = await response.json();

        const tabela = document.querySelector('tbody');
        tabela.innerHTML = ''; // Limpa a tabela antes de preencher

        if (clientes.length === 0) {
            // Caso não encontre clientes, exibe uma mensagem
            tabela.innerHTML = '<tr><td colspan="7">Nenhum cliente encontrado.</td></tr>';
        } else {
            clientes.forEach(cliente => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td data-label="ID">${cliente.id}</td>
                    <td data-label="Nome">${cliente.nome}</td>
                    <td data-label="CPF">${cliente.cpf}</td>
                    <td data-label="Telefone">${cliente.telefone || 'N/A'}</td>
                    <td data-label="Email">${cliente.email || 'N/A'}</td>
                    <td data-label="Cidade/UF">${cliente.endereco || 'N/A'}</td>
                    <td data-label="Ações" class="action-btns">
                        <a href="#" class="edit-btn" onclick="editarCliente('${cliente.cpf}')">Editar</a>
                        <a href="#" class="delete-btn" onclick="excluirCliente('${cliente.cpf}')">Excluir</a>
                    </td>
                `;
                tabela.appendChild(linha);
            });
        }
    } catch (error) {
        console.error('Erro ao listar clientes:', error);
    }
}

// Função para atualizar as informações do cliente
async function atualizarCliente(cpf) {
    const nome = document.getElementById('cliente-nome').value;
    const email = document.getElementById('cliente-email').value;
    const telefone = document.getElementById('cliente-telefone').value;
    
    // Monta o endereço completo baseado nos campos do HTML
    let endereco_completo = '';
    const logradouro = document.getElementById("cliente-logradouro").value;
    const numero = document.getElementById("cliente-numero").value;
    const complemento = document.getElementById("cliente-complemento").value;
    const bairro = document.getElementById("cliente-bairro").value;
    const cidade = document.getElementById("cliente-cidade").value;
    const estado = document.getElementById("cliente-estado").value;
    const cep = document.getElementById("cliente-cep").value;
    
    // Constrói endereço completo apenas com campos preenchidos
    if (logradouro) endereco_completo += logradouro;
    if (numero) endereco_completo += ', ' + numero;
    if (complemento) endereco_completo += ', ' + complemento;
    if (bairro) endereco_completo += ', ' + bairro;
    if (cidade) endereco_completo += ', ' + cidade;
    if (estado) endereco_completo += '/' + estado;
    if (cep) endereco_completo += ' - CEP: ' + cep;

    const clienteAtualizado = {
        nome,
        email,
        telefone,
        endereco: endereco_completo
    };

    try {
        const response = await fetch(`/clientes/cpf/${cpf}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clienteAtualizado)
        });

        if (response.ok) {
            alert('Cliente atualizado com sucesso!');
            limpaCliente();
            listarClientes();
        } else {
            const errorMessage = await response.text();
            alert('Erro ao atualizar cliente: ' + errorMessage);
        }
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        alert('Erro ao atualizar cliente.');
    }
}

// Função para excluir cliente
async function excluirCliente(cpf) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        try {
            const response = await fetch(`/clientes/cpf/${cpf}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Cliente excluído com sucesso!');
                listarClientes();
            } else {
                const errorMessage = await response.text();
                alert('Erro ao excluir cliente: ' + errorMessage);
            }
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
            alert('Erro ao excluir cliente.');
        }
    }
}

// Função para editar cliente (preenche o formulário)
async function editarCliente(cpf) {
    try {
        const response = await fetch(`/clientes?cpf=${cpf}`);
        const clientes = await response.json();
        
        if (clientes.length > 0) {
            const cliente = clientes[0];
            
            document.getElementById('cliente-nome').value = cliente.nome || '';
            document.getElementById('cliente-cpf').value = cliente.cpf || '';
            document.getElementById('cliente-telefone').value = cliente.telefone || '';
            document.getElementById('cliente-email').value = cliente.email || '';
            
            // Para o endereço, como está concatenado, vamos apenas mostrar no primeiro campo
            // ou você pode criar uma lógica mais complexa para separar os campos
            const enderecoCompleto = cliente.endereco || '';
            document.getElementById('cliente-logradouro').value = enderecoCompleto;
            
            // Limpa os outros campos de endereço já que temos tudo concatenado
            document.getElementById('cliente-cep').value = '';
            document.getElementById('cliente-numero').value = '';
            document.getElementById('cliente-complemento').value = '';
            document.getElementById('cliente-bairro').value = '';
            document.getElementById('cliente-cidade').value = '';
            document.getElementById('cliente-estado').value = '';
            
            // Muda o botão para "Atualizar"
            const form = document.querySelector('form');
            const submitBtn = form.querySelector('.btn-primary');
            submitBtn.textContent = 'Atualizar';
            submitBtn.onclick = function(e) {
                e.preventDefault();
                atualizarCliente(cpf);
            };
        }
    } catch (error) {
        console.error('Erro ao buscar cliente:', error);
        alert('Erro ao carregar dados do cliente.');
    }
}

// Função para limpar formulário
async function limpaCliente() {
    document.getElementById('cliente-nome').value = '';
    document.getElementById('cliente-cpf').value = '';
    document.getElementById('cliente-email').value = '';
    document.getElementById('cliente-telefone').value = '';
    document.getElementById('cliente-cep').value = '';
    document.getElementById('cliente-logradouro').value = '';
    document.getElementById('cliente-numero').value = '';
    document.getElementById('cliente-complemento').value = '';
    document.getElementById('cliente-bairro').value = '';
    document.getElementById('cliente-cidade').value = '';
    document.getElementById('cliente-estado').value = '';
    
    // Volta o botão para "Salvar"
    const form = document.querySelector('form');
    const submitBtn = form.querySelector('.btn-primary');
    submitBtn.textContent = 'Salvar';
    submitBtn.onclick = null;
}

// Event listeners quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Formulário de cadastro
    const form = document.querySelector('form[action="#"][method="post"]');
    if (form) {
        form.addEventListener('submit', cadastrarCliente);
    }
    
    // Formulário de busca
    const searchForm = document.querySelector('form[action="#"][method="get"]');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            listarClientes();
        });
    }
    
    // Botão limpar
    const clearBtn = document.querySelector('.btn-secondary');
    if (clearBtn) {
        clearBtn.addEventListener('click', function(e) {
            e.preventDefault();
            limpaCliente();
        });
    }
    
    // Menu hamburguer
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');
    
    if (hamburgerMenu && navLinks && navOverlay) {
        hamburgerMenu.addEventListener('click', function() {
            hamburgerMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
            navOverlay.classList.toggle('active');
        });
        
        navOverlay.addEventListener('click', function() {
            hamburgerMenu.classList.remove('active');
            navLinks.classList.remove('active');
            navOverlay.classList.remove('active');
        });
    }
    
    // Carrega a lista de clientes ao inicializar
    listarClientes();
});