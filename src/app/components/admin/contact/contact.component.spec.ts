import { TestBed, getTestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { NgForm, FormsModule, FormControl, Validators } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import * as globalsConstants from 'src/app/common/globals';

import { ContactComponent } from './contact.component';
import { ContactInterface } from 'src/app/models/contact-interface';

import { Globals } from 'src/app/common/globals';
import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';
import { HttpClientModule } from '@angular/common/http';

describe('Contact Component', () => {
  let component: ContactComponent;
  let injector: TestBed;
  let api_service: DataApiService;
  let core_service: CoreService;
  let globals: Globals;
  let toast: jasmine.SpyObj<ToastrService>;
  let contactData: ContactInterface;

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

  const dummyNotificationData =
  {
    "cod": 200,
    "message": "Notificaciones creadas."
  };

  const dummySuccessHomeData =
  {
    "cod": 200,
    "homeInfo": [
      {
        "id": 1,
        "home_first_ph": "666777888",
        "home_second_ph": "666999555",
        "home_fcbk": "https://es-es.facebook.com/",
        "home_ytube": "https://www.youtube.es",
        "home_insta": "https://www.instagram.com/"
      }
    ]
  };

  const dummySuccessFooterData =
  {
    "cod": 200,
    "footerInfo": [
      {
        "id": 1,
        "footer_address": "Calle del Centro, 18, El Puerto de Santa María (Cádiz)",
        "footer_email": "info@cssantamaria.es",
        "footer_ph": "666777222",
        "footer_schdl": "Lunes a viernes: 09:00 - 14:00 y 17:00 - 20:00.",
        "footer_social_links": "1"
      }
    ]
  };

  const dummySuccessContactData =
  {
    "cod": 200,
    "contactInfo": [
      {
        "id": 1,
        "cnt_address": "Calle del Centro, 18, El Puerto de Santa María (Cádiz)",
        "cnt_ph_appo": "666777888",
        "cnt_emails": "info@cssantamaria.es;matronas@cssantamaria.es",
        "cnt_ph_mwives": "666999555",
        "cnt_ph_physio": "666888555",
        "cnt_lat": "36.600535818804076",
        "cnt_lon": "-6.232616901397705"
      }
    ]
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

    contactData = new ContactInterface();
    component = new ContactComponent(api_service, toast, core_service, globals);
  });

  it('Create an instance', () => {
    expect(component).toBeTruthy();
    expect(component.inSocialChk).toBeFalsy();
  });

  it('Should call OnInit', () => {
    component.ngOnInit();
    expect(component.isLoaded).toBeFalsy();
    expect(component.editPermissions).toBeFalsy();
  });

  it('Should get edit permissions (Admin)', () => {
    component.getEditPermission();
    expect(component.editPermissions).toBeTruthy();
  });

  it('Should get edit permissions (Staff)', () => {
    component.globals.rol_name = "Administrador";

    component.getEditPermission();
    expect(component.editPermissions).toBeFalsy();
  });

  it('Should filling pop-ups', () => {
    component.populatePopData();
    expect(component.infoPopTitle).toEqual(globalsConstants.K_INFO_POP_TITLE);
    expect(component.homePopData).toEqual(globalsConstants.K_HOME_POP_DATA);
    expect(component.emailPopData).toEqual(globalsConstants.K_EMAIL_POP_DATA);
  });

  it('Should get information from the Home section', () => {
    const spy = spyOn(api_service, 'getInfoHome').and.returnValue(of(dummySuccessHomeData));

    component.getHomeInfo();

    expect(component.infoObj.id).toEqual(dummySuccessHomeData.homeInfo[0].id);
    expect(component.isLoaded).toBeTruthy();
  });

  it('Error getting information from the Home section', () => {
    const spy = spyOn(api_service, 'getInfoHome').and.returnValue(of(dummyErrorData));

    component.getHomeInfo();

    expect(component.isLoaded).toBeTruthy();
    expect(toast.error).toHaveBeenCalledWith(
      'No es posible conectar con la base de datos.',
      'Error');
  });

  it('Should get information from the Footer section', () => {
    const spy = spyOn(api_service, 'getInfoFooter').and.returnValue(of(dummySuccessFooterData));

    component.getFooterInfo();

    expect(component.infoObj.footer_address).toEqual(dummySuccessFooterData.footerInfo[0].footer_address);
    expect(component.isLoaded).toBeTruthy();
  });

  it('Error getting information from the Footer section', () => {
    const spy = spyOn(api_service, 'getInfoFooter').and.returnValue(of(dummyErrorData));

    component.getFooterInfo();

    expect(component.isLoaded).toBeTruthy();
    expect(toast.error).toHaveBeenCalledWith(
      'No es posible conectar con la base de datos.',
      'Error');
  });

  it('Should get information from the Contact section', () => {
    const spy = spyOn(api_service, 'getInfoContact').and.returnValue(of(dummySuccessContactData));

    component.getContactInfo();

    expect(component.infoObj.cnt_address).toEqual(dummySuccessContactData.contactInfo[0].cnt_address);
    expect(component.isLoaded).toBeTruthy();
  });

  it('Error getting information from the Contact section', () => {
    const spy = spyOn(api_service, 'getInfoContact').and.returnValue(of(dummyErrorData));

    component.getContactInfo();

    expect(component.isLoaded).toBeTruthy();
    expect(toast.error).toHaveBeenCalledWith(
      'No es posible conectar con la base de datos.',
      'Error');
  });

  it('Should send form information to create or edit Home information', () => {
    let validators: any[], asyncValidators: any[];
    let dummyForm = new NgForm(validators, asyncValidators);

    const spy_api = spyOn(api_service, 'updateInfoHomeById').and.returnValue(of(dummyUpdateData));
    const spy_core = spyOn(core_service, 'commandNotification').and.returnValue(of(dummyNotificationData));

    component.onSubmitHome(dummyForm);

    expect(component.isLoaded).toBeTruthy();
    expect(toast.success).toHaveBeenCalledWith(
      dummyUpdateData.message,
      globalsConstants.K_UPDATE_F_STR);
  });

  it('Error send form information to create or edit Home information', () => {
    let validators: any[], asyncValidators: any[];
    let dummyForm = new NgForm(validators, asyncValidators);

    const spy_api = spyOn(api_service, 'updateInfoHomeById').and.returnValue(of(dummyErrorData));

    component.onSubmitHome(dummyForm);

    expect(component.isLoaded).toBeTruthy();
    expect(toast.error).toHaveBeenCalledWith(
      dummyErrorData.message,
      globalsConstants.K_ERROR_STR);
  });

  it('Should send form information to create or edit Footer information', () => {
    let validators: any[], asyncValidators: any[];
    let dummyForm = new NgForm(validators, asyncValidators);

    const spy_api = spyOn(api_service, 'updateInfoFooterById').and.returnValue(of(dummyUpdateData));
    const spy_core = spyOn(core_service, 'commandNotification').and.returnValue(of(dummyNotificationData));

    component.onSubmitFooter(dummyForm);

    expect(component.isLoaded).toBeTruthy();
    expect(toast.success).toHaveBeenCalledWith(
      dummyUpdateData.message,
      globalsConstants.K_UPDATE_F_STR);
  });

  it('Error send form information to create or edit Footer information', () => {
    let validators: any[], asyncValidators: any[];
    let dummyForm = new NgForm(validators, asyncValidators);

    const spy_api = spyOn(api_service, 'updateInfoFooterById').and.returnValue(of(dummyErrorData));

    component.onSubmitFooter(dummyForm);

    expect(component.isLoaded).toBeTruthy();
    expect(toast.error).toHaveBeenCalledWith(
      dummyErrorData.message,
      globalsConstants.K_ERROR_STR);
  });

  it('Should send form information to create or edit Contact information', () => {
    let validators: any[], asyncValidators: any[];
    let dummyForm = new NgForm(validators, asyncValidators);

    const spy_api = spyOn(api_service, 'updateInfoContactById').and.returnValue(of(dummyUpdateData));
    const spy_core = spyOn(core_service, 'commandNotification').and.returnValue(of(dummyNotificationData));

    component.onSubmitContact(dummyForm);

    expect(component.isLoaded).toBeTruthy();
    expect(toast.success).toHaveBeenCalledWith(
      dummyUpdateData.message,
      globalsConstants.K_UPDATE_F_STR);
  });

  it('Error send form information to create or edit Contact information', () => {
    let validators: any[], asyncValidators: any[];
    let dummyForm = new NgForm(validators, asyncValidators);

    const spy_api = spyOn(api_service, 'updateInfoContactById').and.returnValue(of(dummyErrorData));

    component.onSubmitContact(dummyForm);

    expect(component.isLoaded).toBeTruthy();
    expect(toast.error).toHaveBeenCalledWith(
      dummyErrorData.message,
      globalsConstants.K_ERROR_STR);
  });

  it('Should show and hide social links in the footer', () => {
    let event: any;
    component.inSocialChk = true;
    component.toggleVisibility(event);

    expect(component.infoObj.footer_social_links).toBeTruthy();
  });
});
