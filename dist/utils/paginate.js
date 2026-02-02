"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = void 0;
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
class Pagination {
    static paginate(req, res) {
        return new Promise((resolve) => {
            let page;
            let pageSize;
            if (req.query.page !== undefined && Number(req.query.page) !== 0) {
                if (!Pagination.isPositiveInteger(req.query.page.toString())) {
                    res.status(400).send(`Invalid value for parameter 'page': ${req.query.page.toString()}`);
                    return;
                }
                page = Number(req.query.page.toString());
            }
            else
                page = 1;
            if (req.query.pageSize !== undefined) {
                if (!Pagination.isPositiveInteger(req.query.pageSize.toString())) {
                    res.status(400).send(`Invalid value for parameter 'pageSize': ${req.query.pageSize.toString()}`);
                    return;
                }
                pageSize = Number(req.query.pageSize.toString());
                if (pageSize > Pagination.limit_page_size) {
                    res.status(400).send(`Page size cannot be a number greater than 100: ${pageSize}`);
                    return;
                }
            }
            else
                pageSize = 10;
            const paginationOption = {
                page,
                limit: pageSize,
                paginationType: nestjs_typeorm_paginate_1.PaginationTypeEnum.LIMIT_AND_OFFSET,
            };
            return resolve(paginationOption);
        });
    }
    static isInteger(value) {
        return /^[+\-]?([0-9]+)$/.test(value);
    }
    static isPositiveInteger(value) {
        return /^(\+)?([0-9]+)$/.test(value);
    }
    static isNegativeInteger(value) {
        return /^\-([0-9]+)$/.test(value);
    }
}
exports.Pagination = Pagination;
Pagination.limit_page_size = 100;
//# sourceMappingURL=paginate.js.map