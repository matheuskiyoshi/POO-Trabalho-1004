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
    this.renderizarUsuario(usuario);
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

  verificarUsuarioPorCPF(cpf: number): Usuario {
    const usuarioEncontrado = this.usuarios.find((usuario) => usuario.cpf === cpf);

    if (usuarioEncontrado) {
      return usuarioEncontrado;
    } else {
      alert("Usuário não cadastrado no sistema");
      throw new Error("Usuário não cadastrado no sistema");
    }
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

  getLivros() {
    return this.livros;
  }

  adicionarLivro(livro: Livro): void {
    const livroExistente = this.livros.find(l => l.isbn === livro.isbn);

    if (livroExistente) {
      if (livro.quantidade > 0) {
        livroExistente.quantidade += livro.quantidade;
        this.atualizarDetalhesLivro(livroExistente);
        this.salvarNoLocalStorage();
      } else {
        alert('A quantidade do livro deve ser maior que zero.');
      }
    } else {
      if (livro.quantidade <= 0) {
        alert('A quantidade do livro deve ser maior que zero.');
        return;
      }

      this.livros.push(livro);
      this.renderizarLivro(livro);
      this.salvarNoLocalStorage();
    }
  }

  removerLivro(livro: Livro, inputRemover: string): void {
    const quantidadeRemover = parseInt(inputRemover, 10);
    if (!isNaN(quantidadeRemover) && quantidadeRemover > 0) {
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

  atualizarDetalhesLivro(livro: Livro): void {
    const divDetalhes = this.ul.querySelector(`div[data-isbn="${livro.isbn}"]`);
    if (divDetalhes) {
      divDetalhes.textContent = `Título: ${livro.titulo}, Autor: ${livro.autor}, Ano: ${livro.ano}, Gênero: ${livro.genero}, ISBN: ${livro.isbn}, Quantidade: ${livro.quantidade}`;
    }
  }

  verificarDisponibilidadeLivro(isbn: number): Livro {
    const livroEncontrado = this.livros.find((livro) => livro.isbn === isbn);
    if (!livroEncontrado) {
      alert("Livro não cadastrado no sistema");
      throw new Error("Livro não cadastrado no sistema");
    }
    if (livroEncontrado.quantidade == 0) {
      alert("Livro não disponível para empréstimo");
      throw new Error("Livro não disponível para empréstimo");
    }
    livroEncontrado.quantidade--;
    this.atualizarDetalhesLivro(livroEncontrado)
    
    return livroEncontrado;
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

class Emprestimo {
  usuario: Usuario;
  livro: Livro;
  dataEmprestimo: Date;

  constructor(usuario: Usuario, livro: Livro) {
    this.usuario = usuario;
    this.livro = livro;
    this.dataEmprestimo = new Date();
  }
  getDataEmprestimoFormatada(): string {
    const dt = new Date(this.dataEmprestimo)
    return dt.toLocaleDateString();
  }
}
class ListaDeEmprestimos {
  private emprestimos: Emprestimo[] = [];
  private ul: HTMLUListElement;

  constructor(ulId: string) {
    this.ul = document.getElementById(ulId) as HTMLUListElement;
    this.carregarDoLocalStorage();
  }

  adicionarEmprestimo(emprestimo: Emprestimo): void {
    this.emprestimos.push(emprestimo);
    this.renderizarEmprestimo(emprestimo);
    this.salvarNoLocalStorage();
  }

  verificarEmprestimoPorUsuario(cpf: number): number {
    const arrEmprestimoDoUsuario = this.emprestimos.filter((emprestimo) => emprestimo.usuario.cpf == cpf)
    return arrEmprestimoDoUsuario.length;
  }

  limiteDeEmprestimoUsuario(cpf: number): void {
    const emprestimos = this.verificarEmprestimoPorUsuario(cpf)
    if (emprestimos > 2) {
      alert("Limite de empréstimo por usuário atingido")
      throw new Error("Limite de empréstimo por usuário atingido")
    }
  }

  private renderizarEmprestimo(emprestimo: Emprestimo): void {
    const li = document.createElement("li");
    const divDetalhes = document.createElement("div");
    divDetalhes.textContent = `Usuário: ${emprestimo.usuario.nome}, CPF: ${emprestimo.usuario.cpf}, Título: ${emprestimo.livro.titulo}, ISBN: ${emprestimo.livro.isbn}, Data do empréstimo: ${emprestimo.getDataEmprestimoFormatada()}.`;
    const botaoDevolver = document.createElement("button");
    botaoDevolver.textContent = "Devolução";
    botaoDevolver.addEventListener("click", () => {
      this.removerEmprestimo(emprestimo.usuario.cpf);
      emprestimo.livro.quantidade++
      listaLivros.atualizarDetalhesLivro(emprestimo.livro)
    });
    li.appendChild(divDetalhes);
    li.appendChild(botaoDevolver);
    this.ul.appendChild(li);
  }

  removerEmprestimo(cpf: number): void {
    const indice = this.emprestimos.findIndex(emprestimo => emprestimo.usuario.cpf === cpf);
    if (indice !== -1) {
      this.emprestimos.splice(indice, 1);
      this.atualizarLista();
      this.salvarNoLocalStorage();
    }
  }

  private atualizarLista(): void {
    while (this.ul.firstChild) {
      this.ul.removeChild(this.ul.firstChild);
    }
    this.emprestimos.forEach(emprestimo => this.renderizarEmprestimo(emprestimo));
  }


  private salvarNoLocalStorage(): void {
    localStorage.setItem('emprestimos', JSON.stringify(this.emprestimos));
  }

  private carregarDoLocalStorage(): void {
    const emprestimosGuardados = localStorage.getItem('emprestimos');
    if (emprestimosGuardados) {
      this.emprestimos = JSON.parse(emprestimosGuardados);
      this.emprestimos.forEach(emprestimo => this.renderizarEmprestimo(emprestimo));
    }
  }
}

const listaEmprestimos = new ListaDeEmprestimos("lista-emprestimos");

const formEmprestimo = document.getElementById("emprestimo-livro") as HTMLFormElement;
formEmprestimo.addEventListener("submit", (event) => {
  event.preventDefault();

  const usuarioCPF = document.getElementById("usuario-cpf-emprestimo") as HTMLInputElement;
  const livroISBN = document.getElementById("livro-isbn-emprestimo") as HTMLInputElement;

  const cpf = parseInt(usuarioCPF.value);
  const isbn = parseInt(livroISBN.value);

  const usuarioEmprestimo = listaUsuarios.verificarUsuarioPorCPF(cpf);
  const livroEmprestimo = listaLivros.verificarDisponibilidadeLivro(isbn);

  const novoEmprestimo = new Emprestimo(
    usuarioEmprestimo,
    livroEmprestimo
  );

  listaEmprestimos.limiteDeEmprestimoUsuario(cpf);

  listaEmprestimos.adicionarEmprestimo(novoEmprestimo);

  usuarioCPF.value = "";
  livroISBN.value = "";
});