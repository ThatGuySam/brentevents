# Brentom's Community Events Calendar

A lean, durable, and free community events calendar powered by GitHub and Next.js.

## How It Works

1. **Submit Events** → Users submit events via [GitHub Issues](../../issues/new?template=event-submission.yml)
2. **Auto-Process** → GitHub Actions converts issues to Markdown files
3. **Review & Approve** → Maintainer reviews and merges PRs (or auto-approve for trusted submitters)
4. **Deploy** → Static site rebuilds and deploys automatically

## Tech Stack

- **Frontend**: Next.js with static export
- **Content**: Markdown files with YAML frontmatter
- **Backend**: GitHub (Issues + Actions + PRs)
- **Hosting**: Cloudflare Pages / Netlify / Vercel (all free tier compatible)

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   └── event-submission.yml    # Event submission form
│   └── workflows/
│       └── process-event.yml       # Automation workflow
├── app/
│   ├── page.tsx                    # Homepage
│   ├── events/[slug]/page.tsx      # Event detail pages
│   └── submit/page.tsx             # Submission instructions
├── content/
│   ├── events/                     # Event markdown files
│   └── config/
│       ├── categories.json         # Event categories
│       └── trusted-submitters.json # Auto-approve list
├── lib/
│   └── events.ts                   # Event loading utilities
└── components/
    └── EventCard.tsx               # Event card component
```

## Adding Trusted Submitters

Edit `content/config/trusted-submitters.json` to add GitHub usernames that should have their events auto-approved:

```json
{
  "trusted_github_users": ["brentom", "other-trusted-user"]
}
```

## Deployment

### Cloudflare Pages (Recommended)

1. Connect your GitHub repo to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `out`
4. Deploy!

### Netlify

1. Connect your GitHub repo to Netlify
2. Build settings are auto-detected from `next.config.js`
3. Deploy!

### Vercel

1. Import your GitHub repo to Vercel
2. Everything is auto-configured for Next.js
3. Deploy!

## Cost

| Service | Cost |
|---------|------|
| GitHub (public repo) | Free |
| GitHub Actions | Free (2,000 mins/month) |
| Cloudflare Pages | Free (unlimited bandwidth) |
| Custom Domain | ~$10/year (optional) |
| **Total** | **$0 - $10/year** |

## License

MIT
