const jwt = require('jsonwebtoken');
require('dotenv').config()

const jwtSecret = process.env.SECRET_KEY
let refreshSecret = "";


module.exports = {

    // Function to generate tokens
     generateAccessToken(payload) {
        return jwt.sign(payload, jwtSecret, { expiresIn: '30m' });
    },
    
     generateRefreshToken(payload) {
        refreshSecret =  jwt.sign(payload, jwtSecret, { expiresIn: '30d' });
        return refreshSecret
    },

    
    

    regenerateAccessToken(refreshToken, payload) {
    jwt.verify(refreshToken, jwtSecret, (err, user) => {
        if (err) {
            return  console.error('Error verifying refresh token:', err.message);
        }

        // If the refresh token is valid, issue a new access token
        const accessToken = jwt.sign(payload, jwtSecret, { expiresIn: '1m' });
        refreshSecret = jwt.sign(payload, jwtSecret, { expiresIn: '30d' })
        let token = { accessToken, refreshSecret }
        return token
    });
}
     
}

