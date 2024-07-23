import { Button, ButtonProps } from "../ui/button";
import { useFormStatus } from "react-dom";

interface SubmitButtonProps extends ButtonProps {}

export default function SubmitButton({ className, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" aria-disabled={ pending } disabled={ pending } className={ className } {...props}>
      { pending ? "Submitting..." : "Submit" }
    </Button>
  )
}
