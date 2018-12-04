import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CropComponent } from './crop/crop.component';
import { FarmerComponent } from './farmer/farmer.component';
import { CreateCropComponent } from './create-crop/create-crop.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {path: 'crops', component: CropComponent},
  {path: 'crops/create', component: CreateCropComponent},
  {path: 'farmers', component: FarmerComponent},
  {path: 'login', component: LoginComponent},
  {path: '**', redirectTo: '/crops'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
