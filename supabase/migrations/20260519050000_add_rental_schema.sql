
CREATE TABLE "properties" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" text NOT NULL,
    "description" text,
    "address" text,
    "details" jsonb,
    "rentalType" text,
    "rooms" jsonb,
    "propertyLevelRent" integer,
    "propertyLevelBond" integer,
    "images" text[],
    "features" text[],
    "availability" boolean DEFAULT true,
    "isFeatured" boolean DEFAULT false,
    "createdAt" timestamptz DEFAULT now(),
    "updatedAt" timestamptz DEFAULT now()
);

CREATE TABLE "applications" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "propertyId" uuid REFERENCES properties(id),
    "applicantDetails" jsonb,
    "status" text DEFAULT 'pending',
    "submissionDate" timestamptz DEFAULT now()
);

CREATE TABLE "inspectionSlots" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "propertyId" uuid REFERENCES properties(id),
    "dateTime" timestamptz NOT NULL,
    "availabilityStatus" text DEFAULT 'available'
);

CREATE TABLE "adminUsers" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" text UNIQUE NOT NULL,
    "createdAt" timestamptz DEFAULT now()
);

CREATE TABLE "landlordSubmissions" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "landlord" jsonb,
    "property" jsonb,
    "status" text DEFAULT 'pending',
    "createdAt" timestamptz DEFAULT now()
);

CREATE TABLE "inspections" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "propertyId" uuid REFERENCES properties(id),
    "propertyTitle" text,
    "startDateTime" timestamptz NOT NULL,
    "registeredCount" integer DEFAULT 0,
    "attendeeCap" integer DEFAULT 20,
    "status" text DEFAULT 'scheduled',
    "createdAt" timestamptz DEFAULT now()
);
