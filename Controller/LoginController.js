const User = require('../Model/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const emailValidator = require('email-validator');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY});

// add a user
exports.addUser = async(req, res) => {
    const email = req.body.email
    const password = req.body.password

    const emailValid = emailValidator.validate(email)

    const hashedPassword = await bcrypt.hash(password, 10)

    const otpCode = otpGenerator.generate(6, { digits: true, alphabets: false, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })

    const hashedOtp = await bcrypt.hash(otpCode, 10)

    const saveData = new User({
        email: email,
        password: hashedPassword,
        otp: hashedOtp
    })

    if(emailValid){
        const searchUser = await User.findOne({ email: email })
        if(searchUser) res.json('Email already exists')
        else{
            try{
                const addUser = await saveData.save()
                mg.messages.create('sandboxfd5fb42946fa472382e609d175f24eae.mailgun.org', {
                    from: 'Excited User <mailgun@sandboxfd5fb42946fa472382e609d175f24eae.mailgun.org>',
                    to: [`${email}`],
                    subject: "Account creation otp",
                    text: '123456',
                    html: `<h1>Your otp for account verification is - ${otpCode}</h1>`
                })
                .then(console.log)
                .catch(console.log)
                res.json(addUser)
            }
            catch(err){
                res.json(err)
            }
        }
    }

    else res.json('Please enter valid email id')
}

//verify otp
exports.verifyOtp = async(req, res) => {
    const email = req.body.email
    const otp = req.body.otp

    const emailValid = emailValidator.validate(email)

    try{
        if(emailValid){
            const searchUser = await User.findOne({ email: email })
            if(!searchUser) res.json('Email does not exist')
            else{
                if(searchUser.otp == '') res.json('Invalid')
                else{
                    bcrypt.compare(otp, searchUser.otp, function async(err, isMatch){
                        if(err) res.json('Invalid')
                        if(!isMatch) res.json('Invalid')
                        else{
                            const token = jwt.sign({ userId: searchUser._id}, 'your_secret_key', { expiresIn: '1h' })
                            res.json(token)
                            updateVerify(searchUser._id)
                        }
                    })
                }
            }
        }
        else res.json('Please enter valid email id')    
    }
    catch(err){
        res.json(err)
    }
}

const updateVerify = async(id) => {
    try{
        const updateVerify = await User.updateOne(
            { _id: id},
            {
                $set: {
                    verified: true
                }
            }
        )
    }
    catch(err){
        console.log(err)
    }
}

// login user
exports.loginUser = async(req, res) => {
    const email= req.body.email
    const password = req.body.password

    const emailValid = emailValidator.validate(email)

    if(!emailValid) res.json('Enter a valid email')
    else{
        try{
            const searchUser = await User.findOne({ email: email })
            if(!searchUser) res.json('Email does not exists')
            else{
                if(searchUser.verified == false) res.json('Please verify your email with the otp sent to your registered email')
                
                else{
                    if(password == '' || password == null || password == undefined) res.json('Please enter valid password')
                
                    else{
                        bcrypt.compare(password, searchUser.password, function(err, isMatch){
                            if(err) res.json('Invalid')
                            if(!isMatch) res.json('Invalid')
                            else{
                                const token = jwt.sign({ userId: searchUser._id }, 'your_secret_key', { expiresIn: '1h', })
                                res.json(token)
                            }
                        })
                    }
                }
            }   
        }
        catch(err){
            res.json(err)
        }
    }
}

//user details
exports.userDetails = async(req, res) => {
    const email= req.body.email
    try{
        const userDetails = await User.findOne({ email: email })
        res.json(userDetails)
    }
    catch(err){
        res.json(err)
    }
}