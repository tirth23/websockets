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
- [Ref](https://afteracademy.com/blog/what-is-a-tcp-3-way-handshake-process/)

## Design choices of the communication system in place
### By design http was designed to be stateless. This communication was designed to be a client initiated protocol. Client initiates request to which server responds back
### Initially everytime tcp connection needed to be established for every http request
### In HTTP/1.1, persistent connections were introduced to overcome this inefficiency. With persistent connections, also known as HTTP keep-alive, a single TCP connection can be reused for multiple HTTP requests and responses between a client and server. ii. Once a TCP connection is established, it remains
open for subsequent requests and responses.
iii. Requests are sent one after another over the same
connection. Each request must wait for the previous
one to complete before it can be sent
iv. Limitation: Head-of-Line Blocking: If one request takes
a long time to process, it can delay all subsequent
requests on the same connection.
client                         server
emit("myeventName", args)  ->  socketObj.on("myeventName", () => {})

server                         client
emit("myeventName", args)  ->  socketObj.on("myeventName", () => {})