import { TestBed, getTestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import * as globalsConstants from 'src/app/common/globals';
import Swal from 'sweetalert2';

import { NotificationComponent } from './notification.component';
import { NotificationInterface } from 'src/app/models/notification-interface';

import { Globals } from 'src/app/common/globals';
import { CoreService } from 'src/app/services/core.service';
import { HttpClientModule } from '@angular/common/http';

describe('Notification Component', () => {
  let component: NotificationComponent;
  let injector: TestBed;
  let core_service: CoreService;
  let globals: Globals;
  let toast: jasmine.SpyObj<ToastrService>;
  let notifData: NotificationInterface;

  const dummyErrorData =
  {
    "cod": 503,
    "message": "No es posible conectar con la base de datos."
  };

  const dummyDeleteData =
  {
    "cod": 200,
    "message": "Notificaciones eliminadas."
  };

  const dummySuccessData =
  {
    "cod": 200,
    "allNotifications": [],
    "total": 0,
    "actual": 1,
    "totalPages": 0
  };

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

    var dummyElement = document.createElement('div');
    document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement);

    notifData = new NotificationInterface();
    component = new NotificationComponent(core_service, globals, toast);
  });

  it('Create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('Should call OnInit', () => {
    component.ngOnInit();
    expect(component.isLoaded).toBeFalsy();
  });

  it('Should go to page number', () => {
    const dummyPage = 1;

    const spy = spyOn(core_service, 'getNotificationsByPage').and.returnValue(of(dummySuccessData));

    component.goToPage(dummyPage);
    expect(component.page).toEqual(dummyPage);
    expect(component.isLoaded).toBeTruthy();
  });

  it('Should get all notifications', () => {
    const dummyPage = 1;

    const spy = spyOn(core_service, 'getNotificationsByPage').and.returnValue(of(dummySuccessData));

    component.getNotificationsByPage(dummyPage);

    expect(component.notifications).toEqual(dummySuccessData.allNotifications);
    expect(component.isLoaded).toBeTruthy();
  });

  it('Error getting all notifications', () => {
    const dummyPage = 1;

    const spy = spyOn(core_service, 'getNotificationsByPage').and.returnValue(of(dummyErrorData));

    component.getNotificationsByPage(dummyPage);

    expect(component.numNotifications).toEqual(0);
    expect(component.isLoaded).toBeTruthy();
    expect(toast.error).toHaveBeenCalledWith(
      dummyErrorData.message, globalsConstants.K_ERROR_STR);
  });

  it('Should reload data', () => {
    const spy = spyOn(core_service, 'getNotificationsByPage').and.returnValue(of(dummySuccessData));

    component.onReload();
    expect(component.isLoaded).toBeTruthy();
  });

  it('Should delete notifications', (done) => {
    const spy_notif = spyOn(core_service, 'getNotificationsByPage').and.returnValue(of(dummySuccessData));
    const spy_delete = spyOn(core_service, 'deleteAllNotifications').and.returnValue(of(dummyDeleteData));

    component.onDeleteAll();

    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();

    setTimeout(() => {
      expect(component.isLoaded).toBeTruthy();
      expect(Swal.isVisible()).toBeTruthy();
      Swal.clickConfirm();
      done();
    });
  });
});
