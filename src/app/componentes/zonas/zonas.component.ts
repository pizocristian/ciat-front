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
  selector: 'app-orders',
  templateUrl: './zonas.component.html',
  styleUrls: ['./zonas.component.scss'],
  providers: [MessageService]
})
export class OrdersComponent implements OnInit {
  products: any = [];
  categorias: any[] = [];
  tallas: any[] = [];
  categoria: any;
  talla: any;
  image: any;
  nombre: string = '';
  cantidad: number = 0;


  public mensajeArchivo = 'No hay un archivo seleccionado';
  public datosFormulario = new FormData();
  public nombreArchivo = '';
  public URLPublica = '';
  public porcentaje = 0;
  public finalizado = false;


  product = {
    id: 0, category: '', code: 0, description: '', image: '', inventoryStatus: 'DISPONIBLE',
    longDescription: '', name: '', price: 0, quantity: 0, rating: 5, tallas: ''
  };
  submitted = false;
  productDialog = false;


  selectedProduct: any;

  iconos: any;
  icono: any;
  plaga:any;
  plagas: any[] = [];
  zonas: any;



  constructor(private messageService: MessageService, private firestoreService: FirestoreService, private firebaseStorage: FirebaseStorageService) {

    this.obtenerZona();
    this.obtenerPlaga();

  }

  async obtenerZona() {
    const cookies = new Cookies();
    const headers = {
      authorization: 'Bearer ' + cookies.get('token')
    }

    await this.firestoreService.getZonas(headers).then(res => {
      this.zonas = res.data;

    });
  

  }

  async obtenerPlaga() {
    const cookies = new Cookies();
    const headers = {
      authorization: 'Bearer ' + cookies.get('token')
    }

    await this.firestoreService.getPlaga(headers).then(res => {
      var contenedorPlaga = res.data;

      contenedorPlaga.forEach((data: any) => {
        this.plagas.push({"name":''+data.nombre_plaga+'',"code":''+data.id_plaga+''});
      })

    });
    

  }

  onRowSelect(event: any) {
    console.log(event.data);
    this.icono = event.data.icon;
    this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: event.data.name });
  }

  onUpload(event: any) {
    for (let file of event.files) {
      this.image.push(file);
    }
    console.log(this.image);

  }

  public archivoForm = new FormGroup({
    archivo: new FormControl(null, Validators.required),
  });

  //Evento que se gatilla cuando el input de tipo archivo cambia
  public cambioArchivo(event: any) {
    console.log(event)
    if (event.files.length > 0) {
      for (let i = 0; i < event.files.length; i++) {
        this.mensajeArchivo = `Archivo preparado: ${event.files[i].name}`;
        this.nombreArchivo = event.files[i].name;
        this.datosFormulario.delete('archivo');
        this.datosFormulario.append('archivo', event.files[i], event.files[i].name)
      }
    } else {
      this.mensajeArchivo = 'No hay un archivo seleccionado';
    }
  }

  //Sube el archivo a Cloud Storage
  public subirArchivo() {
    let archivo = this.datosFormulario.get('archivo');
    let tarea = this.firebaseStorage.tareaCloudStorage(this.nombreArchivo, archivo).then(res => {
      this.firebaseStorage.referenciaCloudStorage(this.nombreArchivo).getDownloadURL().subscribe((resultado: any) => {
        this.URLPublica = resultado;
      })
      let referencia = this.firebaseStorage.referenciaCloudStorage(this.nombreArchivo);

      referencia.getDownloadURL().subscribe((URL) => {
        this.URLPublica = URL;
        this.product.image = URL;
        console.log(this.image)
      });
    });





  }

  ngOnInit(): void {


  }

  openNew() {
    this.product = {
      id: this.products.length + 1, category: '', code: this.products.length + 1, description: '', image: '', inventoryStatus: 'DISPONIBLE',
      longDescription: '', name: '', price: 0, quantity: 0, rating: 5, tallas: ''
    };
    this.submitted = false;
    this.productDialog = true;
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
    this.product = {
      id: 0, category: '', code: 0, description: '', image: '', inventoryStatus: 'DISPONIBLE',
      longDescription: '', name: '', price: 0, quantity: 0, rating: 5, tallas: ''
    };
  }

  saveZona() {
    var zona = {
      cantidad_palmas:  this.cantidad,
      id_plaga: this.plaga.code,
      id_zona: 0,
      nombre_zona: this.nombre,
      nombre_plaga: this.plaga.name
    }

    const cookies = new Cookies();
    const headers = {
      authorization: 'Bearer ' + cookies.get('token')
    }

    this.firestoreService.postZona(zona, headers).then(res => {
      console.log(res);
      this.productDialog = false;
      this.cantidad = 0;
      this.nombre = '';
      this.messageService.add({ severity: 'success', summary: 'Genial', detail: 'Se creo la zona exitosamente', life: 5000 });
      this.obtenerZona()

    });

  }

}

