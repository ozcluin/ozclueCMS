import clientPromise from './mongodb';

// Define TS types matching our DB schemas
export interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  date: string;
  status: 'New' | 'Read' | 'Account Created' | 'Archived';
}

export interface Account {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'Pending Setup' | 'Active' | 'Suspended';
  dateCreated: string;
}

export interface Verification {
  id: string;
  candidateName: string;
  type: 'Employment' | 'Identity' | 'Due Diligence' | 'Compliance';
  clientCompany: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Action Required';
  dateInitiated: string;
  reportUrl: string;
}

const DB_NAME = 'ozclu';

async function getCollection(name: string) {
  const client = await clientPromise;
  return client.db(DB_NAME).collection(name);
}

export async function getSubmissions(): Promise<Submission[]> {
  try {
    const col = await getCollection('submissions');
    const items = await col.find({}).sort({ date: -1 }).toArray();
    return items.map(item => ({
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone || '',
      company: item.company || '',
      message: item.message,
      date: item.date,
      status: item.status,
    })) as Submission[];
  } catch (err) {
    console.error('Error reading submissions from MongoDB:', err);
    return [];
  }
}

export async function addSubmission(submission: Submission): Promise<void> {
  const col = await getCollection('submissions');
  await col.insertOne(submission);
}

export async function updateSubmissionStatus(id: string, status: Submission['status']): Promise<void> {
  const col = await getCollection('submissions');
  await col.updateOne({ id }, { $set: { status } });
}

export async function getAccounts(): Promise<Account[]> {
  try {
    const col = await getCollection('accounts');
    const items = await col.find({}).sort({ dateCreated: -1 }).toArray();
    return items.map(item => ({
      id: item.id,
      name: item.name,
      email: item.email,
      company: item.company || '',
      status: item.status,
      dateCreated: item.dateCreated,
    })) as Account[];
  } catch (err) {
    console.error('Error reading accounts from MongoDB:', err);
    return [];
  }
}

export async function addAccount(account: Account): Promise<void> {
  const col = await getCollection('accounts');
  await col.insertOne(account);
}

export async function updateAccountStatus(id: string, status: Account['status']): Promise<void> {
  const col = await getCollection('accounts');
  await col.updateOne({ id }, { $set: { status } });
}

export async function getVerifications(): Promise<Verification[]> {
  try {
    const col = await getCollection('verifications');
    const items = await col.find({}).sort({ dateInitiated: -1 }).toArray();
    return items.map(item => ({
      id: item.id,
      candidateName: item.candidateName,
      type: item.type,
      clientCompany: item.clientCompany,
      status: item.status,
      dateInitiated: item.dateInitiated,
      reportUrl: item.reportUrl || '',
    })) as Verification[];
  } catch (err) {
    console.error('Error reading verifications from MongoDB:', err);
    return [];
  }
}

export async function addVerification(verification: Verification): Promise<void> {
  const col = await getCollection('verifications');
  await col.insertOne(verification);
}

export async function updateVerificationStatus(id: string, status: Verification['status'], reportUrl?: string): Promise<void> {
  const col = await getCollection('verifications');
  const updateDoc: any = { status };
  if (reportUrl !== undefined) {
    updateDoc.reportUrl = reportUrl;
  }
  await col.updateOne({ id }, { $set: updateDoc });
}

