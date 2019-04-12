import { Component, OnInit } from "@angular/core";
import { DataService } from "../services/data.service";
import { Packet } from "../interfaces/packet";
import { AlertController, ModalController } from "@ionic/angular";
import { ProductrecallpagePage } from "../pages/productrecallpage/productrecallpage.page";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"]
})
export class Tab2Page implements OnInit {
  packetToBeTraced;
  packet: Packet;
  packetsFromShipment: Packet[] = [];
  packetBatch;
  packetCrop;
  packetFarm;
  packetTreatments;
  map;
  form;

  imgs = [
    "assets/aubergine.jpg",
    "assets/cucumber.jpg",
    "assets/pepper.jpg",
    "assets/tomato.jpg",
    "assets/watermelon.jpg"
  ];

  constructor(
    private dataService: DataService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.initMap();
    form = true;
  }

  initMap() {
    const mapElement: HTMLElement = document.getElementById("map");
    var dit = { lat: 53.336632, lng: -6.270958 };

    this.map = new google.maps.Map(mapElement, {
      center: dit,
      zoom: 8
    });
  }

  searchingPacket(event) {
    this.packetToBeTraced = event.srcElement.value;
  }

  parseString(string) {
    const index = string.indexOf("#") + 1;
    var parsedString = decodeURI(string.slice(index));
    return parsedString;
  }

  tracePacket() {
    this.dataService
      .getById("Packet", this.packetToBeTraced)
      .toPromise()
      .then((data: Packet) => {
        this.packet = data;
        this.packet.batchID = this.parseString(data.batchID);
        this.packet.shipment = this.parseString(this.packet.shipment);

        switch (this.packet.type) {
          case "Aubergine":
            this.packet.img = this.imgs[0];
            break;
          case "Cucumber":
            this.packet.img = this.imgs[1];
            break;
          case "Pepper":
            this.packet.img = this.imgs[2];
            break;
          case "Tomato":
            this.packet.img = this.imgs[3];
            break;
          case "Watermelon":
            this.packet.img = this.imgs[4];
            break;
          default:
            console.log("NONE");
        }

        this.dataService
          .callQuery(
            "queries/getPacketsFromShipment",
            "shipment",
            this.packet.shipment
          )
          .toPromise()
          .then((data: Packet[]) => {
            console.log(data);
            this.packetsFromShipment = data;
          });

        this.dataService
          .getById("Batch", this.packet.batchID)
          .toPromise()
          .then(data => {
            this.packetBatch = data;
            this.packetBatch.crop = this.parseString(this.packetBatch.crop);

            this.dataService
              .getById("Crop", this.packetBatch.crop)
              .toPromise()
              .then(data => {
                this.packetCrop = data;
                this.packetCrop.farm = this.parseString(this.packetCrop.farm);
                this.packetTreatments = this.packetCrop.treatments;

                this.dataService
                  .getById("Farm", this.packetCrop.farm)
                  .toPromise()
                  .then(data => {
                    this.packetFarm = data;
                    this.packetFarm.farmerID = this.parseString(
                      this.packetFarm.farmerID
                    );

                    var position = {
                      lat: parseFloat(this.packetFarm.poligono),
                      lng: parseFloat(this.packetFarm.parcela)
                    };
                    let pin = new google.maps.Marker({
                      position: position,
                      map: this.map
                    });

                    this.map.setCenter(position);
                  });
              });
          });
      });
  }

  async presentModal() {
    // const modal = await this.modalController.create({
    //   component: ProductrecallpagePage,
    //   cssClass: "caseModal"
    // });
    // await modal.present();
    this.form = true;
    console.log(this.form);
  }

  prodCase() {}
}
