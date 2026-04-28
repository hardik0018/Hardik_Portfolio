"use client";

import { useMemo } from "react";
import { parseSegments } from "@/lib/parseSegments";
import { useStatementsAnimation } from "@/hooks/useStatementsAnimation";
import StatementStage from "./StatementStage";
import { STATEMENTS } from "./statements.data";

const ANIM_CONFIG = {
  stmtDur: 3,
  typewriterDur: 1.0,
  scrub: 0.8,
};

export default function Statements() {
  const parsed = useMemo(
    () => STATEMENTS.map((statement) => ({ ...parseSegments(statement.text), ...statement })),
    []
  );

  const {
    rootRef,
    pinRef,
    stageRefs,
    numberRefs,
    tagRefs,
    selectionRefs,
    headingRefs,
    innerRefs,
    commentRefs,
    hardikRefs,
  } = useStatementsAnimation(parsed, ANIM_CONFIG);

  return (
    <div ref={rootRef} className="relative">
      <section
        ref={pinRef}
        className="relative min-h-[100svh] w-full overflow-hidden bg-background py-16 text-foreground md:h-screen md:py-0"
        aria-label="Statements - Hardik Vatukiya"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right,currentColor 1px,transparent 1px),linear-gradient(to bottom,currentColor 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 flex h-full items-center justify-center">
          {parsed.map((statement, index) => (
            <StatementStage
              key={statement.id}
              ref={(element) => {
                if (element) stageRefs.current[index] = element;
              }}
              number={statement.number}
              label={statement.label}
              plainText={statement.plain}
              numberRef={(element) => {
                if (element) numberRefs.current[index] = element;
              }}
              tagRef={(element) => {
                if (element) tagRefs.current[index] = element;
              }}
              selectionRef={(element) => {
                if (element) selectionRefs.current[index] = element;
              }}
              headingRef={(element) => {
                if (element) headingRefs.current[index] = element;
              }}
              innerRef={(element) => {
                if (element) innerRefs.current[index] = element;
              }}
              commentRef={(element) => {
                if (element) commentRefs.current[index] = element;
              }}
              hardikRef={(element) => {
                if (element) hardikRefs.current[index] = element;
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
