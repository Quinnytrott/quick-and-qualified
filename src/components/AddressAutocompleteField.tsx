"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { QUOTE_FORM_COPY } from "@/lib/business";

type AddressDetails = {
  formattedAddress: string;
  streetNumber: string;
  streetName: string;
  city: string;
  province: string;
  postalCode: string;
  placeId: string;
  latitude: string;
  longitude: string;
  addressSource: "manual" | "google_places";
};

type AddressAutocompleteFieldProps = {
  className: string;
};

type GoogleAddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

type GooglePlaceResult = {
  address_components?: GoogleAddressComponent[];
  formatted_address?: string;
  geometry?: {
    location?: {
      lat: () => number;
      lng: () => number;
    };
  };
  place_id?: string;
};

type GoogleMapsListener = {
  remove?: () => void;
};

type GoogleAutocomplete = {
  addListener: (eventName: "place_changed", handler: () => void) => GoogleMapsListener;
  getPlace: () => GooglePlaceResult;
};

type GoogleMapsGlobal = {
  maps?: {
    event?: {
      clearInstanceListeners: (instance: unknown) => void;
    };
    places?: {
      Autocomplete: new (
        input: HTMLInputElement,
        options: {
          fields: string[];
          types: string[];
        },
      ) => GoogleAutocomplete;
    };
  };
};

type Q2Window = Window &
  typeof globalThis & {
    google?: GoogleMapsGlobal;
    __q2GoogleMapsLoaded?: () => void;
    __q2GoogleMapsPromise?: Promise<void>;
  };

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const EMPTY_ADDRESS_DETAILS: AddressDetails = {
  formattedAddress: "",
  streetNumber: "",
  streetName: "",
  city: "",
  province: "",
  postalCode: "",
  placeId: "",
  latitude: "",
  longitude: "",
  addressSource: "manual",
};

function getAddressComponent(
  components: GoogleAddressComponent[] | undefined,
  type: string,
  name: "long_name" | "short_name" = "long_name",
): string {
  return components?.find((component) => component.types.includes(type))?.[name] || "";
}

function getCity(components: GoogleAddressComponent[] | undefined): string {
  return (
    getAddressComponent(components, "locality") ||
    getAddressComponent(components, "postal_town") ||
    getAddressComponent(components, "sublocality_level_1") ||
    getAddressComponent(components, "administrative_area_level_3")
  );
}

function loadGooglePlaces(): Promise<void> {
  const q2Window = window as Q2Window;

  if (q2Window.google?.maps?.places?.Autocomplete) {
    return Promise.resolve();
  }

  if (q2Window.__q2GoogleMapsPromise) {
    return q2Window.__q2GoogleMapsPromise;
  }

  q2Window.__q2GoogleMapsPromise = new Promise((resolve, reject) => {
    q2Window.__q2GoogleMapsLoaded = () => resolve();

    const existingScript = document.querySelector<HTMLScriptElement>("script[data-q2-google-maps='places']");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Google Maps script failed to load.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    const params = new URLSearchParams({
      key: GOOGLE_MAPS_API_KEY,
      libraries: "places",
      loading: "async",
      callback: "__q2GoogleMapsLoaded",
    });

    script.async = true;
    script.dataset.q2GoogleMaps = "places";
    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    script.onerror = () => reject(new Error("Google Maps script failed to load."));
    document.head.appendChild(script);
  });

  return q2Window.__q2GoogleMapsPromise;
}

export function AddressAutocompleteField({ className }: AddressAutocompleteFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [addressDetails, setAddressDetails] = useState<AddressDetails>(EMPTY_ADDRESS_DETAILS);
  const [hasAutocomplete, setHasAutocomplete] = useState(false);

  const clearSelectedAddress = useCallback(() => {
    setAddressDetails((current) =>
      current.addressSource === "manual" ? current : EMPTY_ADDRESS_DETAILS,
    );
  }, []);

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY || !inputRef.current) {
      return;
    }

    let autocomplete: GoogleAutocomplete | null = null;
    let listener: GoogleMapsListener | null = null;
    let isCancelled = false;

    loadGooglePlaces()
      .then(() => {
        const q2Window = window as Q2Window;
        const input = inputRef.current;
        const Autocomplete = q2Window.google?.maps?.places?.Autocomplete;

        if (isCancelled || !input || !Autocomplete) {
          return;
        }

        autocomplete = new Autocomplete(input, {
          fields: ["address_components", "formatted_address", "geometry", "place_id"],
          types: ["address"],
        });
        listener = autocomplete.addListener("place_changed", () => {
          if (!autocomplete || !inputRef.current) {
            return;
          }

          const place = autocomplete.getPlace();
          const formattedAddress = place.formatted_address || inputRef.current.value.trim();
          const latitude = place.geometry?.location?.lat();
          const longitude = place.geometry?.location?.lng();

          inputRef.current.value = formattedAddress;
          setAddressDetails({
            formattedAddress,
            streetNumber: getAddressComponent(place.address_components, "street_number"),
            streetName: getAddressComponent(place.address_components, "route"),
            city: getCity(place.address_components),
            province: getAddressComponent(place.address_components, "administrative_area_level_1", "short_name"),
            postalCode: getAddressComponent(place.address_components, "postal_code"),
            placeId: place.place_id || "",
            latitude: typeof latitude === "number" ? String(latitude) : "",
            longitude: typeof longitude === "number" ? String(longitude) : "",
            addressSource: "google_places",
          });
        });
        setHasAutocomplete(true);
      })
      .catch(() => {
        if (!isCancelled) {
          setHasAutocomplete(false);
        }
      });

    return () => {
      isCancelled = true;
      listener?.remove?.();
      if (autocomplete) {
        (window as Q2Window).google?.maps?.event?.clearInstanceListeners(autocomplete);
      }
    };
  }, []);

  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) {
      return;
    }

    const handleReset = () => setAddressDetails(EMPTY_ADDRESS_DETAILS);
    form.addEventListener("reset", handleReset);

    return () => form.removeEventListener("reset", handleReset);
  }, []);

  return (
    <div>
      <label className="text-sm font-medium text-zinc-800" htmlFor="address">
        {QUOTE_FORM_COPY.addressLabel}
      </label>
      <input
        ref={inputRef}
        required
        autoComplete="street-address"
        className={className}
        id="address"
        name="address"
        onChange={clearSelectedAddress}
        placeholder={QUOTE_FORM_COPY.addressPlaceholder}
        type="text"
      />
      <p className="mt-2 text-sm text-zinc-600">
        {hasAutocomplete ? QUOTE_FORM_COPY.addressAutocompleteHelpText : QUOTE_FORM_COPY.addressHelpText}
      </p>
      <input readOnly name="formattedAddress" type="hidden" value={addressDetails.formattedAddress} />
      <input readOnly name="streetNumber" type="hidden" value={addressDetails.streetNumber} />
      <input readOnly name="streetName" type="hidden" value={addressDetails.streetName} />
      <input readOnly name="city" type="hidden" value={addressDetails.city} />
      <input readOnly name="province" type="hidden" value={addressDetails.province} />
      <input readOnly name="postalCode" type="hidden" value={addressDetails.postalCode} />
      <input readOnly name="placeId" type="hidden" value={addressDetails.placeId} />
      <input readOnly name="latitude" type="hidden" value={addressDetails.latitude} />
      <input readOnly name="longitude" type="hidden" value={addressDetails.longitude} />
      <input readOnly name="addressSource" type="hidden" value={addressDetails.addressSource} />
    </div>
  );
}
