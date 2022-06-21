import { TestBed, getTestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { NgForm, FormsModule, FormControl, Validators } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import * as globalsConstants from 'src/app/common/globals';
import Swal from 'sweetalert2';

import { UserComponent } from './user.component';
import { UserInterface } from 'src/app/models/user-interface';

import { Globals } from 'src/app/common/globals';
import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';
import { HttpClientModule } from '@angular/common/http';

describe('User Component', () => {
  let component: UserComponent;
  let injector: TestBed;
  let api_service: DataApiService;
  let core_service: CoreService;
  let globals: Globals;
  let toast: jasmine.SpyObj<ToastrService>;
  let userData: UserInterface;

  const dummyErrorData =
  {
    "cod": 503,
    "message": "No es posible conectar con la base de datos."
  };

  const dummyUpdateData =
  {
    "cod": 200,
    "message": "Información actualizada."
  };

  const dummyFindNotifData =
  {
    "cod": 200,
    "foundNotifications": 0
  };

  const dummySuccessData =
  {
    "cod": 200,
    "user": {
      "id": 16,
      "active": 1,
      "name": "Demo Nombre",
      "surname": "Demo Apellido",
      "email": "demo@cssm.es",
      "telephone": 777888999,
      "address": "Calle demo, 81",
      "city": "El Puerto de Santa María",
      "province": "Cádiz",
      "zipcode": 11500,
      "password": "$2y$10$q30M0Boq4QvGaU/X0sROVOUc7E6NpaTG433V.gH6UwF4/uwa6pGNe",
      "change_pass": 0,
      "user_fcbk": null,
      "user_ytube": null,
      "user_insta": null,
      "image": "default-avatar.png",
      "last_login": "2022-06-11",
      "create_date": "2022-06-11 17:34:30",
      "update_date": "2022-06-11 17:34:41",
      "rol_id": 5
    }
  };

  beforeEach(() => {
    toast = jasmine.createSpyObj<ToastrService>('ToasterService', ['error', 'success']);
    TestBed.configureTestingModule({
      providers: [DataApiService, CoreService, Globals,
        { provide: ToastrService, useValue: toast }],
      imports: [FormsModule, HttpClientModule, ToastrModule.forRoot()]
    });
    injector = getTestBed();
    api_service = injector.get(DataApiService);
    core_service = injector.get(CoreService);
    globals = injector.get(Globals);

    var dummyElement = document.createElement('div');
    document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement);

    userData = new UserInterface();
    component = new UserComponent(api_service, toast, core_service, globals);
  });

  it('Create an instance', () => {
    expect(component).toBeTruthy();
    expect(component.userObj.image).toEqual(globalsConstants.K_DEFAULT_IMAGE);
  });

  it('Should call OnInit', () => {
    component.ngOnInit();
    expect(component.activeFormImage).toBeFalsy();
    expect(component.disabledFormImage).toBeTruthy();
    expect(component.uploadSuccess).toBeFalsy();
  });

  it('Should get user profile', () => {
    const spy = spyOn(api_service, 'getUserProfile').and.returnValue(of(dummySuccessData));

    component.getUserProfile();

    expect(component.userObj).toEqual(dummySuccessData.user);
    expect(component.isLoaded).toBeTruthy();
  });

  it('Error getting user profile', () => {
    const spy = spyOn(api_service, 'getUserProfile').and.returnValue(of(dummyErrorData));

    component.getUserProfile();

    expect(component.isLoaded).toBeTruthy();
    expect(toast.error).toHaveBeenCalledWith(
      dummyErrorData.message, globalsConstants.K_ERROR_STR);
  });

  it('Should check notifications', () => {
    const spy = spyOn(core_service, 'findNotifications').and.returnValue(of(dummyFindNotifData));

    component.findNotifications();
    expect(component.numNotifications).toEqual(dummyFindNotifData.foundNotifications);
  });

  it('Should delete image', (done) => {
    component.userObj.image = "dummyImage.jpg";

    const spy_user = spyOn(api_service, 'getUserProfile').and.returnValue(of(dummySuccessData));
    const spy_update = spyOn(api_service, 'updateUserProfile').and.returnValue(of(dummyUpdateData));

    component.onDeleteImage();

    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();

    setTimeout(() => {
      expect(component.isLoaded).toBeTruthy();
      expect(component.activeFormImage).toBeFalsy();
      expect(component.disabledFormImage).toBeTruthy();
      expect(component.uploadSuccess).toBeFalsy();
      expect(Swal.isVisible()).toBeTruthy();
      Swal.clickConfirm();
      done();
    });
  });
});
