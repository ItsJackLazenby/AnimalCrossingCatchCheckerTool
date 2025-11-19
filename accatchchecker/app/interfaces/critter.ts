export interface Critter {
  "#": number;
  Name: string;

  // Availability
  "NH Jan": string; "NH Feb": string; "NH Mar": string; "NH Apr": string;
  "NH May": string; "NH Jun": string; "NH Jul": string; "NH Aug": string;
  "NH Sep": string; "NH Oct": string; "NH Nov": string; "NH Dec": string;

  "SH Jan": string; "SH Feb": string; "SH Mar": string; "SH Apr": string;
  "SH May": string; "SH Jun": string; "SH Jul": string; "SH Aug": string;
  "SH Sep": string; "SH Oct": string; "SH Nov": string; "SH Dec": string;

  [key: string]: any;
}
