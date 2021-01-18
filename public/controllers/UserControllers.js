class UserController{

    constructor(formIdCreate, formIdUpdate, tableId){

        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();
        this.selectAll();

    }//Fechando constructor;

    //Metodo editar usuario;
    onEdit(){

        //Cancelar Edição;
        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e => {

            //Mostrar Painel de criação de usuário;
            this.showPanelCreate();

        });

        //Salvar Edição;
        this.formUpdateEl.addEventListener('submit', event => {

            //comando para quebrar o evento padrão do formulario, que é carregar a pagina;
            event.preventDefault();

            //Varialvel do Botão submit
            let btnSubmit = this.formUpdateEl.querySelector("[type=submit]");

            //Desabilitando o botão submit
            btnSubmit.disabled = true;

           //Chamdno o metodo que retorna o Objeto user;
           let values = this.getValues(this.formUpdateEl);

           let index = this.formUpdateEl.dataset.trIndex;

           let tr = this.tableEl.rows[index];

           let userOld = JSON.parse(tr.dataset.user);

           let result = Object.assign({}, userOld, values);

            this.showPanelCreate();
        
             //Pegando a photo;
            this.getPhoto(this.formUpdateEl).then(
                (content) => {

                    if(!values.photo){
                         result._photo = userOld._photo;
                    }else {
                        result._photo = content;
                    }

                    let user = new User();

                    user.loadFromJSON(result);

                    user.save().then(user => {

                        this.getTr(user, tr);

                        this.addEventsTR(tr);
                        //Metodo que verifica quantos usuarios foram cadastrados;
                        this.updateCount();
    
                        //Limpando Formulario
                        this.formUpdateEl.reset();
    
                        //Habilitando o botão submit
                        btnSubmit.disabled = false;

                    });

                },
                (e) => {

                console.error(e);

                }
            );

        });

    }//Fim do metodo onEditCancel;

    onSubmit(){

        //Salvar dados do Formulario;
        this.formEl.addEventListener("submit", event => {

            //comando para quebrar o evento padrão do formulario, que é carregar a pagina;
            event.preventDefault();

            //Varialvel do Botão submit
            let btnSubmit = this.formEl.querySelector("[type=submit]");

            //Desabilitando o botão submit
            btnSubmit.disabled = true;

            //Chamdno o metodo que retorna o Objeto user;
           let values = this.getValues(this.formEl);

           //Verificando se values não está null;
           if(!values) return false;

           //Pegando a photo;
           this.getPhoto(this.formEl).then(
               (content) => {

                    //Vai receber a photo;
                    values.photo = content;

                    values.save().then(user => {

                        //Metodo para listar Objeto na tabela de user cadastrado;
                        this.addLine(user);

                        //Limpando formulario
                        this.formEl.reset();

                        //Habilitando o botão submit
                        btnSubmit.disabled = false;

                    });

              },
              (e) => {

                  console.error(e);

              }
           );

        });

    }//Fechando metodo onSubmit

    //Metodo para lê o conteudo da photo;
    getPhoto(formEl){
        
        return new Promise((resolve, reject) => {

            //Objeto para armazenar para armazenar a photo;
            let fileReader = new FileReader();

            //Pegando somento a photo, gerando um array com base no dado filtrado;
            let elements = [...formEl.elements].filter(item => {

                //Verifica se é uma imagem;
                if (item.name === 'photo'){
                    //Retorna a img encontrada;
                    return item;
                }

            });

            //Pegando a photo;
            let file = elements[0].files[0];

            fileReader.onload = () => {

                resolve(fileReader.result);

            }

            fileReader.onerror = (e) => {

                reject(e);

            };

            if(file){

                fileReader.readAsDataURL(file);

            } else{

               resolve('/dist/img/boxed-bg.jpg');

            }


        });

    }//Fechando metodo getPhoto

    //Metodo para pegar os dados em JSON e passar para o objeto user;
    getValues(formEl){

        //Objeto JSON
        let user = {};

        let isValid = true;

        //Preencher o JSON com os dados dos fields do formulario;
        [...formEl.elements].forEach(function(field, index){

            if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value){

                field.parentElement.classList.add("has-error");
                isValid =  false;

            }

            //Verificando se o campo e o gender;
            if(field.name == 'gender'){

                //Verificando qual gender está chackado;
                if(field.checked){
                    //Pegando o genero selecionado e inserindo no user;
                    user[field.name] = field.value;
                }

            }else if(field.name == "admin"){

                user[field.name] = field.checked;

            }else{
                //Pegando os campos preenchidos e inserindo no user;
                user[field.name] = field.value;

            }

        });

        if(!isValid){
            return false;
        }

        //Passando os dados do array user para o usuario user;
        return  new User(
            user.name,
            user.gender,
            user.birth, 
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        );

    }//Fechando o Metodo getValues;

    selectAll(){

        //let users = User.getUsersStorage();
        User.getUsersStorage().then(data => {

            data.users.forEach(dataUser => {

                let user = new User();

                user.loadFromJSON(dataUser);

                this.addLine(user);
    
            });

        });

    }

  

    //Função para adicionar dados do user na tabela;
    addLine(dataUser){

        let tr = this.getTr(dataUser);

        //Listando os usuarios cadastrados;
        this.tableEl.appendChild(tr);

        //Metodo que verifica quantos usuarios foram cadastrados;
        this.updateCount();

    }//Fechando metodo addLine;

    getTr(dataUser, tr = null){

        if(tr === null) tr = document.createElement('tr');

        tr.dataset.user = JSON.stringify(dataUser);

        //Inserindo os dados na tr
        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin ? 'Sim' : 'Não')}</td>
            <td>${Utils.dataFormat(dataUser.register)}</td>
            <td>
            <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
            <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>
        `;

        this.addEventsTR(tr);
        return tr;

    }

    addEventsTR(tr){

        //Evento de editar usuario;
        tr.querySelector(".btn-delete").addEventListener("click", e => {

            if(confirm("Deseja realmente excluit?")){

                let user = new User();
                user.loadFromJSON(JSON.parse(tr.dataset.user));
                user.remove().then(data => {

                    tr.remove();
                    this.updateCount();

                });


            }

        });

        //Evento de editar usuario;
        tr.querySelector(".btn-edit").addEventListener("click", e => {

            let json = JSON.parse(tr.dataset.user);
    
            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;
    
            for(let name in json){
    
                let field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "]");

                if(field){

                    switch(field.type) {
                        case 'file':
                            continue;
                        break;
                        case 'radio':
                            field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "][value="+json[name]+"]");
                            field.checked = true;
                        break;
                        case 'checkbox':
                            field.checked = json[name];
                        break;
                        default:
                            field.value = json[name];
                    }

                }
    
            }

            this.formUpdateEl.querySelector(".photo").src = json._photo;
    
            this.showPanelUpdate();
        });

    }

    //Metodo para mostrar formulario de criar usuários;
    showPanelCreate(){

        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";

    }//Fim do metodo showPamelCreate;

    //Medoto para mostrar formulario de edição de usuário;
    showPanelUpdate(){

        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";

    }//Fim do metodo showPanelUodate;

    //Contando quantos usuário form cadastrados;
    updateCount(){

        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableEl.children].forEach(tr => {

            numberUsers++;

            let user = JSON.parse(tr.dataset.user);

            if(user._admin) numberAdmin++;
        });

        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;

    }//Fim do metodo updateCount;

}//Fechando a class userController;