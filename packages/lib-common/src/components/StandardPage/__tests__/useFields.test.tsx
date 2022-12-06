import { cleanup, renderHook } from '@testing-library/react-hooks';

import { useFields } from '../useFields';

afterEach(cleanup);

describe('manage fields', () => {
  it('gets initialized from the defaults', () => {
    const {
      result: {
        current: [fields],
      },
    } = renderHook(() => useFields(undefined, [{ id: 'name', toLabel: () => '' }]));
    expect(fields).toMatchObject([{ id: 'name', isVisible: false }]);
  });
  it('enables namespace column visibility if no namespace is chosen', () => {
    const {
      result: {
        current: [fields],
      },
    } = renderHook(() =>
      useFields(undefined, [
        { id: 'name', toLabel: () => '', isVisible: true },
        { id: 'namespace', toLabel: () => '', isVisible: false },
      ]),
    );
    expect(fields).toMatchObject([
      { id: 'name', isVisible: true },
      { id: 'namespace', isVisible: true },
    ]);
  });
  it('disables namespace column visibility if a namespace is chosen', () => {
    const {
      result: {
        current: [fields],
      },
    } = renderHook(() =>
      useFields('some_namespace', [
        { id: 'name', toLabel: () => '', isVisible: true },
        { id: 'namespace', toLabel: () => '', isVisible: true },
      ]),
    );
    expect(fields).toMatchObject([
      { id: 'name', isVisible: true },
      { id: 'namespace', isVisible: false },
    ]);
  });
});
