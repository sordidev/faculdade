        // ========================================
        // PROJETO 1 — SAUDAÇÃO PERSONALIZADA
        // ========================================

        // Passo 1: Selecionar os elementos da página pelo ID
        let campoNome = document.getElementById("campo-nome");
        let botao     = document.getElementById("btn-saudar");
        let resultado = document.getElementById("resultado");

        // Passo 2: Adicionar um "ouvinte" de evento no botão.
        //          Quando o botão for clicado, a função será executada.
        botao.addEventListener("click", function() {

            // Passo 3: Pegar o valor que o usuário digitou no campo
            let nome = campoNome.value;

            // Passo 4: Verificar se o campo não está vazio
            if (nome === "") {
                resultado.textContent = "Por favor, digite seu nome!";
                resultado.style.color = "red";
            } else if (typeof nome !== "string") {
                resultado.textContent = "Por favor, digite um nome válido!";
                resultado.style.color = "red";
            } else {
                // Passo 5: Exibir a saudação usando template literal
                resultado.textContent = `Olá, ${nome}! Bem-vindo(a) à aula de JavaScript!`;
                resultado.style.color = "#27ae60";
            }
        });
