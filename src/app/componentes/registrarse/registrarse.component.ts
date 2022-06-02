import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/apiService/api.service';
import { FirebaseStorageService } from '../../firebase-storage.service';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.component.html',
  styleUrls: ['./registrarse.component.scss']
})
export class RegistrarseComponent implements OnInit {

  correo: any;
  username: any;
  password: any;
  constructor(private firestoreService: FirestoreService, private router: Router) { }

  ngOnInit(): void {
  }

  createUser() {
    var user: any =
    {
      email: this.correo,
      password: this.password,
      role: [this.username+",user"],
      username: this.username
    }

    this.firestoreService.singup(user).then(res => {
      console.log(res)
     alert('registrado con exito, puede loguearse')
     this.router.navigateByUrl('/');    
    }).catch(err=>{
      alert('error al registrarse, trate de agregar un correo valido o una contraseña mayor a 6 digitos')
    })
  }

}
