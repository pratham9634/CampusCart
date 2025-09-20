// src/services/realtime.js

import { io } from "socket.io-client";

export const notifyNewBid = (productId, bidData) => {
  const socket = io();

  socket.emit('newBid', { productId, ...bidData });

  socket.on('connect', () => {
    console.log('Connected to the server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from the server');
  });
};
