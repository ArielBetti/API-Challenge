const express = require('express');
const authMiddleware = require('../middlewares/auth');
const Partner = require('../models/Partner');
const router = express.Router();

router.use(authMiddleware);

router.post('/findpartner', async (req, res) => {

    const { availableServices } = req.body;

    let distancia = 450;
    let raioglobal = 6371;
    let raio = distancia / raioglobal;
    let lat_de = req.body.lat + raio;
    let lat_ate = req.body.lat - raio;
    let long_de = req.body.long + raio;
    let long_ate = req.body.long - raio;

    const partner = await Partner.findOne({

        availableServices: { $all: availableServices },

        'location.lat': {
            $gte: lat_ate,
            $lte: lat_de
        },
        'location.long': {
            $gte: long_ate,
            $lte: long_de
        }

    });

    if( partner == null) {
        return res.send({ error: 'Não encontrei nenhum serviço :(' })
    }

    res.send({ partner });
});

module.exports = app => app.use('/auth', router);