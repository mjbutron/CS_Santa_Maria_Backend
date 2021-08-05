import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Globals } from 'src/app/common/globals';
import * as globalsConstants from 'src/app/common/globals';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';

import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';

import { OpinionInterface } from 'src/app/models/opinion-interface';

// Constants
const K_DELETE_OPINION = '¿Seguro que deseas eliminar esta opinión?';
const K_DELETE_IMAGE = '¿Seguro que deseas eliminar la imagen?';
const K_WARNING_ACTION = 'Atención: Esta acción no se puede deshacer.';

@Component({
  selector: 'app-opinion',
  templateUrl: './opinion.component.html',
  styleUrls: ['./opinion.component.css']
})
export class OpinionComponent implements OnInit {

  // Editor HTML WYSIWYG
  public Editor = ClassicEditor;
  public config = {
        language: 'es',
        toolbar: [ 'undo', 'redo', '|', 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', '|', 'insertTable' ],
        heading: {
            options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' }
            ]
        }
    };
  // Globals
  globals: Globals;
  // Path
  path = environment.imageRootPath;
  // Opinions
  opinionObj: OpinionInterface;
  opinions: OpinionInterface[] = [];
  opinionImg: string;
  inHomeChk: boolean;
  // Form
  @ViewChild('cssmFile', {static: false}) imageFile: ElementRef;
  // Opinions - Image
  selectedImg: File;
  uploadSuccess: boolean;
  progress: number = 0;
  // Errors
  errors = "";
  // Numeros páginas
  public numberPage: number[] = [];
  // Página actual
  public page: number = 1;
  // Total de paginas
  public totalPages: number;
  // Total de elementos
  public numOpinions: number;
  // Elementos por página
  private numResults: number = globalsConstants.K_NUM_RESULTS_PAGE;
  // Scroll
  element = (<HTMLDivElement>document.getElementById(globalsConstants.K_TOP_ELEMENT_STR));
  // Scroll Form
  @ViewChild("editOpinion", { static: false }) editOpinion: ElementRef;
  // Form
  activeForm = false;
  isEditForm = false;
  changeImage = false;
  // Load
  isLoaded: boolean;

  constructor(private dataApi: DataApiService, public toastr: ToastrService, private coreService: CoreService, globals: Globals) {
    this.globals = globals;
    this.opinionObj = new OpinionInterface();
    this.inHomeChk = false;
    this.element.scrollTop = 0;
  }

  ngOnInit() {
    this.isLoaded = false;
    this.activeForm = false;
    this.isEditForm = false;
    this.changeImage = false;
    this.uploadSuccess = false;
    this.getOpinionsByPage(this.page);
  }

  goToPage(page: number){
    this.page = page;
    this.getOpinionsByPage(page);
  }

  getOpinionsByPage(page: Number) {
    this.dataApi.getOpinionsByPage(page).subscribe((data) =>{
      if (globalsConstants.K_COD_OK == data.cod){
        this.opinions = data.allOpinions;
        this.numOpinions = data.total;
        this.totalPages = data.totalPages;
        this.numberPage = Array.from(Array(this.totalPages)).map((x,i)=>i+1);
        this.isLoaded = true;
      } else{
        this.numOpinions = globalsConstants.K_ZERO_RESULTS;
        this.isLoaded = true;
        this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
      }
    });
  }

  onReload(){
    this.getOpinionsByPage(this.page);
  }

  onNewOpinion() {
    // Habilitar form en formato eedición
    this.activeForm = true;
    this.isEditForm = false;
    this.changeImage = false;
    this.selectedImg = null;

    this.opinionObj.id = null;
    this.opinionObj.home = 0;
    this.inHomeChk = false;
    this.opinionObj.name = globalsConstants.K_BLANK;
    this.opinionObj.image = globalsConstants.K_DEFAULT_IMAGE;
    this.opinionObj.commentary = globalsConstants.K_BLANK;
    this.opinionObj.rating = 0;
    this.opinionObj.user_id = this.globals.userID;
    setTimeout (() => {
         // Mover el scroll al form
         this.scrollToForm();
      }, 200);
  }

  onEditOpinion(opinion: OpinionInterface) {
    // Habilitar form en formato edición
    this.activeForm = true;
    this.isEditForm = true;
    this.changeImage = false;
    this.selectedImg = null;
    // Setear valores al ui
    this.opinionObj.id = opinion.id;
    this.opinionObj.home = opinion.home;
    this.inHomeChk = (opinion.home == 1) ? true : false;
    this.opinionObj.name = opinion.name;
    this.opinionObj.commentary = opinion.commentary;
    this.opinionObj.image = (opinion.image) ? opinion.image : globalsConstants.K_DEFAULT_IMAGE;
    this.opinionObj.rating = opinion.rating;
    this.opinionObj.user_id = this.globals.userID;
    setTimeout (() => {
         // Mover el scroll al form
         this.scrollToForm();
      }, 200);
  }

  onDeleteOpinion(opinion: OpinionInterface){
    Swal.fire({
      title: K_DELETE_OPINION,
      text: K_WARNING_ACTION,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: globalsConstants.K_CONFIRM_BUTTON_COLOR,
      cancelButtonColor: globalsConstants.K_CANCEL_BUTTON_COLOR,
      confirmButtonText: globalsConstants.K_CONFIRM_BUTTON_STR,
      cancelButtonText: globalsConstants.K_CANCEL_BUTTON_STR
    }).then((result) => {
      if (result.value) {
        this.isLoaded = false;
        this.dataApi.deleteOpinionById(opinion.id).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod){
            this.getOpinionsByPage(this.page);
            this.isEditForm = false;
            this.activeForm = false;
            this.uploadSuccess = false;
            this.changeImage = false;
            this.isLoaded = true;
            Swal.fire(
              globalsConstants.K_DELETE_F_EXC_STR,
              data.message,
              'success'
            )
            this.coreService.createNotification(
              globalsConstants.K_MOD_OPINION, globalsConstants.K_DELETE_MOD, opinion.name,
              globalsConstants.K_ALL_USERS);
          } else {
            this.isLoaded = true;
            Swal.fire(
              globalsConstants.K_ERROR_EXC_STR,
              data.message,
              'error'
            )
          }
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

  onDeleteImage() {
    if(globalsConstants.K_DEFAULT_IMAGE != this.opinionObj.image){
      Swal.fire({
        title: K_DELETE_IMAGE,
        text: K_WARNING_ACTION,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: globalsConstants.K_CONFIRM_BUTTON_COLOR,
        cancelButtonColor: globalsConstants.K_CANCEL_BUTTON_COLOR,
        confirmButtonText: globalsConstants.K_CONFIRM_BUTTON_STR,
        cancelButtonText: globalsConstants.K_CANCEL_BUTTON_STR
      }).then((result) => {
        if (result.value) {
          this.isLoaded = false;
          this.opinionObj.image = globalsConstants.K_DEFAULT_IMAGE;
          this.dataApi.updateOpinionById(this.opinionObj).subscribe((data) => {
            if (globalsConstants.K_COD_OK == data.cod){
              this.getOpinionsByPage(this.page);
              this.onCancel();
              this.isLoaded = true;
              Swal.fire(
                globalsConstants.K_DELETE_IMAGE_STR,
                globalsConstants.K_DELETE_IMG_SUCCESS,
                'success'
              )
            }
            else{
              this.isLoaded = true;
              Swal.fire(
                globalsConstants.K_ERROR_EXC_STR,
                data.message,
                'error'
              )
            }
          });
        }
      });
    }
    else {
      this.toastr.info(globalsConstants.K_NO_IMAGE_INFO, globalsConstants.K_INFO_STR);
    }
  }

  onSubmit(form: NgForm){
    this.isLoaded = false;
    if(this.isEditForm){
      if(this.changeImage && this.selectedImg != null){
        this.coreService.uploadFiles(this.selectedImg).subscribe((img) => {
          this.opinionImg = img['message'];
          this.opinionObj.image = this.opinionImg;
          this.uploadSuccess = false;
          this.dataApi.updateOpinionById(this.opinionObj).subscribe((data) => {
            if (globalsConstants.K_COD_OK == data.cod){
              this.getOpinionsByPage(this.page);
              this.onCancel();
              this.coreService.createNotification(
                globalsConstants.K_MOD_OPINION, globalsConstants.K_UPDATE_MOD, this.opinionObj.name,
                globalsConstants.K_ALL_USERS);
              this.isLoaded = true;
              this.toastr.success(data.message, globalsConstants.K_UPDATE_F_STR);
            } else{
              this.isLoaded = true;
              this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
            }
          });
        });
      } else{
        this.dataApi.updateOpinionById(this.opinionObj).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod){
            this.getOpinionsByPage(this.page);
            this.onCancel();
            this.coreService.createNotification(
              globalsConstants.K_MOD_OPINION, globalsConstants.K_UPDATE_MOD, this.opinionObj.name,
              globalsConstants.K_ALL_USERS);
            this.isLoaded = true;
            this.toastr.success(data.message, globalsConstants.K_UPDATE_F_STR);
          } else{
            this.isLoaded = true;
            this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
          }
        });
      }
    } else{
      if(this.changeImage && this.selectedImg != null){
        this.coreService.uploadFiles(this.selectedImg).subscribe((img) => {
          this.opinionImg = img['message'];
          this.opinionObj.image = this.opinionImg;
          this.uploadSuccess = false;
          this.dataApi.createOpinion(this.opinionObj).subscribe((data) => {
            if (globalsConstants.K_COD_OK == data.cod){
              this.getOpinionsByPage(this.page);
              this.onCancel();
              this.coreService.createNotification(
                globalsConstants.K_MOD_OPINION, globalsConstants.K_INSERT_NEW_MOD, this.opinionObj.name,
                globalsConstants.K_ALL_USERS);
              this.isLoaded = true;
              this.toastr.success(data.message, globalsConstants.K_ADD_F_STR);
            } else{
              this.isLoaded = true;
              this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
            }
          });
        });
      } else{
        this.dataApi.createOpinion(this.opinionObj).subscribe((data) => {
          if (globalsConstants.K_COD_OK == data.cod){
            this.getOpinionsByPage(this.page);
            this.onCancel();
            this.coreService.createNotification(
              globalsConstants.K_MOD_OPINION, globalsConstants.K_INSERT_NEW_MOD, this.opinionObj.name,
              globalsConstants.K_ALL_USERS);
            this.isLoaded = true;
            this.toastr.success(data.message, globalsConstants.K_ADD_F_STR);
          } else{
            this.isLoaded = true;
            this.toastr.error(data.message, globalsConstants.K_ERROR_STR);
          }
        });
      }
    }
  }


  onFileChanged($event){
    if($event != null){
      this.selectedImg = $event.target.files[0];
      if(this.selectedImg.size > globalsConstants.K_MAX_SIZE){
        this.imageFile.nativeElement.value = globalsConstants.K_BLANK;
        this.toastr.error(globalsConstants.K_ERROR_SIZE, globalsConstants.K_ERROR_STR);
        return;
      } else{
        for(let i=0; i<=100; i++){
          setTimeout(() => {
              this.progress = i; // Simulación de progreso
          }, 500);
        }
        this.uploadSuccess = true;
        setTimeout(() => {
            this.progress = 0; // Eliminación de la barra de progreso
        }, 2500);
      }
    } else{
      return;
    }
  }

  onCancel(){
    // form.reset();
    this.isEditForm = false;
    this.activeForm = false;
    this.uploadSuccess = false;
    this.changeImage = false;
  }

  scrollToForm() {
      this.editOpinion.nativeElement.scrollIntoView({behavior:"smooth"});
  }

  toggleVisibility(e){
    this.opinionObj.home = (this.inHomeChk) ? 1 : 0;
  }

  counter(index: number) {
    let list = new Array();
    for(let i=0; i<index; i++){
      list.push(i);
    }
    return list;
  }

}
