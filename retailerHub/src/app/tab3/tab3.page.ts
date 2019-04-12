import { Component, OnInit } from "@angular/core";
import { ToastController } from "@ionic/angular";

@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"]
})
export class Tab3Page implements OnInit {
  eventSocket: WebSocket;
  events = [];

  constructor(private toastController: ToastController) {
    this.eventSocket = new WebSocket("ws://localhost:3001");
  }

  ngOnInit() {
    this.eventSocket.onmessage = event => {
      var notification = JSON.parse(event.data);
      console.log(notification);
      if ((notification.$class = "org.agrichain.crop.prodRecallRetailer")) {
        this.events.push(notification);
        this.presentToast();
      }
    };
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: "New Product Recall Case",
      duration: 3000,
      position: "top"
    });
    toast.present();
  }
}
