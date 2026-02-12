"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { debounce } from "@/lib/utils";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function PayhipPreview({ code }: { code?: string }) {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScreenshot = useCallback(async (targetUrl: string) => {
    if (!targetUrl) {
      setError("Please enter a valid URL.");
      return;
    }
    // Client-side URL validation: must start with http:// or https:// and be a valid URL
    if (!/^https?:\/\//i.test(targetUrl.trim())) {
      setError("URL must start with http:// or https://");
      return;
    }
    try {
      new URL(targetUrl.trim());
    } catch {
      setError("Invalid URL format. Please enter a valid URL.");
      return;
    }
    setLoading(true);
    setError(null);
    setScreenshot(null);

    try {
      const response = await fetch(
        `/api/screenshot?url=${encodeURIComponent(targetUrl)}`,
      );
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(
            "Rate limit reached. To ensure this example can be used by others, please try again later.",
          );
        }
        throw new Error("Failed to capture screenshot.");
      }
      const blob = await response.blob();
      setScreenshot(URL.createObjectURL(blob));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a debounced version of the screenshot handler
  const debouncedHandleScreenshot = useMemo(
    () => debounce(handleScreenshot, 500),
    [handleScreenshot],
  );

  useEffect(() => {
    if (code !== "") {
      const payhipUrl = `https://payhip.com/b/${code}`;
      debouncedHandleScreenshot(payhipUrl);
    }
  }, [code, debouncedHandleScreenshot]);

  if (!code) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!screenshot) return null;

  return (
    <Image
      src={screenshot}
      alt={code || ""}
      width={720}
      height={1080}
      className="rounded-lg border aspect-square w-full object-contain object-top"
    />
  );
}
