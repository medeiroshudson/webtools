import { MetadataRoute } from "next"

/**
 * Dynamic sitemap generation for WebTools
 * Generates comprehensive XML sitemap for search engines
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://webtools.example.com"
  const currentDate = new Date()

  // Static pages - Main pages with high priority
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/json-formatter`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/xml-formatter`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/notes`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ]

  // PDF Tools - Individual tool pages
  const pdfTools = ["merge", "split", "compress"] as const
  const pdfPages: MetadataRoute.Sitemap = pdfTools.map((tool) => ({
    url: `${baseUrl}/pdf-tools/${tool}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  // Base64 Tools - Individual tool pages
  const base64Tools = ["text", "image", "file"] as const
  const base64Pages: MetadataRoute.Sitemap = base64Tools.map((tool) => ({
    url: `${baseUrl}/base64-tools/${tool}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  // PDF Tools hub page
  const pdfHubPage: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/pdf-tools`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ]

  // Base64 Tools hub page
  const base64HubPage: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/base64-tools`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ]

  return [...staticPages, ...pdfPages, ...base64Pages, ...pdfHubPage, ...base64HubPage]
}
