export type UserRole =
  | 'VISITOR'
  | 'DONOR'
  | 'CAMPAIGNER'
  | 'ADMIN'
  | 'VERIFICATION_AGENT'
  | 'FINANCE_AGENT'
  | 'SUPPORT_AGENT';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface Campaigner {
  id: string;
  userId: string;
  kycStatus: 'NOT_SUBMITTED' | 'PENDING' | 'VERIFIED' | 'REJECTED';
  identityProofType: 'AADHAAR' | 'PAN' | 'PASSPORT';
  identityProofNumberMasked: string;
  address: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}

export type BeneficiaryType = 'INDIVIDUAL_SELF' | 'INDIVIDUAL_OTHER' | 'NGO' | 'INSTITUTION';

export interface Beneficiary {
  id: string;
  campaignId: string;
  type: BeneficiaryType;
  fullNameOrOrgName: string;
  relationshipToCampaigner: string;
  age?: number;
  gender?: string;
  hospitalOrInstitutionName?: string;
  contactPhone?: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

export type CategorySlug = 'MEDICAL' | 'EMERGENCY' | 'NGO_NONPROFIT' | 'EDUCATION' | 'PERSONAL' | 'CREATIVE';

export interface CampaignCategory {
  id: string;
  name: string;
  slug: CategorySlug;
  description: string;
  icon: string;
}

export type CampaignState =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'VERIFICATION_REQUIRED'
  | 'VERIFIED'
  | 'APPROVED'
  | 'LIVE'
  | 'PAUSED'
  | 'COMPLETED'
  | 'CLOSED'
  | 'REJECTED'
  | 'CAMPAIGNER_EDITS'
  | 'SUSPENDED'
  | 'UNDER_INVESTIGATION';

export interface Campaign {
  id: string;
  campaignerId: string;
  campaignerName: string;
  beneficiaryId: string;
  beneficiaryName: string;
  categoryId: CategorySlug;
  categoryName: string;
  title: string;
  slug: string;
  tagline: string;
  storyHtml: string;
  coverImageUrl: string;
  targetGoalAmount: number;
  raisedAmount: number;
  donorCount: number;
  currency: string;
  startDate: string;
  endDate: string;
  state: CampaignState;
  taxBenefitAvailable: boolean;
  taxBenefitType?: '80G' | '501C3';
  isVerifiedBadge: boolean;
  location: string;
  createdAt: string;
}

export type DocumentType =
  | 'AADHAAR'
  | 'PAN'
  | 'MEDICAL_REPORT'
  | 'HOSPITAL_ESTIMATE'
  | 'HOSPITAL_BILL'
  | 'NGO_REGISTRATION'
  | 'NGO_80G'
  | 'NGO_12A'
  | 'FCRA_CERTIFICATE'
  | 'BANK_PROOF';

export type DocumentVerificationStatus = 'UPLOADED' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED_NEEDS_REPLACEMENT';

export interface CampaignDocument {
  id: string;
  campaignId: string;
  documentType: DocumentType;
  fileName: string;
  fileUrl: string;
  verificationStatus: DocumentVerificationStatus;
  reviewedByUserId?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  uploadedAt: string;
}

export interface Verification {
  id: string;
  campaignId: string;
  campaignerVerified: boolean;
  beneficiaryVerified: boolean;
  documentsVerifiedCount: number;
  totalDocumentsRequired: number;
  hospitalVerified?: boolean;
  overallStatus: 'PENDING' | 'IN_PROGRESS' | 'PASSED' | 'FAILED' | 'NEEDS_INFO';
  assignedAgentId?: string;
  lastReviewedAt?: string;
}

export interface CampaignUpdate {
  id: string;
  campaignId: string;
  title: string;
  content: string;
  imageUrl?: string;
  publishedAt: string;
}

export interface Donation {
  id: string;
  campaignId: string;
  donorUserId?: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  tipAmount: number;
  totalPaid: number;
  currency: string;
  isAnonymous: boolean;
  taxBenefitRequested: boolean;
  panNumber?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  createdAt: string;
}

export type PaymentGateway = 'RAZORPAY' | 'STRIPE' | 'MOCK_GATEWAY';

export interface PaymentTransaction {
  id: string;
  donationId: string;
  gateway: PaymentGateway;
  gatewayOrderId: string;
  amount: number;
  currency: string;
  status: 'INITIATED' | 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  completedAt?: string;
}

export type DestinationType = 'HOSPITAL_BANK' | 'BENEFICIARY_BANK' | 'NGO_BANK' | 'CAMPAIGNER_BANK';

export interface WithdrawalRequest {
  id: string;
  campaignId: string;
  amount: number;
  destinationType: DestinationType;
  accountHolderName: string;
  accountNumberMasked: string;
  ifscCode: string;
  bankName: string;
  status: 'REQUESTED' | 'UNDER_VERIFICATION' | 'APPROVED' | 'DISBURSED' | 'REJECTED';
  requestedAt: string;
  disbursedAt?: string;
}

export interface FinancialLedger {
  id: string;
  campaignId: string;
  entryType: 'DONATION' | 'PLATFORM_FEE' | 'PAYMENT_FEE' | 'WITHDRAWAL_DISBURSEMENT';
  referenceId: string;
  debitAmount: number;
  creditAmount: number;
  runningBalance: number;
  timestamp: string;
}
