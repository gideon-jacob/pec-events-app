import { getSignedUrl } from "aws-cloudfront-sign";

/**
 * Normalize a PEM private key coming from environment variables.
 * Many deployment platforms require storing PEMs with escaped \n characters.
 * This function restores proper line breaks and ensures BEGIN/END blocks exist on separate lines.
 */
function normalizePrivateKey(pem: string): string {
  // If the string contains literal "\n" sequences but not actual newlines, replace them
  const hasEscapedNewlines = /\\n/.test(pem);
  const hasRealNewlines = /\n/.test(pem);
  let normalized = pem;
  if (hasEscapedNewlines && !hasRealNewlines) {
    normalized = pem.replace(/\\n/g, "\n");
  }

  // Ensure header/footer are on their own lines
  // Also handle cases where spaces are around the markers
  normalized = normalized
    .replace(/\s*-+BEGIN PRIVATE KEY-+\s*/g, "-----BEGIN PRIVATE KEY-----\n")
    .replace(/\s*-+END PRIVATE KEY-+\s*/g, "\n-----END PRIVATE KEY-----\n");

  return normalized.trim();
}

/**
 * Signs a given CloudFront URL with a private key for secure, time-limited access.
 * @param url - The original CloudFront URL to sign.
 * @returns The signed URL with an expiration time.
 */
export function signUrl(url: string): string {
  const keyPairId = process.env.CLOUDFRONT_KEY_PAIR_ID;
  if (!keyPairId) {
    console.error("CloudFront key pair ID is not configured in environment variables");
    throw new Error("CloudFront key pair ID is not configured.");
  }

  const privateKey = process.env.CLOUDFRONT_SECRET_PRIVATE_KEY;
  if (!privateKey) {
    console.error("CloudFront private key is not configured in environment variables");
    throw new Error("CloudFront private key is not configured.");
  }

  const normalizedKey = normalizePrivateKey(privateKey);

  // Basic sanity check to avoid confusing runtime errors
  if (!/^-----BEGIN PRIVATE KEY-----[\s\S]*-----END PRIVATE KEY-----$/.test(normalizedKey)) {
    console.error("CloudFront private key appears malformed after normalization");
    throw new Error(
      "CloudFront private key is malformed. Ensure the full PEM including BEGIN/END lines and proper line breaks."
    );
  }

  const signedUrl = getSignedUrl(url, {
    keypairId: keyPairId,
    privateKeyString: normalizedKey,
    expireTime: new Date().getTime() + 24 * 60 * 60 * 1000, // 1 day in ms
  });

  return signedUrl;
}

/**
 * Formats a time string (e.g., "14:30:00" or "14:30") into a user-friendly "H:MM AM/PM" format.
 * @param timeString - The time string to format.
 * @returns The formatted time string.
 */
export function formatTime(timeString: string): string {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":").map(Number);

  const date = new Date();
  date.setHours(hours, minutes);

  let formattedHours = date.getHours();
  const ampm = formattedHours >= 12 ? "PM" : "AM";
  formattedHours = formattedHours % 12;
  formattedHours = formattedHours ? formattedHours : 12; // the hour '0' should be '12'
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

/**
 * Formats a date string (YYYY-MM-DD) into a user-friendly "DD Mon, YYYY" format.
 * @param dateString - The date string to format.
 * @returns The formatted date string.
 */
export function formatDateToDDMonYYYY(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" };
  const [day, month, year] = date.toLocaleDateString("en-IN", options).split(" ");
  return `${day} ${month}, ${year}`;
}
