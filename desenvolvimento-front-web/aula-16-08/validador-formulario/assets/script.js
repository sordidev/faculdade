        // ========================================
        // PROJETO 4 — VALIDADOR DE FORMULÁRIO
        // ========================================

        let form = document.getElementById("formulario");

        // Escutar o evento "submit" do formulário
        form.addEventListener("submit", function(evento) {

            // preventDefault() IMPEDE o comportamento padrão do form
            // (que seria recarregar a página)
            evento.preventDefault();

            // Pegar os valores dos campos
            let nome  = document.getElementById("nome").value.trim();
            let email = document.getElementById("email").value.trim();
            let senha = document.getElementById("senha").value;
            // .trim() remove espaços em branco do início e fim

            // Pegar os elementos de mensagem e input
            let inputNome  = document.getElementById("nome");
            let inputEmail = document.getElementById("email");
            let inputSenha = document.getElementById("senha");
            let msgNome    = document.getElementById("msg-nome");
            let msgEmail   = document.getElementById("msg-email");
            let msgSenha   = document.getElementById("msg-senha");
            let resFinal   = document.getElementById("resultado-final");

            // Flag de controle: começa como válido
            let tudoValido = true;

            // ── VALIDAR NOME ──
            if (nome === "") {
                // Campo vazio: inválido
                inputNome.className = "invalido";
                msgNome.textContent = "O nome não pode estar vazio.";
                msgNome.className = "mensagem erro";
                tudoValido = false;

            } else if (nome.length < 3) {
                // Nome muito curto
                inputNome.className = "invalido";
                msgNome.textContent = "O nome deve ter pelo menos 3 caracteres.";
                msgNome.className = "mensagem erro";
                tudoValido = false;

            } else {
                // Nome válido
                inputNome.className = "valido";
                msgNome.textContent = "Nome válido ✓";
                msgNome.className = "mensagem sucesso";
            }

            // ── VALIDAR E-MAIL ──
            if (email === "") {
                inputEmail.className = "invalido";
                msgEmail.textContent = "O e-mail não pode estar vazio.";
                msgEmail.className = "mensagem erro";
                tudoValido = false;

            } else if (!email.includes("@") || !email.includes(".")) {
                // .includes() verifica se a string contém um caractere
                inputEmail.className = "invalido";
                msgEmail.textContent = "E-mail inválido. Deve conter @ e ponto.";
                msgEmail.className = "mensagem erro";
                tudoValido = false;

            } else {
                inputEmail.className = "valido";
                msgEmail.textContent = "E-mail válido ✓";
                msgEmail.className = "mensagem sucesso";
            }

            // ── VALIDAR SENHA ──
            if (senha.length < 6) {
                inputSenha.className = "invalido";
                msgSenha.textContent = `A senha tem ${senha.length} caracteres. Mínimo: 6.`;
                msgSenha.className = "mensagem erro";
                tudoValido = false;

            } else {
                inputSenha.className = "valido";
                msgSenha.textContent = "Senha válida ✓";
                msgSenha.className = "mensagem sucesso";
            }

            // ── RESULTADO FINAL ──
            if (tudoValido) {
                resFinal.textContent = "Cadastro enviado com sucesso! ✓";
                resFinal.style.color = "#27ae60";
            } else {
                resFinal.textContent = "Corrija os campos destacados.";
                resFinal.style.color = "#e74c3c";
            }
        });