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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { CropComponent } from './Crop/Crop.component';
import { FarmComponent } from './Farm/Farm.component';
import { TreatmentComponent } from './Treatment/Treatment.component';
import { ProductComponent } from './Product/Product.component';
import { IrrigationComponent } from './Irrigation/Irrigation.component';
import { PacketComponent } from './Packet/Packet.component';

import { AgriChainNetworkAdminComponent } from './AgriChainNetworkAdmin/AgriChainNetworkAdmin.component';
import { FarmerComponent } from './Farmer/Farmer.component';
import { WholesalerComponent } from './Wholesaler/Wholesaler.component';
import { RetailerComponent } from './Retailer/Retailer.component';

import { transferCropsComponent } from './transferCrops/transferCrops.component';
import { notifyPartiesComponent } from './notifyParties/notifyParties.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'Crop', component: CropComponent },
  { path: 'Farm', component: FarmComponent },
  { path: 'Treatment', component: TreatmentComponent },
  { path: 'Product', component: ProductComponent },
  { path: 'Irrigation', component: IrrigationComponent },
  { path: 'Packet', component: PacketComponent },
  { path: 'AgriChainNetworkAdmin', component: AgriChainNetworkAdminComponent },
  { path: 'Farmer', component: FarmerComponent },
  { path: 'Wholesaler', component: WholesalerComponent },
  { path: 'Retailer', component: RetailerComponent },
  { path: 'transferCrops', component: transferCropsComponent },
  { path: 'notifyParties', component: notifyPartiesComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
 imports: [RouterModule.forRoot(routes)],
 exports: [RouterModule],
 providers: []
})
export class AppRoutingModule { }
