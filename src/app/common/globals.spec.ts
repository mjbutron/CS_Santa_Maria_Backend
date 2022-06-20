import { Globals } from './globals';

describe('Globals', () => {

  const globals = new Globals();

  it('Create an instance', () => {
    expect(globals).toBeTruthy();
  });
});
