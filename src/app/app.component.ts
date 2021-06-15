import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
interface chatComponent {
  name: string;
  content: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  name: string | null;
  ws: WebSocket | null;
  constructor(private DynamicTitle: Title) {
    DynamicTitle.setTitle(this.title);
    this.name = null;
    this.ws = null;
  }
  ngOnInit(): void {
    const name = window.localStorage.getItem('name');
    if (!name) return;
    document.getElementById('name-c')?.classList.replace('absolute', 'hidden');
    this.name = name;
    this.fireWS();
  }
  formsubmit = (e: Event): void => {
    e.preventDefault();
    let { value: text } = document.getElementById(
      'chat-bar'
    ) as HTMLTextAreaElement;
    if (!text) return;
    text = text.trim();
    if (!text) return;
    (document.getElementById('chat-bar') as HTMLTextAreaElement).value = '';
    this.ws?.send(
      JSON.stringify({ name: this.name, content: text, type: 'MSG_CREATE' })
    );
  };
  handleNameClick(e?: Event): void {
    if (e) e.preventDefault();
    let { value: name } = document.getElementById(
      'name-bar'
    ) as HTMLTextAreaElement;
    if (!name) return;
    name = name.trim();
    this.name = name;
    window.localStorage.setItem('name', name);
    document.getElementById('name-c')?.classList.replace('absolute', 'hidden');
    this.fireWS();
  }
  fireWS(): void {
    this.connect();
  }
  connect(): void {
    this.ws = new WebSocket(
      'wss://CurlyIllfatedOrder.techixspotifyco.repl.co/gateway'
    );
    this.ws.onopen = this.handshake;
    this.ws.addEventListener('message', (m) => {
      try {
        let data = JSON.parse(m.data);
        switch (data.type) {
          case 'MSG_CREATE':
            this.allChats.push({ name: data.name, content: data.content });
        }
      } catch (e) {
        console.error(e);
      }
    });
  }
  handshake = (): void => {
    if (!this.ws || !this.name) return;
    this.ws.send(JSON.stringify({ type: 'hs', name: this.name }));
  };
  title = 'Home';
  allChats: chatComponent[] = [];
}
