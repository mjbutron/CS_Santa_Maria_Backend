import { TimeWithoutSecPipe } from './time-without-sec.pipe';

describe('TimeWithoutSecPipe', () => {
  it('create an instance', () => {
    const pipe = new TimeWithoutSecPipe();
    expect(pipe).toBeTruthy();
  });
});
