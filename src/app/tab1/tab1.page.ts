import { Component, inject, input } from '@angular/core';
import { Firestore, collection, addDoc, CollectionReference, collectionData, updateDoc, doc, deleteDoc } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { PhotosService } from '../photoServices/photos.service';
import { UserPhoto } from '../services/photo.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {

  b0 = -7.8979
  b1 = 0.0399
  b2 = 0.0698
  e = Math.exp(1)
  cuttOff = 0.3109



  photo: UserPhoto[] = [];
  nombreUser!: string;
  private firestore: Firestore = inject(Firestore);
  test$!: Observable<Test[]>;
  constructor(private alertController: AlertController, private photoService: PhotosService) {
    const userColl = collection(this.firestore, "test");
    this.test$ = collectionData(userColl, {idField: "uid"}) as Observable<Test[]>;
    this.setNameShared();
  }

  
  crear(Titulo: string, Autor: string){
    addDoc(collection(this.firestore, "test"), {Titulo: Titulo,Autor: Autor});
    console.log(this.test$);
  }

  update(Titulo: string, Autor: string, uid: any){
    let refDoc = doc(this.firestore, "test", uid);
    updateDoc(refDoc, {Titulo: Titulo, Autor: Autor});
  }

  delete(uid: any){
    let refDoc = doc(this.firestore, "test", uid);
    deleteDoc(refDoc);
  }

  async showCreateAlert(){
    let alert = await this.alertController.create({
      header: "Agregar Libro",
      inputs: [
        {
          name: "Titulo",
          placeholder: "ingrese un titulo",
          type: "text"
        },
        {
          id: "Autor",
          name: "Autor",
          placeholder: "ingrese el autor",
          type: "text"
        }
      ],
      buttons: [
        {
          text: "Agregar",
          handler: data => {
            let titulo = data.Titulo;
            let autor = data.Autor;

            this.crear(titulo,autor);
          }
        }
      ]
    });
    alert.present();
  }




  async showUpdateAlert(info: any){
    let alert = await this.alertController.create({
      header: "Editar Libro",
      inputs: [
        {
          name: "Titulo",
          placeholder: info.Titulo,
          value: info.Titulo,
          type: 'text'
        },
        {
          name: "Autor",
          placeholder: info.Autor,
          type: "text",
          value: info.Autor
        }
      ],
      buttons: [
        {
          text: "editar",
          handler: data => {
            let titulo = data.Titulo;
            let autor = data.Autor;
            this.update(titulo,autor,info.uid);
          }
        }
      ]
    })
    await alert.present();
    
  }

  ngOnInit(){
    this.photoService.sharedNombre.subscribe(nombreUser => this.nombreUser = nombreUser);
    this.photoService.sharedPhoto.subscribe(photo => this.photo = photo);
    console.log(this.photo)
  }

  setNameShared(){
    this.photoService.nextNombre("Ingresa tu nombre en Tab 2");
  }

}


export interface Test {
  Titulo: String,
  Autor: String,
  uid: String
}
