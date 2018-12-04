/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PacketService } from './Packet.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-packet',
  templateUrl: './Packet.component.html',
  styleUrls: ['./Packet.component.css'],
  providers: [PacketService]
})
export class PacketComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  packetID = new FormControl('', Validators.required);
  packingDate = new FormControl('', Validators.required);
  size = new FormControl('', Validators.required);
  expireDate = new FormControl('', Validators.required);
  cropID = new FormControl('', Validators.required);

  constructor(public servicePacket: PacketService, fb: FormBuilder) {
    this.myForm = fb.group({
      packetID: this.packetID,
      packingDate: this.packingDate,
      size: this.size,
      expireDate: this.expireDate,
      cropID: this.cropID
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.servicePacket.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.agrichain.crop.Packet',
      'packetID': this.packetID.value,
      'packingDate': this.packingDate.value,
      'size': this.size.value,
      'expireDate': this.expireDate.value,
      'cropID': this.cropID.value
    };

    this.myForm.setValue({
      'packetID': null,
      'packingDate': null,
      'size': null,
      'expireDate': null,
      'cropID': null
    });

    return this.servicePacket.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'packetID': null,
        'packingDate': null,
        'size': null,
        'expireDate': null,
        'cropID': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.agrichain.crop.Packet',
      'packingDate': this.packingDate.value,
      'size': this.size.value,
      'expireDate': this.expireDate.value,
      'cropID': this.cropID.value
    };

    return this.servicePacket.updateAsset(form.get('packetID').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.servicePacket.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.servicePacket.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'packetID': null,
        'packingDate': null,
        'size': null,
        'expireDate': null,
        'cropID': null
      };

      if (result.packetID) {
        formObject.packetID = result.packetID;
      } else {
        formObject.packetID = null;
      }

      if (result.packingDate) {
        formObject.packingDate = result.packingDate;
      } else {
        formObject.packingDate = null;
      }

      if (result.size) {
        formObject.size = result.size;
      } else {
        formObject.size = null;
      }

      if (result.expireDate) {
        formObject.expireDate = result.expireDate;
      } else {
        formObject.expireDate = null;
      }

      if (result.cropID) {
        formObject.cropID = result.cropID;
      } else {
        formObject.cropID = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'packetID': null,
      'packingDate': null,
      'size': null,
      'expireDate': null,
      'cropID': null
      });
  }

}
