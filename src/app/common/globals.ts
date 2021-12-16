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
export const K_CONFIRM_READ_BUTTON_STR = '¡Sí, revisar!';
export const K_NO_DATE = '--/--/----';
export const K_FORMAT_DATE = 'yyyy-MM-dd';
export const K_LOCALE_EN = 'en';
export const K_NO_DATE_STR = '0000-00-00';
// Notifications
export const K_DELETE_NOTIF_STR = '¡Eliminadas!';
export const K_READ_NOTIF_STR = '¡Revisadas!';
export const K_ALL_USERS = 'ALL';
export const K_ADMIN_USERS = 'ADMIN';
export const K_OWN_USER = 'USER';
export const K_MOD_WORKSHOP = 'el taller de ';
export const K_MOD_SERVICE = 'el servicio de ';
export const K_MOD_COURSE = 'el curso de ';
export const K_MOD_OPINION = 'la opinión de ';
export const K_MOD_INFO = 'la información de ';
export const K_MOD_INFO_HOME = 'página de inicio';
export const K_MOD_INFO_FOOTER = 'pie de página';
export const K_MOD_INFO_CONTACT = 'página de contacto';
export const K_INSERT_NEW_MOD = ' ha añadido ';
export const K_UPDATE_MOD = ' ha modificado ';
export const K_DELETE_MOD = ' ha eliminado ';
export const K_ACTIVE_MOD = ' ha activado ';
export const K_DEACTIVE_MOD = ' ha desactivado ';
// Colors
export const K_CONFIRM_BUTTON_COLOR = '#d33';
export const K_CANCEL_BUTTON_COLOR = '#0095A6';
export const K_SLIDER_TEXT_COLOR = '#ffffff';
// Sections
//// General
export const K_WARNING_ACTION = 'Atención: Esta acción no se puede deshacer.';
export const K_OK_BUTTON_STR = 'Aceptar';
export const K_UPDATE_BUTTON_STR = 'Actualizar';
export const K_RESET_BUTTON_STR = 'Reiniciar';
export const K_CREATE_BUTTON_STR = 'Crear';
export const K_CANCEL_BUTTON_STR = 'Cancelar';
//// About Us
export const K_ABOUTUS_DELETE = '¿Seguro que deseas eliminar la entrada?';
export const K_ABOUTUS_DELETE_IMAGE = '¿Seguro que deseas eliminar la imagen?';
export const K_ABOUTUS_TITLE_STR = 'Nosotras ';
export const K_ABOUTUS_NAME_STR = 'Nombre';
export const K_ABOUTUS_SURNAME_STR = 'Primer Apellido';
export const K_ABOUTUS_LASTNAME_STR = 'Segundo Apellido';
export const K_ABOUTUS_POSITION_STR = 'Cargo';
export const K_ABOUTUS_NO_DATA_STR = ' No existen registros';
export const K_ABOUTUS_EDIT_RECORD_STR = 'Editar entrada';
export const K_ABOUTUS_NEW_RECORD_STR = 'Crear entrada';
//// Contact
export const K_CONTACT_HOME_TITLE_STR = "Información de página de inicio";
export const K_CONTACT_FOOTER_TITLE_STR = "Información de pie de página";
export const K_CONTACT_CONTACT_TITLE_STR = "Información de página de contacto";
export const K_INFO_POP_TITLE = "Información de sección";
export const K_INFO_POP_TITLE_TIME = "Ejemplo de horario"
export const K_INFO_POP_TITLE_EMAIL = "Información de Emails";
export const K_HOME_POP_DATA = "En esta sección podrá indicar los números de teléfono y "
+ "redes sociales que quiere que aparezcan en la barra superior de la página web."
export const K_FOOTER_POP_DATA = "En esta sección podrá indicar la información "
+ "que quiere que aparezca en el pie de página de la página web.";
export const K_CONTACT_POP_DATA = "En esta sección podrá indicar la información "
+ "que quiere que aparezca en la sección de Contacto de la página web. Podrá seleccionar "
+ "la localización directamente haciendo click en el mapa.";
export const K_TIME_POP_DATA = "Lunes a viernes: 09:00 - 14:00 y 17:00 - 20:00.";
export const K_EMAIL_POP_DATA = "Podrá indicar varios emails separandolos con ( ; ).";
export const K_INFO_EMAIL_POP_DATA = "El email indicado aquí es donde se recibiran las consultas e inscripciones de la web.";

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
