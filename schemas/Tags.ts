import z from "zod";

export const TagSchema = z.object({
  tags: z.array(
    z.object({
      tag: z.string().describe("The actual tag phrase"),
    }),
  ),
});

export type Tags = z.infer<typeof TagSchema>;
