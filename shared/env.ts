/** Typed access to automation env. Never log passwords. */

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing env ${name}. Copy .env.example to .env and fill it in.`);
  }
  return value;
}

function optional(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

export const env = {
  customerBaseURL: () =>
    optional('CUSTOMER_BASE_URL') ?? 'http://localhost:3000',
  adminBaseURL: () => optional('ADMIN_BASE_URL') ?? 'http://localhost:3001',
  tenantSlug: () => optional('TENANT_SLUG') ?? 'sunmade',
  adminEmail: () => optional('ADMIN_EMAIL') ?? 'demo.owner@example.com',
  adminPassword: () => optional('ADMIN_PASSWORD') ?? 'Sunmade-Demo-2026!',
  customerEmail: () => optional('CUSTOMER_EMAIL'),
  customerPassword: () => optional('CUSTOMER_PASSWORD'),
  propertySlug: () => optional('PROPERTY_SLUG'),
  requireAdminCredentials(): { email: string; password: string } {
    return {
      email: required('ADMIN_EMAIL'),
      password: required('ADMIN_PASSWORD'),
    };
  },
  hasAdminCredentials(): boolean {
    return Boolean(optional('ADMIN_EMAIL') && optional('ADMIN_PASSWORD'));
  },
  hasCustomerCredentials(): boolean {
    return Boolean(optional('CUSTOMER_EMAIL') && optional('CUSTOMER_PASSWORD'));
  },
};
