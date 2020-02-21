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
