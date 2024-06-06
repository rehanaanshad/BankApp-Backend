
//import db
const {response} =require('express')

//import db
const db = require('./db')

//import jsonweb token
const jwt = require('jsonwebtoken')




//logic for register
const register =(username,acno,password)=>{
    return db.User.findOne({acno}).then((response)=>{
        console.log(response);
        if(response){
            
            return {
                statusCode:401,
                message:"Acno is already registered"
            }
        }
        else{
            const newUser =new db.User({
                username,
                acno,
                password,
                balance:2000,
                transaction:[]
            })
            //to store the new user in the database
            newUser.save()
            //response send back to the client
            return{
                statusCode:200,
                message:"Registered Successsfull",
                
            }
        }
    })
}


            //logic for login
const login=(acno,password)=>{
    return db.User.findOne({acno,password}).then((response)=>{
        console.log(response);
        
        if(response){

            //token generation
            const token =jwt.sign({
                    loginAcno:acno
            },'superkey2023')



            //if acno and password are present in db
            return{
               
                statusCode:200,
                message:"Login Successful",
                currentUser:response.username,//current user name send to frontend
                balance:response.balance,//balance of current user
                token,
                currentAcno:acno
            }
        }
        //acno and password are not present in db
        else{
            return{
                statusCode:401,
                message:"Invalid Login"
            }
        }
    })
}

//logic for getting the balance
const getBalance =(acno)=>{
    return db.User.findOne({acno}).then((result)=>{
        if(result){
            return{
                statusCode:200,
                balance:result.balance
            }
        }
        else{
            return{
                statusCode:401,
                message:"Invalid Account Number"
            }
        }
    })
}

//LOGIC for fund Transfer
const fundTransfer=(fromAcno,frompswd,toAcno,amt)=>{

    //convert amt to a integer
    let amount = parseInt(amt)
    //check fromAcno & frompswd in mongodb
    return db.User.findOne({acno:fromAcno,password: frompswd}).then((debit)=>{
        if(debit){
            //check toAcno in mongodb
            return db.User.findOne({acno: toAcno}).then((credit)=>{
                //fund Transfer
                if(credit){
                    if(debit.balance>=amount){
                        debit.balance-=amount
                        debit.transactions.push({
                            type: 'debit',
                            amount,
                            fromAcno,
                            toAcno
                        })
                    }
                    else{
                        return{
                            statusCode:401,
                            message:'Insufficient Funds'
                        }
                    }
                    //save changes into database
                    debit.save()
                }
                else{
                    return{
                        statusCode:401,
                        message:'Invalid Credit Details'
                    }
                }
                credit.balance+=amount
                credit.transactions.push({ 
                    type:'credit',
                    amount,
                    fromAcno,
                    toAcno
                })
                 //save changes into database
                 credit.save()

                 //send response back to client
                 return{
                    statusCode:200,
                    message:'Fund Transfer Successful...'
                 }
            })


        }
        else{
            return{
                statusCode:401,
                message:'Invalid Debit Details'
            }
        }
    })
}

//transaction History
const transactionHistory=(acno)=>{
    //check acno present in mongodb
    return db.User.findOne({acno}).then((result)=>{
        if(result){
            return{
                statusCode:200,
                transactions:result.transactions
            }
        }
        else{
            return{
                statusCode:401,
                message: 'Invalid Data'
            }
        }
    })
}

const deleteAccount=(acno)=>{
    //account delete from database
    return db.User.deleteOne({acno}).then((result)=>{
        return{
            statusCode:200,
            message:"Account deleted successfully"
        }
    })

}
module.exports={
    register,
    login,
    getBalance,
    fundTransfer,
    transactionHistory,
    deleteAccount


}