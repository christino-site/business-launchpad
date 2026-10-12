import { describe, expect, it } from 'vitest';
import { prototype, demoHistory } from '@/lib/business-demo';

describe('Version 1 boundaries', () => {
  it('does not enable real authentication', () => expect(prototype.authentication).toBe(false));
  it('does not enable data persistence', () => expect(prototype.persistence).toBe(false));
  it('does not enable real payments', () => expect(prototype.payments).toBe(false));
  it('uses FCFA as the reference currency', () => expect(prototype.currency).toBe('FCFA'));
  it('keeps history identifiers distinct as examples', () => {
    expect(demoHistory).toHaveLength(5);
    expect(demoHistory.every(row => row.id.startsWith('EX-'))).toBe(true);
  });
});