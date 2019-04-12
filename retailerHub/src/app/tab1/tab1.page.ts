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
  shipments = [];
  arrivedshipments;
  packets;
  pkts;
  locations;
  notAllocatedPackets = [];
  AllocatedPackets = [];
  packetsToBeAllocated = [];

  imgs = [
    "assets/aubergine.jpg",
    "assets/cucumber.jpg",
    "assets/pepper.jpg",
    "assets/tomato.jpg",
    "assets/watermelon.jpg"
  ];

  constructor(
    private dataService: DataService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    // this.dataService
    //   .getData("Shipment")
    //   .toPromise()
    //   .then(data => {
    //     var shpmt = data;

    //     shpmt.forEach(el => {
    //       if (el.status == "In Transit") {
    //         this.shipments.push(el);
    //       }
    //     });

    //     this.shipments.forEach(shipment => {
    //       shipment.seller = this.parseString(shipment.seller);
    //     });
    //   });

    this.dataService
      .getData("Shipment")
      .toPromise()
      .then(data => {
        this.arrivedshipments = data;
        this.arrivedshipments.forEach(shipment => {
          if (shipment.status == "Arrived") {
            this.dataService
              .callQuery(
                "/queries/getPacketsFromShipment",
                "shipment",
                "resource:org.agrichain.crop.Shipment#" + shipment.shipmentID
              )
              .toPromise()
              .then(data => {
                this.pkts = data;
                console.log(this.pkts);
                this.pkts.forEach(x => {
                  switch (x.type) {
                    case "Aubergine":
                      x.img = this.imgs[0];
                      break;
                    case "Cucumber":
                      x.img = this.imgs[1];
                      break;
                    case "Pepper":
                      x.img = this.imgs[2];
                      break;
                    case "Tomato":
                      x.img = this.imgs[3];
                      break;
                    case "Watermelon":
                      x.img = this.imgs[4];
                      break;
                    default:
                      console.log("NONE");
                  }
                  if (x.finalLocation == "") {
                    this.notAllocatedPackets.push(x);
                  } else {
                    this.AllocatedPackets.push(x);
                  }
                });
              });
          } else {
            this.parseString(shipment.seller);
            this.shipments.push(shipment);
          }
        });
      });

    // var filter = { where: { finalLocation: "" } };
    // this.dataService
    //   .getData("Packet", filter)
    //   .toPromise()
    //   .then(data => {
    //     console.log(data);
    //     this.notAllocatedPackets = data;
    //   });
    this.locations = [
      "Kevin Street Store",
      "Ringsend Store",
      "Grafton Street Store"
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
      .getData("Packet")
      .toPromise()
      .then(data => {
        this.packets = data;
        console.log(this.packets);
        console.log(shipment.shipmentID);

        this.packets.forEach(packet => {
          if (
            packet.shipment ==
            "resource:org.agrichain.crop.Shipment#" + shipment.shipmentID
          ) {
            console.log("hehe");
            this.notAllocatedPackets.push(packet);
          }
        });
      });
  }

  filterPackets(store) {
    return this.AllocatedPackets.filter(p => p.finalLocation === store);
  }

  optionsFn(item) {
    console.log(item);
  }

  allocatePacket(packet) {
    this.packetsToBeAllocated.push(packet);
    this.AllocatedPackets.push(packet);
    console.log(this.packetsToBeAllocated);
    var index = this.notAllocatedPackets.indexOf(packet);
    if (index > -1) {
      this.notAllocatedPackets.splice(index, 1);
    }
  }

  allocatePackets() {
    this.packetsToBeAllocated.forEach(p => delete p.img);
    this.dataService
      .callFunction("updatePackets", this.packetsToBeAllocated)
      .toPromise()
      .then(data => {
        this.presentToast("Packets Allocated");
        this.packetsToBeAllocated = [];
      });
  }
}
