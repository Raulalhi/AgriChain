import { Component, OnInit } from "@angular/core";
import { DataService } from "../data.service";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage implements OnInit {
  eventSocket: WebSocket;
  event: any;
  traceInfo;
  packetToBeTraced;
  google;
  
  imgs = [
    "assets/aubergine.jpg",
    "assets/cucumber.jpg",
    "assets/pepper.jpg",
    "assets/tomato.jpg",
    "assets/watermelon.jpg"
  ];

  constructor(private dataService: DataService) {
    this.eventSocket = new WebSocket("ws://localhost:3001");
  }

  ngOnInit() {
    this.eventSocket.onmessage = event => {
      this.dataService.dismissLoadng();
      this.event = JSON.parse(event.data);

      if (this.event.$class == "org.agrichain.crop.foodTrace") {
        this.traceInfo = this.event;

        var origin = new google.maps.LatLng(
          parseFloat(this.traceInfo.farm.poligono),
          parseFloat(this.traceInfo.farm.parcela)
        );

        var dit = new google.maps.LatLng(53.336632, -6.270958);

        this.traceInfo.totalkm = Math.round(
          google.maps.geometry.spherical.computeDistanceBetween(dit, origin) /
            1000
        );

        switch (this.traceInfo.packet.type) {
          case "Aubergine":
            this.traceInfo.img = this.imgs[0];
            break;
          case "Cucumber":
            this.traceInfo.img = this.imgs[1];
            break;
          case "Pepper":
            this.traceInfo.img = this.imgs[2];
            break;
          case "Tomato":
            this.traceInfo.img = this.imgs[3];
            break;
          case "Watermelon":
            this.traceInfo.img = this.imgs[4];
            break;
          default:
            console.log("NONE");
        }
      }
    };
  }

  searchingPacket(event) {
    this.packetToBeTraced = event.srcElement.value;
  }

  foodTrace() {
    var prodCall = {
      $class: "org.agrichain.crop.foodTraceFunc",
      packet: "resource:org.agrichain.crop.Packet#" + this.packetToBeTraced
    };
    this.dataService
      .callFunction("foodTraceFunc", prodCall)
      .toPromise()
      .then(data => console.log(data));
  }
}
