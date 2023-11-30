const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value });
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.pieceSchema = Joi.object({
    piece: Joi.object({
        name: Joi.string().required().escapeHTML(),
        composer: Joi.string().required().escapeHTML(),
        era: Joi.string().required().escapeHTML(),
        length: Joi.number().required().min(0)
    }).required(),
    deleteSheets: Joi.array()
})

module.exports.logSchema = Joi.object({
    log: Joi.object({
        title: Joi.string().required().escapeHTML(),
        body: Joi.string().required().escapeHTML(),
        efficiency: Joi.number().required(),
        timePracticed: Joi.number().required()
    }).required()
})