import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { StudentSubmitComponent } from './pages/student-submit/student-submit.component';
import { StudentList } from './pages/student-list/student-list';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
            {
                path: 'student/submit',
                component: StudentSubmitComponent,
                canActivate: [authGuard]
            },
            {
                path: 'student/list',
                component: StudentList
                // No auth guard - anyone can view issues
            },
            {
                path: 'safety',
                loadComponent: () => import('./pages/safety/safety').then(m => m.Safety)
            },
            {
                path: 'admin/dashboard',
                component: AdminDashboard,
                canActivate: [authGuard]
            },
            { path: 'admin', redirectTo: 'admin/dashboard', pathMatch: 'full' }
        ]
    }
];
