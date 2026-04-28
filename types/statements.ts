export interface Statement {
  id: string;
  number: string;
  label: string;
  text: string;
}

export interface StatementSegment {
  text: string;
  italic: boolean;
  start: number;
  end: number;
}

export interface ParsedStatement extends Statement {
  segments: StatementSegment[];
  plain: string;
}

export interface StatementsAnimConfig {
  stmtDur: number;
  typewriterDur: number;
  scrub: number | boolean;
}
