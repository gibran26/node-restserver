const { 
    Categoria,
    Role,
    Usuario,
    Producto
 } = require("../models");

const isValidRole = async ( rol = '') => {
    const existeRol = await Role.findOne({rol});

    if (!existeRol){
        throw new Error(`El rol ${rol} no existe en la base de datos`);
    }
};

const existsEmail = async ( correo = '') => {
    const existeCorreo = await Usuario.findOne({ correo });
    if(existeCorreo){
        throw new Error(`El correo ${correo} ya se encuentra registrado`);
    }
};

const validateIdUser = async ( id ) => {
    const existeUsuario = await Usuario.findById( id );
    if(!existeUsuario){
        throw new Error(`El id de usuario ${id} no existe en la base de datos`);
    }
};

const existsIdCategory = async ( id ) => {
    const existeCategoria = await Categoria.findById( id );

    if ( !existeCategoria ) {
        throw new Error(`La categoría ${id} no existe en la base de datos`);
    }
};

const validateCategoryName = async ( nombre ) => {

    const categoria = await Categoria.findOne({ nombre });

    if ( categoria ){
        throw new Error(`La categoría ${nombre} ya está registrada`);
    }
};

const existsIdProducto = async ( id ) => {
    const producto = await Producto.findById( id );

    if ( !producto ) {
        throw new Error( `El producto ${id} no existe en la base de datos` );
    }
};

const validarColecciones = ( coleccion = '', colecciones = [] ) => {

    const existeColeccion = colecciones.includes(coleccion);

    // console.log('Existe colección: ', existeColeccion);

    if ( !existeColeccion ) {
        throw new Error(`La colección ${coleccion} no está permitida - ${colecciones}`);
    }

    return true;

}

module.exports = {
    isValidRole,
    existsEmail,
    existsIdProducto,
    validateIdUser,
    existsIdCategory,
    validateCategoryName,
    validarColecciones
};