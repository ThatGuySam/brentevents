# PRD: Community Events Calendar

**Author:** Auto-generated
**Date:** January 2026
**Status:** Draft
**Stakeholder:** Brentom

---

## 1. Overview

### Problem Statement
Brentom needs a lean, durable, and cost-effective way to host a public-facing community events calendar. Traditional CMS or database-backed solutions introduce hosting costs, maintenance overhead, and security concerns that aren't necessary for this use case.

### Solution Summary
A **static-first events calendar** built with Next.js that uses **GitHub as both the database and admin interface**. Events are stored as Markdown files with YAML frontmatter, submitted via GitHub Issues, and deployed to free static hosting.

---

## 2. Goals & Non-Goals

### Goals
- **Free or near-free hosting** (< $10/year)
- **Durable architecture** — content lives in Git, survives any platform changes
- **Public event submission** — anyone can submit events without an account
- **Simple admin workflow** — Brentom can approve/edit events directly on GitHub
- **Auto-approval mechanism** — reduce manual review burden for trusted sources
- **Fast, static pages** — instant load times, SEO-friendly

### Non-Goals
- User accounts or authentication (adds cost and complexity)
- Real-time features (comments, live updates)
- Payment processing
- Complex search/filtering (beyond basic client-side)

---

## 3. Technical Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER SUBMISSION                          │
│                                                                 │
│   User fills out GitHub Issue Form → Creates structured Issue   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     GITHUB ACTIONS PIPELINE                     │
│                                                                 │
│   1. Issue created (labeled "event-submission")                 │
│   2. Action parses Issue body → generates Markdown file         │
│   3. Creates Pull Request with new event file                   │
│   4. Auto-approve if criteria met OR wait for Brentom review    │
│   5. On merge → triggers deploy                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CONTENT REPOSITORY                         │
│                                                                 │
│   /content/events/                                              │
│     ├── 2026-01-20-tech-meetup.md                              │
│     ├── 2026-01-25-community-potluck.md                        │
│     └── 2026-02-01-workshop.md                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     NEXT.JS BUILD (SSG)                         │
│                                                                 │
│   - Reads all Markdown files at build time                      │
│   - Parses frontmatter for event metadata                       │
│   - Generates static HTML pages                                 │
│   - Deploys to static host                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      STATIC HOSTING                             │
│                                                                 │
│   Cloudflare Pages / Netlify / Vercel / GitHub Pages            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Content Structure

### Event Markdown File Format

Each event is a Markdown file with YAML frontmatter:

```markdown
---
title: "Tulsa Tech Meetup"
date: 2026-02-15
time: "6:30 PM - 8:30 PM"
location: "36 Degrees North"
address: "36 N Greenwood Ave, Tulsa, OK"
category: "tech"
organizer: "Tulsa Developers"
contact_email: "events@tulsadev.org"
url: "https://meetup.com/tulsa-tech"
image: "/images/events/tech-meetup.jpg"
tags: ["tech", "networking", "javascript"]
approved: true
submitted_by: "github-username"
submitted_at: 2026-01-10
---

Join us for our monthly tech meetup! This month we're covering:

- Lightning talks on AI/ML
- Networking session
- Free pizza and drinks

All skill levels welcome. RSVP on Meetup to reserve your spot.
```

### Directory Structure

```
/content/
  /events/
    /2026/
      /01/
        2026-01-20-event-slug.md
      /02/
        2026-02-15-event-slug.md
  /config/
    trusted-submitters.json
    categories.json
```

---

## 5. User Flows

### Flow 1: Public Event Submission

1. User navigates to "Submit Event" link on the site
2. Link redirects to GitHub Issue form (no GitHub account? Can use GitHub's anonymous option or a simple web form that creates issues via API)
3. User fills out structured form fields:
   - Event Title (required)
   - Date (required)
   - Time
   - Location/Venue
   - Address
   - Description (Markdown supported)
   - Category (dropdown)
   - Contact Email
   - Event URL
4. User submits issue
5. GitHub Action triggers, parses issue, creates PR
6. Brentom receives notification (or auto-approves if criteria met)

### Flow 2: Admin Approval (Brentom)

**Option A: Via GitHub UI**
1. Brentom receives PR notification
2. Reviews event details in PR diff
3. Can edit the Markdown file directly in GitHub if needed
4. Merges PR → triggers deploy

**Option B: Direct Edit**
1. Brentom navigates to `/content/events/` in GitHub
2. Creates new file or edits existing
3. Commits directly to main → triggers deploy

### Flow 3: Auto-Approval

Events can be auto-approved based on configurable criteria:

```json
// /content/config/trusted-submitters.json
{
  "trusted_github_users": [
    "brentam",
    "trusted-org-bot",
    "community-partner"
  ],
  "trusted_email_domains": [
    "tulsa.gov",
    "36degreesnorth.co"
  ],
  "auto_approve_categories": [
    "recurring"  // For weekly/monthly recurring events
  ]
}
```

**Auto-Approval Logic:**
1. If submitter is in `trusted_github_users` → auto-merge PR
2. If submitter email domain matches `trusted_email_domains` → auto-merge
3. If event is tagged as recurring from trusted source → auto-merge
4. Otherwise → require manual review

---

## 6. GitHub Issue Form Template

Create this file at `/.github/ISSUE_TEMPLATE/event-submission.yml`:

```yaml
name: Submit an Event
description: Submit a community event to the calendar
title: "[EVENT] "
labels: ["event-submission"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for submitting an event! Please fill out the details below.

  - type: input
    id: event-title
    attributes:
      label: Event Title
      placeholder: "Tulsa Tech Meetup"
    validations:
      required: true

  - type: input
    id: event-date
    attributes:
      label: Event Date
      description: "Format: YYYY-MM-DD"
      placeholder: "2026-02-15"
    validations:
      required: true

  - type: input
    id: event-time
    attributes:
      label: Event Time
      placeholder: "6:30 PM - 8:30 PM"

  - type: input
    id: location
    attributes:
      label: Venue/Location Name
      placeholder: "36 Degrees North"
    validations:
      required: true

  - type: input
    id: address
    attributes:
      label: Address
      placeholder: "36 N Greenwood Ave, Tulsa, OK"

  - type: dropdown
    id: category
    attributes:
      label: Category
      options:
        - Tech
        - Arts & Culture
        - Music
        - Food & Drink
        - Sports & Fitness
        - Community
        - Business & Networking
        - Education
        - Other

  - type: textarea
    id: description
    attributes:
      label: Event Description
      description: "Markdown formatting is supported"
      placeholder: "Tell us about your event..."
    validations:
      required: true

  - type: input
    id: event-url
    attributes:
      label: Event URL/Registration Link
      placeholder: "https://..."

  - type: input
    id: contact-email
    attributes:
      label: Contact Email
      placeholder: "events@example.com"

  - type: input
    id: organizer
    attributes:
      label: Organizer/Host Name
      placeholder: "Tulsa Developers"
```

---

## 7. GitHub Actions Workflow

Create this file at `/.github/workflows/process-event.yml`:

```yaml
name: Process Event Submission

on:
  issues:
    types: [opened, labeled]

jobs:
  process-event:
    if: contains(github.event.issue.labels.*.name, 'event-submission')
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Parse Issue and Create Event File
        uses: actions/github-script@v7
        with:
          script: |
            const issue = context.payload.issue;
            const body = issue.body;

            // Parse form fields from issue body
            // (GitHub Issue Forms create structured markdown)
            const parseField = (label) => {
              const regex = new RegExp(`### ${label}\\s*\\n\\s*([^\\n#]+)`, 'i');
              const match = body.match(regex);
              return match ? match[1].trim() : '';
            };

            const event = {
              title: parseField('Event Title'),
              date: parseField('Event Date'),
              time: parseField('Event Time'),
              location: parseField('Venue/Location Name'),
              address: parseField('Address'),
              category: parseField('Category').toLowerCase(),
              description: parseField('Event Description'),
              url: parseField('Event URL/Registration Link'),
              contact_email: parseField('Contact Email'),
              organizer: parseField('Organizer/Host Name'),
              submitted_by: issue.user.login,
              submitted_at: new Date().toISOString().split('T')[0]
            };

            // Generate slug and filename
            const slug = event.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');
            const filename = `content/events/${event.date}-${slug}.md`;

            // Generate markdown content
            const frontmatter = `---
title: "${event.title}"
date: ${event.date}
time: "${event.time}"
location: "${event.location}"
address: "${event.address}"
category: "${event.category}"
organizer: "${event.organizer}"
contact_email: "${event.contact_email}"
url: "${event.url}"
submitted_by: "${event.submitted_by}"
submitted_at: ${event.submitted_at}
approved: false
---

${event.description}
`;

            // Store for next step
            core.setOutput('filename', filename);
            core.setOutput('content', frontmatter);
            core.setOutput('branch', `event/${event.date}-${slug}`);
            core.setOutput('submitter', event.submitted_by);
        id: parse

      - name: Create Event File and PR
        uses: peter-evans/create-pull-request@v6
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: "Add event: ${{ steps.parse.outputs.filename }}"
          branch: ${{ steps.parse.outputs.branch }}
          title: "New Event Submission"
          body: |
            This PR was automatically created from issue #${{ github.event.issue.number }}

            **Submitter:** @${{ steps.parse.outputs.submitter }}

            Please review and merge to publish this event.
          add-paths: |
            ${{ steps.parse.outputs.filename }}

      - name: Check Auto-Approval
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const submitter = '${{ steps.parse.outputs.submitter }}';

            // Load trusted submitters config
            let trustedUsers = [];
            try {
              const config = JSON.parse(
                fs.readFileSync('content/config/trusted-submitters.json', 'utf8')
              );
              trustedUsers = config.trusted_github_users || [];
            } catch (e) {
              console.log('No trusted submitters config found');
            }

            if (trustedUsers.includes(submitter)) {
              core.setOutput('auto_approve', 'true');
            } else {
              core.setOutput('auto_approve', 'false');
            }
        id: check-approval

      - name: Auto-Approve PR
        if: steps.check-approval.outputs.auto_approve == 'true'
        uses: hmarr/auto-approve-action@v4
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

---

## 8. Hosting Comparison & Recommendation

| Platform | Free Tier | Best For | Limitations |
|----------|-----------|----------|-------------|
| **Cloudflare Pages** | Unlimited bandwidth, 500 builds/month | High traffic, global performance | Fewer Next.js features |
| **Netlify** | 100GB bandwidth, 300 build mins | Balanced features, easy setup | Commercial use allowed |
| **Vercel** | 100GB bandwidth | Best Next.js integration | No commercial use on free tier |
| **GitHub Pages** | Unlimited | Simplest setup | No SSR, public repos only |

### Recommendation: **Cloudflare Pages**

**Rationale:**
- Unlimited bandwidth = truly free at any scale
- Excellent global CDN performance
- Built-in DDoS protection
- Easy GitHub integration
- Can upgrade to Workers for future dynamic features

**Alternative:** Netlify if you need form handling or identity features later.

---

## 9. Next.js Implementation Notes

### Key Libraries

```json
{
  "dependencies": {
    "gray-matter": "^4.0.3",      // Parse YAML frontmatter
    "remark": "^15.0.0",           // Markdown processing
    "remark-html": "^16.0.0",      // Convert to HTML
    "date-fns": "^3.0.0"           // Date formatting
  }
}
```

### Static Generation Pattern

```typescript
// app/events/[slug]/page.tsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function generateStaticParams() {
  const eventsDir = path.join(process.cwd(), 'content/events');
  const files = fs.readdirSync(eventsDir);

  return files
    .filter(f => f.endsWith('.md'))
    .map(f => ({ slug: f.replace('.md', '') }));
}

export default async function EventPage({ params }) {
  const filePath = path.join(
    process.cwd(),
    'content/events',
    `${params.slug}.md`
  );
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data: frontmatter, content } = matter(fileContent);

  // Render event page with shared layout template
  return <EventLayout event={frontmatter} content={content} />;
}
```

---

## 10. Cost Analysis

| Item | Cost |
|------|------|
| GitHub (public repo) | Free |
| GitHub Actions | Free (2,000 mins/month) |
| Cloudflare Pages | Free |
| Custom Domain (optional) | ~$10/year |
| **Total** | **$0 - $10/year** |

---

## 11. Implementation Roadmap

### Phase 1: Foundation (Week 1)
- [ ] Set up GitHub repository structure
- [ ] Create GitHub Issue form template
- [ ] Implement basic GitHub Action to parse issues → create files
- [ ] Set up Next.js project with static generation

### Phase 2: Core Features (Week 2)
- [ ] Build event listing page (calendar/list view)
- [ ] Build individual event page template
- [ ] Implement frontmatter parsing
- [ ] Deploy to Cloudflare Pages

### Phase 3: Auto-Approval (Week 3)
- [ ] Create trusted submitters config
- [ ] Implement auto-approval workflow logic
- [ ] Add PR auto-merge for trusted sources
- [ ] Test end-to-end submission flow

### Phase 4: Polish (Week 4)
- [ ] Add category filtering
- [ ] Add basic search (client-side)
- [ ] SEO optimization (meta tags, sitemap)
- [ ] Add "Submit Event" page with instructions

---

## 12. Future Considerations

Things that could be added later without changing the core architecture:

- **Email notifications** — Use GitHub Actions to send emails on new events
- **iCal/Google Calendar export** — Generate .ics files at build time
- **Event images** — Store in `/public/images/events/` or use external URLs
- **Recurring events** — Add `recurrence` field to frontmatter
- **Event archival** — Move past events to `/content/archive/`
- **Simple analytics** — Cloudflare Analytics (free) or Plausible

---

## 13. Research Resources

### GitHub Issue Forms
- [Syntax for Issue Forms - GitHub Docs](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms)
- [Configuring Issue Templates - GitHub Docs](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository)

### IssueOps Pattern
- [IssueOps: Automate CI/CD with GitHub Issues - GitHub Blog](https://github.blog/engineering/issueops-automate-ci-cd-and-more-with-github-issues-and-actions/)

### GitHub Actions
- [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages) — Deploy static sites
- [Auto Approve Action](https://github.com/marketplace/actions/auto-approve) — Auto-approve PRs

### Next.js Static Generation
- [Next.js SSG Documentation](https://nextjs.org/docs/pages/building-your-application/rendering/static-site-generation)
- [Nextra - Next.js Static Site Generator](https://nextra.site)
- [Building a Markdown Blog with Next.js](https://tina.io/blog/simple-markdown-blog-nextjs)

### Hosting Comparison
- [Cloudflare vs Vercel vs Netlify 2026](https://dev.to/dataformathub/cloudflare-vs-vercel-vs-netlify-the-truth-about-edge-performance-2026-50h0)
- [Vercel vs Netlify vs Cloudflare Pages Comparison](https://www.digitalapplied.com/blog/vercel-vs-netlify-vs-cloudflare-pages-comparison)
- [Free Static Website Hosting Comparison](https://appwrite.io/blog/post/best-free-static-website-hosting)

---

## 14. Open Questions

1. **Domain name** — Does Brentom have a domain, or should we use a free subdomain (e.g., `brentevents.pages.dev`)?

2. **Event moderation** — Should declined events get a comment explaining why, or just close the issue?

3. **Image hosting** — Host images in the repo, or require external URLs (Imgur, etc.)?

4. **Multiple locations** — Is this Tulsa-specific, or should it support multiple cities?

5. **Event updates** — Should submitters be able to edit their events after submission? (Could use issue comments → trigger update workflow)

---

*This PRD is a living document. Update as decisions are made.*
