// The following are types used by the github api. They are stripped down to only the relevant/potentially relevant properties

export interface GithubEvent {
  id: number,
  // "CreateEvent/PushEvent/DeleteEvent/etc."
  type: string,
  repo: GithubRepo

}

interface GithubRepo {
  id: number,
  name: string
}