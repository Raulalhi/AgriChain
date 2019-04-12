import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  Validators,
  FormBuilder,
  FormGroup
} from "@angular/forms";
import { DataService } from "src/app/services/data.service";
import { ToastController, ModalController } from "@ionic/angular";

@Component({
  selector: "app-productrecallpage",
  templateUrl: "./productrecallpage.page.html",
  styleUrls: ["./productrecallpage.page.scss"]
})
export class ProductrecallpagePage implements OnInit {
  productRecallForm: FormGroup;

  packetID = new FormControl("", Validators.required);
  reason = new FormControl("", Validators.required);

  constructor(
    fb: FormBuilder,
    private dataService: DataService,
    private toastController: ToastController,
    private modalController: ModalController
  ) {
    this.productRecallForm = fb.group({
      packetID: this.packetID,
      reason: this.reason
    });
  }

  ngOnInit() {}

  async presentToast() {
    const toast = await this.toastController.create({
      message: "Product Recall Case Has Been Reported",
      duration: 3000,
      position: "top"
    });
    toast.present();
  }

  reportCase() {
    return this.modalController.dismiss();
    var asset = {
      $class: "org.agrichain.crop.Batch",
      batchID: "yugh",
      storage: "",
      bultos: 60,
      batchDate: "2019-02-12T20:40:57.733Z",
      owner: "Wholesaler001",
      crop: "Crop005"
    };

    var newCase = {
      batch: "resource:org.agrichain.crop.Batch#yugh",
      weight: 0,
      storage: "Storage 5"
    };

    this.dataService
      .addAsset("processBatch", newCase)
      .toPromise()
      .then(() => {
        this.modalController.dismiss();
        this.presentToast();
      });

    // this.dataService
    //   .reportProductRecall(
    //     "resource:org.agrichain.crop.Packet#" + this.packetID.value,
    //     this.reason.value
    //   )
    //   .toPromise()
    //   .then(() => {
    //     this.presentToast();
    //     this.modalController.dismiss();
    //   });
  }
}
