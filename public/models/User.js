class User{

    constructor(name, gender, birth, country, email, password, photo, admin){

        this._id;
        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date();

    }
    
    get id(){
        return this._id;
    }

    get name(){
        return this._name;
    }

    get gender(){
        return this._gender;
    }

    get birth(){
        return this._birth;
    }

    get country(){
        return this._country;
    }

    get email(){
        return this._email;
    }

    get password(){
        return this._password;
    }

    get photo(){
        return this._photo;
    }

    get admin(){
        return this._admin;
    }

    get register(){
        return this._register;
    }



    set id(value){
        this._id = value;
    }
    
    set name(value){
        this._name = value;
    }

    set gender(value){
        this._gender = value;
    }

    set birth(value){
        this._birth = value;
    }

    set country(value){
        this._country = value;
    }

    set email(value){
        this._email = value;
    }

    set password(value){
        this._password = value;
    }

    set photo(value){
        this._photo = value;
    }

    set admin(value){
        this._admin = value;
    }

    set register(value){
        this.__register = value;
    }

    loadFromJSON(json){

        for(let name in json){

            switch(name){
                case '_register':
                    this[name] = new Date(json[name]);
                break;
                default:
                    this[name] = json[name];
            }
            
        }

    }

   static getUsersStorage(){

        return HttpRequest.get('/users');
        
    }

    toJSON(){

        let json = {};

        Object.keys(this).forEach(key => {

            if(this[key] !== undefined) json[key] = this[key];

        });

        return json;

    }

    save(){

        return new Promise((resolve, reject) => {

            let promise;

            if(this.id){

              promise = HttpRequest.put(`/users/${this.id}`,this.toJSON()); 

            }else{

               promise = HttpRequest.post(`/users/`,this.toJSON());

            }

            promise.then(data => {

                this.loadFromJSON(data);
                resolve(this);

            }).catch( e => {

                reject(e);

            });

        });

    }

    remove(){

        return HttpRequest.delete(`/users/${this.id}`);

    }

}