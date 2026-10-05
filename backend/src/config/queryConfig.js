export const serviceQueryConfig = {
  searchFields: ["title", "preacher"],
  filterFields: ["serviceType"],
  sortFields: ["date", "title", "createdAt"],
};

export const eventQueryConfig = {
  searchFields: ["title", "preacher"],
  sortFields: ["date", "title", "createdAt"],
  defaultSort: "startDate",
};

export const teachingQueryConfig = {
  searchFields: ["title", "preacher"],
  filterFields: ["preacher"],
  sortFields: ["date", "title", "createdAt"],
  defaultSort: "date",
};

export const teachingSeriesQueryConfig = {
  searchFields: ["title"],
  filterFields: ["month", "year"],
  sortFields: ["year", "title", "createdAt"],
  defaultSort: "date" 
}

export const userQueryConfig = {
  searchFields: ["name", "email"],
  filterFields: ["role"],
  sortFields: ["createdAt"],
  defaultSort: "createdAt" 
}

export const notificationQueryConfig = {
  searchFields: ["title", "message"],
  filterFields: ["isRead"],
  sortFields: ["createdAt"],
  defaultSort: "createdAt" 
}