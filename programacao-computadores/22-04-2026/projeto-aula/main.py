from jogo import Jogo
from fila import FilaBacklog
from pilha import PilhaRecentes

if __name__ == "__main__":
    fila = FilaBacklog()
    pilha = PilhaRecentes()

    j1 = Jogo(1, "GTA V", "PS4", "Ação", "Rockstar", "Rockstar", 90, 100, 50, 10, 30, 10, "2013")

    fila.enqueue(j1)
    fila.mostrar()

    pilha.push(j1)
    pilha.mostrar()