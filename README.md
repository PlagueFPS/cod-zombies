## TODO
- Create a seperate form for reporting issues 
- Setup discord server for users of the site
- Integrate an API that posts new releases to a discord annoucement channel
- refactor the data access layer to seperately manage the content types
- Adjust any external links to have a visual arrow that it will open a new tab
- (?) a known issues section that pulls issues from a discord forum channel

## Generating type definitions for content types for Contentful
- Run the following command: 
  `cf-content-types-generator --v10 --spaceId={{SPACE_ID}} --token={{CONTENT_MANAGEMENT_TOKEN}}`