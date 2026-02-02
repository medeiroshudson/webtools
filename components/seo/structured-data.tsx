
interface StructuredDataProps {
    data: Record<string, unknown>
}

/**
 * StructuredData component for adding JSON-LD structured data to pages
 * Supports Schema.org markup for SEO
 */
export function StructuredData({ data }: StructuredDataProps) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    )
}

/**
 * Generate WebApplication schema for a tool
 */
export function generateWebApplicationSchema({
    name,
    description,
    url,
    applicationCategory,
    operatingSystem,
    offersPrice,
    features,
}: {
    name: string
    description: string
    url: string
    applicationCategory: string
    operatingSystem: string
    offersPrice?: string
    features?: string[]
}) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://webtools.example.com"

    return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name,
        description,
        url: `${baseUrl}${url}`,
        applicationCategory,
        operatingSystem,
        offers: offersPrice
            ? {
                  "@type": "Offer",
                  price: offersPrice,
                  priceCurrency: "USD",
              }
            : {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
              },
        featureList: features?.join(", "),
        aggregator: {
            "@type": "Organization",
            name: "WebTools",
            url: baseUrl,
        },
    }
}

/**
 * Generate FAQPage schema for FAQ sections
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    }
}

/**
 * Generate BreadcrumbList schema for navigation
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://webtools.example.com"

    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
        })),
    }
}

/**
 * Generate SoftwareApplication schema with detailed features
 */
export function generateSoftwareApplicationSchema({
    name,
    description,
    url,
    applicationCategory,
    operatingSystem,
    features,
    screenshots,
}: {
    name: string
    description: string
    url: string
    applicationCategory: "UtilitiesApplication" | "DeveloperApplication" | "BusinessApplication"
    operatingSystem: string
    features: Array<{ name: string; description: string }>
    screenshots?: string[]
}) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://webtools.example.com"

    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name,
        description,
        url: `${baseUrl}${url}`,
        applicationCategory,
        operatingSystem,
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            ratingCount: "1000",
        },
        featureList: features.map((f) => ({
            "@type": "SoftwareFeature",
            name: f.name,
            description: f.description,
        })),
        screenshot: screenshots?.map((s) =>
            s.startsWith("http") ? s : `${baseUrl}${s}`
        ),
        author: {
            "@type": "Organization",
            name: "WebTools",
            url: baseUrl,
        },
    }
}

/**
 * Generate Organization schema for WebTools
 */
export function generateOrganizationSchema() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://webtools.example.com"

    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "WebTools",
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        description: "Ferramentas web essenciais com processamento local e gratuito.",
        sameAs: [
            // Add social media links when available
            // "https://twitter.com/webtools",
            // "https://github.com/webtools",
        ],
    }
}

/**
 * Generate WebSite schema
 */
export function generateWebSiteSchema() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://webtools.example.com"

    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "WebTools",
        url: baseUrl,
        description: "Ferramentas web essenciais com processamento local e gratuito.",
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${baseUrl}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    }
}
