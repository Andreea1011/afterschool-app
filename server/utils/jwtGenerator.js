import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // get acces to all enviroment variables
function jwtGenerator(user_id){
    const payload = {
        user: user_id
    }
    return jwt.sign(payload, process.env.SECRET, {expiresIn: "1hr"})
}

export default jwtGenerator;