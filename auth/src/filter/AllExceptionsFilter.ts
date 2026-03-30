import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter{

    catch(exception: any, host: ArgumentsHost) {
        const ctx=host.switchToHttp();
        const res=ctx.getResponse();

        const status = exception instanceof HttpException ?
            exception.getStatus() :
            HttpStatus.INTERNAL_SERVER_ERROR;;
        
        const message = exception instanceof HttpException ?
            exception.getResponse() :
            'INTERNAL SERVER ERROR';
        
        res.status(status).json({
            statusCode: status,
            message: message,
            timeStamp:new Date().toISOString(),
        });
    }
}