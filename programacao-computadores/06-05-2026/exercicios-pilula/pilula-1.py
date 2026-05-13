def acao_semaforo(cor: str) -> str:
	if cor == "vermelho":
		return "Pare"
	if cor == "amarelo":
		return "Atenção"
	if cor == "verde":
		return "Siga"
	return "Cor inválida"


def run_tests() -> None:
	assert acao_semaforo("vermelho") == "Pare"
	assert acao_semaforo("verde") == "Siga"
	assert acao_semaforo("amarelo") == "Atenção"
	assert acao_semaforo("azul") == "Cor inválida"
	print("OK")


if __name__ == "__main__":
	run_tests()
