const { response, request } = require("express");
const { Producto, Categoria } = require("../models");
const mongoose = require("mongoose");

// Obtener productos
const obtenerProductos = async (req = request, res = response) => {

    const { limite = 0, desde = 0} = req.query;
    const query = {
        estado : true
    };

    try {
        
        const [total, productos] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query)
            .populate('usuario', {
                nombre : 1,
                correo: 1
            })
            .populate('categoria', 'nombre')
        ]);

        res.json({
            total,
            productos
        })

    } catch (err) {
        console.log('Error al obtener los productos: ', err);
        res.status(500).json({
            msg: 'Error al obtener los productos'
        });
    }
}

// Obtener producto por Id
const obtenerProducto = async (req = request, res = response) => {

    const { id } = req.params;

    try {
        
        const producto = await Producto.findById( id )
                        .populate('usuario', {
                            nombre : 1,
                            correo: 1
                        })
                        .populate('categoria', 'nombre');

        res.json({
            producto
        });

    } catch (err) {
        console.log('Error al obtener el producto: ', err);
        res.status(500).json({
            msg: 'Error al obtener el producto'
        });
    }
}

// Crear producto
const crearProducto = async (req = request, res = response) => {

    const { usuario, estado, ...data } = req.body;

    try {

        // Buscar producto repetido por el nombre ignorando mayúsculas o minúsculas
        const productoBD = await Producto.findOne({
             nombre: {
                // $regex : /^Coca cola$/i
                // $regex: filtro,
                $regex : `^${data.nombre}$`,
                $options : 'i'
                }
            });

        if( productoBD ) {
            return res.status(400).json({
                msg: `El producto ${productoBD.nombre} ya se encuentra registrado en la base de datos`,
                productoBD
            });
        }

        // Generar la data
        data.usuario = req.usuario._id;

        const producto = new Producto(data);
        await producto.save();

        res.status(201).json({
            producto
        });


    } catch (err) {
        console.log('Error al guardar el producto: ', err);

        res.status(500).json({
            msg: 'Error al guardar el producto en la base de datos'
        });
    }
}

// Actualizar producto por Id
const actualizarProducto = async (req = request, res = response) => {

    const { id } = req.params;
    const { _id, usuario, ...data } = req.body;

    try {

        // Se valida el nombre
        if ( data.nombre ) {
            
            console.log('id: ', id);
            console.log('nombre: ', data.nombre);

            const queryDuplicado = {
                nombre: {
                        // $regex : data.nombre,
                        $regex : `^${data.nombre}$`,
                        $options : 'i'
                    },
                _id: { $not: { $eq: id}}
            }

            const productoDuplicado = await Producto.findOne(queryDuplicado);

            if ( productoDuplicado ) {
                return res.status(400).json({
                    msg: `El producto ${productoDuplicado.nombre} ya existe`
                });
            }
        }

        // Se valida la categoría
        if ( data.categoria ) {

            if ( !mongoose.Types.ObjectId.isValid(data.categoria) ) {
                return res.status(400).json({
                    msg: 'La categoría no es válida'
                });
            } else {
                const categoria = await Categoria.findById( data.categoria );

                if ( !categoria ) {
                    return res.status(400).json({
                        msg: `La categoría ${data.categoria} no existe`
                    });
                }
            }
        }

        // Se agrega el usuario que está realizando la actualización
        data.usuario = req.usuario._id;
        const producto = await Producto.findByIdAndUpdate( id, data, { new : true })
                                        .populate('usuario', {
                                            nombre : 1,
                                            correo: 1
                                        })
                                        .populate('categoria', 'nombre');
        
        res.json({
            producto
        });

    } catch (err) {
        console.log('Error al actualizar el producto: ', err);

        res.status(500).json({
            msg: 'Error al actualizar el producto en la base de datos'
        });
    }
}

// Borrar producto por Id
const borrarProducto = async (req = request, res = response) => {

    const { id } = req.params;

    try {
        
        const producto = await Producto.findByIdAndUpdate( id, {
                                    estado : false,
                                    usuario : req.usuario._id
                                }, { new : true })
                                .populate('usuario', {
                                    nombre : 1,
                                    correo: 1
                                })
                                .populate('categoria', 'nombre');

                                
        res.json({
            producto
        });

    } catch (err) {
        console.log('Error al borrar el producto: ', err);

        res.status(500).json({
            msg: 'Error al borrar el producto en la base de datos'
        });
    }
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}