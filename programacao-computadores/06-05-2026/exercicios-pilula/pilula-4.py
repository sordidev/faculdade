def calcular_bonus(salario_base: float, avaliacao: str) -> float:
    if salario_base < 0:
        return 0.0
    if avaliacao == "Excelente":
        return salario_base * 0.20
    if avaliacao == "Bom":
        return salario_base * 0.10
    if avaliacao == "Regular":
        return salario_base * 0.02
    return 0.0


def run_tests() -> None:
    assert calcular_bonus(1000.0, "Bom") == 100.0
    assert calcular_bonus(1000.0, "Excelente") == 200.0
    assert calcular_bonus(1000.0, "Regular") == 20.0
    assert calcular_bonus(1000.0, "Mais ou Menos") == 0.0
    assert calcular_bonus(-100.0, "Excelente") == 0.0
    print("OK")


if __name__ == "__main__":
    run_tests()
