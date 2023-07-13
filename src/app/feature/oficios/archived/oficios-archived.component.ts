import { Component, OnInit } from '@angular/core';
import { OficiosService } from '../oficios.service';
import { Oficio } from '../oficio';
import { DatePipe } from '@angular/common';
import { FilesService } from '../../upload/upload.service';
import {finalize} from "rxjs/operators";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {ModalAlertComponent} from "../../../shared/material/modal-alert/modal-alert.component";
import {User} from "../../personal/usuarios/usuario";

@Component({
  selector: 'app-oficios-archived',
  templateUrl: './oficios-archived.component.html',
  styleUrls: ['./oficios-archived.component.css']
})
export class OficiosArchivedComponent implements OnInit {

  reverse = false;
  pipe = new DatePipe('en-US');

  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };

  oficios: Oficio[] = [];

  loading: boolean = true;

  constructor(
    private oficiosService: OficiosService,
    private filesService: FilesService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getOficios();
  }

  getOficios(): void {
    this.loading = true;
    this.oficiosService.getArchivedOficios().subscribe((res: any) => {
      if (res.status == 'success') {
        this.handleSearchResponse(res);
      }
      this.loading = false;
    });
  }

  searchOficiosByTerm(term: string): void {
    this.loading = true;

    this.oficiosService.searchArchivedOficiosByTerm(term).subscribe((res: any) => {
      if (res.status === 'success') {
        this.handleSearchResponse(res);
        if (term === '') {
          this.getOficios();
        }
        this.reverse = false;
      }
      this.loading = false;

    });
  }

  reversOrder(): void {
    this.oficios.reverse();
    this.reverse = !this.reverse;
  }



  openDialogArchiveOficio(oficio: Oficio): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      height: '350px',
      width: '700px',
      data: {
        title: '¿Está seguro de restaurar este Oficio?',
        message:
          'El Oficio será resataurado y podrá ser utilizado por los usuarios.',
        dato:['Nombre:', oficio.subject],
        button: 'Restaurar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.restaureOficio(oficio);
      }
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
  private handleSearchResponse(res: any): void {
    if (res.status === 'success') {
      this.oficios = res.data.officialDocuments;
      this.sortOficios();
      this.reverse = false;
    }
    this.loading = false;
  }

  sortOficios(): void {
    this.oficios.sort((a, b) => {
      return a.subject.toLowerCase().localeCompare(b.subject.toLowerCase());
    });
  }

  restaureOficio(oficio: Oficio): void {
    this.oficiosService.restoreOficio(oficio.id)
      .pipe(
        finalize(() => {
          this.router.navigate(['/system/oficios/list']);
        })
      )
      .subscribe((res: any) => {
        if (res.status === 'success') {
          this.handleSearchResponse(res);
        }
      });
  }


  public deleteOficios(oficio: Oficio): void {
    this.oficiosService.deleteOficios(oficio.id)
      .pipe(
        finalize(() =>{
          this.router.navigate(['/system/oficios/list']);
        })
      )
      .subscribe((res: any) => {
      if (res.status === 'success') {
        this.handleSearchResponse(res);
      }
    });
  }

  public openDialogDeleteOficio(oficio: Oficio): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      height: '350px',
      width: '700px',
      data: {
        title: '¿Está seguro de eliminar definitivamente el Oficio?',
        message:
          'El usuario será eliminado definitivamente de la base de datos y no podrá ser recuperado nunca más.',
        dato: oficio.subject,
        button: 'Eliminar definitivamente',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteOficios(oficio);
      }
    });
  }
}
