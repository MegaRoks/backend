import { Injectable, Inject, NestInterceptor, CallHandler, ExecutionContext, LoggerService } from '@nestjs/common';
import { Observable } from 'rxjs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    constructor(@Inject(WINSTON_MODULE_PROVIDER) private logger: LoggerService) {}

    public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        this.log(context.switchToHttp().getRequest());
        return next.handle();
    }

    private log(req): void {
        const body = { ...req.body };
        delete body.password;
        delete body.passwordConfirmation;
        const user = (req as any).user;
        const userEmail = user ? user.email : null;
        const data = {
            timestamp: new Date().toISOString(),
            method: req.method,
            route: req.route.path,
            data: {
                body: body,
                query: req.query,
                params: req.params,
            },
            from: req.ip,
            madeBy: userEmail,
        };
        this.logger.log(data);
    }
}
