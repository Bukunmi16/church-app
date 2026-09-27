export const serviceQueryConfig = {
  searchFields: ["title", "preacher"],
  filterFields: ["serviceType"],
  sortFields: ["date", "title", "createdAt"],
};

export const eventQueryConfig = {
  searchFields: ["title", "preacher"],
  sortFields: ["date", "title", "createdAt"],
};

export const teachingQueryConfig = {
  searchFields: ["title", "preacher"],
  filterFields: ["preacher"],
  sortFields: ["date", "title", "createdAt"],
  defaultSortField: "date",
};

export const teachingSeriesQueryConfig = {
  searchFields: ["title", "month"],
  filterFields: ["month", "year"],
  sortFields: ["year", "title", "createdAt"],
}