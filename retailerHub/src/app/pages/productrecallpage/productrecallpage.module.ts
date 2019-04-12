import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { ProductrecallpagePage } from "./productrecallpage.page";

const routes: Routes = [
  {
    path: "productrecall",
    component: ProductrecallpagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProductrecallpagePage]
})
export class ProductrecallpagePageModule {}
