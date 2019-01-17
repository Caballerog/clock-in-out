
# Clock-in/out
A clock-in/out system using nestJS, PostgreSQL, TypeORM, Angular, Arduino, RxJS

In this post I'm going to summerize all the links (you will find them down below) about clock-in/out system. I’ve used **NestJS** (framework of NodeJS) and **Angular**.

The idea of this project is to develop a clock-in/out system using Arduino as NFC transmitter to a **NodeJS** API.For the frontend project, I’ve chosen Angular with RxJS. This allows me to have almost a realtime system. Since RxJS polling is enough for my needs, socketIO is not required.

You can find more information in the following links:

<ul>
  <li>
    <a href="https://carloscaballero.io/part-1-clock-in-out-system-diagram/">Part 1. Clock-in/out System: Diagram.</a>
  </li>
  <li>
    <a href="https://carloscaballero.io//part-2-clock-in-out-system-basic-backend/">Part 2. Clock-in/out System: Basic backend - AuthModule.</a>
  </li>
  <li>
    <a href="https://carloscaballero.io//part-3-clock-in-out-system-basic-backend-ii-usersmodule">Part 3. Clock-in/out System: Basic backend - UsersModule.</a>
  </li>
  <li>
    <a href="https://carloscaballero.io//part-4-clock-in-out-system-basic-backend-iii-appmodule">Part 4. Clock-in/out System: Basic backend- AppModule.</a>
  </li>
  <li>
    <a href="https://carloscaballero.io//part-5-clock-in-out-system-seed-database-and-migration-data/">Part 5. Clock-in/out System: Seed Database and migration data</a>
  </li>
  <li>Part 6. Clock-in/out System: Basic frontend.</li>
  <li>Part 7. Clock-in/out System: Arduino.</li>
  <li>Part 8. Deploy: Docker/Docker-Compose</li>
  <li>Part 9. Testing: Backend Testing - Unit Testing</li>
  <li>Part 10. Testing: Backend Testing - Integration Testing</li>
  <li>Part 11. Testing: Backend Testing - E2E Testing</li>
  <li>Part 12. Testing: Frontend Testing - Unit Testing</li>
  <li>Part 13. Testing: Frontend Testing - Integration Testing</li>
</ul>

--- 

In this first post of the series of post about the clock-in/out system I'm going to describe the system's architecture. The best way to describe the problem which our system will resolve is using a diagram. In this diagram you can see different components which can be in different or in the same server. The Figure 1 show the diagram used to build the clock-in/out system.


![Diagram](https://github.com/Caballerog/clock-in-out/blob/master/diagram.png?raw=true)

So, the components of our system are the following:

- **ID Card**: All users have a card which is identified using an UID. The way to work is that the user pass their card near of a Arduino system which has a NFC reader.
- **Arduino**: There are two Arduino in the system. The first is used to clock-in and the second is used to clock-out. So, each Arduino send to the backend the UID's card using the POST verb over HTTPS.  The Arduino system have a NFC and a WiFi chip:
  
    1. The first is used to read the card.
    2. The second is used to connect to the LAN to send the UID to the server.
   
- **Backend**: The backend is developed using NestJS which is a framework over express (although you can use other libraries as fastify) which can developed software using the SOLID principles and the syntax as Angular. This backend will be connected to a relational database Postgres using TypeORM as ORM.
- **Frontend**: The frontend is developed using Angular which is a framework over JavaScript which is a good option when you want scale large webapps (client-side). In this case, is used to illustrated how to using the last Angular's version and good practices. The frontend is develop using **RxJS**, RxJS is a library for reactive programming using **Observables**, to make it easier to compose asynchronous or callback-based code. The connection between frontend and backend could have been using sockets to obtain real-time but using polling you obtained a result as a socket (near real-time) but more easiest.

There are several components which could be developed in the future as an admin panel to manage information about users and cards, personal information about my check-in/out in the system, the frontend could do search by users to know if the user is in the building or not. Maybe, in the future this features could be develop but today will go to presented a basic system of clock-in/clock-out.
