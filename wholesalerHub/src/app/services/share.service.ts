import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ShareService {
  items;
  constructor() {}

  pushData(data) {
    this.items = data;
  }

  getSharedData() {
    return this.items;
  }
}
