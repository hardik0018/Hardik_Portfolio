import { StatementSegment } from "@/types/statements";

/**
 * Parses a string containing {curly braces} into segments.
 * Text inside braces is marked as italic.
 */
export function parseSegments(src: string): { segments: StatementSegment[]; plain: string } {
  const segments: StatementSegment[] = [];
  const re = /\{([^}]+)\}|([^{]+)/g;
  let m: RegExpExecArray | null;
  let cursor = 0;

  while ((m = re.exec(src)) !== null) {
    const t = m[1] ?? m[2] ?? "";
    segments.push({
      text: t,
      italic: !!m[1],
      start: cursor,
      end: cursor + t.length
    });
    cursor += t.length;
  }

  return { segments, plain: src.replace(/[{}]/g, "") };
}
