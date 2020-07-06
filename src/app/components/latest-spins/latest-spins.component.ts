import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-latest-spins',
  templateUrl: './latest-spins.component.html',
  styleUrls: ['./latest-spins.component.css']
})
export class LatestSpinsComponent implements OnInit {

  @Input() spins: any;

  constructor() { }

  ngOnInit(): void {
  }

}
