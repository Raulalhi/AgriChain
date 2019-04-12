import { Component, OnInit } from "@angular/core";
import { Batch } from "../interfaces/batch";
import { DataService } from "../services/data.service";
import { ShareService } from "../services/share.service";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";
import { Packet } from "../interfaces/packet";
import { ToastController } from "@ionic/angular";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"]
})
export class Tab2Page implements OnInit {
  newPacketForm: FormGroup;
  allBatches: Batch[];
  searchedBatch: Batch;
  asset: Packet;
  packets;
  totalPackets: number;
  packetsToBeCreated: Packet[] = [];

  //packingDate = new FormControl("", Validators.required);
  size = new FormControl("", Validators.required);
  expireDate = new FormControl("", Validators.required);
  //batch = new FormControl("", Validators.required);

  constructor(
    private shareService: ShareService,
    private dataService: DataService,
    private toastController: ToastController,
    fb: FormBuilder
  ) {
    this.newPacketForm = fb.group({
      size: this.size,
      expireDate: this.expireDate
    });
  }

  ngOnInit() {
    this.allBatches = this.shareService.getSharedData();

    if (!this.allBatches) {
      this.dataService
        .getData("Batch")
        .toPromise()
        .then(data => (this.allBatches = data));
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: "Packets Created",
      duration: 3000,
      position: "top"
    });
    toast.present();
  }

  onBatchSearched(event) {
    this.allBatches.forEach(batch => {
      if (batch.batchID == event.srcElement.value) {
        this.searchedBatch = batch;

        this.dataService
          .callQuery(
            "queries/getPacketsFromBatch",
            "resource:org.agrichain.crop.Batch#" + this.searchedBatch.batchID
          )
          .toPromise()
          .then(data => (this.packets = data));
      }
    });
  }

  onSizeChange() {
    var kilosEntered: number = parseInt(this.size.value);
    var batchWeight: number = this.searchedBatch.weight;
    this.totalPackets = Math.floor(batchWeight / kilosEntered);

    if (isNaN(this.totalPackets)) this.totalPackets = 0;
  }

  addPackets() {
    var newWeight =
      this.searchedBatch.weight - this.totalPackets * this.size.value;

    if (newWeight < this.size.value) {
      this.searchedBatch.weight = 0;
      this.searchedBatch.used = true;
    } else {
      this.searchedBatch.weight = newWeight;
    }

    for (var i = 0; i < this.totalPackets; i++) {
      this.asset = {
        $class: "org.agrichain.crop.Packet",
        packetID: this.dataService.generateUUID(),
        size: this.size.value,
        packingDate: Date.now(),
        expireDate: this.expireDate.value,
        owner: this.searchedBatch.owner,
        organic: this.searchedBatch.crop.organic ? true : false,
        used: false,
        type: this.searchedBatch.crop.type,
        batchID: this.searchedBatch.batchID,
        finalLocation: ""
      };

      this.packetsToBeCreated.push(this.asset);
    }

    var updateBatch = {
      $class: "org.agrichain.crop.Batch",
      batchID: this.searchedBatch.batchID,
      storage: this.searchedBatch.storage,
      weight: this.searchedBatch.weight,
      batchDate: this.searchedBatch.batchDate,
      bultos: this.searchedBatch.bultos,
      owner: this.searchedBatch.owner,
      used: this.searchedBatch.used,
      crop: this.searchedBatch.crop.cropID
    };

    this.dataService
      .addAsset("Packet", this.packetsToBeCreated)
      .toPromise()
      .then(() => {
        this.dataService
          .updateAsset("Batch", this.searchedBatch.batchID, updateBatch)
          .toPromise()
          .then(() => {
            this.presentToast();
            this.ngOnInit();
          });
      });
  }
}
