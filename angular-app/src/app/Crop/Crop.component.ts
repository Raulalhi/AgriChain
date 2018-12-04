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
import { CropService } from './Crop.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-crop',
  templateUrl: './Crop.component.html',
  styleUrls: ['./Crop.component.css'],
  providers: [CropService]
})
export class CropComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  cropID = new FormControl('', Validators.required);
  type = new FormControl('', Validators.required);
  organic = new FormControl('', Validators.required);
  seedManufacturer = new FormControl('', Validators.required);
  plantingDate = new FormControl('', Validators.required);
  pickupDate = new FormControl('', Validators.required);
  participantID = new FormControl('', Validators.required);
  farm = new FormControl('', Validators.required);
  treatments = new FormControl('', Validators.required);

  constructor(public serviceCrop: CropService, fb: FormBuilder) {
    this.myForm = fb.group({
      cropID: this.cropID,
      type: this.type,
      organic: this.organic,
      seedManufacturer: this.seedManufacturer,
      plantingDate: this.plantingDate,
      pickupDate: this.pickupDate,
      participantID: this.participantID,
      farm: this.farm,
      treatments: this.treatments
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceCrop.getAll()
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
      $class: 'org.agrichain.crop.Crop',
      'cropID': this.cropID.value,
      'type': this.type.value,
      'organic': this.organic.value,
      'seedManufacturer': this.seedManufacturer.value,
      'plantingDate': this.plantingDate.value,
      'pickupDate': this.pickupDate.value,
      'participantID': this.participantID.value,
      'farm': this.farm.value,
      'treatments': this.treatments.value
    };

    this.myForm.setValue({
      'cropID': null,
      'type': null,
      'organic': null,
      'seedManufacturer': null,
      'plantingDate': null,
      'pickupDate': null,
      'participantID': null,
      'farm': null,
      'treatments': null
    });

    return this.serviceCrop.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'cropID': null,
        'type': null,
        'organic': null,
        'seedManufacturer': null,
        'plantingDate': null,
        'pickupDate': null,
        'participantID': null,
        'farm': null,
        'treatments': null
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
      $class: 'org.agrichain.crop.Crop',
      'type': this.type.value,
      'organic': this.organic.value,
      'seedManufacturer': this.seedManufacturer.value,
      'plantingDate': this.plantingDate.value,
      'pickupDate': this.pickupDate.value,
      'participantID': this.participantID.value,
      'farm': this.farm.value,
      'treatments': this.treatments.value
    };

    return this.serviceCrop.updateAsset(form.get('cropID').value, this.asset)
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

    return this.serviceCrop.deleteAsset(this.currentId)
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

    return this.serviceCrop.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'cropID': null,
        'type': null,
        'organic': null,
        'seedManufacturer': null,
        'plantingDate': null,
        'pickupDate': null,
        'participantID': null,
        'farm': null,
        'treatments': null
      };

      if (result.cropID) {
        formObject.cropID = result.cropID;
      } else {
        formObject.cropID = null;
      }

      if (result.type) {
        formObject.type = result.type;
      } else {
        formObject.type = null;
      }

      if (result.organic) {
        formObject.organic = result.organic;
      } else {
        formObject.organic = null;
      }

      if (result.seedManufacturer) {
        formObject.seedManufacturer = result.seedManufacturer;
      } else {
        formObject.seedManufacturer = null;
      }

      if (result.plantingDate) {
        formObject.plantingDate = result.plantingDate;
      } else {
        formObject.plantingDate = null;
      }

      if (result.pickupDate) {
        formObject.pickupDate = result.pickupDate;
      } else {
        formObject.pickupDate = null;
      }

      if (result.participantID) {
        formObject.participantID = result.participantID;
      } else {
        formObject.participantID = null;
      }

      if (result.farm) {
        formObject.farm = result.farm;
      } else {
        formObject.farm = null;
      }

      if (result.treatments) {
        formObject.treatments = result.treatments;
      } else {
        formObject.treatments = null;
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
      'cropID': null,
      'type': null,
      'organic': null,
      'seedManufacturer': null,
      'plantingDate': null,
      'pickupDate': null,
      'participantID': null,
      'farm': null,
      'treatments': null
      });
  }

}
