const jwt = require('jsonwebtoken');

const generarJWT = ( uid = '') => {

    return new Promise( ( resolve, reject) => {

        const payload = { uid };
        // const expiration = 1000 * 60;
        // console.log('Expiration: ', expiration);

        jwt.sign( payload,process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
            // expiresIn: expiration
            // expiresIn: String(expiration)
        }, ( err, token) => {
            if(err){
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }
        });

    });

};

module.exports = {
    generarJWT
}