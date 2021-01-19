class LoginController{

    constructor(formIdLogin){

        this.formEl = document.getElementById(formIdLogin);
        this.onLogin();
        
    }//Fechando constructor;

    onLogin(){

        //Salvar dados do Formulario;
        this.formEl.addEventListener("submit", event => {

            //comando para quebrar o evento padrão do formulario, que é carregar a pagina;
            event.preventDefault();

            let senha = document.querySelector("#password").value;
            let email = document.querySelector("#nome").value;
            

            User.getUsersStorage().then(data => {

                data.users.forEach(dataUser => {

                    console.log(dataUser);
                    if(senha == dataUser._password && email == dataUser._email){

                        window.location.href = '/home';

                    }
        
                });

            });

            this.formEl.reset();
            
        });

    }//Fechando metodo onLogin

}