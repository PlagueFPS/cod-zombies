import { DetailedHTMLProps, HTMLAttributes } from "react";

interface RichParagraphProps extends DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement> {}


export default function RichParagraph({ children, ...props }: RichParagraphProps) {
  return (
    <p {...props} className="relative z-40">{ children }</p>
  )
}
