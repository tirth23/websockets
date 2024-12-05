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

### In HTTP/1.1, persistent connections were introduced to overcome this inefficiency. With persistent connections, also known as HTTP keep-alive, a single TCP connection can be reused for multiple HTTP requests and responses between a client and server. Once a TCP connection is established, it remains open for subsequent requests and responses. Requests are sent one after another over the same connection. Each request must wait for the previous one to complete before it can be sent. Limitation: Head-of-Line Blocking: If one request takes a long time to process, it can delay all subsequent requests on the same connection.

### HTTP/2 Standardized in 2015, built upon the concept of persistent connections by introducing multiplexing. This allows multiple requests and responses to be simultaneously active on the same connection. Multiple requests can be sent out at the same time, and responses can be received out of order. This is achieved by breaking down the data into frames, which can be interleaved on the same connection. Benefit: Since multiple requests and responses can be processed simultaneously, one slow request does not block others.

## Limitations of http for real time communication

1. One-Way Communication: The server cannot initiate communication with the client, which limits real-time interactions.
2. Overhead of HTTP Headers: Each HTTP request and response carries a signicant amount of header data. This overhead is inefficient, especially for applications that need to send frequent, small messages, like real-time chat messages or live price updates in trading applications.
3. No Persistent Connections: It does not allow for continuous, full-duplex communication where data can ow in both directions simultaneously. Full-duplex means that data can ow in both directions simultaneously, which is crucial for real-time applications
4. Latency Issues: HTTP's request-response nature can lead to latency issues in real-time applications. I need market updates for live tracker. I need to send requests frequently to get the updates.

## Polling

### Chat applications and other real time kind of applications were indeed created and widely used before the introduction of WebSockets. However, the techniques used for these earlier chat applications were different and had certain limitations compared to the real-time capabilities provided by WebSockets.

### Polling: In this approach, the client (typically a web browser) would regularly send HTTP requests to the server to check for new messages. This was a straightforward approach but inefficient, as it involved sending requests at regular intervals regardless of whether there were new messages, leading to unnecessary network track and server load.

### Long Polling: An improvement over traditional polling, long polling involves the client sending a request to the server, which then keeps the request open until new data (like a chat message) becomes available. Once the data is sent to the client, the connection closes, and the client immediately opens a new connection. This method reduces the amount of unnecessary HTTP requests but still has higher latency compared to WebSockets.

## WebSockets

### There's a dedicated channel for communication between the server and each client.
### Persistent Connections: unlike HTTP, WebSocket creates a persistent connection between each client and the server. This means that once a client (C1, C2, C3) establishes a connection to the server, it remains open for two-way communication until explicitly closed by eithe client or a server.
### WebSocket connection as a "channel" or "pipeline" that directly links each client to the server. This channel is unique and private to the client-server pair.
### Full-Duplex Communication: Illustrate that these channels are full-duplex, meaning that both the server and the client can send messages to each other independently and simultaneously without waiting for a request-response sequence.

client server
emit("myeventName", args) -> socketObj.on("myeventName", () => {})

server client
emit("myeventName", args) -> socketObj.on("myeventName", () => {})
