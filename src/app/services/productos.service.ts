import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductoInterface } from '../interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  cargando = true;
  productos: ProductoInterface[] = [];
  productosFiltrados: ProductoInterface[] = [];

  constructor(private http: HttpClient) {
    this.cargarProductos();
  }

  private cargarProductos(){

    return new Promise( (resolve, reject) => {
      this.http.get('https://portafolio-aedb5.firebaseio.com/productos_idx.json')
      .subscribe( (resp: ProductoInterface[]) => {
        this.cargando = false;
        this.productos = resp;
        resolve();
      });
    })
  }

  getProducto( id: string){
    return this.http.get(`https://portafolio-aedb5.firebaseio.com/productos/${ id }.json`);
  }

  buscarProducto( termino: string){

    if(this.productos.length === 0){
      this.cargarProductos().then( () => {
        this.filtrarProductos(termino);
      });

    }else{
      this.filtrarProductos(termino);
    }
  }

  filtrarProductos(termino: string){
    
    this.productosFiltrados = [];

    termino = termino.toLocaleLowerCase();

    this.productos.forEach(producto => {

      const tituloLower = producto.titulo.toLowerCase();

      if(producto.categoria.indexOf(termino) >= 0 || tituloLower.indexOf(termino) >= 0){
        this.productosFiltrados.push(producto);
      }
    });
  }
}
