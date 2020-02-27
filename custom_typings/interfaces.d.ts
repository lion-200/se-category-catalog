interface ICategory {
  key: string;
  id: number;    
  level: number;
  parentId: number;
  name: string;
  restricted: boolean;
  image: string;
  parentData: any;
  enabled: boolean;
}

interface ICategoryProposal {
  key: string;
  from: string;
  timestamp: string;
  name: string;
  level: number;
  parentId: number;
  restricted: boolean;
  image: string;
  message: string;
  status: string;
  handledBy: string;
  handlingTimestamp: string;
  handlerMessage: string;
  timestamp_string: string;
  handlingTimestamp_string: string;
}

interface IState {
  $action: any;
  account: IAccountInterface;
  firebaseUser: any;
  loggedIn: boolean;
  loading: boolean;
}

interface IAccountInterface {
  name: string;
  account: any;
  token: any;
}

interface EnvironmentInterface {
  debug: boolean;
  testing: boolean;
  FIREBASE_API: string;
  chainId: string;
  siteName: string;
  defaultLocale: string;
  maintenanceMode: boolean;
  RPC_URL: string;
  ACCOUNTS_API_URL: string;
  CONVERTER_API: string;
  NODE_API_URL: string;
  GRAPHQL_API: string;
  HISTORY_API: string;
  SCOT_API: string;
}
