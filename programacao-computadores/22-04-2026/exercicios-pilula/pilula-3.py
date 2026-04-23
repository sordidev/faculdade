def atender_paciente(fila):
    if len(fila) == 0:
        print ("Fila vazia")
        return fila 
    paciente = fila.pop(0)
    print(f"Atendimento: {paciente}")
    return fila
           
def main():
    fila = ["Gabriel", "Beatriz", "Carlos", "Ana", "Alcides"]
    print(f"Fila inicial {fila}")
    fila = atender_paciente(fila)
    print(f"Final atualizada {fila}")

main()