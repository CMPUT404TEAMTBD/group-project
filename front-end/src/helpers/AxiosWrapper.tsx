import { Node } from '../types/Node';
import axios from 'axios';

interface Credentials {
  username: string;
  password: string;
}

export class AxiosWrapper {
  static nodes: Node[] = []
  
  /**
   * Given a URL, checks the host and retrieves the credentials requests to that URL should be made with.
   * @param url to get the credentials for
   */
  private static getCredentialsForUrl(url: string) {
    let nodes = AxiosWrapper.nodes.filter(n => n.host.includes(url));

    let credentials: Credentials = nodes.length === 0 
      ? { username: "", password: "" }
      : { username: nodes[0].username, password: nodes[0].password };
    
    return {
      auth: credentials
    };
  }


  static get(url: string): any {
    return axios.get(url, AxiosWrapper.getCredentialsForUrl(url));
  }

  static delete(url: string): any {
    return axios.delete(url, AxiosWrapper.getCredentialsForUrl(url));
  }

  static post(url: string, data: any): any {
    return axios.post(url, data, AxiosWrapper.getCredentialsForUrl(url));
  }

  static put(url: string, data: any): any {
    return axios.put(url, data, AxiosWrapper.getCredentialsForUrl(url));
  }
}