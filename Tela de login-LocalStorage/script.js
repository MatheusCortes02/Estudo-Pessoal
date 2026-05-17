const botaoTrocar = document.getElementById("trocar");
const botaoVoltar = document.getElementById("voltar");
const formularioCadastro = document.getElementById("cadastro");
const sessaoLogin = document.getElementById("sessao-login");

// 1. Alternar entre as telas
botaoTrocar.addEventListener("click", function() {
    sessaoLogin.style.display = "none";      // Esconde o Login
    formularioCadastro.style.display = "block"; // Mostra o Cadastro
});

botaoVoltar.addEventListener("click", function() {
    sessaoLogin.style.display = "block";     // Mostra o Login
    formularioCadastro.style.display = "none";  // Esconde o Cadastro
});

// 2. Lógica de Cadastro
function cadastrar() {
    let userCad = document.getElementById("user-cad").value;
    let senhaCad = document.getElementById("senha-cad").value;

    if (userCad === "" || senhaCad === "") {
        alert("Preencha os campos!");
        return;
    }

    // Salva no LocalStorage
    let usuario = { user: userCad, senha: senhaCad };
    localStorage.setItem("usuario", JSON.stringify(usuario));
    
    alert("Cadastrado com sucesso!");

    // Limpa os campos e volta para o login
    document.getElementById("user-cad").value = "";
    document.getElementById("senha-cad").value = "";
    sessaoLogin.style.display = "block";
    formularioCadastro.style.display = "none";
}

// 3. Lógica de Login
function logar() {
    let userLog = document.getElementById("user").value;
    let senhaLog = document.getElementById("senha").value;
    
    let usuarioSalvo = JSON.parse(localStorage.getItem("usuario"));

    if (usuarioSalvo) {
        if (userLog === usuarioSalvo.user && senhaLog === usuarioSalvo.senha) {
            alert("Login bem sucedido!");
            window.location.href = "home.html"; // Redireciona para a página home
        } else {
            alert("Usuário ou senha incorretos.");
        }
    } else {
        if (userLog === "admin" && senhaLog === "admin") {
            alert("Login admin!");
        } else {
            alert("Nenhum usuário cadastrado.");
        }
    }
}