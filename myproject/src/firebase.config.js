import { getApp, getApps, initializeApp} from 'firebase/app';
import { getFirestore} from 'firebase/firestore';
import { getStorage} from 'firebase/storage';



const firebaseConfig = {
    apiKey: "AIzaSyBVL5H1KBa13ys9e3z0whJc9CZOhxYCn7M",
    authDomain: "myproject-9b720.firebaseapp.com",
    databaseURL: "https://myproject-9b720-default-rtdb.firebaseio.com",
    projectId: "myproject-9b720",
    storageBucket: "myproject-9b720.appspot.com",
    messagingSenderId: "680616724543",
    appId: "1:680616724543:web:f9612272687e2c7cf2508a"
  };


  const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

  const firestore = getFirestore(app);
  const storage = getStorage(app);

  export { app, firestore, storage }