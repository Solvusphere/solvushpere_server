const jwt = require('jsonwebtoken');
const { commonErrors } = require('../../middlewares/error/commen.error');
require('dotenv').config()

const jwtSecret = process.env.SECRET_KEY
let refreshSecret = "";


module.exports = {

    // Function to generate tokens
     generateAccessToken(payload,res) {
        let token =  jwt.sign(payload, jwtSecret, { expiresIn: '30m' });
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 30 * 60 * 1000
        });
        return token
    },
     
    generateRefreshToken(res) {
        refreshSecret = jwt.sign({refresh:process.env.REFRESH_KEY}, jwtSecret, { expiresIn: '30d' });
        res.cookie("jwt", refreshSecret, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        return refreshSecret
    },

    reGenerateAccessToken(refreshToken, payload,res) {
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

            refreshSecret = jwt.sign({ refresh: process.env.REFRESH_KEY }, jwtSecret, { expiresIn: '30d' });
            res.cookie("jwt", refreshSecret, {
             httpOnly: true,
             maxAge: 30 * 24 * 60 * 60 * 1000,
            });
            let token = { accessToken, refreshSecret }
            return token
        });
    },

    async verify_Token(req,res,next) {
        try {
            const authHeader = req.headers.authorization;
            console.log(authHeader,"jwt");
            if (!authHeader) return res.status(401).json("You are not authenticated");
            // const token = authHeader.split(" ")[1];
            // console.log(token,"ived aaaarulle");
            const decodedToken = jwt.verify(authHeader, jwtSecret);
            if (decodedToken) req.user = decodedToken;
            next()
        } catch (error) {
            console.error('Error verifying JWT:', error.message);
            return null;
        }
   }
     
}

