import ApiError from "../utils/ApiError.js";
import paginationSchema from "../validations/pagination.validation.js";

const pagination = (req, res, next) => {
    const result = paginationSchema.safeParse(req.query);

    if(!result.success){
        throw new ApiError(400, "Invalid pagination parameters", result.error.flatten().fieldErrors)
    }

    const {page, limit} = result.data;

    req.pagination = {
        page,
        limit,
        skip: (page - 1) * limit
    }

    next();
}

export default pagination;