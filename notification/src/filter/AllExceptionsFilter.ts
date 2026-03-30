import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const type = host.getType();

        if (type === 'http') {
            const ctx = host.switchToHttp();
            const res = ctx.getResponse();

            const status = exception instanceof HttpException ?
                exception.getStatus() :
                HttpStatus.INTERNAL_SERVER_ERROR;
        
            const message = exception instanceof HttpException ?
                exception.getResponse() :
                'INTERNAL SERVER ERROR';
        
            return res.status(status).json({
                statusCode: status,
                message: message,
                timeStamp: new Date().toISOString(),
            });
        } 
        
        if (type === 'rpc') {
            throw new RpcException({
                status: 500,
                message: exception.message || 'INTERNAL SERVER ERROR',
                timeStamp: new Date().toISOString()
            });
        }
    }
}