import { TestBed, getTestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';

describe('Footer Component', () => {

  const component = new FooterComponent();
  let current_year = new Date().getFullYear();

  it('create an instance', () => {
    expect(component).toBeTruthy();
    expect(component.year).toEqual(current_year);
  });

});
