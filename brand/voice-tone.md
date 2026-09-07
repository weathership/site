# Voice & tone

## The short version

Calm. Technical. Optimistic without being credulous. We sound like the
person at the table who has read the paper, runs the system in
production, and isn't trying to sell you anything.

## Tense

Present, almost always.

> ✓ The system reads telemetry from 10,000 simulated machines.
> ✗ The system will read telemetry from 10,000 simulated machines.

Use future tense only when describing genuine future plans on a roadmap.

## Person

- **First-person plural ("we")** for weathership as an entity.
- **Second-person singular ("you")** for the reader.
- **Third-person** for the systems we build.

> ✓ We built it because you asked for an honest answer about latency.
>   It runs every commit.

Avoid anthropomorphizing the software. The system *processes*, *reads*,
*emits* — it doesn't *think*, *understand*, or *decide*.

## What we sound like

- **Specific.** Numbers with units. Names of things. File paths. Repos.
- **Bounded.** "On this benchmark, with these inputs," not "always."
- **Plain.** Short sentences when a short sentence will do. Em-dashes for
  asides. Paragraphs that breathe.
- **Generous.** We name the prior art and the people we learned from.

## What we don't sound like

- **Hyped.** No "revolutionary," "game-changing," "10x," "AI-first," or
  "next-generation."
- **Mystic.** No "emergence," "intelligence," "soul of the machine,"
  "minds," or "thinking."
- **Salesy.** No "leverage," "synergy," "unlock," "enterprise-grade," or
  "best-in-class." Your reader is a peer, not a procurement officer.
- **Hand-wavy.** No "many," "various," "some," "a number of." Pick a
  number or say "we don't know yet."

## Before / after

> ✗ weathership leverages cutting-edge AI to revolutionize how
>   enterprises think about their data.
>
> ✓ Signals is the federated hub. Sibling engines attach over
>   signals-protocol; the warehouse is Kudu and Iceberg.

> ✗ Aegir unlocks unprecedented insight into your data warehouse.
>
> ✓ Aegir reads relational tables and predicts what each column means. On
>   the WikiTables benchmark, it gets the column type right 84% of the
>   time. Where it's wrong, it tells you it's uncertain.

> ✗ The system will eventually be capable of fully autonomous reasoning
>   about manufacturing telemetry.
>
> ✓ The system processes 56,000 events per second across 10,000
>   simulated machines. It doesn't reason — it applies a state machine to
>   each event and persists the result.

## Headlines

Title case for proper nouns and acronyms. Sentence case for everything
else, including page titles and headlines on the website. Periods at the
end of headlines only when the headline is a full sentence.
