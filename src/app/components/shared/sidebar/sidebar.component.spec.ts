import { TestBed, getTestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import * as globalsConstants from 'src/app/common/globals';

import { SidebarComponent } from './sidebar.component';

import { Globals } from 'src/app/common/globals';
import { CoreService } from 'src/app/services/core.service';
import { HttpClientModule } from '@angular/common/http';

describe('SideBar Component', () => {
  let component: SidebarComponent;
  let injector: TestBed;
  let core_service: CoreService;
  let globals: Globals;
  let toast: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    toast = jasmine.createSpyObj<ToastrService>('ToasterService', ['error', 'success']);
    TestBed.configureTestingModule({
      providers: [CoreService, Globals,
        { provide: ToastrService, useValue: toast }],
      imports: [HttpClientModule, ToastrModule.forRoot()]
    });
    injector = getTestBed();
    core_service = injector.get(CoreService);
    globals = injector.get(Globals);

    component = new SidebarComponent(globals, core_service);
  });

  it('Create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('Should get status sidebar', () => {
    const spy_res = spyOn(core_service, 'toggleSidebar');
    component.toggleSidebar();
    expect(spy_res).toHaveBeenCalled();
  });

});
