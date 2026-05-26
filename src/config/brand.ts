export const brand = {
  name: import.meta.env.VITE_BRAND_NAME || 'ProInspect',
  legalName: import.meta.env.VITE_BRAND_LEGAL_NAME || 'ProInspect',
  tagline: import.meta.env.VITE_BRAND_TAGLINE || 'Property field support, booked on demand',
  domain: import.meta.env.VITE_BRAND_DOMAIN || 'real-estate.remotebusinesspartner.com.au',
} as const

export function brandTitle(suffix?: string) {
  return suffix ? `${suffix} | ${brand.name}` : brand.name
}
