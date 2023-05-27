const { Router } = require("express");
const { buscar } = require("../controllers/buscaar");


const router = Router();

router.get('/:coleccion/:termino', buscar)


module.exports = router;