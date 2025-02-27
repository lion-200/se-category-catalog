﻿import { Container } from 'aurelia-framework';
/* eslint-disable no-undef */
import { initialState } from './state';
import store from './store';

import firebase from 'firebase/app';
import { log } from 'services/log';

import { ssc } from 'common/ssc';
import moment from 'moment';

export function loading(state: IState, boolean: boolean) {
  const newState = { ...state };

  newState.loading = Boolean(boolean);

  return newState;
}

export function login(state: IState, username: string): IState {
  const newState = { ...state };

  if (newState?.account) {
    newState.account.name = username;

    newState.loggedIn = true;
  } else {
    const copiedInitialsTate = { ...initialState };

    newState.account = copiedInitialsTate.account;
    newState.account.name = username;
    newState.loggedIn = true;
  }

  return newState;
}

export function logout(state: IState): IState {
  const newState = { ...state };

  newState.account = {
    name: '',
    token: {},
    account: {}
  };

  newState.loggedIn = false;

  return newState;
}

export function setAccount(state: IState, account: Partial<IState['account']>): IState {
  const newState = { ...state };

  if (newState?.account) {
    newState.account = Object.assign(newState.account, account);
  }

  return newState;
}

export async function getCurrentFirebaseUser(state: IState): Promise<IState> {
  const newState = { ...state };

  if (!newState.loggedIn) {
    return newState;
  }

  try {
    const doc = await firebase
      .firestore()
      .collection('users')
      .doc(newState.account.name)
      .get();

    if (doc.exists) {
      newState.firebaseUser = doc.data();
    }
  } catch (e) {
    log.error(e);
  }

  return newState;
}

export function resetInstance(state: IState): IState {
  const newState = { ...state };

  newState.instance = null;

  return newState;
}

store.registerAction('loading', loading);
store.registerAction('login', login);
store.registerAction('logout', logout);
store.registerAction('setAccount', setAccount);
store.registerAction('getCurrentFirebaseUser', getCurrentFirebaseUser);
store.registerAction('resetInstance', resetInstance);
