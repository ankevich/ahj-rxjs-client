import { ajax } from 'rxjs/ajax';
import {
  map, catchError, of, repeat,
} from 'rxjs';

const messagesTable = document.querySelector('#messages');

const messages$ = ajax.getJSON('http://localhost:3000/messages/unread').pipe(
  repeat({ delay: 2000 }),
  map((response) => response.messages),
  catchError((error) => of(error)),
);

function renderMessage(message) {
  const row = document.createElement('tr');
  const subject = message.subject.length > 15
    ? `${message.subject.slice(0, 15)}...`
    : message.subject;
  const received = new Date(message.received).toLocaleString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  row.innerHTML = `
    <td>${message.from}</td>
    <td>${subject}</td>
    <td>${received}</td>
  `;
  return row;
}

messages$.subscribe((messages) => {
  messages.map(renderMessage).forEach((row) => messagesTable.prepend(row));
});
