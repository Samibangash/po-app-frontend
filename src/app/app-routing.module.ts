import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserComponent } from './layout/user/user.component';
import { AdminComponent } from './layout/admin/admin.component';
import { CreatePoComponent } from './pages/create-po/create-po.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route
  { path: 'login', component: LoginComponent },
  { path: 'user-layout', component: UserComponent }, // User-specific layout
  { path: 'admin-layout', component: AdminComponent }, // Admin-specific layout
  { path: 'create-po', component: CreatePoComponent }, // Admin-specific layout
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: '/login' }, // Wildcard route (handles unknown paths)
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
