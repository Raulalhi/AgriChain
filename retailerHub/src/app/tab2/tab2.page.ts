import { Component, OnInit } from "@angular/core";
import { DataService } from "../services/data.service";
import { Packet } from "../interfaces/packet";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"]
})
export class Tab2Page implements OnInit {
  packetToBeTraced;
  packet: Packet;
  packetsFromShipment: Packet[] = [];

  map;

  imgs = [
    "assets/aubergine.jpg",
    "assets/cucumber.jpg",
    "assets/pepper.jpg",
    "assets/tomato.jpg",
    "assets/watermelon.jpg"
  ];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.initMap();
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

  tracePacket() {
    this.dataService
      .getById("Packet", this.packetToBeTraced)
      .toPromise()
      .then((data: Packet) => {
        this.packet = data;

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
          .callQuery("queries/getPacketsFromShipment", this.packet.shipment)
          .toPromise()
          .then((data: Packet[]) => {
            console.log(data);
            this.packetsFromShipment = data;
          });
      });
  }
}
