import axios from 'axios';
import { Node } from '../types/Node';
import { UserLogin } from '../types/UserLogin'

export class AxiosWrapper {
  static readonly nodesUrl = `${process.env.REACT_APP_API_URL}/api/nodes/`;

  // Given a URL and Node[], checks the Nodes and retrieves the credentials that requests to the URL should be made with.
  private static getCredentialsForUrl(url: string, nodes: Node[]) {
    nodes = nodes.filter((n: any) => url.includes(n.host));

    if (nodes.length === 0) {
      console.log(`No node credentials found for the given request url: ${url}`)
    }

    return nodes.length === 0 
      ? null
      : { auth: { username: nodes[0].username, password: nodes[0].password } } ;
  }

  // Returns whether or not the given URL contains our back-end API's URL as a substring.
  // Used to determine whether we need to get extra credentials to make a request or not.
  private static isLocal(url: string) {
    return url.includes(process.env.REACT_APP_API_URL as string) ? true : false;
  }

  // Given a URL, gets all Nodes from the server and returns a Promise of credentials that should be used to make requests to that URL.
  private static credentials(url: string, user: UserLogin | undefined): Promise<any> {
    if (AxiosWrapper.isLocal(url)) {
      let credentials: any = user === undefined ? null : { auth: { username: user.username, password: user.password } };
      return Promise.resolve(credentials);
    } else {
      return axios.get<Node[]>(AxiosWrapper.nodesUrl).then(res => AxiosWrapper.getCredentialsForUrl(url, res.data));
    }
  }

  static get(url: string, user: UserLogin | undefined): any {
    return AxiosWrapper.credentials(url, user).then(c => c === null ? axios.get(url) : axios.get(url, c));
  }

  static delete(url: string, user: UserLogin | undefined): any {
    return AxiosWrapper.credentials(url, user).then(c => c === null ? axios.delete(url) : axios.delete(url, c));
  }

  static post(url: string, data: any, user: UserLogin | undefined): any {
    return AxiosWrapper.credentials(url, user).then(c => c === null ? axios.post(url, data) : axios.post(url, data, c));
  }

  static put(url: string, data: any, user: UserLogin | undefined): any {
    return AxiosWrapper.credentials(url, user).then(c => c === null ? axios.put(url, data) : axios.put(url, data, c));
  }
}