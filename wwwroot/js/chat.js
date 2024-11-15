"use strict";

let connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

window.onload = () => {
  let messageHistory = loadMessage();
  if (messageHistory) {
    messageHistory.forEach((message) => {
      let li = document.createElement("li");
      document.getElementById("messagesList").appendChild(li);
      li.textContent = `@${message.user} dice lo siguiente: ${message.message}`;
    });
  }
};

//*send button disable by default
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message) {
  //message list -> lista de mensajes
  let li = document.createElement("li");
  document.getElementById("messagesList").appendChild(li);

  li.textContent = `@${user} dice lo siguiente: ${message}`;
});

connection
  .start()
  .then(function () {
    document.getElementById("sendButton").disabled = false;
  })
  .catch(function (error) {
    console.error("No se pudo iniciar el chat: ", error);
    return console.error(error.toString());
  });

//*enviar mensaje
document
  .getElementById("sendButton")
  .addEventListener("click", function (event) {
    let user = document.getElementById("userInput").value;
    let message = document.getElementById("messageInput").value;

    connection
      .invoke("SendMessage", user, message)
      .catch(function (err) {
        return console.error(err.toString());
      })
      .finally(() => {
        console.log("Se ha enviado el mensaje");

        saveMessages(user, message);
      });
    event.preventDefault();
  });

function saveMessages(user, message) {
  let messageDetail = {
    user,
    message,
  };
  console.log("Message Detail: ", messageDetail);
  let messages = [...loadMessage(), messageDetail];
  //*save to sessionStorage -> guardar en una session
  sessionStorage.setItem("messageList", JSON.stringify(messages));
}

function loadMessage() {
  let messages = sessionStorage.getItem("messageList");
  console.log("Message History: " + messages);
  return JSON.parse(messages);
}
