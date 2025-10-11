"use client";
import { CircleAlert, Send, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState, useTransition, useRef } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { submitFeedbackForm } from "@/data/actions";
import { cn } from "@/lib/utils";
import { StandardFeedbackFormSchema } from "@/utils/validation-schemas";
import Shortcut from "../shortcut/shortcut";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Spinner } from "../ui/spinner";

type IGuideFeedback =
  | {
      type: "Main Quest";
      guideTitle: string;
    }
  | {
      type: "Side Quest";
      map: string;
      guideTitle: string;
    };

export default function GuideFeedback(props: IGuideFeedback) {
  const [vote, setVote] = useState<"Liked" | "Disliked" | null>(null);
  const [isPending, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const form = useForm({
    defaultValues: {
      title: `${props.guideTitle} ${props.type} Guide ${props.type === "Side Quest" ? `for ${props.map}` : ""}`,
      label: "User Feedback",
      feedback: "",
    },
    validators: {
      onSubmit: StandardFeedbackFormSchema,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        const result = await submitFeedbackForm(undefined, {
          ...value,
          label: vote === "Disliked" ? "Improvement" : "User Feedback",
        });

        if (result.success) {
          return startTransition(() => {
            toast.success("Guide feedback submitted successfully!", {
              description: result.message,
              duration: 5000,
              position: "bottom-right",
            });
            form.reset();
            setVote(null);
          });
        }

        return startTransition(() => {
          toast.error("Failed to submit guide feedback!", {
            description: result.message,
            duration: 5000,
            position: "bottom-right",
          });
        });
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      setVote(null);
    }

    if (
      (e.ctrlKey || e.metaKey) &&
      e.key.toLowerCase() === "enter" &&
      form.state.isValid
    ) {
      e.preventDefault();
      form.handleSubmit();
    }
  };

  // timeout is neccessary to avoid lagging the open animation
  if (!!vote && textareaRef.current) {
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 150);
  }

  return (
    <div
      className={cn(
        "mt-8 w-full max-w-[250px] space-y-2 rounded-2xl border bg-transparent px-4 pt-2 shadow-sm transition-all duration-300 dark:shadow-none",
        {
          "max-w-[350px] rounded-lg": vote,
        },
      )}
    >
      <div className="flex items-center justify-center gap-4">
        <span className="text-foreground/80 text-sm">
          Was this guide helpful?
        </span>
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() =>
              setVote((prev) => (prev === "Liked" ? null : "Liked"))
            }
            className="group"
          >
            <ThumbsUp
              className={cn(
                "group-hover:-rotate-12 group-focus-visible:-rotate-12 size-4 cursor-pointer text-muted-foreground transition-transform duration-300",
                {
                  "text-primary": vote === "Liked",
                },
              )}
            />
          </button>
          <button
            type="button"
            onClick={() =>
              setVote((prev) => (prev === "Disliked" ? null : "Disliked"))
            }
            className="group"
          >
            <ThumbsDown
              className={cn(
                "group-hover:-rotate-12 group-focus-visible:-rotate-12 size-4 cursor-pointer text-muted-foreground transition-transform duration-300",
                {
                  "text-primary": vote === "Disliked",
                },
              )}
            />
          </button>
        </div>
      </div>
      <div
        className={cn(
          "max-h-0 transform-gpu overflow-hidden opacity-0 transition-all duration-300 will-change-auto",
          {
            "max-h-50 opacity-100": vote,
          },
        )}
      >
        <form
          id="guide-feedback"
          onSubmit={handleSubmit}
          className="flex h-full w-full flex-col gap-4 pb-2"
        >
          <FieldGroup>
            <form.Field
              name="feedback"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} className="h-full">
                    <FieldLabel className="sr-only">Guide Feedback</FieldLabel>
                    <Textarea
                      ref={textareaRef}
                      required
                      placeholder="Your feedback"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      className="min-h-26 resize-none focus-visible:ring-0"
                      tabIndex={vote ? 0 : -1}
                      onKeyDown={handleKeyDown}
                    />
                    {isInvalid && (
                      <div className="flex items-center gap-2">
                        <CircleAlert className="size-4 text-red-500" />
                        <FieldError errors={field.state.meta.errors} />
                      </div>
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
          <div className="mt-auto flex items-center">
            <Badge
              className={cn("inline-flex h-6 w-fit transition-colors", {
                "badge-new-gradient dark:dark-badge-new-gradient":
                  vote === "Liked",
                "badge-hard-gradient dark:dark-badge-hard-gradient":
                  vote === "Disliked",
                "badge-primary-gradient dark:dark-badge-primary-gradient":
                  !vote,
              })}
            >
              {vote === "Liked"
                ? "Helpful"
                : vote === "Disliked"
                  ? "Not Helpful"
                  : "Undecided"}
            </Badge>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  form="guide-feedback"
                  disabled={
                    isPending || !form.state.isValid || !form.state.isFormValid
                  }
                  className="mr-1 ml-auto w-fit gap-2 self-end"
                  size={"sm"}
                >
                  {isPending ? (
                    <>
                      <Spinner />
                      Sending...
                    </>
                  ) : (
                    <div className="flex items-center justify-center gap-2 font-medium">
                      <Send className="size-4" />
                      <span>Send</span>
                    </div>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={6} className="z-999">
                <div className="flex items-center gap-1">
                  <Shortcut shortcuts={["Ctrl", "↩"]} size="sm" />
                  <span>to send feedback</span>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </form>
      </div>
    </div>
  );
}
