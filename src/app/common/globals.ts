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
export const K_MODIFY_BUTTON_STR = 'Modificar';
export const K_RESET_BUTTON_STR = 'Reiniciar';
export const K_CREATE_BUTTON_STR = 'Crear';
export const K_CANCEL_BUTTON_STR = 'Cancelar';
export const K_NO_DATA_STR = ' No existen registros';
export const K_DASHBOARD_STR = 'Principal';
export const K_INFO_CONTACT_STR = 'Info. Contacto';
export const K_ABOUT_US_STR = 'Personal';
export const K_SERVICE_STR = 'Servicios';
export const K_WORKSHOP_STR = 'Talleres';
export const K_COURSE_STR = 'Cursos';
export const K_OPINION_STR = 'Opiniones';
export const K_CHANGE_PASS_NOTIF_STR = '¡Hola! Por favor, cambie la contraseña desde su perfil para completar el registro del usuario.';
//// About Us
export const K_ABOUTUS_DELETE = '¿Seguro que deseas eliminar este miembro?';
export const K_ABOUTUS_DELETE_IMAGE = '¿Seguro que deseas eliminar la imagen?';
export const K_ABOUTUS_TITLE_STR = 'Personal ';
export const K_ABOUTUS_NAME_STR = 'Nombre';
export const K_ABOUTUS_SURNAME_STR = 'Primer Apellido';
export const K_ABOUTUS_LASTNAME_STR = 'Segundo Apellido';
export const K_ABOUTUS_POSITION_STR = 'Cargo';
export const K_ABOUTUS_EDIT_RECORD_STR = 'Editar entrada';
export const K_ABOUTUS_NEW_RECORD_STR = 'Crear entrada';
//// Contact
export const K_CONTACT_HOME_TITLE_STR = "Información de barra superior";
export const K_CONTACT_FOOTER_TITLE_STR = "Información de pie de página";
export const K_CONTACT_CONTACT_TITLE_STR = "Información de página de contacto";
export const K_CONTACT_SHOW_SOCIAL_STR = "Mostrar redes sociales en el pie de página";
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
//// Course
export const K_COURSE_TITLE_STR = 'Cursos ';
export const K_COURSE_DELETE_COURSE = '¿Seguro que deseas eliminar el curso?';
export const K_COURSE_DELETE_IMAGE = '¿Seguro que deseas eliminar la imagen?';
export const K_COURSE_DEACTIVE_COURSE = '¿Seguro que deseas desactivar este curso?';
export const K_COURSE_ACTIVE_COURSE = '¿Seguro que deseas activar este curso?';
export const K_COURSE_DEACTIVE_STR = '¡Desactivado!';
export const K_COURSE_ACTIVATED_STR = '¡Activado!';
export const K_COURSE_DEACTIVE_SUCCESS_SRT = 'Se ha desactivado el curso.';
export const K_COURSE_ACTIVE_SUCCESS_SRT = 'Se ha activado el curso.';
export const K_COURSE_NAME_STR = 'Nombre';
export const K_COURSE_DATE_STR = 'Fecha';
export const K_COURSE_TIME_STR = 'Hora';
export const K_COURSE_PRICE_STR = 'Precio';
export const K_COURSE_PLACES_STR = 'Plazas';
export const K_COURSE_FREE_PLACES_STR = 'Libres';
export const K_COURSE_ACTIVE_STR = 'Activo';
export const K_COURSE_EDIT_RECORD_STR = 'Editar curso';
export const K_COURSE_NEW_RECORD_STR = 'Crear curso';
//// Dashboard
export const K_DASHBRD_UPDATE_ORDER = 'Se ha modificado el orden de la cabecera';
export const K_DASHBRD_TITLE_STR = 'Centro Sanitario Santa María ';
export const K_DASHBRD_LAST_SERVICE_STR = 'Ult. añadido:  ';
export const K_DASHBRD_NEXT_WORKSHOP_STR = 'Próximo Taller: ';
export const K_DASHBRD_NEXT_COURSE_STR = 'Próximo Curso: ';
export const K_DASHBRD_LAST_OPINION_STR = 'Ult. añadida:  ';
export const K_DASHBRD_HEADER_TITLE_STR = 'Imágenes de cabecera';
export const K_DASHBRD_SUBTEXT_HEADER_STR = 'Cambia el orden arrastrando la imagen o modifica la cabecera seleccionando una de ellas.';
export const K_DASHBRD_EDIT_HEADER_STR = 'Editar cabecera';
export const K_DASHBRD_WORKSHOP_IN_HOME_STR = 'Talleres en página de inicio';
export const K_DASHBRD_NAME_STR = 'Nombre';
export const K_DASHBRD_DATE_STR = 'Fecha';
export const K_DASHBRD_SHEDULE_STR = 'Horario';
export const K_DASHBRD_PRICE_STR = 'Precio';
export const K_DASHBRD_AVAILABLE_STR = 'Disponibilidad';
export const K_DASHBRD_COMPLETE_STR = 'Completo';
export const K_DASHBRD_IMAGE_STR = 'Imagen';
export const K_DASHBRD_COMMENT_STR = 'Comentario';
export const K_DASHBRD_RATING_STR = 'Valoración';
export const K_DASHBRD_NO_WRKS_DATA_HOME_STR = 'No hay talleres visibles en la pagina de inicio';
export const K_DASHBRD_OPINIONS_IN_HOME_STR = 'Opiniones en página de inicio';
export const K_DASHBRD_NO_OPN_DATA_HOME_STR = 'No hay opiniones visibles en la pagina de inicio';
//// Login
export const K_LOGIN_WAIT_ALERT = 'Por favor, espere...';
export const K_LOGIN_ERROR = 'Error en inicio de sesión';
export const K_LOGIN_STRG_RMB_EMAIL = 'rememberEmail';
export const K_LOGIN_STRG_USER_NAME = 'username';
export const K_LOGIN_STRG_ROL_NAME = 'rolname';
export const K_LOGIN_STRG_USER_IMAGE = 'userImage';
export const K_LOGIN_STRG_EMAIL = 'email';
export const K_LOGIN_STRG_ACCESSTKN = 'accessTkn';
export const K_LOGIN_REMEMBER_USER = 'Recordar mi usuario';
export const K_LOGIN_BUTTON = 'Iniciar sesión';
//// Notifications
export const K_NOTIF_TITLE_STR = 'Notificaciones ';
export const K_NOTIF_DELETE = '¿Seguro que deseas eliminar todas las notificaciones?';
export const K_NOTIF_READ = '¿Seguro que deseas marcar todas las notificaciones como revisadas?';
export const K_NOTIF_NEW_STR = 'Nuevas';
export const K_NOTIF_NO_READ_STR = 'No revisadas';
export const K_NOTIF_READ_STR = 'Revisadas';
export const K_NOTIFICATION_STR = 'Notificación';
export const K_NOTIF_DATETIME_STR = 'Fecha/Hora';
export const K_NOTIF_NO_DATA = ' No tiene notificaciones';
//// Opinion
export const K_OPINION_TITLE_STR = 'Opiniones ';
export const K_OPINION_DELETE = '¿Seguro que deseas eliminar esta opinión?';
export const K_OPINION_DELETE_IMAGE = '¿Seguro que deseas eliminar la imagen?';
export const K_OPINION_NAME_STR = 'Nombre';
export const K_OPINION_DATE_STR = 'Fecha';
export const K_OPINION_COMMENT_STR = 'Comentario';
export const K_OPINION_RATING_STR = 'Valoración';
export const K_OPINION_IN_HOME_STR = 'Pag. Principal';
export const K_OPINION_EDIT = 'Editar opinión';
export const K_OPINION_NEW = 'Crear opinión';
//// Services
export const K_SERVICE_TITLE_STR = 'Servicios ';
export const K_SERVICE_DELETE = '¿Seguro que deseas eliminar el servicio?';
export const K_SERVICE_DELETE_IMAGE = '¿Seguro que deseas eliminar la imagen?';
export const K_SERVICE_DEACTIVE_SERVICE = '¿Seguro que deseas desactivar este servicio?';
export const K_SERVICE_ACTIVE_SERVICE = '¿Seguro que deseas activar este servicio?';
export const K_SERVICE_DEACTIVATED_STR = '¡Desactivado!';
export const K_SERVICE_ACTIVATED_STR = '¡Activado!';
export const K_SERVICE_DEACTIVE_SUCCESS_SRT = 'Se ha desactivado el servicio.';
export const K_SERVICE_ACTIVE_SUCCESS_SRT = 'Se ha activado el servicio.';
export const K_SERVICE_IMAGE_STR = 'Imagen';
export const K_SERVICE_SERV_STR = 'Servicio';
export const K_SERVICE_ACTIVE_STR = 'Activo';
export const K_SERVICE_EDIT = 'Editar servicio';
export const K_SERVICE_NEW = 'Crear servicio';
//// User managment
export const K_USERMGT_TITLE_STR = 'Gestión de usuarios ';
export const K_USERMGT_DELETE_USER = '¿Seguro que deseas eliminar al usuario?';
export const K_USERMGT_DEACTIVE_USER = '¿Seguro que deseas desactivar este usuario?';
export const K_USERMGT_ACTIVE_USER = '¿Seguro que deseas activar este usuario?';
export const K_USERMGT_DEACTIVATED_STR = '¡Desactivado!';
export const K_USERMGT_ACTIVATED_STR = '¡Activado!';
export const K_USERMGT_DEACTIVE_SUCCESS_SRT = 'Se ha desactivado el usuario.';
export const K_USERMGT_ACTIVE_SUCCESS_SRT = 'Se ha activado el usuario.';
export const K_USERMGT_IMAGE_STR = 'Imagen';
export const K_USERMGT_NAME_STR = 'Nombre';
export const K_USERMGT_SURNAME_STR = 'Apellidos';
export const K_USERMGT_EMAIL_STR = 'Email';
export const K_USERMGT_PHONE_STR = 'Teléfono';
export const K_USERMGT_ROL_STR = 'Rol';
export const K_USERMGT_ACTIVE_STR = 'Activo';
export const K_USERMGT_EDIT = 'Editar usuario';
export const K_USERMGT_NEW = 'Crear usuario';
//// User
export const K_USER_DELETE_IMAGE = '¿Seguro que deseas eliminar la imagen?';
export const K_USER_SAME_PASS_ALERT = '¡La nueva contraseña es igual a la anterior!';
export const K_USER_PASS_NOT_MATCH_ALERT = '¡Las contraseñas no coinciden!';
export const K_USER_PASS_CHANGE_SUCCESS = 'Se ha actualizado la contraseña';
export const K_USER_WRONG_PASS = '¡La contraseña actual es incorrecta!';
export const K_USER_PROFILE = 'Perfil de usuario';
export const K_USER_SOCIAL_LINKS = 'Redes sociales';
export const K_USER_INFO_SOCIAL_LINKS = 'Insertar enlaces completos, copiados desde la barra de direcciones (https://www...).';
export const K_USER_CHANGE_IMAGE = 'Cambiar imagen';
export const K_USER_CURRENT_DELETE = 'Eliminar actual';
export const K_USER_MODIFY_PASS = ' Modificar contraseña';
//// Workshop
export const K_WORKSHOP_TITLE_STR = 'Talleres ';
export const K_WORKSHOP_DELETE_WORKSHOP = '¿Seguro que deseas eliminar el taller?';
export const K_WORKSHOP_DELETE_IMAGE = '¿Seguro que deseas eliminar la imagen?';
export const K_WORKSHOP_DEACTIVE_WORKSHOP = '¿Seguro que deseas desactivar este taller?';
export const K_WORKSHOP_ACTIVE_WORKSHOP = '¿Seguro que deseas activar este taller?';
export const K_WORKSHOP_DEACTIVATED_STR = '¡Desactivado!';
export const K_WORKSHOP_ACTIVATED_STR = '¡Activado!';
export const K_WORKSHOP_DEACTIVE_SUCCESS_SRT = 'Se ha desactivado el taller.';
export const K_WORKSHOP_ACTIVE_SUCCESS_SRT = 'Se ha activado el taller.';
export const K_WORKSHOP_NAME_STR = 'Nombre';
export const K_WORKSHOP_DATE_STR = 'Fecha';
export const K_WORKSHOP_TIME_STR = 'Hora';
export const K_WORKSHOP_PRICE_STR = 'Precio';
export const K_WORKSHOP_IN_HOME_STR = 'Pag. Principal';
export const K_WORKSHOP_ACTIVE_STR = 'Activo';
export const K_WORKSHOP_EDIT = 'Editar taller';
export const K_WORKSHOP_NEW = 'Crear taller';
//// Footer
export const K_FOOTER_NAME_CENTER = ' Centro Sanitario Santa María';
//// Navigation Bar
export const K_NAVBAR_CLASS_BELL = 'far fa-bell ';
export const K_NAVBAR_CLASS_EFECT_BELL = 'animate__animated animate__swing ';
export const K_NAVBAR_NAME_CENTER = 'C.S. Santa María';
export const K_NAVBAR_VISIT_WEB = 'Visitar la web';
export const K_NAVBAR_USERS = 'Usuarios';
export const K_NAVBAR_NOTIFICATIONS = 'Notificaciones';
export const K_NAVBAR_PROFILE = 'Mi cuenta';
export const K_NAVBAR_LOGOUT = 'Cerrar sesión';
export const K_NAVBAR_BACK = 'Volver';

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
  rolAdmin: string = 'Administrador';
  pathUsers: string = 'usuarios';
  // Auth - Show if you are logged in
  isAuth: boolean = false;
  // Sets whether the password has changed
  isChangePass: boolean = true;
}
