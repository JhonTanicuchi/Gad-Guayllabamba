import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Oficio } from './oficio';

@Injectable({
  providedIn: 'root',
})
export class OficiosService {
  constructor(private http: HttpClient) {}

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private url = environment.API_URL + '/official-documents';

  // GET /oficios
  public getOficios(): Observable<Oficio[]> {
    return this.http.get<Oficio[]>(this.url);
  }

  public getOficiosByStatus(status: string): Observable<Oficio[]> {
    return this.http.get<Oficio[]>(`${this.url}/filter/status/${status}`);
  }

  public getOficio(id: number): Observable<Oficio> {
    return this.http.get<Oficio>(`${this.url}/${id}`);
  }

  public addOficio(oficio: Oficio): Observable<Oficio> {
    return this.http.post<Oficio>(
      `${this.url}/create`,
      oficio,
      this.httpOptions
    );
  }

  public searchOficiosByTerm(term: string): Observable<Oficio[]> {
    return this.http.get<Oficio[]>(
      `${this.url}/search/term/${encodeURIComponent(term)}`
    );
  }

  public getComments(id: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`comments/official_document/${id}`);
  }

  public addComment(
    comment: Comment,
    official_document_id: number
  ): Observable<Comment> {
    return this.http.post<Comment>(
      `${environment.API_URL}/comments/create/${official_document_id}`,
      comment,
      this.httpOptions
    );
  }

  public compartirOficio(
    oficioId: number,
    usuarios: number[]
  ): Observable<any> {
    const data = {
      oficioId: oficioId,
      usuarios: usuarios,
    };
    return this.http.post<Comment>(
      `${this.url}/share/${oficioId}`,
      data,
      this.httpOptions
    );
  }

  updateStatusOfficialDocument(id: number, status: string): Observable<any> {
    const data = { status: status };
    return this.http.patch(
      `${this.url}/update/${id}/estado`,
      data,
      this.httpOptions
    );
  }

  uploadFiles(id: number, files: File[]): void {
    const formData = new FormData();
    files.forEach((file: File) => {
      formData.append('archivos[]', file, file.name);
    });
    this.http
      .post(`${environment.API_URL}/files/upload/${id}`, formData)
      .subscribe();
  }
  getArchivedOficios(): Observable<Oficio[]> {
    return this.http.get<Oficio[]>(`${this.url}/archived/list`);
  }

  searchArchivedOficiosByTerm(term: string): Observable<Oficio[]> {
    return this.http.get<Oficio[]>(
      `${this.url}/archived/search/term/${encodeURIComponent(term)}`
    );
  }

  restoreOficio(id: number): Observable<Oficio> {
    return this.http.put<Oficio>(
      `${this.url}/restore/${id}`,
      null,
      this.httpOptions
    );
  }

  public deleteOficios(id: number): Observable<Oficio> {
    return this.http.delete<Oficio>(
      `${this.url}/delete/${id}`,
      this.httpOptions
    );
  }

  public archiveOficios(id: number): Observable<Oficio> {
    return this.http.put<Oficio>(`${this.url}/archive/${id}`, this.httpOptions);
  }
}
