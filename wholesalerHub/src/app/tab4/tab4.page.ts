import { Component, OnInit } from "@angular/core";
import { DataService } from "../services/data.service";
import { ShareService } from "../services/share.service";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray
} from "@angular/forms";
import { ToastController } from "@ionic/angular";

@Component({
  selector: "app-tab4",
  templateUrl: "./tab4.page.html",
  styleUrls: ["./tab4.page.scss"]
})
export class Tab4Page {
  shipments;
  clients;
  products;
  asset;
  productsPerShipment = [0];
  isOrganic: Boolean = false;

  newShipmentForm: FormGroup;

  shipclient = new FormControl("", Validators.required);
  productLine: FormArray;

  constructor(
    private dataService: DataService,
    private shareService: ShareService,
    private toastController: ToastController,
    private fb: FormBuilder
  ) {
    this.newShipmentForm = fb.group({
      client: this.shipclient,
      productLine: fb.array([this.createProductLine()])
    });
  }

  ionViewWillEnter() {
    this.dataService
      .getData("Shipment")
      .toPromise()
      .then(data => {
        data.forEach(shipment => {
          var index = shipment.buyer.indexOf("#") + 1;
          shipment.buyer = decodeURI(shipment.buyer.slice(index));
        });

        this.shipments = data;
      });

    this.products = this.shareService
      .getSharedData()
      .map(batches => batches.crop.type)
      .filter((value, index, self) => self.indexOf(value) === index);

    console.log(this.products);

    this.dataService
      .getData("Retailer")
      .toPromise()
      .then(
        data =>
          (this.clients = data
            .map(retailer => retailer.Company)
            .filter((value, index, self) => self.indexOf(value) === index))
      );
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: "Packets Added to Shipment!",
      duration: 3000,
      position: "top"
    });
    toast.present();
  }

  addProductLine() {
    this.productLine = this.newShipmentForm.get("productLine") as FormArray;
    this.productLine.push(this.createProductLine());
    this.productsPerShipment.push(this.productsPerShipment.length);
  }

  removeProductLine(index) {
    if (index > -1) {
      this.productsPerShipment.splice(index, 1);
      this.productLine.removeAt(index);
    }
  }

  toggleCheckbox() {
    this.newShipmentForm.value.productLine.organic = !this.newShipmentForm.value
      .productLine.organic;
  }

  createProductLine() {
    return this.fb.group({
      productType: "",
      organic: "",
      amount: ""
    });
  }

  createShipment(shipment) {
    var products: String[] = [];
    var organic: Boolean[] = [];
    var amount: number[] = [];

    this.newShipmentForm.value.productLine.forEach(line => {
      products.push(line.productType);
      organic.push(line.organic);
      amount.push(line.amount);
    });

    this.asset = {
      $class: "org.agrichain.crop.Shipment",
      shipmentID: this.dataService.generateUUID(),
      shippedDate: Date.now(),
      locations: [],
      packets: [],
      status: "In Transit",
      seller: "Wholesaler001",
      buyer: this.shipclient.value
    };

    this.dataService
      .callFunction("packetsForShipment", this.asset, products, organic, amount)
      .toPromise()
      .then(data => {
        this.presentToast();
        this.ionViewWillEnter();
      });
  }
}
