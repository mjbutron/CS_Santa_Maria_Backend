import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';

import { DataApiService } from 'src/app/services/data-api.service';
import { CoreService } from 'src/app/services/core.service';

import { OpinionInterface } from 'src/app/models/opinion-interface';

const K_BLANK = '';
const K_MAX_SIZE = 3000000;

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

  // Path
  path = "http://localhost/apiRest/uploads/";
  // Opinions
  OpinionObj: OpinionInterface;
  opinions: OpinionInterface[] = [];
  opinionImg: string;
  inHomeChk: boolean;
  // Form
  @ViewChild('cssmFile', {static: false}) imageFile: ElementRef;
  // Opinions - Image
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
  public numOpinions: number;
  // Elementos por página
  private numResults: number = 10;
  // Scroll
  @ViewChild("subsScroll", { static: true }) subsScrollDiv: ElementRef;
  // Scroll Form
  @ViewChild("editOpinion", { static: true }) editOpinion: ElementRef;
  // Form
  activeForm = false;
  isEditForm = false;
  changeImage = false;

  constructor(private dataApi: DataApiService, public toastr: ToastrService, private coreService: CoreService) {
    this.OpinionObj = new OpinionInterface();
    this.inHomeChk = false;
  }

  ngOnInit() {
    this.activeForm = false;
    this.isEditForm = false;
    this.changeImage = false;
    this.uploadSuccess = false;
    this.scrollToDiv();
    this.getOpinionsByPage(this.page);
  }

  goToPage(page: number){
    this.page = page;
    this.getOpinionsByPage(page);
  }

  getOpinionsByPage(page: Number) {
    this.dataApi.getOpinionsByPage(page).subscribe((data) =>{
        this.opinions = data['allOpinions'];
        this.numOpinions = data['total'];
        this.totalPages = data['totalPages'];
        this.numberPage = Array.from(Array(this.totalPages)).map((x,i)=>i+1);
    });
  }

  onNewOpinion() {
    // Habilitar form en formato eedición
    this.activeForm = true;
    this.isEditForm = false;
    this.changeImage = false;
    this.selectedImg = null;

    this.OpinionObj.home = 0;
    this.inHomeChk = false;
    this.OpinionObj.name = K_BLANK;
    this.OpinionObj.image = "default_image.jpg";
    this.OpinionObj.commentary = K_BLANK;
    this.OpinionObj.rating = 0;
    this.OpinionObj.user_id = 1;
    setTimeout (() => {
         // Mover el scroll al form
         this.scrollToForm();
      }, 200);
  }

  onEditOpinion(opinion: OpinionInterface) {
    // Habilitar form en formato eedición
    this.activeForm = true;
    this.isEditForm = true;
    this.changeImage = false;
    this.selectedImg = null;
    // Setear valores al ui
    this.OpinionObj.id = opinion.id;
    this.OpinionObj.home = opinion.home;
    this.inHomeChk = (opinion.home == 1) ? true : false;
    this.OpinionObj.name = opinion.name;
    this.OpinionObj.commentary = opinion.commentary;
    this.OpinionObj.image = (opinion.image) ? opinion.image : "default_image.jpg";
    this.OpinionObj.rating = opinion.rating;
    this.OpinionObj.user_id = opinion.user_id;
    setTimeout (() => {
         // Mover el scroll al form
         this.scrollToForm();
      }, 200);
  }

  onDeleteOpinion(opinion: OpinionInterface){
    Swal.fire({
      title: '¿Seguro que deseas eliminar esta opinión?',
      text: "Atención: Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#0095A6',
      confirmButtonText: '¡Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.dataApi.deleteOpinionById(opinion.id).subscribe((data) => {
          this.getOpinionsByPage(this.page);
          this.isEditForm = false;
          this.activeForm = false;
          this.uploadSuccess = false;
          this.changeImage = false;
          Swal.fire(
            '¡Eliminada!',
            'Se ha eliminado la opinión seleccionada.',
            'success'
          )
        }, (err) => {
          Swal.fire(
            '¡Error!',
            'No se ha podido eliminar la opinión.',
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
          this.opinionImg = img['message'];
          this.OpinionObj.image = this.opinionImg;
          this.uploadSuccess = false;
          this.dataApi.updateOpinionById(this.OpinionObj).subscribe((data) => {
            this.getOpinionsByPage(this.page);
            this.toastr.success('Se ha actualizado la opinión', 'Actualizada');
          });
        });
      } else{
        this.dataApi.updateOpinionById(this.OpinionObj).subscribe((data) => {
          this.getOpinionsByPage(this.page);
          this.toastr.success('Se ha actualizado la opinión', 'Actualizada');
        });
      }
    } else{
      if(this.changeImage && this.selectedImg != null){
        this.coreService.uploadFiles(this.selectedImg).subscribe((img) => {
          this.opinionImg = img['message'];
          this.OpinionObj.image = this.opinionImg;
          this.uploadSuccess = false;
          this.dataApi.createOpinion(this.OpinionObj).subscribe((data) => {
            this.getOpinionsByPage(this.page);
            this.toastr.success('Se ha creado una nueva opinión', 'Añadida');
          });
        });
      } else{
        this.dataApi.createOpinion(this.OpinionObj).subscribe((data) => {
          this.getOpinionsByPage(this.page);
          this.toastr.success('Se ha creado una nueva opinión', 'Añadida');
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
      this.editOpinion.nativeElement.scrollIntoView({behavior:"smooth"});
  }

  toggleVisibility(e){
    this.OpinionObj.home = (this.inHomeChk) ? 1 : 0;
  }

  counter(index: number) {
    let list = new Array();
    for(let i=0; i<index; i++){
      list.push(i);
    }
    return list;
  }

}
