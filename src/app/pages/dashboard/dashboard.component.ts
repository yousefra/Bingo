import { Component, OnInit } from '@angular/core';
import { BingoAPIService } from './../../services/bingo-api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  usersBoxInput: any = { title: 'Registered Users' };
  spinsBoxInput: any = { title: 'Spinned Spins' };
  giftsBoxInput: any = { title: 'Gifts Sent' };
  spins: any;

  constructor(private bingoApi: BingoAPIService) { }

  ngOnInit(): void {
    this.bingoApi.getUsers().subscribe(res => {
      this.usersBoxInput.count = res['count'];
      this.usersBoxInput.percent = res['percent'];
    });
    this.bingoApi.getSpins().subscribe(res => {
      this.spinsBoxInput.count = res['count'];
      this.spinsBoxInput.percent = res['percent'];
      this.giftsBoxInput.count = res['giftsCount'];
      this.giftsBoxInput.percent = res['giftsPercent'];
      this.spins = res['spins'];
    });
  }

}
