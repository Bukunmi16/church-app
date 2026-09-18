const buildFilter = ({
  query,
  searchFields = [],
  filterFields = [],
  sortFields = [],
}) => {
  const filter = {};
  let sort = { createdAt: -1 };

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

  // Sorting
  if (query.sortBy && sortFields.includes(query.sortBy)) {
    const sortOrder = query.sortOrder === "asc" ? 1 : -1;

    sort = {
      [query.sortBy]: sortOrder,
    };
  }

  console.log(filter);
  

  return {
    filter,
    sort,
  };
};

export default buildFilter;