var db = require('./dbConnection');
var bcrypt = require('bcrypt');
var loadingSpinner = require('loading-spinner');


module.exports = {
     doSignup:async(inputData)=>{
        const {username,email,password} = inputData;
        var password_encrypted = await bcrypt.hash(password,10)
        const sqlQuery = `INSERT INTO users(username,email,password) VALUES('${username}','${email}','${password_encrypted}') `
        return new Promise((resolve,reject)=>{
            const sqlQuery1 = `SELECT * FROM users WHERE email='${email}'`;
            db.query(sqlQuery1,(err,users)=>{
                if(users.length === 0){
                    db.query(sqlQuery, (err, results) => {
                            db.query(sqlQuery1, (err, user) => {
                            resolve(user[0])
                        })

                    })
                }else{
                    reject('Account already exists. Please Login')
                }
            })
            // 
            
        })
     },
     doLogin:(inputData)=>{
        const {email,password} = inputData;
       
        const sqlQuery = `SELECT * FROM users WHERE email='${email}'`
        return new Promise((resolve,reject)=>{
            db.query(sqlQuery,async(err,user)=>{
                
                user = user[0]
                if(user){
                    const status = await bcrypt.compare(password, user.password);    
                    if(status){
                        resolve(user)
                    }else{
                        reject('Incorrect password.')
                    }
                }else{
                    reject('Account does not exist.')
                }
            })
        })
     },
     addQuestion:(body)=>{
        //  console.log(body.questionText);
        const {questionText,userId,category} = body;
        const sqlQuery = `INSERT INTO questions(qn_text,user_id,category) VALUES('${questionText}','${userId}','${category}')`;
        return new Promise((resolve,reject)=>{
            db.query(sqlQuery,(err,results)=>{
                // console.log(res);
              resolve()
            })
        })
     },

     getAllQuestions:(category)=>{
         const sqlQuery = `select username,qn_id,qn_text from users,questions where users.user_id=questions.user_id and questions.category='${category}'`
         return new Promise((resolve,reject)=>{
             db.query(sqlQuery,(err,questions)=>{
                //  console.log(questions);
                 if(questions.length!=0){
                     resolve(questions);
                 }else{
                     reject('No questions in this section. Be the first person to ask one.')
                 }
             })
         })
     },
    getMyQuestions:(userId)=>{
        const sqlQuery = `select * from questions where user_id='${userId}'`;
        return new Promise((resolve,reject)=>{
            db.query(sqlQuery,(err,questions)=>{
                if(questions.length!=0){
                    resolve(questions)
                }else{
                    reject('You have not asked any questions')
                }
            })
        })
    },

    addAnswer:(ansBody)=>{
        let qn_id = ansBody.qn_id;
        let user_id = ansBody.user_id;
        let ans_text = ansBody.ans_text;
        const sqlQuery = `INSERT INTO ANSWERS(ans_text,qn_id,user_id) VALUES('${ans_text}','${qn_id}','${user_id}')`
        return new Promise((resolve,reject)=>{
            db.query(sqlQuery,(err,results)=>{
                if(!err){
                    resolve(results)
                }else{
                    reject(err)
                }
            })
        })
    },

    getAnswers:(qnId)=>{
        const sqlQuery = `SELECT ans_text,username,qn_text FROM answers,users,questions WHERE answers.qn_id=${qnId} and users.user_id=answers.user_id and questions.qn_id=answers.qn_id`;
        return new Promise((resolve,reject)=>{
            db.query(sqlQuery,(err,results)=>{
                if(!err){
                    resolve(results)
                }else{
                    reject(err)
                }
            })
        })    
    },
    getQuestion:(qnId)=>{
        const sqlQuery = `SELECT qn_text FROM questions WHERE qn_id=${qnId}`;
        return new Promise((resolve,reject)=>{
            db.query(sqlQuery,(err,results)=>{
                if(!err){
                    resolve(results[0])
                }
            })
        })
           
    }

}