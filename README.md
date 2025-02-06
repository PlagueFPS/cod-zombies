## Generating type definitions for content types for Contentful
- Run the following command: 
  `cf-content-types-generator --v10 --spaceId={{SPACE_ID}} --token={{CONTENT_MANAGEMENT_TOKEN}}`

## Features
- Individual Quest Guides (Main and Side Quests)
- Quest Step Breakdowns
- Search functionality (By name, Quest Type, grouped by map or game)
- Mobile Responsiveness
- Pagination for both main and side quests
- Table of Contents for both mobile and desktop quest guides
- Video Tutorials for visual learners
- API Integration with Contentful for on-demand revalidation
- "New" and "Coming Soon" badges for new and incoming content
- SEO Optimization (sitemaps, images, etc)
- Draft Mode implementation for content previews
- Resend for emailing subscribed users about new releases
- Automatic removal of "new" badges based on a time limit
- Feedback and Contact forms using `React-Hook-Form` and `Next-Safe-Action` w/ `Zod` for TypeSafety and security
- Tooltips for interactive content within guides providing information on in-game mechanics
- User-Friendly loading states showing the correct structure of content before it is loaded
- User-Friendly error and not-found states allowing them to recover or seamlessly go back to a non-error/not-found state
- Advanced Image Optimization using `next/image`
- Aggresive caching of data fetches to save resources and provide a fast UX
- Partial Prerendering to improve UX and DX
- Previous and Next maps/quests section to allow users to quickly continue consuming related content