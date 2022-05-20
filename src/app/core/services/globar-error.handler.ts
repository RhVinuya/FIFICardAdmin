import { ErrorHandler, Injectable, Injector } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {


    constructor(private injector: Injector) { }

    handleError(error: Error) {
        // Obtain dependencies at the time of the error
        // This is because the GlobalErrorHandler is registered first
        // which prevents constructor dependency injection

        const err = {
            message: error.message ? error.message : error.toString(),
            stack: error.stack ? error.stack : ''
        };

        // Re-throw the error
        throw error;
    }
}
