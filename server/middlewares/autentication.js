//importação do jwt
const jwt = require('jsonwebtoken');

//criação do midleware de verificação do token
let verificaToken = (req, res, next) => {

    // pegando o valor do token do header 
    let token = req.get('token');

    //comparação se o token do header e  valido com o que nos criamos 
    jwt.verify(token, 'abc-123-def-456*', (err, decoded) => {

        if(err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        //confirmação da autenticação via token
         req.usuario = decoded.data;
        // console.log(req.usuario);
        // console.log(decoded);
        next();

    })
}

let verificaAdmin_Role =  (req, res, next) => {

    let usuario = req.usuario;

   if (usuario.role === 'ADMIN_ROLE') {
       next()
   } else { 
    return res.json({
        ok: false,
        err: {
            message: 'El usuario no tene permissio de admin'
        }
        
    });

   }

}

// exportando o midleware 
module.exports = {
    verificaToken,
    verificaAdmin_Role
};