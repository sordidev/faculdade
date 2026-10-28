// ============================================
// DEFENSOR ESPACIAL — Jogo Canvas 2D
// Aula de Laboratório: Canvas 2D + SVG
// ============================================
// Cada seção corresponde a um Bloco da aula.
// Construa o jogo adicionando bloco a bloco!
// ============================================

// ============================================================
// BLOCO 1 — Setup do Canvas
// Conceitos: <canvas>, getContext("2d"), sistema de coordenadas
// ============================================================

// 1.1 Obter referência ao elemento <canvas> do HTML
const canvas = document.getElementById("gameCanvas");

// 1.2 Obter o contexto de desenho 2D
const ctx = canvas.getContext("2d");

// 1.3 Sistema de coordenadas:
//     (0, 0) = canto SUPERIOR ESQUERDO
//     x cresce para a DIREITA (0 → 600)
//     y cresce para BAIXO    (0 → 400)

// ============================================================
// VARIÁVEIS DO JOGO
// ============================================================

let score = 0;          // Pontuação do jogador
let energy = 100;       // Energia da nave (0–100)
const targets = [];     // Lista de alvos/inimigos
const lasers = [];      // Efeitos visuais dos disparos
const explosions = [];  // Efeitos de explosão

// Posição da nave — centro inferior do canvas
const ship = {
    x: 300,    // centro horizontal (600 / 2)
    y: 350,    // próximo da base
    width: 40,
    height: 30
};

// ============================================================
// BLOCO 3 — Estrelas (Cores e Estilos)
// Conceitos: fillStyle, rgba(), globalAlpha
// ============================================================

// Gerar 50 estrelas em posições aleatórias
const stars = [];
for (let i = 0; i < 50; i++) {
    stars.push({
        x: Math.random() * 600,
        y: Math.random() * 300,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.8 + 0.2   // transparência variada
    });
}

// ============================================================
// BLOCO 5 — Alvos/Inimigos (Círculos)
// Conceitos: arc(), beginPath(), Math.PI
// ============================================================

// Função para criar um novo alvo em posição aleatória
function spawnTarget() {
    targets.push({
        x: Math.random() * 500 + 50,       // margem de 50px
        y: Math.random() * 150 + 40,       // zona superior
        radius: 15,
        hit: false
    });
}

// Criar 5 alvos iniciais
for (let i = 0; i < 5; i++) {
    spawnTarget();
}

// ============================================================
// FUNÇÕES DE DESENHO — cada função = 1 camada visual
// ============================================================

// ---- BLOCO 7: Fundo com Gradiente ----
// Conceitos: createRadialGradient(), addColorStop()
function drawBackground() {
    // Céu negro do espaço
    ctx.fillStyle = "#0a0a2e";
    ctx.fillRect(0, 0, 600, 400);

    // Nebulosa — gradiente radial (efeito de nuvem cósmica)
    const nebula = ctx.createRadialGradient(
        450, 100, 20,    // centro interno, raio interno
        450, 100, 150    // centro externo, raio externo
    );
    nebula.addColorStop(0, "rgba(249, 97, 103, 0.25)");   // coral
    nebula.addColorStop(0.5, "rgba(47, 60, 126, 0.12)");  // navy
    nebula.addColorStop(1, "rgba(10, 10, 46, 0)");        // transparente

    ctx.fillStyle = nebula;
    ctx.fillRect(0, 0, 600, 400);
}

// ---- BLOCO 3: Estrelas ----
// Conceitos: fillStyle com rgba, beginPath, arc, fill
function drawStars() {
    stars.forEach(function (star) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(249, 231, 149, " + star.alpha + ")";
        ctx.fill();
    });
}

// ---- BLOCO 5: Planetas decorativos ----
// Conceitos: arc(), createRadialGradient(), stroke()
function drawPlanets() {
    // Planeta grande (canto superior esquerdo)
    ctx.beginPath();
    ctx.arc(100, 80, 35, 0, Math.PI * 2);
    var planetGrad = ctx.createRadialGradient(90, 70, 5, 100, 80, 35);
    planetGrad.addColorStop(0, "#F9E795");      // núcleo dourado
    planetGrad.addColorStop(1, "#F96167");      // borda coral
    ctx.fillStyle = planetGrad;
    ctx.fill();
    ctx.strokeStyle = "rgba(249, 231, 149, 0.4)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Planeta pequeno (lado direito)
    ctx.beginPath();
    ctx.arc(520, 160, 18, 0, Math.PI * 2);
    ctx.fillStyle = "#2F3C7E";
    ctx.fill();
    ctx.strokeStyle = "#F9E795";
    ctx.lineWidth = 1;
    ctx.stroke();
}

// ---- BLOCO 5: Alvos (inimigos) ----
// Conceitos: arc(), moveTo(), lineTo(), stroke()
function drawTargets() {
    targets.forEach(function (target) {
        if (!target.hit) {
            // Corpo do alvo — círculo vermelho semitransparente
            ctx.beginPath();
            ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(249, 97, 103, 0.6)";
            ctx.fill();
            ctx.strokeStyle = "#F96167";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Marcação "X" interna
            ctx.beginPath();
            ctx.moveTo(target.x - 7, target.y - 7);
            ctx.lineTo(target.x + 7, target.y + 7);
            ctx.moveTo(target.x + 7, target.y - 7);
            ctx.lineTo(target.x - 7, target.y + 7);
            ctx.strokeStyle = "#F9E795";
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    });
}

// ---- BLOCO 2: Nave (Retângulos) ----
// Conceitos: fillRect(), strokeRect()
// ---- BLOCO 4: Asas (Linhas e Triângulos) ----
// Conceitos: moveTo(), lineTo(), closePath(), fill()
function drawShip() {

    // --- Bloco 2: Plataforma de lançamento (strokeRect) ---
    ctx.strokeStyle = "#F9E795";
    ctx.lineWidth = 2;
    ctx.strokeRect(ship.x - 30, ship.y + 15, 60, 8);

    // --- Bloco 2: Corpo da nave (fillRect) ---
    ctx.fillStyle = "#2F3C7E";
    ctx.fillRect(ship.x - 15, ship.y - 10, 30, 25);

    // --- Bloco 3: Cockpit colorido (fillRect com cor diferente) ---
    ctx.fillStyle = "#F96167";
    ctx.fillRect(ship.x - 8, ship.y - 5, 16, 10);

    // --- Bloco 4: Asa esquerda (triângulo com linhas) ---
    ctx.beginPath();
    ctx.moveTo(ship.x - 15, ship.y + 15);   // base (canto inferior)
    ctx.lineTo(ship.x - 30, ship.y + 5);    // ponta externa
    ctx.lineTo(ship.x - 15, ship.y - 5);    // topo
    ctx.closePath();                          // fecha o caminho
    ctx.fillStyle = "#F96167";
    ctx.fill();

    // --- Bloco 4: Asa direita (triângulo espelhado) ---
    ctx.beginPath();
    ctx.moveTo(ship.x + 15, ship.y + 15);
    ctx.lineTo(ship.x + 30, ship.y + 5);
    ctx.lineTo(ship.x + 15, ship.y - 5);
    ctx.closePath();
    ctx.fillStyle = "#F96167";
    ctx.fill();

    // --- Bloco 4: Ponta da nave (triângulo superior) ---
    ctx.beginPath();
    ctx.moveTo(ship.x, ship.y - 22);         // ponta
    ctx.lineTo(ship.x - 10, ship.y - 10);    // base esquerda
    ctx.lineTo(ship.x + 10, ship.y - 10);    // base direita
    ctx.closePath();
    ctx.fillStyle = "#F9E795";
    ctx.fill();

    // --- Bloco 5: Escudo da nave (arco parcial) ---
    ctx.beginPath();
    ctx.arc(ship.x, ship.y, 36, Math.PI * 1.15, Math.PI * 1.85);
    ctx.strokeStyle = "rgba(249, 231, 149, 0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();
}

// ---- BLOCO 4: Mira (Crosshair) ----
// Conceitos: arc(), moveTo(), lineTo()
function drawCrosshair(mx, my) {
    if (mx === null || my === null) return;

    // Círculo da mira
    ctx.beginPath();
    ctx.arc(mx, my, 14, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(249, 231, 149, 0.5)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Linhas da cruz
    ctx.beginPath();
    ctx.moveTo(mx - 18, my);
    ctx.lineTo(mx + 18, my);
    ctx.moveTo(mx, my - 18);
    ctx.lineTo(mx, my + 18);
    ctx.strokeStyle = "rgba(249, 231, 149, 0.3)";
    ctx.lineWidth = 1;
    ctx.stroke();
}

// ---- BLOCO 6: HUD — Heads-Up Display (Texto) ----
// Conceitos: font, fillText(), textAlign
function drawHUD() {
    // Título do jogo (canto superior esquerdo)
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = "#F9E795";
    ctx.textAlign = "left";
    ctx.fillText("DEFENSOR ESPACIAL", 10, 25);

    // Pontuação (canto superior direito)
    ctx.font = "bold 22px Arial";
    ctx.fillStyle = "#F96167";
    ctx.textAlign = "right";
    ctx.fillText("SCORE: " + score, 590, 25);

    // Nome do jogador (canto inferior esquerdo)
    ctx.font = "12px Arial";
    ctx.fillStyle = "rgba(240, 240, 240, 0.5)";
    ctx.textAlign = "left";
    ctx.fillText("Piloto: Aluno", 10, 392);

    // --- Bloco 7: Barra de Energia (Gradiente Linear) ---
    // Conceitos: createLinearGradient(), addColorStop()

    // Fundo da barra
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.fillRect(10, 34, 150, 12);

    // Barra preenchida com gradiente linear
    var barWidth = energy * 1.5;   // 100% energia = 150px
    var energyGrad = ctx.createLinearGradient(10, 0, 160, 0);
    energyGrad.addColorStop(0, "#F96167");    // vermelho (esquerda)
    energyGrad.addColorStop(0.6, "#F9E795");  // dourado (meio)
    energyGrad.addColorStop(1, "#2F3C7E");    // azul (direita)
    ctx.fillStyle = energyGrad;
    ctx.fillRect(10, 34, barWidth, 12);

    // Label sobre a barra
    ctx.font = "bold 9px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "left";
    ctx.fillText("ENERGIA", 12, 43);
}

// ---- BLOCO 9: Efeitos visuais dos lasers ----
function drawLasers() {
    for (var i = lasers.length - 1; i >= 0; i--) {
        var laser = lasers[i];
        // Linha do laser: da nave até o ponto de clique
        ctx.beginPath();
        ctx.moveTo(ship.x, ship.y - 22);    // ponta da nave
        ctx.lineTo(laser.x, laser.y);        // destino
        ctx.strokeStyle = "rgba(249, 231, 149, " + laser.alpha + ")";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Fade out gradual
        laser.alpha -= 0.025;
        if (laser.alpha <= 0) {
            lasers.splice(i, 1);
        }
    }
}

// ---- Efeitos de explosão ----
function drawExplosions() {
    for (var i = explosions.length - 1; i >= 0; i--) {
        var exp = explosions[i];
        ctx.beginPath();
        ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2);
        var opacity = 1 - (exp.radius / 30);
        ctx.fillStyle = "rgba(249, 97, 103, " + opacity + ")";
        ctx.fill();

        exp.radius += 1.2;
        if (exp.radius >= 30) {
            explosions.splice(i, 1);
        }
    }
}

// ============================================================
// BLOCO 9 — Interatividade
// Conceitos: addEventListener(), getBoundingClientRect()
// ============================================================

// Variáveis de posição do mouse
var mouseX = null;
var mouseY = null;

// Função auxiliar: converter coordenadas do mouse para coordenadas do canvas
// (necessário por causa da responsividade — o canvas pode estar redimensionado)
function getCanvasCoords(event) {
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;
    var scaleY = canvas.height / rect.height;
    return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
    };
}

// Rastrear posição do mouse (para a mira)
canvas.addEventListener("mousemove", function (e) {
    var coords = getCanvasCoords(e);
    mouseX = coords.x;
    mouseY = coords.y;
});

// Clique = Disparo do laser
canvas.addEventListener("click", function (e) {
    var coords = getCanvasCoords(e);
    var clickX = coords.x;
    var clickY = coords.y;

    // Criar efeito visual do laser
    lasers.push({ x: clickX, y: clickY, alpha: 1.0 });

    // Verificar colisão com cada alvo
    targets.forEach(function (target) {
        if (!target.hit) {
            // Calcular distância entre clique e centro do alvo
            var dx = clickX - target.x;
            var dy = clickY - target.y;
            var distancia = Math.sqrt(dx * dx + dy * dy);

            // Se a distância for menor que o raio, acertou!
            if (distancia <= target.radius) {
                target.hit = true;
                score += 10;
                energy = Math.min(100, energy + 5);

                // Efeito de explosão
                explosions.push({
                    x: target.x,
                    y: target.y,
                    radius: 5
                });

                // Reposicionar o alvo após 2 segundos
                setTimeout(function () {
                    target.x = Math.random() * 500 + 50;
                    target.y = Math.random() * 150 + 40;
                    target.hit = false;
                }, 2000);
            }
        }
    });

    // Cada disparo consome energia
    energy = Math.max(0, energy - 2);
});

// ============================================================
// GAME LOOP — Laço principal de animação
// Conceitos: clearRect(), requestAnimationFrame()
// ============================================================

function gameLoop() {
    // Limpar todo o canvas antes de redesenhar
    ctx.clearRect(0, 0, 600, 400);

    // Desenhar cada camada (ordem importa — de trás para frente)
    drawBackground();     // Bloco 7: fundo + nebulosa
    drawStars();          // Bloco 3: estrelas coloridas
    drawPlanets();        // Bloco 5: planetas decorativos
    drawTargets();        // Bloco 5: alvos inimigos
    drawLasers();         // Bloco 9: efeitos de laser
    drawExplosions();     // Bloco 9: efeitos de explosão
    drawShip();           // Blocos 2+4: nave completa
    drawCrosshair(mouseX, mouseY);  // Bloco 4: mira
    drawHUD();            // Blocos 6+7: texto + barra

    // Animação: cintilação das estrelas
    stars.forEach(function (star) {
        star.alpha += (Math.random() - 0.5) * 0.08;
        if (star.alpha < 0.1) star.alpha = 0.1;
        if (star.alpha > 1.0) star.alpha = 1.0;
    });

    // Solicitar próximo frame de animação (~60fps)
    requestAnimationFrame(gameLoop);
}

// Iniciar o jogo!
gameLoop();