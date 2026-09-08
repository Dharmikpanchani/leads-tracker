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

export const emailValidator = (label = 'Email', min = 5, max = 100) =>
  Yup.string()
    .trim()
    .min(min, `${label} must be at least ${min} characters`)
    .max(max, `${label} cannot exceed ${max} characters`)
    .email(`Please enter a valid email address`)
    .test('no-spaces', `${label} cannot contain spaces`, (val) => !val || !/\s/.test(val))
    .test('no-only-spaces', `${label} cannot be empty spaces`, (val) => !!val && val.trim().length > 0)
    .required(`${label} is required`);

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
