import { Injectable } from '@angular/core';
import { Materias } from '../models/materias';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class MateriasService {

  resourceUrl: string;
  constructor(private http: HttpClient) { 
    this.resourceUrl = 'https://pavii.ddns.net/api/materias/';
  }

  getById(Id: number) {
    return this.http.get(this.resourceUrl + Id);
  }

  get(): Observable<Materias[]>{
    return this.http.get<Materias[]>(this.resourceUrl);
  }

  post(obj:Materias) {
    return this.http.post(this.resourceUrl, obj);
  }

  put(Id: number, obj:Materias) {
    return this.http.put(this.resourceUrl + Id, obj);
  }

  delete(Id: number) {
    return this.http.delete(this.resourceUrl + Id);
  }
}