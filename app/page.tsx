"use client";
import { experimental_useObject } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCcw, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { TagSchema } from "@/schemas/Tags";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
const formSchema = z.object({
  title: z.string().trim(),
  artists: z.string().trim(),
  sheetCode: z.string().trim(),
  midiCode: z.string().trim(),
  walkthroughCode: z.url().trim(),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
});
import useMeasure from "react-use-measure";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [ref, bounds] = useMeasure();
  const {
    object: tagsGenerated,
    submit: generateTags,
    isLoading: tagsGenerationLoading,
    clear: clearTagsGenerated,
  } = experimental_useObject({
    api: "/api/tags-generator",
    schema: TagSchema,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      artists: "",
      midiCode: "",
      sheetCode: "",
      walkthroughCode: "",
      difficulty: "Intermediate",
    },
  });

  const TITLE = form.watch("title");
  const ARTISTS = form.watch("artists");
  const MMFCODE = form.watch("sheetCode");
  const PAYHIPCODE = form.watch("midiCode");
  const DIFFICULTY = form.watch("difficulty");
  const WALKTHROUGHLINK = form.watch("walkthroughCode");

  const copyToClipboard = async (elementId: string, type: string) => {
    const text = document.getElementById(elementId)?.innerText;
    if (text) {
      try {
        await navigator.clipboard.writeText(text);
        toast.success(`${type} copied!`);
      } catch (err) {
        toast.error(`Failed to copy: ${err}`);
      }
    }
  };
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return;
  return (
    <div className="h-dvh font-sans flex flex-col gap-4 px-4 sm:px-12 py-12">
      <div className="flex h-full flex-col gap-6 border px-4 py-6 rounded-4xl">
        <ResizablePanelGroup direction="horizontal" className="gap-4 flex-1">
          <ResizablePanel defaultSize={32}>
            <FieldSet ref={ref} className="h-full overflow-auto">
              <span className="font-bold text-lg">Metadata Generator</span>
              <FieldGroup>
                <Controller
                  control={form.control}
                  name="title"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                      <Input
                        id={field.name}
                        placeholder="'A Thousand Years'"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="artists"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Artist(s)</FieldLabel>
                      <Input
                        id={field.name}
                        placeholder="'Christina Perri'"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="sheetCode"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        mymusicfive Code
                      </FieldLabel>
                      <Input
                        id={field.name}
                        placeholder="'123456'"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="midiCode"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>PayHip Code</FieldLabel>
                      <Input
                        id={field.name}
                        placeholder="'aBxDe'"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="walkthroughCode"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Walkthrough Code
                      </FieldLabel>
                      <Input
                        id={field.name}
                        placeholder="'ijaoxf5x8Xw'"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="difficulty"
                  render={({ field, fieldState }) => (
                    <Field
                      orientation="responsive"
                      data-invalid={fieldState.invalid}
                    >
                      <FieldLabel htmlFor="form-rhf-select-language">
                        Difficulty
                      </FieldLabel>
                      <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="form-rhf-select-language"
                          aria-invalid={fieldState.invalid}
                        >
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          {["Beginner", "Intermediate", "Advanced"].map((d) => (
                            <SelectItem
                              className="capitalize"
                              key={d}
                              value={d}
                            >
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
              </FieldGroup>
              <Field className="mt-auto mb-0">
                <Button
                  disabled={!form.formState.isDirty}
                  type="button"
                  onClick={() => {
                    copyToClipboard("result", "Description");
                  }}
                >
                  Copy Description
                  <Copy />
                </Button>
                <Button
                  disabled={!tagsGenerated || tagsGenerationLoading}
                  type="button"
                  onClick={() => {
                    copyToClipboard("tags-generated", "Tags");
                  }}
                >
                  Copy Tags
                  <Copy />
                </Button>
                <Button
                  disabled={!form.formState.isDirty}
                  variant="destructive"
                  type="button"
                  onClick={() => {
                    form.reset();
                    clearTagsGenerated();
                  }}
                >
                  Reset All
                  <RefreshCcw />
                </Button>
              </Field>
            </FieldSet>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={68}>
            <div
              style={{ height: bounds.height }}
              className="relative flex flex-col gap-4"
            >
              <div className="flex-4 overflow-auto pb-14 bg-muted rounded-2xl p-4 border">
                <span className="font-bold text-lg">Description</span>
                <br />
                <br />
                <p className="text-base" id="result">
                  🎹 {TITLE ? TITLE : "[TITLE]"} – Piano Cover |{" "}
                  {ARTISTS ? ARTISTS : "[ARTIST(S)]"}
                  <br />
                  <br />
                  This is a solo piano cover and arrangement of{" "}
                  {TITLE ? TITLE : "[TITLE]"} by{" "}
                  {ARTISTS ? ARTISTS : "[ARTIST(S)]"}
                  , created for pianists who want to learn, practice, and
                  perform the song.
                  <br />
                  <br />
                  Ideal for:
                  <br />
                  Piano practice
                  <br />
                  Performances & recitals
                  <br />
                  Covers & content creation
                  <br />
                  Learning through sheet music
                  <br />
                  <br />
                  🎼 SHEET MUSIC & FILES
                  <br />
                  🎹 Piano Sheet Music:{" "}
                  <a
                    target="_blank"
                    href={`https://sheets.jrdy.link/${MMFCODE ? MMFCODE : null}`}
                  >
                    https://sheets.jrdy.link/
                    {MMFCODE ? MMFCODE : null}
                  </a>
                  <br />
                  🎹 MIDI / MXL Files:{" "}
                  <a
                    target="_blank"
                    href={`https://midis.jrdy.link/${PAYHIPCODE ? PAYHIPCODE : null}`}
                  >
                    https://midis.jrdy.link/
                    {PAYHIPCODE ? PAYHIPCODE : null}
                  </a>
                  <br />
                  <br />
                  📩 INQUIRIES? CONTACT ME!
                  <br />
                  📧 johnroddondoyano8@gmail.com
                  <br />
                  <br />
                  👨‍🏫 WANT TO LEARN THIS ARRANGEMENT?
                  <br />
                  Watch the piano tutorial / walkthrough here:
                  <br />
                  👉{" "}
                  <a
                    target="_blank"
                    href={
                      WALKTHROUGHLINK
                        ? `https://youtu.be/${WALKTHROUGHLINK}`
                        : "https://www.youtube.com/@sheetsby_jr"
                    }
                  >
                    {WALKTHROUGHLINK
                      ? `https://youtu.be/${WALKTHROUGHLINK}`
                      : "https://www.youtube.com/@sheetsby_jr"}
                  </a>
                  <br />
                  <br />
                  🎵 ABOUT THIS PIANO ARRANGEMENT
                  <br />
                  Instrument: Solo Piano
                  <br />
                  Style: Piano Cover / Arrangement
                  <br />
                  Difficulty: {DIFFICULTY}
                  <br />
                  Arranged for expressive, playable performance
                  <br />
                  <br />
                  🎓 LEARN PIANO (RECOMMENDED)
                  <br />
                  📖 Learn piano with Skoove:
                  <br />
                  👉 https://www.skoove.com/#a_aid=johnrod
                  <br />
                  🎁 Get 1 month FREE of Skoove Premium
                  <br />
                  Use code: JOHNROD1M
                  <br />
                  Sign up via the link above, apply the code, and start playing.
                  <br />
                  <br />
                  🔎 WANT AN AUTOMATIC PIANO RECORDER?
                  <br />
                  👉 https://www.jamcorder.com
                  <br />
                  Use code: JOHNROD
                  <br />
                  <br />
                  🌐 OFFICIAL WEBSITE
                  <br />
                  Visit my official website for more music and projects:
                  <br />
                  👉 https://www.johnroddondoyano.com
                  <br />
                  <br />
                  🎧 LISTEN & FOLLOW
                  <br />
                  Spotify: https://spotify.jrdy.link
                  <br />
                  Apple Music: https://apple-music.jrdy.link
                  <br />
                  <br />
                  ☕ SUPPORT
                  <br />
                  If you’d like to support my work:
                  <br />
                  👉 Buy Me A Coffee: https://www.buymeacoffee.com/johnrod
                  <br />
                  <br />
                  📌 SUBSCRIBE
                  <br />
                  New piano covers, arrangements, and sheet music regularly.
                  <br />
                  <br />
                  {TITLE?.length > 0
                    ? form
                        .watch("title")
                        .replaceAll("&", "#")
                        .replaceAll(" ", "")
                        .replaceAll(",", "#")
                        .replace(/#+/g, "#")
                        .replace(/(?!^)#/g, "\n#")
                        .split("#") // Split by hashtag
                        .filter(Boolean) // Remove empty strings caused by ##
                        .map((tag) => `#${tag}`) // Add the hashtag back to each word
                        .join("\n")
                    : null}
                  <br />
                  {ARTISTS?.length > 0
                    ? form
                        .watch("artists")
                        .replaceAll("&", "#")
                        .replaceAll(" ", "")
                        .replaceAll(",", "#")
                        .replace(/#+/g, "#")
                        .replace(/(?!^)#/g, "\n#")
                        .split("#") // Split by hashtag
                        .filter(Boolean) // Remove empty strings caused by ##
                        .map((tag) => `#${tag}`) // Add the hashtag back to each word
                        .join("\n")
                    : null}
                  <br />
                  #PianoCover
                  <br />
                  #PianoArrangement
                  <br />
                  #SheetMusic
                </p>
              </div>
              <div className="flex-1 flex flex-col gap-4 place-items-start overflow-auto bg-muted p-4 rounded-2xl border">
                <div className="flex gap-4 justify-between w-full">
                  <span className="font-bold text-lg">Tags</span>
                  <ButtonGroup className="rounded-3xl">
                    <Button
                      disabled={
                        tagsGenerationLoading || !form.formState.isDirty
                      }
                      onClick={() => {
                        const text =
                          document.getElementById("result")?.innerText;
                        generateTags(`Generate SEO-optimized YouTube tags for a video with the following details:

             Title: ${TITLE} – Piano Cover | ${ARTISTS} (Sheet Music)
             Description: ${text}

             Ensure tags include a mix of broad category terms and specific long-tail keywords in small caps only except with titles and artist names. Also, always add "john rod dondoyano". No duplications please. No more than 500 characters but not less than 400 characters overall.`);
                      }}
                    >
                      {tagsGenerationLoading ? (
                        <>
                          Generating Tags{" "}
                          <RefreshCcw className="animate-spin" />
                        </>
                      ) : (
                        <>
                          {tagsGenerated ? "Regenerate" : "Generate"} Tags{" "}
                          <RefreshCcw />
                        </>
                      )}
                    </Button>
                    <ButtonGroupSeparator />
                    <Button
                      disabled={!tagsGenerated || tagsGenerationLoading}
                      onClick={() => clearTagsGenerated()}
                      variant="destructive"
                      size="icon"
                    >
                      <X />
                    </Button>
                  </ButtonGroup>
                </div>

                {tagsGenerated ? (
                  <div className="space-y-4">
                    <p id="tags-generated" hidden>
                      {tagsGenerated.tags?.map((tag, i) => (
                        <span key={`${tag?.tag}-${i}`}>
                          {tag?.tag}
                          {(tagsGenerated.tags?.length ?? 0) - 1 !== i
                            ? ", "
                            : null}
                        </span>
                      ))}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tagsGenerated.tags?.map((tag, i) => (
                        <Badge
                          className="text-sm px-3 py-1"
                          variant="outline"
                          key={`${tag?.tag}-${i}-badge`}
                        >
                          {tag?.tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
