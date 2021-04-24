import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class Globals {
  // URLs
  imgRootPath: string = environment.imageRootPath;
  // User image profile (Default)
  userImage: string = 'default-avatar.png';
  // User name and rol (Default)
  rol: string = 'rolDummy';
  user: string = 'userDummy';
  // Show if you are logged in
  isAuth: boolean = false;
  // Sets whether the password has changed
  isChangePass: boolean = true;
}
