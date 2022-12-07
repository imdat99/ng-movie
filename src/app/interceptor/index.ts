import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { LINK_REGEX } from '@app/constants';
import { BASE_URL } from '@app/constants/endpoint';

export const LocalInterceptorFn: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  let url = req.url;
  const isPath = !new RegExp(LINK_REGEX).test(url);
  const adjustedReq = req.clone({ url: isPath ? BASE_URL + url : url });
  return next(adjustedReq);
};
