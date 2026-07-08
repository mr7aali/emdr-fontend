export const AppConstants = {
  Secret_key: process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || "",
  Publishable_key: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
};
