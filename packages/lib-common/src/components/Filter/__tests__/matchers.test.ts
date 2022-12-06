
import { createMatcher, createMetaMatcher, freetextMatcher } from '../matchers';

const matchFreetext = (
  selectedFilters,
  filter = {
    type: 'freetext',
    toPlaceholderLabel: () => 'name',
  },
) =>
  createMatcher({
    selectedFilters,
    ...freetextMatcher,
    fields: [
      {
        id: 'name',
        toLabel: () => 'name',
        filter,
      },
    ],
  });

describe('standard matchers', () => {
  it('matches the entity by single letter', () => {
    const match = matchFreetext({ ['name']: ['b', 'c', 'd'] });
    expect(match({ ['name']: 'bar' })).toBeTruthy();
  });

  it('is not matching the entity because the value does not include selected substrings', () => {
    const match = matchFreetext({ ['name']: ['b', 'c', 'd'] });
    expect(match({ ['name']: 'foo' })).toBeFalsy();
  });

  it('is not matching the entity because entity has no such field', () => {
    const match = matchFreetext({ ['name']: ['b', 'c', 'd'] });
    expect(match({})).toBeFalsy();
  });

  it('is not matching the entity because entity is nullish', () => {
    const match = matchFreetext({ ['name']: ['b', 'c', 'd'] });
    expect(match(null)).toBeFalsy();
  });

  it('matches the entity because column has no filter', () => {
    const match = matchFreetext({ ['name']: ['b', 'c', 'd'] }, null);
    expect(match({ ['name']: 'bar' })).toBeTruthy();
  });

  it('matches the entity because column has a different filter', () => {
    const match = matchFreetext(
      { ['name']: ['b', 'c', 'd'] },
      {
        type: 'enum',
        toPlaceholderLabel: () => 'name',
      },
    );
    expect(match({ ['name']: 'bar' })).toBeTruthy();
  });

  it('matches the entity because no filters are selected', () => {
    const match = matchFreetext({});
    expect(match({ ['name']: 'bar' })).toBeTruthy();
  });
});

const matchBothFieldsFreetext = () =>
  createMetaMatcher(
    {
      ['name']: ['oo'],
      ['namespace']: ['ar'],
    },
    [
      {
        id: 'name',
        toLabel: () => 'name',
        filter: {
          type: 'freetext',
          toPlaceholderLabel: () => 'name',
        },
      },
      {
        id: 'namespace',
        toLabel: () => 'namespace',
        filter: {
          type: 'freetext',
          toPlaceholderLabel: () => 'namespace',
        },
      },
    ],
  );

describe('meta matchers', () => {
  it('matches the entity on both columns', () => {
    const matchBoth = matchBothFieldsFreetext();
    expect(matchBoth({ ['name']: 'foo', ['namespace']: 'bar' })).toBeTruthy();
  });

  it('is not matching because of namespace column', () => {
    const matchBoth = matchBothFieldsFreetext();
    expect(matchBoth({ ['name']: 'foo', ['namespace']: 'foo' })).toBeFalsy();
  });
});
