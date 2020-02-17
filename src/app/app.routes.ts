import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { ContactComponent } from './components/admin/contact/contact.component';
import { WorkshopComponent } from './components/admin/workshop/workshop.component';
import { OpinionComponent } from './components/admin/opinion/opinion.component';
import { UserComponent } from './components/admin/user/user.component';

const APP_ROUTES: Routes = [
  { path: 'admin/dashboard', component: DashboardComponent }, // TODO only users auth
  { path: 'admin/contacto', component: ContactComponent }, // TODO only users auth
  { path: 'admin/talleres', component: WorkshopComponent }, // TODO only users auth
  { path: 'admin/opiniones', component: OpinionComponent }, // TODO only users auth
  { path: 'admin/cuenta', component: UserComponent }, // TODO only users auth
  { path: '**', pathMatch: 'full', redirectTo: 'admin/dashboard' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, {scrollPositionRestoration: 'top'});
