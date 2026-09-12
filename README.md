# Dan Ace Attorney 
> [!IMPORTANT]
> We are not officially affliated with Danganronpa or Ace attorney franchises. Plz don't sue us... :'>

<img width="1844" height="875" alt="image" src="https://github.com/user-attachments/assets/ff65f0a5-a958-427f-a64c-afaa4dafa72a" />
<img width="559" height="743" alt="image" src="https://github.com/user-attachments/assets/e0749d86-a5d5-456a-8abb-546a1f47ccb8" />

## To setup and run the project:
```sh
npm i
```
```sh
npm run dev
```

This runs both the vite client frontend and the node websockets backend for real time stuff. 

Then just visit the vite's localhost:5000 for access to the app.

The app currently has three main views: CourtRoom (at /), Buzzer (at /playerA and /playerB) for the other two players.

Currently using socket.io for real time stuff, react for frontend with react-router and typescript to share type safety and autocompletion between client and server code.

There are some issues with video playback after some idle time due to browser power saving measures. 



