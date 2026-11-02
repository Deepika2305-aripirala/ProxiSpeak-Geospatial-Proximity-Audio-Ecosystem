
import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:4000";

const alice = io(SERVER_URL);
const bob = io(SERVER_URL);

alice.on("connect", () => {
  console.log("Alice connected:", alice.id);

  alice.emit("join-office", {
    userId: "alice-socket-test",
    officeId: "office-socket-test",
    x: 200,
    y: 250
  });
});

bob.on("connect", () => {
  console.log("Bob connected:", bob.id);

  bob.emit("join-office", {
    userId: "bob-socket-test",
    officeId: "office-socket-test",
    x: 250,
    y: 280
  });
});

alice.on("proximity-update", (data) => {
  console.log("\nAlice proximity update:");
  console.log(data);
});

bob.on("proximity-update", (data) => {
  console.log("\nBob proximity update:");
  console.log(data);
});

// Move Bob outside Alice's range after 5 seconds
setTimeout(() => {
  console.log("\nBob moving outside proximity range...");

  bob.emit("update-position", {
    x: 500,
    y: 500
  });
}, 5000);

// Stop the test after 8 seconds
setTimeout(() => {
  alice.disconnect();
  bob.disconnect();
  console.log("\nSocket simulation completed.");
  process.exit(0);
}, 8000);
