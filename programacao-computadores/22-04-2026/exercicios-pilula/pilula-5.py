def processar_consulta(registros):
    tempos = {}
    cont   = {}
    status = {}

    for reg in registros:
        p = reg["paciente"]
        if p not in tempos:
            tempos[p] = 0 
            cont[p] = 0 
        tempos[p] += reg["tempo"]
        cont[p] += 1

    for paciente in tempos:
        t = tempos[paciente]
        if t < 2:
            status[paciente] = "leve"
        elif t < 5:
            status[paciente] = "moderado"
        else:
            status[paciente] = "critico"
    
    for paciente in tempos:
        print(f"Paciente: {paciente}, tempo total {tempos[paciente]}, Qtd de consultas {cont[paciente]}, {status[paciente]}")



def main():
    registros = [
        {"paciente": "Ana", "tempo": 1},
        {"paciente": "Ana", "tempo": 2},
        {"paciente": "Carlos", "tempo": 4}
    ]

    processar_consulta(registros)
main()