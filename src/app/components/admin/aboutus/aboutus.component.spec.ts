import { TestBed, getTestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { AboutusComponent } from './aboutus.component';
import { AboutUsInterface } from 'src/app/models/aboutus-interface';

import { Globals } from 'src/app/common/globals';
import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';
import { HttpClientModule } from '@angular/common/http';


describe('About Us Component', () => {
  let component: AboutusComponent;
  let injector: TestBed;
  let api_service: DataApiService;
  let core_service: CoreService;
  let globals: Globals;
  let toast: jasmine.SpyObj<ToastrService>;
  let staffData: AboutUsInterface;

  const dummyErrorData =
  {
    "cod": 503,
    "message": "No es posible conectar con la base de datos."
  };

  const dummySuccessData =
  {
    "cod": "200",
    "allAboutUs": [
      {
        "id": 5,
        "name": "Demo Nombre",
        "surname1": "Apellido",
        "surname2": "",
        "image": "default-avatar.png",
        "position": "Demo",
        "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molesti. Tuto commodo.",
        "academic_degree": "",
        "user_fcbk": "https://www.facebook.com",
        "user_ytube": "https://www.youtube.com",
        "user_insta": "",
        "create_date": "2021-05-05 20:43:45",
        "update_date": "2022-06-11 14:44:03"
      },
      {
        "id": 7,
        "name": "Demo Nombre",
        "surname1": "Apellido",
        "surname2": "",
        "image": "default-avatar.png",
        "position": "Demo",
        "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molesti.",
        "academic_degree": "",
        "user_fcbk": "https://www.facebook.com",
        "user_ytube": "https://www.youtube.com",
        "user_insta": "",
        "create_date": "2021-05-29 21:44:27",
        "update_date": "2022-06-11 14:44:12"
      },
      {
        "id": 8,
        "name": "Demo Nombre",
        "surname1": "Apellido",
        "surname2": "",
        "image": "default-avatar.png",
        "position": "Demo",
        "description": " Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molesti.",
        "academic_degree": "",
        "user_fcbk": "",
        "user_ytube": "https://www.youtube.com",
        "user_insta": "",
        "create_date": "2021-10-25 18:34:18",
        "update_date": "2022-06-11 14:44:17"
      }
    ],
    "total": 3,
    "actual": 1,
    "totalPages": 1
  };

  const dummyDeleteData =
  {
    "cod": 200,
    "message": "Entrada eliminada."
  };

  const dummyDeleteImage =
  {
    "cod": 200,
    "message": "Se ha actualizado la entrada."
  };

  beforeEach(() => {
    toast = jasmine.createSpyObj<ToastrService>('ToasterService', ['error', 'success']);
    TestBed.configureTestingModule({
      providers: [DataApiService, CoreService, Globals,
        { provide: ToastrService, useValue: toast }],
      imports: [HttpClientModule, ToastrModule.forRoot()]
    });
    injector = getTestBed();
    api_service = injector.get(DataApiService);
    core_service = injector.get(CoreService);
    globals = injector.get(Globals);

    var dummyElement = document.createElement('div');
    document.getElementById = jasmine.createSpy('HTML Element').and.returnValue(dummyElement);

    staffData = new AboutUsInterface();
    component = new AboutusComponent(api_service, toast, core_service, globals);
  });

  it('Create an instance', () => {
    expect(component).toBeTruthy();

  });

  it('Should call OnInit', () => {
    component.ngOnInit();
    expect(component.isLoaded).toBeFalsy();
    expect(component.activeForm).toBeFalsy();
    expect(component.isEditForm).toBeFalsy();
    expect(component.changeImage).toBeFalsy();
    expect(component.uploadSuccess).toBeFalsy();
  });

  it('Should go to page number', () => {
    const dummyPage = 1;

    const spy = spyOn(api_service, 'getAboutUsByPage').and.returnValue(of(dummySuccessData));

    component.goToPage(dummyPage);
    expect(component.page).toEqual(dummyPage);
    expect(component.isLoaded).toBeTruthy();
  });

  it('Should get about us', () => {
    const dummyPage = 1;

    const spy = spyOn(api_service, 'getAboutUsByPage').and.returnValue(of(dummySuccessData));

    component.getAboutUsByPage(dummyPage);

    expect(component.aboutUs).toEqual(dummySuccessData.allAboutUs);
    expect(component.isLoaded).toBeTruthy();
  });

  it('Error getting all about us', () => {
    const dummyPage = 1;

    const spy = spyOn(api_service, 'getAboutUsByPage').and.returnValue(of(dummyErrorData));

    component.getAboutUsByPage(dummyPage);
    expect(component.numAboutUs).toEqual(0);
    expect(component.isLoaded).toBeTruthy();
    expect(toast.error).toHaveBeenCalledWith(
      'No es posible conectar con la base de datos.',
      'Error');
  });

  it('Should reload data', () => {
    const dummyPage = 1;

    const spy = spyOn(api_service, 'getAboutUsByPage').and.returnValue(of(dummySuccessData));

    component.onReload();
    expect(component.isLoaded).toBeTruthy();
  });

  it('Should enable the form in edit mode and set values in fields', () => {
    staffData.id = 5;
    component.onEditAboutUs(staffData);

    expect(component.activeForm).toBeTruthy();
    expect(component.isEditForm).toBeTruthy();
    expect(component.changeImage).toBeFalsy();
    expect(component.aboutUsObj.id).toEqual(5);
  });

  it('Should delete a record', (done) => {
    staffData.id = 4;
    const dummyPage = 1;
    const spy_staff = spyOn(api_service, 'getAboutUsByPage').and.returnValue(of(dummySuccessData));
    const spy_delete = spyOn(api_service, 'deleteAboutUsId').and.returnValue(of(dummyDeleteData));

    component.onDeleteAboutUs(staffData);

    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();

    setTimeout(() => {
      expect(component.isLoaded).toBeTruthy();
      expect(component.activeForm).toBeFalsy();
      expect(component.isEditForm).toBeFalsy();
      expect(component.changeImage).toBeFalsy();
      expect(component.uploadSuccess).toBeFalsy();
      expect(Swal.isVisible()).toBeTruthy();
      Swal.clickConfirm();
      done();
    });
  });

  it('Should edit image', () => {
    component.onEditImage();
    expect(component.changeImage).toBeTruthy();
  });

  it('Should cancel edit image', () => {
    component.onCancelEditImage();
    expect(component.changeImage).toBeFalsy();
  });

  it('Should delete image', (done) => {
    const dummyPage = 1;
    component.aboutUsObj.image = "dummyImage.jpg";

    const spy_staff = spyOn(api_service, 'getAboutUsByPage').and.returnValue(of(dummySuccessData));
    const spy_delete = spyOn(api_service, 'updateAboutUsById').and.returnValue(of(dummyDeleteImage));

    component.onDeleteImage();

    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();

    setTimeout(() => {
      expect(component.isLoaded).toBeTruthy();
      expect(component.activeForm).toBeFalsy();
      expect(component.isEditForm).toBeFalsy();
      expect(component.changeImage).toBeFalsy();
      expect(component.uploadSuccess).toBeFalsy();
      expect(Swal.isVisible()).toBeTruthy();
      Swal.clickConfirm();
      done();
    });
  });

  it('Should cancel edit', () => {
    component.onCancel();
    expect(component.activeForm).toBeFalsy();
    expect(component.isEditForm).toBeFalsy();
    expect(component.changeImage).toBeFalsy();
    expect(component.uploadSuccess).toBeFalsy();
  });

});
