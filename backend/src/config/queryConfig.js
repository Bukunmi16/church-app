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
};