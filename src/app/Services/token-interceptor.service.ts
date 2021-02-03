import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { LoginService } from './login.service';

@Injectable({
    providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

    private loginService;

    constructor(private injector: Injector) {
        this.loginService = this.injector.get(LoginService);
    }

    intercept(req, next) {
        const token = this.loginService.getToken();
        let tokenizedReq = req.clone({
            setHeaders: {
                Authorization: `Barer ${token}`,
                'x-auth-token': token
            }
        });
        return next.handle(tokenizedReq);
    }
}
