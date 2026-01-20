import { cn } from "@/lib/utils";

export default async function Embed({
  url,
  className,
}: {
  url: string;
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
}) {
  await fetch(url);

  return (
    <iframe
      src="https://www.mymusicfive.com/johnroddondoyano/251893"
      allow="clipboard-write; encrypted-media; picture-in-picture; web-share"
      className={cn("rounded-[1rem] max-w-[800px] mx-auto w-full", className)}
      loading="lazy"
    />
  );
}
