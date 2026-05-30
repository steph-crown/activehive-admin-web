export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type SortOrder = "ASC" | "DESC";

export type PaginatedResponse<T> = {
  data: T[];
  pagination: PaginationMeta;
};
