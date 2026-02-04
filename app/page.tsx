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
import { Ban, Copy, RefreshCcw, X } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
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
import { Badge } from "@/components/ui/badge";

import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import MMFPreview from "@/components/mmf-preview";
import PayhipPreview from "@/components/payhip-preview";
import { RefObject, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
export default function Home() {
  const {
    object: tagsGenerated,
    submit: generateTags,
    isLoading: tagsGenerationLoading,
    clear: clearTagsGenerated,
    stop: stopTagsGeneration,
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

  const TITLE = useWatch({
    control: form.control,
    name: "title",
  });
  const ARTISTS = useWatch({
    control: form.control,
    name: "artists",
  });
  const MMFCODE = useWatch({
    control: form.control,
    name: "sheetCode",
  });
  const PAYHIPCODE = useWatch({
    control: form.control,
    name: "midiCode",
  });
  const DIFFICULTY = useWatch({
    control: form.control,
    name: "difficulty",
  });
  const WALKTHROUGHLINK = useWatch({
    control: form.control,
    name: "walkthroughCode",
  });

  const DESCRIPTION = useRef<HTMLParagraphElement>(null);
  const TAGS = useRef<HTMLParagraphElement>(null);

  const createPrompt =
    () => `Generate SEO-optimized YouTube tags for a video with the following details:
  
  Title: ${TITLE} – Piano Cover | ${ARTISTS} (Sheet Music)
  Description: ${DESCRIPTION.current?.innerText}
  
  Ensure tags include a mix of broad category terms and specific long-tail keywords in small caps only except with titles and artist names. Also, always add "john rod dondoyano". No duplications please. No more than 500 characters but not less than 400 characters overall.`;

  const copyToClipboard = async (
    ref: RefObject<HTMLParagraphElement | null>,
    type: string,
  ) => {
    if (ref.current) {
      try {
        await navigator.clipboard.writeText(ref.current.innerText);
        toast.success(`${type} copied!`);
      } catch (err) {
        toast.error(`Failed to copy: ${err}`);
      }
    }
  };

  return (
    <div className="h-dvh font-sans flex flex-col gap-8 p-8 [&>*]:max-w-6xl [&>*]:mx-auto">
      <h1 className="text-2xl font-bold">Metadata Generator</h1>
      <ResizablePanelGroup direction="horizontal" className="gap-2 flex-1 ">
        <ResizablePanel defaultSize={20}>
          <Panel>
            <Header
              title="Fields"
              btns={() => (
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
              )}
            />

            <FieldSet className="h-full flex-1 p-4">
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
                      <MMFPreview code={field.value} />
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
                      <PayhipPreview code={field.value} />
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
            </FieldSet>
          </Panel>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={80}>
          <ResizablePanelGroup direction="vertical" className="gap-2">
            <ResizablePanel defaultSize={75}>
              <Panel>
                <Header
                  title="Description"
                  btns={() => (
                    <Button
                      disabled={!form.formState.isDirty}
                      type="button"
                      onClick={() => {
                        copyToClipboard(DESCRIPTION, "Description");
                      }}
                    >
                      Copy Description
                      <Copy />
                    </Button>
                  )}
                />
                <div className="p-4">
                  <p className="text-base break-all" ref={DESCRIPTION}>
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
                    Sign up via the link above, apply the code, and start
                    playing.
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
                      ? TITLE.replaceAll("&", "#")
                          .replaceAll(" ", "")
                          .replaceAll(",", "#")
                          .replace(/#+/g, "#")
                          .replace(/(?!^)#/g, "\n#")
                          .split("#")
                          .filter(Boolean)
                          .map((tag) => `#${tag}`)
                          .join("\n")
                      : null}
                    <br />
                    {ARTISTS?.length > 0
                      ? ARTISTS.replaceAll("&", "#")
                          .replaceAll(" ", "")
                          .replaceAll(",", "#")
                          .replace(/#+/g, "#")
                          .replace(/(?!^)#/g, "\n#")
                          .split("#")
                          .filter(Boolean)
                          .map((tag) => `#${tag}`)
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
              </Panel>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={26}>
              <Panel>
                <Header
                  title="Tags"
                  btns={() => (
                    <ButtonGroup className="rounded-3xl">
                      {tagsGenerationLoading ? (
                        <>
                          <Button disabled>
                            Generating Tags{" "}
                            <RefreshCcw className="animate-spin" />
                          </Button>
                          <ButtonGroupSeparator />
                          <Button
                            onClick={() => stopTagsGeneration()}
                            variant="destructive"
                            size="icon"
                          >
                            <Ban />
                          </Button>
                        </>
                      ) : tagsGenerated ? (
                        <>
                          <Button
                            onClick={() => {
                              copyToClipboard(TAGS, "Tags");
                            }}
                          >
                            Copy Tags
                            <Copy />
                          </Button>
                          <ButtonGroupSeparator />
                          <Button
                            disabled={!form.formState.isDirty}
                            onClick={() => {
                              generateTags(createPrompt());
                            }}
                          >
                            <RefreshCcw />
                          </Button>
                          <ButtonGroupSeparator />
                          <Button
                            onClick={() => clearTagsGenerated()}
                            variant="destructive"
                            size="icon"
                          >
                            <X />
                          </Button>
                        </>
                      ) : (
                        <Button
                          disabled={!form.formState.isDirty}
                          onClick={() => {
                            generateTags(createPrompt());
                          }}
                        >
                          Generate Tags
                          <RefreshCcw />
                        </Button>
                      )}
                    </ButtonGroup>
                  )}
                />
                {tagsGenerated ? (
                  <div className="space-y-4 p-4">
                    <p ref={TAGS} className="sr-only">
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
                          className="text-sm px-3 py-1  break-all whitespace-normal"
                          variant="outline"
                          key={`${tag?.tag}-${i}-badge`}
                        >
                          {tag?.tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}
              </Panel>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
      <footer className="text-center text-sm text-muted-foreground">
        <Link
          href="https://dondycles.com"
          target="_blank"
          className="underline"
        >
          <p>created by dondycles</p>
        </Link>
      </footer>
    </div>
  );
}

function Header({
  title,
  btns,
}: {
  title: string;
  btns: () => React.ReactElement;
}) {
  return (
    <div className="grid grid-cols-1  sticky top-0 left-0 z-10">
      <header className="font-bold text-lg border-b p-4 backdrop-blur-sm bg-background/50 flex justify-between gap-4 items-center">
        <h2 className="truncate">{title}</h2>
        {btns()}
      </header>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex rounded-2xl border overflow-hidden">
      <ScrollArea className="h-full w-full relative">{children}</ScrollArea>
    </div>
  );
}
