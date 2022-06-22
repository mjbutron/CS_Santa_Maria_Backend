import { TestBed, getTestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import * as globalsConstants from 'src/app/common/globals';

import { NavbarComponent } from './navbar.component';

import { Globals } from 'src/app/common/globals';
import { AuthService } from 'src/app/services/auth.service';
import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';
import { HttpClientModule } from '@angular/common/http';

describe('Navbar Component', () => {
  let component: NavbarComponent;
  let injector: TestBed;
  let auth_service: AuthService;
  let api_service: DataApiService;
  let core_service: CoreService;
  let globals: Globals;
  let toast: jasmine.SpyObj<ToastrService>;

  const dummyErrorData =
  {
    "cod": 503,
    "message": "No es posible conectar con la base de datos."
  };

  const dummyLogoutSuccess =
  {
    "cod": 200,
    "error": false,
    "message": "Desconectado correctamente."
  };

  const dummyFindNotif =
  {
    "cod": 200,
    "foundNotifications": 5
  };

  const dummyNoFindNotif =
  {
    "cod": 200,
    "foundNotifications": 0
  };

  beforeEach(() => {
    toast = jasmine.createSpyObj<ToastrService>('ToasterService', ['error', 'success']);
    TestBed.configureTestingModule({
      providers: [AuthService, DataApiService, CoreService, Globals,
        { provide: ToastrService, useValue: toast }],
      imports: [HttpClientModule, ToastrModule.forRoot()]
    });
    injector = getTestBed();
    auth_service = injector.get(AuthService);
    api_service = injector.get(DataApiService);
    core_service = injector.get(CoreService);
    globals = injector.get(Globals);

    component = new NavbarComponent(auth_service, api_service, core_service, toast, globals);
  });

  it('Create an instance', () => {
    expect(component).toBeTruthy();
    expect(component.classNotifications).toEqual(globalsConstants.K_NAVBAR_CLASS_BELL);
  });

  it('Should call OnInit', () => {
    component.ngOnInit();
    expect(component.isLoading).toBeFalsy();
    expect(component.hasNotifications).toBeFalsy();
  });

  it('Should change collapse right menu', () => {
    component.isCollapsed = true;
    component.changeCollapse();
    expect(component.isCollapsed).toBeFalsy();
  });

  it('Should find notifications', () => {
    const spy = spyOn(core_service, 'findNotifications').and.returnValue(of(dummyFindNotif));

    component.findNotifications();
    expect(component.hasNotifications).toBeTruthy();
  });

  it('Should not obtain notifications', () => {
    const spy = spyOn(core_service, 'findNotifications').and.returnValue(of(dummyNoFindNotif));

    component.findNotifications();
    expect(component.hasNotifications).toBeFalsy();
  });

  it('Error getting notifications', () => {
    const spy = spyOn(core_service, 'findNotifications').and.returnValue(of(dummyErrorData));

    component.findNotifications();
    expect(component.hasNotifications).toBeFalsy();
  });


});
