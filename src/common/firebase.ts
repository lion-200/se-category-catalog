import { environment } from 'environment';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { login, setAccount, logout } from 'store/actions';
import { dispatchify } from 'aurelia-store';

const firebaseConfig = {
  apiKey: "AIzaSyCvDm8xN14_284OeAza9d3_4m89bo1GK7U",
  authDomain: "steem-engine-nft.firebaseapp.com",
  databaseURL: "https://steem-engine-nft.firebaseio.com",
  projectId: "steem-engine-nft",
  storageBucket: "steem-engine-nft.appspot.com",
  messagingSenderId: "482478095828",
  appId: "1:482478095828:web:4caa84f2f8a64446aaea41",
  measurementId: "G-N8SDFDKPMW"
};

firebase.initializeApp(firebaseConfig);

export async function authStateChanged() {
  return new Promise(resolve => {
    firebase.auth().onAuthStateChanged(async user => {
      // eslint-disable-next-line no-undef
      const token = await firebase.auth()?.currentUser?.getIdTokenResult(true);

      if (user) {
        dispatchify(login)(user.uid);
        if (token) {
          dispatchify(setAccount)({ token });
        }
        resolve();
      } else {
        dispatchify(logout)();
        resolve();
      }
    });
  });
}
