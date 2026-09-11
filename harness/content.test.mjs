import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { validatePublicationEvidence } from './evidence.mjs';
import { siteCopy, locales, sessions, experiences, founders, socialLinks, editorialSelection, getHomeSelection, getStudioSessions } from '../src/data/site.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
const contract = JSON.parse(readFileSync(new URL('./brand-contract.json', import.meta.url), 'utf8'));
const sources = JSON.parse(readFileSync(new URL('./content-sources.json', import.meta.url), 'utf8'));
const nonempty = (s, name) => assert.ok(typeof s === 'string' && s.trim(), `${name}: missing public copy`);
const bilingual = (text, name) => locales.forEach(locale => nonempty(text?.[locale], `${name}.${locale}`));
const unique = (items, name) => assert.equal(new Set(items).size, items.length, `${name}: duplicate identifier`);
const https = (url, name) => assert.equal(new URL(url).protocol, 'https:', `${name}: expected HTTPS`);
function isoDate(date, name) {
  assert.match(date, /^\d{4}-\d{2}-\d{2}$/, `${name}: use YYYY-MM-DD`);
  assert.equal(new Date(date).toISOString().slice(0, 10), date, `${name}: invalid calendar date`);
}
function leafPaths(value, prefix = '') {
  return Object.entries(value).flatMap(([key, item]) => typeof item === 'string'
    ? (nonempty(item, `${prefix}${key}`), [`${prefix}${key}`])
    : leafPaths(item, `${prefix}${key}.`)).sort();
}
function publicImage(src) {
  assert.match(src, /^\/(?!\/)[^?#]+\.(webp|png|jpe?g|avif)$/i, `Use a local optimized image: ${src}`);
  const target = path.resolve(root, 'public', src.slice(1));
  assert.ok(target.startsWith(path.join(root, 'public') + path.sep), 'Image must stay within public/');
  const size = statSync(target).size;
  assert.ok(size > 0 && size <= 3 * 1024 * 1024, `${src}: empty or over 3 MiB; optimize before publishing`);
}

test('English and Chinese have the same complete public-copy structure', () => {
  assert.deepEqual(locales, contract.locales);
  assert.deepEqual(leafPaths(siteCopy.en), leafPaths(siteCopy.zh));
  assert.equal(siteCopy.en.home.clubTitle, 'NeoBee Club');
  assert.equal(siteCopy.en.home.studioTitle, 'NeoBee Studio');
  assert.equal(siteCopy.zh.home.clubTitle, 'NeoBee Club');
  assert.equal(siteCopy.zh.home.studioTitle, 'NeoBee Studio');
});

test('Sessions have unique identities, valid YouTube URL shapes, complete translations and coherent durations', () => {
  unique(sessions.map(s => s.id), 'Session IDs');
  unique(sessions.map(s => s.number), 'Session numbers');
  unique(sessions.map(s => s.youtube), 'Session videos');
  sessions.forEach(session => {
    nonempty(session.title, session.id);
    bilingual(session.description, `${session.id}.description`);
    assert.match(session.number, /^\d{3,}$/);
    const url = new URL(session.youtube);
    assert.equal(url.origin, 'https://www.youtube.com');
    assert.equal(url.pathname, '/watch');
    assert.match(url.searchParams.get('v') || '', /^[\w-]{11}$/);
    assert.match(session.duration, /^(?:\d+:)?\d{1,2}:[0-5]\d$/);
    const duration = session.duration.split(':').reduce((sum, part) => sum * 60 + Number(part), 0);
    assert.equal(duration, session.durationSeconds, `${session.id}: displayed duration differs from SEO duration`);
    assert.ok(duration > 0);
    isoDate(session.uploadDate, `${session.id}.uploadDate`);
    if (session.recordedDate) isoDate(session.recordedDate, `${session.id}.recordedDate`);
    assert.match(session.year, /^\d{4}$/);
    if (session.homeFeature) {
      bilingual(session.homeFeature.title, `${session.id}.homeFeature.title`);
      bilingual(session.homeFeature.body, `${session.id}.homeFeature.body`);
    }
    if (session.venue) {
      nonempty(session.venue.name, `${session.id}.venue`);
      bilingual(session.venue.location, `${session.id}.venue.location`);
      https(session.venue.url, `${session.id}.venue.url`);
    }
  });
});

test('Homepage and Studio are explicitly curated; a new record cannot silently replace a feature or grow the homepage', () => {
  const { featuredSession, selectedSessions, featuredExperience } = getHomeSelection();
  assert.equal(featuredSession.id, editorialSelection.home.featuredSessionId);
  assert.ok(selectedSessions.length <= contract.maxHomeSelectedSessions, 'Homepage is a selection, not the whole archive');
  unique([featuredSession.id, ...selectedSessions.map(s => s.id)], 'Homepage selections');
  assert.equal(featuredExperience.id, editorialSelection.home.featuredExperienceId);
  bilingual(featuredSession.homeFeature.title, 'Featured heading');
  bilingual(featuredSession.homeFeature.body, 'Featured description');
  bilingual(featuredExperience.homeFeature.title, 'Featured experience heading');
  bilingual(featuredExperience.homeFeature.body, 'Featured experience description');
  const studio = getStudioSessions();
  assert.ok(studio.length > 0, 'Studio needs selected work');
  unique(studio.map(s => s.id), 'Studio selection');
});

test('Experiences, assets and source records are complete', (t) => {
  unique(experiences.map(e => e.id), 'Experience IDs');
  experiences.forEach(e => {
    bilingual(e.title, `${e.id}.title`);
    bilingual(e.description, `${e.id}.description`);
    bilingual(e.date, `${e.id}.date`);
    isoDate(e.dateISO, `${e.id}.dateISO`);
    https(e.href, e.id);
    if (e.homeFeature) {
      bilingual(e.homeFeature.title, `${e.id}.homeFeature.title`);
      bilingual(e.homeFeature.body, `${e.id}.homeFeature.body`);
    }
  });
  [...sessions, ...experiences, ...founders].forEach(item => publicImage(item.image));
  [...sessions, ...experiences].forEach(item => {
    const notes = validatePublicationEvidence(item, sources[item.id]);
    for (const note of notes) t.diagnostic(`MANUAL REVIEW — ${item.id} [${note.field}]: ${note.note}`);
  });
});

test('Evidence metadata rejects historical/analytical kinds, nonpublic status and mismatched work scope', () => {
  const record = sessions[0];
  const evidence = sources[record.id];
  assert.doesNotThrow(() => validatePublicationEvidence(record, evidence));
  for (const evidenceKind of ['historical-plan', 'analysis', 'assistant-suggestion', undefined]) {
    assert.throws(() => validatePublicationEvidence(record, { ...evidence, evidenceKind }), /historical plans and analysis/);
  }
  for (const publicationStatus of ['private', 'unlisted', 'planned', 'unknown', undefined]) {
    assert.throws(() => validatePublicationEvidence(record, { ...evidence, publicationStatus }), /confirm public status/);
  }
  for (const scope of [{ kind: 'brand', id: record.id }, { kind: 'work', id: 'another-work' }, undefined]) {
    assert.throws(() => validatePublicationEvidence(record, { ...evidence, scope }), /evidence must apply to this work/);
  }
  assert.throws(() => validatePublicationEvidence(record, { ...evidence, asOf: '2026-02-30' }), /invalid asOf/);
  assert.throws(() => validatePublicationEvidence(record, { ...evidence, sources: ['https://example.com/another-work'] }), /primary link must match/);
  assert.throws(() => validatePublicationEvidence(record, { ...evidence, reviewNotes: [{ field: 'date' }] }), /open question/);
});

test('Founder presence and official contact channels survive content updates', () => {
  for (const id of ['hao', 'leo']) {
    const founder = founders.find(f => f.id === id);
    assert.ok(founder, `Keep ${id}'s profile unless the owner changes the brand structure`);
    bilingual(founder.bio, `${id}.bio`);
    bilingual(founder.role, `${id}.role`);
    assert.ok(founder.socials.length > 0, `${id}: keep personal social links`);
    founder.socials.forEach(s => https(s.href, `${id}.${s.label}`));
  }
  assert.equal(socialLinks.email, 'mailto:theneobeeclub@gmail.com');
  for (const key of ['instagram', 'youtube', 'ghostframe']) https(socialLinks[key], key);
});

test('Guardrails actually reject missing records, duplicated placements and incomplete feature translations', () => {
  // Mutate only this test process's in-memory data, restoring every value even on failure.
  const selection = editorialSelection.home;
  const originalId = selection.featuredSessionId;
  try {
    selection.featuredSessionId = 'missing-session';
    assert.throws(() => getHomeSelection(), /unknown ID/);
  } finally { selection.featuredSessionId = originalId; }
  selection.selectedSessionIds.push(originalId);
  try { assert.throws(() => getHomeSelection(), /also in home.selectedSessionIds/); }
  finally { selection.selectedSessionIds.pop(); }
  selection.selectedSessionIds.push(selection.selectedSessionIds[0]);
  try { assert.throws(() => getHomeSelection(), /duplicate session IDs/); }
  finally { selection.selectedSessionIds.pop(); }
  for (const record of [sessions.find(s => s.id === originalId), experiences.find(e => e.id === selection.featuredExperienceId)]) {
    const originalText = record.homeFeature.body.zh;
    try {
      record.homeFeature.body.zh = ' ';
      assert.throws(() => getHomeSelection(), /both en and zh/);
    } finally { record.homeFeature.body.zh = originalText; }
  }
  assert.doesNotThrow(() => getHomeSelection());
});
