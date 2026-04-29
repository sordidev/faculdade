class Jogo:
    def __init__(self, id_jogo, titulo, console, genero, publisher, developer, critic_score,
                 total_sales, na_sales, jp_sales, pal_sales, other_sales, release_date):

        self.id = id_jogo
        self.titulo = titulo
        self.console = console
        self.genero = genero
        self.publisher = publisher
        self.developer = developer
        self.critic_score = float(critic_score)
        self.total_sales = float(total_sales)
        self.na_sales = float(na_sales)
        self.jp_sales = float(jp_sales)
        self.pal_sales = float(pal_sales)
        self.other_sales = float(other_sales)
        self.release_date = release_date

    def exibir(self):
        return f"{self.titulo} ({self.console}) - {self.genero}"