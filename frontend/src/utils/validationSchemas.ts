import * as Yup from 'yup';

/**
 * Common Field-Level Validation Rules
 */
export const nameValidator = (label = 'Name', min = 2, max = 70) =>
  Yup.string()
    .trim()
    .min(min, `${label} must be at least ${min} characters`)
    .max(max, `${label} cannot exceed ${max} characters`)
    .test('no-only-spaces', `${label} cannot be empty spaces`, (val) => !!val && val.trim().length > 0)
    .required(`${label} is required`);

export const emailRegex =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}(?:\.[a-zA-Z]{2,3})?$/;

export const DISPOSABLE_EMAIL_DOMAINS = new Set<string>([]);

export const emailValidation = (required = true) => {
  let schema = Yup.string()
    .test(
      'no-whitespace',
      'Please enter a valid email',
      (_value, context) =>
        typeof context.originalValue !== 'string' ||
        context.originalValue.trim() === context.originalValue
    )
    .transform((value) => value?.trim())
    .test('no-starting-dot', 'Please enter a valid email', (value) => {
      if (!value) return true;
      return !/^\./.test(value);
    })
    .test('no-ending-dot', 'Please enter a valid email', (value) => {
      if (!value) return true;
      const username = value.split('@')[0];
      return !/\.$/.test(username);
    })
    .test(
      'consecutive-dots',
      'Please enter a valid email',
      (value?: string) => !/\.{2,}/.test(value || '')
    )
    .test(
      'min-prefix-length',
      'Email prefix must be at least 3 characters',
      (value) => {
        if (!value) return true;
        const username = value.split('@')[0];
        return username.length >= 3;
      }
    )
    .max(70, 'Email must be at most 70 characters')
    .matches(emailRegex, 'Please enter a valid email');

  return required ? schema.required('Email is required') : schema;
};

export const emailValidator = (label = 'Email', required = true) => {
  let schema = Yup.string()
    .test(
      'no-whitespace',
      'Please enter a valid email',
      (_value, context) =>
        typeof context.originalValue !== 'string' ||
        context.originalValue.trim() === context.originalValue
    )
    .transform((value) => value?.trim())
    .test('no-starting-dot', 'Please enter a valid email', (value) => {
      if (!value) return true;
      return !/^\./.test(value);
    })
    .test('no-ending-dot', 'Please enter a valid email', (value) => {
      if (!value) return true;
      const username = value.split('@')[0];
      return !/\.$/.test(username);
    })
    .test(
      'consecutive-dots',
      'Please enter a valid email',
      (value?: string) => !/\.{2,}/.test(value || '')
    )
    .test(
      'min-prefix-length',
      'Email prefix must be at least 3 characters',
      (value) => {
        if (!value) return true;
        const username = value.split('@')[0];
        return username.length >= 3;
      }
    )
    .max(70, `${label} must be at most 70 characters`)
    .matches(emailRegex, 'Please enter a valid email');

  return required ? schema.required(`${label} is required`) : schema;
};

export const phoneValidator = (label = 'Phone number') =>
  Yup.string()
    .trim()
    .length(10, `${label} must be exactly 10 digits`)
    .matches(/^[0-9]{10}$/, `${label} must contain only 10 digits`)
    .test('no-only-spaces', `${label} cannot be empty spaces`, (val) => !!val && val.trim().length > 0)
    .required(`${label} is required`);

export const passwordValidator = (label = 'Password', min = 6, max = 50) =>
  Yup.string()
    .min(min, `${label} must be at least ${min} characters`)
    .max(max, `${label} cannot exceed ${max} characters`)
    .test('no-spaces', `${label} cannot contain spaces`, (val) => !val || !/\s/.test(val))
    .test('no-only-spaces', `${label} cannot be empty spaces`, (val) => !!val && val.trim().length > 0)
    .required(`${label} is required`);

export const otpValidator = () =>
  Yup.string()
    .trim()
    .length(6, 'OTP must be exactly 6 digits')
    .matches(/^[0-9]{6}$/, 'OTP must contain only numbers')
    .test('no-spaces', 'OTP cannot contain spaces', (val) => !val || !/\s/.test(val))
    .required('OTP is required');

export const sourceValidator = (max = 80) =>
  Yup.string()
    .trim()
    .max(max, `Source cannot exceed ${max} characters`)
    .test('no-only-spaces', 'Source cannot be only empty spaces', (val) => !val || val.trim().length > 0);

export const noteValidator = (min = 3, max = 500) =>
  Yup.string()
    .trim()
    .min(min, `Note must be at least ${min} characters`)
    .max(max, `Note cannot exceed ${max} characters`)
    .test('no-only-spaces', 'Note cannot be empty spaces', (val) => !!val && val.trim().length > 0)
    .required('Note content is required');

/**
 * Pre-composed Common Form Schemas
 */
export const loginSchema = Yup.object({
  email: emailValidator('Email'),
  password: passwordValidator('Password'),
});

export const forgotPasswordSchema = Yup.object({
  email: emailValidator('Email'),
});

export const forgotPasswordOtpSchema = Yup.object({
  otp: otpValidator(),
});

export const setPasswordSchema = Yup.object({
  password: passwordValidator('New Password'),
  confirmPassword: Yup.string()
    .min(6, 'Confirm password must be at least 6 characters')
    .max(50, 'Password cannot exceed 50 characters')
    .test('no-spaces', 'Password cannot contain spaces', (val) => !val || !/\s/.test(val))
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

export const changePasswordSchema = Yup.object({
  oldPassword: passwordValidator('Current password'),
  newPassword: passwordValidator('New password'),
  confirmPassword: Yup.string()
    .min(6, 'Confirm password must be at least 6 characters')
    .max(50, 'Password cannot exceed 50 characters')
    .test('no-spaces', 'Password cannot contain spaces', (val) => !val || !/\s/.test(val))
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your new password'),
});

export const profileSchema = Yup.object({
  name: nameValidator('Full Name'),
});

export const leadFormSchema = Yup.object({
  name: nameValidator('Lead Name'),
  email: emailValidator('Email Address'),
  phone: phoneValidator('Phone Number'),
  status: Yup.string()
    .oneOf(['new', 'contacted', 'qualified', 'lost'])
    .required('Status is required'),
  source: sourceValidator(),
});

export const batchLeadsFormSchema = Yup.object({
  leads: Yup.array()
    .of(
      Yup.object({
        name: nameValidator('Name'),
        email: emailValidator('Email'),
        phone: phoneValidator('Phone'),
        status: Yup.string().required('Status is required'),
        source: sourceValidator(),
      })
    )
    .min(1, 'At least one lead is required'),
});

export const noteFormSchema = Yup.object({
  content: noteValidator(),
});
