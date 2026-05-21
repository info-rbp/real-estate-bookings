import { ID } from 'appwrite';
import { databases, appwriteConfig } from './appwrite';

export async function createAccessIssue(input: {
  workOrderId: string;
  issueType: string;
  description: string;
  attendanceCommenced: boolean;
  travelCommenced: boolean;
  basePriceExGst: number;
  reattendanceRequired: boolean;
}) {
  const accessIssueFeeExGst = input.basePriceExGst * 0.20;
  const gstAmount = accessIssueFeeExGst * 0.10;
  const totalIncGst = accessIssueFeeExGst + gstAmount;

  const data = {
    workOrderId: input.workOrderId,
    issueType: input.issueType,
    description: input.description,
    attendanceCommenced: input.attendanceCommenced,
    travelCommenced: input.travelCommenced,
    issueDiscoveredAt: new Date().toISOString(),
    accessIssueFeeExGst,
    gstAmount,
    totalIncGst,
    reattendanceRequired: input.reattendanceRequired,
    createdAt: new Date().toISOString(),
  };

  return await databases.createDocument(
    appwriteConfig.databaseId!,
    appwriteConfig.accessIssuesCollectionId!,
    ID.unique(),
    data
  );
}
