import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { ContactComponent } from './components/admin/contact/contact.component';
import { WorkshopComponent } from './components/admin/workshop/workshop.component';
import { OpinionComponent } from './components/admin/opinion/opinion.component';
import { UserComponent } from './components/admin/user/user.component';
import { CourseComponent } from './components/admin/course/course.component';
import { ServiceComponent } from './components/admin/service/service.component';
import { AboutusComponent } from './components/admin/aboutus/aboutus.component';
import { LoginComponent } from './components/admin/login/login.component';
import { UsermgtComponent } from './components/admin/user/usermgt/usermgt.component';
import { AuthGuard } from './guards/auth.guard';

const APP_ROUTES: Routes = [
  { path: 'admin/dashboard', component: DashboardComponent, canActivate: [AuthGuard] }, // TODO only users auth
  { path: 'admin/contacto', component: ContactComponent, canActivate: [AuthGuard] }, // TODO only users auth
  { path: 'admin/talleres', component: WorkshopComponent, canActivate: [AuthGuard] }, // TODO only users auth
  { path: 'admin/opiniones', component: OpinionComponent, canActivate: [AuthGuard] }, // TODO only users auth
  { path: 'admin/cuenta', component: UserComponent, canActivate: [AuthGuard] }, // TODO only users auth
  { path: 'admin/cursos', component: CourseComponent, canActivate: [AuthGuard] }, // TODO only users auth
  { path: 'admin/servicios', component: ServiceComponent, canActivate: [AuthGuard] }, // TODO only users auth
  { path: 'admin/nosotras', component: AboutusComponent, canActivate: [AuthGuard] }, // TODO only users auth
  { path: 'admin/usuarios', component: UsermgtComponent, canActivate: [AuthGuard] }, // TODO only users auth
  { path: 'login', component: LoginComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'admin/dashboard' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, {scrollPositionRestoration: 'enabled'});
