"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useCms } from "./cms-provider";

type EditableTag = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div" | "li" | "td" | "th" | "blockquote" | "small" | "a";

interface EditableProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** Dotted path into the content document, e.g. `hero.title` or `pillars.items.0.title`. */
  path: string;
  as?: EditableTag;
  /** Allow Enter to insert line breaks. Single-line fields commit on Enter instead. */
  multiline?: boolean;
  /** Shown in edit mode when the value is empty. */
  placeholder?: string;
  href?: string;
}

/**
 * Renders a text value from the content document. When the signed-in editor
 * turns on edit mode the element becomes directly editable in place, and the
 * new value is committed to the draft when focus leaves the element.
 */
export function Editable({ path, as = "span", multiline = false, placeholder = "Click to edit", className, href, ...rest }: EditableProps) {
  const { get, set, editing, revision } = useCms();
  const value = get<string>(path) ?? "";
  const ref = React.useRef<HTMLElement>(null);
  const [focused, setFocused] = React.useState(false);

  const commit = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const next = multiline ? el.innerText.replace(/\n{3,}/g, "\n\n").trimEnd() : el.innerText.replace(/\s*\n\s*/g, " ").trim();
    if (next !== value) set(path, next);
    else el.innerText = value;
  }, [multiline, path, set, value]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      if (ref.current) ref.current.innerText = value;
      ref.current?.blur();
      return;
    }
    if (event.key === "Enter" && !multiline) {
      event.preventDefault();
      ref.current?.blur();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLElement>) => {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const node = document.createTextNode(multiline ? text : text.replace(/\s*\n\s*/g, " "));
    range.insertNode(node);
    range.setStartAfter(node);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const Tag = as as React.ElementType;
  const isEmpty = value.trim().length === 0;

  if (!editing) {
    if (isEmpty) return null;
    return (
      <Tag className={cn(multiline && "whitespace-pre-line", className)} href={href} {...rest}>
        {value}
      </Tag>
    );
  }

  return (
    <Tag
      key={revision}
      ref={ref}
      contentEditable="plaintext-only"
      suppressContentEditableWarning
      spellCheck={false}
      role="textbox"
      aria-multiline={multiline}
      aria-label={`Edit ${path}`}
      data-editable=""
      data-empty={isEmpty && !focused ? "" : undefined}
      data-placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false);
        commit();
      }}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onClick={(event: React.MouseEvent) => {
        // Text inside links or buttons must not trigger them while being edited.
        event.preventDefault();
        event.stopPropagation();
      }}
      className={cn("editable", multiline && "whitespace-pre-line", className)}
      {...rest}
    >
      {value}
    </Tag>
  );
}
