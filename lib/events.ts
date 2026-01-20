import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const eventsDirectory = path.join(process.cwd(), 'content/events');

export interface Event {
  slug: string;
  title: string;
  date: string;
  time: string;
  location: string;
  address: string;
  category: string;
  organizer: string;
  contact_email: string;
  url: string;
  submitted_by: string;
  submitted_at: string;
  approved: boolean;
  content: string;
  contentHtml?: string;
}

// Helper to normalize dates (gray-matter auto-converts YAML dates to Date objects)
function normalizeDate(date: string | Date): string {
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  return String(date);
}

export function getAllEvents(): Event[] {
  if (!fs.existsSync(eventsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(eventsDirectory);
  const allEvents = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(eventsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        content,
        ...data,
        // Normalize date fields to strings
        date: normalizeDate(data.date),
        submitted_at: data.submitted_at ? normalizeDate(data.submitted_at) : '',
      } as Event;
    })
    .filter((event) => event.approved !== false)
    .sort((a, b) => (a.date > b.date ? 1 : -1));

  return allEvents;
}

export function getUpcomingEvents(): Event[] {
  const today = new Date().toISOString().split('T')[0];
  return getAllEvents().filter((event) => event.date >= today);
}

export function getPastEvents(): Event[] {
  const today = new Date().toISOString().split('T')[0];
  return getAllEvents()
    .filter((event) => event.date < today)
    .reverse();
}

export function getEventsByCategory(category: string): Event[] {
  return getAllEvents().filter((event) => event.category === category);
}

export function getAllEventSlugs(): string[] {
  if (!fs.existsSync(eventsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(eventsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''));
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const fullPath = path.join(eventsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    content,
    contentHtml,
    ...data,
    // Normalize date fields to strings
    date: normalizeDate(data.date),
    submitted_at: data.submitted_at ? normalizeDate(data.submitted_at) : '',
  } as Event;
}

export function getCategories(): { slug: string; name: string; color: string }[] {
  const configPath = path.join(process.cwd(), 'content/config/categories.json');

  if (!fs.existsSync(configPath)) {
    return [];
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  return config.categories;
}
