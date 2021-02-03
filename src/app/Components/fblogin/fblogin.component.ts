import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoginService } from 'src/app/Services/login.service';


@Component({
	selector: 'app-fblogin',
	templateUrl: './fblogin.component.html',
	styleUrls: ['./fblogin.component.scss'],
})
export class FbloginComponent implements OnInit {
	@Input() title;
	@Input() content;
	@Output() loginSuccess = new EventEmitter<any>();
	@Output() cancelEvent = new EventEmitter<any>();

	constructor(private loginService: LoginService) { }

	ngOnInit() { }
	
	fbLogin() {
		let result = this.loginService.login();
		if (result == true)
			this.cancel();
		try {
			if (this.loginSuccess)
				this.loginSuccess.emit();
		} catch (err) { }
	}

	cancel() {
		this.cancelEvent.emit();
	}
}
