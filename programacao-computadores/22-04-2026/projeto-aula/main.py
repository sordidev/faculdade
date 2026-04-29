import os
from steampy import SteamPy
from datetime import datetime

def menu():
    print("\n--- SteamPy ---")
    print("1. Buscar jogo por nome")
    print("2. Filtrar jogos")
    print("3. Ordenar jogos")
    print("4. Adicionar ao backlog")
    print("5. Mostrar backlog")
    print("6. Registrar sessão de jogo")
    print("7. Mostrar jogos recentes")
    print("8. Recomendar jogo")
    print("9. Ranking pessoal")
    print("10. Dashboard")
    print("0. Sair")
    return input("Escolha: ")

if __name__ == "__main__":
    dataset = "dataset.csv"
    backlog_file = "backlog.txt"
    sessoes_file = "sessoes.txt"
    steampy = SteamPy(dataset)
    steampy.carregar_backlog(backlog_file)
    steampy.carregar_sessoes(sessoes_file)

    while True:
        opcao = menu()
        if opcao == "1":
            termo = input("Nome do jogo: ")
            resultados = steampy.buscar_por_nome(termo)
            for j in resultados:
                print(j.exibir())
        elif opcao == "2":
            campo = input("Campo para filtrar (genero, console, publisher, ano): ")
            valor = input("Valor: ")
            resultados = steampy.filtrar(**{campo: valor})
            for j in resultados:
                print(j.exibir())
        elif opcao == "3":
            campo = input("Campo para ordenar (titulo, critic_score, total_sales): ")
            ordem = input("Ordem (asc/desc): ")
            resultados = steampy.ordenar(campo, reverso=(ordem=="desc"))
            for j in resultados:
                print(j.exibir())
        elif opcao == "4":
            termo = input("Nome do jogo para adicionar ao backlog: ")
            resultados = steampy.buscar_por_nome(termo)
            if resultados:
                steampy.adicionar_ao_backlog(resultados[0])
                print("Adicionado ao backlog!")
            else:
                print("Jogo não encontrado.")
        elif opcao == "5":
            steampy.backlog.mostrar()
        elif opcao == "6":
            termo = input("Nome do jogo jogado: ")
            resultados = steampy.buscar_por_nome(termo)
            if resultados:
                tempo = float(input("Tempo jogado (horas): "))
                data = input("Data (YYYY-MM-DD) [hoje]: ") or datetime.now().strftime("%Y-%m-%d")
                percentual = float(input("Percentual simulado (0-100): "))
                status = input("Status (jogado, finalizado, etc): ")
                steampy.registrar_sessao(resultados[0], tempo, data, percentual, status)
                print("Sessão registrada!")
            else:
                print("Jogo não encontrado.")
        elif opcao == "7":
            steampy.recentes.mostrar()
        elif opcao == "8":
            rec = steampy.recomendar()
            if rec:
                print("Recomendação:", rec.exibir())
            else:
                print("Nenhuma recomendação disponível.")
        elif opcao == "9":
            ranking = steampy.ranking_pessoal()
            for id_jogo, tempo in ranking:
                print(f"{steampy.jogos_por_id[id_jogo].titulo}: {tempo}h")
        elif opcao == "10":
            dash = steampy.dashboard()
            print("Total de jogos:", dash['total_jogos'])
            print("Tempo total jogado:", dash['total_tempo'])
            print("Jogo mais jogado:", dash['mais_jogado'])
        elif opcao == "0":
            steampy.salvar_backlog(backlog_file)
            steampy.salvar_sessoes(sessoes_file)
            print("Saindo...")
            break
        else:
            print("Opção inválida.")