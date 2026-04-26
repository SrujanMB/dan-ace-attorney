# Dan Ace Attorney 
> [!IMPORTANT]
> We are not officially affliated with Danganronpa or Ace attorney franchises. Plz don't sue us... :'>

## To setup and run the project:
```sh
npm i
```
```sh
npm run dev
```

This runs both the vite client frontend and the node websockets backend for real time stuff. 

Then just visit the vite's localhost:3000 for access to the app.

The app currently has three main views: CourtRoom (at /), Buzzer (at /playerA and /playerB) for the other two players.

Currently using socket.io for real time stuff, react for frontend with react-router and typescript to share type safety and autocompletion between client and server code.

Planning to put in tailwind and other things in there but this is just a proof of concept.
