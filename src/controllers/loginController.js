const Login = require("../models/loginModel");

exports.index = (req, res) => {
        res.render('login');
}

exports.cadastro = (req, res) => {
        res.render('cadastro');
}

exports.cadastrar = async (req, res) => {
        const login = new Login(req.body);
        await login.cadastro(req.body.confirmacao);
        if(login.errors.length > 0){
                console.log(login.errors);
                req.flash('errors', login.errors);
                req.session.save(function(){
                        res.redirect('back');
                });
                return;
        }
        req.session.save(function(){
                req.session.user = login.user;
                return res.redirect('/');
        });
}

exports.login = async (req, res) => {
        try{
                const login = new Login(req.body);
                await login.login();
                if(login.errors.length > 0){
                        req.flash('errors', login.errors);
                        req.session.save(function(){
                                res.redirect('back');
                        });
                        return;
                }
                req.session.user = login.user;
                req.session.save(function(){
                        return res.redirect('/');
                });
        }
        catch(e){
                console.log(e);
        }
}

exports.logoff = (req, res) => {
        req.session.destroy();
        res.redirect('/');
}