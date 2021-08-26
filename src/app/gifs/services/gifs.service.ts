import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../inteface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey    : string = 'tsv8yAiS1OoJncu9UDOb4oZhkQfim8q4';
  private servicoUrl: string = 'http://api.giphy.com/v1/gifs';
  private _historial: string[] = [];

// TODO: 
  public resultados: Gif[]=[];

  get historial(){
    return [...this._historial];
  }


  constructor( private http: HttpClient ) {

    this._historial = JSON.parse(localStorage.getItem('historial') ! ) || []
    this.resultados = JSON.parse(localStorage.getItem('resultados')!  ) || []
    
      // if ( localStorage.getItem('historial') ) {
      //   this._historial = JSON.parse( localStorage.getItem('historial') ! ) || []
      // }
      
  }
  
  buscarGifs( query: string){

    query = query.trim().toLocaleLowerCase();

    if ( !this._historial.includes( query ) ){
     
      this._historial.unshift( query );
      this._historial = this._historial.splice(0,10);
  
      //Se almacena en el locasStorage aunque refresque la pagina
     localStorage.setItem( 'historial', JSON.stringify( this._historial));
     
    }

    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set( 'limit', '10' )
    .set( 'q', query );


    this.http.get< SearchGifsResponse >(`${this.servicoUrl}/search`,{params})
      .subscribe( ( resp) => {
        this.resultados = resp.data;
        localStorage.setItem( 'resultados', JSON.stringify( this.resultados));
      } )
    

  }
}
