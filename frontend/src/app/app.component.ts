import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  images = '';
  imgURL ='assets/noimage.png';
  imagenes:any = [];
  nombre: string = '';
  descripcion: string = '';
  precio: number = 0;
  ubicacion: string = '';
  metraje: number = 0;
  tipo_venta: string = '';
  tipo_inmueble: string = '';

  constructor(private http:HttpClient){}

  ngOnInit():void {
    this.mostrarImg();
    }

    selectImage(event:any) {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        const reader = new FileReader();
         reader.readAsDataURL(file);
         reader.onload = (event: any)=>{
           this.imgURL = event.target.result;
         }
        this.images = file;
      }



      function selectImage() {
        throw new Error('Function not implemented.');
    }
  }
  onSubmit(){
    const formData = new FormData();
    formData.append('nombre', this.nombre);
    formData.append('descripcion', this.descripcion);
    formData.append('precio', this.precio.toString());
    formData.append('ubicacion', this.ubicacion);
    formData.append('metraje', this.metraje.toString());
    formData.append('tipo_venta', this.tipo_venta);
    formData.append('tipo_inmueble', this.tipo_inmueble);
    formData.append('file',this.images);
    this.http.post<any>('http://localhost:3000/file', formData).subscribe(
      (res) => console.log(res,  Swal.fire({
                icon: 'success',
                title: 'Inmueble cargado!!',
                text: 'El Inmueble se subio correctamente!'
                }).then((result) => {
                            if (result) {
                                       location.reload();
                          }
               })
         ),
      (err) => Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'Parece que no subio nada!!'
                    })
    );
   this.imgURL = '/assets/noimage.png';

    }

    mostrarImg(){
      this.http.get<any>('http://localhost:3000/imagen').subscribe(res=>{
       this.imagenes=res;
       const reader = new FileReader();
       reader.onload = this.imagenes;
       console.log(this.imagenes);
      });



    }

    deleteImg(id: any) {
      Swal.fire({
        icon: 'info',
        title: '¿Desea eliminar el inmueble?',
        showCancelButton: true,
        confirmButtonText: `Eliminar`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.http.delete<any>(`http://localhost:3000/delete/${id}`).subscribe(res => {
            console.log(res);
            location.reload();
          });
        }
      });
    }


  }

