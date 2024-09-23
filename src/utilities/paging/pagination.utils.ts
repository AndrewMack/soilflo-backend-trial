import { PaginationValidationError } from './pagination-validation.error';

export interface Pagination {
  page: number;
  size: number;
}

/**
 * Builds Pagination params with the provided Page & Page-Size.
 *
 * If Page & Page-Size are not provided, will return null.
 * @param page The targeted Page.
 * @param pageSize The number of records in a Page.
 * @returns Pagination | null
 */
export function validateAndBuildPaginationParams(
  page?: number,
  size?: number,
): Pagination {
  const pageNumber = Number.isNaN(page) ? undefined : page;
  const pageSize = Number.isNaN(size) ? undefined : size;

  if (pageNumber == null && pageSize == null) {
    return null;
  }

  if (pageNumber == null || pageSize == null) {
    throw new PaginationValidationError(
      'Page & Page-Size must both be provided.',
    );
  }

  return { page: pageNumber, size: pageSize };
}
