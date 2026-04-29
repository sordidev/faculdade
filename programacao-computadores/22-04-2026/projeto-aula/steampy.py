import csv
from jogo import Jogo
from fila_backlog import FilaBacklog
from pilha_recentes import PilhaRecentes
from sessao_jogo import SessaoJogo

class SteamPy:
    def __init__(self, dataset_path):
        self.catalogo = []  # lista de jogos
        self.jogos_por_id = {}  # dicionário de jogos por id
        self.backlog = FilaBacklog() # fila de jogos a jogar
        self.recentes = PilhaRecentes() # pilha de jogos recentes
        self.sessoes = []  # lista de SessaoJogo
        self.tempos = {}  # tempo jogado por jogo (id)
        self.carregar_jogos(dataset_path)

    def carregar_jogos(self, nome_arquivo):
        with open(nome_arquivo, encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for linha in reader:
                try:
                    jogo = Jogo(
                        id_jogo=len(self.catalogo)+1,
                        titulo=linha['title'],
                        console=linha['console'],
                        genero=linha['genre'],
                        publisher=linha['publisher'],
                        developer=linha['developer'],
                        critic_score=linha['critic_score'] or 0,
                        total_sales=linha['total_sales'] or 0,
                        na_sales=linha['na_sales'] or 0,
                        jp_sales=linha['jp_sales'] or 0,
                        pal_sales=linha['pal_sales'] or 0,
                        other_sales=linha['other_sales'] or 0,
                        release_date=linha['release_date']
                    )
                    self.catalogo.append(jogo)
                    self.jogos_por_id[jogo.id] = jogo
                except Exception as e:
                    continue

    def buscar_por_nome(self, termo):
        termo = termo.lower()
        return [j for j in self.catalogo if termo in j.titulo.lower()]

    def filtrar(self, **kwargs):
        resultado = self.catalogo
        for chave, valor in kwargs.items():
            resultado = [j for j in resultado if getattr(j, chave, None) == valor]
        return resultado

    def ordenar(self, chave, reverso=False):
        return sorted(self.catalogo, key=lambda j: getattr(j, chave, None), reverse=reverso)

    def adicionar_ao_backlog(self, jogo):
        self.backlog.enqueue(jogo)

    def salvar_backlog(self, arquivo):
        with open(arquivo, 'w', encoding='utf-8') as f:
            for jogo in self.backlog.dados:
                f.write(f"{jogo.id}\n")

    def carregar_backlog(self, arquivo):
        try:
            with open(arquivo, encoding='utf-8') as f:
                for linha in f:
                    id_jogo = int(linha.strip())
                    if id_jogo in self.jogos_por_id:
                        self.backlog.enqueue(self.jogos_por_id[id_jogo])
        except FileNotFoundError:
            pass

    def registrar_sessao(self, jogo, tempo, data, percentual=0, status=None):
        sessao = SessaoJogo(jogo, tempo, data, percentual, status)
        self.sessoes.append(sessao)
        self.tempos[jogo.id] = self.tempos.get(jogo.id, 0) + tempo
        self.recentes.push(jogo)

    def salvar_sessoes(self, arquivo):
        with open(arquivo, 'w', encoding='utf-8') as f:
            for s in self.sessoes:
                f.write(f"{s.jogo.id},{s.tempo_jogado},{s.data_sessao},{s.percentual_simulado},{s.status}\n")

    def carregar_sessoes(self, arquivo):
        try:
            with open(arquivo, encoding='utf-8') as f:
                for linha in f:
                    id_jogo, tempo, data, percentual, status = linha.strip().split(',')
                    if int(id_jogo) in self.jogos_por_id:
                        self.sessoes.append(SessaoJogo(self.jogos_por_id[int(id_jogo)], float(tempo), data, float(percentual), status))
        except FileNotFoundError:
            pass

    def recomendar(self):
        jogados = {s.jogo.id for s in self.sessoes}
        candidatos = [j for j in self.catalogo if j.id not in jogados]
        if not candidatos:
            return None
        return max(candidatos, key=lambda j: j.critic_score)

    def ranking_pessoal(self):
        return sorted(self.tempos.items(), key=lambda x: x[1], reverse=True)

    def dashboard(self):
        total_jogos = len(self.catalogo)
        total_tempo = sum(self.tempos.values())
        mais_jogado = self.jogos_por_id[self.ranking_pessoal()[0][0]].titulo if self.tempos else None
        return {
            'total_jogos': total_jogos,
            'total_tempo': total_tempo,
            'mais_jogado': mais_jogado,
        }
