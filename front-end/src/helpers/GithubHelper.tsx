// check if a url is a valid github link
export function isValidGithub(github: string){
  return new RegExp('https?:\/\/github.com\/*', 'g').test(github);
}