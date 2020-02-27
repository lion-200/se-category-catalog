import { AuthService } from './auth-service';
import { I18N } from 'aurelia-i18n';
import { HttpClient, json } from 'aurelia-fetch-client';
import { lazy, autoinject } from 'aurelia-framework';
import { environment } from 'environment';

import firebase from 'firebase/app';

import SSC from 'sscjs';
import steem from 'steem';

import { Store } from 'aurelia-store';
import { Subscription } from 'rxjs';

import { ToastService, ToastMessage } from './toast-service';
import { customJson, requestTransfer } from 'common/keychain';
import moment from 'moment';
import { queryParam } from 'common/functions';
import { getAccount } from 'common/steem';

@autoinject()
export class SeCatalogService {
  public accountsApi: HttpClient;
  public http: HttpClient;
  public ssc;
  public state: IState;

  public user = {
    name: '',
    account: {},
    balances: [],
    scotTokens: [],
    pendingUnstakes: [],
    pendingUndelegations: []
  };

  public params = {};
  public tokens = [];
  public scotTokens = {};
  public steemPrice = 0;
  public storeSubscription: Subscription;
  public _sc_callback;

  constructor(
    @lazy(HttpClient) getHttpClient: () => HttpClient,
    private i18n: I18N,
    private store: Store<IState>,
    private toast: ToastService,
    private authService: AuthService) {
    this.storeSubscription = this.store.state.subscribe(state => {
      if (state) {
        this.state = state;

        this.user = state.account as any;
      }
    });

    this.accountsApi = getHttpClient();
    this.http = getHttpClient();

    this.ssc = new SSC(environment.RPC_URL);

    this.accountsApi.configure(config => {
      config
        .useStandardConfiguration()
        .withBaseUrl(environment.ACCOUNTS_API_URL);
    });

    this.http.configure(config => config.useStandardConfiguration());
  }

  unbind() {
    this.storeSubscription.unsubscribe();
  }

  getUser() {
    return this.user?.name ?? null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request(url: string, params: any = {}) {
    // Cache buster
    params.v = new Date().getTime();

    url = url + queryParam(params);

    return this.http.fetch(url, {
      method: 'GET'
    });
  }

  async login(username: string, key?: string): Promise<unknown> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      if (window.steem_keychain && !key) {
        // Get an encrypted memo only the user can decrypt with their private key
        const encryptedMemo = await this.authService.getUserAuthMemo(username) as string;

        window.steem_keychain.requestVerifyKey(username, encryptedMemo, 'Posting', async response => {
          if (response.error) {
            const toast = new ToastMessage();

            toast.message = this.i18n.tr('errorLogin', {
              ns: 'notifications'
            });

            this.toast.error(toast);
          } else {
            // Get the return memo and remove the '#' at the start of the private memo
            const signedKey = (response.result as unknown as string).substring(1);

            // The decrypted memo is an encrypted string, so pass this to the server to get back refresh and access tokens
            const token = await this.authService.verifyUserAuthMemo(response.data.username, signedKey) as string;

            await firebase.auth().signInWithCustomToken(token);

            resolve({ username, token });
          }
        });
      } else {
        try {
          if (key && !steem.auth.isWif(key)) {
            key = steem.auth.getPrivateKeys(username, key, ['posting']).posting;
          }
        } catch (err) {
          const toast = new ToastMessage();

          toast.message = this.i18n.tr('invalidPrivateKeyOrPassword', {
            ns: 'errors'
          });

          this.toast.error(toast);
          return;
        }

        try {
          const user = await getAccount(username);

          if (user) {
            try {
              if (steem.auth.wifToPublic(key) == user.memo_key || steem.auth.wifToPublic(key) === user.posting.key_auths[0][0]) {
                // Get an encrypted memo only the user can decrypt with their private key
                const encryptedMemo = await this.authService.getUserAuthMemo(username);

                // Decrypt the private memo to get the encrypted string
                const signedKey = steem.memo.decode(key, encryptedMemo).substring(1);

                // The decrypted memo is an encrypted string, so pass this to the server to get back refresh and access tokens
                const token = await this.authService.verifyUserAuthMemo(username, signedKey) as string;

                await firebase.auth().signInWithCustomToken(token);

                resolve({ username, token });
              } else {
                const toast = new ToastMessage();

                toast.message = this.i18n.tr('errorLogin', {
                  ns: 'notifications'
                });

                this.toast.error(toast);
              }
            } catch (err) {
              const toast = new ToastMessage();

              toast.message = this.i18n.tr('errorLogin', {
                ns: 'notifications'
              });

              this.toast.error(toast);
            }
          } else {
            const toast = new ToastMessage();

            toast.message = this.i18n.tr('errorLoading', {
              ns: 'notifications'
            });

            this.toast.error(toast);
          }
        } catch (e) {
          return;
        }
      }
    });
  }

  async logout() {
    return firebase.auth().signOut();
    //dispatchify(logout)();
  }

  steemConnectCallback() {
    if (this._sc_callback) {
      // Show loading

      setTimeout(() => {
        // Hide loading

        this._sc_callback();
        this._sc_callback = null;

      }, 10000);
    }
  }
}
