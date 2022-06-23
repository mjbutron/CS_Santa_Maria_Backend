import { TestBed, getTestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { NgForm, FormsModule, FormControl, Validators } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import * as globalsConstants from 'src/app/common/globals';
import Swal from 'sweetalert2';

import { OpinionComponent } from './opinion.component';
import { OpinionInterface } from 'src/app/models/opinion-interface';

import { Globals } from 'src/app/common/globals';
import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';
import { HttpClientModule } from '@angular/common/http';

describe('Opinion Component', () => {
  let component: OpinionComponent;
  let injector: TestBed;
  let api_service: DataApiService;
  let core_service: CoreService;
  let globals: Globals;
  let toast: jasmine.SpyObj<ToastrService>;
  let opinionData: OpinionInterface;

  const dummyErrorData =
  {
    "cod": 503,
    "message": "No es posible conectar con la base de datos."
  };

  const dummyDeleteData =
  {
    "cod": 200,
    "message": "Opinión eliminada."
  };

  const dummyUpdateData =
  {
    "cod": 200,
    "message": "Se ha actualizado la opinión."
  };

  const dummySuccessData =
  {
    "cod": 200,
    "allOpinions": [
      {
        "id": 25,
        "home": 1,
        "image": "default-avatar.png",
        "name": "Demo Nombre",
        "commentary": "<p>Aliquam nibh leo, ornare at viverra in, euismod eu quam. Integer euismod viverra orci id lobortis. Suspendisse quis magna non felis lacinia maximus. Nunc id cursus sapien. Curabitur at tortor eget est hendrerit egestas. Fusce sit amet massa pharetra nisl ultrices hendrerit non ut ligula. Pellentesque volutpat ligula nec est laoreet, ac tincidunt nisl placerat. Cras id est luctus, vestibulum enim fermentum, sodales velit. Morbi et mauris a tellus placerat laoreet.</p>",
        "rating": 4,
        "create_date": "2022-01-31 19:23:37",
        "update_date": "2022-06-11 17:27:37"
      },
      {
        "id": 24,
        "home": 1,
        "image": "default-avatar.png",
        "name": "Demo Nombre",
        "commentary": "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus faucibus, velit at consectetur faucibus, mauris ex facilisis erat, non sollicitudin justo eros sit amet libero. Suspendisse quis mattis nisi. Suspendisse volutpat, lorem at ultrices eleifend, nunc erat semper risus, et semper mauris urna placerat mi. Morbi sollicitudin mattis massa, convallis iaculis neque ornare in. Fusce id pellentesque orci, sed vulputate nulla. Nunc fringilla nec neque quis ultricies. Nam arcu orci, vestibulum in arcu at, porttitor vehicula tellus. Mauris et tellus eu nisl dapibus elementum. Sed hendrerit nec ipsum sodales vehicula. Integer lectus dolor, scelerisque eget consequat ut, placerat sed sem. In convallis felis quam. Sed feugiat ac nisi in dignissim.</p>",
        "rating": 5,
        "create_date": "2022-01-31 19:22:35",
        "update_date": "2022-06-11 17:27:33"
      },
      {
        "id": 23,
        "home": 1,
        "image": "default-avatar.png",
        "name": "Demo Nombre",
        "commentary": "<p>Fusce sollicitudin id enim a mollis. Ut scelerisque sem a elit luctus scelerisque. Morbi vitae dignissim augue. Vivamus suscipit, sapien eget porttitor tincidunt, purus metus imperdiet nulla, id consequat quam eros nec quam. Ut efficitur eleifend lectus consequat sagittis. Quisque commodo ut mauris et lacinia. Mauris sit amet dignissim massa. Aliquam erat volutpat. Phasellus ultricies dapibus nisl, non ultrices massa molestie in. Vestibulum rhoncus nulla mattis suscipit tempus. Sed ultrices mollis dui, ac lacinia nibh iaculis vitae. Donec posuere varius enim, et efficitur orci imperdiet a. Aliquam vestibulum vitae nibh ut iaculis. Nulla mollis dui sit amet ipsum porta lobortis. Aliquam in luctus leo. In facilisis, tellus eget pretium laoreet, nisi dolor dapibus tortor, nec tincidunt ipsum leo vitae orci.</p>",
        "rating": 3,
        "create_date": "2022-01-29 18:21:41",
        "update_date": "2022-06-11 17:27:28"
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

    opinionData = new OpinionInterface();
    component = new OpinionComponent(api_service, toast, core_service, globals);
    component.editOpinion = {
      nativeElement: jasmine.createSpyObj('nativeElement', ['scrollIntoView'])
    };
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

    const spy = spyOn(api_service, 'getOpinionsByPage').and.returnValue(of(dummySuccessData));

    component.goToPage(dummyPage);
    expect(component.page).toEqual(dummyPage);
    expect(component.isLoaded).toBeTruthy();
  });

  it('Should get all opinions', () => {
    const dummyPage = 1;

    const spy = spyOn(api_service, 'getOpinionsByPage').and.returnValue(of(dummySuccessData));

    component.getOpinionsByPage(dummyPage);

    expect(component.opinions).toEqual(dummySuccessData.allOpinions);
    expect(component.isLoaded).toBeTruthy();
  });

  it('Error getting all opinions', () => {
    const dummyPage = 1;

    const spy = spyOn(api_service, 'getOpinionsByPage').and.returnValue(of(dummyErrorData));

    component.getOpinionsByPage(dummyPage);
    expect(component.numOpinions).toEqual(0);
    expect(component.isLoaded).toBeTruthy();
    expect(toast.error).toHaveBeenCalledWith(
      dummyErrorData.message, globalsConstants.K_ERROR_STR);
  });

  it('Should reload data', () => {
    const spy = spyOn(api_service, 'getOpinionsByPage').and.returnValue(of(dummySuccessData));

    component.onReload();
    expect(component.isLoaded).toBeTruthy();
  });

  it('Should enable the form in edit mode and set values in fields', () => {
    opinionData.id = 5;
    component.onEditOpinion(opinionData);

    expect(component.activeForm).toBeTruthy();
    expect(component.isEditForm).toBeTruthy();
    expect(component.changeImage).toBeFalsy();
    expect(component.opinionObj.commentary).toEqual(globalsConstants.K_BLANK);
  });

  it('Should delete opinion', (done) => {
    opinionData.id = 5;

    const spy_opinion = spyOn(api_service, 'getOpinionsByPage').and.returnValue(of(dummySuccessData));
    const spy_delete = spyOn(api_service, 'deleteOpinionById').and.returnValue(of(dummyDeleteData));

    component.onDeleteOpinion(opinionData);

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
    component.opinionObj.image = "dummyImage.jpg";

    const spy_opinion = spyOn(api_service, 'getOpinionsByPage').and.returnValue(of(dummySuccessData));
    const spy_update = spyOn(api_service, 'updateOpinionById').and.returnValue(of(dummyUpdateData));

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
