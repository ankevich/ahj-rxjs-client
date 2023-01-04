import { ajax } from "rxjs/ajax";
import { map, catchError, of, repeat } from "rxjs";

const messagesTable = document.querySelector("#messages");

const messages$ = ajax.getJSON("http://localhost:3000/messages/unread").pipe(
  repeat({ delay: 2000 }),
  map((response) => response.messages),
  catchError((error) => {
    console.log("error: ", error);
    return of(error);
  })
);

function renderMessage(message) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${message.from}</td>
    ${
      message.subject.length > 15
        ? `<td>${message.subject.slice(0, 15)}...</td>`
        : `<td>${message.subject}</td>`
    }
    <td>${message.received}</td>
  `;
  return row;
}

messages$.subscribe((messages) => {
  messages.map(renderMessage).forEach((row) => messagesTable.prepend(row));
});
