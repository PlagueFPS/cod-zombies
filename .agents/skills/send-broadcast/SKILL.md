---
name: send-broadcast
description: Preview and deliver newsletter broadcasts for guide releases, new features, and policy updates with the send-broadcast CLI. Use when announcing site content or sending newsletter emails.
---

# Send newsletter broadcasts

The `send-broadcast` CLI drafts and delivers newsletter emails to subscribers through the Resend API. The script lives at [scripts/send-broadcast.ts](scripts/send-broadcast.ts).

Dry-run mode is the default. Running any command without the `--send` flag renders the email, prints the preview text, and outputs the plain-text body without calling Resend. The CLI sends an email only when you pass `-s` or `--send`.

## Inspect options with the help flag

Before you run a command, inspect the available flags and subcommands with the `-h` flag. The CLI uses Effect CLI, which validates inputs against defined schemas and prints exact flag names, aliases, and allowed choices.

To view the top-level commands and shared flags, pass `-h` to the root script:

```bash
bun run broadcast -- -h
```

To view the flags, required arguments, and allowed choices for a specific subcommand, pass `-h` after the subcommand name:

```bash
bun run broadcast -- content -h
bun run broadcast -- feature -h
bun run broadcast -- policy -h
```

Inspect `-h` output when you are unsure of flag syntax or choice values. Querying `-h` gives the authoritative options from the command parser.

## Subcommand reference

The CLI provides three subcommands.

### Announce site content (`content`)

The `content` subcommand announces a new or updated guide.

```bash
bun run broadcast -- content [flags]
```

Flags:

- `--kind`, `-k <choice>`: Guide type to announce. Allowed values are `main-quest`, `side-quest`, `relic`, and `zombie`.
- `--id`, `-i <string>`: Slug for the guide in the data catalog.
- `--bullet`, `-b <string>`: Highlight line for the email body. Pass the flag multiple times to add multiple bullets. Required for `main-quest`, `side-quest`, and `relic`. Prohibited for `zombie`.
- `--title`, `-t <string>`: Optional. Overrides the guide title found in the catalog.
- `--description`, `-d <string>`: Optional. Overrides the guide description found in the catalog.
- `--send`, `-s`: Delivers the email to subscribers. Omit this flag to run a dry run.

Rules by content kind:

- `main-quest`: Set `-k main-quest`. Pass the map ID to `-i` (for example, `-i reckoning`). The map must define a main quest. The map status cannot be `Coming Soon`. You must provide at least one `-b` flag.
- `side-quest`: Set `-k side-quest`. Pass the side-quest ID to `-i` (for example, `-i free-500-points`). The quest status cannot be `Coming Soon`. You must provide at least one `-b` flag.
- `relic`: Set `-k relic`. Pass the relic ID to `-i` (for example, `-i lawyers-pen`). The relic status cannot be `Coming Soon`. You must provide at least one `-b` flag.
- `zombie`: Set `-k zombie`. Pass the bestiary slug to `-i` (for example, `-i avogadro`). The entry status cannot be `Coming Soon`. Do not pass `-b` or `--bullet`. The zombie template uses a fixed breakdown list. If you pass a bullet flag, the command exits with an error.

### Announce new site features (`feature`)

The `feature` subcommand sends the announcement for new site features.

```bash
bun run broadcast -- feature [flags]
```

Flags:

- `--send`, `-s`: Delivers the email to subscribers. Omit this flag to run a dry run.

The feature email uses a fixed template. The command takes no ID, title, description, or bullet flags.

### Announce policy changes (`policy`)

The `policy` subcommand announces an update to the site privacy policy.

```bash
bun run broadcast -- policy [flags]
```

Flags:

- `--bullet`, `-b <string>`: Summary bullet describing the policy change. Pass the flag multiple times to add multiple bullets. You must provide at least one `-b` flag.
- `--send`, `-s`: Delivers the email to subscribers. Omit this flag to run a dry run.

## Workflow for agents

Follow this sequence whenever you prepare or send a newsletter broadcast.

### 1. Check command flags

Run the target subcommand with `-h` to confirm the required flags and options.

```bash
bun run broadcast -- content -h
```

### 2. Run a dry run to inspect output

Execute the command without `--send`. Check the printed metadata and text body.

For a relic guide:

```bash
bun run broadcast -- content -k relic -i lawyers-pen -b "Where to light the three red candles"
```

For a main quest guide:

```bash
bun run broadcast -- content -k main-quest -i reckoning -b "How to stabilize the Aether Reactors"
```

For a side quest guide:

```bash
bun run broadcast -- content -k side-quest -i free-500-points -b "The door to open first"
```

For a bestiary guide:

```bash
bun run broadcast -- content -k zombie -i avogadro
```

For a policy update:

```bash
bun run broadcast -- policy -b "Data retention limits" -b "Cookie preferences"
```

A dry run outputs the sender address, reply-to address, audience segment ID, subject, preview line, and the full plain-text message. Verify that the guide URL, bullet points, and titles match what you expect.

### 3. Deliver the broadcast

If you intend to deliver real email to subscribers, add `-s` or `--send`.

Caution: Adding `--send` delivers real email to all newsletter subscribers. Never use `--send` during test runs or verification tasks.

```bash
bun run broadcast -- content -k relic -i lawyers-pen -b "Where to light the three red candles" --send
```
