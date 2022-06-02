import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://ec2-44-203-78-238.compute-1.amazonaws.com:8080/'
})

@Injectable({
  providedIn: 'root'
})


export class FirestoreService {
  constructor( private firestore: AngularFireDatabase, private authService: AuthService) {}

  //loguin
  Loguin(payload:any){
    return api.post(`api/auth/signin`, payload);
  }

  singup(payload:any){
    console.log(payload);
    return api.post(`api/auth/signup`, payload);
  }

  //zonas
  getZonas(headerGroup:any){
    return api.get(`api/zona`, { headers: headerGroup });
  }

  postZona(payload:any, headerGroup:any){
    return api.post(`api/zona`,payload, { headers: headerGroup });
  }

  deleteZona(id:any, headerGroup:any){
    return api.delete(`api/zona/`+id, { headers: headerGroup });
  }

  getZonaId(id:any, headerGroup:any){
    return api.get(`api/zona/`+id, { headers: headerGroup });
  }

  //Plaga
  postPlaga(payload:any, headerGroup:any){
    return api.post(`api/plaga`,payload, { headers: headerGroup });
  }

  getPlaga(headerGroup:any){
    return api.get(`api/plaga`, { headers: headerGroup });
  }

  getPlagaId(id:any, headerGroup:any){
    return api.get(`api/plaga/`+id, { headers: headerGroup });
  }

  deletePlaga(id:any, headerGroup:any){
    return api.delete(`api/plaga/`+id, { headers: headerGroup });
  }

}