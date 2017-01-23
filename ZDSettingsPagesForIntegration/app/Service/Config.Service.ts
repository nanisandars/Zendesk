import { Injectable } from 'angular2/core';
import { Http, Response, Jsonp, URLSearchParams } from 'angular2/http';
import { Headers, RequestOptions } from 'angular2/http';
@Injectable()
export class ConfigService {
    constructor(private jsonp: Jsonp, private http: Http) { }
    HttpURL: string = "http://xx.xxx.xxx.xx:<portnumber>/";//" "http://42.104.96.38:1557/"; 

// Calls the API  given in parameters
FetchData(Weburl: string):Promise < any > {
    Weburl=this.HttpURL + Weburl;		
    let params = new URLSearchParams();
    params.set('search', '');
    params.set('action', '');
    params.set('format', 'json');
    params.set('callback', 'JSONP_CALLBACK');
    return this.jsonp
        .get(Weburl, { search: params })
        .map(request => <any>request.json()).toPromise();
}
	CCAPIGet(Weburl: string, AccessToken: string):Promise < any > {
	
		var storeToken: any;
		var logError: any;
		var headers = new Headers();
		headers.append('Accept', 'application/json');
		headers.append('Authorization', 'Bearer ' + AccessToken);

		return this.http
			.get(Weburl, { headers: headers })
			.map(request => <any>request.json()).toPromise();
	}
       CCAPIPost(body: any, Weburl: string, AccessToken: string): Promise<any> {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("Authorization", 'Bearer ' + AccessToken);
        return this.http.post(Weburl, JSON.stringify(body), { headers: headers })
            .map(response => response.json()).toPromise();

    }
}
