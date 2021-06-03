const nodemailer = require('nodemailer');

let mailTransporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'nizamsalim.official@gmail.com',
        pass:'musiciaNsince2004'
    }
});

var otp = Math.floor(Math.random()*(999999-100000)+100000)

let mailDetails = {
    from:'nizamsalim.official@gmail.com',
    to:'nizam.salim7@gmail.com',
    subject:'CodeQuery password reset',
    text:`Your otp verification code to reset password is  ${otp} `
}

mailTransporter.sendMail(mailDetails,(err,response)=>{
    if(err){
        console.log(err);
    }else{
        console.log('success',response);
    }
})
