interface ImportMetaEnv {
  readonly PUBLIC_STRIPE_KEY: string;
  readonly PRIVATE_STRIPE_SECRET_KEY: string;
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
