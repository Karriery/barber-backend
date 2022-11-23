import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { user, method, url } = context.switchToHttp().getRequest();
    console.log({
      method: method,
      endpoint: url,
      //@ts-ignore
      user: user && user.email ? user.email : "Anonymous",
    });

    return next.handle();
  }
}
