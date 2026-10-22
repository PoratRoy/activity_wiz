"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ } from "@/data/faq";
import styles from "./faq.module.css";

export function FaqAccordion() {
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set());

  return (
    <div className={styles.faq}>
      {FAQ.map(({ q, a }, index) => {
        const open = expanded.has(index);
        return (
          <section key={q} className={styles.item} data-open={open}>
            <h2 className={styles.question}>
              <button
                id={`faq-question-${index}`}
                className={styles.trigger}
                aria-expanded={open}
                aria-controls={`faq-answer-${index}`}
                onClick={() => setExpanded(previous => {
                  const next = new Set(previous);
                  if (next.has(index)) next.delete(index);
                  else next.add(index);
                  return next;
                })}
              >
                <span className={styles.label}>{q}</span>
                <ChevronDown className={styles.chevron} aria-hidden="true" size={24} />
              </button>
            </h2>
            <div
              id={`faq-answer-${index}`}
              className={styles.panel}
              aria-labelledby={`faq-question-${index}`}
              aria-hidden={!open}
              inert={!open}
            >
              <div className={styles.clip}>
                <p className={styles.answer}>{a}</p>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
