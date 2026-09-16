        // ========================================
        // PROJETO 6 — QUIZ COM PONTUAÇÃO
        // ========================================

        // ARRAY DE OBJETOS: cada objeto é uma pergunta
        // com a pergunta, as opções e o índice da resposta correta
        const perguntas = [
            {
                pergunta: "Qual comando exibe uma mensagem na aba do console?",
                opcoes: ["alert()", "console.log()", "document.write()", "print()"],
                correta: 1   // Índice 1 = "console.log()"
            },
            {
                pergunta: "Qual a forma recomendada de declarar variáveis em JS moderno?",
                opcoes: ["var", "let e const", "dim", "int e string"],
                correta: 1
            },
            {
                pergunta: "O que o operador === verifica?",
                opcoes: [
                    "Apenas o valor",
                    "Valor E tipo",
                    "Apenas o tipo",
                    "Se é nulo"
                ],
                correta: 1
            },
            {
                pergunta: "Qual método seleciona um elemento pelo ID?",
                opcoes: [
                    "querySelector()",
                    "getElement()",
                    "getElementById()",
                    "findById()"
                ],
                correta: 2
            },
            {
                pergunta: "O que faz o evento.preventDefault()?",
                opcoes: [
                    "Para o JavaScript",
                    "Impede o comportamento padrão do navegador",
                    "Fecha a página",
                    "Remove um evento"
                ],
                correta: 1
            }
        ];

        // VARIÁVEIS DE CONTROLE
        let perguntaAtual = 0;   // Índice da pergunta atual
        let pontuacao     = 0;   // Acertos acumulados
        let respondeu     = false; // Impede clicar duas vezes

        // ELEMENTOS DO DOM
        let elPergunta  = document.getElementById("pergunta");
        let elOpcoes    = document.getElementById("opcoes");
        let elBarra     = document.getElementById("barra");
        let elInfo      = document.getElementById("info");
        let btnProxima  = document.getElementById("btn-proxima");
        let areaQuiz    = document.getElementById("area-quiz");
        let resFinal    = document.getElementById("resultado-final");
        let notaFinal   = document.getElementById("nota-final");
        let feedFinal   = document.getElementById("feedback-final");
        let btnRefazer  = document.getElementById("btn-refazer");

        // FUNÇÃO: carrega uma pergunta na tela
        function carregarPergunta() {
            respondeu = false;
            btnProxima.style.display = "none";

            let p = perguntas[perguntaAtual]; // Pega o objeto da pergunta atual

            // Atualiza a barra e o info
            elBarra.style.width = ((perguntaAtual) / perguntas.length * 100) + "%";
            elInfo.textContent = `Pergunta ${perguntaAtual + 1} de ${perguntas.length}`;

            // Exibe a pergunta
            elPergunta.textContent = p.pergunta;

            // Limpa as opções anteriores
            elOpcoes.innerHTML = "";

            // Cria um botão para cada opção
            p.opcoes.forEach(function(textoOpcao, indice) {
                let botao = document.createElement("button");
                botao.className = "opcao";
                botao.textContent = textoOpcao;

                // Evento de clique em cada opção
                botao.addEventListener("click", function() {
                    if (respondeu) return;  // Impede clicar de novo
                    respondeu = true;

                    // Verifica se acertou
                    if (indice === p.correta) {
                        botao.classList.add("correta");
                        pontuacao++;
                    } else {
                        botao.classList.add("errada");
                        // Destaca a resposta correta
                        elOpcoes.children[p.correta].classList.add("correta");
                    }

                    // Mostra o botão "Próxima"
                    btnProxima.style.display = "inline-block";
                });

                elOpcoes.appendChild(botao);
            });
        }

        // EVENTO: botão "Próxima Pergunta"
        btnProxima.addEventListener("click", function() {
            perguntaAtual++;

            if (perguntaAtual < perguntas.length) {
                carregarPergunta();
            } else {
                mostrarResultado();
            }
        });

        // FUNÇÃO: mostra o resultado final
        function mostrarResultado() {
            areaQuiz.style.display = "none";
            resFinal.style.display = "block";
            elBarra.style.width = "100%";
            elInfo.textContent = "Resultado Final";

            let percentual = Math.round((pontuacao / perguntas.length) * 100);
            notaFinal.textContent = `${pontuacao}/${perguntas.length}`;

            // Define a cor e o feedback baseado na nota
            if (percentual >= 80) {
                notaFinal.className = "nota boa";
                feedFinal.textContent = "Excelente! Você domina os fundamentos!";
            } else if (percentual >= 50) {
                notaFinal.className = "nota media";
                feedFinal.textContent = "Bom trabalho! Revise os tópicos que errou.";
            } else {
                notaFinal.className = "nota baixa";
                feedFinal.textContent = "Precisa estudar mais. Releia o material da aula!";
            }
        }

        // EVENTO: botão "Refazer"
        btnRefazer.addEventListener("click", function() {
            perguntaAtual = 0;
            pontuacao = 0;
            areaQuiz.style.display = "block";
            resFinal.style.display = "none";
            carregarPergunta();
        });

        // INÍCIO: carrega a primeira pergunta
        carregarPergunta();
    