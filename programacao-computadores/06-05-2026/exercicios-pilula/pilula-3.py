def converter_nota_para_conceito(nota: float) -> str:
    if nota < 0 or nota > 10:
        return "Nota inválida"
    if nota >= 9.0:
        return "A"
    if nota >= 7.0:
        return "B"
    if nota >= 5.0:
        return "C"
    if nota >= 3.0:
        return "D"
    return "F"


def run_tests() -> None:
    assert converter_nota_para_conceito(9.0) == "A"
    assert converter_nota_para_conceito(10.0) == "A"
    assert converter_nota_para_conceito(8.9) == "B"
    assert converter_nota_para_conceito(7.0) == "B"
    assert converter_nota_para_conceito(6.9) == "C"
    assert converter_nota_para_conceito(5.0) == "C"
    assert converter_nota_para_conceito(4.9) == "D"
    assert converter_nota_para_conceito(3.0) == "D"
    assert converter_nota_para_conceito(2.9) == "F"
    assert converter_nota_para_conceito(-1.0) == "Nota inválida"
    assert converter_nota_para_conceito(11.0) == "Nota inválida"
    print("OK")


if __name__ == "__main__":
    run_tests()
