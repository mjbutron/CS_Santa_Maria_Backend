import { TestBed, getTestBed } from '@angular/core/testing';
import { TestRequest, HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { of, throwError } from 'rxjs';
import { delay, mergeMap, catchError, retry, retryWhen, shareReplay } from 'rxjs/operators';

import { DataApiService } from './data-api.service';

import { SliderInterface } from '../models/slider-interface';
import { ContactInterface } from 'src/app/models/contact-interface';
import { WorkshopInterface } from 'src/app/models/workshop-interface';
import { OpinionInterface } from 'src/app/models/opinion-interface';
import { CourseInterface } from 'src/app/models/course-interface';
import { ServiceInterface } from 'src/app/models/service-interface';
import { AboutUsInterface } from 'src/app/models/aboutus-interface';
import { UserInterface } from 'src/app/models/user-interface';

describe('Data Api Service', () => {
  let injector: TestBed;
  let service: DataApiService;
  let httpMock: HttpTestingController;
  let http: HttpClient;
  var originalTimeout;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataApiService]
    });
    injector = getTestBed();
    service = injector.get(DataApiService);
    httpMock = injector.get(HttpTestingController);
    http = TestBed.get(HttpClient);

    service.delay_ms = 1000;
    service.retries = 1;
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    httpMock.verify();
  });

  it('Create an instance', () => {
    expect(service).toBeTruthy();
  });

  it('Should get headers options', () => {
    const res = service.getHeadersOptions();
    expect(typeof res.headers.get('Content-type')).toBe('string');
  });

  // Slider
  describe('Slider', () => {
    it('Should get all sliders', () => {
      const dummyData = [
        {
          "id": 2,
          "title": "Método BLW",
          "description": "Alimentación con método BLW",
          "image": "10022020-5e41941e6e5c3-blw.jpg",
          "color_text": "#FFFFFF",
          "order_slider": "1",
          "create_date": "2019-09-23 20:59:12",
          "update_date": "2021-08-12 12:11:43"
        },
        {
          "id": 1,
          "title": "Masaje Prenatal",
          "description": "Masajes prenatales para mejorar el bienestar del bebe y la mama.",
          "image": "29012020-5e31bfb60f405-massagePrenatal.jpg",
          "color_text": "#0095a6",
          "order_slider": "2",
          "create_date": "2019-09-23 20:59:12",
          "update_date": "2021-12-21 10:31:01"
        },
        {
          "id": 3,
          "title": "Talleres",
          "description": "Realizamos diferentes talleres. ¡Apuntate!",
          "image": "29012020-5e31c016237ae-prenatal-massage.jpg",
          "color_text": "#FFFFFF",
          "order_slider": "3",
          "create_date": "2019-09-23 20:59:45",
          "update_date": "2021-12-21 10:31:01"
        }
      ];

      service.getAllSlider().subscribe(data => {
        expect(data.length).toBeGreaterThan(0);
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/api/allSlider`);
      expect(req.request.method).toBe("GET");
      req.flush(dummyData);
    });

    it('Error getting sliders - Should retry 5 times', (done) => {
      const errorDetails = {
        "error": {
          "cod": 503,
          "message": "No es posible conectar con la base de datos."
        }
      };

      spyOn(http, 'get').and.returnValue(throwError(errorDetails));
      service.getAllSlider().subscribe(data => {
        expect(data).toEqual(errorDetails.error);
        done();
      });
    });

    it('Should update slider by ID', () => {
      let slider: SliderInterface = new SliderInterface();
      slider.id = 1;
      const dummyUpdateData =
      {
        "cod": 200,
        "message": "Se ha editado la cabecera."
      };

      service.updateSliderById(slider).subscribe(data => {
        expect(data).toEqual(dummyUpdateData);
      });

      const req = httpMock.expectOne(`${service.url}/admin/api/slider/update/` + slider.id);
      expect(req.request.method).toBe("PUT");
      req.flush(dummyUpdateData);
    });

  });

  // Workshop information
  describe('Workshop Information', () => {
    it('Should get all workshops information', () => {
      const dummyData =
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
        ]
      };

      service.getAllWorkshops().subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/api/allWorkshops`);
      expect(req.request.method).toBe("GET");
      req.flush(dummyData);
    });

    it('Error getting workshops information - Should retry 5 times', (done) => {
      const errorDetails = {
        "error": {
          "cod": 503,
          "message": "No es posible conectar con la base de datos."
        }
      };

      spyOn(http, 'get').and.returnValue(throwError(errorDetails));
      service.getAllWorkshops().subscribe(data => {
        expect(data).toEqual(errorDetails.error);
        done();
      });
    });

    it('Should get workshops by page', () => {
      const dummyData =
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

      service.getWorkShopsByPage(1).subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/api/workshopsByPage/` + 1);
      expect(req.request.method).toBe("GET");
      req.flush(dummyData);
    });

    it('Error getting workshops by page information - Should retry 5 times', (done) => {
      const errorDetails = {
        "error": {
          "cod": 503,
          "message": "No es posible conectar con la base de datos."
        }
      };

      spyOn(http, 'get').and.returnValue(throwError(errorDetails));
      service.getWorkShopsByPage(1).subscribe(data => {
        expect(data).toEqual(errorDetails.error);
        done();
      });
    });

    it('Should create workshop', () => {
      const dummyData =
      {
        "cod": 200,
        "message": 'Nuevo taller creado'
      };

      let workshopData: WorkshopInterface = new WorkshopInterface();

      service.createWorkshop(workshopData).subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/admin/api/workshops/new`);
      expect(req.request.method).toBe("POST");
      req.flush(dummyData);
    });

    it('Should update workshop by ID', () => {
      const dummyData =
      {
        "cod": 200,
        "message": 'Se ha actualizado el taller.'
      };

      let workshopData: WorkshopInterface = new WorkshopInterface();
      workshopData.id = 1;

      service.updateWorkshopById(workshopData).subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/admin/api/workshops/update/` + workshopData.id);
      expect(req.request.method).toBe("PUT");
      req.flush(dummyData);
    });

    it('Should delete workshop by ID', () => {
      const dummyData =
      {
        "cod": 200,
        "message": 'Taller eliminado.'
      };

      let workshopId = 1;

      service.deleteWorkshopById(workshopId).subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/admin/api/workshops/delete/` + workshopId);
      expect(req.request.method).toBe("DELETE");
      req.flush(dummyData);
    });

  });

  // Service information
  describe('Services Information', () => {
    it('Should get all services information', () => {
      const dummyData = [
        {
          "id": 30,
          "active": "1",
          "title": "Valoración y tratamiento",
          "image": "default_image.jpg",
          "subtitle": "Seguramente hayas escuchado hablar de las famosas correas.",
          "description": "Si tu bebé nace con el frenillo lingual corto (anquiloglosia) puede (o no) tener dificultad durante la lactancia como succión ineficaz, mala transferencia de leche, puede provocarte dolor en el pecho durante el amamantamiento por mal agarre, grietas, mastitis de repetición… A medida que tu bebé crece el frenillo lingual corto puede ocasionar problemas de mala oclusión dental, dificultad a la hora de pronunciar algunas letras, problemas de respiración… Esto no significa que un bebé con anquiloglosia vaya a sufrir todas estas dificultades, puede sufrir alguna o ninguna porque nunca sabemos, a priori, qué dificultades puede causar un frenillo lingual corto hasta que las dificultades se manifiestan. En caso de que fuera necesario, la intervención más habitual para intervenir la anquiloglosias.\r\n",
          "create_date": "2021-09-07 19:10:47",
          "update_date": "2021-10-19 20:58:07"
        },
        {
          "id": 34,
          "active": "0",
          "title": "Acondicionamiento del suelo pélvico",
          "image": "default_image.jpg",
          "subtitle": "Dummy Subtitle",
          "description": "Dummy Description",
          "create_date": "2021-08-04 20:19:14",
          "update_date": "2021-09-20 20:22:24"
        },
        {
          "id": 39,
          "active": "1",
          "title": "Control del crecimiento y peso saludable",
          "image": "default_image.jpg",
          "subtitle": "",
          "description": "Descripción del servicio",
          "create_date": "2021-08-04 20:19:14",
          "update_date": "2021-09-20 20:22:24"
        }
      ];

      service.getAllServices().subscribe(data => {
        expect(data.length).toBeGreaterThan(0);
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/api/allServices`);
      expect(req.request.method).toBe("GET");
      req.flush(dummyData);
    });

    it('Error getting services information - Should retry 5 times', (done) => {
      const errorDetails = {
        "error": {
          "cod": 503,
          "message": "No es posible conectar con la base de datos."
        }
      };

      spyOn(http, 'get').and.returnValue(throwError(errorDetails));
      service.getAllServices().subscribe(data => {
        expect(data).toEqual(errorDetails.error);
        done();
      });
    });

    it('Should get services by page', () => {
      const dummyData = [
        {
          "cod": 200,
          "allServices": [
            {
              "id": 46,
              "active": "1",
              "title": "Servicio Demo 4",
              "image": "default_image.jpg",
              "subtitle": "Descripción del Servicio Demo 4",
              "description": "<p><u>Lorem ipsum</u> dolor sit amet, consectetur adipiscing elit. Vivamus faucibus, velit at consectetur faucibus, mauris ex facilisis erat, non sollicitudin justo eros sit amet libero. Suspendisse quis mattis nisi. Suspendisse volutpat, lorem at ultrices eleifend, nunc erat semper risus, et semper mauris urna placerat mi. Morbi sollicitudin mattis massa, convallis iaculis neque ornare in. Fusce id pellentesque orci, sed vulputate nulla. Nunc fringilla nec neque quis ultricies. Nam arcu orci, vestibulum in arcu at, porttitor vehicula tellus. Mauris et tellus eu nisl dapibus elementum. Sed hendrerit nec ipsum sodales vehicula. Integer lectus dolor, scelerisque eget consequat ut, placerat sed sem. In convallis felis quam. Sed feugiat ac nisi in dignissim.</p><p>Aliquam nibh leo, ornare at viverra in, euismod eu quam. Integer euismod viverra orci id lobortis. Suspendisse quis magna non felis lacinia maximus. Nunc id cursus sapien. Curabitur at tortor eget est hendrerit egestas. Fusce sit amet massa pharetra nisl ultrices hendrerit non ut ligula. Pellentesque volutpat ligula nec est laoreet, ac tincidunt nisl placerat. Cras id est luctus, vestibulum enim fermentum, sodales velit. Morbi et mauris a tellus placerat laoreet.</p><p>Curabitur suscipit nisl non felis tristique sodales. Curabitur dictum eleifend tincidunt. Sed molestie metus arcu, non eleifend dui iaculis et. Vivamus eu molestie erat. Maecenas sollicitudin augue iaculis vestibulum aliquet. Maecenas ut tristique magna. Vestibulum tempus, mauris id elementum fermentum, purus arcu consectetur nunc, nec consectetur turpis massa et eros. Morbi elementum tempor molestie.</p><p>Fusce sollicitudin id enim a mollis. Ut scelerisque sem a elit luctus scelerisque. Morbi vitae dignissim augue. Vivamus suscipit, sapien eget porttitor tincidunt, purus metus imperdiet nulla, id consequat quam eros nec quam. Ut efficitur eleifend lectus consequat sagittis. Quisque commodo ut mauris et lacinia. Mauris sit amet dignissim massa. Aliquam erat volutpat. Phasellus ultricies dapibus nisl, non ultrices massa molestie in. Vestibulum rhoncus nulla mattis suscipit tempus. Sed ultrices mollis dui, ac lacinia nibh iaculis vitae. Donec posuere varius enim, et efficitur orci imperdiet a. Aliquam vestibulum vitae nibh ut iaculis. Nulla mollis dui sit amet ipsum porta lobortis. Aliquam in luctus leo. In facilisis, tellus eget pretium laoreet, nisi dolor dapibus tortor, nec tincidunt ipsum leo vitae orci.</p>",
              "create_date": "2022-06-11 13:50:18",
              "update_date": "2022-06-11 17:15:16"
            },
            {
              "id": 43,
              "active": "1",
              "title": "Servicio Demo 2",
              "image": "default_image.jpg",
              "subtitle": "Descripción del Servicio Demo 2",
              "description": "<p><strong>Lorem ipsum</strong> dolor sit amet, consectetur adipiscing elit. Vivamus faucibus, velit at consectetur faucibus, mauris ex facilisis erat, non sollicitudin justo eros sit amet libero. Suspendisse quis mattis nisi. Suspendisse volutpat, lorem at ultrices eleifend, nunc erat semper risus, et semper mauris urna placerat mi. Morbi sollicitudin mattis massa, convallis iaculis neque ornare in. Fusce id pellentesque orci, sed vulputate nulla. Nunc fringilla nec neque quis ultricies. Nam arcu orci, vestibulum in arcu at, porttitor vehicula tellus. Mauris et tellus eu nisl dapibus elementum. Sed hendrerit nec ipsum sodales vehicula. Integer lectus dolor, scelerisque eget consequat ut, placerat sed sem. In convallis felis quam. Sed feugiat ac nisi in dignissim.</p><p>Aliquam nibh leo, ornare at viverra in, euismod eu quam. Integer euismod viverra orci id lobortis. Suspendisse quis magna non felis lacinia maximus. Nunc id cursus sapien. Curabitur at tortor eget est hendrerit egestas. Fusce sit amet massa pharetra nisl ultrices hendrerit non ut ligula. Pellentesque volutpat ligula nec est laoreet, ac tincidunt nisl placerat. Cras id est luctus, vestibulum enim fermentum, sodales velit. Morbi et mauris a tellus placerat laoreet.</p><p>Curabitur suscipit nisl non felis tristique sodales. Curabitur dictum eleifend tincidunt. Sed molestie metus arcu, non eleifend dui iaculis et. Vivamus eu molestie erat. Maecenas sollicitudin augue iaculis vestibulum aliquet. Maecenas ut tristique magna. Vestibulum tempus, mauris id elementum fermentum, purus arcu consectetur nunc, nec consectetur turpis massa et eros. Morbi elementum tempor molestie.</p><p>Fusce sollicitudin id enim a mollis. Ut scelerisque sem a elit luctus scelerisque. Morbi vitae dignissim augue. Vivamus suscipit, sapien eget porttitor tincidunt, purus metus imperdiet nulla, id consequat quam eros nec quam. Ut efficitur eleifend lectus consequat sagittis. Quisque commodo ut mauris et lacinia. Mauris sit amet dignissim massa. Aliquam erat volutpat. Phasellus ultricies dapibus nisl, non ultrices massa molestie in. Vestibulum rhoncus nulla mattis suscipit tempus. Sed ultrices mollis dui, ac lacinia nibh iaculis vitae. Donec posuere varius enim, et efficitur orci imperdiet a. Aliquam vestibulum vitae nibh ut iaculis. Nulla mollis dui sit amet ipsum porta lobortis. Aliquam in luctus leo. In facilisis, tellus eget pretium laoreet, nisi dolor dapibus tortor, nec tincidunt ipsum leo vitae orci.</p>",
              "create_date": "2022-06-11 13:56:11",
              "update_date": "2022-06-11 17:14:51"
            },
            {
              "id": 45,
              "active": "1",
              "title": "Servicio Demo 3",
              "image": "default_image.jpg",
              "subtitle": "Descripción del Servicio Demo 3",
              "description": "<p><i>Lorem ipsum</i> dolor sit amet, consectetur adipiscing elit. Vivamus faucibus, velit at consectetur faucibus, mauris ex facilisis erat, non sollicitudin justo eros sit amet libero. Suspendisse quis mattis nisi. Suspendisse volutpat, lorem at ultrices eleifend, nunc erat semper risus, et semper mauris urna placerat mi. Morbi sollicitudin mattis massa, convallis iaculis neque ornare in. Fusce id pellentesque orci, sed vulputate nulla. Nunc fringilla nec neque quis ultricies. Nam arcu orci, vestibulum in arcu at, porttitor vehicula tellus. Mauris et tellus eu nisl dapibus elementum. Sed hendrerit nec ipsum sodales vehicula. Integer lectus dolor, scelerisque eget consequat ut, placerat sed sem. In convallis felis quam. Sed feugiat ac nisi in dignissim.</p><p>Aliquam nibh leo, ornare at viverra in, euismod eu quam. Integer euismod viverra orci id lobortis. Suspendisse quis magna non felis lacinia maximus. Nunc id cursus sapien. Curabitur at tortor eget est hendrerit egestas. Fusce sit amet massa pharetra nisl ultrices hendrerit non ut ligula. Pellentesque volutpat ligula nec est laoreet, ac tincidunt nisl placerat. Cras id est luctus, vestibulum enim fermentum, sodales velit. Morbi et mauris a tellus placerat laoreet.</p><p>Curabitur suscipit nisl non felis tristique sodales. Curabitur dictum eleifend tincidunt. Sed molestie metus arcu, non eleifend dui iaculis et. Vivamus eu molestie erat. Maecenas sollicitudin augue iaculis vestibulum aliquet. Maecenas ut tristique magna. Vestibulum tempus, mauris id elementum fermentum, purus arcu consectetur nunc, nec consectetur turpis massa et eros. Morbi elementum tempor molestie.</p><p>Fusce sollicitudin id enim a mollis. Ut scelerisque sem a elit luctus scelerisque. Morbi vitae dignissim augue. Vivamus suscipit, sapien eget porttitor tincidunt, purus metus imperdiet nulla, id consequat quam eros nec quam. Ut efficitur eleifend lectus consequat sagittis. Quisque commodo ut mauris et lacinia. Mauris sit amet dignissim massa. Aliquam erat volutpat. Phasellus ultricies dapibus nisl, non ultrices massa molestie in. Vestibulum rhoncus nulla mattis suscipit tempus. Sed ultrices mollis dui, ac lacinia nibh iaculis vitae. Donec posuere varius enim, et efficitur orci imperdiet a. Aliquam vestibulum vitae nibh ut iaculis. Nulla mollis dui sit amet ipsum porta lobortis. Aliquam in luctus leo. In facilisis, tellus eget pretium laoreet, nisi dolor dapibus tortor, nec tincidunt ipsum leo vitae orci.</p>",
              "create_date": "2022-06-11 13:56:11",
              "update_date": "2022-06-11 17:14:11"
            }
          ],
          "total": 3,
          "actual": 1,
          "totalPages": 1
        }
      ];

      service.getServicesByPage(1).subscribe(data => {
        expect(data.length).toBeGreaterThan(0);
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/api/servicesByPage/` + 1);
      expect(req.request.method).toBe("GET");
      req.flush(dummyData);
    });

    it('Should create service', () => {
      const dummyData =
      {
        "cod": 200,
        "message": 'Nuevo servicio creado'
      };

      let serviceData: ServiceInterface = new ServiceInterface();

      service.createService(serviceData).subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/admin/api/services/new`);
      expect(req.request.method).toBe("POST");
      req.flush(dummyData);
    });

    it('Should update service by ID', () => {
      const dummyData =
      {
        "cod": 200,
        "message": 'Se ha actualizado el servicio.'
      };

      let serviceData: ServiceInterface = new ServiceInterface();
      serviceData.id = 1;

      service.updateServiceById(serviceData).subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/admin/api/services/update/` + serviceData.id);
      expect(req.request.method).toBe("PUT");
      req.flush(dummyData);
    });

    it('Should delete service by ID', () => {
      const dummyData =
      {
        "cod": 200,
        "message": 'Servicio eliminado.'
      };

      let serviceId = 1;

      service.deleteServiceById(serviceId).subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/admin/api/services/delete/` + serviceId);
      expect(req.request.method).toBe("DELETE");
      req.flush(dummyData);
    });
  });

  // Courses information
  describe('Course Information', () => {
    it('Should get all courses information', () => {
      const dummyData =
      {
        "cod": 200,
        "allCourses": [
          {
            "id": 17,
            "active": 1,
            "title": "Curso Demo 1",
            "short_description": "Descripción breve de Curso Demo 1.",
            "description": "<p><i>Lorem ipsum</i> dolor sit amet, consectetur adipiscing elit. Vivamus faucibus, velit at consectetur faucibus, mauris ex facilisis erat, non sollicitudin justo eros sit amet libero. Suspendisse quis mattis nisi. Suspendisse volutpat, lorem at ultrices eleifend, nunc erat semper risus, et semper mauris urna placerat mi. Morbi sollicitudin mattis massa, convallis iaculis neque ornare in. Fusce id pellentesque orci, sed vulputate nulla. Nunc fringilla nec neque quis ultricies. Nam arcu orci, vestibulum in arcu at, porttitor vehicula tellus. Mauris et tellus eu nisl dapibus elementum. Sed hendrerit nec ipsum sodales vehicula. Integer lectus dolor, scelerisque eget consequat ut, placerat sed sem. In convallis felis quam. Sed feugiat ac nisi in dignissim.</p><p>Aliquam nibh leo, ornare at viverra in, euismod eu quam. Integer euismod viverra orci id lobortis. Suspendisse quis magna non felis lacinia maximus. Nunc id cursus sapien. Curabitur at tortor eget est hendrerit egestas. Fusce sit amet massa pharetra nisl ultrices hendrerit non ut ligula. Pellentesque volutpat ligula nec est laoreet, ac tincidunt nisl placerat. Cras id est luctus, vestibulum enim fermentum, sodales velit. Morbi et mauris a tellus placerat laoreet.</p><p>Curabitur suscipit nisl non felis tristique sodales. Curabitur dictum eleifend tincidunt. Sed molestie metus arcu, non eleifend dui iaculis et. Vivamus eu molestie erat. Maecenas sollicitudin augue iaculis vestibulum aliquet. Maecenas ut tristique magna. Vestibulum tempus, mauris id elementum fermentum, purus arcu consectetur nunc, nec consectetur turpis massa et eros. Morbi elementum tempor molestie.</p><p>Fusce sollicitudin id enim a mollis. Ut scelerisque sem a elit luctus scelerisque. Morbi vitae dignissim augue. Vivamus suscipit, sapien eget porttitor tincidunt, purus metus imperdiet nulla, id consequat quam eros nec quam. Ut efficitur eleifend lectus consequat sagittis. Quisque commodo ut mauris et lacinia. Mauris sit amet dignissim massa. Aliquam erat volutpat. Phasellus ultricies dapibus nisl, non ultrices massa molestie in. Vestibulum rhoncus nulla mattis suscipit tempus. Sed ultrices mollis dui, ac lacinia nibh iaculis vitae. Donec posuere varius enim, et efficitur orci imperdiet a. Aliquam vestibulum vitae nibh ut iaculis. Nulla mollis dui sit amet ipsum porta lobortis. Aliquam in luctus leo. In facilisis, tellus eget pretium laoreet, nisi dolor dapibus tortor, nec tincidunt ipsum leo vitae orci.</p>",
            "image": "default_image.jpg",
            "new_course": 1,
            "offer": 1,
            "address": "Calle del Centro, 18",
            "session_date": "2022-07-25",
            "session_start": "18:00:00",
            "session_end": "20:00:00",
            "sessions": 1,
            "hours": 2,
            "impart": "Demo",
            "places": 10,
            "free_places": 10,
            "price": 0,
            "create_date": "2022-06-11 15:07:08",
            "update_date": "2022-06-11 17:19:29"
          },
          {
            "id": 18,
            "active": 1,
            "title": "Curso Demo 2",
            "short_description": "Descripción breve de Curso Demo 2.",
            "description": "<p><i>Lorem ipsum</i> dolor sit amet, consectetur adipiscing elit. Vivamus faucibus, velit at consectetur faucibus, mauris ex facilisis erat, non sollicitudin justo eros sit amet libero. Suspendisse quis mattis nisi. Suspendisse volutpat, lorem at ultrices eleifend, nunc erat semper risus, et semper mauris urna placerat mi. Morbi sollicitudin mattis massa, convallis iaculis neque ornare in. Fusce id pellentesque orci, sed vulputate nulla. Nunc fringilla nec neque quis ultricies. Nam arcu orci, vestibulum in arcu at, porttitor vehicula tellus. Mauris et tellus eu nisl dapibus elementum. Sed hendrerit nec ipsum sodales vehicula. Integer lectus dolor, scelerisque eget consequat ut, placerat sed sem. In convallis felis quam. Sed feugiat ac nisi in dignissim.</p><p>Aliquam nibh leo, ornare at viverra in, euismod eu quam. Integer euismod viverra orci id lobortis. Suspendisse quis magna non felis lacinia maximus. Nunc id cursus sapien. Curabitur at tortor eget est hendrerit egestas. Fusce sit amet massa pharetra nisl ultrices hendrerit non ut ligula. Pellentesque volutpat ligula nec est laoreet, ac tincidunt nisl placerat. Cras id est luctus, vestibulum enim fermentum, sodales velit. Morbi et mauris a tellus placerat laoreet.</p><p>Curabitur suscipit nisl non felis tristique sodales. Curabitur dictum eleifend tincidunt. Sed molestie metus arcu, non eleifend dui iaculis et. Vivamus eu molestie erat. Maecenas sollicitudin augue iaculis vestibulum aliquet. Maecenas ut tristique magna. Vestibulum tempus, mauris id elementum fermentum, purus arcu consectetur nunc, nec consectetur turpis massa et eros. Morbi elementum tempor molestie.</p><p>Fusce sollicitudin id enim a mollis. Ut scelerisque sem a elit luctus scelerisque. Morbi vitae dignissim augue. Vivamus suscipit, sapien eget porttitor tincidunt, purus metus imperdiet nulla, id consequat quam eros nec quam. Ut efficitur eleifend lectus consequat sagittis. Quisque commodo ut mauris et lacinia. Mauris sit amet dignissim massa. Aliquam erat volutpat. Phasellus ultricies dapibus nisl, non ultrices massa molestie in. Vestibulum rhoncus nulla mattis suscipit tempus. Sed ultrices mollis dui, ac lacinia nibh iaculis vitae. Donec posuere varius enim, et efficitur orci imperdiet a. Aliquam vestibulum vitae nibh ut iaculis. Nulla mollis dui sit amet ipsum porta lobortis. Aliquam in luctus leo. In facilisis, tellus eget pretium laoreet, nisi dolor dapibus tortor, nec tincidunt ipsum leo vitae orci.</p>",
            "image": "default_image.jpg",
            "new_course": 1,
            "offer": 0,
            "address": "Calle del Centro, 18",
            "session_date": "2022-07-27",
            "session_start": "18:00:00",
            "session_end": "20:00:00",
            "sessions": 1,
            "hours": 2,
            "impart": "Demo",
            "places": 10,
            "free_places": 10,
            "price": 20,
            "create_date": "2022-06-11 15:17:08",
            "update_date": "2022-06-11 17:19:15"
          },
          {
            "id": 19,
            "active": 1,
            "title": "Curso Demo 3",
            "short_description": "Descripción breve de Curso Demo 3.",
            "description": "<p><i>Lorem ipsum</i> dolor sit amet, consectetur adipiscing elit. Vivamus faucibus, velit at consectetur faucibus, mauris ex facilisis erat, non sollicitudin justo eros sit amet libero. Suspendisse quis mattis nisi. Suspendisse volutpat, lorem at ultrices eleifend, nunc erat semper risus, et semper mauris urna placerat mi. Morbi sollicitudin mattis massa, convallis iaculis neque ornare in. Fusce id pellentesque orci, sed vulputate nulla. Nunc fringilla nec neque quis ultricies. Nam arcu orci, vestibulum in arcu at, porttitor vehicula tellus. Mauris et tellus eu nisl dapibus elementum. Sed hendrerit nec ipsum sodales vehicula. Integer lectus dolor, scelerisque eget consequat ut, placerat sed sem. In convallis felis quam. Sed feugiat ac nisi in dignissim.</p><p>Aliquam nibh leo, ornare at viverra in, euismod eu quam. Integer euismod viverra orci id lobortis. Suspendisse quis magna non felis lacinia maximus. Nunc id cursus sapien. Curabitur at tortor eget est hendrerit egestas. Fusce sit amet massa pharetra nisl ultrices hendrerit non ut ligula. Pellentesque volutpat ligula nec est laoreet, ac tincidunt nisl placerat. Cras id est luctus, vestibulum enim fermentum, sodales velit. Morbi et mauris a tellus placerat laoreet.</p><p>Curabitur suscipit nisl non felis tristique sodales. Curabitur dictum eleifend tincidunt. Sed molestie metus arcu, non eleifend dui iaculis et. Vivamus eu molestie erat. Maecenas sollicitudin augue iaculis vestibulum aliquet. Maecenas ut tristique magna. Vestibulum tempus, mauris id elementum fermentum, purus arcu consectetur nunc, nec consectetur turpis massa et eros. Morbi elementum tempor molestie.</p><p>Fusce sollicitudin id enim a mollis. Ut scelerisque sem a elit luctus scelerisque. Morbi vitae dignissim augue. Vivamus suscipit, sapien eget porttitor tincidunt, purus metus imperdiet nulla, id consequat quam eros nec quam. Ut efficitur eleifend lectus consequat sagittis. Quisque commodo ut mauris et lacinia. Mauris sit amet dignissim massa. Aliquam erat volutpat. Phasellus ultricies dapibus nisl, non ultrices massa molestie in. Vestibulum rhoncus nulla mattis suscipit tempus. Sed ultrices mollis dui, ac lacinia nibh iaculis vitae. Donec posuere varius enim, et efficitur orci imperdiet a. Aliquam vestibulum vitae nibh ut iaculis. Nulla mollis dui sit amet ipsum porta lobortis. Aliquam in luctus leo. In facilisis, tellus eget pretium laoreet, nisi dolor dapibus tortor, nec tincidunt ipsum leo vitae orci.</p>",
            "image": "default_image.jpg",
            "new_course": 0,
            "offer": 0,
            "address": "Calle del Centro, 18",
            "session_date": "2022-07-28",
            "session_start": "19:00:00",
            "session_end": "20:00:00",
            "sessions": 1,
            "hours": 1,
            "impart": "Demo",
            "places": 10,
            "free_places": 10,
            "price": 15,
            "create_date": "2022-06-11 15:27:08",
            "update_date": "2022-06-11 17:19:15"
          }
        ]
      };
      service.getAllCourses().subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/api/courses`);
      expect(req.request.method).toBe("GET");
      req.flush(dummyData);
    });

    it('Error getting courses information - Should retry 5 times', (done) => {
      const errorDetails = {
        "error": {
          "cod": 503,
          "message": "No es posible conectar con la base de datos."
        }
      };

      spyOn(http, 'get').and.returnValue(throwError(errorDetails));
      service.getAllCourses().subscribe(data => {
        expect(data).toEqual(errorDetails.error);
        done();
      });
    });

    it('Should get courses by page', () => {
      const dummyData =
      {
        "cod": 200,
        "allCourses": [
          {
            "id": 17,
            "active": 1,
            "title": "Curso Demo 1",
            "short_description": "Descripción breve de Curso Demo 1.",
            "description": "<p><i>Lorem ipsum</i> dolor sit amet, consectetur adipiscing elit. Vivamus faucibus, velit at consectetur faucibus, mauris ex facilisis erat, non sollicitudin justo eros sit amet libero. Suspendisse quis mattis nisi. Suspendisse volutpat, lorem at ultrices eleifend, nunc erat semper risus, et semper mauris urna placerat mi. Morbi sollicitudin mattis massa, convallis iaculis neque ornare in. Fusce id pellentesque orci, sed vulputate nulla. Nunc fringilla nec neque quis ultricies. Nam arcu orci, vestibulum in arcu at, porttitor vehicula tellus. Mauris et tellus eu nisl dapibus elementum. Sed hendrerit nec ipsum sodales vehicula. Integer lectus dolor, scelerisque eget consequat ut, placerat sed sem. In convallis felis quam. Sed feugiat ac nisi in dignissim.</p><p>Aliquam nibh leo, ornare at viverra in, euismod eu quam. Integer euismod viverra orci id lobortis. Suspendisse quis magna non felis lacinia maximus. Nunc id cursus sapien. Curabitur at tortor eget est hendrerit egestas. Fusce sit amet massa pharetra nisl ultrices hendrerit non ut ligula. Pellentesque volutpat ligula nec est laoreet, ac tincidunt nisl placerat. Cras id est luctus, vestibulum enim fermentum, sodales velit. Morbi et mauris a tellus placerat laoreet.</p><p>Curabitur suscipit nisl non felis tristique sodales. Curabitur dictum eleifend tincidunt. Sed molestie metus arcu, non eleifend dui iaculis et. Vivamus eu molestie erat. Maecenas sollicitudin augue iaculis vestibulum aliquet. Maecenas ut tristique magna. Vestibulum tempus, mauris id elementum fermentum, purus arcu consectetur nunc, nec consectetur turpis massa et eros. Morbi elementum tempor molestie.</p><p>Fusce sollicitudin id enim a mollis. Ut scelerisque sem a elit luctus scelerisque. Morbi vitae dignissim augue. Vivamus suscipit, sapien eget porttitor tincidunt, purus metus imperdiet nulla, id consequat quam eros nec quam. Ut efficitur eleifend lectus consequat sagittis. Quisque commodo ut mauris et lacinia. Mauris sit amet dignissim massa. Aliquam erat volutpat. Phasellus ultricies dapibus nisl, non ultrices massa molestie in. Vestibulum rhoncus nulla mattis suscipit tempus. Sed ultrices mollis dui, ac lacinia nibh iaculis vitae. Donec posuere varius enim, et efficitur orci imperdiet a. Aliquam vestibulum vitae nibh ut iaculis. Nulla mollis dui sit amet ipsum porta lobortis. Aliquam in luctus leo. In facilisis, tellus eget pretium laoreet, nisi dolor dapibus tortor, nec tincidunt ipsum leo vitae orci.</p>",
            "image": "default_image.jpg",
            "new_course": 1,
            "offer": 1,
            "address": "Calle del Centro, 18",
            "session_date": "2022-07-25",
            "session_start": "18:00:00",
            "session_end": "20:00:00",
            "sessions": 1,
            "hours": 2,
            "impart": "Demo",
            "places": 10,
            "free_places": 10,
            "price": 0,
            "create_date": "2022-06-11 15:07:08",
            "update_date": "2022-06-11 17:19:29"
          },
          {
            "id": 18,
            "active": 1,
            "title": "Curso Demo 2",
            "short_description": "Descripción breve de Curso Demo 2.",
            "description": "<p><i>Lorem ipsum</i> dolor sit amet, consectetur adipiscing elit. Vivamus faucibus, velit at consectetur faucibus, mauris ex facilisis erat, non sollicitudin justo eros sit amet libero. Suspendisse quis mattis nisi. Suspendisse volutpat, lorem at ultrices eleifend, nunc erat semper risus, et semper mauris urna placerat mi. Morbi sollicitudin mattis massa, convallis iaculis neque ornare in. Fusce id pellentesque orci, sed vulputate nulla. Nunc fringilla nec neque quis ultricies. Nam arcu orci, vestibulum in arcu at, porttitor vehicula tellus. Mauris et tellus eu nisl dapibus elementum. Sed hendrerit nec ipsum sodales vehicula. Integer lectus dolor, scelerisque eget consequat ut, placerat sed sem. In convallis felis quam. Sed feugiat ac nisi in dignissim.</p><p>Aliquam nibh leo, ornare at viverra in, euismod eu quam. Integer euismod viverra orci id lobortis. Suspendisse quis magna non felis lacinia maximus. Nunc id cursus sapien. Curabitur at tortor eget est hendrerit egestas. Fusce sit amet massa pharetra nisl ultrices hendrerit non ut ligula. Pellentesque volutpat ligula nec est laoreet, ac tincidunt nisl placerat. Cras id est luctus, vestibulum enim fermentum, sodales velit. Morbi et mauris a tellus placerat laoreet.</p><p>Curabitur suscipit nisl non felis tristique sodales. Curabitur dictum eleifend tincidunt. Sed molestie metus arcu, non eleifend dui iaculis et. Vivamus eu molestie erat. Maecenas sollicitudin augue iaculis vestibulum aliquet. Maecenas ut tristique magna. Vestibulum tempus, mauris id elementum fermentum, purus arcu consectetur nunc, nec consectetur turpis massa et eros. Morbi elementum tempor molestie.</p><p>Fusce sollicitudin id enim a mollis. Ut scelerisque sem a elit luctus scelerisque. Morbi vitae dignissim augue. Vivamus suscipit, sapien eget porttitor tincidunt, purus metus imperdiet nulla, id consequat quam eros nec quam. Ut efficitur eleifend lectus consequat sagittis. Quisque commodo ut mauris et lacinia. Mauris sit amet dignissim massa. Aliquam erat volutpat. Phasellus ultricies dapibus nisl, non ultrices massa molestie in. Vestibulum rhoncus nulla mattis suscipit tempus. Sed ultrices mollis dui, ac lacinia nibh iaculis vitae. Donec posuere varius enim, et efficitur orci imperdiet a. Aliquam vestibulum vitae nibh ut iaculis. Nulla mollis dui sit amet ipsum porta lobortis. Aliquam in luctus leo. In facilisis, tellus eget pretium laoreet, nisi dolor dapibus tortor, nec tincidunt ipsum leo vitae orci.</p>",
            "image": "default_image.jpg",
            "new_course": 1,
            "offer": 0,
            "address": "Calle del Centro, 18",
            "session_date": "2022-07-27",
            "session_start": "18:00:00",
            "session_end": "20:00:00",
            "sessions": 1,
            "hours": 2,
            "impart": "Demo",
            "places": 10,
            "free_places": 10,
            "price": 20,
            "create_date": "2022-06-11 15:17:08",
            "update_date": "2022-06-11 17:19:15"
          },
          {
            "id": 19,
            "active": 1,
            "title": "Curso Demo 3",
            "short_description": "Descripción breve de Curso Demo 3.",
            "description": "<p><i>Lorem ipsum</i> dolor sit amet, consectetur adipiscing elit. Vivamus faucibus, velit at consectetur faucibus, mauris ex facilisis erat, non sollicitudin justo eros sit amet libero. Suspendisse quis mattis nisi. Suspendisse volutpat, lorem at ultrices eleifend, nunc erat semper risus, et semper mauris urna placerat mi. Morbi sollicitudin mattis massa, convallis iaculis neque ornare in. Fusce id pellentesque orci, sed vulputate nulla. Nunc fringilla nec neque quis ultricies. Nam arcu orci, vestibulum in arcu at, porttitor vehicula tellus. Mauris et tellus eu nisl dapibus elementum. Sed hendrerit nec ipsum sodales vehicula. Integer lectus dolor, scelerisque eget consequat ut, placerat sed sem. In convallis felis quam. Sed feugiat ac nisi in dignissim.</p><p>Aliquam nibh leo, ornare at viverra in, euismod eu quam. Integer euismod viverra orci id lobortis. Suspendisse quis magna non felis lacinia maximus. Nunc id cursus sapien. Curabitur at tortor eget est hendrerit egestas. Fusce sit amet massa pharetra nisl ultrices hendrerit non ut ligula. Pellentesque volutpat ligula nec est laoreet, ac tincidunt nisl placerat. Cras id est luctus, vestibulum enim fermentum, sodales velit. Morbi et mauris a tellus placerat laoreet.</p><p>Curabitur suscipit nisl non felis tristique sodales. Curabitur dictum eleifend tincidunt. Sed molestie metus arcu, non eleifend dui iaculis et. Vivamus eu molestie erat. Maecenas sollicitudin augue iaculis vestibulum aliquet. Maecenas ut tristique magna. Vestibulum tempus, mauris id elementum fermentum, purus arcu consectetur nunc, nec consectetur turpis massa et eros. Morbi elementum tempor molestie.</p><p>Fusce sollicitudin id enim a mollis. Ut scelerisque sem a elit luctus scelerisque. Morbi vitae dignissim augue. Vivamus suscipit, sapien eget porttitor tincidunt, purus metus imperdiet nulla, id consequat quam eros nec quam. Ut efficitur eleifend lectus consequat sagittis. Quisque commodo ut mauris et lacinia. Mauris sit amet dignissim massa. Aliquam erat volutpat. Phasellus ultricies dapibus nisl, non ultrices massa molestie in. Vestibulum rhoncus nulla mattis suscipit tempus. Sed ultrices mollis dui, ac lacinia nibh iaculis vitae. Donec posuere varius enim, et efficitur orci imperdiet a. Aliquam vestibulum vitae nibh ut iaculis. Nulla mollis dui sit amet ipsum porta lobortis. Aliquam in luctus leo. In facilisis, tellus eget pretium laoreet, nisi dolor dapibus tortor, nec tincidunt ipsum leo vitae orci.</p>",
            "image": "default_image.jpg",
            "new_course": 0,
            "offer": 0,
            "address": "Calle del Centro, 18",
            "session_date": "2022-07-28",
            "session_start": "19:00:00",
            "session_end": "20:00:00",
            "sessions": 1,
            "hours": 1,
            "impart": "Demo",
            "places": 10,
            "free_places": 10,
            "price": 15,
            "create_date": "2022-06-11 15:27:08",
            "update_date": "2022-06-11 17:19:15"
          }
        ],
        "total": 3,
        "actual": 1,
        "totalPages": 1
      };

      service.getCoursesByPage(1).subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/api/coursesByPage/` + 1);
      expect(req.request.method).toBe("GET");
      req.flush(dummyData);
    });

    it('Error getting course by page information - Should retry 5 times', (done) => {
      const errorDetails = {
        "error": {
          "cod": 503,
          "message": "No es posible conectar con la base de datos."
        }
      };

      spyOn(http, 'get').and.returnValue(throwError(errorDetails));
      service.getCoursesByPage(1).subscribe(data => {
        expect(data).toEqual(errorDetails.error);
        done();
      });
    });

    it('Should create course', () => {
      const dummyData =
      {
        "cod": 200,
        "message": 'Nuevo curso creado.'
      };

      let courseData: CourseInterface = new CourseInterface();

      service.createCourse(courseData).subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/admin/api/courses/new`);
      expect(req.request.method).toBe("POST");
      req.flush(dummyData);
    });

    it('Should update course by ID', () => {
      const dummyData =
      {
        "cod": 200,
        "message": 'Se ha actualizado el curso.'
      };

      let courseData: CourseInterface = new CourseInterface();
      courseData.id = 1;

      service.updateCourseById(courseData).subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/admin/api/courses/update/` + courseData.id);
      expect(req.request.method).toBe("PUT");
      req.flush(dummyData);
    });

    it('Should delete course by ID', () => {
      const dummyData =
      {
        "cod": 200,
        "message": 'Curso eliminado.'
      };

      let courseId = 1;

      service.deleteCourseById(courseId).subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/admin/api/courses/delete/` + courseId);
      expect(req.request.method).toBe("DELETE");
      req.flush(dummyData);
    });
  });

  // Home information
  describe('Home Information', () => {
    it('Should get home information', () => {
      const dummyData = [
        {
          "id": 1,
          "home_first_ph": "666777888",
          "home_second_ph": "999888555",
          "home_fcbk": "https://es-es.facebook.com/",
          "home_ytube": "https://www.youtube.es",
          "home_insta": "https://www.instagram.es"
        }
      ];

      service.getInfoHome().subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/api/home/info`);
      expect(req.request.method).toBe("GET");
      req.flush(dummyData);
    });

    it('Error getting home information - Should retry 5 times', (done) => {
      const errorDetails = {
        "error": {
          "cod": 503,
          "message": "No es posible conectar con la base de datos."
        }
      };

      spyOn(http, 'get').and.returnValue(throwError(errorDetails));
      service.getInfoHome().subscribe(data => {
        expect(data).toEqual(errorDetails.error);
        done();
      });
    });
  });

  // Footer information
  describe('Footer Information', () => {
    it('Should get footer information', () => {
      const dummyData = [
        {
          "id": 1,
          "footer_address": "Calle Aurora 18, El Puerto de Santa María",
          "footer_email": "info@cssantamaria.es",
          "footer_ph": "666777888",
          "footer_schdl": "Lunes a viernes: 09:00 - 14:00 y 17:00 - 20:00.",
          "footer_social_links": "1"
        }
      ];

      service.getInfoFooter().subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/api/footer/info`);
      expect(req.request.method).toBe("GET");
      req.flush(dummyData);
    });

    it('Error getting footer information - Should retry 5 times', (done) => {
      const errorDetails = {
        "error": {
          "cod": 503,
          "message": "No es posible conectar con la base de datos."
        }
      };

      spyOn(http, 'get').and.returnValue(throwError(errorDetails));
      service.getInfoFooter().subscribe(data => {
        expect(data).toEqual(errorDetails.error);
        done();
      });
    });
  });

  // Contact information
  describe('Contact Information', () => {
    it('Should get contact information', () => {
      const dummyData = [
        {
          "id": 1,
          "cnt_address": "Calle Aurora 18, El Puerto de Santa María",
          "cnt_ph_appo": "999555111",
          "cnt_emails": "info@cssantamaria.es;solicitud@cssantamaria.es",
          "cnt_ph_mwives": "888777444",
          "cnt_ph_physio": "999888444",
          "cnt_lat": "36.59193918122772",
          "cnt_lon": "-6.229819476603375"
        }
      ];

      service.getInfoContact().subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/api/contact/info`);
      expect(req.request.method).toBe("GET");
      req.flush(dummyData);
    });

    it('Error getting contact information - Should retry 5 times', (done) => {
      const errorDetails = {
        "error": {
          "cod": 503,
          "message": "No es posible conectar con la base de datos."
        }
      };

      spyOn(http, 'get').and.returnValue(throwError(errorDetails));
      service.getInfoContact().subscribe(data => {
        expect(data).toEqual(errorDetails.error);
        done();
      });
    });
  });

  // Opinions information
  describe('Opinions Information', () => {
    it('Should get all opinions information', () => {
      const dummyData =
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
        ]
      };

      service.getAllOpinions().subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/api/allOpinion`);
      expect(req.request.method).toBe("GET");
      req.flush(dummyData);
    });

    it('Error getting opinions information - Should retry 5 times', (done) => {
      const errorDetails = {
        "error": {
          "cod": 503,
          "message": "No es posible conectar con la base de datos."
        }
      };

      spyOn(http, 'get').and.returnValue(throwError(errorDetails));
      service.getAllOpinions().subscribe(data => {
        expect(data).toEqual(errorDetails.error);
        done();
      });
    });

    it('Should get opinions by page', () => {
      const dummyData =
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

      service.getOpinionsByPage(1).subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/api/opinionsByPage/` + 1);
      expect(req.request.method).toBe("GET");
      req.flush(dummyData);
    });

    it('Error getting opinions by page information - Should retry 5 times', (done) => {
      const errorDetails = {
        "error": {
          "cod": 503,
          "message": "No es posible conectar con la base de datos."
        }
      };

      spyOn(http, 'get').and.returnValue(throwError(errorDetails));
      service.getOpinionsByPage(1).subscribe(data => {
        expect(data).toEqual(errorDetails.error);
        done();
      });
    });

    it('Should create opinion', () => {
      const dummyData =
      {
        "cod": 200,
        "message": 'Nueva opinión creado.'
      };

      let opinionData: OpinionInterface = new OpinionInterface();

      service.createOpinion(opinionData).subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/admin/api/opinions/new`);
      expect(req.request.method).toBe("POST");
      req.flush(dummyData);
    });

    it('Should update opinion by ID', () => {
      const dummyData =
      {
        "cod": 200,
        "message": 'Se ha actualizado la opinión.'
      };

      let opinionData: OpinionInterface = new OpinionInterface();
      opinionData.id = 1;

      service.updateOpinionById(opinionData).subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/admin/api/opinions/update/` + opinionData.id);
      expect(req.request.method).toBe("PUT");
      req.flush(dummyData);
    });

    it('Should delete opinion by ID', () => {
      const dummyData =
      {
        "cod": 200,
        "message": 'Opinión eliminada.'
      };

      let opinionId = 1;

      service.deleteOpinionById(opinionId).subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/admin/api/opinions/delete/` + opinionId);
      expect(req.request.method).toBe("DELETE");
      req.flush(dummyData);
    });
  });

  // About Us information
  describe('About Us Information', () => {
    it('Should get all staff information', () => {
      const dummyData =
      {
        "cod": 200,
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
        ]
      };

      service.getAllAboutUs().subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/api/allAboutUs`);
      expect(req.request.method).toBe("GET");
      req.flush(dummyData);
    });

    it('Error getting about us information - Should retry 5 times', (done) => {
      const errorDetails = {
        "error": {
          "cod": 503,
          "message": "No es posible conectar con la base de datos."
        }
      };

      spyOn(http, 'get').and.returnValue(throwError(errorDetails));
      service.getAllAboutUs().subscribe(data => {
        expect(data).toEqual(errorDetails.error);
        done();
      });
    });

    it('Should get about us by page', () => {
      const dummyData =
      {
        "cod": 200,
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

      service.getAboutUsByPage(1).subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/api/aboutUsByPage/` + 1);
      expect(req.request.method).toBe("GET");
      req.flush(dummyData);
    });

    it('Error getting about us by page information - Should retry 5 times', (done) => {
      const errorDetails = {
        "error": {
          "cod": 503,
          "message": "No es posible conectar con la base de datos."
        }
      };

      spyOn(http, 'get').and.returnValue(throwError(errorDetails));
      service.getAboutUsByPage(1).subscribe(data => {
        expect(data).toEqual(errorDetails.error);
        done();
      });
    });

    it('Should create staff', () => {
      const dummyData =
      {
        "cod": 200,
        "message": 'Nueva entrada creada.'
      };

      let staffData: AboutUsInterface = new AboutUsInterface();

      service.createAboutUs(staffData).subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/admin/api/aboutus/new`);
      expect(req.request.method).toBe("POST");
      req.flush(dummyData);
    });

    it('Should update staff by ID', () => {
      const dummyData =
      {
        "cod": 200,
        "message": 'Se ha actualizado la entrada.'
      };

      let staffData: AboutUsInterface = new AboutUsInterface();
      staffData.id = 1;

      service.updateAboutUsById(staffData).subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/admin/api/aboutus/update/` + staffData.id);
      expect(req.request.method).toBe("PUT");
      req.flush(dummyData);
    });

    it('Should delete staff by ID', () => {
      const dummyData =
      {
        "cod": 200,
        "message": 'Entrada eliminada.'
      };

      let staffId = 1;

      service.deleteAboutUsId(staffId).subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/admin/api/aboutus/delete/` + staffId);
      expect(req.request.method).toBe("DELETE");
      req.flush(dummyData);
    });
  });

  // Users information
  describe('Users Information', () => {
    it('Should get all users information', () => {
      const dummyData =
      {
        "cod": 200,
        "allUsers": [
          {
            "id": 1,
            "active": 1,
            "name": "Admin",
            "surname": "Admin",
            "email": "admin@cssm.es",
            "telephone": 666777555,
            "address": "Calle del Centro, 18",
            "city": "Puerto de Santa María",
            "province": "Cádiz",
            "zipcode": 11500,
            "change_pass": 1,
            "user_fcbk": "https://www.facebook.com/",
            "user_ytube": "https://www.youtube.com/",
            "user_insta": null,
            "image": "default-avatar.png",
            "last_login": "2022-06-16",
            "create_date": "2019-09-23 20:57:57",
            "update_date": "2022-06-16 18:57:14",
            "rol_id": 1
          },
          {
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
        ]
      };

      service.getAllUsers().subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/api/allUsers`);
      expect(req.request.method).toBe("GET");
      req.flush(dummyData);
    });

    it('Error getting users information - Should retry 5 times', (done) => {
      const errorDetails = {
        "error": {
          "cod": 503,
          "message": "No es posible conectar con la base de datos."
        }
      };

      spyOn(http, 'get').and.returnValue(throwError(errorDetails));
      service.getAllUsers().subscribe(data => {
        expect(data).toEqual(errorDetails.error);
        done();
      });
    });

    it('Should get users by page', () => {
      const dummyData =
      {
        "cod": 200,
        "allUsers": [
          {
            "id": 1,
            "active": 1,
            "name": "Admin",
            "surname": "Admin",
            "email": "admin@cssm.es",
            "telephone": 666777555,
            "address": "Calle del Centro, 18",
            "city": "Puerto de Santa María",
            "province": "Cádiz",
            "zipcode": 11500,
            "change_pass": 1,
            "user_fcbk": "https://www.facebook.com/",
            "user_ytube": "https://www.youtube.com/",
            "user_insta": null,
            "image": "default-avatar.png",
            "last_login": "2022-06-16",
            "create_date": "2019-09-23 20:57:57",
            "update_date": "2022-06-16 18:57:14",
            "rol_id": 1
          },
          {
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
        ],
        "total": 2,
        "actual": 1,
        "totalPages": 1
      };

      service.getUsersByPage(1).subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/api/usersByPage/` + 1);
      expect(req.request.method).toBe("GET");
      req.flush(dummyData);
    });

    it('Error getting users by page information - Should retry 5 times', (done) => {
      const errorDetails = {
        "error": {
          "cod": 503,
          "message": "No es posible conectar con la base de datos."
        }
      };

      spyOn(http, 'get').and.returnValue(throwError(errorDetails));
      service.getUsersByPage(1).subscribe(data => {
        expect(data).toEqual(errorDetails.error);
        done();
      });
    });

    it('Should create user', () => {
      const dummyData =
      {
        "cod": 200,
        "message": 'Nuevo usuario creado.'
      };

      let userData: UserInterface = new UserInterface();

      service.createUser(userData).subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/admin/api/users/new`);
      expect(req.request.method).toBe("POST");
      req.flush(dummyData);
    });

    it('Should update user by ID', () => {
      const dummyData =
      {
        "cod": 200,
        "message": 'Se ha actualizado el usuario.'
      };

      let userData: UserInterface = new UserInterface();
      userData.id = 1;

      service.updateUserById(userData).subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/admin/api/users/update/` + userData.id);
      expect(req.request.method).toBe("PUT");
      req.flush(dummyData);
    });

    it('Should delete user by ID', () => {
      const dummyData =
      {
        "cod": 200,
        "message": 'Usuario eliminado.'
      };

      let userId = 1;

      service.deleteUserById(userId).subscribe(data => {
        expect(data).toEqual(dummyData);
      });

      const req = httpMock.expectOne(`${service.url}/admin/api/users/delete/` + userId);
      expect(req.request.method).toBe("DELETE");
      req.flush(dummyData);
    });
  });

});
