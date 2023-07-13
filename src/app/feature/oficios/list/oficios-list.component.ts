import { Component, OnInit } from '@angular/core';
import { OficiosService } from '../oficios.service';
import { Oficio } from '../oficio';
import { DatePipe } from '@angular/common';
import { FilesService } from '../../upload/upload.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ModalAlertComponent } from 'src/app/shared/material/modal-alert/modal-alert.component';

@Component({
  selector: 'app-oficios-list',
  templateUrl: './oficios-list.component.html',
  styleUrls: ['./oficios-list.component.css'],
})
export class OficiosListComponent implements OnInit {
  reverse = false;
  pipe = new DatePipe('en-US');

  config = {
    itemsPerPage: 10,
    currentPage: 1,
  };

  oficios: Oficio[] = [];

  loading: boolean = true;
  filter: string;

  constructor(
    private oficiosService: OficiosService,
    private filesService: FilesService,
    private route: ActivatedRoute,
    private dialog: MatDialog,

  ) {
    this.filter = this.route.snapshot.data['filter'];
  }

  ngOnInit(): void {
    if (this.filter) {
      this.getOficiosByStatus(this.filter);
    } else {
      this.getOficios();
    }
  }

  getOficiosByStatus(status: string): void {
    this.loading = true;
    this.oficiosService.getOficiosByStatus(status).subscribe((res: any) => {
      if (res.status == 'success') {
        this.oficios = res.data.official_documents;

        this.oficios.sort((a, b) => {
          if (a.subject.toLowerCase() > b.subject.toLowerCase()) {
            return 1;
          }
          if (a.subject.toLowerCase() < b.subject.toLowerCase()) {
            return -1;
          }
          return 0;
        });
      }
      this.loading = false;
    });
  }

  getOficios(): void {
    this.loading = true;
    this.oficiosService.getOficios().subscribe((res: any) => {
      if (res.status == 'success') {
        this.oficios = res.data.official_documents;

        this.oficios.sort((a, b) => {
          if (a.subject.toLowerCase() > b.subject.toLowerCase()) {
            return 1;
          }
          if (a.subject.toLowerCase() < b.subject.toLowerCase()) {
            return -1;
          }
          return 0;
        });
      }
      this.loading = false;
    });
  }

  searchOficiosByTerm(term: string): void {
    this.loading = true;

    this.oficiosService.searchOficiosByTerm(term).subscribe((res: any) => {
      if (res.status === 'success') {
        this.oficios = res.data.official_documents;
        if (term === '') {
          this.getOficios();
        }
        this.reverse = false;
      }
      this.loading = false;
    });
  }

  archiveOficio(oficio: Oficio): void {
    this.oficiosService.archiveOficios(oficio.id).subscribe((res: any) => {
      if (res.status === 'success') {
        this.getOficios();
      }
    });
  }

  openDialogArchiveOficio(oficio: Oficio): void {
    const dialogRef = this.dialog.open(ModalAlertComponent, {
      height: '320px',
      width: '600px',
      data: {
        title: '¿Está seguro de eliminar el oficio?',
        message: 'El oficio será eliminado y no podrá ser recuperado',
        dato: oficio.subject,
        button: 'Eliminar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.archiveOficio(oficio);
      }
    });
  }

  reversOrder(): void {
    this.oficios.reverse();
    this.reverse = !this.reverse;
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
}
