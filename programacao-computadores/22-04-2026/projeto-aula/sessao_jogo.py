class SessaoJogo:
    def __init__(self, jogo, tempo_jogado, data_sessao, percentual_simulado=0, status=None):
        self.jogo = jogo
        self.tempo_jogado = tempo_jogado
        self.data_sessao = data_sessao
        self.percentual_simulado = percentual_simulado
        self.status = status

    def exibir(self):
        return f"{self.jogo.titulo} | Tempo: {self.tempo_jogado}h | Data: {self.data_sessao} | Status: {self.status}"
