const express = require('express');
const nodemailer = require('nodemailer');
const qr = require('qr-image');
const multer = require('multer');
let Jimp = require('jimp');
const twig = require('twig');
const {isErr, strinfToDate, isExist, horodatage, arrondi} = require('./src/utilities');
const fs = require('fs');
const config = require('./setting/config')
let bodyParser = require('body-parser');
const morgan = require('morgan')('dev');
const crypto = require('crypto');
const session = require('express-session');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const ent = require('ent');
const mysql = require('promise-mysql');

mysql.createConnection({
    host: config.db.host,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password
}).then((db) => {
    global.sliderInterval = new Array();
    console.log(`CONNEXION ETABLIE AVEC LA BD`);
    const app = express();
    const https = require('http').createServer(app);
    let io = require('socket.io')(https);
    const User = require('./Model/User')(db, config);

    let compo = new Array();

    // utilisation du middlewar
    app.use(expressValidator());
    app.use(session({
        secret: config.session.secret,
        resave: config.session.resave,
        saveUninitialized: config.session.saveUninitialized
    }));
    app.use(express.static(`${__dirname}/public`));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(morgan);

    app.get('/', async (req, res) =>{
        if(req.session.nanSecondeGen){
            res.redirect('/Accueil');
        }
        res.redirect('/login')
    });


    app.get('/result', async (req, res) => {
        if(req.session.nanSecondeGen !== undefined){
            console.log(JSON.stringify(compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)]))
            let user = compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)]
            const moy = await User.getVerifNote(compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].sousQuiz, req.session.nanSecondeGen.id);
            if(!isErr(moy)){
                let info = {}
                let name = new Array();
                let note = new Array();
                const responseT = await User.getNumberQuestion(compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].sousQuiz)
                const stud = await User.getNoteUsers(compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].sousQuiz);
                const med = await User.getMoyOfQuizBySousquizId(compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].sousQuiz)
                for(let i in stud){
                    name.push(stud[i].pseudo);
                    note.push(stud[i].note);
                    continue;
                }
                info.name = name;
                info.gl  = arrondi(med.ele);
                info.note = note;
                info.moy = moy;
                info.und = responseT.NumberQ - (moy.errors + moy.trouve);
                compo.splice(compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)], 1, user);
                res.render(`${__dirname}/public/resul.twig`, {user: req.session.nanSecondeGen, info:info});
            }
        }
        else{
            res.redirect('/login');
        }
    })


    app.get('/classe', async (req, res) => {
        if(req.session.nanSecondeGen !== undefined){
            const all = await User.getRanking();
            res.render(`${__dirname}/public/cla.twig`, {user: req.session.nanSecondeGen, info:all})
        }
        else{
            
            res.redirect('/login');
        }
    })

    app.get('/profil', async (req,res) =>{
        if(req.session.nanSecondeGen){
            let info = {};
            let valid = 0;
            let fait = 0;
            let echec = 0;
            let SomN = 0;
            let SomD = 0;
            const NbQuiz = await User.getAllQuizFromProfil();
            const TotalQuizFait = await User.getAllQuizByStudent(req.session.nanSecondeGen.id);
            for(let i in TotalQuizFait){
                fait++;
                SomN = SomN + TotalQuizFait[i].note;
                SomD = SomD + TotalQuizFait[i].moyen;
                if(TotalQuizFait[i].etat === 1){
                    valid++;
                }
                else{
                    echec++;
                }
            }
            info.fait = fait;
            info.totQuiz = NbQuiz.sous;
            info.moyN = (TotalQuizFait.length > 0 ) ? arrondi(SomN/TotalQuizFait.length) : null;
            info.moyD = (TotalQuizFait.length > 0 ) ? arrondi(SomD/TotalQuizFait.length) : null;
            info.valid = valid;
            info.echec = echec;
            info.quiz = TotalQuizFait;
        res.render(`${__dirname}/public/profil.twig`, {user: req.session.nanSecondeGen, info:info})
        }
        else{
            res.redirect('login');
        }
    })

    app.get('/login', async (req, res) =>{
        if(req.session.nanSecondeGen){
            res.redirect('/Accueil');
        }
        else{
            res.render(`${__dirname}/public/login.twig`, { user: "nil" })
        }
    });
    app.post('/login', async (req, res) =>{
        req.check('user', "Username ne doit pas être vide").notEmpty();
        req.check('pass', "Email ne doit pas être vide").notEmpty();

        const error = req.validationErrors();
        if(error){
            res.render(`${__dirname}/public/login.twig`, { errors: error })
        }
        else{
           let user = req.body.user;
           let pass = req.body.pass;
           let password = crypto.createHmac('sha256', pass).update('I love cupcakes').digest('hex');
            const personC = await User.userExist(user, password);
           if (!isErr(personC)){
               if(isExist(compo, personC.emailcrypt) !== -1){
                res.render(`${__dirname}/public/login.twig`, { error: 'Vous êtes déjà connecté Sur un autre Appareil pensez à vous deconnecter là bas.' })
            }
               req.session.nanSecondeGen = personC;
               let users = {};
               users.emailcrypt = req.session.nanSecondeGen.emailcrypt;
               compo.push(users);
               if(req.session.nanSecondeGen.level === 0 || req.session.nanSecondeGen.level === 2){
                res.redirect('/Accueil');
               }
               else res.redirect('/Admin');
               /*let ti = new Date().getTime()
               const attr = req.session.nanSecondeGen.email + ':' + req.session.nanSecondeGen.pass
               ti = ti+ '-' + req.session.nanSecondeGen.emailcrypt + '.png'
               let qr_svg = qr.image(attr, {type: 'png'})
               qr_svg.pipe(fs.createWriteStream(__dirname+'/public/Assets/images/code/'+ ti));*/
               
           }
           else{
               res.render(`${__dirname}/public/login.twig`, { error: 'Identification Echoué. Veuillez verifier vos cordonnées ou Inscrivez-vous' })
           }
        }//res.render(`${__dirname}/public/form.twig`, { user: "nil" })
    });

    app.post('/loginQ', async (req, res) =>{
        req.check('user', "Username ne doit pas être vide").notEmpty();
        req.check('pass', "Email ne doit pas être vide").notEmpty();

        const error = req.validationErrors();
        if(error){
            res.render(`${__dirname}/public/login.twig`, { errors: error })
        }
        else{
           let user = req.body.user;
           let pass = req.body.pass;
            const personC = await User.userExist(user, pass);
            if (!isErr(personC)){
                if(isExist(compo, personC.emailcrypt) !== -1){
                 res.render(`${__dirname}/public/login.twig`, { error: 'Vous êtes déjà connecté Sur un autre Appareil pensez à vous deconnecter là bas.' })
             }
                req.session.nanSecondeGen = personC;
                let users = {};
                users.emailcrypt = req.session.nanSecondeGen.emailcrypt;
                compo.push(users);
                if(req.session.nanSecondeGen.level === 0 || req.session.nanSecondeGen.level === 2){
                 res.redirect('/Accueil');
                }
                else res.redirect('/Admin');
               /*let ti = new Date().getTime()
               const attr = req.session.nanSecondeGen.email + ':' + req.session.nanSecondeGen.pass
               ti = ti+ '-' + req.session.nanSecondeGen.emailcrypt + '.png'
               let qr_svg = qr.image(attr, {type: 'png'})
               qr_svg.pipe(fs.createWriteStream(__dirname+'/public/Assets/images/code/'+ ti));*/
           }
           else{
               res.render(`${__dirname}/public/login.twig`, { error: 'Identification Echoué. Veuillez verifier vos cordonnées ou Inscrivez-vous' })
           }
        }//res.render(`${__dirname}/public/form.twig`, { user: "nil" })
    });
    app.post('/signin', async (req, res)=>{
        req.check('name', "Le nom ne doit pas être vide").notEmpty();
        req.check('firstname', "Le prénom ne doit pas être vide").notEmpty();
        req.check('passS', "Le mot de passe doit avoir 6 Caractères minimum").isLength({min:6});
        req.check('conf_pass', "Le mot de passe et sa confirmation ne sont pas identique").equals(req.body.passS);
        req.check('firstname', "Le prénom ne doit pas être vide").notEmpty();
        req.check('email', "Email invalide").isEmail();
        req.check('local', "La localité ne doit pas être vide").notEmpty();
        let error = req.validationErrors();
        if(error){
            req.session.errors = error;
            res.redirect('/login?e=1')
        }
        else{
            let element = req.body;
            element.birth = element.annee+ '-'+element.mois+'-'+element.jour;
            element.birth = strinfToDate(element.birth);
            element.age = new Date().getFullYear() - parseInt(element.annee, 10);
            element.emaycrypt = crypto.createHmac('sha256', element.email).update('I love cupcakes').digest('hex');
            element.passS = crypto.createHmac('sha256', element.passS).update('I love cupcakes').digest('hex');
            if(element.sexe == "Femme"){
                element.profil = (element.age > 21)? 'userGirl05.jpg': 'userGirl28.png';
                const confirm = Math.floor(Math.random() * Math.floor(999999999999999));
                const users = await User.setUser(element,1,confirm);
                if(!isErr(users)){
                    req.session.ngboador = users;
                    res.redirect('/Accueil');
                }
                res.redirect('/login?e=1')
            }
            else {
                element.profil = (element.age > 21) ? 'userBoy18.png' : 'userChild01.jpg';
                const confirm = Math.floor(Math.random() * Math.floor(999999999999999));
                const users = await User.setUser(element, 1, confirm);
                if(!isErr(users)){
                    req.session.ngboador = users;
                    res.redirect('/Accueil');
                }
                res.redirect('/login?e=1');
            }
        }
    });

    app.get('/ownL/:crypt', async (req, res)=>{
        if(req.session.nanSecondeGen){
            let crypt = req.params.crypt.replace(/<script>/g,"");
            crypt = ent.encode(crypt);
            const Quiz = await User.getQuiz(crypt);
            if(!isErr(Quiz)){
                console.log(JSON.stringify(compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)]))
            compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].quiz = Quiz.id;
            let sousCate = await User.getSousCategorieBy(Quiz.id);
            for(let i in sousCate){
                const num = await User.getNumberQuestion(sousCate[i].id);
                const tedt = (sousCate[i].times*60) / num.NumberQ;
                const timeQestion = Math.round(tedt);
                const best = await User.getBestThreeStudent(sousCate[i].id);
                sousCate[i].num = num.NumberQ;
                sousCate[i].best = best;
                sousCate[i].timeQestion = timeQestion;
                continue;
            }
            info = {}
            info.sousCate = sousCate;
            res.render(`${__dirname}/public/sosucat.twig`, {user: req.session.nanSecondeGen, info:info});
            }
            else{
                res.redirect('/Accueil');
            }
            
        }
        else res.redirect('/login')
    });



    app.get('/Accueil', async (req, res)=>{
        if(req.session.nanSecondeGen){
            let info = {}
            const Quiz = await User.getQuiZOnline();
            for(let i in Quiz){
                if(horodatage(Quiz[i].beg) && !horodatage(Quiz[i].end)){
                    info.title = Quiz[i].title;
                    info.end = Quiz[i].end;
                    info.crypt = Quiz[i].encrypt;
                }
                continue;
            }
            res.render(`${__dirname}/public/inde.twig`, {user: req.session.nanSecondeGen, info:info});
        }
        else res.redirect('/login')
    });
    app.get('/beg/:crypt', async (req, res)=>{
        if(req.session.nanSecondeGen){
            let crypt = req.params.crypt.replace(/<script>/g,"");
            crypt = ent.encode(crypt);
            const SousQuiz = await User.getSousQuiz(crypt);
            const moy = await User.getVerifNote(SousQuiz.id, req.session.nanSecondeGen.id);
            if(!isErr(moy)){
                compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].sousQuiz = SousQuiz.id;
                res.redirect('/result');
            }
            else if(!isErr(SousQuiz)){
                if(horodatage(SousQuiz.end)){
                    const Elev = await User.setNote(SousQuiz.id, req.session.nanSecondeGen.id,0,0,0,2,0);
                    compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].sousQuiz = SousQuiz.id;
                    res.redirect('/result');
                }
                else{
                    if(compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].sousQuiz){
                        if(compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].sousQuiz === SousQuiz.id){
                            res.render(`${__dirname}/public/index.twig`, {user: req.session.nanSecondeGen, info:compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)]});
                        }
                        else{
                            compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].sousQuiz = SousQuiz.id;
                    compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].totalTimes = SousQuiz.times * 60;
                    compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].totalActuel = SousQuiz.times * 60;
                    compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].VraiTimes = SousQuiz.times * 60;
                    compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].niveauActuel = 0;
                    let Questions = await User.getQuestionBySousCategorieId(SousQuiz.id);
                    for(let i in Questions){
                        const resposnes = await User.getResponseByQuestionId(Questions[i].id);
                        Questions[i].responses = resposnes;
                        continue;
                    }
                    
                    compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].niveauTotal = Questions.length;
                    compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].timesPerQuestion = SousQuiz.times * 60 / Questions.length;
                    compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].timesPerQuestion = Math.round(compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].timesPerQuestion);
                    compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].timesQues = compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].timesPerQuestion;
                    compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].Ques = Questions;
                    res.render(`${__dirname}/public/index.twig`, {user: req.session.nanSecondeGen, info:compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)]});
                        }
                }
                else{
                    compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].sousQuiz = SousQuiz.id;
                    compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].totalTimes = SousQuiz.times * 60;
                    compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].totalActuel = SousQuiz.times * 60;
                    compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].VraiTimes = SousQuiz.times * 60;
                    compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].niveauActuel = 0;
                    let Questions = await User.getQuestionBySousCategorieId(SousQuiz.id);
                    for(let i in Questions){
                        const resposnes = await User.getResponseByQuestionId(Questions[i].id);
                        Questions[i].responses = resposnes;
                        continue;
                    }
                    
                    compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].niveauTotal = Questions.length;
                    compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].timesPerQuestion = SousQuiz.times * 60 / Questions.length;
                    compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].timesQues = compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].timesPerQuestion;
                    compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)].Ques = Questions;
                    res.render(`${__dirname}/public/index.twig`, {user: req.session.nanSecondeGen, info:compo[isExist(compo, req.session.nanSecondeGen.emailcrypt)]});

                }
                }
            }
            else{
                res.redirect('/Accueil');
            }
        }
        else res.redirect('/login')
    });
    app.get('/beta/:crypt', async (req, res)=>{
        if(req.session.nanSecondeGen){
            let info = {};
            let crypt = req.params.crypt.replace(/<script>/g,"");
            crypt = ent.encode(crypt);
            const SousQuiz = await User.getSousQuiz(crypt);
            const moy = await User.getVerifNote(SousQuiz.id, req.session.nanSecondeGen.id);
            if(!isErr(moy)){
                let Questions = await User.getQuestionBySousCategorieId(SousQuiz.id);
                    for(let i in Questions){
                        const resposnes = await User.getResponseByQuestionId(Questions[i].id);
                        Questions[i].responses = resposnes;
                        const respo = await User.getResponseForComparate(Questions[i].id, req.session.nanSecondeGen.id)
                        if(respo !== undefined){
                            if(respo.response_id !== null){
                                const tcheck = await User.getResponseFullComparate(respo.response_id);
                                if(!isErr(tcheck)){
                                    for(let j in Questions[i].responses){
                                        if(tcheck.id === Questions[i].responses[j].id){
                                            Questions[i].responses[j].check = 10;
                                        }
                                        continue;
                                    }
                                }
                                else {
                                    for(let j in Questions[i].responses){
                                        if(respo.response_id === Questions[i].responses[j].id){
                                            Questions[i].responses[j].check = 2;
                                        }
                                        continue;
                                    }
                                }
    
                            }
                        }
                        continue;
                    }
               info.Questions = Questions;
               res.render(`${__dirname}/public/verif.twig`, {user: req.session.nanSecondeGen, info:info});
            }
            else{
                    res.redirect('/profil');

                }
            }
        else{
            res.redirect('/login');
        }

    });
    app.get('/Admin', async (req, res)=>{
        if(req.session.nanSecondeGen){
            if(req.session.nanSecondeGen.level === 1 || req.session.nanSecondeGen.level === 2){
                let info = {}
            res.render(`${__dirname}/public/inde.twig`, {user: req.session.nanSecondeGen, info:info});
        
            }
            else res.redirect('/');
        }
        else res.redirect('/login')
    });

    app.get('/logout', async (req, res)=>{
        if(req.session.nanSecondeGen){
            compo.splice(compo[isExist(compo, req.session.nanSecondeGen)], 1);
            console.log(compo);
            req.session.destroy((err) =>{
                console.log(`DESTRUCTION D'UNE SESSION ${err}`)
            })
            res.redirect('/login');
        }
        else res.redirect('/login')
    });
    

    app.use('*', async (req, res)=>{
        if(req.session.nanSecondeGen){
            res.render(`${__dirname}/public/404.twig`, {user: req.session.nanSecondeGen});
        }
        else res.redirect('/login')
    });


















    //Initialisation de mes socket
    io.on('connection', (socket)=>{
        socket.on('Connect', (data)=>{
            console.log(data);
            let mail = data.substring(0, data.indexOf(':'));
            let pass = data.substring(data.indexOf(':')+ 1, data.length);
            console.log(mail + '\n' + pass)
            socket.emit('vasy',{e:mail, k:pass});
        })
        socket.on('login', async (data) => {
            if(compo[isExist(compo, data)].totalActuel === compo[isExist(compo, data)].totalTimes){
                let useers = {};
            useers.emailcrypt = data;
            global.sliderInterval.push(useers);
            global.sliderInterval[isExist(global.sliderInterval, data)].begin = setInterval( async ()=>{
                    if(compo[isExist(compo, data)].timesQues > 0 && compo[isExist(compo, data)].totalActuel >= 0){
                        compo[isExist(compo, data)].timesQues -= 1;
                        compo[isExist(compo, data)].totalActuel -= 1;
                        compo[isExist(compo, data)].VraiTimes -= 1;
                        socket.emit('fluor', compo[isExist(compo, data)].timesQues)
                    }
                    else if(compo[isExist(compo, data)].timesQues <= 0 && compo[isExist(compo, data)].totalActuel > 0){
                        const stu = await User.getStudentID(data);
                        let idRes = null;
                        for(let i in compo[isExist(compo, data)].Ques[compo[isExist(compo, data)].niveauActuel].responses){
                            if(compo[isExist(compo, data)].Ques[compo[isExist(compo, data)].niveauActuel].responses[i].choice === 1){
                                idRes = compo[isExist(compo, data)].Ques[compo[isExist(compo, data)].niveauActuel].responses[i].id;
                            }
                            continue;
                        }
                        (idRes !== null) ? await User.setEnter(compo[isExist(compo, data)].Ques[compo[isExist(compo, data)].niveauActuel].id, idRes, stu.id) : await User.setEnterNull(compo[isExist(compo, data)].Ques[compo[isExist(compo, data)].niveauActuel].id, stu.id) 
                        compo[isExist(compo, data)].timesQues = compo[isExist(compo, data)].timesPerQuestion;
                        compo[isExist(compo, data)].niveauActuel = (compo[isExist(compo, data)].niveauActuel < compo[isExist(compo, data)].niveauTotal - 1) ? compo[isExist(compo, data)].niveauActuel + 1 : compo[isExist(compo, data)].niveauActuel
                        socket.emit('new', compo[isExist(compo, data)])
                    }
                    else {
                        const stu = await User.getStudentID(data);
                        const moy = await User.getVerifNote(compo[isExist(compo, data)].sousQuiz, stu.id);
                        if(!isErr(moy)){
                            socket.emit('bblank');
                        clearInterval(global.sliderInterval[isExist(global.sliderInterval, data)].begin);
                        }
                        else{
                            const stu = await User.getStudentID(data);
                        let idRes = null;
                        for(let i in compo[isExist(compo, data)].Ques[compo[isExist(compo, data)].niveauActuel].responses){
                            if(compo[isExist(compo, data)].Ques[compo[isExist(compo, data)].niveauActuel].responses[i].choice === 1){
                                idRes = compo[isExist(compo, data)].Ques[compo[isExist(compo, data)].niveauActuel].responses[i].id;
                            }
                            continue;
                        }
                        (idRes !== null) ? await User.setEnter(compo[isExist(compo, data)].Ques[compo[isExist(compo, data)].niveauActuel].id, idRes, stu.id) : await User.setEnterNull(compo[isExist(compo, data)].Ques[compo[isExist(compo, data)].niveauActuel].id, stu.id)
                        let erreur = 0;
                let note = 0;
                let trouve = 0;
                for(let i in compo[isExist(compo, data)].Ques){
                    const respo = await User.getResponseForComparate(compo[isExist(compo, data)].Ques[i].id, stu.id)
                    const tcheck = await User.getResponseFullComparate(respo.response_id);
                    if(!isErr(tcheck) && respo.response_id !== null){
                        trouve =  trouve + 1;
                        note += (100 / compo[isExist(compo, data)].niveauTotal);
                        console.log('Note augmente' + note)
                    }
                    else if(isErr(tcheck) && respo.response_id !== null){
                        erreur = erreur + 1;
                        /*if(note !== 0){
                            note -= (100 / compo[isExist(compo, data)].niveauTotal);
                        }*/
                        console.log('Note diminue' + note)
                    }
                    else{
                        note = note;
                    }
                    continue;
                }
                const moy = await User.getSousCategorie(compo[isExist(compo, data)].sousQuiz)
                const etat = (note >= moy.moyen) ? 1 : 0;
                let time =  compo[isExist(compo, data)].totalTimes - compo[isExist(compo, data)].VraiTimes;
                const intent = await User.setNote(compo[isExist(compo, data)].sousQuiz, stu.id, note, erreur, time, etat, trouve);

                        socket.emit('bblank');
                        clearInterval(global.sliderInterval[isExist(global.sliderInterval, data)].begin);
                    }
                    }
                }, 1000);
            }
            else{
                clearInterval(global.sliderInterval[isExist(global.sliderInterval, data)].begin);
                global.sliderInterval[isExist(global.sliderInterval, data)].begin = setInterval( async ()=>{
                    if(compo[isExist(compo, data)].timesQues > 0 && compo[isExist(compo, data)].totalActuel >= 0){
                        compo[isExist(compo, data)].timesQues -= 2;
                        compo[isExist(compo, data)].totalActuel -= 2;
                        compo[isExist(compo, data)].VraiTimes -= 2;
                        socket.emit('fluor', compo[isExist(compo, data)].timesQues)
                    }
                    else if(compo[isExist(compo, data)].timesQues <= 0 && compo[isExist(compo, data)].totalActuel > 0){
                        const stu = await User.getStudentID(data);
                        let idRes = null;
                        for(let i in compo[isExist(compo, data)].Ques[compo[isExist(compo, data)].niveauActuel].responses){
                            if(compo[isExist(compo, data)].Ques[compo[isExist(compo, data)].niveauActuel].responses[i].choice === 1){
                                idRes = compo[isExist(compo, data)].Ques[compo[isExist(compo, data)].niveauActuel].responses[i].id;
                            }
                            continue;
                        }
                        (idRes !== null) ? await User.setEnter(compo[isExist(compo, data)].Ques[compo[isExist(compo, data)].niveauActuel].id, idRes, stu.id) : await User.setEnterNull(compo[isExist(compo, data)].Ques[compo[isExist(compo, data)].niveauActuel].id, stu.id) 
                        compo[isExist(compo, data)].timesQues = compo[isExist(compo, data)].timesPerQuestion;
                        compo[isExist(compo, data)].niveauActuel = (compo[isExist(compo, data)].niveauActuel < compo[isExist(compo, data)].niveauTotal - 1) ? compo[isExist(compo, data)].niveauActuel + 1 : compo[isExist(compo, data)].niveauActuel
                        socket.emit('new', compo[isExist(compo, data)])
                    }
                    else {
                        const stu = await User.getStudentID(data);
                        const moy = await User.getVerifNote(compo[isExist(compo, data)].sousQuiz, stu.id);
                        if(!isErr(moy)){
                            socket.emit('bblank');
                        clearInterval(global.sliderInterval[isExist(global.sliderInterval, data)].begin);
                        }
                        else{
                            const stu = await User.getStudentID(data);
                        let idRes = null;
                        for(let i in compo[isExist(compo, data)].Ques[compo[isExist(compo, data)].niveauActuel].responses){
                            if(compo[isExist(compo, data)].Ques[compo[isExist(compo, data)].niveauActuel].responses[i].choice === 1){
                                idRes = compo[isExist(compo, data)].Ques[compo[isExist(compo, data)].niveauActuel].responses[i].id;
                            }
                            continue;
                        }
                        (idRes !== null) ? await User.setEnter(compo[isExist(compo, data)].Ques[compo[isExist(compo, data)].niveauActuel].id, idRes, stu.id) : await User.setEnterNull(compo[isExist(compo, data)].Ques[compo[isExist(compo, data)].niveauActuel].id, stu.id)
                        let erreur = 0;
                let note = 0;
                let trouve = 0;
                for(let i in compo[isExist(compo, data)].Ques){
                    const respo = await User.getResponseForComparate(compo[isExist(compo, data)].Ques[i].id, stu.id)
                    const tcheck = await User.getResponseFullComparate(respo.response_id);
                    if(!isErr(tcheck) && respo.response_id !== null){
                        trouve =  trouve + 1;
                        note += (100 / compo[isExist(compo, data)].niveauTotal);
                                                console.log('Note aug' + note)

                    }
                    else if(isErr(tcheck) && respo.response_id !== null){
                        erreur = erreur + 1;
                        /*if(note !== 0){
                            note -= (100 / compo[isExist(compo, data)].niveauTotal);
                        }*/
                                                console.log('Note diminue' + note)

                    }
                    else{
                        note = note;
                    }
                    continue;
                }
                const moy = await User.getSousCategorie(compo[isExist(compo, data)].sousQuiz)
                const etat = (note >= moy.moyen) ? 1 : 0;
                let time =  compo[isExist(compo, data)].totalTimes - compo[isExist(compo, data)].VraiTimes;
                const intent = await User.setNote(compo[isExist(compo, data)].sousQuiz, stu.id, note, erreur, time, etat, trouve);
                        
                        socket.emit('bblank');
                        clearInterval(global.sliderInterval[isExist(global.sliderInterval, data)].begin);
                        }
                    }
                }, 1000);
            }
        });
        socket.on('ch', async (data)=>{
            for(let i in compo[isExist(compo, data.del)].Ques[compo[isExist(compo, data.del)].niveauActuel].responses){
                if(data.pel == compo[isExist(compo, data.del)].Ques[compo[isExist(compo, data.del)].niveauActuel].responses[i].crypt){
                    compo[isExist(compo, data.del)].Ques[compo[isExist(compo, data.del)].niveauActuel].responses[i].choice = 1;
                }
                else{
                    compo[isExist(compo, data.del)].Ques[compo[isExist(compo, data.del)].niveauActuel].responses[i].choice = 0;
                }
                continue;
            }
        })
        socket.on('newAdverse', async (data)=>{
                let info = {}
                let name = new Array();
                let note = new Array();
                const stud = await User.getNoteUsers(data);
                const med = await User.getMoyOfQuizBySousquizId(data)
                for(let i in stud){
                    name.push(stud[i].pseudo);
                    note.push(stud[i].note);
                    continue;
                }
                info.name = name;
                info.gl  = med.ele;
                info.gl = info.gl*100;         
                info.gl = Math.round(info.gl); 
                info.gl = info.gl/100;   
                info.note = note;
                info.cal = data;
                io.emit('resNes', info);
        })
        socket.on('levUp', async (data)=>{
            const ress = await User.getResponseIDQuestionId(data.pel);
            const stu = await User.getStudentID(data.del);
            if(!isErr(ress) && !isErr(stu) && ress !== undefined){
                const enter = await User.setEnter(compo[isExist(compo, data.del)].Ques[compo[isExist(compo, data.del)].niveauActuel].id,ress.id,stu.id);
                if(!isErr(enter)){
                    if(compo[isExist(compo, data.del)].niveauActuel < compo[isExist(compo, data.del)].niveauTotal - 1){
                        compo[isExist(compo, data.del)].niveauActuel++;
                        compo[isExist(compo, data.del)].totalActuel -= compo[isExist(compo, data.del)].timesQues;
                        compo[isExist(compo, data.del)].timesQues = compo[isExist(compo, data.del)].timesPerQuestion;
                        socket.emit('new', compo[isExist(compo, data.del)])
                    }
                    else{
                        let erreur = 0;
                let note = 0;
                let trouve = 0;
                for(let i in compo[isExist(compo, data.del)].Ques){
                    const respo = await User.getResponseForComparate(compo[isExist(compo, data.del)].Ques[i].id, stu.id)
                    const tcheck = await User.getResponseFullComparate(respo.response_id);
                    if(!isErr(tcheck) && respo.response_id !== null){
                        trouve =  trouve + 1;
                        note += (100 / compo[isExist(compo, data.del)].niveauTotal);
                                                console.log('Note aug' + note)

                    }
                    else if(isErr(tcheck) && respo.response_id !== null){
                        erreur = erreur + 1;
                        /*if(note !== 0){

                            note -= (100 / compo[isExist(compo, data.del)].niveauTotal);
                        }*/
                                                console.log('Note diminue' + note)

                    }
                    else{
                        note = note;
                    }
                    continue;
                }
                const moy = await User.getSousCategorie(compo[isExist(compo, data.del)].sousQuiz)
                const etat = (note >= moy.moyen) ? 1 : 0;
                let time =  compo[isExist(compo, data.del)].totalTimes - compo[isExist(compo, data.del)].VraiTimes;
                const intent = await User.setNote(compo[isExist(compo, data.del)].sousQuiz, stu.id, note, erreur, time, etat, trouve);
                        socket.emit('bblank');
                    }
                }
            }
            else{
                const enter = await User.setEnterNull(compo[isExist(compo, data.del)].Ques[compo[isExist(compo, data.del)].niveauActuel].id,stu.id);
                if(!isErr(enter)){
                    if(compo[isExist(compo, data.del)].niveauActuel < compo[isExist(compo, data.del)].niveauTotal - 1){
                        compo[isExist(compo, data.del)].niveauActuel++;
                        compo[isExist(compo, data.del)].totalActuel -= compo[isExist(compo, data.del)].timesQues;
                        compo[isExist(compo, data.del)].timesQues = compo[isExist(compo, data.del)].timesPerQuestion;
                        socket.emit('new', compo[isExist(compo, data.del)])
                    }
                    else{
                        let erreur = 0;
                let note = 0;
                let trouve = 0;
                for(let i in compo[isExist(compo, data.del)].Ques){
                    const respo = await User.getResponseForComparate(compo[isExist(compo, data.del)].Ques[i].id, stu.id)
                    const tcheck = await User.getResponseFullComparate(respo.response_id);
                    if(!isErr(tcheck) && respo.response_id !== null){
                        trouve =  trouve + 1;
                        note += (100 / compo[isExist(compo, data.del)].niveauTotal);
                                                console.log('Note aug' + note)

                    }
                    else if(isErr(tcheck) && respo.response_id !== null){
                        erreur = erreur + 1;
                        /*if(note !== 0){
                            note -= (100 / compo[isExist(compo, data.del)].niveauTotal);
                        }*/
                                                console.log('Note diminue' + note)

                    }
                    else{
                        note = note;
                    }
                    continue;
                }
                const moy = await User.getSousCategorie(compo[isExist(compo, data.del)].sousQuiz)
                const etat = (note >= moy.moyen) ? 1 : 0;
                let time =  compo[isExist(compo, data.del)].totalTimes - compo[isExist(compo, data.del)].VraiTimes;
                const intent = await User.setNote(compo[isExist(compo, data.del)].sousQuiz, stu.id, note, erreur, time, etat, trouve);
                        socket.emit('bblank');
                    }
                }
            }
        });
        });


    https.listen(config.port);
}).catch((error) =>{console.log(error.message)});