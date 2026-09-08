import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().trim().required().messages({
    'string.email': 'Please provide a valid email address.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long.',
    'any.required': 'Password is required.',
  }),
});

export const createLeadSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Name is required.',
    'string.min': 'Name must be at least 2 characters long.',
    'any.required': 'Name is required.',
  }),
  email: Joi.string().email().trim().required().messages({
    'string.email': 'Please provide a valid email address format (e.g. user@example.com).',
    'string.empty': 'Email is required.',
    'any.required': 'Email is required.',
  }),
  phone: Joi.string().trim().pattern(/^[0-9]{10}$/).required().messages({
    'string.pattern.base': 'Please enter a valid 10-digit phone number.',
    'string.empty': 'Phone number is required.',
    'any.required': 'Phone number is required.',
  }),
  status: Joi.string().valid('new', 'contacted', 'qualified', 'lost').default('new').messages({
    'any.only': 'Status must be one of: new, contacted, qualified, lost.',
  }),
  source: Joi.string().trim().max(100).optional().allow('', null),
});

export const updateLeadSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  email: Joi.string().email().trim().optional().messages({
    'string.email': 'Please provide a valid email address format.',
  }),
  phone: Joi.string().trim().pattern(/^[0-9]{10}$/).optional().messages({
    'string.pattern.base': 'Please enter a valid 10-digit phone number.',
  }),
  status: Joi.string().valid('new', 'contacted', 'qualified', 'lost').optional().messages({
    'any.only': 'Status must be one of: new, contacted, qualified, lost.',
  }),
  source: Joi.string().trim().max(100).optional().allow('', null),
}).min(1);

export const createNoteSchema = Joi.object({
  content: Joi.string().trim().min(1).max(5000).required().messages({
    'string.empty': 'Note content cannot be empty.',
    'any.required': 'Note content is required.',
  }),
});

export const createMultipleNotesSchema = Joi.object({
  notes: Joi.array().items(
    Joi.object({
      content: Joi.string().trim().min(1).required(),
    })
  ).min(1).required(),
});

export default {
  loginSchema,
  createLeadSchema,
  updateLeadSchema,
  createNoteSchema,
  createMultipleNotesSchema,
};
