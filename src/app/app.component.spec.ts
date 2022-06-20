import { TestBed, getTestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { AppComponent } from './app.component';

import { Globals } from 'src/app/common/globals';
import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('App Component', () => {
  let component: AppComponent;
  let injector: TestBed;
  let api_service: DataApiService;
  let core_service: CoreService;
  let globals: Globals;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataApiService, CoreService, Globals],
      imports: [HttpClientModule, ToastrModule.forRoot()]
    });
    injector = getTestBed();
    api_service = injector.get(DataApiService);
    core_service = injector.get(CoreService);
    globals = injector.get(Globals);

    component = new AppComponent(core_service, globals, api_service);
  });

  it('Create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('Should get style classes for the sidebar', () => {
    const dummyClasses = {
      'pinned-sidebar': false,
      'toggeled-sidebar': false
    };

    const classes = component.getClasses();
    expect(classes).toEqual(dummyClasses);
  });

  it('Should get status sidebar', () => {
    const spy_res = spyOn(component, 'toggleSidebar');
    component.toggleSidebar();
    expect(spy_res).toHaveBeenCalled();
  });
});
