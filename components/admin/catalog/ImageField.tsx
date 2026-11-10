"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { imageFileError } from "@/lib/admin/catalog-fields";
import ui from "../Admin.module.scss";
import styles from "./CatalogForm.module.scss";

// Current photo + file picker. Submits the saved URL as `image` and a new file (if picked)
// as `image_file`; the server action uploads it to Supabase Storage. Give it `key={value}`
// so a successful save (new URL) clears the picked file.
export function ImageField({
  value,
  label,
  wide = false,
}: {
  value: string;
  label: string;
  wide?: boolean;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError("");
    if (!file) {
      setPreview(null);
      return;
    }
    const problem = imageFileError(file);
    if (problem) {
      setError(problem);
      e.target.value = "";
      setPreview(null);
      return;
    }
    setPreview(URL.createObjectURL(file));
  };

  const shown = preview ?? value;

  return (
    <div>
      <div className={[styles.photo, wide && styles.wide].filter(Boolean).join(" ")}>
        {shown ? (
          <Image
            src={shown}
            alt={label}
            fill
            sizes="22rem"
            unoptimized={Boolean(preview)}
            className={styles.photoImage}
          />
        ) : (
          <p className={styles.photoEmpty}>No photo yet</p>
        )}
      </div>

      <input type="hidden" name="image" value={value} />
      <div className={styles.photoActions}>
        <input
          ref={inputRef}
          id={id}
          type="file"
          name="image_file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className={styles.fileInput}
          onChange={onChange}
          aria-describedby={`${id}-hint`}
        />
        <label htmlFor={id} className={`${ui.btn} ${ui.btnGhost} ${styles.fileLabel}`}>
          {shown ? "Change photo" : "Upload photo"}
        </label>
        {preview && (
          <button
            type="button"
            className={ui.link}
            onClick={() => {
              setPreview(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
          >
            Undo
          </button>
        )}
      </div>
      <p id={`${id}-hint`} className={styles.hint}>
        {preview
          ? "New photo — it uploads when you save."
          : `JPG, PNG or WebP, up to 4 MB. ${wide ? "Landscape" : "Portrait (4:5)"} photos look best.`}
      </p>
      {error && (
        <p className={ui.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
