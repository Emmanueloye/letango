import { Request } from 'express';
import { Query } from 'mongoose';

class GetRequestAPI {
  public pageDetails: any;

  constructor(
    public query: Query<any, any>,
    private reqQuery: any,
  ) {
    this.query = query;
    this.reqQuery = reqQuery;
  }

  filter() {
    // Basic sorting
    // Make a copy of the request query
    const queryObj = { ...this.reqQuery };

    // Create list of what should be excluded from request query.
    const excludedList = [
      'sort',
      'fields',
      'limit',
      'page',
      'search',
      'value',
      'range',
      'startDate',
      'endDate',
    ];

    // Delete the excluded list from request query
    excludedList.forEach((el) => delete queryObj[el]);
    // Advance Filtering
    // Parse the copy of request query as string to run replace.
    let queryStr = JSON.stringify(queryObj);

    // This enable the routes to handles number filter like greater than etc.
    queryStr = queryStr.replace(/\b(gt|lt|gte|lte)\b/g, (match) => `$${match}`);

    // Parse the string back to object
    let newQueryStr = JSON.parse(queryStr);

    // if there is search and value on the query request, search keyword specified in the value using the field specify in the search query params.

    if (this.reqQuery.search && this.reqQuery.value) {
      newQueryStr[this.reqQuery.search as string] = {
        $regex: this.reqQuery.value as string,
        $options: 'i',
      };
    }

    if (this.reqQuery.range) {
      const [field, min, max] = this.reqQuery.range.split(',');

      newQueryStr[field] = { $gte: min, $lte: max };
    }

    this.query = this.query.find(newQueryStr);
    return this;
  }

  sort() {
    // If the request query has a sort parameter, sort the data based on it.
    if (this.reqQuery.sort) {
      const sortBy = this.reqQuery.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    // If the request query has a fields parameter, limit the fields based on what was specified.
    if (this.reqQuery.fields) {
      const requiredFields = this.reqQuery.fields.split(',').join(' ');
      this.query = this.query.select(requiredFields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  limitDocuments() {
    if (this.reqQuery.limit) {
      this.query = this.query.limit(this.reqQuery.limit);
    }
    return this;
  }
  paginate() {
    if (this.reqQuery.page) {
      const limit = +this.reqQuery.limit || 10;
      const page = +this.reqQuery.page || 1;
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
    }

    return this;
  }
}

export const paginateDetails = (documentCount: number, req: Request) => {
  let nextPage, previousPage;
  const limit = (req.query.limit && +req.query.limit) || 10;
  const page = (req.query.page && +req.query.page) || 1;
  const startIndex = (page - 1) * limit; //2-1 = 1 * 10 = 10
  const endIndex = page * limit; //2 * 10 = 20 === 40
  const totalPages = Math.ceil(documentCount / limit);
  if (endIndex < documentCount) {
    nextPage = page + 1;
  }
  if (startIndex > 0) {
    previousPage = page - 1;
  }

  return {
    totalPages,
    currentPage: req.query.page || 1,
    previousPage,
    nextPage,
  };
};

export default GetRequestAPI;
