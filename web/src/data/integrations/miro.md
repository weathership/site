---
name: "Miro"
tagline: "Board-shaped collaboration via the official Miro AI MCP — direction, not a pin yet."
status: "preview"
repo: "https://github.com/miroapp/miro-ai"
docs: "https://developers.miro.com/docs/mcp-intro"
visibility: "public"
order: 5
summary: "Miro's official AI tools expose boards over MCP (mcp.miro.com, OAuth). The weathership approach is to consume that MCP from Hermes and other engines — browse, diagram, and spec-extract onto boards — without vendoring miro-ai or standing up a second identity plane."
---

[Miro AI](https://github.com/miroapp/miro-ai) is Miro's official
developer kit: an MCP server, skills (browse, diagram, doc, table,
code-spec, code-review), and plugins for Claude Code, Cursor, Gemini
CLI, and Codex. Authentication is OAuth against the operator's Miro
account. That is the surface we intend to use.

## Options (under investigation)

1. **Hermes plugin (preferred first cut).** A weathership plugin that
   is an MCP client of `https://mcp.miro.com/`. AgentRTC sessions
   already hold a GPU and a human on WebRTC; the same session can
   browse a board, drop a flowchart, or pull a spec without a second
   agent runtime. Skills stay Miro's; we only bind tools into the
   Hermes tool list and record the board URL as a data-product fact.
2. **Engine-local MCP host.** Gaius or Signals runs the MCP client in
   the engine process (same pattern as Metabase keeping tool
   execution on-side). Useful if a cognition or instruct turn needs
   a board without an interactive Hermes session.
3. **Activity-scoped board.** A coordination Activity carries a Miro
   board id as an artifact URI, the way Metaflow runs carry RustFS
   URIs. Nautilus would observe the Activity; it would not speak
   Miro.
4. **Do not vendor `miroapp/miro-ai`.** Consume the hosted MCP.
   Duplicate local MCP servers fight OAuth sessions (Miro's own
   warning). Enterprise tenants need admin enablement of MCP; that
   is an ops note, not a fork.

Identity stays Cloudflare Zero Trust + the operator's Miro OAuth.
No Miro service account in the Signals secret set until a production
Activity actually needs an unattended writer.

**Soon:** plugin skeleton in the Hermes pin, a lab board used from an
`agent-rtc` session, and a warehouse fact type for `miro.com/app/board/…`
URIs. Until then this page is the direction, status **preview**.
