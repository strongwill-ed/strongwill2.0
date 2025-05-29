import { loadStripe } from '@stripe/stripe-js';

// This will use your actual Stripe publishable key when you provide it
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export { stripePromise };