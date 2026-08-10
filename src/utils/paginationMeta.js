const createPaginationMeta = ({page, limit, hasNextPage }) => {

    return {
        page,
        limit,
        hasNextPage,
        hasPreviousPage: page > 1
    }
}

export default createPaginationMeta;