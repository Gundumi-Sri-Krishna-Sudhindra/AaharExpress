import * as Yup from 'yup';

const MAX_DONATION_AMOUNT = 1000000; // 10 Lakh INR

export const loginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  rememberMe: Yup.boolean()
});

export const signupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  role: Yup.string()
    .oneOf(['user', 'admin', 'customer', 'restaurant', 'delivery_agent'], 'Invalid role selected')
    .required('Role is required')
});

export const donationSchema = Yup.object().shape({
  amount: Yup.number()
    .min(1, 'Donation amount must be at least ₹1')
    .max(MAX_DONATION_AMOUNT, `Maximum donation amount is ₹${MAX_DONATION_AMOUNT.toLocaleString()}`)
    .required('Donation amount is required'),
  message: Yup.string()
    .max(200, 'Message must be at most 200 characters'),
  anonymous: Yup.boolean()
}); 