import { Component, OnInit } from "@angular/core";
import { DataService } from "../services/data.service";
import { ToastController } from "@ionic/angular";
import { Packet } from "../interfaces/packet";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"]
})
export class Tab1Page implements OnInit {
  shipments;
  packets;
  locations;
  notAllocatedPackets;
  packetsToBeAllocated = [];

  constructor(
    private dataService: DataService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.dataService
      .getData("Shipment", { where: { status: "In Transit" } })
      .toPromise()
      .then(data => {
        this.shipments = data;

        this.shipments.forEach(shipment => {
          shipment.seller = this.parseString(shipment.seller);
        });
      });

    var filter = { where: { finalLocation: "" } };
    console.log(filter);
    this.dataService
      .getData("Packet", filter)
      .toPromise()
      .then(data => {
        this.notAllocatedPackets = data;
      });

    this.locations = [
      "Ringsend Store",
      "Grafton Street Store",
      "Kevin Street Store"
    ];
  }

  parseString(string) {
    const index = string.indexOf("#") + 1;
    var parsedString = decodeURI(string.slice(index));
    return parsedString;
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: "top"
    });
    toast.present();
  }

  shipmentArrived(shipment) {
    console.log(shipment);

    shipment.status = "Arrived";
    shipment.arrivalDate = Date.now();

    var index = this.shipments.indexOf(shipment);
    if (index > -1) {
      this.shipments.splice(index, 1);
    }

    this.dataService
      .updateAsset("Shipment", shipment.shipmentID, shipment)
      .toPromise()
      .then(res => this.presentToast("Please Allocate New Packets"));

    this.dataService
      .getData("Packet", {
        where: {
          shipment:
            "resource:org.agrichain.crop.Shipment#" + shipment.shipmentID
        }
      })
      .toPromise()
      .then(data => {
        this.packets = data;
        console.log(this.packets);

        this.packets.forEach(packet => {
          this.notAllocatedPackets.push(packet);
        });
      });
  }

  filterPackets(store) {
    return this.notAllocatedPackets.filter(p => p.finalLocation === store);
  }

  optionsFn(item) {
    console.log(item);
  }

  allocatePacket(packet) {
    this.packetsToBeAllocated.push(packet);
    console.log(this.packetsToBeAllocated);
  }

  allocatePackets() {
    this.dataService
      .callFunction("updatePackets", this.packetsToBeAllocated)
      .toPromise()
      .then(data => {
        this.presentToast("Packets Allocated");
        this.packetsToBeAllocated = [];
      });
  }
}
