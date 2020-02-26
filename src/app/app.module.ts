import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy  } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ToastrModule } from 'ngx-toastr';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AgmCoreModule } from '@agm/core';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

// Routes
import { APP_ROUTING } from './app.routes';

// Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { ContactComponent } from './components/admin/contact/contact.component';
import { WorkshopComponent } from './components/admin/workshop/workshop.component';
import { PaginationComponent } from './components/shared/pagination/pagination.component';
import { OpinionComponent } from './components/admin/opinion/opinion.component';
import { UserComponent } from './components/admin/user/user.component';
import { CourseComponent } from './components/admin/course/course.component';
import { ServiceComponent } from './components/admin/service/service.component';

// Date
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    SidebarComponent,
    DashboardComponent,
    ContactComponent,
    WorkshopComponent,
    PaginationComponent,
    OpinionComponent,
    UserComponent,
    CourseComponent,
    ServiceComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule,
    CollapseModule.forRoot(),
    ToastrModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: ''
    }),
    APP_ROUTING,
    DragDropModule,
    CKEditorModule
  ],
  providers: [
    {provide : LocationStrategy , useClass: HashLocationStrategy},
    {provide: LOCALE_ID, useValue: 'es'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
