import { Component, OnInit, ViewChild } from "@angular/core";
import { DataService } from "../services/data.service";
import { Packet } from "../interfaces/packet";
import { Chart } from "chart.js";
import { map } from "rxjs/operators";

declare var google;

@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"]
})
export class Tab3Page implements OnInit {
  @ViewChild("lineCanvas") lineCanvas;

  errorMessage;
  map;
  lineChart: any;

  shipmentIdForSearch;
  shipment;
  packets: Packet[] = [];
  packet;
  temperatures;
  positions = [];
  trackingPath;

  eventSocket: WebSocket;
  events = [];

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
    this.initMap();

    this.eventSocket.onmessage = event => {
      console.log(event.data);
      var notification = JSON.parse(event.data);

      if (
        (notification.$class = "org.agrichain.crop.shipmentUpdate") &&
        notification.shipment ==
          "resource:org.agrichain.crop.Shipment#" + this.shipment.shipmentID
      ) {
        var coords = notification.location.split(",");
        var position = {
          lat: parseFloat(coords[0]),
          lng: parseFloat(coords[1])
        };
        let pin = new google.maps.Marker({
          position: position,
          map: this.map
        });

        this.map.setCenter(position);

        var path = this.trackingPath.getPath();
        path.push(new google.maps.LatLng(position.lat, position.lng));
        this.trackingPath.setPath(path);
        this.positions.push(position);

        this.temperatures.push(notification.temperature);
        this.lineChart.data.labels.push("Position " + this.temperatures.length);
        this.lineChart.data.datasets[0].data.push(notification.temperature);
        this.lineChart.update();
      }

      this.events.push(notification);
      console.log(event);
    };
  }

  initMap() {
    const mapElement: HTMLElement = document.getElementById("map");
    var dit = { lat: 53.336632, lng: -6.270958 };

    this.map = new google.maps.Map(mapElement, {
      center: dit,
      zoom: 8
    });
  }

  searchingShipment(event) {
    this.shipmentIdForSearch = event.srcElement.value;
  }

  searchShipment() {
    this.dataService
      .getData("Shipment")
      .toPromise()
      .then(data => {
        data.forEach(shipment => {
          if (shipment.shipmentID == this.shipmentIdForSearch) {
            this.shipment = shipment;

            this.temperatures = this.shipment.temperatures;
            this.placeMarkers(shipment.locations);
            this.displayColdChain();

            this.shipment.packets.forEach(packet => {
              const index = packet.indexOf("#") + 1;
              var searchPacket = decodeURI(packet.slice(index));

              this.dataService
                .getData("Packet/" + searchPacket)
                .toPromise()
                .then(data => {
                  this.packet = data;
                  console.log(this.packet);

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

                  this.packets.push(this.packet);
                });
            });
          }
        });
      })
      .catch(error => {
        if (error === "Server error") {
          this.errorMessage =
            "Could not connect to REST server. Please check your configuration details";
        } else if (error === "404 - Not Found") {
          this.errorMessage =
            "404 - Could not find API route. Please check your available APIs.";
        } else {
          this.errorMessage = error;
          console.log(error);
        }
      });
  }

  placeMarkers(locations) {
    locations.forEach(location => {
      var coords = location.split(",");

      var position = { lat: parseFloat(coords[0]), lng: parseFloat(coords[1]) };

      this.positions.push(position);

      let pin = new google.maps.Marker({
        position: position,
        map: this.map
      });
    });

    this.map.setCenter(this.positions[0]);
    this.map.setZoom(8);

    this.trackingPath = new google.maps.Polyline({
      path: this.positions,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    this.trackingPath.setMap(this.map);
  }

  displayColdChain() {
    var labels = [];
    for (var i = 0; i < this.temperatures.length; i++) {
      labels.push("Position " + (i + 1));
    }
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Temperature",
            fill: false,
            lineTension: 0.1,
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
            borderCapStyle: "butt",
            maintainAspectRatio: false,
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 2,
            pointHitRadius: 15,
            data: this.temperatures,
            spanGaps: true
          }
        ]
      }
    });
  }
}
