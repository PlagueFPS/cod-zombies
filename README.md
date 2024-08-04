## TODO
- Create new branch using Next.js 15 after publishing site
- Once on Next.js 15 enable PPR and use `unstable_nostore()` in `<Copyright />` component

## Generating type definitions for content types for Contentful
- Run the following command: 
  `cf-content-types-generator --v10 --spaceId={{SPACE_ID}} --token={{CONTENT_MANAGEMENT_TOKEN}}`