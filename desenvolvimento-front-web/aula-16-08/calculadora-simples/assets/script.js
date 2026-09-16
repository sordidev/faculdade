        // ========================================
        // PROJETO 2 — CALCULADORA SIMPLES
        // ========================================

        // Selecionar todos os elementos
        let num1Input = document.getElementById("num1");
        let num2Input = document.getElementById("num2");
        let operacao  = document.getElementById("operacao");
        let btnCalc   = document.getElementById("btn-calcular");
        let resultado = document.getElementById("resultado");

        btnCalc.addEventListener("click", function() {

            // parseFloat converte o texto do input em número decimal.
            // Sem parseFloat, "5" + "3" = "53" (concatenação de texto!)
            let n1 = parseFloat(num1Input.value);
            let n2 = parseFloat(num2Input.value);

            // isNaN = "is Not a Number" — verifica se o valor é inválido
            if (isNaN(n1) || isNaN(n2)) {
                resultado.textContent = "Por favor, digite números válidos!";
                resultado.style.color = "red";
                return;  // Interrompe a função aqui
            }

            let res;  // Variável que guardará o resultado

            // switch verifica qual operação foi selecionada
            switch (operacao.value) {
                case "+":
                    res = n1 + n2;
                    break;
                case "-":
                    res = n1 - n2;
                    break;
                case "*":
                    res = n1 * n2;
                    break;
                case "/":
                    // Validação extra: não pode dividir por zero!
                    if (n2 === 0) {
                        resultado.textContent = "Erro: divisão por zero!";
                        resultado.style.color = "red";
                        return;
                    }
                    res = n1 / n2;
                    break;
            }

            // Exibe o resultado formatado
            resultado.textContent = `${n1} ${operacao.value} ${n2} = ${res}`;
            resultado.style.color = "#2c3e50";
        });
