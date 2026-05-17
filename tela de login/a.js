const botaoTrocar = document.getElementById("trocar");
const botaoVoltar = document.getElementById("voltar");
const formularioCadastro = document.getElementById("cadastro");
const formularioLogin = document.getElementById("login");

botaoTrocar.addEventListener("click", function(){
    formularioLogin.style.display = "none";
    formularioCadastro.style.display = "block";
});

botaoVoltar.addEventListener("click", function(){
    formularioCadastro.style.display = "none";
    formularioLogin.style.display = "block";
});

function cadastrar(){
    let userCad = document.getElementById("userCad").value;
    let senhaCad = document.getElementById("senhaCad").value;
    
    if(userCad === "" || senhaCad === ""){
        alert("Preencha todos os campos!");
        return;
    } 

    let usuario = {
        username: userCad,
        password: senhaCad
    };
    localStorage.setItem("usuario", JSON.stringify(usuario));
    alert("Cadastro realizado com sucesso!");

    document.getElementById("user-cad").value = "";
    document.getElementById("senha-cad").value = "";
    formularioLogin.style.display = "block";
    formularioCadastro.style.display = "none"; 
}

function logar(){
    let userLogin = document.getElementById("userLogin").value;
    let senhaLogin = document.getElementById("senhaLogin").value;

    let usuarioArmazenado = JSON.parse(localStorage.getItem("usuario"));

    if(usuarioArmazenado && userLogin === usuarioArmazenado.username && senhaLogin === usuarioArmazenado.password){
        alert("Login bem-sucedido!");
    } else {
        alert("Usuário ou senha incorretos!");
    }

}
