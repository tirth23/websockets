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

### Real-time Interaction: Highlight that this setup allows for real-time interaction. As soon as the server has new data (like a message or update), it can immediately send it to the connected client(s), and vice versa.

### WebSocket starts as an HTTP connection and then "upgrades" to a WebSocket connection through a handshake process. This upgrade is initiated with an HTTP request including a header (Upgrade: websocket) indicating the desire to establish a WebSocket connection.

### Another advantage that comes out is the header data in WebSocket communication is minimal because, unlike HTTP, it does not require the continuous transmission of cookies, user credentials, or other client-specic headers with each message, resulting in smaller packet sizes."

## Demo websockets

1. Search for a live crypto market and go to https://www.livecoinwatch.com/
2. Go to network tab and select ws ( websockets ) and reload
3. When you select the 'WS' (WebSocket) filter in the Network tab of your browser's developer tools and see a request with a status code of 101, you're looking at the WebSocket handshake.
4. Status Code 101: This indicates 'Switching Protocols'. When you see this, it means the server understood the client's request to open a WebSocket connection and is agreeing to switch protocols from HTTP to WebSocket.
5. Request URL: The URL starting with wss:// shows that the WebSocket connection is secure (similar to https:// for secure HTTP connections). The wss protocol indicates that data sent over the WebSocket connection is encrypted, providing the same level of security as HTTPS.
6. Response Headers: headers like Upgrade: websocket and Connection: Upgrade,
7. Messages Tab: After the handshake, you can switch to the 'Messages' tab within the WebSocket connection in the developer tools. This tab will show you the actual data frames being sent and received through the WebSocket. This is where you can see the real-time communication aspect of WebSockets. Go to the timestamp column to see the real time updates.

## Cons of WebSockets

- Resource Utilization for Idle Connections: WebSocket connections, even when idle, continue to consume resources on the server, which can be inecient compared to stateless HTTP connections that are closed after a transaction.
- WebSocket does not have a built-in mechanism for back-pressure, which is the ability to handle situations where the server is sending data faster than the client can process it.
- Each open WebSocket connection consumes resources on the client side, including memory and network ports. The client device's capabilities (such as CPU, RAM, and network bandwidth) can thus limit the number of connections that can be practically managed.
- The persistent nature of the connection can pose additional security challenges, potential for the server to be exposed to Denial of Service (DoS) attacks.
- Smaller packet size can lead to fragmentation of large messages

## [WebSockets API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

### The WebSocket API is an advanced technology that makes it possible to open a two-way interactive communication session between the user's browser and a server. With this API, you can send messages to a server and receive event-driven responses without having to poll the server for a reply.

### Socket.IO is a JavaScript library that enables real-time, bidirectional, and event-based communication between web clients (like browsers) and servers.

### It's commonly used to build interactive and real-time applications, such as chat applications, live news feeds, and collaborative editing tools.

## Rooms in Socket

### Socket.IO provides a powerful feature called "rooms" that allows you to organize sockets into different groups. Rooms are a way to segregate clients based on certain criteria, such as users in a specic chat room or participants in a particular game. This makes it easy to broadcast messages to a subset of clients, rather than to every connected client.

### Grouping Sockets: Rooms allow you to group sockets into different namespaces. Each socket can join multiple rooms.

### Once sockets are grouped into rooms, you can emit events to all sockets in a room, which is useful for sending messages or updates to a specic group of users.

### Sockets in one room are isolated from sockets in other rooms, which means broadcasting to one room does not affect sockets in other rooms.

client -> server
emit("myeventName", args) -> socketObj.on("myeventName", () => {})

server -> client
emit("myeventName", args) -> socketObj.on("myeventName", () => {})
