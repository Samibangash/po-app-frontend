import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './layout/admin/admin.component';
import { UserComponent } from './layout/user/user.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CreatePoComponent } from './pages/create-po/create-po.component';
import { NavbarComponent } from './navbar/navbar.component';

import { AuthInterceptor } from './auth.interceptor'; // Your custom auth interceptor
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt'; // Import JWT services
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    UserComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    CreatePoComponent,
    NavbarComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,

      multi: true,
    },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }, // Provide JwtHelperService options
    JwtHelperService, // Include JwtHelperService in providers
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
