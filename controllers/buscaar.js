const { request, response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require("../models");

const colleccionesPermitidas = [
    'usuarios',
    'productos',
    'categorias',
    'roles',
    'productos-categoria'
];

const buscarUsuarios = async ( termino = '', res ) => {

    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        
        const usuario = await Usuario.findById( termino );
        return res.json({
            results : usuario ? [ usuario ] : []
        });
    }
    
    const regex = new RegExp( termino, 'i');

    const usuarios = await Usuario.find({
        $or : [{ nombre : regex }, { correo : regex }],
        estado : true
    });

    res.json({
        results : usuarios
    });

}

const buscarCategorias = async ( termino = '', res ) => {

    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        
        const categoria = await Categoria.findById( termino );
        return res.json({
            results : categoria ? [ categoria ] : []
        });
    }

    const regex = new RegExp( termino, 'ig');

    const query = {
        nombre : regex,
        estado : true
    }

    const categorias = await Categoria.find( query );

    res.json({
        results : categorias
    });
}

const buscarProductos = async ( termino = '', res ) => {

    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        
        const producto = await Producto.findById( termino ).populate('categoria', 'nombre');
        return res.json({
            results : producto ? [ producto ] : []
        });
    }

    const regex = new RegExp( termino, 'ig');

    let query = {
        $or : [ { nombre : regex }, { descripcion : regex }, { precio : Number( termino ) }],
        estado : true
    }

    if ( isNaN( termino )) {
        query = {
            $or : [ { nombre : regex }, { descripcion : regex }],
            estado : true
        }
    }

    const productos = await Producto.find( query ).populate('categoria', 'nombre');

    res.json({
        results : productos
    });

}

const buscarProductosPorCategoria = async ( termino = '', res ) => {

    const esMongoId = ObjectId.isValid(termino);

    if (esMongoId) {
        console.log('Es mongo ID');
        const producto = await Producto.find( { categoria : termino, estado : true } )
                                        .select( 'nombre descripcion precio disponible')
                                        .populate('categoria', 'nombre');
        return res.json({
            results : producto ? [ producto ] : []
        });
    }

    console.log('No es Mongo ID');
    const regex = new RegExp( termino, 'ig');

    const categorias = await Categoria.find({ nombre : regex, estado : true });

    console.log('categorias: ', categorias.length);
    if ( !categorias.length ) {
        console.log('No hay categorías');

        return res.status(400).json({
            msg: `No existen categorías con el termino: ${termino}`
        });
    }

    // const query = {
    //     $or : [ ...categorias.map( c => { return { categoria : c._id }})],
    //     estado : true
    // }

    const query2 = {
        $or: [ ...categorias.map ( c => { return { categoria: c._id } } ) ],
        $and: [ { estado: true }]
    }

    console.log('Se ejecuta la consulta');
    const productos = await Producto.find(query2)
                                    .select( 'nombre descripcion precio disponible')
                                    .populate('categoria', 'nombre');

    res.json({
        results : productos
    });
}

const buscar = async (req = request, res = response) => {

    const { coleccion, termino } = req.params;

    if ( !colleccionesPermitidas.includes(coleccion) ) {
        return res.status(400).json({
            msg: `Las colecciones deben ser: ${colleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios( termino, res );
            break;
        case 'productos':
            buscarProductos( termino, res );
            break;
        case 'categorias':
            buscarCategorias( termino, res);
            break;
        case 'productos-categoria' :
            buscarProductosPorCategoria( termino, res );
            break;
        default:
            res.status(500).json({
                msg: 'Falta hacer esta búsqueda'
            });
    }
}

module.exports = {
    buscar
}