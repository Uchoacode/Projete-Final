// Dados dos usuários
let users = {
    Administrador: {
        usuarios: {
            rian: "1234", // Nome de usuário e senha do Administrador
            uchoa: "4321", // Outro usuário do Administrador
        },
        Permissions: {
            view_veiculos: true, // Permissão para visualizar veículos
            view_armazem: true, // Permissão para visualizar armazém
            view_produtos_padrao: true, // Permissão para visualizar produtos padrão
            modify_veiculos: true, // Permissão para modificar veículos
            modify_armazem: true, // Permissão para modificar armazém
            modify_produtos_padrao: true, // Permissão para modificar produtos padrão
            modify_permissions: true, // Permissão para modificar permissões
        }
    },
    Gerente: {
        usuarios: {
            renzo: "renzo123", // Nome de usuário e senha do Gerente
            uchoa2: "teste1", // Outro usuário do Gerente
        },
        Permissions: {
            view_veiculos: true, // Permissão para visualizar veículos
            view_armazem: true, // Permissão para visualizar armazém
            view_produtos_padrao: true, // Permissão para visualizar produtos padrão
            modify_veiculos: true, // Permissão para modificar veículos
            modify_armazem: true, // Permissão para modificar armazém
            modify_produtos_padrao: true, // Permissão para modificar produtos padrão
            modify_permissions: false, // Sem permissão para modificar permissões
        }
    },
    Funcionario: {
        usuarios: {
            funcionario1: "1234523", // Nome de usuário e senha do Funcionário
            funcionario2: "9203148102347", // Outro usuário do Funcionário
        },
        Permissions: {
            view_veiculos: false, // Sem permissão para visualizar veículos
            view_armazem: false, // Permissão para visualizar armazém
            view_produtos_padrao: true, // Permissão para visualizar produtos padrão
            modify_veiculos: false, // Sem permissão para modificar veículos
            modify_armazem: false, // Sem permissão para modificar armazém
            modify_produtos_padrao: false, // Sem permissão para modificar produtos padrão
            modify_permissions: false, // Sem permissão para modificar permissões
        },
    },
};

let currentRole = ''; // Variável para armazenar o papel do usuário atual
let itemEditando = null; // Variável para armazenar o item que está sendo editado

// Funções de navegação
function showDashboard() {
    // Exibe o painel principal e oculta a seção do administrador
    document.getElementById('dashboardSection').style.display = 'block';
    document.getElementById('adminSection').style.display = 'none';
}

function showAdmin() {
    // Verifica se o usuário atual tem permissão para acessar a seção de administração
    if (users[currentRole].Permissions.modify_permissions) {
        document.getElementById('dashboardSection').style.display = 'none';
        document.getElementById('adminSection').style.display = 'block';
        updateUserList(); // Atualiza a lista de usuários
        updatePermissionUserList(); // Atualiza a lista de permissões dos usuários
    } else {
        notify('Acesso negado. Você não tem permissão para acessar esta área.', 'danger'); // Notifica acesso negado
    }
}

// Função de login
function login() {
    const username = document.getElementById('username').value; // Obtém o nome de usuário
    const password = document.getElementById('password').value; // Obtém a senha

    // Verifica se o nome de usuário e a senha estão corretos
    for (const role in users) {
        if (users[role].usuarios[username] === password) {
            currentRole = role; // Define o papel do usuário atual
            document.getElementById('loginSection').style.display = 'none'; // Oculta a seção de login
            document.getElementById('mainContent').style.display = 'block'; // Exibe o conteúdo principal
            showDashboard(); // Exibe o painel
            definirPermissoes(role); // Define as permissões do usuário
            notify('Login realizado com sucesso!', 'success'); // Notifica sucesso no login
            return;
        }
    }
    
    notify('Usuário ou senha incorretos!', 'danger'); // Notifica erro de login
}

// Funções do Dashboard
function definirPermissoes(cargo) {
    const permissoes = users[cargo].Permissions; // Obtém as permissões do cargo
    document.getElementById('btnAdicionarVeiculo').disabled = !permissoes.modify_veiculos; // Habilita/desabilita botão de adicionar veículo
    document.getElementById('btnAdicionarEquipamento').disabled = !permissoes.modify_armazem; // Habilita/desabilita botão de adicionar equipamento
    document.getElementById('btnAdicionarDispositivo').disabled = !permissoes.modify_produtos_padrao; // Habilita/desabilita botão de adicionar dispositivo

    if (!permissoes.view_veiculos) {
        document.getElementById('veiculos').style.display = 'none'; // Oculta a seção de veículos se não tiver permissão
    }
    if (!permissoes.view_produtos_padrao) {
        document.getElementById('inventario').style.display = 'none'; // Oculta a seção de veículos se não tiver permissão
    }
    if (!permissoes.view_armazem) {
        document.getElementById('dispositivos').style.display = 'none'; // Oculta a seção de veículos se não tiver permissão
    }
}

function adicionarItem(itemId, categoriaId, quantidadeId, listaId, botaoId) {
    const item = document.getElementById(itemId).value; // Obtém o valor do item
    const categoria = document.getElementById(categoriaId).value; // Obtém o valor da categoria
    const quantidade = document.getElementById(quantidadeId).value; // Obtém o valor da quantidade

    // Verifica se todos os campos estão preenchidos corretamente
    if (item && categoria && quantidade > 0) {
        const lista = document.getElementById(listaId); // Obtém a lista correspondente
        if (itemEditando) {
            // Se um item está sendo editado, atualiza seu texto
            itemEditando.querySelector('.item-text').textContent = `${item} | Categoria: ${categoria} | Quantidade: ${quantidade}`;
            resetarBotao(botaoId); // Reseta o botão para "Adicionar"
            itemEditando = null; // Limpa a referência de edição
        } else {
            // Se não há item sendo editado, cria um novo item na lista
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="item-text">${item} | Categoria: ${categoria} | Quantidade: ${quantidade}</span>
                <button class="edit" onclick="prepararEdicao(this, '${itemId}', '${categoriaId}', '${quantidadeId}', '${botaoId}')">Editar</button>
                <button class="remove" onclick="removerItem(this)">Remover</button>
            `;
            lista.appendChild(li); // Adiciona o novo item à lista
        }
        limparCampos(itemId, categoriaId, quantidadeId, botaoId); // Limpa os campos de entrada
        notify('Item adicionado com sucesso!', 'success'); // Notifica sucesso na adição do item
    }
}

function prepararEdicao(button, itemId, categoriaId, quantidadeId, botaoId) {
    // Prepara a edição de um item existente
    itemEditando = button.parentNode; // Armazena o item que está sendo editado
    const texto = itemEditando.querySelector('.item-text').textContent.split(' | '); // Divide o texto do item
    const item = texto[0]; // Obtém o nome do item
    const categoria = texto[1].split(': ')[1]; // Obtém a categoria
    const quantidade = texto[2].split(': ')[1]; // Obtém a quantidade

    // Preenche os campos de entrada com os valores do item
    document.getElementById(itemId).value = item;
    document.getElementById(categoriaId).value = categoria;
    document.getElementById(quantidadeId).value = quantidade;
    document.getElementById(botaoId).textContent = 'Atualizar'; // Altera o texto do botão para "Atualizar"
}

function removerItem(button) {
    // Remove um item da lista
    button.parentNode.remove(); // Remove o elemento pai do botão
    notify('Item removido com sucesso!', 'success'); // Notifica sucesso na remoção do item
}

function limparCampos(itemId, categoriaId, quantidadeId, botaoId) {
    // Limpa os campos de entrada
    document.getElementById(itemId).value = '';
    document.getElementById(categoriaId).value = '';
    document.getElementById(quantidadeId).value = '';
    document.getElementById(botaoId).textContent = 'Adicionar'; // Reseta o botão para "Adicionar"
}

function resetarBotao(botaoId) {
    // Reseta o texto do botão para "Adicionar"
    document.getElementById(botaoId).textContent = 'Adicionar';
}

// Funções específicas para cada tipo de item
function adicionarEquipamento() {
    // Adiciona um equipamento chamando a função genérica
    adicionarItem('equipamento', 'categoriaEquipamento', 'quantidadeEquipamento', 'listaEquipamentos', 'btnAdicionarEquipamento');
}

function adicionarVeiculo() {
    // Adiciona um veículo chamando a função genérica
    adicionarItem('veiculo', 'categoriaVeiculo', 'quantidadeVeiculo', 'listaVeiculos', 'btnAdicionarVeiculo');
}

function adicionarDispositivo() {
    // Adiciona um dispositivo chamando a função genérica
    adicionarItem('dispositivo', 'categoriaDispositivo', 'quantidadeDispositivo', 'listaDispositivos', 'btnAdicionarDispositivo');
}

// Funções do Admin
function addUser() {
    const newUsername = document.getElementById('newUsername').value; // Obtém o novo nome de usuário
    const newPassword = document.getElementById('newPassword').value; // Obtém a nova senha
    const userRole = document.getElementById('userRole').value; // Obtém o papel do novo usuário

    // Verifica se o nome de usuário e a senha foram preenchidos
    if (newUsername && newPassword) {
        users[userRole].usuarios[newUsername] = newPassword; // Adiciona o novo usuário ao objeto
        updateUserList(); // Atualiza a lista de usuários
        updatePermissionUserList(); // Atualiza a lista de permissões dos usuários
        document.getElementById('newUsername').value = ''; // Limpa o campo de nome de usuário
        document.getElementById('newPassword').value = ''; // Limpa o campo de senha
        notify('Usuário adicionado com sucesso!', 'success'); // Notifica sucesso na adição do usuário
    }
}

function updateUserList() {
    const userList = document.getElementById('userList'); // Obtém a lista de usuários
    userList.innerHTML = ''; // Limpa a lista
    // Itera sobre os usuários e adiciona cada um à lista
    for (const role in users) {
        for (const username in users[role].usuarios) {
            const li = document.createElement('li'); // Cria um novo item de lista
            li.textContent = `${username} (${role})`; // Define o texto do item
            userList.appendChild(li); // Adiciona o item à lista
        }
    }
}

function updatePermissionUserList() {
    const permissionUser = document.getElementById('permissionUser'); // Obtém a lista de usuários para permissões
    permissionUser.innerHTML = '<option value="">Selecionar Usuário</option>'; // Adiciona uma opção padrão
    // Itera sobre os usuários e adiciona cada um à lista de permissões
    for (const role in users) {
        for (const username in users[role].usuarios) {
            const option = document.createElement('option'); // Cria uma nova opção
            option.value = username; // Define o valor da opção
            option.textContent = username; // Define o texto da opção
            permissionUser.appendChild(option); // Adiciona a opção à lista
        }
    }
}

function showPermissions() {
    const selectedUser = document.getElementById('permissionUser').value; // Obtém o usuário selecionado
    let permissions = null; // Inicializa a variável de permissões

    // Itera sobre os usuários para encontrar as permissões do usuário selecionado
    for (const role in users) {
        if (users[role].usuarios[selectedUser]) {
            permissions = users[role].Permissions; // Armazena as permissões do usuário
            break; // Sai do loop se o usuário for encontrado
        }
    }

    if (permissions) {
        const permissionsForm = document.getElementById('permissionsForm'); // Obtém o formulário de permissões
        permissionsForm.innerHTML = ''; // Limpa o formulário
        // Itera sobre as permissões e cria checkboxes para cada uma
        for (const perm in permissions) {
            const div = document.createElement('div'); // Cria um novo div para cada permissão
            div.className = 'mb-2'; // Adiciona uma classe para estilo
            
            const checkbox = document.createElement('input'); // Cria um checkbox
            checkbox.type = 'checkbox'; // Define o tipo como checkbox
            checkbox.id = perm; // Define o id da checkbox
            checkbox.checked = permissions[perm]; // Define se está checado com base nas permissões
            
            const label = document.createElement('label'); // Cria um rótulo para o checkbox
            label.htmlFor = perm; // Define o atributo for do rótulo
            label.textContent = perm.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase()); // Formata o texto da permissão
            
            div.appendChild(checkbox); // Adiciona o checkbox ao div
            div.appendChild(label); // Adiciona o rótulo ao div
            permissionsForm.appendChild(div); // Adiciona o div ao formulário de permissões
        }
    }
}

function updatePermissions() {
    const selectedUser = document.getElementById('permissionUser').value; // Obtém o usuário selecionado
    // Itera sobre os usuários para atualizar as permissões do usuário selecionado
    for (const role in users) {
        if (users[role].usuarios[selectedUser]) {
            for (const perm in users[role].Permissions) {
                users[role].Permissions[perm] = document.getElementById(perm).checked; // Atualiza a permissão com base no checkbox
            }
            notify('Permissões atualizadas com sucesso!', 'success'); // Notifica sucesso na atualização das permissões
            break; // Sai do loop após atualizar as permissões
        }
    }
}

// Função de notificação
function notify(message, type = 'success') {
    const container = document.createElement('div'); // Cria um novo elemento de notificação
    container.className = `alert alert-${type} alert-dismissible fade show`; // Define a classe para estilo
    container.setAttribute('role', 'alert'); 
    container.innerHTML = `
        ${message} 
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;// Insere a mensagem de notificação
    
    document.body.appendChild(container); // Adiciona a notificação ao corpo do documento
    
    setTimeout(() => {
        container.remove(); // Remove a notificação após 3 segundos
    }, 3000);
}

// Event Listeners
document.getElementById('permissionUser').addEventListener('change', showPermissions); // Adiciona um listener para mudanças na lista de usuários de permissões
