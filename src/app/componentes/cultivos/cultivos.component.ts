import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../services/apiService/api.service';
import { PrimeNGConfig } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { SelectItem } from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseStorageService } from '../../firebase-storage.service';
import Cookies from 'universal-cookie/es6';

@Component({
  selector: 'app-products',
  templateUrl: './cultivos.component.html',
  styleUrls: ['./cultivos.component.scss'],
  providers: [MessageService]
})
export class ProductsComponent implements OnInit {
  products: any = [];

  zonas: any = [];


  constructor(private messageService: MessageService, private firestoreService: FirestoreService, private firebaseStorage: FirebaseStorageService) {
    this.obtenerZonas();

  }

  ngOnInit() {
  }

  async obtenerZonas() {
    const cookies = new Cookies();
    const headers = {
      authorization: 'Bearer ' + cookies.get('token')
    }
    await this.firestoreService.getZonas(headers).then(res => {
      this.zonas= res.data;
    })

  }

}

