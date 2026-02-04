import { debounce } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export default function MMFPreview({ code }: { code?: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const debouncedFetch = useMemo(
    () =>
      debounce(async (code: string) => {
        try {
          const response = await fetch(
            `https://mms.pd.mapia.io/mms/public/sheet/${code}`,
          );
          const result = await response.json();
          setData(result);
        } catch (error) {
          console.error("Failed to fetch metadata:", error);
          setData(null);
        } finally {
          setLoading(false);
        }
      }, 500),
    [],
  );

  useEffect(() => {
    if (code) {
      setLoading(true);
      debouncedFetch(code);
    } else {
      setData(null);
      setLoading(false);
    }
  }, [code, debouncedFetch]);

  if (!code) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <Image
      src={data.thumbnailUrl}
      alt={data.title}
      width={720}
      height={1080}
      className="rounded-lg border aspect-auto w-full"
    />
  );
}
