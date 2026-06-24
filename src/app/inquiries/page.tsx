import { getSubmissions } from '@/lib/db';
import InquiriesList from '@/components/InquiriesList';

export const dynamic = 'force-dynamic';

export default async function InquiriesPage() {
  const submissions = await getSubmissions();


  return (
    <>
      <div className="page-title-area">
        <div>
          <h1 className="page-title">Contact Inquiries</h1>
          <p className="page-subtitle">Manage client screening proposals and incoming communications.</p>
        </div>
      </div>

      <InquiriesList initialSubmissions={submissions} />
    </>
  );
}
