class Usuario {
  nome: string;
  email: string;
  cpf: number;
  telefone: number;
  endereco: string;
  cep: number;

  constructor(nome: string, email: string, cpf: number, telefone: number, endereco: string, cep: number) {
      this.nome = nome;
      this.email = email;
      this.cpf = cpf;
      this.telefone = telefone;
      this.endereco = endereco;
      this.cep = cep;
  }
}

class ListaDeUsuarios {
  private usuarios: Usuario[] = [];
  private ul: HTMLUListElement;

  constructor(ulId: string) {
      this.ul = document.getElementById(ulId) as HTMLUListElement;
      this.carregarDoLocalStorage();
  }

  adicionarUsuario(usuario: Usuario): void {
    const usuarioExistente = this.usuarios.find(u => u.cpf === usuario.cpf);

    if (usuarioExistente) {
      usuarioExistente.nome = usuario.nome;
      usuarioExistente.email = usuario.email;
      usuarioExistente.telefone = usuario.telefone;
      usuarioExistente.endereco = usuario.endereco;
      usuarioExistente.cep = usuario.cep;
    } else {
      this.usuarios.push(usuario);
    }

    this.atualizarLista();
    this.salvarNoLocalStorage();
  }

  removerUsuario(cpf: number): void {
    const indice = this.usuarios.findIndex(usuario => usuario.cpf === cpf);
    if (indice !== -1) {
        this.usuarios.splice(indice, 1);
        this.atualizarLista();
        this.salvarNoLocalStorage();
    }
  }
  
  private atualizarLista(): void {
    while (this.ul.firstChild) {
        this.ul.removeChild(this.ul.firstChild);
    }
    this.usuarios.forEach(usuario => this.renderizarUsuario(usuario));
  }

  private renderizarUsuario(usuario: Usuario): void {
      const li = document.createElement("li");
      const divDetalhes = document.createElement("div");
      divDetalhes.textContent = `Nome: ${usuario.nome}, Email: ${usuario.email}, CPF: ${usuario.cpf}, Telefone: ${usuario.telefone}, Endereço: ${usuario.endereco}, CEP: ${usuario.cep}`;

      const botaoRemover = document.createElement("button");
      botaoRemover.textContent = "Remover";
      botaoRemover.addEventListener("click", () => {
        this.removerUsuario(usuario.cpf);
    });
      li.appendChild(divDetalhes);
      li.appendChild(botaoRemover);
      this.ul.appendChild(li);
  }

  private salvarNoLocalStorage(): void {
      localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
  }

  private carregarDoLocalStorage(): void {
      const usuariosGuardados = localStorage.getItem('usuarios');
      if (usuariosGuardados) {
          this.usuarios = JSON.parse(usuariosGuardados);
          this.usuarios.forEach(usuario => this.renderizarUsuario(usuario));
      }
  }
}

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
      this.carregarDoLocalStorage();
  }

  adicionarLivro(livro: Livro): void {
      this.livros.push(livro);
      this.renderizarLivro(livro);
      this.salvarNoLocalStorage();
  }

  private removerLivro(livro: Livro, inputRemover: string): void {
    const quantidadeRemover = parseInt(inputRemover, 10);
    if (!isNaN(quantidadeRemover)) {
        if (quantidadeRemover <= livro.quantidade) {
            livro.quantidade -= quantidadeRemover;
            this.atualizarDetalhesLivro(livro);
            if (quantidadeRemover === livro.quantidade || livro.quantidade === 0) {
                const index = this.livros.findIndex(item => item.isbn === livro.isbn);
                if (index !== -1) {
                    this.livros.splice(index, 1);
                    const divDetalhes = this.ul.querySelector(`div[data-isbn="${livro.isbn}"]`);
                    if (divDetalhes) {
                        const liToRemove = divDetalhes.parentElement;
                        if (liToRemove) {
                            this.ul.removeChild(liToRemove);
                            this.salvarNoLocalStorage();
                        }
                    }
                }
            }
            this.salvarNoLocalStorage();
        } else {
            alert("A quantidade a ser removida é maior do que a quantidade atual!");
        }
    } else {
        alert("Por favor, insira uma quantidade válida.");
    }
  }

  private atualizarDetalhesLivro(livro: Livro): void {
    const divDetalhes = this.ul.querySelector(`div[data-isbn="${livro.isbn}"]`);
    if (divDetalhes) {
        divDetalhes.textContent = `Título: ${livro.titulo}, Autor: ${livro.autor}, Ano: ${livro.ano}, Gênero: ${livro.genero}, ISBN: ${livro.isbn}, Quantidade: ${livro.quantidade}`;
    }
  }

  private renderizarLivro(livro: Livro): void {
    const li = document.createElement("li");
    const divDetalhes = document.createElement("div");
    divDetalhes.setAttribute("data-isbn", livro.isbn.toString());
    const inputRemover = document.createElement("input");
    inputRemover.type = "number";
    inputRemover.placeholder = "Quantidade de livros";
    const botaoRemover = document.createElement("button");
    botaoRemover.textContent = "Remover";
    botaoRemover.addEventListener("click", () => {
      this.removerLivro(livro, inputRemover.value);
      inputRemover.value = "";
    });

    divDetalhes.textContent = `Título: ${livro.titulo}, Autor: ${livro.autor}, Ano: ${livro.ano}, Gênero: ${livro.genero}, ISBN: ${livro.isbn}, Quantidade: ${livro.quantidade}`;

    li.appendChild(divDetalhes);
    li.appendChild(inputRemover);
    li.appendChild(botaoRemover);
    this.ul.appendChild(li);
}


  private salvarNoLocalStorage(): void {
      localStorage.setItem('livros', JSON.stringify(this.livros));
  }

  private carregarDoLocalStorage(): void {
      const livrosGuardados = localStorage.getItem('livros');
      if (livrosGuardados) {
          this.livros = JSON.parse(livrosGuardados);
          this.livros.forEach(livro => this.renderizarLivro(livro));
      }
  }
}

const listaUsuarios = new ListaDeUsuarios("lista-usuarios");
const formUsuario = document.getElementById("add-usuario") as HTMLFormElement;

formUsuario.addEventListener("submit", (event) => {
  event.preventDefault();

  const nome = document.getElementById("nome-usuario") as HTMLInputElement;
  const email = document.getElementById("email-usuario") as HTMLInputElement;
  const cpf = document.getElementById("cpf-usuario") as HTMLInputElement;
  const telefone = document.getElementById("telefone-usuario") as HTMLInputElement;
  const endereco = document.getElementById("endereco-usuario") as HTMLInputElement;
  const cep = document.getElementById("cep-usuario") as HTMLInputElement;

  const novoUsuario = new Usuario(
      nome.value,
      email.value,
      parseInt(cpf.value),
      parseInt(telefone.value),
      endereco.value,
      parseInt(cep.value),
  );

  listaUsuarios.adicionarUsuario(novoUsuario);

  nome.value = "";
  email.value = "";
  cpf.value = "";
  telefone.value = "";
  endereco.value = "";
  cep.value = "";
});

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