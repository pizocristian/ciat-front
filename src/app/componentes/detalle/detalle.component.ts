import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from 'src/app/services/apiService/api.service';
import Cookies from 'universal-cookie/es6';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  zona:any;
  id: any;
  cantidad: any;

  constructor(private firestoreService: FirestoreService,  activatedRoute: ActivatedRoute) { 
    this.id = activatedRoute.snapshot.paramMap.get('id');
    const cookies = new Cookies();
    const headers = {
      authorization: 'Bearer ' + cookies.get('token')
    }

     this.firestoreService.getZonaId(this.id, headers).then(res => {
      this.zona = res.data;   
    });

    this.firestoreService.getZonas( headers).then(res => {       
      this.cantidad = res.data.length;  
    });
  }
  

  ngOnInit(): void {

    
   
  }

}
