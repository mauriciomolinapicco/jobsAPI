const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors/index')

const register = async (req,res) => {

    const user = await User.create({...req.body}) //... =>spread operator
    //los tres puntos indican que tempUser es un objeto y lo estoy desglosando
    //i send back the name of the user and the token
    
    token = user.createJWT()
    res
    .status(StatusCodes.CREATED)
    .json({user: {name:user.name}, token })
} 
const login = async (req,res) => {
    const {email, password} = req.body

    if(!email || !password){
        throw new BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({email})
    // compare password
    if (!user) {
        throw new UnauthenticatedError('Invalid credentials')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect){
        throw new UnauthenticatedError('Invalid credentials')
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({user:{ name:user.name }, token})
}

module.exports = {
    register,
    login
}