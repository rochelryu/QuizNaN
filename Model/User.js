let db, config;
const ent = require('ent');
let fsx = require('fs');


module.exports = (_db, _config) =>{
    db = _db;
    config = _config;
    return User;
}

let User = class {
    static userExist(_login, _password) {
        return new Promise((next) => {
            db.query("SELECT id FROM student WHERE (email = ? OR pseudo = ?) AND pass = ?", [_login, _login, _password])
                .then((result) => {
                    if (result[0] !== undefined) {
                        db.query("UPDATE student SET login = NOW() WHERE student.id = ?", [parseInt(result[0].id, 10)])
                            .then((results) => {
                                db.query("SELECT * FROM student WHERE id = ?", [parseInt(result[0].id, 10)])
                                    .then((result) => {
                                        next(result[0]);
                                    }).catch((error) => {
                                    next(error)
                                })
                            }).catch((error) => {
                            next(error)
                        });
                    }
                    else {
                        next(new Error("Identification echoué Veuillez Recommencer"))
                    }
                }).catch((err) => {
                next(new Error("Erreur"))
            })
        })
    }

    static getQuiZOnline(){
        return new Promise((next) =>{
            db.query("SELECT * FROM quiz WHERE status = 1")
                .then((result) =>{
                    next(result);
                }).catch((error) => {
                next(error);
            });
        })
    }

    static getAllQuizFromProfil(){
        return new Promise((next) =>{
            db.query("SELECT COUNT(id) as sous FROM souscateg")
                .then((result) =>{
                    next(result[0]);
                }).catch((error) => {
                next(error);
            });
        })
    }

    static getAllQuizByStudent(stud){
        return new Promise((next) =>{
            db.query("SELECT * FROM moyenne LEFT JOIN souscateg ON moyenne.souscategorie_id = souscateg.id WHERE moyenne.student_id = ? ORDER BY moyenne.id DESC", [parseInt(stud, 10)])
                .then((result) =>{
                    next(result);
                }).catch((error) => {
                next(error);
            });
        })
    }

    static getMoyOfQuizBySousquizId(catId){
        return new Promise((next) =>{
            db.query("SELECT AVG(note) ele FROM moyenne WHERE souscategorie_id = ?", [parseInt(catId, 10)])
                .then((result) =>{
                    next(result[0]);
                }).catch((error) => {
                next(error);
            });
        })
    }

    static getNoteUsers(sousCat){
        return new Promise((next) =>{
            db.query("SELECT moyenne.note, student.pseudo FROM moyenne LEFT JOIN student ON moyenne.student_id = student.id WHERE moyenne.souscategorie_id = ? ORDER BY moyenne.note DESC", [parseInt(sousCat, 10)])
                .then((result) =>{
                    next(result);
                }).catch((error) => {
                next(error);
            });
        })
    }

    static getSousCategorieBy(quizId){
        return new Promise((next) =>{
            db.query("SELECT * FROM souscateg WHERE quizNaN_id = ? ORDER BY end ASC", [parseInt(quizId, 10)])
                .then((result) =>{
                    next(result);
                }).catch((error) => {
                next(error);
            });
        })
    }
    static getSousCategorie(catId){
        return new Promise((next) =>{
            db.query("SELECT * FROM souscateg WHERE id = ? ", [parseInt(catId, 10)])
                .then((result) =>{
                    next(result[0]);
                }).catch((error) => {
                next(error);
            });
        })
    }

    static getQuestionBySousCategorieId(cateID){
        return new Promise((next) => {
            db.query("SELECT * FROM question WHERE SousCate = ?", [parseInt(cateID, 10)])
                .then((result) =>{
                    next(result);
                }).catch((error) => {
                next(error);
            });
        })
    }

    static getResponseByQuestionId(QuestId){
        return new Promise((next) =>{
            db.query("SELECT id,content,files,crypt, ele FROM response WHERE question_Id = ?", [parseInt(QuestId, 10)])
                .then((result) =>{
                    next(result);
                }).catch((error) => {
                next(error);
            });
        })
    }

    static getResponseIDQuestionId(QuestId){
        return new Promise((next) =>{
            db.query("SELECT id FROM response WHERE crypt = ?", [QuestId])
                .then((result) =>{
                    next(result[0]);
                }).catch((error) => {
                next(error);
            });
        })
    }

    static getQuestionID(QuestCrypt){
        return new Promise((next) =>{
            db.query("SELECT id FROM question WHERE crypt = ?", [QuestCrypt])
                .then((result) =>{
                    next(result);
                }).catch((error) => {
                next(error);
            });
        })
    }

    static getStudentID(QuestCrypt){
        return new Promise((next) =>{
            db.query("SELECT id FROM student WHERE emailcrypt = ?", [QuestCrypt])
                .then((result) =>{
                    next(result[0]);
                }).catch((error) => {
                next(error);
            });
        })
    }


    static getQuiz(crypt){
        return new Promise((next)=>{
            db.query("SELECT * FROM quiz WHERE encrypt = ?", [crypt])
                .then((result)=>{
                    if (result[0] != undefined){
                        next(result[0]);
                    }
                    else{
                        next(new Error('Aucun user TRouvé'))
                    }
                })
                .catch((err)=>{
                    next(err);
                })
        })
    }
    static getSousQuiz(crypt){
        return new Promise((next)=>{
            db.query("SELECT * FROM souscateg WHERE crypt = ?", [crypt])
                .then((result)=>{
                    if (result[0] != undefined){
                        next(result[0]);
                    }
                    else{
                        next(new Error('Aucun user TRouvé'))
                    }
                })
                .catch((err)=>{
                    next(err);
                })
        })
    }

    static setUserConversation(emailcrypt, emailcrypt2,message){
        return new Promise((next)=>{
            db.query("SELECT id FROM user WHERE emailcrypt = ?", [emailcrypt])
                .then((result)=>{
                    if (result[0] != undefined){
                        const user1 = result[0].id;
                        db.query("SELECT id FROM user WHERE emailcrypt = ?", [emailcrypt2])
                            .then((results)=>{
                                if (results[0] != undefined){
                                    const user2 = results[0].id;
                                    db.query("INSERT INTO conversation_parent (user_prim_id, user_sec_id,content) VALUES (?,?,?)", [parseInt(user1, 10), parseInt(user2, 10), messages])
                                        .then((resultss)=>{
                                            next(resultss);
                                        })
                                        .catch((err)=>{
                                            next(err);
                                        })
                                }
                                else{
                                    next(new Error('Aucun user TRouvé'))
                                }
                            })
                            .catch((err)=>{
                                next(err);
                            })
                    }
                    else{
                        next(new Error('Aucun user TRouvé'))
                    }
                })
                .catch((err)=>{
                    next(err);
                })
        })
    }


    static delUserFollowing(emailcrypt, emailcrypt2){
        return new Promise((next)=>{
            db.query("SELECT id FROM user WHERE emailcrypt = ?", [emailcrypt])
                .then((result)=>{
                    if (result[0] != undefined){
                        const user1 = result[0].id;
                        db.query("SELECT id FROM user WHERE emailcrypt = ?", [emailcrypt2])
                            .then((results)=>{
                                if (results[0] != undefined){
                                    const user2 = results[0].id;
                                    db.query("DELETE FROM follow_user WHERE (user_prim_id = ? AND user_sec_id = ?) OR (user_prim_id = ? AND user_sec_id = ?) ", [parseInt(user1, 10), parseInt(user2, 10), parseInt(user2, 10), parseInt(user1, 10)])
                                        .then((resultss)=>{
                                            next(resultss);
                                        })
                                        .catch((err)=>{
                                            next(err);
                                        })
                                }
                                else{
                                    next(new Error('Aucun user TRouvé'))
                                }
                            })
                            .catch((err)=>{
                                next(err);
                            })
                    }
                    else{
                        next(new Error('Aucun user TRouvé'))
                    }
                })
                .catch((err)=>{
                    next(err);
                })
        })
    }

    static setEnter(quesId, res_id, student_Id){
        return new Promise((next)=>{
            db.query("SELECT * FROM entrer WHERE student_id = ? AND question_id = ?", [parseInt(student_Id, 10), parseInt(quesId, 10)])
            .then((result)=>{
                if(result[0] !== undefined){
                    db.query("UPDATE entrer SET response_id = ?  WHERE student_id = ? AND question_id = ?", [parseInt(res_id, 10), parseInt(student_Id, 10), parseInt(quesId, 10)])
                    .then((results)=>{
                        console.log('jai update')
                        next(results)
                    }).catch((err)=>{ 
                        console.log(err)
                        next(err)})
                }
                else{
                    db.query("INSERT INTO entrer (response_id,student_id,question_id) VALUES (?,?,?)", [parseInt(res_id, 10), parseInt(student_Id, 10), parseInt(quesId, 10)])
                    .then((resultss)=>{
                        console.log('jai update')
                        next(resultss)
                    }).catch((errs)=>{
                        console.log(errs)
                        next(errs)})
                }
            }).catch((error)=>{
                next(error);
            })
        })
    }


    static setEnterNull(quesId, student_Id){
        return new Promise((next)=>{
            db.query("SELECT * FROM entrer WHERE student_id = ? AND question_id = ?", [parseInt(student_Id, 10), parseInt(quesId, 10)])
            .then((result)=>{
                if(result[0] !== undefined){
                    db.query("UPDATE entrer SET response_id = null  WHERE student_id = ? AND question_id = ?", [parseInt(student_Id, 10), parseInt(quesId, 10)])
                    .then((results)=>{
                        console.log('jai update');
                        next(results)
                    }).catch((err)=>{ 
                        console.log(err)
                        next(err)})
                }
                else{
                    db.query("INSERT INTO entrer (student_id,question_id) VALUES (?,?)", [parseInt(student_Id, 10), parseInt(quesId, 10)])
                    .then((resultss)=>{
                        console.log('jai insert');
                        next(resultss[0])
                    }).catch((errs)=>{
                        console.log(errs)
                        next(errs)})
                }
            }).catch((error)=>{
                next(error);
            })
        })
    }
    static getRanking(){
        return new Promise((next)=>{
            db.query('SELECT AVG(moyenne.note) moy, student.pseudo FROM moyenne LEFT JOIN student ON moyenne.student_id = student.id GROUP BY moyenne.student_id ORDER BY moy DESC')
            .then((ress)=>{
                next(ress);
            }).catch((err)=> next(err))
        })
    }

    static setNote(souscateg, student_Id, note, erro, times, etat, trouve){
        return new Promise((next)=>{
            db.query("SELECT * FROM moyenne WHERE  souscategorie_id = ? AND student_id = ?", [parseInt(souscateg, 10), parseInt(student_Id, 10)])
            .then((ress)=>{
                if(ress[0] !== undefined){
                    db.query("UPDATE moyenne SET souscategorie_id = ?, student_id = ?, note = ?, errors = ?, time = ?, etat = ?, trouve = ? WHERE souscategorie_id = ? AND student_id = ?", [parseInt(souscateg, 10), parseInt(student_Id, 10), note, parseInt(erro, 10), parseInt(times, 10), parseInt(etat, 10), parseInt(trouve, 10), parseInt(souscateg, 10), parseInt(student_Id, 10)])
                        .then((results)=>{
                            next(results[0]);
                        }).catch((errs)=>{
                            next(errs);
                        })
                }
                else{
                    db.query("INSERT INTO moyenne (souscategorie_id, student_id, note, errors, time, etat, trouve) VALUES (?,?,?,?,?,?,?)", [parseInt(souscateg, 10), parseInt(student_Id, 10), note, parseInt(erro, 10), parseInt(times, 10), parseInt(etat, 10), parseInt(trouve, 10)])
                        .then((result)=>{
                            next(result[0]);
                        }).catch((err)=>{
                            next(err);
                        })
                }
            }).catch((errors)=>{next(errors)})
        })
    }

    static getTwoLastRecommandation(emailcrypt){
        return new Promise((next)=>{
            db.query("SELECT id FROM user WHERE emailcrypt = ?", [emailcrypt])
                .then((result)=>{
                    if (result[0] != undefined){
                        db.query("SELECT recommandation.content, recommandation.register_date as register, CONCAT(user.name, ' ', user.firstname) nom, user.emailcrypt, user.profil, user.profession, role_user.name FROM recommandation LEFT JOIN user ON recommandation.userC_id = user.id LEFT JOIN role_user ON user.range_id = role_user.id WHERE recommandation.userV_id = ?  ORDER BY recommandation.id DESC LIMIT 2", [parseInt(result[0].id)])
                            .then((results)=>{
                                for(let i in results){
                                    results[i].content = ent.decode(results[i].content);
                                    continue;
                                }
                                next(results);
                            })
                            .catch((err)=>{
                                next(err);
                            })
                    }
                    else{
                        next(new Error('Aucun user TRouvé'))
                    }
                })
                .catch((err)=>{
                    next(err);
                })
        })
    }
    static getUserByEmail(email){
        return new Promise((next) =>{
            db.query("SELECT id,emailcrypt, keyconfirm, CONCAT(name, ' ' , firstname) as nom, profil, biblio, register_date, lieu, sexe FROM user WHERE emailcrypt = ? ", [email])
                .then((result)=>{
                    if (result[0] !== undefined){
                        next(result[0])
                    }
                    else {
                        next(new Error("Invalid Email"))
                    }
                }).catch((error) =>{
                next(error)
            })
        });
    }

    static setUser(element, range, confirm){
        return new Promise((next) =>{
            db.query("SELECT * FROM user WHERE email = ?", [element.email])
                .then((result)=>{
                    if (result[0] !== undefined){
                        req.session.errors = [{msg: "CET EMAIL EXISTE DEJA"}];
                        console.log("EMAIL ALREADY")
                        next(new Error("EMAIL ALREADY"))
                    }
                    else {
                        db.query("INSERT INTO user (firstname, name, email, password, sexe, keyconfirm, profil,age, emailcrypt, lieu, birth_day, range_id, login_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?, NOW())", [element.firstname, element.name, element.email, element.passS, element.sexe, parseInt(confirm, 10), element.profil, parseInt(element.age, 10), element.emaycrypt, element.local, element.birth, range])
                            .then((result) =>{
                                db.query("SELECT * FROM user WHERE email = ?", [element.email])
                                    .then((result)=> {
                                        next(result[0]);
                                    }).catch((error) => {
                                    next(error)
                                })
                            })
                            .catch((error)=>{
                                console.log("LES DONNEES SONT MAL TYPEE:" + error)
                                next(error)})
                    }
                }).catch((error) =>{
                console.log("JE N'ARRIVE MEME PAS A VERIFIER L'UNICITE DU MAIL"+ error)
                next(error.message)})
        })
    }
    static getAllAbonnéByUserEmailCrypt(emailcrypt){
        return new Promise((next)=>{
                db.query("SELECT id FROM user WHERE emailcrypt = ?", [emailcrypt])
                    .then((result)=>{
                        if (result[0] != undefined){
                            db.query("SELECT COUNT(id) follow FROM follow_user WHERE (user_prim_id = ? OR user_sec_id = ?) AND statut_id = 4", [parseInt(result[0].id, 10), parseInt(result[0].id, 10)])
                                .then((results)=>{
                                    next(results[0]);
                                })
                                .catch((err)=>{
                                    next(err);
                                })
                        }
                        else{
                            next(new Error('Aucun user TRouvé'))
                        }
                    })
                    .catch((err)=>{
                        next(err);
                    })
            }
        )
    }

    static getAllREcommandationCount(emailcrypt){
        return new Promise((next)=>{
                db.query("SELECT id FROM user WHERE emailcrypt = ?", [emailcrypt])
                    .then((result)=>{
                        if (result[0] != undefined){
                            db.query("SELECT COUNT(DISTINCT recommandation.userC_id) recom FROM recommandation WHERE userV_id = ?", [parseInt(result[0].id, 10)])
                                .then((results)=>{
                                    next(results[0]);
                                })
                                .catch((err)=>{
                                    next(err);
                                })
                        }
                        else{
                            next(new Error('Aucun user TRouvé'))
                        }
                    })
                    .catch((err)=>{
                        next(err);
                    })
            }
        )
    }

    //Of GROUPE CONCERNE

    static getAllGroupByUserEmailCrypt(emailcrypt){
        return new Promise((next)=>{
                db.query("SELECT id FROM user WHERE emailcrypt = ?", [emailcrypt])
                    .then((result)=>{
                        if (result[0] != undefined){
                            db.query("SELECT COUNT(id) follow FROM follow_group WHERE user_id = ? AND statut_id = 4", [parseInt(result[0].id, 10)])
                                .then((results)=>{
                                    next(results[0]);
                                })
                                .catch((err)=>{
                                    next(err);
                                })
                        }
                        else{
                            next(new Error('Aucun Groupe TRouvé'))
                        }
                    })
                    .catch((err)=>{
                        next(err);
                    })
            }
        )
    }


    //Of Publication User
    static getAllPublicationByUserEmailCrypt(emailcrypt, beg, end){
        return new Promise((next)=>{
                db.query("SELECT id FROM user WHERE emailcrypt = ?", [emailcrypt])
                    .then((result)=>{
                        if (result[0] != undefined){
                            db.query("SELECT * FROM publication WHERE user_id = ? ORDER BY id DESC LIMIT ?,?", [parseInt(result[0].id, 10), parseInt(beg,10), parseInt(end, 10)])
                                .then((results)=>{
                                    for(let i in results){
                                        results[i].content_text = ent.decode(results[i].content_text);
                                        continue;
                                    }
                                    next(results);
                                })
                                .catch((err)=>{
                                    next(err);
                                })
                        }
                        else{
                            next(new Error('Aucun user TRouvé'))
                        }
                    })
                    .catch((err)=>{
                        next(err);
                    })
            }
        )
    }

    static getAllGalleryByUserEmailCrypt(emailcrypt){
        return new Promise((next)=>{
                db.query("SELECT id FROM user WHERE emailcrypt = ?", [emailcrypt])
                    .then((result)=>{
                        if (result[0] != undefined){
                            db.query("SELECT * FROM publication WHERE user_id = ? ORDER BY id DESC", [parseInt(result[0].id, 10)])
                                .then((results)=>{
                                    for(let i in results){
                                        results[i].content_text = ent.decode(results[i].content_text);
                                        results[i].content_text = results[i].content_text.substring(0,50) + "...";
                                        continue;
                                    }
                                    next(results);
                                })
                                .catch((err)=>{
                                    next(err);
                                })
                        }
                        else{
                            next(new Error('Aucun user TRouvé'))
                        }
                    })
                    .catch((err)=>{
                        next(err);
                    })
            }
        )
    }

    static getBestThreeStudent(sous){
        return new Promise((next) =>{
            db.query("SELECT moyenne.note, student.pseudo FROM moyenne LEFT JOIN student ON moyenne.student_id = student.id WHERE moyenne.souscategorie_id = ? ORDER BY moyenne.note DESC LIMIT 3", [parseInt(sous, 10)])
                .then((result) =>{
                    next(result);
                }).catch((error) => {
                next(error);
            });
        })
    }

    static getResponseForComparate(question_Id, student_Id){
        return new Promise((next) =>{
            db.query("SELECT response_id FROM entrer WHERE question_id = ? AND student_id = ?", [parseInt(question_Id, 10), parseInt(student_Id, 10)])
                .then((result) =>{
                    next(result[0]);
                }).catch((error) => {
                    console.log(error)
                next(error);
            });
        })
    }

    static getVerifNote(sousCate_Id, student_Id){
        return new Promise((next) =>{
            db.query("SELECT * FROM moyenne LEFT JOIN souscateg ON moyenne.souscategorie_id = souscateg.id LEFT JOIN student ON moyenne.student_id = student.id   WHERE  moyenne.souscategorie_id = ? AND moyenne.student_id = ?", [parseInt(sousCate_Id, 10), parseInt(student_Id, 10)])
                .then((result) =>{
                    if(result[0] !== undefined){
                        next(result[0]);
                    }
                    else{
                        next(new Error('Aucune Note Attribué'));
                    }
                }).catch((error) => {
                    console.log(error)
                next(error);
            });
        })
    }

    static getResponseFullComparate(response_id){
        return new Promise((next) =>{
            db.query("SELECT id FROM response WHERE id = ? AND ele = 1", [parseInt(response_id, 10)])
                .then((result) =>{
                    if(result[0] !== undefined){
                        next(result[0]);
                    }
                    else{
                        console.log('Mauvaise Reponse')
                        next(new Error('Mauvaise Reponse'))
                    }
                }).catch((error) => {
                next(error);
            });
        })
    }

    //Of comment FROM PUBLICATION OR OTHER

    static getAllCommentByPublicationId(publication_id) {
        return new Promise((next) => {
            db.query("SELECT comment.id as id,comment.content_text as contentComment,comment.file1 as fileComment, comment.register_date as dates, CONCAT(user.name, ' ', user.firstname) as nomComment, user.emailcrypt as emailComment, user.profil as profilComment, role_user.name as promotion_nameComment FROM comment LEFT JOIN user ON comment.user_id = user.id LEFT JOIN role_user ON user.range_id = role_user.id WHERE comment.publication_id = ? ORDER BY id DESC", [parseInt(publication_id, 10)])
                .then((results)=>{
                    for(let i in results){
                        results[i].contentComment = ent.decode(results[i].contentComment);
                        continue;
                    }
                    next(results);
                }).catch((error) => next(error));
        })
    }
    static getOneCommentByPublication(publication_id) {
        return new Promise((next) => {
            db.query("SELECT rs_comment.id as id,rs_comment.content_text as contentComment, rs_comment.publication_id as pub, rs_comment.register_date as date, CONCAT(rs_student.name, ' ', rs_student.firstname) as nomComment, rs_student.email as emailComment, rs_student.emailcryp as emailcrypComment, rs_student.profil as profilComment, rs_student.email as email, rs_promotion.name as promotion_nameComment FROM rs_comment LEFT JOIN rs_student ON rs_comment.student_id = rs_student.id LEFT JOIN rs_promotion ON rs_student.promotion_id = rs_promotion.id WHERE rs_comment.publication_id = ? ORDER BY id DESC LIMIT 1", [parseInt(publication_id, 10)])
                .then((result)=>{
                    next(result);
                }).catch((error) => next(error));
        })
    }
    static getInfoUserLike(emailcrypt, publication_id) {
        return new Promise((next) => {
            db.query("SELECT id FROM user WHERE emailcrypt = ?", [emailcrypt])
                .then((result)=>{
                    db.query("SELECT COUNT(id) as isLike FROM nbre_like WHERE users_id = ? AND publication_id = ?", [parseInt(result[0].id, 10), parseInt(publication_id, 10)])
                        .then((results)=>{
                            next(results[0]);
                        }).catch((error) => next(error));
                }).catch((err)=>{
                    next(err)
            });
        });
    }

    static getCountPublication(emailcrypt) {
        return new Promise((next) => {
            db.query("SELECT id FROM user WHERE emailcrypt = ?", [emailcrypt])
                .then((result)=>{
                    db.query("SELECT COUNT(id) as numbers FROM publication WHERE user_id = ?", [parseInt(result[0].id, 10)])
                        .then((results)=>{
                            next(results[0]);
                        }).catch((error) => next(error));
                }).catch((err)=>{
                next(err)
            });
        });
    }


    static getInfoUserDoute(emailcrypt, publication_id) {
        return new Promise((next) => {
            db.query("SELECT id FROM user WHERE emailcrypt = ?", [emailcrypt])
                .then((result)=>{
                    db.query("SELECT COUNT(id) as isDoute FROM nbre_doute WHERE user_id = ? AND publication_id = ?", [parseInt(result[0].id, 10), parseInt(publication_id, 10)])
                        .then((results)=>{
                            next(results[0]);
                        }).catch((error) => next(error));
                }).catch((err)=>{
                next(err)
            });
        });
    }
    static getNumberQuestion(souscategorieID) {
        return new Promise((next) => {
            db.query("SELECT COUNT(id) as NumberQ FROM question WHERE SousCate = ?", [parseInt(souscategorieID, 10)])
                .then((result)=>{
                    next(result[0]);
                }).catch((error) =>next(error));
        })
    }
    static getNumberDoute(publication_id) {
        return new Promise((next) => {
            db.query("SELECT COUNT(id) as NumberDoute FROM nbre_doute WHERE publication_id = ?", [parseInt(publication_id, 10)])
                .then((result)=>{
                    next(result[0]);
                }).catch((error) =>next(error));
        })
    }
    static getNumberComment(publication_id) {
        return new Promise((next) => {
            db.query("SELECT COUNT(id) as NumberComment FROM comment WHERE publication_id = ?", [parseInt(publication_id, 10)])
                .then((result)=>{
                    next(result[0]);
                }).catch((error) =>next(error));
        })
    }
}