"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { z } from "zod";
import { Input } from "@ui/components/input";
import { Textarea } from "@ui/components/textarea";
import { Label } from "@ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/select";
import { Button } from "@ui/components/button";
import { Card, CardContent } from "@ui/components/card";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

const formSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(2, "Identifier is required")
    .max(64)
    .regex(/^[a-z0-9-]+$/, "Use lowercase, numbers and dashes only"),
  name: z.string().trim().min(2, "Name is required").max(100),
  category: z.string().trim().min(2, "Category is required").max(50),
  tags: z.string().trim().optional(),
  description: z.string().trim().min(10, "Description is required").max(500),
  homepage: z
    .string()
    .trim()
    .url("Enter a valid URL to the official docs or homepage"),
});

type FormValues = z.infer<typeof formSchema>;

export function RequestConnectorForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [values, setValues] = useState<FormValues>({
    identifier: "",
    name: "",
    category: "",
    tags: "",
    description: "",
    homepage: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormValues, string>>
  >({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const autoSubmittedRef = useRef(false);

  const DRAFT_KEY = "connector-request-draft";

  function handleChange<K extends keyof FormValues>(key: K, val: string) {
    setValues((s) => ({ ...s, [key]: val }));
  }

  async function submitWithValues(formValues: FormValues) {
    setServerError(null);
    setSuccessUrl(null);
    const parsed = formSchema.safeParse(formValues);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof FormValues;
        if (!fieldErrors[k]) fieldErrors[k] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    startTransition(async () => {
      const res = await fetch("/api/request-connector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = (await res.json()) as {
        ok: boolean;
        issueUrl?: string;
        error?: string;
      };
      if (json.ok) {
        setSuccessUrl(json.issueUrl ?? null);
        try {
          window.localStorage.removeItem(DRAFT_KEY);
        } catch {}
      } else {
        if (res.status === 401 || json.error === "auth-required") {
          try {
            window.localStorage.setItem(DRAFT_KEY, JSON.stringify(formValues));
          } catch {}
          await signIn("github", {
            redirect: true,
            callbackUrl: "/request?auto=1",
          });
          return;
        }
        setServerError(json.error ?? "Something went wrong");
      }
    });
  }

  async function onSubmit() {
    await submitWithValues(values);
  }

  // After GitHub auth redirect, load draft and auto-submit
  useEffect(() => {
    const shouldAuto = searchParams.get("auto") === "1";
    if (!shouldAuto || autoSubmittedRef.current) return;
    autoSubmittedRef.current = true;
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as FormValues;
      setValues(draft);
      setTimeout(() => {
        submitWithValues(draft);
        router.replace("/request");
      }, 0);
    } catch {}
  }, [searchParams, router]);

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="grid gap-2">
          <Label htmlFor="identifier">Identifier</Label>
          <Input
            id="identifier"
            placeholder="e.g. stripe, shopify, google-analytics"
            value={values.identifier}
            onChange={(e) => handleChange("identifier", e.target.value)}
          />
          {errors.identifier ? (
            <p className="text-xs text-destructive">{errors.identifier}</p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Human-friendly name"
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          {errors.name ? (
            <p className="text-xs text-destructive">{errors.name}</p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="category">Connector type</Label>
          <Select
            value={values.category || undefined}
            onValueChange={(val) => handleChange("category", val)}
          >
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="api">API</SelectItem>
              <SelectItem value="saas">SaaS</SelectItem>
              <SelectItem value="database">Database</SelectItem>
              <SelectItem value="observability">Observability</SelectItem>
              <SelectItem value="blob-storage">Blob storage</SelectItem>
            </SelectContent>
          </Select>
          {errors.category ? (
            <p className="text-xs text-destructive">{errors.category}</p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            placeholder="Comma-separated (e.g. Ecommerce, SaaS, Events)"
            value={values.tags}
            onChange={(e) => handleChange("tags", e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="One-liner or short description"
            value={values.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
          {errors.description ? (
            <p className="text-xs text-destructive">{errors.description}</p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="homepage">Homepage or docs URL</Label>
          <Input
            id="homepage"
            placeholder="https://..."
            value={values.homepage}
            onChange={(e) => handleChange("homepage", e.target.value)}
          />
          {errors.homepage ? (
            <p className="text-xs text-destructive">{errors.homepage}</p>
          ) : null}
        </div>

        {serverError ? (
          <div className="text-sm text-destructive">{serverError}</div>
        ) : null}
        {successUrl ? (
          <div className="text-sm">
            Request submitted. Track it on GitHub:{" "}
            <a
              className="underline"
              href={successUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {successUrl}
            </a>
          </div>
        ) : null}

        <div className="flex justify-end">
          <Button disabled={isPending} onClick={onSubmit}>
            {isPending ? "Submitting..." : "Submit via GitHub"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
