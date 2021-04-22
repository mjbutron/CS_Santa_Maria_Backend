import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class Globals {
  rol: string = 'rolDummy';
  user: string = 'userDummy';
  imgRootPath: string = environment.imageRootPath;
  userImage: string = 'default-avatar.png';
  isAuth: boolean = false;
  isChangePass: boolean = true;
}
