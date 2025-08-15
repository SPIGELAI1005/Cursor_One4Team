'use client';

import { TenantProvider } from '../../contexts/TenantContext';
import { LanguageProvider } from '../../contexts/LanguageContext';

interface ProvidersLayoutProps {
  children: React.ReactNode;
}

/**
 * Providers Layout - Wraps the app with necessary context providers
 * 
 * This layout provides:
 * 1. TenantProvider - Club context and tenant-aware functionality
 * 2. LanguageContext - Internationalization support
 * 3. Other providers as needed
 */
export default function ProvidersLayout({ children }: ProvidersLayoutProps) {
  return (
    <LanguageProvider>
      <TenantProvider>
        {children}
      </TenantProvider>
    </LanguageProvider>
  );
} 