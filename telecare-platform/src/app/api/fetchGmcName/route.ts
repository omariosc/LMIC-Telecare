import { NextResponse } from "next/server";

// Helper function to convert name to camel case
const toCamelCase = (name: string): { firstName: string; lastName: string } => {
  const words = name.split(" ").filter((word) => word.length > 0);
  if (words.length === 0) return { firstName: "", lastName: "" };

  const formatWord = (word: string) =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

  if (words.length === 1) {
    return { firstName: formatWord(words[0]), lastName: "" };
  }

  // First word is firstName, last word is lastName
  const firstName = formatWord(words[0]);
  const lastName = formatWord(words[words.length - 1]);

  return { firstName, lastName };
};

// Helper function to calculate years of experience
const calculateYearsOfExperience = (registrationDate: string): number => {
  const regDate = new Date(registrationDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - regDate.getTime());
  const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
  return diffYears;
};

// Helper function to extract specialties
const extractSpecialties = (html: string): string[] => {
  const specialtyMatch = html.match(
    /<ul class="speciality-list">([\s\S]*?)<\/ul>/
  );
  if (!specialtyMatch) return [];

  const specialtyItems =
    specialtyMatch[1].match(/<span>(.*?)\s+from\s+/g) || [];
  return specialtyItems
    .map((item) => {
      const match = item.match(/<span>(.*?)\s+from\s+/);
      return match ? match[1].trim() : "";
    })
    .filter((specialty) => specialty.length > 0);
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const gmcNumber = searchParams.get("gmc");

  if (!gmcNumber) {
    return NextResponse.json({ error: "Missing GMC number" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://www.gmc-uk.org/registrants/${gmcNumber}`
    );
    const html = await response.text();

    // Check for licence to practise
    if (!html.includes("Registered with a licence to practise")) {
      return NextResponse.json(
        { error: "Invalid GMC - Not registered with a licence to practise" },
        { status: 400 }
      );
    }

    // Extract practitioner name
    const nameMatch = html.match(
      /<h1 class="c-rg-details__practitioner-name"[^>]*id="registrantNameId"[^>]*>(.*?)<\/h1>/
    );
    const fullName = nameMatch ? nameMatch[1].trim() : null;
    const nameData = fullName
      ? toCamelCase(fullName)
      : { firstName: "", lastName: "" };

    // Extract registration date - look for the specific "Full registration date" structure
    let registrationDate = null;
    let yearsOfExperience = 0;

    // Pattern 1: Look for "Full registration date" followed by the date in a subsequent field-value div
    const fullRegPattern = html.match(
      /<div class="field-value">\s*Full registration date\s*<\/div>\s*<div class="field-value">\s*(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})\s*<\/div>/s
    );
    if (fullRegPattern) {
      registrationDate = fullRegPattern[1].trim();
    }

    // Pattern 2: Alternative structure - look for "Full registration date" text directly followed by date
    if (!registrationDate) {
      const altPattern = html.match(
        /Full registration date[^>]*>.*?(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})/s
      );
      if (altPattern) {
        registrationDate = altPattern[1].trim();
      }
    }

    // Pattern 3: Fallback - look for any date in dd MMM yyyy format near registration context
    if (!registrationDate) {
      const datePattern = html.match(
        /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})/
      );
      if (datePattern) {
        registrationDate = datePattern[1].trim();
      }
    }

    if (registrationDate) {
      yearsOfExperience = calculateYearsOfExperience(registrationDate);
    }

    // Extract designated body (hospital/trust) - look for field-value structure
    let institution = "";

    // Pattern 1: Look for "Designated body" in field-label followed by institution in field-value
    const designatedBodyPattern = html.match(
      /<div class="field-label">\s*Designated body\s*<\/div>\s*<div class="field-value">\s*([^<]+?)\s*<\/div>/s
    );
    if (designatedBodyPattern) {
      institution = designatedBodyPattern[1].trim();
    }

    // Pattern 2: Look for designated body span with ID
    if (!institution || institution.length < 5) {
      const hospitalMatch1 = html.match(
        /<span[^>]*id="designated-body"[^>]*>.*?<\/span>\s*<div[^>]*class="c-rg-details__card-field"[^>]*>\s*([^<]+)/s
      );
      if (hospitalMatch1) {
        institution = hospitalMatch1[1].trim();
      }
    }

    // Pattern 3: Look for "NHS Foundation Trust" or "NHS Trust" or "Hospital" patterns anywhere
    if (!institution || institution.length < 5) {
      const nhsMatch = html.match(
        /([^<>\n\r]*(?:NHS\s+(?:Foundation\s+)?Trust|Hospital|Medical\s+Centre)[^<>\n\r]*)/
      );
      if (nhsMatch) {
        const matched = nhsMatch[1].trim();
        // Clean up the match to remove extra whitespace and HTML artifacts
        institution = matched.replace(/\s+/g, " ").trim();
      }
    }

    // Pattern 4: Fallback - look for any institution name near "designated body" text
    if (!institution || institution.length < 5) {
      const designatedBodyMatch = html.match(
        /designated\s+body[^>]*>.*?<div[^>]*>([^<]+)/is
      );
      if (designatedBodyMatch) {
        institution = designatedBodyMatch[1].trim();
      }
    }

    // Extract specialties
    const specialties = extractSpecialties(html);

    return NextResponse.json({
      valid: true,
      firstName: nameData.firstName,
      lastName: nameData.lastName,
      fullName,
      institution,
      yearsOfExperience,
      specialties: specialties.length > 0 ? specialties : ["Doctor"],
      registrationDate,
    });
  } catch (error) {
    console.error("GMC verification failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch GMC data" },
      { status: 500 }
    );
  }
}
