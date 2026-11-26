export interface PublicContentConfig {
    announcementEnabled: boolean;
    announcementText: string;
    heroHeadline: string;
    heroSubheadline: string;
    reviewsHeading: string;
    googleReviewUrl: string;
    showReviewsOnWeb: boolean;
}

export const DEFAULT_PUBLIC_CONTENT: PublicContentConfig = {
    announcementEnabled: false,
    announcementText: "",
    heroHeadline: "Specialist Dental & Implant Care in Islamabad",
    heroSubheadline: "Compassionate clinical precision with digital diagnostics, painless procedures, and transparent treatment plans.",
    reviewsHeading: "Verified Patient Stories",
    googleReviewUrl: "",
    showReviewsOnWeb: true,
};

export function mergePublicContent(raw: unknown): PublicContentConfig {
    if (!raw || typeof raw !== "object") return { ...DEFAULT_PUBLIC_CONTENT };
    const r = raw as Partial<PublicContentConfig>;
    return {
        announcementEnabled: Boolean(r.announcementEnabled),
        announcementText: typeof r.announcementText === "string" ? r.announcementText : DEFAULT_PUBLIC_CONTENT.announcementText,
        heroHeadline: typeof r.heroHeadline === "string" && r.heroHeadline.trim() ? r.heroHeadline : DEFAULT_PUBLIC_CONTENT.heroHeadline,
        heroSubheadline: typeof r.heroSubheadline === "string" ? r.heroSubheadline : DEFAULT_PUBLIC_CONTENT.heroSubheadline,
        reviewsHeading: typeof r.reviewsHeading === "string" && r.reviewsHeading.trim() ? r.reviewsHeading : DEFAULT_PUBLIC_CONTENT.reviewsHeading,
        googleReviewUrl: typeof r.googleReviewUrl === "string" ? r.googleReviewUrl : DEFAULT_PUBLIC_CONTENT.googleReviewUrl,
        showReviewsOnWeb: r.showReviewsOnWeb !== undefined ? Boolean(r.showReviewsOnWeb) : true,
    };
}
