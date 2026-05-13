def aplicar_cupom(codigo_cupom: str, valor_compra: float) -> float:
    codigo = codigo_cupom.upper()
    if codigo == "CUPOM10":
        return 0.10
    if codigo == "CUPOM25" and valor_compra > 100.0:
        return 0.25
    if codigo == "DESCONTOVIP" and valor_compra > 500.0:
        return 0.35
    return 0.0


def run_tests() -> None:
    assert aplicar_cupom("CUPOM10", 20.0) == 0.10
    assert aplicar_cupom("cupom10", 20.0) == 0.10
    assert aplicar_cupom("CUPOM25", 150.0) == 0.25
    assert aplicar_cupom("CUPOM25", 50.0) == 0.0
    assert aplicar_cupom("DESCONTOVIP", 600.0) == 0.35
    assert aplicar_cupom("DESCONTOVIP", 500.0) == 0.0
    assert aplicar_cupom("CUPOM_FALSO", 200.0) == 0.0
    print("OK")


if __name__ == "__main__":
    run_tests()
