import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../services/apiService/api.service';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { SelectItem } from 'primeng/api';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseStorageService } from '../../firebase-storage.service';
import Cookies from 'universal-cookie/es6';

@Component({
  selector: 'app-setting',
  templateUrl: './plaga.component.html',
  styleUrls: ['./plaga.component.scss'],
  providers: [MessageService]
})
export class SettingComponent implements OnInit {
  products: any = [];
  categorias: any[] = [];
  tallas: any[] = [];
  categoria: any;
  talla: any;
  image: any;
  nombre: string = '';
   

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
  icono:any;
  plaga:any;



  constructor(private confirmationService: ConfirmationService, private messageService: MessageService, private firestoreService: FirestoreService, private firebaseStorage: FirebaseStorageService) {

    this.obtenerPlaga();

   
  }

  async obtenerPlaga(){
    const cookies = new Cookies();
    const headers = {
      authorization:'Bearer '+ cookies.get('token')
    } 
    
    await this.firestoreService.getPlaga(headers).then(res => {
      this.plaga = res.data;    
     
    });
    

  }

  onRowSelect(event: any) {
    console.log(event.data);
    this.icono =event.data.icon;
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

  savePlaga() {
    var plaga = {
      id_plaga: 0,
      nombre_plaga: this.nombre
    }
    
const cookies = new Cookies();
    const headers = {
      authorization:'Bearer '+ cookies.get('token')
    } 
    
    this.firestoreService.postPlaga(plaga, headers).then(res => {
      console.log(res);
      this.productDialog = false;
      this.nombre = '';
      this.messageService.add({ severity: 'success', summary: 'Genial', detail: 'Se creo la plaga exitosamente', life: 5000  });
      this.obtenerPlaga();
    });

  }

  deleteZona(id: any) {
   
    this.confirmationService.confirm({
        message: 'Tu quieres elinar la plaga?',
        accept: () => {
          const cookies = new Cookies();
          const headers = {
            authorization: 'Bearer ' + cookies.get('token')
          }
          this.firestoreService.deletePlaga(id, headers).then(res => {
            this.messageService.add({ severity: 'success', summary: 'Genial', detail: 'Se elimino la plaga exitosamente', life: 5000 });
            this.obtenerPlaga();
      
          }).catch(err => {
            this.messageService.add({ severity: 'warn', summary: 'Genial', detail: 'Error al eliminar la plaga', life: 5000 });
          })
        }
    });
}

}

