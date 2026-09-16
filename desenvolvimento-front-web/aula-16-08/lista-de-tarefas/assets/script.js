        // ========================================
        // PROJETO 5 — LISTA DE TAREFAS (TO-DO)
        // ========================================

        let inputTarefa  = document.getElementById("nova-tarefa");
        let btnAdicionar = document.getElementById("btn-adicionar");
        let lista        = document.getElementById("lista");
        let contadorDiv  = document.getElementById("contador");

        // Função: atualiza o contador de tarefas
        function atualizarContador() {
            let total     = lista.children.length;
            let concluidas = lista.querySelectorAll(".concluida").length;

            if (total === 0) {
                contadorDiv.textContent = "Nenhuma tarefa";
            } else {
                contadorDiv.textContent = `${concluidas} de ${total} tarefa(s) concluída(s)`;
            }
        }

        // Função: adiciona uma nova tarefa à lista
        function adicionarTarefa() {
            let texto = inputTarefa.value.trim();

            // Não adiciona se estiver vazio
            if (texto === "") {
                inputTarefa.style.borderColor = "#e74c3c";
                return;
            }
            inputTarefa.style.borderColor = "#ddd";

            // 1) Criar o elemento <li>
            let li = document.createElement("li");

            // 2) Criar o texto da tarefa dentro de um <span>
            let spanTexto = document.createElement("span");
            spanTexto.textContent = texto;

            // 3) Ao clicar no texto, alterna a classe "concluida" (risca/desrisca)
            spanTexto.addEventListener("click", function() {
                li.classList.toggle("concluida");
                atualizarContador();
            });

            // 4) Criar o botão de remover [X]
            let btnRemover = document.createElement("button");
            btnRemover.textContent = "X";
            btnRemover.className = "btn-remover";

            // 5) Ao clicar no X, remove o <li> da lista
            btnRemover.addEventListener("click", function() {
                lista.removeChild(li);
                atualizarContador();
            });

            // 6) Montar o <li>: texto + botão
            li.appendChild(spanTexto);
            li.appendChild(btnRemover);

            // 7) Adicionar o <li> completo à <ul>
            lista.appendChild(li);

            // 8) Limpar o campo e focar nele para nova entrada
            inputTarefa.value = "";
            inputTarefa.focus();

            atualizarContador();
        }

        // Evento: clique no botão
        btnAdicionar.addEventListener("click", adicionarTarefa);

        // Evento: pressionar Enter no campo (atalho)
        inputTarefa.addEventListener("keydown", function(evento) {
            if (evento.key === "Enter") {
                adicionarTarefa();
            }
        });
    