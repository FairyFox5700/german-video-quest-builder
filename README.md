# German Video Quest Builder

Turn a video into a mobile German-learning game and publish it on GitHub Pages.

## Easiest workflow

Send Hermes either a video file or a YouTube link and say:

> Build a German VideoQuest. Level B2.

Hermes extracts the main ideas, creates a level-appropriate German article, four comprehension questions, two sentence puzzles, eight vocabulary cards, validates the quest, commits it here, and verifies the live Pages site.

## What learners get

- German article grounded in the source video
- comprehension quiz with feedback
- sentence-order exercises for complex grammar
- vocabulary flip cards
- XP, hearts, progress, persistence, replay, and source link
- responsive design for phone and desktop

## Add a quest locally

A generated quest is data, never generated HTML or JavaScript.

```bash
node tools/add-quest.mjs path/to/quest.json
npm test
npm run validate
npm run build
```

The JSON must satisfy the invariants enforced by `tools/validate-quest.mjs`: A2–C1, at least three article paragraphs, four questions, two sentence puzzles, and eight vocabulary items.

## Development

Requires Node.js 22+ and no third-party packages.

```bash
npm test
npm run validate
npm run build
python -m http.server 8765 --directory docs
```

Open <http://localhost:8765>.

## Deployment

Every push to `main` runs tests and validates all quest data. The committed `docs/` build is deployed by GitHub Pages from `main`, avoiding any server dependency. Quest progress stays in the learner's browser using versioned `localStorage`.

## Automation boundary

GitHub Pages hosts the finished game. Lesson generation is performed by Hermes, which can accept a Telegram video or YouTube link. For a private Telegram upload, only the derived lesson is published—the media file and transcript stay out of GitHub. GitHub Models was retired on July 30, 2026, so this repository does not pretend that GitHub Actions has a built-in model API. No model key or transcript is exposed in the public site, and raw transcripts are not committed.

## Privacy and rights

Only submit videos you are allowed to process. The repository stores a source link and a short derived learning exercise, not the complete transcript or source media.

## License

MIT
