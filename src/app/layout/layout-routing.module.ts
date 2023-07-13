import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { MainComponent } from './main/main.component';

import { UsuariosListComponent } from '../feature/personal/usuarios/list/usuario.list.component';
import { UsuariosArchivedComponent } from '../feature/personal/usuarios/archived/usuario.archived.component';
import { UsuariosFormComponent } from '../feature/personal/usuarios/form/usuario.form.component';
import { RolesListComponent } from '../feature/personal/roles/list/rol.list.component';
import { RolesFormComponent } from '../feature/personal/roles/form/rol.form.component';
import { RolesArchivedComponent } from '../feature/personal/roles/archived/rol.archived.component';

import { ProfilePersonalDataComponent } from '../auth/profile/general/general.component';
import { ProfileMainComponent } from '../auth/profile/main/main.component';
import { ProfileSecurityComponent } from '../auth/profile/seguridad/seguridad.component';

import { UploadComponent } from '../feature/upload/upload.component';

import { OficiosListComponent } from '../feature/oficios/list/oficios-list.component';
import { OficiosFormComponent } from '../feature/oficios/form/oficio.form.component';
import { OficiosDetailComponent } from '../feature/oficios/detail/oficio.detail.component';
import { OficiosArchivedComponent } from '../feature/oficios/archived/oficios-archived.component';
import { OficioStadisticComponent } from '../feature/stadistics/oficio.stadistic.component';


const routes: Routes = [
  { path: 'upload', component: UploadComponent },
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'stadistics', component: OficioStadisticComponent },
      {
        path: 'perfil',
        children: [
          {
            path: '',
            component: ProfileMainComponent,
            children: [
              { path: '', redirectTo: 'datos-personales', pathMatch: 'full' },
              {
                path: 'datos-personales',
                component: ProfilePersonalDataComponent,
              },

              { path: 'seguridad', component: ProfileSecurityComponent },
            ],
          },
        ],
      },

      {
        path: 'personal',
        children: [
          { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
          {
            path: 'usuarios',
            children: [
              {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
              },
              {
                path: 'form',
                component: UsuariosFormComponent,
              },
              {
                path: 'form/:id',
                component: UsuariosFormComponent,
              },
              {
                path: 'list',
                children: [
                  {
                    path: '',
                    component: UsuariosListComponent,
                  },
                  {
                    path: 'archived',
                    component: UsuariosArchivedComponent,
                  },
                ],
              },
            ],
          },
          {
            path: 'roles',
            children: [
              {
                path: '',
                redirectTo: 'list',
                pathMatch: 'full',
              },
              {
                path: 'form',
                component: RolesFormComponent,
              },
              {
                path: 'form/:id',
                component: RolesFormComponent,
              },
              {
                path: 'list',
                children: [
                  {
                    path: '',
                    component: RolesListComponent,
                  },
                  {
                    path: 'archived',
                    component: RolesArchivedComponent,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: 'oficios',
        children: [
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full',
          },
          {
            path: 'form',
            component: OficiosFormComponent,
          },
          {
            path: 'detail/:id',
            component: OficiosDetailComponent,
          },
          {
            path: 'list',
            children: [
              {
                path: '',
                component: OficiosListComponent,
              },
              {
                path: 'filter',
                children: [
                  {
                    path: 'creados',
                    component: OficiosListComponent,
                    data: {
                      filter: 'creado',
                    },
                  },
                  {
                    path: 'recibidos',
                    component: OficiosListComponent,
                    data: {
                      filter: 'recibido',
                    },
                  },
                  {
                    path: 'pendientes',
                    component: OficiosListComponent,
                    data: {
                      filter: 'pendiente',
                    },
                  },
                  {
                    path: 'en-proceso',
                    component: OficiosListComponent,
                    data: {
                      filter: 'en proceso',
                    },
                  },
                  {
                    path: 'cancelados',
                    component: OficiosListComponent,
                    data: {
                      filter: 'cancelado',
                    },
                  },
                  {
                    path: 'aprobados',
                    component: OficiosListComponent,
                    data: {
                      filter: 'aprobado',
                    },
                  },
                ],
              },
              {
                path: 'archived',
                component: OficiosArchivedComponent,
              },
            ],
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
