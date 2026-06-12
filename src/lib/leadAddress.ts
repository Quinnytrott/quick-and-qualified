export type AddressSource = "manual" | "google_places";

export type LeadAddressInput = {
  address?: string | null;
  formattedAddress?: string | null;
  streetNumber?: string | null;
  streetName?: string | null;
  city?: string | null;
  province?: string | null;
  postalCode?: string | null;
  placeId?: string | null;
  latitude?: string | number | null;
  longitude?: string | number | null;
  addressSource?: string | null;
};

export type LeadAddressDetails = {
  address: string;
  formattedAddress: string;
  streetNumber: string;
  streetName: string;
  streetAddress: string;
  city: string;
  province: string;
  postalCode: string;
  placeId: string;
  latitude: number | null;
  longitude: number | null;
  addressSource: AddressSource;
};

function normalizeWhitespace(value: string | null | undefined): string {
  return value?.trim().replace(/\s+/g, " ") || "";
}

function normalizeCoordinate(value: string | number | null | undefined): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  const trimmed = normalizeWhitespace(value);
  if (!trimmed) {
    return null;
  }

  const coordinate = Number.parseFloat(trimmed);
  return Number.isFinite(coordinate) ? coordinate : null;
}

export function formatStreetAddress(address: Pick<LeadAddressInput, "streetNumber" | "streetName">): string {
  return [address.streetNumber, address.streetName]
    .map((part) => normalizeWhitespace(part))
    .filter(Boolean)
    .join(" ");
}

export function buildLeadAddressDetails(input: LeadAddressInput): LeadAddressDetails {
  const formattedAddress = normalizeWhitespace(input.formattedAddress);
  const rawAddress = normalizeWhitespace(input.address);
  const address = formattedAddress || rawAddress;
  const streetNumber = normalizeWhitespace(input.streetNumber);
  const streetName = normalizeWhitespace(input.streetName);
  const placeId = normalizeWhitespace(input.placeId);
  const addressSource: AddressSource =
    input.addressSource === "google_places" && (placeId || formattedAddress)
      ? "google_places"
      : "manual";

  return {
    address,
    formattedAddress: formattedAddress || address,
    streetNumber,
    streetName,
    streetAddress: formatStreetAddress({ streetNumber, streetName }),
    city: normalizeWhitespace(input.city),
    province: normalizeWhitespace(input.province).toUpperCase(),
    postalCode: normalizeWhitespace(input.postalCode).toUpperCase(),
    placeId,
    latitude: normalizeCoordinate(input.latitude),
    longitude: normalizeCoordinate(input.longitude),
    addressSource,
  };
}
