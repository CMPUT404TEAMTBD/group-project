import dateformat from "dateformat";

export function getDateString(obj: any) {
  let date: Date = new Date(obj.published);
  if (dateformat(date, "m-d-yyyy") === dateformat(Date.now(), "m-d-yyyy")) {
    return dateformat(date, "h:MM TT");
  }
  return dateformat(date, "m-d-yyyy, h:MM TT");
}