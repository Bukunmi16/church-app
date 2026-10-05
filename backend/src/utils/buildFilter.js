const buildFilter = ({
  query,
  searchFields = [],
  filterFields = [],
  sortFields = [],
  defaultSort = "createdAt",
}) => {
  // console.log(query)
  let filter = {};

  // Search
  if (query.search && searchFields.length > 0) {
    filter.$or = searchFields.map((field) => ({
      [field]: {
        $regex: query.search,
        $options: "i",
      },
    }));
  }

  // Filters
  filterFields.forEach((field) => {
    if (query[field]) {
      filter[field] = query[field];
    }
  });

  console.log('BUILD FILTER CHECK', filter);
  

  // Sorting
  const sortField = query.sortBy || defaultSort;
  const sortOrder = query.sortOrder === "asc" ? 1 : -1;

  const sort = {
    [sortField]: sortOrder,
  };

  // console.log(sort);
    

  return {
    filter,
    sort,
  };
};

export default buildFilter;