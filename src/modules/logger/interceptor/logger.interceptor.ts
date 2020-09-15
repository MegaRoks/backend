import { Injectable, Inject, NestInterceptor, CallHandler, ExecutionContext } from '@nestjs/common';
import { Logger } from 'winston';
import { Observable } from 'rxjs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    constructor(@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) {}

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
        console.log(data);

        this.logger.info(data);
    }
}
