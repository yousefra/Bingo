import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-history-card',
  templateUrl: './history-card.component.html',
  styleUrls: ['./history-card.component.scss'],
})
export class HistoryCardComponent implements OnInit {
  @Input() item;
  @Input() rolledTime;
  @Input() stats;


  constructor() { }

  ngOnInit() { }

  format() {
    if (!this.item.date)
      return;

    let d = new Date(this.item.date);
    let year = d.getFullYear();
    let month = d.getMonth();
    let day = d.getDate();
    let hour = d.getHours() % 24;
    let minute = d.getMinutes();
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    return `${monthNames[month]} ${day},${year}  ${hour}:${minute}`
  }
}
