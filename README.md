## TODO
- (?) Create a seperate form for reporting issues
- rewrite revalidate API
- rewrite Data Access Layer
- find a way to generate BlurHash for images outside of the main app code
- overwrite media in Contentful with new image/avif format images using management API 

## Generating type definitions for content types for Contentful
- Run the following command: 
  `cf-content-types-generator --v10 --spaceId={{SPACE_ID}} --token={{CONTENT_MANAGEMENT_TOKEN}}`