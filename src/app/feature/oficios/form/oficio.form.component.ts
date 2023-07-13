// importaciones de @angular
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

// importaciones de angular material
import { MatDialog } from '@angular/material/dialog';
import { ModalAlertComponent } from 'src/app/shared/material/modal-alert/modal-alert.component';

// importaciones de los servicios y modelos

import { Oficio } from '../oficio';

// importaciones de los validadores
import { MyErrorStateMatcher } from 'src/app/shared/matcher/error-state-matcher';
import { Subscription } from 'rxjs';
import cryptoJs from 'crypto-js';
import { normalize } from 'src/app/shared/helpers/normalize.str.component';
import { HttpClient } from '@angular/common/http';
import { FileIcons } from './docTypes/FileIcons';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/models/user.interface';
import { OficiosService } from '../oficios.service';

//import { OficioService } from '../oficio.service';

@Component({
  selector: 'app-oficio-form',
  templateUrl: './oficio.form.component.html',
  styleUrls: ['./oficio.form.component.css'],
})
export class OficiosFormComponent implements OnInit {
  fileIcons: FileIcons = {
    pdf: 'far fa-file-pdf',
    doc: 'far fa-file-word',
    docx: 'far fa-file-word',
    xls: 'far fa-file-excel',
    xlsx: 'far fa-file-excel',
    ppt: 'far fa-file-powerpoint',
    pptx: 'far fa-file-powerpoint',
    jpg: 'far fa-file-image',
    jpeg: 'far fa-file-image',
    png: 'far fa-file-image',
    gif: 'far fa-file-image',
    txt: 'far fa-file-alt',
    default: 'far fa-file',
  };

  // Variables de clase que son inyectadas
  currentOficio = {} as Oficio;

  title = 'Nuevo Oficio';
  paramsSubscription: Subscription;

  loading: boolean = true;

  // Variables de clase que son inyectadas por referencia
  matcher = new MyErrorStateMatcher();

  // Variables de clase que son inyectadas por referencia
  formGroup: FormGroup;

  files: File[] = [];

  currentUser = {} as User;
  currentDate = new Date();

  comments: Comment[] = [];

  constructor(
    private oficiosService: OficiosService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.initForm();
  }

  /**
   * Inicializa el formulario de oficios con los validadores y los valores por defecto.
   * Suscribe al formulario para detectar los cambios en los valores de los campos.
   */
  initForm() {
    this.formGroup = this.formBuilder.group({
      subject: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(25),
            Validators.maxLength(100),
          ],
        },
      ],
      description: [
        '',
        {
          validators: [
            Validators.required,
            Validators.minLength(80),
            Validators.maxLength(300),
          ],
        },
      ],
      files: [
        [],
        {
          validators: [Validators.required],
        },
      ],

      comment: [
        '',
        {
          validators: [Validators.minLength(30), Validators.maxLength(200)],
        },
      ],
    });

    this.formGroup.valueChanges.subscribe((values) => {
      this.currentOficio = values;
    });
  }

  ngOnInit(): void {
    this.getCurrentUser();
    this.paramsSubscription = this.activatedRoute.params.subscribe(
      (params: Params) => {
        if (params['id']) {
          this.title = 'Editar oficio';
        } else {
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        }
      }
    );
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      console.log('success');
      this.createOficio();
    }
  }

  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
  }

  getCurrentUser() {
    this.authService.getUser().subscribe((user: User) => {
      if (user) {
        this.currentUser = user;
      }
    });
  }

  getComments() {
    this.oficiosService
      .getComments(this.currentOficio.id)
      .subscribe((res: any) => {
        if (res.status === 'success') {
          this.comments = res.data.comments;
        }
      });
  }

  //método para crear un oficio nuevo
  createOficio() {
    this.oficiosService.addOficio(this.currentOficio).subscribe((res: any) => {
      if (res.status === 'success') {
        console.log('archivos antes de subir');
        console.log(this.files);
        this.uploadFiles(res.data.official_document.id);
        this.router.navigate(['/system/oficios/list']);
      }
    });
  }

  /**
   * Metodos para el drang and drop del input de archivos.
   */

  getFileIcon(file: File): string {
    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    return this.fileIcons[extension] || this.fileIcons['default'];
  }

  onFileSelected(event: any): void {
    this.files = Array.from(event.target.files);
    console.log(this.files);
    this.updateSelectedFilesList();
  }

  updateSelectedFilesList(): void {
    this.cdr.detectChanges();
  }

  uploadFiles(id: number): void {
    this.oficiosService.uploadFiles(id, this.files);
  }
}
