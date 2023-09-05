const Joi = require('joi');

module.exports.pieceSchema = Joi.object({
    piece: Joi.object({
        name: Joi.string().required(),
        composer: Joi.string().required(),
        era: Joi.string().required(),
        length: Joi.number().required().min(0)
    }).required()
})

module.exports.logSchema = Joi.object({
    log: Joi.object({
        title: Joi.string().required(),
        body: Joi.string().required(),
        efficiency: Joi.number().required(),
        timePracticed: Joi.number().required()
    }).required()
})