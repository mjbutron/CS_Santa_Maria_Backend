import { TimeWithoutSecPipe } from './time-without-sec.pipe';

describe('TimeWithoutSecPipe', () => {

  const pipe = new TimeWithoutSecPipe();

  it('Create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('Returns the default value', () => {
    const res = pipe.transform(null);
    expect(res).toBe('--:--');
  });

  it('Returns hour and minutes', () => {
    const res = pipe.transform('18:38:12');
    expect(res).toBe('18:38');
  });
});
