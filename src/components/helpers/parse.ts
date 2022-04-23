import { format } from "date-fns";

export const dataToGameList = (
  { date, name, score, winner }: any,
  id: string
) => ({
  id,
  date: format(new Date(date), "yyyy-MM-dd hh:mm:ss"),
  name,
  score,
  winner,
});
