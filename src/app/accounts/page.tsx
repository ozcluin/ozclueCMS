import { getAccounts } from '@/lib/db';
import AccountsList from '@/components/AccountsList';

export const dynamic = 'force-dynamic';

export default async function AccountsPage() {
  const accounts = await getAccounts();


  return <AccountsList initialAccounts={accounts} />;
}
