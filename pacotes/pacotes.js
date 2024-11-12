// Array principal armazenado no navegador
let listaPacotes;
if (localStorage.getItem('listaPacotes') == null) {
    listaPacotes = [];
    localStorage.setItem('listaPacotes', JSON.stringify(listaPacotes));
} else {
    listaPacotes = JSON.parse(localStorage.getItem('listaPacotes'));
}

// Aguarda o carregamento do HTML para ser executado
document.addEventListener('DOMContentLoaded', function () {
    listar(); // Lista os pacotes já cadastrados

    // Salva cadastro e edição
    document.querySelector('#bt-salvar').addEventListener('click', function (event) {
        event.preventDefault(); // Impede o envio do formulário

        // Pega os dados dos campos do formulário
        let id = document.querySelector('#campo-id').value;
        let nomePacote = document.querySelector('#campo-nome').value;
        let acomodacao = document.querySelector('#campo-acomodacao').value;
        let diarias = document.querySelector('#campo-quantidade-diarias').value;
        let valorTotal = document.querySelector('#campo-valor-total').value;

        // Validações de campos
        if (nomePacote === "") {
            alert("Nome do pacote é um campo obrigatório!");
            return;
        } else if (acomodacao === "") {
            alert("Acomodação é um campo obrigatório!");
            return;
        } else if (diarias === "" || isNaN(diarias) || diarias <= 0) {
            alert("Quantidade de diárias deve ser um número válido e maior que zero!");
            return;
        } else if (valorTotal === "00" || isNaN(valorTotal) || valorTotal < 0) {
            alert("Valor total deve ser um número válido!");
            return;
        }

        // Cria objeto
        let pacote = {
            id: (id !== "") ? id : getMaiorIdLista() + 1,
            nomePacote: nomePacote,
            acomodacao: acomodacao,
            diarias: diarias,
            valorTotal: valorTotal
        };

        // Armazena a lista atualizada no navegador
        localStorage.setItem('listaPacotes', JSON.stringify(listaPacotes));
        if (id !== "") {
            let indice = getIndiceListaPorId(id);
            listaPacotes[indice] = pacote;
            alert("Alteração feita com sucesso!"); // Mensagem de alteração
        } else {
            listaPacotes.push(pacote);
            alert("Pacote salvo com sucesso!"); // Mensagem de inserção
        }
    
    
        // Reseta o formulário e recarrega a tabela de listagem
        this.blur();
        resetarForm();
        listar();
        
    });

    // Cancelamento de edição
    document.querySelector('#bt-cancelar').addEventListener('click', function () {
        resetarForm();
    });

    // Funções
    function listar() {
        document.querySelector('table tbody').innerHTML = "";
        document.querySelector('#total-registros').textContent = listaPacotes.length;

        listaPacotes.forEach(function (objeto) {
            // Cria string html com os dados da lista
            let htmlAcoes = `
                <button class="bt-tabela bt-editar" title="Editar"><i class="ph ph-pencil"></i></button>
                <button class="bt-tabela bt-excluir" title="Excluir"><i class="ph ph-trash"></i></button>
            `;
    
            let htmlColunas = `
                <td>${objeto.id}</td>
                <td>${objeto.nomePacote}</td>
                <td>${objeto.acomodacao}</td>
                <td>${objeto.diarias}</td>
                <td>${objeto.valorTotal}</td>
                <td>${htmlAcoes}</td>
            `;
    
            // Adiciona a linha ao corpo da tabela
            let htmlLinha = `<tr id="linha-${objeto.id}">${htmlColunas}</tr>`;
            document.querySelector('table tbody').innerHTML += htmlLinha;
        });

        eventosListagem();
        carregar();
    }

    function eventosListagem() {
        // Ação de editar objeto
        document.querySelectorAll('.bt-editar').forEach(function (botao) {
            botao.addEventListener('click', function (event) {
                event.preventDefault();

                // Pega os dados do objeto que será alterado
                let linha = botao.closest('tr');
                let colunas = linha.getElementsByTagName('td');
                let id = colunas[0].textContent;
    
                // Popula os campos do formulário
                document.querySelector('#campo-id').value = id;
                document.querySelector('#campo-nome').value = colunas[1].textContent;
                document.querySelector('#campo-acomodacao').value = colunas[2].textContent;
                document.querySelector('#campo-quantidade-diarias').value = colunas[3].textContent;
                document.querySelector('#campo-valor-total').value = colunas[4].textContent;

                // Exibe botão de cancelar edição
                document.querySelector('#bt-cancelar').style.display = 'flex';
            });
        });

        // Ação de excluir objeto
        document.querySelectorAll('.bt-excluir').forEach(function (botao) {
            botao.addEventListener('click', function (event) {
                event.preventDefault();
                if (confirm("Deseja realmente excluir?")) {
                    // Remove objeto da lista
                    let linha = botao.closest('tr');
                    let id = linha.id.replace('linha-', '');
                    let indice = getIndiceListaPorId(id);
                    listaPacotes.splice(indice, 1);
    
                    // Armazena a lista atualizada no navegador
                    localStorage.setItem('listaPacotes', JSON.stringify(listaPacotes));
    
                    // Recarrega a listagem
                    listar();
                }
            });
        });
    }

    function getIndiceListaPorId(id) {
        return listaPacotes.findIndex(objeto => objeto.id == id);
    }
    
    function getMaiorIdLista() {
        return listaPacotes.length > 0 ? Math.max(...listaPacotes.map(p => p.id)) : 0;
    }
    
    function resetarForm() {
        document.querySelector('#bt-cancelar').style.display = 'none';
        document.querySelector('#campo-id').value = "";
        document.querySelector('#campo-nome').value = "";
        document.querySelector('#campo-acomodacao').value = "";
        document.querySelector('#campo-quantidade-diarias').value = "";
        document.querySelector('#campo-valor-total').value = "";
    }
});
