"use client";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { subscribeToNewsletter } from "@/data/actions";
import { StandardNewsletterFormSchema } from "@/utils/validation-schemas";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import { Spinner } from "../ui/spinner";

export default function NewsletterForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onChangeAsync: StandardNewsletterFormSchema,
      onChangeAsyncDebounceMs: 200,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        const result = await subscribeToNewsletter("", value);

        if (result.success) {
          return startTransition(() => {
            toast.success("Confirmation email sent!", {
              description: result.message,
              duration: 5000,
              position: "bottom-center",
            });

            form.reset();
          });
        }

        startTransition(() => {
          toast.error("Failed to subscribe to newsletter", {
            description: result.message,
            duration: 5000,
            position: "bottom-center",
          });
        });
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit();
  };

  return (
    <form
      id="newsletter-form"
      onSubmit={handleSubmit}
      className="w-full space-y-4"
    >
      <div className="space-y-2">
        <div className="relative">
          <FieldGroup>
            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name} className="sr-only">
                      Email Address
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        required
                        type="email"
                        placeholder="you@example.com"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        className="rounded-sm pr-28"
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          type="submit"
                          form="newsletter-form"
                          variant="default"
                          disabled={isPending || isInvalid}
                          aria-disabled={isPending || isInvalid}
                        >
                          {isPending ? (
                            <>
                              <Spinner />
                              Subscribing
                            </>
                          ) : (
                            "Subscribe"
                          )}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
        </div>
      </div>
    </form>
  );
}
