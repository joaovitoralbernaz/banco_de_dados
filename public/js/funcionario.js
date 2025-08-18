
////////////////////////////////////////////////////////////FUNÇÃO CADASTRO///////////////////////////////////////////////////////////

async function cadastrarFuncionario(event) {
    event.preventDefault();


    const funcionario = {
        func_nome: document.getElementById("funcionario-nome").value,
        func_cpf: document.getElementById("funcionario-cpf").value,

        func_email: document.getElementById("funcionario-email").value,
        func_telefone: document.getElementById("funcionario-telefone").value,    
        func_logradouro: document.getElementById("funcionario-logradouro").value,
        func_numero: document.getElementById("funcionario-numero").value,
        func_complemento: document.getElementById("funcionario-complemento").value,
        func_bairro: document.getElementById("funcionario-bairro").value,
        func_cidade: document.getElementById("funcionario-cidade").value,
        func_estado: document.getElementById("funcionario-estado").value,
        func_cep: document.getElementById("funcionario-cep").value,
        func_cargo: document.getElementById("funcionario-cargo").value,
        func_salario: document.getElementById("funcionario-salario").value
    };

    try {
        const response = await fetch("/funcionarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(funcionario),
        });

        const result = await response.json();
        if (response.ok) {
            alert("Funcionario cadastrado com sucesso!");
            document.querySelector("form").reset();
            listarFuncionario();
        } else {
            alert(`Erro: ${result.message}`);
        }
    } catch (err) {
        console.error("Erro na solicitação:", err);
        alert("Erro ao cadastrar funcionario.");
    }
}

// Função para listar todos os funcionarios ou buscar funcionarios por CPF
async function listarFuncionarios() {
    const cpf = document.getElementById('cpf').value.trim();  // Pega o valor do CPF digitado no input

    let url = '/funcionarios';  // URL padrão para todos os clientes

    if (cpf) {
        // Se CPF foi digitado, adiciona o parâmetro de consulta
        url += `?cpf=${cpf}`;
    }

    try {
        const response = await fetch(url);
        const funcionarios = await response.json();

        const tabela = document.getElementById('tabela-funcionarios');
        tabela.innerHTML = ''; // Limpa a tabela antes de preencher

        if (funcionarios.length === 0) {
            // Caso não encontre funcionarios, exibe uma mensagem
            tabela.innerHTML = '<tr><td colspan="6">Nenhum funcionario encontrado.</td></tr>';
        } else {
            funcionarios.forEach(funcionario => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${funcionario.id}</td>
                    <td>${funcionario.nome}</td>
                    <td>${funcionario.cpf}</td>
                    <td>${funcionario.telefone}</td>
                    <td>${funcionario.email}</td>
                    <td>${funcionario.cidade}/${funcionario.estado}</td>



                `;
                tabela.appendChild(linha);
            });
        }
    } catch (error) {
        console.error('Erro ao listar funcionarios:', error);
    }
}
//////////////////////////////////////////////////////////FUNÇÃO ATUALIZAR///////////////////////////////////////////////////////////

// Função para atualizar as informações do funcionario
async function atualizarFuncionario() {
        func_nome= document.getElementById("funcionario-nome").value,
        func_cpf= document.getElementById("funcionario-cpf").value,
        func_email= document.getElementById("funcionario-email").value,
        func_telefone= document.getElementById("funconario-telefone").value,
        func_logradouro= document.getElementById("funcionario-logradouro").value,
        func_numero= document.getElementById("funcionario-numero").value,
        func_complemento= document.getElementById("funcionario-complemento").value,
        func_bairro= document.getElementById("funcionario-bairro").value,
        func_cidade= document.getElementById("funcionario-cidade").value,
        func_estado= document.getElementById("funcionario-estado").value,
        func_cep= document.getElementById("funcionario-cep").value,
        func_cargo= document.getElementById("funcionario-cargo").value


    const FuncionarioAtualizado = {
        func_nome,
        func_cpf,
        func_email,
        func_telefone,
        func_logradouro,
        func_numero,
        func_complemento,
        func_bairro,
        func_cidade,
        func_estado,
        func_cep,
        func_cargo


    };

    try {
        const response = await fetch(`/funcionarios/cpf/${cpf}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(funcionarioAtualizado)
        });

        if (response.ok) {
            alert('Funcionario atualizado com sucesso!');
        } else {
            const errorMessage = await response.text();
            alert('Erro ao atualizar funcionario: ' + errorMessage);
        }
    } catch (error) {
        console.error('Erro ao atualizar funcionario:', error);
        alert('Erro ao atualizar fucionario.');
    }
}


async function limpaFuncionario() {
    document.getElementById('funcionario-nome').value = '';
    document.getElementById('funcionario-cpf').value = '';
    document.getElementById('funcionario-email').value = '';
    document.getElementById('funcionario-telefone').value = '';
    document.getElementById('funcionario-logradouro').value = '';
    document.getElementById('funcionario-numero').value = '';
    document.getElementById('funcionario-complemento').value = '';
    document.getElementById('funcionario-bairro').value = '';
    document.getElementById('funcionario-cidade').value = '';
    document.getElementById('funcionario-estado').value = '';
    document.getElementById('funcionario-cep').value = '';
    document.getElementById('funcionario_cargo').value = '';

}