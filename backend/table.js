let isFetching = false;

async function fetchEquipamentos() {
    if (isFetching) return;

    isFetching = true;
    try {
        // Realiza a requisição ao endpoint /api
        const response = await fetch('/api');
        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.status);
        }

        // Converte a resposta em JSON
        const equipamentos = await response.json();

        // Seleciona o elemento do tbody onde a tabela será preenchida
        const tableBody = document.getElementById('equipamentosTable');
        if (!tableBody) {
            console.error('Elemento #equipamentosTable não encontrado!');
            return;
        }

        tableBody.innerHTML = ''; // Limpa o conteúdo anterior

        // Preenche a tabela com os dados recebidos
        equipamentos.forEach((equip, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="d-flex px-2 py-1">
                        <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">${equip.name}</h6>
                        </div>
                    </div>
                </td>
                <td>
                    <p class="text-xs font-weight-bold mb-0">${equip.response}</p>
                </td>
                <td>
                    <p class="text-xs font-weight-bold mb-0">${equip.ecg_response}</p>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao buscar os equipamentos:', error);
    } finally {
        isFetching = false;
    }
}
