```
npm init -y
npm i express socket.io
```

## Client Server communication flow
- When a client makes a request to a server over the web (e.g., entering a URL in a browser), it first establishes a TCP connection with the server.
- Three way handshake happens. This involves the exchange of SYN (synchronize) and ACK (acknowledgment) packets.
- Once the TCP connection is established, the client sends an HTTP request through this connection.
- The server receives the HTTP request, processes it, and sends back an HTTP response.
- The response is received by the client, and the information (like a webpage) is rendered for the user.
- The TCP connection can be closed or kept open for further requests, depending on the HTTP headers (like Connection: keep-alive).
[Ref](https://medium.com/@oumasydney2000/understanding-the-tcp-three-way-handshake-a-fundamental-pillar-of-internet-communication-53c9230724c2)


client                         server
emit("myeventName", args)  ->  socketObj.on("myeventName", () => {})

server                         client
emit("myeventName", args)  ->  socketObj.on("myeventName", () => {})