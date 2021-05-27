import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

// Image
export const K_DEFAULT_IMAGE = 'default_image.jpg';
export const K_DEFAULT_AVATAR = 'default-avatar.png';
export const K_NO_IMAGE_INFO = 'No se ha cargado ninguna imagen';
export const K_DELETE_IMAGE_STR = '¡Eliminada!';
export const K_DELETE_IMG_SUCCESS = 'Se ha eliminado la imagen.';
// Upload image
export const K_MAX_SIZE = 3000000;
export const K_ERROR_SIZE = 'El tamaño no puede ser superior a 3MB.';
// HTTP code
export const K_COD_OK = 200;
export const K_COD_NOT_FOUND = 404;
export const K_COD_UNVLBL_SERVICE = 503;
// Constant numeric values
export const K_ZERO_RESULTS = 0;
export const K_NUM_RESULTS_PAGE = 5;
// Constant string values
export const K_BLANK = '';
export const K_ERROR_STR = 'Error';
export const K_ERROR_EXC_STR = '¡Error!';
export const K_INFO_STR = 'Información';
export const K_UPDATE_STR = 'Actualizado';
export const K_UPDATE_F_STR = 'Actualizada';
export const K_CREATE_STR = 'Creado';
export const K_CREATE_F_STR = 'Creada';
export const K_ADD_STR = 'Añadido';
export const K_ADD_F_STR = 'Añadida';
export const K_DELETE_EXC_STR = '¡Eliminado!';
export const K_DELETE_F_EXC_STR = '¡Eliminada!';
export const K_TOP_ELEMENT_STR = 'rtrSup';
export const K_CONFIRM_BUTTON_STR = '¡Sí, eliminar!';
export const K_OK_BUTTON_STR = 'Aceptar';
export const K_CANCEL_BUTTON_STR = 'Cancelar';
export const K_NO_DATE = '--/--/----';
export const K_FORMAT_DATE = 'yyyy-MM-dd';
export const K_LOCALE_EN = 'en';
// Colors
export const K_CONFIRM_BUTTON_COLOR = '#d33';
export const K_CANCEL_BUTTON_COLOR = '#0095A6';
export const K_SLIDER_TEXT_COLOR = '#ffffff';

@Injectable()
export class Globals {
  // URLs
  imgRootPath: string = environment.imageRootPath;
  pathFrontEnd: string = environment.urlFrontEnd;
  // User image profile (Default)
  userImage: string = 'default-avatar.png';
  // User (Default)
  userID: number = 0;
  rol_name: string = '----';
  user_name: string = '----';
  // Show if you are logged in
  isAuth: boolean = false;
  // Sets whether the password has changed
  isChangePass: boolean = true;
}
