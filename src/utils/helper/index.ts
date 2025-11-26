import { HttpException } from '@nestjs/common';
import { ResponseCode, ResponseMessage } from '@utils/enum';
import { ApiQueryFilters } from '../../models/models';
import { PaginationMeta } from '@modules/common/responses';

export const generateOTP = (): number => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const generateRandomIndex = (): number => {
  return Math.floor(Math.random() * 50);
};

export class Exception {
  constructor(responseCode?: ResponseCode, responseMessage?: ResponseMessage) {
    throw new HttpException(
      {
        statusCode: responseCode || ResponseCode.GENERIC_ERROR,
        message: responseMessage || ResponseMessage.GENERIC_ERROR,
      },
      ResponseCode.BAD_REQUEST,
    );
  }
}

/**
 * Generates a random string of the specified length.
 * If isNumeric is true, the string will contain only numbers.
 * If isNumeric is false, the string will contain alphanumeric characters.
 *
 * @param {number} length - The length of the generated string.
 * @param {boolean} isNumeric - Whether to generate a numeric string. Defaults to false.
 * @returns {string} A random string of the specified length.
 */
export const generateRandomString = (length, isNumeric = false) => {
  const alphanumericCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const numericCharacters = '0123456789';

  const characters = isNumeric ? numericCharacters : alphanumericCharacters;
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function withPagination<T>(params: ApiQueryFilters): { meta: PaginationMeta; data: T[] } {
  const page = Number(params.page);
  const limit = Number(params.pageSize);
  const { count = 0, data = [] } = params;
  const totalItems = count;
  const itemCount = data.length;
  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = page;

  // Build the meta object
  const meta: PaginationMeta = {
    currentPage,
    itemCount,
    itemsPerPage: limit,
    totalPages,
    totalItems,
  };

  return { meta, data };
}
