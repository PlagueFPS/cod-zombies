import { DetailedHTMLProps, HTMLAttributes } from "react";

interface RichParagraphProps extends DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement> {}


export default function RichParagraph({ children, ...props }: RichParagraphProps) {
  return (
    <p {...props}>{ children }</p>
  )
}
