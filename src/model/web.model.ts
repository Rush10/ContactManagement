export class WebResponse<T> {
  statusCode: number;
  message: string;
  data?: T;
  errors?: string;
  paging?: Paging;
}

export class Paging {
  current_page: number;
  total_page: number;
  size: number;
}
