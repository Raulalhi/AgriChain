import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductrecallpagePage } from './productrecallpage.page';

describe('ProductrecallpagePage', () => {
  let component: ProductrecallpagePage;
  let fixture: ComponentFixture<ProductrecallpagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductrecallpagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductrecallpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
