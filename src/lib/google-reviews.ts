export interface GooglePlaceReview {
  authorName?: string;
  photoUri?: string;
  rating?: number;
  text?: string;
}

interface PlacesV1Review {
  rating?: number;
  text?: { text?: string };
  authorAttribution?: {
    displayName?: string;
    photoUri?: string;
  };
}

interface PlacesV1Response {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: PlacesV1Review[];
  error?: { message?: string; status?: string };
}

const PLACES_V1_BASE = 'https://places.googleapis.com/v1/places';

export interface GooglePlaceReviewsData {
  averageRating?: number;
  totalReviews?: number;
  reviewsUrl?: string;
  reviews: GooglePlaceReview[];
}

export async function getGooglePlaceReviews(limit = 3): Promise<GooglePlaceReviewsData> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACES_PLACE_ID;

  if (!apiKey || !placeId) return { reviews: [] };

  const response = await fetch(`${PLACES_V1_BASE}/${placeId}?languageCode=it`, {
    method: 'GET',
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'reviews,rating,userRatingCount,googleMapsUri',
    },
    next: { revalidate: 60 * 60 * 6 },
  });

  if (!response.ok) {
    console.error('Google Places API HTTP error:', response.status);
    return { reviews: [] };
  }

  const payload = (await response.json()) as PlacesV1Response;

  if (payload.error) {
    console.error('Google Places API error:', payload.error.status, payload.error.message);
    return { reviews: [] };
  }

  return {
    averageRating: payload.rating,
    totalReviews: payload.userRatingCount,
    reviewsUrl: payload.googleMapsUri,
    reviews: (payload.reviews ?? []).slice(0, limit).map((r) => ({
      authorName: r.authorAttribution?.displayName,
      photoUri: r.authorAttribution?.photoUri,
      rating: r.rating,
      text: r.text?.text,
    })),
  };
}
