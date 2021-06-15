import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css'],
})
export class ChatsComponent implements OnInit {
  @Input() name: string = '';
  @Input() content: string = '';
  ngOnInit(): void {}
}
