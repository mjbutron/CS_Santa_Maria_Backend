import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './components/admin/dashboard/dashboard.component';

const APP_ROUTES: Routes = [
  { path: 'admin/dashboard', component: DashboardComponent }, // TODO only users auth
  { path: '**', pathMatch: 'full', redirectTo: 'admin/dashboard' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, {scrollPositionRestoration: 'top'});
