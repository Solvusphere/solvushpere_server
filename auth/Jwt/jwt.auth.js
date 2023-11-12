const jwt = require('jsonwebtoken');
const { commonErrors } = require('../../middlewares/error/commen.error');
require('dotenv').config()

const jwtSecret = process.env.SECRET_KEY
let refreshSecret = "";


module.exports = {

    // Function to generate tokens
     generateAccessToken(payload) {
        let token =  jwt.sign(payload, jwtSecret, { expiresIn: '30m' });
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 30 * 60 * 1000
        });
        return token

    },
    
     generateRefreshToken(payload) {
        refreshSecret = jwt.sign(payload, jwtSecret, { expiresIn: '30d' });
        res.cookie("jwt", refreshSecret, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        return refreshSecret
    },

    reGenerateAccessToken(refreshToken, payload) {
        jwt.verify(refreshToken, jwtSecret, (err, user) => {
            if (err) {
                return  console.error('Error verifying refresh token:', err.message);
            }

            // If the refresh token is valid, issue a new access token
            const accessToken = jwt.sign(payload, jwtSecret, { expiresIn: '30m' });
            res.cookie("jwt", accessToken, {
             httpOnly: true,
             maxAge: 30 * 60 * 1000
            });

            refreshSecret = jwt.sign(payload, jwtSecret, { expiresIn: '30d' })
            res.cookie("jwt", refreshSecret, {
             httpOnly: true,
             maxAge: 30 * 24 * 60 * 60 * 1000,
            });
            let token = { accessToken, refreshSecret }
            return token
        });
    },

    async verify_Token(token) {
       try {
            jwt.verify(token, jwtSecret, (err, decoded) => {
                if (err) {
                        console.error('JWT verification failed:', err.message);
                } else {
                   return decoded
                }
            });
       } catch (error) {
           console.log(error);
           commonErrors(res,500,{message:"Internal Server Error"})
       }
   }
     
}

