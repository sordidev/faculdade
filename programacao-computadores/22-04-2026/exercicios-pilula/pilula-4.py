def atualizar_historico(historico, paciente):
    if paciente in historico:
        historico.remove(paciente)
    historico.append(paciente)
    return historico

def main(): 
    historico = ["Ana", "Guilherme", "Denilson"]
    novo = "Guilherme"
    print(historico)
    historico= atualizar_historico(historico, novo)
    print(f"Paciente retornando: {novo}")
    print(f"Historico atualizado: {historico}")

main()