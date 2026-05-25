import type { BookingStepId } from '../../config/serviceBookingConfig'
import type { BookingDetails, UpdateDetails } from './types'

interface ServiceSpecificDetailsStepProps {
  stepId: BookingStepId
  details: BookingDetails
  updateDetails: UpdateDetails
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-bold text-on-surface mb-2">{label}</label>
      {children}
    </div>
  )
}

function inputValue(details: BookingDetails, key: string) {
  return String(details[key] ?? '')
}

export function ServiceSpecificDetailsStep({ stepId, details, updateDetails }: ServiceSpecificDetailsStepProps) {
  if (stepId === 'property_condition_report_details') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Occupancy Status"><select value={inputValue(details, 'occupancyStatus')} onChange={(event) => updateDetails('occupancyStatus', event.target.value)} className="terris-input"><option value="">Select</option><option value="vacant">Vacant</option><option value="tenanted">Tenanted</option><option value="pre-tenancy">Pre-tenancy</option><option value="new-management">New management</option><option value="other">Other</option></select></Field>
        <Field label="Furnished Status"><select value={inputValue(details, 'furnishedStatus')} onChange={(event) => updateDetails('furnishedStatus', event.target.value)} className="terris-input"><option value="">Select</option><option value="furnished">Furnished</option><option value="unfurnished">Unfurnished</option><option value="partially-furnished">Partially furnished</option><option value="unknown">Unknown</option></select></Field>
        <Field label="Required System"><input value={inputValue(details, 'requiredSystem')} onChange={(event) => updateDetails('requiredSystem', event.target.value)} className="terris-input" /></Field>
        <Field label="Required Template"><input value={inputValue(details, 'requiredTemplate')} onChange={(event) => updateDetails('requiredTemplate', event.target.value)} className="terris-input" /></Field>
        <Field label="Upload Destination"><input value={inputValue(details, 'uploadDestination')} onChange={(event) => updateDetails('uploadDestination', event.target.value)} className="terris-input" /></Field>
      </div>
    )
  }

  if (stepId === 'routine_inspection_details') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="flex items-center gap-3"><input type="checkbox" checked={Boolean(details.tenantNotified)} onChange={(event) => updateDetails('tenantNotified', event.target.checked)} className="w-5 h-5" /><span className="text-sm font-medium">Tenant notified</span></label>
        <Field label="Notice Served Date"><input type="date" value={inputValue(details, 'noticeServedDate')} onChange={(event) => updateDetails('noticeServedDate', event.target.value)} className="terris-input" /></Field>
        <Field label="Tenant Contact Name"><input value={inputValue(details, 'tenantContactName')} onChange={(event) => updateDetails('tenantContactName', event.target.value)} className="terris-input" /></Field>
        <Field label="Tenant Contact Phone"><input value={inputValue(details, 'tenantContactPhone')} onChange={(event) => updateDetails('tenantContactPhone', event.target.value)} className="terris-input" /></Field>
        <Field label="Tenant Contact Email"><input value={inputValue(details, 'tenantContactEmail')} onChange={(event) => updateDetails('tenantContactEmail', event.target.value)} className="terris-input" /></Field>
        <Field label="Inspection Focus"><textarea value={inputValue(details, 'inspectionFocus')} onChange={(event) => updateDetails('inspectionFocus', event.target.value)} className="terris-input min-h-[90px]" /></Field>
        <Field label="Known Issues"><textarea value={inputValue(details, 'knownIssues')} onChange={(event) => updateDetails('knownIssues', event.target.value)} className="terris-input min-h-[90px]" /></Field>
        <Field label="Owner Focus Areas"><textarea value={inputValue(details, 'ownerFocusAreas')} onChange={(event) => updateDetails('ownerFocusAreas', event.target.value)} className="terris-input min-h-[90px]" /></Field>
      </div>
    )
  }

  if (stepId === 'exit_inspection_details') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Vacate Date"><input type="date" value={inputValue(details, 'vacateDate')} onChange={(event) => updateDetails('vacateDate', event.target.value)} className="terris-input" /></Field>
        <Field label="Tenant Possession Status"><select value={inputValue(details, 'tenantPossessionStatus')} onChange={(event) => updateDetails('tenantPossessionStatus', event.target.value)} className="terris-input"><option value="">Select</option><option value="vacated">Vacated</option><option value="still_in_possession">Still in possession</option><option value="unknown">Unknown</option></select></Field>
        <label className="flex items-center gap-3"><input type="checkbox" checked={Boolean(details.keysReturned)} onChange={(event) => updateDetails('keysReturned', event.target.checked)} className="w-5 h-5" /><span className="text-sm font-medium">Keys returned</span></label>
        <label className="flex items-center gap-3"><input type="checkbox" checked={Boolean(details.originalPcrAvailable)} onChange={(event) => updateDetails('originalPcrAvailable', event.target.checked)} className="w-5 h-5" /><span className="text-sm font-medium">Original PCR available</span></label>
        <Field label="Original PCR File ID or Reference"><input value={inputValue(details, 'originalPcrFileId') || inputValue(details, 'originalPcrReference')} onChange={(event) => updateDetails('originalPcrFileId', event.target.value)} className="terris-input" /></Field>
        {['cleaningConcerns', 'damageConcerns', 'gardenConcerns', 'missingItemsConcerns', 'bondRelatedNotes'].map((key) => <Field key={key} label={key.replace(/([A-Z])/g, ' $1')}><textarea value={inputValue(details, key)} onChange={(event) => updateDetails(key, event.target.value)} className="terris-input min-h-[80px]" /></Field>)}
      </div>
    )
  }

  if (stepId === 'key_collection' || stepId === 'installation_details') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stepId === 'key_collection' ? (
          <>
            <Field label="Key Collection Address"><input value={inputValue(details, 'keyCollectionAddress')} onChange={(event) => updateDetails('keyCollectionAddress', event.target.value)} className="terris-input" /></Field>
            <Field label="Key Collection Suburb"><input value={inputValue(details, 'keyCollectionSuburb')} onChange={(event) => updateDetails('keyCollectionSuburb', event.target.value)} className="terris-input" /></Field>
            <Field label="Key Collection Postcode"><input value={inputValue(details, 'keyCollectionPostcode')} onChange={(event) => updateDetails('keyCollectionPostcode', event.target.value)} className="terris-input" /></Field>
            <Field label="Collection Contact Name"><input value={inputValue(details, 'keyCollectionContactName')} onChange={(event) => updateDetails('keyCollectionContactName', event.target.value)} className="terris-input" /></Field>
            <Field label="Collection Contact Phone"><input value={inputValue(details, 'keyCollectionContactPhone')} onChange={(event) => updateDetails('keyCollectionContactPhone', event.target.value)} className="terris-input" /></Field>
            <Field label="Collection Contact Email"><input value={inputValue(details, 'keyCollectionContactEmail')} onChange={(event) => updateDetails('keyCollectionContactEmail', event.target.value)} className="terris-input" /></Field>
            <Field label="Collection Instructions"><textarea value={inputValue(details, 'keyCollectionInstructions')} onChange={(event) => updateDetails('keyCollectionInstructions', event.target.value)} className="terris-input min-h-[90px]" /></Field>
          </>
        ) : (
          <>
            <Field label="Device Type"><select value={inputValue(details, 'deviceType')} onChange={(event) => updateDetails('deviceType', event.target.value)} className="terris-input"><option value="">Select</option><option value="lockbox">Lockbox</option><option value="key_safe">Key safe</option><option value="keys_only">Keys only</option><option value="other">Other</option></select></Field>
            <Field label="Device Supplied By"><select value={inputValue(details, 'deviceSuppliedBy')} onChange={(event) => updateDetails('deviceSuppliedBy', event.target.value)} className="terris-input"><option value="">Select</option><option value="client">Client</option><option value="rent_on_time">Rent On Time</option><option value="property">Property</option><option value="other">Other</option></select></Field>
            <Field label="Installation Location"><input value={inputValue(details, 'installationLocation')} onChange={(event) => updateDetails('installationLocation', event.target.value)} className="terris-input" /></Field>
            <Field label="Installation Restrictions"><input value={inputValue(details, 'installationRestrictions')} onChange={(event) => updateDetails('installationRestrictions', event.target.value)} className="terris-input" /></Field>
            <label className="flex items-center gap-3"><input type="checkbox" checked={Boolean(details.photoConfirmationRequired)} onChange={(event) => updateDetails('photoConfirmationRequired', event.target.checked)} className="w-5 h-5" /><span className="text-sm font-medium">Photo confirmation required</span></label>
            <label className="flex items-center gap-3"><input type="checkbox" checked={Boolean(details.keyReturnRequired)} onChange={(event) => updateDetails('keyReturnRequired', event.target.checked)} className="w-5 h-5" /><span className="text-sm font-medium">Key return required</span></label>
            <Field label="Key Return Address"><input value={inputValue(details, 'keyReturnAddress')} onChange={(event) => updateDetails('keyReturnAddress', event.target.value)} className="terris-input" /></Field>
          </>
        )}
      </div>
    )
  }

  if (stepId === 'maintenance_details' || stepId === 'contractor_approval') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stepId === 'maintenance_details' ? (
          <>
            <Field label="Maintenance Category"><input value={inputValue(details, 'maintenanceCategory')} onChange={(event) => updateDetails('maintenanceCategory', event.target.value)} className="terris-input" /></Field>
            <Field label="Urgency Level"><select value={inputValue(details, 'urgencyLevel')} onChange={(event) => updateDetails('urgencyLevel', event.target.value)} className="terris-input"><option value="">Select</option><option value="low">Low</option><option value="normal">Normal</option><option value="urgent">Urgent</option><option value="emergency">Emergency</option></select></Field>
            <Field label="Issue Description"><textarea value={inputValue(details, 'issueDescription')} onChange={(event) => updateDetails('issueDescription', event.target.value)} className="terris-input min-h-[100px]" /></Field>
            <Field label="Tenant Impact"><textarea value={inputValue(details, 'tenantImpact')} onChange={(event) => updateDetails('tenantImpact', event.target.value)} className="terris-input min-h-[100px]" /></Field>
            <Field label="Existing Photos"><textarea value={inputValue(details, 'existingPhotos')} onChange={(event) => updateDetails('existingPhotos', event.target.value)} className="terris-input min-h-[80px]" /></Field>
          </>
        ) : (
          <>
            <label className="flex items-center gap-3"><input type="checkbox" checked={Boolean(details.contractorAssigned)} onChange={(event) => updateDetails('contractorAssigned', event.target.checked)} className="w-5 h-5" /><span className="text-sm font-medium">Contractor assigned</span></label>
            <Field label="Owner Approval Status"><select value={inputValue(details, 'ownerApprovalStatus')} onChange={(event) => updateDetails('ownerApprovalStatus', event.target.value)} className="terris-input"><option value="">Select</option><option value="approved">Approved</option><option value="pending">Pending</option><option value="not_required">Not required</option><option value="unknown">Unknown</option></select></Field>
            <Field label="Contractor Name"><input value={inputValue(details, 'contractorName')} onChange={(event) => updateDetails('contractorName', event.target.value)} className="terris-input" /></Field>
            <Field label="Contractor Phone"><input value={inputValue(details, 'contractorPhone')} onChange={(event) => updateDetails('contractorPhone', event.target.value)} className="terris-input" /></Field>
            <Field label="Contractor Email"><input value={inputValue(details, 'contractorEmail')} onChange={(event) => updateDetails('contractorEmail', event.target.value)} className="terris-input" /></Field>
            <Field label="Approved Spend Limit"><input value={inputValue(details, 'approvedSpendLimit')} onChange={(event) => updateDetails('approvedSpendLimit', event.target.value)} className="terris-input" /></Field>
            <label className="flex items-center gap-3"><input type="checkbox" checked={Boolean(details.quoteRequired)} onChange={(event) => updateDetails('quoteRequired', event.target.checked)} className="w-5 h-5" /><span className="text-sm font-medium">Quote required</span></label>
            <Field label="Attendance Purpose"><input value={inputValue(details, 'attendancePurpose')} onChange={(event) => updateDetails('attendancePurpose', event.target.value)} className="terris-input" /></Field>
          </>
        )}
      </div>
    )
  }

  if (['claim_details', 'claim_scope', 'stakeholders', 'documents'].includes(stepId)) {
    const groups: Record<string, string[]> = {
      claim_details: ['claimNumber', 'insurerName', 'policyNumber', 'eventType', 'eventDate'],
      claim_scope: ['damageAreas', 'requiredPhotos', 'requiredObservations', 'safetyRisks'],
      stakeholders: ['claimContactName', 'claimContactPhone', 'claimContactEmail', 'lossAdjusterName'],
      documents: ['supportingDocuments'],
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups[stepId].map((key) => (
          <Field key={key} label={key.replace(/([A-Z])/g, ' $1')}>
            {key === 'eventDate' ? <input type="date" value={inputValue(details, key)} onChange={(event) => updateDetails(key, event.target.value)} className="terris-input" /> : key.includes('Photos') || key.includes('Observations') || key.includes('Documents') || key.includes('Areas') || key.includes('Risks') ? <textarea value={inputValue(details, key)} onChange={(event) => updateDetails(key, event.target.value)} className="terris-input min-h-[90px]" /> : <input value={inputValue(details, key)} onChange={(event) => updateDetails(key, event.target.value)} className="terris-input" />}
          </Field>
        ))}
      </div>
    )
  }

  if (stepId === 'attendee_capture') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="flex items-center gap-3"><input type="checkbox" checked={Boolean(details.attendeeCaptureRequired)} onChange={(event) => updateDetails('attendeeCaptureRequired', event.target.checked)} className="w-5 h-5" /><span className="text-sm font-medium">Attendee capture required</span></label>
        <Field label="Attendee Capture Method"><select value={inputValue(details, 'attendeeCaptureMethod')} onChange={(event) => updateDetails('attendeeCaptureMethod', event.target.value)} className="terris-input"><option value="none">None</option><option value="upload">Upload</option><option value="enter_in_system">Enter in system</option><option value="return_notes">Return notes</option></select></Field>
        <Field label="Attendee Upload Destination"><input value={inputValue(details, 'attendeeUploadDestination')} onChange={(event) => updateDetails('attendeeUploadDestination', event.target.value)} className="terris-input" /></Field>
      </div>
    )
  }

  return null
}
