import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PermissionService } from '../permiso.service';
import { Permission } from '../permiso';


@Component({
  selector: 'list-permisos',
  templateUrl: './permiso.list.component.html',
})
export class PermisosListComponent implements OnChanges, OnInit {
  constructor(private permissionService: PermissionService) { }

  ngOnInit(): void {
    this.getPermisosNoSelected();
  }

  loading = true;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rolId'].currentValue) {
      this.getPermisosByRol(changes['rolId'].currentValue);
       this.getPermisosNoSelected();
    }
  }

  permissions: Permission[] = [];
  permissionsNotSelected: Permission[] = [];

  @Input() rolId: number;

  public getPermisosByRol(rolId: number): void {
    this.permissionService.getPermisosByRol(rolId).subscribe((res: any) => {
      if (res.status === 'success') {
        this.permissions = res.data.permissions;
      }
      this.loading = false;
    });
  }

  //función para obtener los permisos
  public getPermisosNoSelected(): void {
    this.permissionService.getPermisos().subscribe((res: any) => {
      if (res.status === 'success') {
        const allPermissions = res.data.permissions;
        const selectedPermissions = this.permissions.map(
          (permission: any) => permission.id
        );
        this.permissionsNotSelected = allPermissions.filter(
          (permission: any) => !selectedPermissions.includes(permission.id)
        );
        this.loading = false;
      }
    });
  }
}
