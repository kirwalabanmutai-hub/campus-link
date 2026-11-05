import Joi from 'joi'

export function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false })
    if (error) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map(d => d.message),
      })
    }
    next()
  }
}

export const schemas = {
  register: Joi.object({
    name:     Joi.string().min(2).max(80).required(),
    email:    Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role:     Joi.string().valid('user', 'recruiter', 'provider', 'investor').default('user'),
  }),

  login: Joi.object({
    email:    Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  updateProfile: Joi.object({
    bio:      Joi.string().max(500).optional().allow(''),
    headline: Joi.string().max(120).optional().allow(''),
    location: Joi.string().max(100).optional().allow(''),
    website:  Joi.string().uri().optional().allow(''),
  }),

  addSkill: Joi.object({
    name:     Joi.string().min(1).max(60).required(),
    category: Joi.string().max(40).optional(),
  }),

  addOpportunity: Joi.object({
    title:         Joi.string().min(3).max(200).required(),
    description:   Joi.string().min(10).required(),
    type:          Joi.string().valid('job','internship','scholarship','grant','competition','tender','gig').required(),
    location:      Joi.string().optional().allow(''),
    deadline:      Joi.string().optional(),
    compensation:  Joi.string().optional().allow(''),
    requirements:  Joi.array().items(Joi.string()).optional(),
    tags:          Joi.array().items(Joi.string()).optional(),
  }),

  addIncomeRecord: Joi.object({
    amount:      Joi.number().min(0.01).required(),
    source:      Joi.string().min(1).max(200).required(),
    category:    Joi.string().min(1).max(80).required(),
    type:        Joi.string().valid('income', 'expense').required(),
    date:        Joi.date().iso().required(),
    description: Joi.string().optional().allow(''),
  }),

  addReview: Joi.object({
    rating:      Joi.number().min(1).max(5).required(),
    comment:     Joi.string().min(5).max(500).required(),
    serviceType: Joi.string().optional().allow(''),
  }),
}
