class Livro {
    titulo: string;
    autor: string;
    ano: number;
    genero: string;
    quantidade: number;
    isbn: number;
  
    constructor(titulo: string, autor: string, ano: number, genero: string, isbn: number, quantidade: number) {
      this.titulo = titulo;
      this.autor = autor;
      this.ano = ano;
      this.genero = genero;
      this.isbn = isbn;
      this.quantidade = quantidade;
    }
  }
  
  class ListaDeLivros {
    private livros: Livro[] = [];
    private ul: HTMLUListElement;
  
    constructor(ulId: string) {
      this.ul = document.getElementById(ulId) as HTMLUListElement;
    }
  
    adicionarLivro(livro: Livro):void {
      this.livros.push(livro);
      this.renderizarLivro(livro);
    }
  
    private renderizarLivro(livro: Livro):void {
      const li = document.createElement("li");
      const divDetalhes = document.createElement("div");

      divDetalhes.textContent = `Título: ${livro.titulo}, Autor: ${livro.autor}, Ano: ${livro.ano}, Gênero: ${livro.genero}, ISBN: ${livro.isbn}, Quantidade: ${livro.quantidade}`;
      
      li.appendChild(divDetalhes);
      this.ul.appendChild(li);
    }
  }
  
  const listaLivros = new ListaDeLivros("lista-livros");
  
  const form = document.getElementById("add-livro") as HTMLFormElement;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  
    const titulo = document.getElementById("titulo-livro") as HTMLInputElement;
    const autor = document.getElementById("autor-livro") as HTMLInputElement;
    const ano = document.getElementById("ano-livro") as HTMLInputElement;
    const genero = document.getElementById("genero-livro") as HTMLInputElement;
    const isbn = document.getElementById("isbn-livro") as HTMLInputElement;
    const quantidade = document.getElementById("quantidade-livro") as HTMLInputElement;
  
    const novoLivro = new Livro(
      titulo.value,
      autor.value,
      parseInt(ano.value),
      genero.value,
      parseInt(isbn.value),
      parseInt(quantidade.value),
    );
  
    listaLivros.adicionarLivro(novoLivro);
  
    titulo.value = "";
    autor.value = "";
    ano.value = "";
    genero.value = "";
    isbn.value = "";
    quantidade.value = "";
  });
  