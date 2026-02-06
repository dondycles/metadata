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
import { Ban, Clipboard, Copy, RefreshCcw, X } from "lucide-react";
import { Control, Controller, useForm, useWatch } from "react-hook-form";
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

type FormValues = z.infer<typeof formSchema>;

import { Badge } from "@/components/ui/badge";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import MMFPreview from "@/components/mmf-preview";
import PayhipPreview from "@/components/payhip-preview";
import {
  memo,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import useMeasure from "react-use-measure";

const DIFFICULTY_OPTIONS = ["Beginner", "Intermediate", "Advanced"] as const;

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

  const form = useForm<FormValues>({
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

  const DESCRIPTION = useRef<HTMLParagraphElement>(null);
  const TAGS = useRef<HTMLParagraphElement>(null);

  const copyToClipboard = useCallback(
    async (text: string | undefined, type: string) => {
      if (text) {
        try {
          await navigator.clipboard.writeText(text);
          toast.success(`${type} copied!`);
        } catch (err) {
          toast.error(`Failed to copy: ${err}`);
        }
      }
    },
    [],
  );

  const handleReset = useCallback(() => {
    form.reset();
    clearTagsGenerated();
  }, [form, clearTagsGenerated]);

  const handleCopyDescription = useCallback(() => {
    copyToClipboard(DESCRIPTION.current?.innerText, "Description");
  }, [copyToClipboard]);

  const handleCopyTags = useCallback(() => {
    copyToClipboard(TAGS.current?.innerText, "Tags");
  }, [copyToClipboard]);

  const [isMobile, setIsMobile] = useState(false);

  return (
    <Container setIsMobile={setIsMobile}>
      <h1 className="text-2xl font-bold">Metadata Generator</h1>
      {isMobile ? (
        <div className="space-y-4 [&>div]:h-auto">
          <Panel data-slot="fields">
            <Header title="Fields">
              <Button
                disabled={!form.formState.isDirty}
                variant="destructive"
                type="button"
                onClick={handleReset}
              >
                Reset All
                <RefreshCcw />
              </Button>
            </Header>

            <FieldSet className="h-full flex-1 p-4">
              <FormFields control={form.control} isMobile={true} />
            </FieldSet>
          </Panel>
          <Panel data-slot="description">
            <Header title="Description">
              <Button
                disabled={!form.formState.isDirty}
                type="button"
                onClick={handleCopyDescription}
              >
                Copy Description
                <Copy />
              </Button>
            </Header>
            <DescriptionPreview
              control={form.control}
              descriptionRef={DESCRIPTION}
            />
          </Panel>
          <Panel data-slot="tags">
            <TagsPanel
              control={form.control}
              descriptionRef={DESCRIPTION}
              tagsRef={TAGS}
              tagsGenerated={tagsGenerated}
              tagsGenerationLoading={tagsGenerationLoading}
              generateTags={generateTags}
              stopTagsGeneration={stopTagsGeneration}
              clearTagsGenerated={clearTagsGenerated}
              isDirty={form.formState.isDirty}
              onCopyTags={handleCopyTags}
            />
          </Panel>
        </div>
      ) : (
        <ResizablePanelGroup direction="horizontal" className="gap-2 flex-1 ">
          <ResizablePanel defaultSize={30} minSize={30}>
            <Panel>
              <Header title="Fields">
                <Button
                  disabled={!form.formState.isDirty}
                  variant="destructive"
                  type="button"
                  onClick={handleReset}
                >
                  Reset All
                  <RefreshCcw />
                </Button>
              </Header>

              <FieldSet className="h-full flex-1 p-4">
                <FormFields control={form.control} isMobile={false} />
              </FieldSet>
            </Panel>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={70} minSize={30}>
            <ResizablePanelGroup direction="vertical" className="gap-2">
              <ResizablePanel defaultSize={75} minSize={25}>
                <Panel>
                  <Header title="Description">
                    <Button
                      disabled={!form.formState.isDirty}
                      type="button"
                      onClick={handleCopyDescription}
                    >
                      Copy Description
                      <Copy />
                    </Button>
                  </Header>
                  <DescriptionPreview
                    control={form.control}
                    descriptionRef={DESCRIPTION}
                  />
                </Panel>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={25} minSize={25}>
                <Panel>
                  <TagsPanel
                    control={form.control}
                    descriptionRef={DESCRIPTION}
                    tagsRef={TAGS}
                    tagsGenerated={tagsGenerated}
                    tagsGenerationLoading={tagsGenerationLoading}
                    generateTags={generateTags}
                    stopTagsGeneration={stopTagsGeneration}
                    clearTagsGenerated={clearTagsGenerated}
                    isDirty={form.formState.isDirty}
                    onCopyTags={handleCopyTags}
                  />
                </Panel>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}

      <footer className="text-center text-sm text-muted-foreground">
        <Link
          href="https://dondycles.com"
          target="_blank"
          className="underline"
        >
          <p>created by dondycles</p>
        </Link>
      </footer>
    </Container>
  );
}

const Container = memo(function Container({
  children,
  setIsMobile,
}: {
  children: React.ReactNode;
  setIsMobile: (isMobile: boolean) => void;
}) {
  const [ref, { width }] = useMeasure();

  useEffect(() => {
    setIsMobile(width < 800);
  }, [width, setIsMobile]);

  return (
    <div
      ref={ref}
      className="h-dvh font-sans flex flex-col gap-8 p-8 *:max-w-6xl *:mx-auto overflow-auto"
    >
      {children}
    </div>
  );
});

// Extracted FormFields component to avoid duplication
const FormFields = memo(function FormFields({
  control,
  isMobile,
}: {
  control: Control<FormValues>;
  isMobile: boolean;
}) {
  return (
    <FieldGroup>
      <Controller
        control={control}
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
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={control}
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
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <SheetCodeField control={control} isMobile={isMobile} />
      <MidiCodeField control={control} isMobile={isMobile} />
      <Controller
        control={control}
        name="walkthroughCode"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Walkthrough Code</FieldLabel>
            <Input
              id={field.name}
              placeholder="'ijaoxf5x8Xw'"
              {...field}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={control}
        name="difficulty"
        render={({ field, fieldState }) => (
          <Field orientation="responsive" data-invalid={fieldState.invalid}>
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
                {DIFFICULTY_OPTIONS.map((d) => (
                  <SelectItem className="capitalize" key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}
      />
    </FieldGroup>
  );
});

const SheetCodeField = memo(function SheetCodeField({
  control,
  isMobile,
}: {
  control: Control<FormValues>;
  isMobile: boolean;
}) {
  const handleCopyMm5 = useCallback((sheetCode: string) => {
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(
          `https://sheets.jrdy.link/${sheetCode}`,
        );
        toast.success(`Sheet link copied!`);
      } catch (err) {
        toast.error(`Failed to copy: ${err}`);
      }
    };
    copyToClipboard();
  }, []);
  return (
    <Controller
      control={control}
      name="sheetCode"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>mymusicfive Code</FieldLabel>
          {isMobile ? (
            <Input
              id={field.name}
              placeholder="'123456'"
              {...field}
              aria-invalid={fieldState.invalid}
            />
          ) : (
            <div className="relative">
              <Input
                id={field.name}
                placeholder="'123456'"
                {...field}
                aria-invalid={fieldState.invalid}
                className="pr-8.5"
              />
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => handleCopyMm5(field.value)}
                className="absolute right-1 top-1/2 -translate-y-1/2 size-7 "
              >
                <Clipboard />
              </Button>
            </div>
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          <MMFPreview code={field.value} />
        </Field>
      )}
    />
  );
});

const MidiCodeField = memo(function MidiCodeField({
  control,
  isMobile,
}: {
  control: Control<FormValues>;
  isMobile: boolean;
}) {
  const handleCopyPh = useCallback((midiCode: string) => {
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(
          `https://midis.jrdy.link/${midiCode}`,
        );
        toast.success(`MIDI link copied!`);
      } catch (err) {
        toast.error(`Failed to copy: ${err}`);
      }
    };
    copyToClipboard();
  }, []);

  return (
    <Controller
      control={control}
      name="midiCode"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>PayHip Code</FieldLabel>
          {isMobile ? (
            <Input
              id={field.name}
              placeholder="'aBxDe'"
              {...field}
              aria-invalid={fieldState.invalid}
            />
          ) : (
            <div className="relative">
              <Input
                id={field.name}
                placeholder="'aBxDe'"
                {...field}
                aria-invalid={fieldState.invalid}
                className="pr-8.5"
              />
              <Button
                disabled={!field.value}
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => handleCopyPh(field.value)}
                className="absolute right-1 top-1/2 -translate-y-1/2 size-7 "
              >
                <Clipboard />
              </Button>
            </div>
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          <PayhipPreview code={field.value} />
        </Field>
      )}
    />
  );
});

// Optimized with single useWatch call and memoized tag processing
const DescriptionPreview = memo(function DescriptionPreview({
  control,
  descriptionRef,
}: {
  control: Control<FormValues>;
  descriptionRef: RefObject<HTMLParagraphElement | null>;
}) {
  // Single useWatch call for all form values
  const formValues = useWatch({ control });
  const {
    title = "",
    artists = "",
    sheetCode = "",
    midiCode = "",
    difficulty = "Intermediate",
    walkthroughCode = "",
  } = formValues;

  // Memoize tag processing to avoid recalculation on every render
  const titleTags = useMemo(() => {
    if (!title) return null;
    return title
      .replaceAll("&", "#")
      .replaceAll(" ", "")
      .replaceAll(",", "#")
      .replace(/#+/g, "#")
      .replace(/(?!^)#/g, "\n#")
      .split("#")
      .filter(Boolean)
      .map((tag) => `#${tag}`)
      .join("\n");
  }, [title]);

  const artistTags = useMemo(() => {
    if (!artists) return null;
    return artists
      .replaceAll("&", "#")
      .replaceAll(" ", "")
      .replaceAll(",", "#")
      .replace(/#+/g, "#")
      .replace(/(?!^)#/g, "\n#")
      .split("#")
      .filter(Boolean)
      .map((tag) => `#${tag}`)
      .join("\n");
  }, [artists]);

  const walkthroughUrl = useMemo(
    () =>
      walkthroughCode
        ? `https://youtu.be/${walkthroughCode}`
        : "https://www.youtube.com/@sheetsby_jr",
    [walkthroughCode],
  );

  return (
    <div className="p-4">
      <p className="text-base break-all" ref={descriptionRef}>
        🎹 {title || "[TITLE]"} – Piano Cover | {artists || "[ARTIST(S)]"}
        <br />
        <br />
        This is a solo piano cover and arrangement of {title ||
          "[TITLE]"} by {artists || "[ARTIST(S)]"}, created for pianists who
        want to learn, practice, and perform the song.
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
        <a target="_blank" href={`https://sheets.jrdy.link/${sheetCode || ""}`}>
          https://sheets.jrdy.link/{sheetCode || ""}
        </a>
        <br />
        🎹 MIDI / MXL Files:{" "}
        <a target="_blank" href={`https://midis.jrdy.link/${midiCode || ""}`}>
          https://midis.jrdy.link/{midiCode || ""}
        </a>
        <br />
        <br />
        📩 INQUIRIES? CONTACT ME!
        <br />
        📧 johnroddondoyano8@gmail.com
        <br />
        <br />
        👨🏫 WANT TO LEARN THIS ARRANGEMENT?
        <br />
        Watch the piano tutorial / walkthrough here:
        <br />
        👉{" "}
        <a target="_blank" href={walkthroughUrl}>
          {walkthroughUrl}
        </a>
        <br />
        <br />
        🎵 ABOUT THIS PIANO ARRANGEMENT
        <br />
        Instrument: Solo Piano
        <br />
        Style: Piano Cover / Arrangement
        <br />
        Difficulty: {difficulty}
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
        If you&apos;d like to support my work:
        <br />
        👉 Buy Me A Coffee: https://www.buymeacoffee.com/johnrod
        <br />
        <br />
        📌 SUBSCRIBE
        <br />
        New piano covers, arrangements, and sheet music regularly.
        <br />
        <br />
        {titleTags}
        <br />
        {artistTags}
        <br />
        #PianoCover
        <br />
        #PianoArrangement
        <br />
        #SheetMusic
      </p>
    </div>
  );
});

// Optimized TagsPanel component
const TagsPanel = memo(function TagsPanel({
  control,
  descriptionRef,
  tagsRef,
  tagsGenerated,
  tagsGenerationLoading,
  generateTags,
  stopTagsGeneration,
  clearTagsGenerated,
  isDirty,
  onCopyTags,
}: {
  control: Control<FormValues>;
  descriptionRef: RefObject<HTMLParagraphElement | null>;
  tagsRef: RefObject<HTMLParagraphElement | null>;
  tagsGenerated: ReturnType<
    typeof experimental_useObject<typeof TagSchema>
  >["object"];
  tagsGenerationLoading: boolean;
  generateTags: (prompt: string) => void;
  stopTagsGeneration: () => void;
  clearTagsGenerated: () => void;
  isDirty: boolean;
  onCopyTags: () => void;
}) {
  const formValues = useWatch({ control });
  const { title = "", artists = "" } = formValues;

  const createPrompt = useCallback(
    () => `Generate SEO-optimized YouTube tags for a video with the following details:
  
  Title: ${title} – Piano Cover | ${artists} (Sheet Music)
  Description: ${descriptionRef.current?.innerText}
  
  Ensure tags include a mix of broad category terms and specific long-tail keywords in small caps only except with titles and artist names. Also, always add "john rod dondoyano". No duplications please. No more than 500 characters but not less than 400 characters overall.`,
    [title, artists, descriptionRef],
  );

  const handleGenerateTags = useCallback(() => {
    generateTags(createPrompt());
  }, [generateTags, createPrompt]);

  return (
    <>
      <Header title="Tags">
        <ButtonGroup className="rounded-3xl">
          {tagsGenerationLoading ? (
            <>
              <Button disabled>
                Generating Tags <RefreshCcw className="animate-spin" />
              </Button>
              <ButtonGroupSeparator />
              <Button
                onClick={stopTagsGeneration}
                variant="destructive"
                size="icon"
              >
                <Ban />
              </Button>
            </>
          ) : tagsGenerated ? (
            <>
              <Button onClick={onCopyTags}>
                Copy Tags
                <Copy />
              </Button>
              <ButtonGroupSeparator />
              <Button disabled={!isDirty} onClick={handleGenerateTags}>
                <RefreshCcw />
              </Button>
              <ButtonGroupSeparator />
              <Button
                onClick={clearTagsGenerated}
                variant="destructive"
                size="icon"
              >
                <X />
              </Button>
            </>
          ) : (
            <Button disabled={!isDirty} onClick={handleGenerateTags}>
              Generate Tags
              <RefreshCcw />
            </Button>
          )}
        </ButtonGroup>
      </Header>
      {tagsGenerated ? (
        <div className="space-y-4 p-4">
          <p ref={tagsRef} className="sr-only">
            {tagsGenerated.tags?.map((tag, i) => (
              <span key={`${tag?.tag}-${i}`}>
                {tag?.tag}
                {(tagsGenerated.tags?.length ?? 0) - 1 !== i ? ", " : null}
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
    </>
  );
});

function Header({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1  sticky top-0 left-0 z-10">
      <header className="font-bold text-lg border-b p-4 backdrop-blur-sm bg-background/50 flex justify-between gap-4 items-center">
        <h2 className="truncate">{title}</h2>
        {children}
      </header>
    </div>
  );
}

function Panel({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }) {
  return (
    <div className="h-full flex rounded-2xl border overflow-hidden" {...props}>
      <ScrollArea className="h-full w-full relative">{children}</ScrollArea>
    </div>
  );
}
