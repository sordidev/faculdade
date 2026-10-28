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
    height: 30,
    vx: 0,          // BLOCO 10: velocidade horizontal atual
    vy: 0,          // BLOCO 14: velocidade vertical (frente/trás)
    minY: 200,      // BLOCO 14: até onde a nave pode avançar
    maxY: 365,      // BLOCO 14: até onde a nave pode recuar
    maxSpeed: 6,    // BLOCO 10: velocidade máxima (px por frame)
    accel: 0.6,     // BLOCO 10: aceleração ao segurar a tecla
    friction: 0.88, // BLOCO 10: "atrito" — desacelera ao soltar
    tilt: 0,        // BLOCO 10: inclinação (radianos) ao se mover
    invuln: 0       // BLOCO 11: frames de invencibilidade após levar dano
};

// BLOCO 10: teclas pressionadas no momento
const keys = { left: false, right: false, up: false, down: false, turbo: false };

// BLOCO 10: contador de frames (usado em animações cíclicas)
let frame = 0;

// BLOCO 11: tiros dos inimigos
const enemyBullets = [];

// BLOCO 12: turbo
let turbo = 100;            // carga do turbo (0–100)
let turboActive = false;    // turbo ligado neste frame?
const trail = [];           // rastro da nave durante o turbo

// BLOCO 13: mundo em movimento
let level = 1;              // nível atual (sobe com a pontuação)
let worldSpeed = 1;         // multiplicador de velocidade do cenário
let nebulaY = 100;          // posição vertical da nebulosa
let gameOver = false;       // fim de jogo?

// ============================================================
// BLOCO 3 — Estrelas (Cores e Estilos)
// Conceitos: fillStyle, rgba(), globalAlpha
// ============================================================

// Gerar 60 estrelas em posições aleatórias (agora na tela toda)
const stars = [];
for (let i = 0; i < 60; i++) {
    stars.push({
        x: Math.random() * 600,
        y: Math.random() * 400,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,  // transparência variada
        speed: Math.random() * 1.2 + 0.4   // BLOCO 10: velocidade de queda (parallax)
    });
}

// BLOCO 13: planetas agora são objetos que se movem
const planets = [
    { x: 100, y: 80,  r: 35, speed: 0.35, big: true  },
    { x: 520, y: 160, r: 18, speed: 0.6,  big: false }
];

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
        hit: false,
        vx: randomTargetSpeed(),            // BLOCO 10: movimento lateral
        phase: Math.random() * Math.PI * 2  // BLOCO 10: fase da flutuação
    });
}

// BLOCO 10: velocidade aleatória entre 0.5 e 1.5, para esquerda ou direita
function randomTargetSpeed() {
    var speed = Math.random() + 0.5;
    return Math.random() < 0.5 ? -speed : speed;
}

// BLOCO 13: recoloca um alvo no topo da tela (fora da área visível)
function resetTarget(target) {
    target.x = Math.random() * 500 + 50;
    target.y = -20 - Math.random() * 60;
    target.vx = randomTargetSpeed();
    target.hit = false;
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
    // Bloco 13: o centro usa nebulaY, então a nebulosa desce com o cenário
    const nebula = ctx.createRadialGradient(
        450, nebulaY, 20,    // centro interno, raio interno
        450, nebulaY, 150    // centro externo, raio externo
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
        if (turboActive) {
            // Bloco 12: no turbo as estrelas viram "riscos" (efeito de dobra espacial)
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(star.x, star.y - star.speed * worldSpeed * 6);
            ctx.strokeStyle = "rgba(249, 231, 149, " + star.alpha + ")";
            ctx.lineWidth = star.size;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(249, 231, 149, " + star.alpha + ")";
            ctx.fill();
        }
    });
}

// ---- BLOCO 5: Planetas decorativos ----
// Conceitos: arc(), createRadialGradient(), stroke()
function drawPlanets() {
    planets.forEach(function (p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        if (p.big) {
            // Planeta grande — gradiente dourado → coral
            var planetGrad = ctx.createRadialGradient(p.x - 10, p.y - 10, 5, p.x, p.y, p.r);
            planetGrad.addColorStop(0, "#F9E795");      // núcleo dourado
            planetGrad.addColorStop(1, "#F96167");      // borda coral
            ctx.fillStyle = planetGrad;
            ctx.strokeStyle = "rgba(249, 231, 149, 0.4)";
        } else {
            // Planeta pequeno — azul com contorno dourado
            ctx.fillStyle = "#2F3C7E";
            ctx.strokeStyle = "#F9E795";
        }
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.stroke();
    });
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

// ---- BLOCO 11: Tiros dos inimigos ----
function drawEnemyBullets() {
    enemyBullets.forEach(function (b) {
        // Brilho externo
        ctx.beginPath();
        ctx.arc(b.x, b.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(249, 97, 103, 0.25)";
        ctx.fill();
        // Núcleo
        ctx.beginPath();
        ctx.arc(b.x, b.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.strokeStyle = "#F96167";
        ctx.lineWidth = 1.5;
        ctx.stroke();
    });
}

// ---- BLOCO 12: Rastro do turbo ----
// Desenha "fantasmas" da nave nas posições anteriores, cada vez mais transparentes
function drawTrail() {
    trail.forEach(function (t, i) {
        var alpha = (i + 1) / trail.length * 0.35;
        ctx.beginPath();
        ctx.moveTo(t.x, t.y - 22);
        ctx.lineTo(t.x - 30, t.y + 5);
        ctx.lineTo(t.x - 15, t.y + 15);
        ctx.lineTo(t.x + 15, t.y + 15);
        ctx.lineTo(t.x + 30, t.y + 5);
        ctx.closePath();
        ctx.fillStyle = "rgba(127, 219, 255, " + alpha + ")";
        ctx.fill();
    });
}

// ---- BLOCO 2: Nave (Retângulos) ----
// Conceitos: fillRect(), strokeRect()
// ---- BLOCO 4: Asas (Linhas e Triângulos) ----
// Conceitos: moveTo(), lineTo(), closePath(), fill()
function drawShip() {

    // Bloco 11: piscar enquanto está invencível (pula alguns frames)
    if (ship.invuln > 0 && frame % 8 < 4) return;

    // --- Bloco 10: Inclinação da nave ---
    // save() guarda o estado do contexto; translate + rotate giram
    // tudo que for desenhado depois em torno do centro da nave
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.tilt);
    ctx.translate(-ship.x, -ship.y);

    // --- Bloco 10: Chama do motor (pisca a cada frame) ---
    // Bloco 12: no turbo a chama fica maior e azulada
    var flame = 10 + Math.random() * 8 + Math.abs(ship.vx) * 1.5;
    if (turboActive) flame += 14;
    ctx.beginPath();
    ctx.moveTo(ship.x - 7, ship.y + 15);
    ctx.lineTo(ship.x + 7, ship.y + 15);
    ctx.lineTo(ship.x, ship.y + 15 + flame);
    ctx.closePath();
    ctx.fillStyle = turboActive ? "rgba(127, 219, 255, 0.9)" : "rgba(249, 231, 149, 0.85)";
    ctx.fill();

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

    // Bloco 10: restore() desfaz o translate/rotate
    ctx.restore();
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

    // Bloco 13: nível atual
    ctx.font = "bold 12px Arial";
    ctx.fillStyle = "#F9E795";
    ctx.fillText("NÍVEL " + level, 590, 44);

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

    // --- Bloco 12: Barra do Turbo ---
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.fillRect(10, 50, 150, 8);
    ctx.fillStyle = turboActive ? "#FFFFFF" : "#7FDBFF";
    ctx.fillRect(10, 50, turbo * 1.5, 8);
    ctx.font = "bold 8px Arial";
    ctx.fillStyle = "#0a0a2e";
    ctx.fillText("TURBO", 12, 57);
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
// Bloco 11: cada explosão pode ter sua própria cor (rgb sem o alpha)
function drawExplosions() {
    for (var i = explosions.length - 1; i >= 0; i--) {
        var exp = explosions[i];
        ctx.beginPath();
        ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2);
        var opacity = 1 - (exp.radius / 30);
        ctx.fillStyle = "rgba(" + (exp.color || "249, 97, 103") + ", " + opacity + ")";
        ctx.fill();

        exp.radius += 1.2;
        if (exp.radius >= 30) {
            explosions.splice(i, 1);
        }
    }
}

// ---- BLOCO 13: Tela de Fim de Jogo ----
function drawGameOver() {
    // Camada escura semitransparente por cima de tudo
    ctx.fillStyle = "rgba(10, 10, 46, 0.75)";
    ctx.fillRect(0, 0, 600, 400);

    ctx.textAlign = "center";
    ctx.font = "bold 40px Arial";
    ctx.fillStyle = "#F96167";
    ctx.fillText("FIM DE JOGO", 300, 170);

    ctx.font = "bold 20px Arial";
    ctx.fillStyle = "#F9E795";
    ctx.fillText("Score: " + score + "   |   Nível: " + level, 300, 210);

    ctx.font = "14px Arial";
    ctx.fillStyle = "rgba(240, 240, 240, 0.8)";
    ctx.fillText("Clique ou aperte ENTER para jogar de novo", 300, 250);
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
    // Bloco 13: no fim de jogo, o clique reinicia a partida
    if (gameOver) {
        restartGame();
        return;
    }

    // Sem energia suficiente, não dispara
    if (energy <= 2) return;

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

                // Bloco 13: o alvo volta pelo topo da tela após 1,5 segundo
                setTimeout(function () {
                    resetTarget(target);
                }, 1500);
            }
        }
    });

    // Cada disparo consome energia
    energy = Math.max(0, energy - 2);
});

// ============================================================
// BLOCO 10 — Animação e Movimento
// Conceitos: keydown/keyup, velocidade, aceleração, atrito,
//            save()/translate()/rotate()/restore(), Math.sin()
// BLOCO 14 — Movimento em 2 eixos (frente/trás com ↑ ↓ ou W / S)
// ============================================================

// Teclado: ← → ou A / D = lados | ↑ ↓ ou W / S = frente/trás | Shift ou Espaço = turbo
document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.left = true;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.right = true;
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") keys.up = true;      // Bloco 14
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") keys.down = true;    // Bloco 14
    if (e.key === "Shift" || e.key === " ") keys.turbo = true;   // Bloco 12
    if (e.key === "Enter" && gameOver) restartGame();            // Bloco 13
    // Evita que as setas e o espaço rolem a página
    if (e.key.indexOf("Arrow") === 0 || e.key === " ") e.preventDefault();
});

document.addEventListener("keyup", function (e) {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.left = false;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.right = false;
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") keys.up = false;     // Bloco 14
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") keys.down = false;   // Bloco 14
    if (e.key === "Shift" || e.key === " ") keys.turbo = false;  // Bloco 12
});

// Atualiza a posição da nave a cada frame
function updateShip() {
    // Bloco 12: turbo aumenta aceleração e velocidade máxima
    var accel = turboActive ? ship.accel * 2 : ship.accel;
    var maxSpeed = turboActive ? ship.maxSpeed * 2 : ship.maxSpeed;

    // Acelera na direção da tecla pressionada
    if (keys.left)  ship.vx -= accel;
    if (keys.right) ship.vx += accel;

    // Limita a velocidade máxima
    ship.vx = Math.max(-maxSpeed, Math.min(maxSpeed, ship.vx));

    // Atrito: sem tecla, a nave desliza e vai parando
    ship.vx *= ship.friction;

    // Move a nave
    ship.x += ship.vx;

    // Não deixa sair da tela (30px = metade da largura das asas)
    if (ship.x < 30)  { ship.x = 30;  ship.vx = 0; }
    if (ship.x > 570) { ship.x = 570; ship.vx = 0; }

    // Inclinação proporcional à velocidade (limitada a ~0.35 rad ≈ 20°)
    ship.tilt = Math.max(-0.35, Math.min(0.35, ship.vx * 0.04));

    // --- Bloco 14: Frente e trás (mesma lógica, agora no eixo Y) ---
    // Lembrete: no Canvas, y DIMINUI para cima — então "frente" é vy negativo
    if (keys.up)   ship.vy -= accel;
    if (keys.down) ship.vy += accel;
    ship.vy = Math.max(-maxSpeed, Math.min(maxSpeed, ship.vy));
    ship.vy *= ship.friction;
    ship.y += ship.vy;

    // Limites: a nave fica na metade de baixo da tela
    if (ship.y < ship.minY) { ship.y = ship.minY; ship.vy = 0; }
    if (ship.y > ship.maxY) { ship.y = ship.maxY; ship.vy = 0; }

    // Bloco 11: contagem regressiva da invencibilidade
    if (ship.invuln > 0) ship.invuln--;
}

// Alvos andam para os lados, quicam nas bordas e flutuam
// Bloco 13: e agora também DESCEM em direção à nave
function updateTargets() {
    var descent = (0.15 + level * 0.05) * worldSpeed;

    targets.forEach(function (target) {
        if (target.hit) return;

        target.x += target.vx;

        // Quicar nas bordas: inverte a direção
        if (target.x < target.radius || target.x > 600 - target.radius) {
            target.vx = -target.vx;
        }

        // Descida + flutuação suave com seno (sobe e desce)
        target.y += descent + Math.sin(frame * 0.05 + target.phase) * 0.4;

        // Bloco 14: bateu de frente com o inimigo? Os dois explodem!
        var cx = target.x - ship.x;
        var cy = target.y - ship.y;
        if (ship.invuln === 0 && Math.sqrt(cx * cx + cy * cy) < target.radius + 18) {
            explosions.push({ x: target.x, y: target.y, radius: 5 });
            damageShip(20, true);
            target.hit = true;
            setTimeout(function () { resetTarget(target); }, 1500);
            return;
        }

        // Bloco 13: se o alvo passou pela nave, você perde energia
        if (target.y > 420) {
            damageShip(5, false);
            resetTarget(target);
        }
    });
}

// Estrelas caem, dando sensação de que a nave avança
function updateStars() {
    stars.forEach(function (star) {
        star.y += star.speed * worldSpeed;
        if (star.y > 400) {          // saiu por baixo?
            star.y = 0;              // volta para o topo
            star.x = Math.random() * 600;
        }
    });
}

// ============================================================
// BLOCO 11 — Inimigos Atiram!
// Conceitos: vetor direção, normalização, colisão círculo-círculo
// ============================================================

function updateEnemyBullets() {
    // Chance de cada alvo atirar neste frame (aumenta com o nível)
    var fireChance = 0.003 + level * 0.0015;
    var bulletSpeed = 2.5 + level * 0.3;

    targets.forEach(function (target) {
        // Só atira quem está vivo e visível na tela
        if (target.hit || target.y < 0 || target.y > 300) return;

        if (Math.random() < fireChance) {
            // Vetor do alvo até a nave
            var dx = ship.x - target.x;
            var dy = ship.y - target.y;
            var dist = Math.sqrt(dx * dx + dy * dy);

            // Normalizar (tamanho 1) e multiplicar pela velocidade
            enemyBullets.push({
                x: target.x,
                y: target.y,
                vx: (dx / dist) * bulletSpeed,
                vy: (dy / dist) * bulletSpeed
            });
        }
    });

    // Mover tiros e checar colisão com a nave
    for (var i = enemyBullets.length - 1; i >= 0; i--) {
        var b = enemyBullets[i];
        b.x += b.vx;
        b.y += b.vy;

        // Distância do tiro até o centro da nave
        var ddx = b.x - ship.x;
        var ddy = b.y - ship.y;
        var hit = Math.sqrt(ddx * ddx + ddy * ddy) < 20;

        if (hit && ship.invuln === 0) {
            damageShip(15, true);
            enemyBullets.splice(i, 1);
            continue;
        }

        // Saiu da tela? Remove da lista
        if (b.y > 410 || b.x < -10 || b.x > 610) {
            enemyBullets.splice(i, 1);
        }
    }
}

// Aplica dano à nave
function damageShip(amount, withInvuln) {
    energy = Math.max(0, energy - amount);
    explosions.push({ x: ship.x, y: ship.y, radius: 5, color: "249, 231, 149" });
    if (withInvuln) ship.invuln = 60;   // ~1 segundo piscando

    if (energy <= 0) {
        gameOver = true;
        turboActive = false;   // desliga o efeito de turbo na tela final
        trail.length = 0;
    }
}

// ============================================================
// BLOCO 12 — Turbo
// Conceitos: recurso que gasta e recarrega, rastro (array de posições)
// ============================================================

function updateTurbo() {
    // Turbo só liga se a tecla estiver pressionada E houver carga
    turboActive = keys.turbo && turbo > 0;

    if (turboActive) {
        turbo = Math.max(0, turbo - 1.2);   // gasta
    } else {
        turbo = Math.min(100, turbo + 0.35); // recarrega devagar
    }

    // Guarda as últimas posições da nave para desenhar o rastro
    if (turboActive) {
        trail.push({ x: ship.x, y: ship.y });
        if (trail.length > 8) trail.shift();
    } else if (trail.length > 0) {
        trail.shift();   // rastro some aos poucos
    }
}

// ============================================================
// BLOCO 13 — Mundo em Movimento + Níveis + Fim de Jogo
// Conceitos: rolagem de cenário (scrolling), dificuldade progressiva
// ============================================================

function updateWorld() {
    // Cenário anda mais rápido no turbo
    var targetSpeed = turboActive ? 3 : 1;
    // Bloco 14: indo para frente o cenário acelera um pouco; para trás, desacelera
    if (keys.up)   targetSpeed *= 1.6;
    if (keys.down) targetSpeed *= 0.5;
    worldSpeed += (targetSpeed - worldSpeed) * 0.1;   // transição suave

    // Planetas descem e voltam pelo topo em outra posição
    planets.forEach(function (p) {
        p.y += p.speed * worldSpeed;
        if (p.y - p.r > 400) {
            p.y = -p.r - Math.random() * 200;
            p.x = Math.random() * 500 + 50;
        }
    });

    // Nebulosa desce bem devagar
    nebulaY += 0.15 * worldSpeed;
    if (nebulaY > 550) nebulaY = -150;

    // Nível sobe a cada 100 pontos — e entra mais um inimigo (máx. 9)
    var newLevel = 1 + Math.floor(score / 100);
    if (newLevel > level) {
        level = newLevel;
        if (targets.length < 9) {
            spawnTarget();
            resetTarget(targets[targets.length - 1]);
        }
    }
}

function restartGame() {
    score = 0;
    energy = 100;
    turbo = 100;
    level = 1;
    gameOver = false;
    ship.x = 300;
    ship.y = 350;
    ship.vx = 0;
    ship.vy = 0;
    ship.invuln = 60;
    enemyBullets.length = 0;
    lasers.length = 0;
    explosions.length = 0;
    trail.length = 0;
    targets.length = 0;
    for (let i = 0; i < 5; i++) spawnTarget();
}

// ============================================================
// BLOCO 8+ — Ligando o Canvas ao Painel SVG
// Conceitos: getElementById em elementos SVG, setAttribute()
// ============================================================

var svgEnergyBar = document.getElementById("svgEnergyBar");
var svgShipStatus = document.getElementById("svgShipStatus");
var svgShieldStatus = document.getElementById("svgShieldStatus");

function updateSvgPanel() {
    if (!svgEnergyBar) return;   // HTML sem os ids? então ignora
    svgEnergyBar.setAttribute("width", energy * 1.8);   // 100% = 180px

    var status = "Operacional";
    if (gameOver) status = "Destruída";
    else if (energy < 35) status = "Danificada";
    svgShipStatus.textContent = "Nave: " + status;

    svgShieldStatus.textContent = ship.invuln > 0 ? "Escudo: Atingido!" :
                                  turboActive ? "Escudo: Turbo" : "Escudo: Ativo";
}

// ============================================================
// GAME LOOP — Laço principal de animação
// Conceitos: clearRect(), requestAnimationFrame()
// ============================================================

function gameLoop() {
    // Limpar todo o canvas antes de redesenhar
    ctx.clearRect(0, 0, 600, 400);

    // Blocos 10–13: atualizar posições ANTES de desenhar
    // (no fim de jogo, tudo congela)
    if (!gameOver) {
        frame++;
        updateTurbo();
        updateWorld();
        updateShip();
        updateTargets();
        updateEnemyBullets();
        updateStars();
    }

    // Desenhar cada camada (ordem importa — de trás para frente)
    drawBackground();     // Bloco 7: fundo + nebulosa
    drawStars();          // Bloco 3: estrelas coloridas
    drawPlanets();        // Bloco 5: planetas decorativos
    drawTargets();        // Bloco 5: alvos inimigos
    drawEnemyBullets();   // Bloco 11: tiros inimigos
    drawLasers();         // Bloco 9: efeitos de laser
    drawExplosions();     // Bloco 9: efeitos de explosão
    drawTrail();          // Bloco 12: rastro do turbo
    drawShip();           // Blocos 2+4: nave completa
    drawCrosshair(mouseX, mouseY);  // Bloco 4: mira
    drawHUD();            // Blocos 6+7: texto + barra
    if (gameOver) drawGameOver();   // Bloco 13

    updateSvgPanel();     // Bloco 8+: painel SVG acompanha o jogo

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