import jwt from 'jsonwebtoken'
import config from '../config/env.js'

const GenerateToken = async(payload) =>{
    return await jwt.sign({payload} , config.JWT_SECRET , {expiresIn:'7d'})
}

const VerifyToken = async(token) => {
    return await jwt.verify(token , config.JWT_SECRET)
}
export {GenerateToken ,VerifyToken}