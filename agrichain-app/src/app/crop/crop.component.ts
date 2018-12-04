import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-crop',
  templateUrl: './crop.component.html',
  styleUrls: ['./crop.component.scss']
})
export class CropComponent implements OnInit {

  crops;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.crops().toPromise().then(data => {
      console.log(data);
      this.crops = data;
    });
  }

}
