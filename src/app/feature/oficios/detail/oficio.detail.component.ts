// importaciones de @angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

// importaciones de los servicios y modelos
import { Oficio } from '../oficio';

import { Subscription } from 'rxjs';
import { OficiosService } from '../oficios.service';
import { UsuarioService } from '../../personal/usuarios/usuario.service';
import { User } from '../../personal/usuarios/usuario';
import { MyErrorStateMatcher } from 'src/app/shared/matcher/error-state-matcher';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { User as UserAuth } from 'src/app/auth/models/user.interface';
import { RolService } from '../../personal/roles/rol.service';
import { Role } from '../../personal/roles/rol';
import { FilesService } from '../../upload/upload.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalAlertComponent } from 'src/app/shared/material/modal-alert/modal-alert.component';

@Component({
  selector: 'app-oficio-detail',
  templateUrl: './oficio.detail.component.html',
  styleUrls: ['./oficio.detail.component.css'],
})
export class OficiosDetailComponent implements OnInit {
  // Variables de clase que son inyectadas
  currentUser = {} as UserAuth;
  currentOficio = {} as Oficio;
  currentComment = {} as Comment;
  users: User[] = [];
  roles: Role[] = [];
  selectedRole: any;
  selectedUsers: number[] = [];
  selectedRoles: { [roleId: number]: boolean } = {};

  searchUsers: string;

  paramsSubscription: Subscription;

  // Variables de clase que son inyectadas por referencia
  matcher = new MyErrorStateMatcher();

  // Variables de clase que son inyectadas por referencia
  formGroup: FormGroup;

  loading: boolean = true;

  comentarios: boolean = false;
  compartir: boolean = false;
  compartir1: boolean = true;
  compartir2: boolean = false;
  anexos: boolean = false;

  nuevoComentario: boolean = false;

  constructor(
    private authService: AuthService,
    private oficiosService: OficiosService,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private filesService: FilesService,
    private dialog: MatDialog
  ) {
    this.initForm();
  }

  /**
   * Inicializa el formulario de oficios con los validadores y los valores por defecto.
   * Suscribe al formulario para detectar los cambios en los valores de los campos.
   */
  initForm() {
    this.formGroup = this.formBuilder.group({
      comment: [
        '',
        {
          validators: [Validators.maxLength(300)],
        },
      ],
    });

    this.formGroup.valueChanges.subscribe((values) => {
      this.currentComment = values;
    });
  }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getRoles();
    this.paramsSubscription = this.activatedRoute.params.subscribe(
      (params: Params) => {
        if (params['id']) {
          this.getOficio(params['id']);
        } else {
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        }
      }
    );
  }

  getCurrentUser() {
    this.authService.getUser().subscribe((user: UserAuth) => {
      if (user) {
        this.currentUser = user;
      }
    });
  }

  getRoles(): void {
    this.loading = true;
    this.rolService.getRoles().subscribe((res: any) => {
      if (res.status == 'success') {
        this.roles = res.data.roles;
      }
      this.loading = false;
    });
  }

  selectRole(roleId: number) {
    this.loading = true;
    this.selectedRole = this.roles.find((role) => role.id === roleId);
    this.getUsuariosByRolAndTerm();
  }

  getUsuariosByRolAndTerm(term?: string) {
    this.loading = true;
    if (this.selectedRole) {
      this.usuarioService
        .getUsersByRole(this.selectedRole.id, term ?? '')
        .subscribe((res: any) => {
          if (res.status == 'success') {
            this.users = res.data.users;
          }
          this.loading = false;
        });
    } else {
      this.users = [];
      this.loading = false;
    }
  }

  handleSelectionChange(userId: number) {
    const index = this.selectedUsers.indexOf(userId);

    if (index === -1) {
      this.selectedUsers.push(userId);
    } else {
      this.selectedUsers.splice(index, 1);
    }

    this.updateRoleSelection();
  }

  updateRoleSelection() {
    const selectedUserIds = this.selectedUsers.map((userId) =>
      userId.toString()
    );
    const allUsersSelected = this.users.every((user) =>
      selectedUserIds.includes(user.id.toString())
    );

    if (allUsersSelected) {
      this.selectedRoles[this.selectedRole.id] = true;
    } else {
      this.selectedRoles[this.selectedRole.id] = false;
    }
  }

  isChecked(userId: number): boolean {
    return this.selectedUsers.includes(userId);
  }

  handleRoleSelectionChange(roleId: number) {
    const getUsersByRole = (roleId: number) => {
      return this.usuarioService.getUsersByRole(roleId, '').toPromise();
    };

    const updateSelectedUsers = (usersWithRole: User[]) => {
      usersWithRole.forEach((user: User) => {
        const index = this.selectedUsers.indexOf(user.id);
        if (index === -1 && this.selectedRoles[roleId]) {
          this.selectedUsers.push(user.id);
        } else if (index !== -1 && !this.selectedRoles[roleId]) {
          this.selectedUsers.splice(index, 1);
        }
      });
    };

    if (roleId === 0) {
      if (this.selectedRoles[roleId]) {
        this.roles.forEach((role: Role) => {
          this.selectedRoles[role.id] = true;
        });
        this.selectedUsers = [];
        this.roles.forEach((role: Role) => {
          getUsersByRole(role.id)
            .then((res: any) => {
              if (res.status === 'success') {
                const usersWithRole = res.data.users;
                updateSelectedUsers(usersWithRole);
              }
            })
            .catch((error: any) => {});
        });
      } else {
        this.roles.forEach((role: Role) => {
          this.selectedRoles[role.id] = false;
        });
        this.selectedUsers = [];
      }
    } else {
      if (this.selectedRoles[roleId]) {
        const allRolesSelected = this.roles.every(
          (role: Role) => this.selectedRoles[role.id]
        );
        if (allRolesSelected) {
          this.selectedRoles[0] = true;
        }
      } else {
        this.selectedRoles[0] = false;
      }
      getUsersByRole(roleId)
        .then((res: any) => {
          if (res.status === 'success') {
            const usersWithRole = res.data.users;
            updateSelectedUsers(usersWithRole);
          }
        })
        .catch((error: any) => {});
    }
  }

  send(): void {
    if (this.formGroup.valid) {
      this.createComment();
    }
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

  getOficio(id: number) {
    this.loading = true;
    this.oficiosService.getOficio(id).subscribe((res: any) => {
      if (res.status == 'success') {
        this.currentOficio = res.data.official_document;
        console.log(this.currentOficio)
      }
      this.loading = false;
    });
  }

  createComment() {
    this.oficiosService
      .addComment(this.currentComment, this.currentOficio.id)
      .subscribe((res: any) => {
        if (res.status === 'success') {
          this.currentOficio.comments.push(res.data.comment);
        }
      });
  }

  compartirOficio() {
    this.oficiosService
      .compartirOficio(this.currentOficio.id, this.selectedUsers)
      .subscribe((res: any) => {
        this.currentOficio.status = 'en proceso';
      });
  }

  downloadFile(id: number, name: string) {
    this.filesService.downloadFile(id).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }

  public openDialogStatus(status: string): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      height: '350px',
      width: '700px',
      data: {
        title: '¿Está seguro de modificar el estado del oficio?',
        message: 'El oficio puede tener cambios irreversibles.',
        dato: ' Nuevo Estado: ' + status,
        icon: 'fa-solid fa-pen-to-square',
        button: 'Modificar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateStatusOfficialDocument(status);
      }
    });
  }

  public updateStatusOfficialDocument(status: string): void {
    this.oficiosService
      .updateStatusOfficialDocument(this.currentOficio.id, status)
      .subscribe((res: any) => {
        if (res.status == 'success') {
          this.currentOficio = res.data.official_document;
        }
        this.loading = false;
      });
  }
}
