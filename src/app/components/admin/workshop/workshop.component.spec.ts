import { TestBed, getTestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { NgForm, FormsModule, FormControl, Validators } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import * as globalsConstants from 'src/app/common/globals';
import Swal from 'sweetalert2';

import { WorkshopComponent } from './workshop.component';
import { WorkshopInterface } from 'src/app/models/workshop-interface';

import { Globals } from 'src/app/common/globals';
import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';
import { HttpClientModule } from '@angular/common/http';

describe('Workshop Component', () => {
  let component: WorkshopComponent;
  let injector: TestBed;
  let api_service: DataApiService;
  let core_service: CoreService;
  let globals: Globals;
  let toast: jasmine.SpyObj<ToastrService>;
  let workshopData: WorkshopInterface;

  const dummyErrorData =
  {
    "cod": 503,
    "message": "No es posible conectar con la base de datos."
  };

  const dummyDeleteData =
  {
    "cod": 200,
    "message": "Taller eliminado."
  };

  const dummyUpdateData =
  {
    "cod": 200,
    "message": "Se ha actualizado el taller."
  };

  const dummySuccessData =
  {
    "cod": 200,
    "allWorkshops": [
      {
        "id": 40,
        "active": 1,
        "home": 1,
        "title": "Taller Demo 1",
        "short_description": "Descripción breve Taller Demo 1.",
        "description": "<p><i><u>Lorem ipsum</u></i> dolor sit amet, consectetur adipiscing elit. Vivamus faucibus, velit at consectetur faucibus, mauris ex facilisis erat, non sollicitudin justo eros sit amet libero. Suspendisse quis mattis nisi. Suspendisse volutpat, lorem at ultrices eleifend, nunc erat semper risus, et semper mauris urna placerat mi. Morbi sollicitudin mattis massa, convallis iaculis neque ornare in. Fusce id pellentesque orci, sed vulputate nulla. Nunc fringilla nec neque quis ultricies. Nam arcu orci, vestibulum in arcu at, porttitor vehicula tellus. Mauris et tellus eu nisl dapibus elementum. Sed hendrerit nec ipsum sodales vehicula. Integer lectus dolor, scelerisque eget consequat ut, placerat sed sem. In convallis felis quam. Sed feugiat ac nisi in dignissim.</p><p>Aliquam nibh leo, ornare at viverra in, euismod eu quam. Integer euismod viverra orci id lobortis. Suspendisse quis magna non felis lacinia maximus. Nunc id cursus sapien. Curabitur at tortor eget est hendrerit egestas. Fusce sit amet massa pharetra nisl ultrices hendrerit non ut ligula. Pellentesque volutpat ligula nec est laoreet, ac tincidunt nisl placerat. Cras id est luctus, vestibulum enim fermentum, sodales velit. Morbi et mauris a tellus placerat laoreet.</p><p>Curabitur suscipit nisl non felis tristique sodales. Curabitur dictum eleifend tincidunt. Sed molestie metus arcu, non eleifend dui iaculis et. Vivamus eu molestie erat. Maecenas sollicitudin augue iaculis vestibulum aliquet. Maecenas ut tristique magna. Vestibulum tempus, mauris id elementum fermentum, purus arcu consectetur nunc, nec consectetur turpis massa et eros. Morbi elementum tempor molestie.</p><p>Fusce sollicitudin id enim a mollis. Ut scelerisque sem a elit luctus scelerisque. Morbi vitae dignissim augue. Vivamus suscipit, sapien eget porttitor tincidunt, purus metus imperdiet nulla, id consequat quam eros nec quam. Ut efficitur eleifend lectus consequat sagittis. Quisque commodo ut mauris et lacinia. Mauris sit amet dignissim massa. Aliquam erat volutpat. Phasellus ultricies dapibus nisl, non ultrices massa molestie in. Vestibulum rhoncus nulla mattis suscipit tempus. Sed ultrices mollis dui, ac lacinia nibh iaculis vitae. Donec posuere varius enim, et efficitur orci imperdiet a. Aliquam vestibulum vitae nibh ut iaculis. Nulla mollis dui sit amet ipsum porta lobortis. Aliquam in luctus leo. In facilisis, tellus eget pretium laoreet, nisi dolor dapibus tortor, nec tincidunt ipsum leo vitae orci.</p><figure>&nbsp;</figure>",
        "image": "default_image.jpg",
        "subtitle": "Taller Demo 1 subtitulo.",
        "price": 40,
        "address": "Calle del Centro, 18",
        "session_date": "2022-07-18",
        "session_start": "10:00:00",
        "session_end": "12:00:00",
        "hours": 2,
        "places": 10,
        "free_places": 10,
        "new_workshop": 1,
        "impart": "Demo Nombre Apellidos",
        "create_date": "2021-06-11 13:10:50",
        "update_date": "2022-06-11 17:15:57"
      },
      {
        "id": 47,
        "active": 1,
        "home": 0,
        "title": "Taller Demo 4",
        "short_description": "Descripción breve Taller Demo 4.",
        "description": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus faucibus, velit at consectetur faucibus, mauris ex facilisis erat, non sollicitudin justo eros sit amet libero. Suspendisse quis mattis nisi. Suspendisse volutpat, lorem at ultrices eleifend, nunc erat semper risus, et semper mauris urna placerat mi. Morbi sollicitudin mattis massa, convallis iaculis neque ornare in. Fusce id pellentesque orci, sed vulputate nulla. Nunc fringilla nec neque quis ultricies. Nam arcu orci, vestibulum in arcu at, porttitor vehicula tellus. Mauris et tellus eu nisl dapibus elementum. Sed hendrerit nec ipsum sodales vehicula. Integer lectus dolor, scelerisque eget consequat ut, placerat sed sem. In convallis felis quam. Sed feugiat ac nisi in dignissim.</p><p>Aliquam nibh leo, ornare at viverra in, euismod eu quam. Integer euismod viverra orci id lobortis. Suspendisse quis magna non felis lacinia maximus. Nunc id cursus sapien. Curabitur at tortor eget est hendrerit egestas. Fusce sit amet massa pharetra nisl ultrices hendrerit non ut ligula. Pellentesque volutpat ligula nec est laoreet, ac tincidunt nisl placerat. Cras id est luctus, vestibulum enim fermentum, sodales velit. Morbi et mauris a tellus placerat laoreet.</p><p>Curabitur suscipit nisl non felis tristique sodales. Curabitur dictum eleifend tincidunt. Sed molestie metus arcu, non eleifend dui iaculis et. Vivamus eu molestie erat. Maecenas sollicitudin augue iaculis vestibulum aliquet. Maecenas ut tristique magna. Vestibulum tempus, mauris id elementum fermentum, purus arcu consectetur nunc, nec consectetur turpis massa et eros. Morbi elementum tempor molestie.</p><p>Fusce sollicitudin id enim a mollis. Ut scelerisque sem a elit luctus scelerisque. Morbi vitae dignissim augue. Vivamus suscipit, sapien eget porttitor tincidunt, purus metus imperdiet nulla, id consequat quam eros nec quam. Ut efficitur eleifend lectus consequat sagittis. Quisque commodo ut mauris et lacinia. Mauris sit amet dignissim massa. Aliquam erat volutpat. Phasellus ultricies dapibus nisl, non ultrices massa molestie in. Vestibulum rhoncus nulla mattis suscipit tempus. Sed ultrices mollis dui, ac lacinia nibh iaculis vitae. Donec posuere varius enim, et efficitur orci imperdiet a. Aliquam vestibulum vitae nibh ut iaculis. Nulla mollis dui sit amet ipsum porta lobortis. Aliquam in luctus leo. In facilisis, tellus eget pretium laoreet, nisi dolor dapibus tortor, nec tincidunt ipsum leo vitae orci.</p><figure>&nbsp;</figure>",
        "image": "default_image.jpg",
        "subtitle": "Taller Demo 4 subtitulo.",
        "price": 20,
        "address": "Calle del Centro, 18",
        "session_date": "2022-07-18",
        "session_start": "18:00:00",
        "session_end": "19:00:00",
        "hours": 1,
        "places": 10,
        "free_places": 10,
        "new_workshop": 1,
        "impart": "Demo Nombre Apellidos",
        "create_date": "2021-06-11 13:25:50",
        "update_date": "2022-06-11 17:16:29"
      },
      {
        "id": 45,
        "active": 1,
        "home": 1,
        "title": "Taller Demo 2",
        "short_description": "Descripción breve Taller Demo 2.",
        "description": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus faucibus, velit at consectetur faucibus, mauris ex facilisis erat, non sollicitudin justo eros sit amet libero. Suspendisse quis mattis nisi. Suspendisse volutpat, lorem at ultrices eleifend, nunc erat semper risus, et semper mauris urna placerat mi. Morbi sollicitudin mattis massa, convallis iaculis neque ornare in. Fusce id pellentesque orci, sed vulputate nulla. Nunc fringilla nec neque quis ultricies. Nam arcu orci, vestibulum in arcu at, porttitor vehicula tellus. Mauris et tellus eu nisl dapibus elementum. Sed hendrerit nec ipsum sodales vehicula. Integer lectus dolor, scelerisque eget consequat ut, placerat sed sem. In convallis felis quam. Sed feugiat ac nisi in dignissim.</p><p>Aliquam nibh leo, ornare at viverra in, euismod eu quam. Integer euismod viverra orci id lobortis. Suspendisse quis magna non felis lacinia maximus. Nunc id cursus sapien. Curabitur at tortor eget est hendrerit egestas. Fusce sit amet massa pharetra nisl ultrices hendrerit non ut ligula. Pellentesque volutpat ligula nec est laoreet, ac tincidunt nisl placerat. Cras id est luctus, vestibulum enim fermentum, sodales velit. Morbi et mauris a tellus placerat laoreet.</p><p>Curabitur suscipit nisl non felis tristique sodales. Curabitur dictum eleifend tincidunt. Sed molestie metus arcu, non eleifend dui iaculis et. Vivamus eu molestie erat. Maecenas sollicitudin augue iaculis vestibulum aliquet. Maecenas ut tristique magna. Vestibulum tempus, mauris id elementum fermentum, purus arcu consectetur nunc, nec consectetur turpis massa et eros. Morbi elementum tempor molestie.</p><p>Fusce sollicitudin id enim a mollis. Ut scelerisque sem a elit luctus scelerisque. Morbi vitae dignissim augue. Vivamus suscipit, sapien eget porttitor tincidunt, purus metus imperdiet nulla, id consequat quam eros nec quam. Ut efficitur eleifend lectus consequat sagittis. Quisque commodo ut mauris et lacinia. Mauris sit amet dignissim massa. Aliquam erat volutpat. Phasellus ultricies dapibus nisl, non ultrices massa molestie in. Vestibulum rhoncus nulla mattis suscipit tempus. Sed ultrices mollis dui, ac lacinia nibh iaculis vitae. Donec posuere varius enim, et efficitur orci imperdiet a. Aliquam vestibulum vitae nibh ut iaculis. Nulla mollis dui sit amet ipsum porta lobortis. Aliquam in luctus leo. In facilisis, tellus eget pretium laoreet, nisi dolor dapibus tortor, nec tincidunt ipsum leo vitae orci.</p><figure>&nbsp;</figure>",
        "image": "default_image.jpg",
        "subtitle": "Taller Demo 2 subtitulo.",
        "price": 15,
        "address": "Calle del Centro, 18",
        "session_date": "2022-07-20",
        "session_start": "11:00:00",
        "session_end": "12:00:00",
        "hours": 1,
        "places": 10,
        "free_places": 10,
        "new_workshop": 1,
        "impart": "Demo Nombre Apellidos",
        "create_date": "2021-06-11 13:15:50",
        "update_date": "2022-06-11 17:16:37"
      }
    ],
    "total": 3,
    "actual": 1,
    "totalPages": 1
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

    workshopData = new WorkshopInterface();
    component = new WorkshopComponent(api_service, toast, core_service, globals);
  });

  it('Create an instance', () => {
    expect(component).toBeTruthy();
    expect(component.inHomeChk).toBeFalsy();
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

    const spy = spyOn(api_service, 'getWorkShopsByPage').and.returnValue(of(dummySuccessData));

    component.goToPage(dummyPage);
    expect(component.page).toEqual(dummyPage);
    expect(component.isLoaded).toBeTruthy();
  });

  it('Should get all workshops', () => {
    const dummyPage = 1;

    const spy = spyOn(api_service, 'getWorkShopsByPage').and.returnValue(of(dummySuccessData));

    component.getWorkShopsByPage(dummyPage);

    expect(component.workShops).toEqual(dummySuccessData.allWorkshops);
    expect(component.isLoaded).toBeTruthy();
  });

  it('Error getting all workshops', () => {
    const dummyPage = 1;

    const spy = spyOn(api_service, 'getWorkShopsByPage').and.returnValue(of(dummyErrorData));

    component.getWorkShopsByPage(dummyPage);
    expect(component.numWorkShops).toEqual(0);
    expect(component.isLoaded).toBeTruthy();
    expect(toast.error).toHaveBeenCalledWith(
      dummyErrorData.message, globalsConstants.K_ERROR_STR);
  });

  it('Should reload data', () => {
    const spy = spyOn(api_service, 'getWorkShopsByPage').and.returnValue(of(dummySuccessData));

    component.onReload();
    expect(component.isLoaded).toBeTruthy();
  });

  it('Should enable the form in edit mode and set values in fields', () => {
    workshopData.id = 1;
    component.onEditWorkshop(workshopData);

    expect(component.activeForm).toBeTruthy();
    expect(component.isEditForm).toBeTruthy();
    expect(component.changeImage).toBeFalsy();
    expect(component.workShopObj.description).toEqual(globalsConstants.K_BLANK);
  });

  it('Should delete workshop', (done) => {
    workshopData.id = 1;

    const spy_workshop = spyOn(api_service, 'getWorkShopsByPage').and.returnValue(of(dummySuccessData));
    const spy_delete = spyOn(api_service, 'deleteWorkshopById').and.returnValue(of(dummyDeleteData));

    component.onDeleteWorkshop(workshopData);

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
    component.workShopObj.image = "dummyImage.jpg";

    const spy_workshop = spyOn(api_service, 'getWorkShopsByPage').and.returnValue(of(dummySuccessData));
    const spy_update = spyOn(api_service, 'updateWorkshopById').and.returnValue(of(dummyUpdateData));

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

  it('Should active workshop', (done) => {
    const spy_workshop = spyOn(api_service, 'getWorkShopsByPage').and.returnValue(of(dummySuccessData));
    const spy_update = spyOn(api_service, 'updateWorkshopById').and.returnValue(of(dummyUpdateData));

    component.onActiveWorkshop(workshopData);

    expect(Swal.isVisible()).toBeTruthy();
    Swal.clickConfirm();

    setTimeout(() => {
      expect(component.isLoaded).toBeTruthy();
      expect(component.activeForm).toBeFalsy();
      expect(component.isEditForm).toBeFalsy();
      expect(Swal.isVisible()).toBeTruthy();
      Swal.clickConfirm();
      done();
    });
  });
});
