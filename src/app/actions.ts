'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import { 
  getSubmissions, 
  getAccounts, 
  getVerifications,
  updateSubmissionStatus as dbUpdateSubmissionStatus,
  addAccount,
  updateAccountStatus as dbUpdateAccountStatus,
  addVerification,
  updateVerificationStatus as dbUpdateVerificationStatus,
  Submission,
  Account,
  Verification
} from '@/lib/db';

// 1. Update Inquiry Status
export async function updateSubmissionStatus(id: string, status: Submission['status']) {
  await dbUpdateSubmissionStatus(id, status);
  revalidatePath('/inquiries');
  revalidatePath('/');
}

// 2. Create Account from Inquiry
export async function createAccountFromInquiry(submissionId: string) {
  const submissions = await getSubmissions();
  const sub = submissions.find(sub => sub.id === submissionId);
  if (!sub) {
    throw new Error('Inquiry not found');
  }

  // Check if account already exists
  const accounts = await getAccounts();
  const existingAccount = accounts.find(acc => acc.email.toLowerCase() === sub.email.toLowerCase());
  
  if (existingAccount) {
    throw new Error('An account with this email already exists.');
  }

  // Create new account
  const newAccount: Account = {
    id: `acc_${Date.now()}`,
    name: sub.name,
    email: sub.email,
    company: sub.company || 'Individual Client',
    status: 'Active',
    dateCreated: new Date().toISOString()
  };

  await addAccount(newAccount);

  // Update submission status
  await dbUpdateSubmissionStatus(submissionId, 'Account Created');

  revalidatePath('/inquiries');
  revalidatePath('/accounts');
  revalidatePath('/');
}

// 3. Create Corporate Account directly
export async function createClientAccount(name: string, email: string, company: string) {
  if (!name || !email || !company) {
    throw new Error('Name, email, and company are required.');
  }

  const accounts = await getAccounts();
  const existingAccount = accounts.find(acc => acc.email.toLowerCase() === email.toLowerCase());
  if (existingAccount) {
    throw new Error('Account email already registered.');
  }

  const newAccount: Account = {
    id: `acc_${Date.now()}`,
    name,
    email,
    company,
    status: 'Active',
    dateCreated: new Date().toISOString()
  };

  await addAccount(newAccount);

  revalidatePath('/accounts');
  revalidatePath('/');
}

// 4. Update Account Status
export async function updateAccountStatus(id: string, status: Account['status']) {
  await dbUpdateAccountStatus(id, status);
  revalidatePath('/accounts');
}

// 5. Create Verification Check Case
export async function createVerificationCase(candidateName: string, type: Verification['type'], clientCompany: string) {
  if (!candidateName || !type || !clientCompany) {
    throw new Error('Candidate name, verification type, and client company are required.');
  }

  const newCase: Verification = {
    id: `ver_${Date.now()}`,
    candidateName,
    type,
    clientCompany,
    status: 'Pending',
    dateInitiated: new Date().toISOString(),
    reportUrl: ''
  };

  await addVerification(newCase);

  revalidatePath('/verifications');
  revalidatePath('/');
}

// 6. Update Verification Status
export async function updateVerificationStatus(id: string, status: Verification['status'], reportUrl?: string) {
  let finalReportUrl = reportUrl;
  
  if (status === 'Completed' && !reportUrl) {
    const verifications = await getVerifications();
    const ver = verifications.find(v => v.id === id);
    if (ver && !ver.reportUrl) {
      // Create mock report URL
      finalReportUrl = `/reports/rep_${ver.candidateName.toLowerCase().replace(/\s+/g, '_')}.pdf`;
    }
  }
  
  await dbUpdateVerificationStatus(id, status, finalReportUrl);
  
  revalidatePath('/verifications');
  revalidatePath('/');
}

// 7. Admin Authentication - Login
export async function loginAdmin(email: string, pass: string): Promise<{ success: boolean; error?: string }> {
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPass = pass.trim();
  
  if (
    ((trimmedEmail === 'pkumar@cluso.in' || trimmedEmail === 'indiaops@cluso.in') && (trimmedPass === 'Cluso@2026' || trimmedPass === 'Ozclu@2026')) ||
    (trimmedEmail === 'pkumar@ozclu.com' && (trimmedPass === 'Ozclu@2026' || trimmedPass === 'Cluso@2026'))
  ) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', trimmedEmail, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    return { success: true };
  }
  
  return { success: false, error: 'Invalid email or password.' };
}

// 8. Admin Authentication - Logout
export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}


