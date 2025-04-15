const jwt = require('jsonwebtoken')
const loadEnv = require('../loadEnv');
const { configDotenv } = require('dotenv');
const authMiddleware = async (req ,res, next) =>{
    const token = req.cookies.token;
    const ConfigEnv = await loadEnv()
    if (!token){
        return res.redirect('/user/login')
    }
    try {
        const decocded = jwt.verify(token , ConfigEnv.JWT_SECRET)
        req.user = decocded
        next()

    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
        
    }
}

const authMiddlewareForAddBlog = async(req ,res, next) =>{
    const token = req.cookies.token;

    const ConfigEnv = await loadEnv()
    
    if (!token){
        return res.redirect('/user/login')
    }
    try {
        const decocded = jwt.verify(token , ConfigEnv.JWT_SECRET)
        req.user = decocded
        next()

    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
        
    }
}

module.exports = {authMiddleware, authMiddlewareForAddBlog}