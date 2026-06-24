import { getVerifications, getAccounts } from '@/lib/db';
import VerificationsList from '@/components/VerificationsList';

export const dynamic = 'force-dynamic';

export default async function VerificationsPage() {
  const verifications = await getVerifications();
  const accounts = await getAccounts();


  // Extract unique corporate client company names for the initiation form dropdown
  const clientCompanies = Array.from(
    new Set(accounts.map((acc) => acc.company))
  ).filter(Boolean);

  return (
    <VerificationsList 
      initialVerifications={verifications} 
      clientCompanies={clientCompanies} 
    />
  );
}
