// JWTs
// Write a function that takes in a username and password and returns a JWT token with the username encoded. Should return null if the username is not a valid email or if the password is less than 6 characters. Try using the zod library here
// Write a function that takes a jwt as input and returns true if the jwt can be DECODED (not verified). Return false otherwise
// Write a function that takes a jwt as input and returns true if the jwt can be VERIFIED. Return false otherewise
// To test, go to the 02-jwt folder and run npx jest ./tests


const jwt = require('jsonwebtoken');

const express = require('express');
const jwtpassword = 'secret';
const app = express();
const z = require('zod');
const { de } = require('zod/v4/locales');

const emailSchema = z.string().email();
const passwordsch = z.string().min(6);

function signJwt(username,password){

    const userSchema = emailSchema.safeParse(username);
    const passwordSchema = passwordsch.safeParse(password);

    if(!userSchema.success || !passwordSchema.success){
        return null;
    }
const signature = jwt.sign({
    username
},jwtpassword)
return signature;
}



function VerifyJwt(token){
    let ans = true;
    try{
const verified = jwt.verified(token,jwtpassword);
    
    }catch(e){
        console.log(e);
        ans = false
    }
    return ans;

    
}

function decodedJwt(token){


    const decoded = jwt.decode(token);
    if(decoded){
        return true;
    }
    else{
        return false;
    }
}