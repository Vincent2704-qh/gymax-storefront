export interface BasePaginationDto {
  page?: number;
  limit?: number;
}

export interface MetaPagination {
  currentPage: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Meta {
  pagination: MetaPagination;
}
export interface BasePaginationResponse<T> {
  message: string;
  body: T[];
  meta: Meta;
}
