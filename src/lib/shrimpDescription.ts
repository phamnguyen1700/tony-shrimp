export interface ShrimpDescriptionDraft {
  title: string;
  overview: string;
  highlights: string;
  careNotes: string;
}

export const emptyShrimpDescriptionDraft: ShrimpDescriptionDraft = {
  title: "",
  overview: "",
  highlights: "",
  careNotes: "",
};

export function descriptionDraftToMarkdown(draft: ShrimpDescriptionDraft) {
  const highlights = draft.highlights
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  return [
    draft.title.trim() ? `## ${draft.title.trim()}` : "",
    draft.overview.trim(),
    highlights.length ? `### Highlights\n\n${highlights.map((item) => `- ${item}`).join("\n")}` : "",
    draft.careNotes.trim() ? `### Care Notes\n\n${draft.careNotes.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function markdownToDescriptionDraft(value?: string | null): ShrimpDescriptionDraft {
  if (!value?.trim()) return emptyShrimpDescriptionDraft;

  const lines = value.replace(/\r\n/g, "\n").split("\n");
  const draft: ShrimpDescriptionDraft = { ...emptyShrimpDescriptionDraft };
  let section: keyof ShrimpDescriptionDraft = "overview";
  const overview: string[] = [];
  const careNotes: string[] = [];
  const highlights: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("## ") && !trimmed.startsWith("### ")) {
      draft.title = trimmed.replace(/^##\s+/, "");
      section = "overview";
      continue;
    }

    if (/^###\s+highlights$/i.test(trimmed)) {
      section = "highlights";
      continue;
    }

    if (/^###\s+care notes$/i.test(trimmed)) {
      section = "careNotes";
      continue;
    }

    if (section === "highlights") {
      highlights.push(trimmed.replace(/^[-*]\s+/, ""));
    } else if (section === "careNotes") {
      careNotes.push(trimmed);
    } else {
      overview.push(trimmed);
    }
  }

  return {
    title: draft.title,
    overview: overview.join("\n\n"),
    highlights: highlights.join("\n"),
    careNotes: careNotes.join("\n\n"),
  };
}
