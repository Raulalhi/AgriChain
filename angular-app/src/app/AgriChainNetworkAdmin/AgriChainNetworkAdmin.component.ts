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
import { AgriChainNetworkAdminService } from './AgriChainNetworkAdmin.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-agrichainnetworkadmin',
  templateUrl: './AgriChainNetworkAdmin.component.html',
  styleUrls: ['./AgriChainNetworkAdmin.component.css'],
  providers: [AgriChainNetworkAdminService]
})
export class AgriChainNetworkAdminComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  NetworkAdminID = new FormControl('', Validators.required);
  firstName = new FormControl('', Validators.required);
  Company = new FormControl('', Validators.required);
  email = new FormControl('', Validators.required);


  constructor(public serviceAgriChainNetworkAdmin: AgriChainNetworkAdminService, fb: FormBuilder) {
    this.myForm = fb.group({
      NetworkAdminID: this.NetworkAdminID,
      firstName: this.firstName,
      Company: this.Company,
      email: this.email
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceAgriChainNetworkAdmin.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        tempList.push(participant);
      });
      this.allParticipants = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the participant field to update
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
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} name - the name of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.agrichain.participants.AgriChainNetworkAdmin',
      'NetworkAdminID': this.NetworkAdminID.value,
      'firstName': this.firstName.value,
      'Company': this.Company.value,
      'email': this.email.value
    };

    this.myForm.setValue({
      'NetworkAdminID': null,
      'firstName': null,
      'Company': null,
      'email': null
    });

    return this.serviceAgriChainNetworkAdmin.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'NetworkAdminID': null,
        'firstName': null,
        'Company': null,
        'email': null
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


   updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.agrichain.participants.AgriChainNetworkAdmin',
      'firstName': this.firstName.value,
      'Company': this.Company.value,
      'email': this.email.value
    };

    return this.serviceAgriChainNetworkAdmin.updateParticipant(form.get('NetworkAdminID').value, this.participant)
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


  deleteParticipant(): Promise<any> {

    return this.serviceAgriChainNetworkAdmin.deleteParticipant(this.currentId)
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

    return this.serviceAgriChainNetworkAdmin.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'NetworkAdminID': null,
        'firstName': null,
        'Company': null,
        'email': null
      };

      if (result.NetworkAdminID) {
        formObject.NetworkAdminID = result.NetworkAdminID;
      } else {
        formObject.NetworkAdminID = null;
      }

      if (result.firstName) {
        formObject.firstName = result.firstName;
      } else {
        formObject.firstName = null;
      }

      if (result.Company) {
        formObject.Company = result.Company;
      } else {
        formObject.Company = null;
      }

      if (result.email) {
        formObject.email = result.email;
      } else {
        formObject.email = null;
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
      'NetworkAdminID': null,
      'firstName': null,
      'Company': null,
      'email': null
    });
  }
}
