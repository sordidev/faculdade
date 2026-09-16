        // ========================================
        // PROJETO 3 — CONTADOR INTERATIVO
        // ========================================

        // Variável GLOBAL: acessível por todas as funções
        let contador = 0;

        // Selecionar elementos
        let display  = document.getElementById("numero");
        let btnMenos = document.getElementById("btn-menos");
        let btnReset = document.getElementById("btn-reset");
        let btnMais  = document.getElementById("btn-mais");

        // FUNÇÃO auxiliar: atualiza o display e a cor
        function atualizarDisplay() {
            display.textContent = contador;

            // Muda a cor baseado no valor
            if (contador > 0) {
                display.style.color = "#27ae60";   // Verde para positivo
            } else if (contador < 0) {
                display.style.color = "#e74c3c";   // Vermelho para negativo
            } else {
                display.style.color = "#2c3e50";   // Cinza para zero
            }
        }

        // EVENTO: Botão +
        btnMais.addEventListener("click", function() {
            contador++;           // Incrementa em 1
            atualizarDisplay();   // Atualiza a tela
        });

        // EVENTO: Botão −
        btnMenos.addEventListener("click", function() {
            contador--;           // Decrementa em 1
            atualizarDisplay();
        });

        // EVENTO: Botão Reset
        btnReset.addEventListener("click", function() {
            contador = 0;         // Volta para zero
            atualizarDisplay();
        });
    