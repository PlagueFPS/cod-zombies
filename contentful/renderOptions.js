import { INLINES, BLOCKS } from '@contentful/rich-text-types'

const website_url = `${process.env.NEXT_PUBLIC_WEBSITE_URL}`

export const renderOptions = {
  renderNode: {
    [INLINES.HYPERLINK]: (node) => {
      return (
        <a href={node.data.uri} target={`${node.data.uri.startsWith(website_url) ? '_self' : '_blank'}`} rel={`${node.data.uri.startsWith(website_url) ? '' : 'noopener noreferrer'}`}>
          { node.content[0].value }
        </a>
      )    
    },
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const url = `https:${node.data.target.fields.file.url}?q=75`
      return (
        <figure>
          <img 
            src={ url } 
            alt={ node.data.target.fields.title }
            className={ `${node.data.target.fields.title.replace(/\s/g, '')}` }
          />
          { node.data.target.fields.description && <figcaption>{ node.data.target.fields.description }</figcaption> }
        </figure>
      )
    }
  }
}