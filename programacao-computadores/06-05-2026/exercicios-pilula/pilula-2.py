def calcular_frete(peso_kg: float) -> float:
    if peso_kg <= 0:
        return 0.0
    if peso_kg <= 1:
        return 5.0
    if peso_kg <= 5:
        return 10.0
    return 18.0


def run_tests() -> None:
    assert calcular_frete(1.0) == 5.0
    assert calcular_frete(1.01) == 10.0
    assert calcular_frete(5.0) == 10.0
    assert calcular_frete(5.01) == 18.0
    assert calcular_frete(0.0) == 0.0
    assert calcular_frete(-10.0) == 0.0
    print("OK")


if __name__ == "__main__":
    run_tests()
