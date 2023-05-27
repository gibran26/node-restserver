const { request, response } = require("express");
const { Categoria } = require("../models");

// Obtener categorías - paginado - total - populate
const obtenerCategorias = async ( req = request, res = response) => {

    const { limite = 0, desde = 0} = req.query;
    const query = {
        estado : true
    };

    try {
        
        const [total, categorias] = await Promise.all([
            Categoria.countDocuments(query),
            Categoria.find(query)
                                .populate('usuario', { 
                                    correo : 1,
                                    nombre : 1,
                                    rol : 1
                                })
                                .skip(Number(desde))
                                .limit(Number(limite))
          ]);
    
        res.json({
            total,
            categorias
        });

    } catch (err) {
        console.log('Error al obtener las categorías: ', err);

        res.status(500).json({
            msg: 'Error al obtener las categorías'
        });
    }

}

// Obtener categoría - populate { }
const obtenerCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    try {

        const categoria = await Categoria.findById(id).populate('usuario');

        res.json({
            categoria
        });
        
    } catch (err) {
        console.log('Error al obtener la categoría: ', err);

        res.status(500).json({
            msg: 'Error al obtener la categoría'
        });
    }
}

// Crear una nueva categoría
const crearCategoria = async (req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    try {
        
        const categoriaDB = await Categoria.findOne({ nombre });
    
        if ( categoriaDB ) {
            return res.status(400).json({
                msg: `La categoría ${nombre} ya existe en la base de datos`
            });
        }
    
        // Generar la data
        const data = {
            nombre,
            usuario: req.usuario._id
        };
    
        const categoria = new Categoria(data);
        
        // Gardar en BD
        await categoria.save();

        res.status(201).json({
            categoria
        });

    } catch (err) {
        console.log('Error al guardar la categoría: ', err);

        res.status(500).json({
            msg: 'Error al guardar la categoría en la base de datos'
        });
    }
}

// Actualizar categoría 
const actualizarCategoria = async (req = request, res = response) => {

    const { id } = req.params;
    const { _id , usuario, ...resto } = req.body;
    
    try {

        
        console.log('Nombre: ', resto.nombre);

        // Se valida si ya existe una categoría con el mismo nombre
        if ( resto.nombre ) {

            resto.nombre = resto.nombre.toUpperCase();

            const queryRepetido = {
                nombre: resto.nombre,
                _id: { $not: { $eq: id}}
            };

            const categoriaRepetida = await Categoria.findOne(queryRepetido);

            console.log('Encontrado....', JSON.stringify(categoriaRepetida));
    
            if ( categoriaRepetida ){
                return res.status(400).json({
                    msg: `La categoría ${resto.nombre} ya existe`
                });
            }
        }

        console.log('Preparando actualización');
        // Se agrega el usuario que está realizando la actualización
        resto.usuario = req.usuario._id;

        const categoria = await Categoria.findByIdAndUpdate(id, resto, { new: true })
                                            .populate('usuario', { 
                                                correo : 1,
                                                nombre : 1
                                            });

        res.json({categoria});
        
        
    } catch (err) {
        console.log('Error al actualizar la categoría: ', err);

        res.status(500).json({
            msg: 'Error al actualizar la categoría'
        });
    }
}

// Borrar categoría - estado : false
const borrarCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    try {

        const categoria = await Categoria.findByIdAndUpdate(id, { 
                                            estado: false, 
                                            usuario: req.usuario._id
                                        }, { new: true })
                                        .populate('usuario', { 
                                            correo : 1,
                                            nombre : 1
                                        });

        res.json({
            categoria
        });
        
    } catch (err) {
        console.log('Error al borrar la categoría: ', err);

        res.status(500).json({
            msg: 'Error al borrar la categoría'
        });
    }

}

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}