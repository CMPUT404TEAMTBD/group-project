import { Node } from '../types/Node';
import axios from 'axios';

export class AxiosWrapper {
  static nodes: Node[] = []
  
  /**
   * Given a URL, checks the host and retrieves the credentials requests to that URL should be made with.
   * @param url to get the credentials for
   */
  private static getCredentialsForUrl(url: string) {
    let nodes = AxiosWrapper.nodes.filter(n => url.includes(n.host));

    return nodes.length === 0 
      ? null
      : { auth: { username: nodes[0].username, password: nodes[0].password } } ;
  }

  static get(url: string, credentials: any = AxiosWrapper.getCredentialsForUrl(url)): any {
    return credentials === null ? axios.get(url) : axios.get(url, credentials);
  }

  static delete(url: string, credentials: any = AxiosWrapper.getCredentialsForUrl(url)): any {
    return credentials === null ? axios.delete(url) : axios.delete(url, credentials);
  }

  static post(url: string, data: any, credentials: any = AxiosWrapper.getCredentialsForUrl(url)): any {
    return credentials === null ? axios.post(url, data) : axios.post(url, data, credentials);
  }

  static put(url: string, data: any, credentials: any = AxiosWrapper.getCredentialsForUrl(url)): any {
    return credentials === null ? axios.put(url, data) : axios.put(url, data, credentials);
  }
}