"use client";

import { useEffect, useRef, useState } from "react";

import type { AdminTheme } from "@/features/admin/admin-theme.constants";
import { adminLabelClass } from "@/features/admin/admin-ui.constants";

import "quill/dist/quill.snow.css";

const TOOLBAR = [
  ["link", "image"],
  [{ header: [1, 2, 3, false] }],
  [{ size: ["small", false, "large", "huge"] }],
  ["bold", "italic", "underline"],
  [{ align: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  ["clean"],
] as const;

function normalizeEmptyHtml(html: string): string {
  const t = html.trim();
  if (t === "" || t === "<p><br></p>" || t === "<p></p>") {
    return "";
  }
  return html;
}

type AdminMachineRichTextProps = {
  readonly theme: AdminTheme;
  readonly label: string;
  readonly value: string;
  readonly onChange: (html: string) => void;
  readonly placeholder: string;
};

export function AdminMachineRichText({ theme, label, value, onChange, placeholder }: AdminMachineRichTextProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<InstanceType<typeof import("quill").default> | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const syncingRef = useRef(false);
  const [ready, setReady] = useState(false);

  const shell =
    theme === "light"
      ? "admin-quill-light [&_.ql-editor]:min-h-[220px] [&_.ql-toolbar]:rounded-t-md [&_.ql-toolbar]:border-[#e4e4e7] [&_.ql-toolbar]:bg-white [&_.ql-container]:rounded-b-md [&_.ql-container]:border-[#e4e4e7] [&_.ql-container]:bg-white [&_.ql-editor]:text-[#18181b]"
      : "admin-quill-dark [&_.ql-editor]:min-h-[220px] [&_.ql-toolbar]:rounded-t-md [&_.ql-toolbar]:border-[#27272a] [&_.ql-toolbar]:bg-[#18181b] [&_.ql-container]:rounded-b-md [&_.ql-container]:border-[#27272a] [&_.ql-container]:bg-[#09090b] [&_.ql-editor]:text-[#e4e4e7] [&_.ql-stroke]:stroke-[#a1a1aa] [&_.ql-fill]:fill-[#a1a1aa] [&_.ql-picker-label]:text-[#e4e4e7]";

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }
    let cancelled = false;

    void (async () => {
      const { default: Quill } = await import("quill");
      if (cancelled || !hostRef.current) {
        return;
      }

      const q = new Quill(hostRef.current, {
        theme: "snow",
        placeholder,
        modules: {
          toolbar: [...TOOLBAR],
        },
      });
      quillRef.current = q;

      const initial = normalizeEmptyHtml(value);
      if (initial.length > 0) {
        q.clipboard.dangerouslyPasteHTML(value);
      }

      q.on("text-change", () => {
        if (syncingRef.current) {
          return;
        }
        onChangeRef.current(q.root.innerHTML);
      });

      setReady(true);
    })();

    return () => {
      cancelled = true;
      quillRef.current = null;
      host.innerHTML = "";
    };
  }, [placeholder]); // eslint-disable-line react-hooks/exhaustive-deps -- sync effect handles `value`

  useEffect(() => {
    if (!ready) {
      return;
    }
    const q = quillRef.current;
    if (!q) {
      return;
    }
    const current = normalizeEmptyHtml(q.root.innerHTML);
    const next = normalizeEmptyHtml(value);
    if (current === next) {
      return;
    }
    syncingRef.current = true;
    q.clipboard.dangerouslyPasteHTML(value.length > 0 ? value : "<p><br></p>");
    syncingRef.current = false;
  }, [value, ready]);

  return (
    <div>
      <label className={adminLabelClass(theme)}>{label}</label>
      <div className={shell}>
        <div ref={hostRef} />
      </div>
    </div>
  );
}
