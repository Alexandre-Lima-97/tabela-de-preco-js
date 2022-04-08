const mongoose = require('mongoose');
const validator = require("validator");
const bcriptjs = require("bcryptjs");
const bcrypt = require('bcryptjs/dist/bcrypt');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
        nome: {type: String, required: true},
        sobrenome: {type: String, required: true},
        email: {type: String, required: true},
        password: {type: String, required: true}
});

const LoginModel = mongoose.model("Login", LoginSchema);

class Login {
        constructor(body){
                this.body = body;
                this.errors = [];
                this.user = null;
        }

        async login() {
                this.validacaoLogin();
                console.log("2");
                console.log(this.errors.length);
                if(this.errors.length > 0) return;
                this.user = await LoginModel.findOne({email: this.body.email});
                if(!this.user){
                        this.errors.push("Usuário ou senha inválido");
                        return;
                }
                if(!bcryptjs.compareSync(this.body.password,this.user.password)){
                        this.errors.push("Usuário ou senha inválido");
                        this.user = null;
                        return; 
                }
        }

        async cadastro(confirmaSenha) {
                this.validacao(confirmaSenha);
                if(this.errors.length > 0) return;
                await this.userExists();
                if(this.errors.length > 0) return;
                const salt = bcriptjs.genSaltSync();
                this.body.password = bcriptjs.hashSync(this.body.password, salt);
                this.user = await LoginModel.create(this.body);
        }

        async validacaoLogin(){
                this.body.sobrenome = '';
                this.body.nome = '';
                this.checkCampos();
                if(!validator.isEmail(this.body.email)) {
                        //console.log("AQUI?");
                        this.errors.push("Insira um email válido");
                        return;
                }

        }

        async validacao(confirmaSenha){
                this.checkCampos();
                if(this.body.nome.length <= 2){
                        this.errors.push("Insira um nome válido");
                        return;
                }
                if(this.body.sobrenome.length < 2){
                        this.errors.push("Insira um sobrenome válido");
                        return;
                }
                if(!validator.isEmail(this.body.email)) {
                        this.errors.push("Insira um email válido");
                        return;
                }
                console.log(this.body.password);
                if(this.body.password !== confirmaSenha ){
                        this.errors.push("As senhas não coincidem");
                        return;
                }
                console.log(this.body.password);
                if(this.body.password.length < 6 || this.body.password.length > 50){
                        this.errors.push("Senha precisa ter entre 6 e 50 caracteres");
                        return;
                }
        }

        async userExists(){
                const user = await LoginModel.findOne({email: this.body.email});

                if(user) {
                        this.errors.push("O Usuário já existe");
                        return;
                }
        };


        checkCampos() {
                for(const key in this.body) {
                        if (typeof this.body[key] !== 'string'){
                                this.body[key] = '';
                        }
                 }
                 
                 console.log(this.body.password);
                 this.body = {
                         nome: this.body.nome,
                         sobrenome: this.body.sobrenome,
                         email: this.body.email,
                         password: this.body.password
                 }
                 console.log(this.body);
                 console.log(this.errors);
        }
}

module.exports = Login;