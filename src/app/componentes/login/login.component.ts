import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/usuario.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FirestoreService } from 'src/app/services/apiService/api.service';
import { FirebaseStorageService } from '../../firebase-storage.service';
import Cookies from 'universal-cookie/es6';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  usuario:User ={
    username:'',
    password:''
  };

  registroUsuario:User ={
    username:'',
    password:''
  };
  
  password:any;

  constructor(private router: Router, private authService: AuthService, private firestoreService: FirestoreService, ) { }

  ngOnInit(): void {
  }

  async Loguearse(){   
    var cookies = new Cookies();
    this.firestoreService.Loguin(this.usuario).then(res => {
      var resp = res;
      console.log(res.data);
      cookies.set('token', resp.data.accessToken, { expires: new Date(Date.now() + 3600000) })
      this.router.navigateByUrl('/home/cultivos');    
    })
  }

  registrarUsuario(){   
    if(this.password == this.registroUsuario.password){
    this.authService.onRegister(this.registroUsuario).then(res => {
     console.log(res)
     location.reload();
    }).catch(err=>{
      if(err.code=='auth/weak-password'){
        window.alert('La contraseña debe tener minimo 6 caracteres')
      }if(err.code=='auth/invalid-email'){
        window.alert('Correo invalido')
      }if(err.code=='auth/email-already-in-use'){
      window.alert('El correo esta siendo usado por otra cuenta')   
      }
      console.log(err)
    })
  }else{
    window.alert('Las contraseñas no considen')
  }
}
}
