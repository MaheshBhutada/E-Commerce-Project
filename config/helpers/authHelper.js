import bcrypt from 'bcrypt' // it is use to hash the password.


// In this file I have create two function one for hashing and another for comparing & decrypting

export const hashPassword = async (password) =>{
    try{
        const saltRound = 10;
        const hashedPassword = await bcrypt.hash(password, saltRound);
        return hashedPassword;
    }
    catch(error){
        console.log(error);
    }
};

export const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
}
