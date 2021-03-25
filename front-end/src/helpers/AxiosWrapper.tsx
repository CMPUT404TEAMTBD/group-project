import { Node } from '../types/Node';
import axios, { AxiosResponse } from 'axios';

interface Credentials {
  username: string;
  password: string;
}

class AxiosWrapper {
  nodes: Node[]

  constructor(nodes: Node[]) {
    this.nodes = nodes;
  }
  
  /**
   * Given a URL, checks the host and retrieves the credentials requests to that URL should be made with.
   * @param url to get the credentials for
   */
  private getCredentialsForUrl(url: string) {
    let nodes = this.nodes.filter(n => n.host.includes(url));

    let credentials: Credentials = nodes.length === 0 
      ? { username: "", password: "" }
      : { username: nodes[0].username, password: nodes[0].password };
    
    return {
      auth: credentials
    };
  }

  get(url: string): Promise<AxiosResponse<any>> {
    return axios.get(url, this.getCredentialsForUrl(url));
  }

  delete(url: string): Promise<AxiosResponse<any>> {
    return axios.delete(url, this.getCredentialsForUrl(url));
  }

  post(url: string, data: any): Promise<AxiosResponse<any>> {
    return axios.post(url, data, this.getCredentialsForUrl(url));
  }

  put(url: string, data: any): Promise<AxiosResponse<any>> {
    return axios.put(url, data, this.getCredentialsForUrl(url));
  }
}