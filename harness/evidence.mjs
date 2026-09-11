import assert from 'node:assert/strict';

const publishableKinds = new Set(['owner-confirmed', 'public-observation', 'approved-baseline']);
const nonempty = value => typeof value === 'string' && value.trim().length > 0;

/** Validate declared provenance, not source truth or permission inferred from a URL. */
export function validatePublicationEvidence(record, evidence) {
  const label = `${record.id}: publication evidence`;
  assert.ok(evidence, `${label} is missing from harness/content-sources.json`);
  assert.ok(nonempty(evidence.basis), `${label} needs a concise factual basis`);
  assert.ok(publishableKinds.has(evidence.evidenceKind), `${label}: historical plans and analysis cannot establish a published work`);
  assert.equal(evidence.publicationStatus, 'public', `${label}: confirm public status before adding a work to public pages`);
  assert.deepEqual(evidence.scope, { kind: 'work', id: record.id }, `${label}: evidence must apply to this work, not the whole brand or another record`);
  assert.match(evidence.asOf || '', /^\d{4}-\d{2}-\d{2}$/, `${label}: record when this evidence applied`);
  const date = new Date(`${evidence.asOf}T00:00:00Z`);
  assert.ok(Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === evidence.asOf, `${label}: invalid asOf date`);
  assert.ok(Array.isArray(evidence.sources) && evidence.sources.length > 0, `${label}: include public source links`);
  evidence.sources.forEach(url => assert.equal(new URL(url).protocol, 'https:', `${label}: expected an HTTPS source`));
  assert.ok(evidence.sources.includes(record.youtube || record.href), `${label}: current primary link must match its source record; recheck facts when replacing media`);
  assert.ok(Array.isArray(evidence.reviewNotes), `${label}: declare reviewNotes (an empty list when there are no recorded questions)`);
  evidence.reviewNotes.forEach(note => {
    assert.ok(nonempty(note.field) && nonempty(note.note), `${label}: each open question needs a field and explanation`);
  });
  return evidence.reviewNotes;
}
