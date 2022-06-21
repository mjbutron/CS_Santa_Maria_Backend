import { TestBed, getTestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { NgForm, FormsModule, FormControl, Validators } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import * as globalsConstants from 'src/app/common/globals';
import Swal from 'sweetalert2';

import { DashboardComponent } from './dashboard.component';
import { SliderInterface } from 'src/app/models/slider-interface';

import { Globals } from 'src/app/common/globals';
import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';
import { HttpClientModule } from '@angular/common/http';

describe('Dashboard Component', () => {
  let component: DashboardComponent;
  let injector: TestBed;
  let api_service: DataApiService;
  let core_service: CoreService;
  let globals: Globals;
  let toast: jasmine.SpyObj<ToastrService>;
  let sliderData: SliderInterface;

  const dummyErrorData =
  {
    "cod": 503,
    "message": "No es posible conectar con la base de datos."
  };

  const dummyUpload =
  {
    "cod": 200,
    "message": "default_image_slider.jpg"
  };

  const dummyUpdateData =
  {
    "cod": 200,
    "message": "Se ha editado la cabecera."
  };

  const dummySuccessData =
  {
    "cod": 200,
    "allSliders": [
      {
        "id": 1,
        "title": "Imagen Demo 1",
        "description": "Descripción imagen demo 1",
        "image": "default_image_slider.png",
        "color_text": "#ffffff",
        "order_slider": 1,
        "create_date": "2019-09-23 20:59:12",
        "update_date": "2022-06-11 13:35:10"
      },
      {
        "id": 2,
        "title": "Imagen Demo 2",
        "description": "Descripción imagen demo 2",
        "image": "default_image_slider.png",
        "color_text": "#04c1c3",
        "order_slider": 2,
        "create_date": "2019-09-23 20:59:12",
        "update_date": "2022-06-11 13:40:52"
      },
      {
        "id": 3,
        "title": "Imagen Demo 3",
        "description": "Descripción imagen demo 2",
        "image": "default_image_slider.png",
        "color_text": "#274bdd",
        "order_slider": 3,
        "create_date": "2019-09-23 20:59:45",
        "update_date": "2022-06-11 13:42:58"
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

    sliderData = new SliderInterface();
    component = new DashboardComponent(api_service, toast, core_service, globals);
  });

  it('Create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('Should call OnInit', () => {
    component.ngOnInit();
    expect(component.isLoaded).toBeFalsy();
    expect(component.changeImage).toBeFalsy();
    expect(component.uploadSuccess).toBeFalsy();
  });

  it('Should get all sliders', () => {
    const spy = spyOn(api_service, 'getAllSlider').and.returnValue(of(dummySuccessData));

    component.getAllSlider();

    expect(component.sliders).toEqual(dummySuccessData.allSliders);
    expect(component.isLoaded).toBeTruthy();
  });

  it('Error getting all sliders', () => {
    const spy = spyOn(api_service, 'getAllSlider').and.returnValue(of(dummyErrorData));

    component.getAllSlider();

    expect(component.isLoaded).toBeTruthy();
    expect(toast.error).toHaveBeenCalledWith(
      dummyErrorData.message, globalsConstants.K_ERROR_STR);
  });

  it('Should activate the image editing form and set the values', () => {
    sliderData.image = "default_image.jpg";
    component.onSlider(sliderData);

    expect(component.disabledForm).toBeFalsy();
    expect(component.changeImage).toBeFalsy();
    expect(component.sliderImg).toEqual(globalsConstants.K_DEFAULT_IMAGE);
  });

  it('Should send form information to create or edit slider', () => {
    let validators: any[], asyncValidators: any[];
    let dummyForm = new NgForm(validators, asyncValidators);
    component.changeImage = true;

    const spy_api = spyOn(api_service, 'updateSliderById').and.returnValue(of(dummyUpdateData));
    // const spy_core = spyOn(core_service, 'uploadFiles').and.returnValue(of(dummyUpload));
    const spy_api_all = spyOn(api_service, 'getAllSlider').and.returnValue(of(dummySuccessData));

    component.onSubmit(dummyForm);

    expect(component.isLoaded).toBeTruthy();
    expect(component.disabledForm).toBeTruthy();
  });

});
