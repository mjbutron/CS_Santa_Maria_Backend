import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';

import { CourseInterface } from 'src/app/models/course-interface';

const K_BLANK = '';
const K_MAX_SIZE = 3000000;

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  // Path
  path = "http://localhost/apiRest/uploads/";
  // Courses
  courseObj: CourseInterface;
  courses: CourseInterface[] = [];
  courseImg: string;
  inOfferChk: boolean;
  inNewChk: boolean;
  // Form
  @ViewChild('cssmFile', {static: false}) imageFile: ElementRef;
  // Courses - Image
  selectedImg: File;
  uploadSuccess: boolean;
  // Errors
  errors = "";
  // Numeros páginas
  public numberPage: number[] = [];
  // Página actual
  public page: number = 1;
  // Total de paginas
  public totalPages: number;
  // Total de elementos
  public numCourses: number;
  // Elementos por página
  private numResults: number = 10;
  // Scroll
  @ViewChild("subsScroll", { static: true }) subsScrollDiv: ElementRef;
  // Scroll Form
  @ViewChild("editCourse", { static: true }) editCourse: ElementRef;
  // Form
  activeForm = false;
  isEditForm = false;
  changeImage = false;

  constructor(private dataApi: DataApiService, public toastr: ToastrService, private coreService: CoreService) {
    this.courseObj = new CourseInterface();
    this.inOfferChk = false;
    this.inNewChk = false;
  }

  ngOnInit() {
    this.activeForm = false;
    this.isEditForm = false;
    this.changeImage = false;
    this.uploadSuccess = false;
    this.scrollToDiv();
    this.getCoursesByPage(this.page);
  }

  goToPage(page: number){
    this.page = page;
    this.getCoursesByPage(page);
  }

  getCoursesByPage(page: Number) {
    this.dataApi.getCoursesByPage(page).subscribe((data) =>{
        this.courses = data['allCourses'];
        this.numCourses = data['total'];
        this.totalPages = data['totalPages'];
        this.numberPage = Array.from(Array(this.totalPages)).map((x,i)=>i+1);
    });
  }

  onNewCourse() {
    // Habilitar form en formato eedición
    this.activeForm = true;
    this.isEditForm = false;
    this.changeImage = false;
    this.selectedImg = null;
    this.inOfferChk = false;
    this.inNewChk = true;

    this.courseObj.title = K_BLANK;
    this.courseObj.description = K_BLANK;
    this.courseObj.image = "default_image.jpg";
    this.courseObj.new_course = 1;
    this.courseObj.offer = 0;
    this.courseObj.address = K_BLANK;
    this.courseObj.session_date = K_BLANK;
    this.courseObj.session_start = K_BLANK;
    this.courseObj.session_end = K_BLANK;
    this.courseObj.sessions = 0;
    this.courseObj.hours = 0;
    this.courseObj.level = K_BLANK;
    this.courseObj.places = 0;
    this.courseObj.free_places = 0;
    this.courseObj.price = 0;
    this.courseObj.user_id = 1;
    setTimeout (() => {
         // Mover el scroll al form
         this.scrollToForm();
      }, 200);
  }

  onEditCourse(course: CourseInterface) {
    // Habilitar form en formato eedición
    this.activeForm = true;
    this.isEditForm = true;
    this.changeImage = false;
    this.selectedImg = null;
    // Setear valores al ui
    this.courseObj.id = course.id;
    this.courseObj.title = course.title;
    this.courseObj.description = course.description;
    this.courseObj.image = (course.image) ? course.image : "default_image.jpg";
    this.courseObj.new_course = course.new_course;
    this.inNewChk = (course.new_course == 1) ? true : false;
    this.courseObj.offer = course.offer;
    this.inOfferChk = (course.offer == 1) ? true : false;
    this.courseObj.address = course.address;
    this.courseObj.session_date = course.session_date;
    this.courseObj.session_start = course.session_start;
    this.courseObj.session_end = course.session_end;
    this.courseObj.sessions = course.sessions;
    this.courseObj.hours = course.hours;
    this.courseObj.level = course.level;
    this.courseObj.places = course.places;
    this.courseObj.free_places = course.free_places;
    this.courseObj.price = course.price;
    this.courseObj.user_id = course.user_id;
    setTimeout (() => {
         // Mover el scroll al form
         this.scrollToForm();
      }, 200);
  }

  onDeleteCourse(course: CourseInterface){
    Swal.fire({
      title: '¿Seguro que deseas eliminar el curso?',
      text: "Atención: Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#0095A6',
      confirmButtonText: '¡Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.dataApi.deleteCourseById(course.id).subscribe((data) => {
          this.getCoursesByPage(this.page);
          this.isEditForm = false;
          this.activeForm = false;
          this.uploadSuccess = false;
          this.changeImage = false;
          Swal.fire(
            '¡Eliminado!',
            'Se ha eliminado el curso seleccionado.',
            'success'
          )
        }, (err) => {
          Swal.fire(
            '¡Error!',
            'No se ha podido eliminar el curso.',
            'error'
          )
        });
      }
    });
  }

  onEditImage(){
    this.changeImage = true;
  }

  onCancelEditImage(){
    this.changeImage = false;
  }

  onSubmit(form: NgForm){
    if(this.isEditForm){
      if(this.changeImage && this.selectedImg != null){
        this.coreService.uploadFiles(this.selectedImg).subscribe((img) => {
          this.courseImg = img['message'];
          this.courseObj.image = this.courseImg;
          this.uploadSuccess = false;
          this.dataApi.updateCourseById(this.courseObj).subscribe((data) => {
            this.getCoursesByPage(this.page);
            this.toastr.success('Se ha actualizado el curso', 'Actualizado');
          });
        });
      } else{
        this.dataApi.updateCourseById(this.courseObj).subscribe((data) => {
          this.getCoursesByPage(this.page);
          this.toastr.success('Se ha actualizado el curso', 'Actualizado');
        });
      }
    } else{
      if(this.changeImage && this.selectedImg != null){
        this.coreService.uploadFiles(this.selectedImg).subscribe((img) => {
          this.courseImg = img['message'];
          this.courseObj.image = this.courseImg;
          this.uploadSuccess = false;
          this.dataApi.createCourse(this.courseObj).subscribe((data) => {
            this.getCoursesByPage(this.page);
            this.toastr.success('Se ha creado un nuevo curso', 'Añadido');
          });
        });
      } else{
        this.dataApi.createCourse(this.courseObj).subscribe((data) => {
          this.getCoursesByPage(this.page);
          this.toastr.success('Se ha creado un nuevo curso', 'Añadido');
        });
      }
    }
  }

  onFileChanged($event){
    if($event != null){
      this.selectedImg = $event.target.files[0];
      if(this.selectedImg.size > K_MAX_SIZE){
        this.imageFile.nativeElement.value = K_BLANK;
        this.toastr.error('El tamaño no puede ser superior a 3MB.', 'Error');
        return;
      } else{
        this.uploadSuccess = true;
      }
    } else{
      return;
    }
  }

  onCancel(form: NgForm){
    form.reset();
    this.isEditForm = false;
    this.activeForm = false;
    this.uploadSuccess = false;
    this.changeImage = false;
  }

  scrollToDiv() {
      this.subsScrollDiv.nativeElement.scrollIntoView(true);
  }

  scrollToForm() {
      this.editCourse.nativeElement.scrollIntoView({behavior:"smooth"});
  }

  toggleVisibility(e){
    this.courseObj.new_course = (this.inNewChk) ? 1 : 0;
    this.courseObj.offer = (this.inOfferChk) ? 1 : 0;
  }


}
