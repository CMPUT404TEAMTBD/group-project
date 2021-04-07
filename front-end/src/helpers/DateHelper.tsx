import dateformat from "dateformat";

export function getDateString(obj: any) {
  let date: Date = new Date(obj.published);
  return dateformat(date, "dddd, mmmm dS, yyyy, h:MM TT")
}