import { Injectable } from 'angular2/core';
import { Http, Response, Jsonp, URLSearchParams } from 'angular2/http';
import { Headers, RequestOptions } from 'angular2/http';
import { ConfigService } from './Config.service';
@Injectable()
export class CCZDService {
	constructor(private jsonp: Jsonp, private http: Http, private configService: ConfigService) { }

	APIendpoint: string = '/api/FDCC';
	APIgenericpoint: string = '/api/Generic';
	IntegrationKey: string = 'integrations.zendesk';
	integrationtype = 'zendesk'

	Connect2ZD(ZDkey: string, ZDURL: string, ZDEmail: string, CCAPIkey: string, Username: string) {

		let Weburl = ZDURL + "/api/v2/ticket_fields.json";

		Weburl = this.configService.HttpURL + "api/ZendeskCC/getZendeskTicketFields?ZDURL=" + ZDURL + "&ZDKey=" + ZDkey + "&ZDEmail=" + ZDEmail;
		return this.FetchData(Weburl);



	}
	getZendeskcredentials(Username: string) {

		let Weburl = this.configService.HttpURL + "api/ZendeskCC/getZendeskcredentials?userName=" + Username + "&integrationtype=" + this.integrationtype;
		return this.FetchData(Weburl);



	}

	IsCCUserZDAuthenticated(Username: string, integrationType: string) {
		let Weburl = this.configService.HttpURL + this.APIgenericpoint + "/IsIntegrationUserAuthenticated?integrationType=" + integrationType + "&ccUsername=" + Username;
		return this.FetchData(Weburl);
	}

	saveUserCredentials(FDKey: string, FDURL: string, CCAPIkey: string, userName: string, integrationType: string) {
		let Weburl = this.configService.HttpURL + this.APIgenericpoint + "/saveUserCredentials?FDKEY=" + FDKey + "&FDURL=" + FDURL + "&CCAPIkey=" + CCAPIkey + "&ccUserName=" + userName + "&integrationType=" + integrationType;
		return this.FetchData(Weburl);
	}

	saveDefaultMappingsAndCredentials(integrationType: string, body: string) {
		let Weburl = this.configService.HttpURL + this.APIgenericpoint + "/saveDefaultMappings?integrationType=" + integrationType;
		return this.postdata(body, Weburl);
	}

	// Calls the API  given in parameters
	FetchData(Weburl: string): Promise<any> {

		let params = new URLSearchParams();
		params.set('search', '');
		params.set('action', '');
		params.set('format', 'json');
		params.set('callback', 'JSONP_CALLBACK');
		return this.jsonp.get(Weburl, { search: params }).map(request => <any>request.json()).toPromise();
	}

	CCAPIPost(body: any, Weburl: string, AccessToken: string): Promise<any> {
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append("Authorization", 'Bearer ' + AccessToken);
		return this.http.post(Weburl, body, { headers: headers })
			.map(response => response.json()).toPromise();

	}

	CCAPIGet(Weburl: string, AccessToken: string, authorizationType: string): Promise<any> {

		authorizationType = authorizationType || "Bearer ";
		var storeToken: any;
		var logError: any;
		var headers = new Headers();
		headers.append('accept', 'application/json');
		headers.append('content-type', 'application/json');
		headers.append('authorization', authorizationType + btoa(AccessToken));
		var obj = this.http.get(Weburl, { headers: headers }).map(request => <any>request.json()).toPromise();
		return obj;

	}

	//To get existing CC Tags
	GetExistingTags(Username) {
		var weburl = this.configService.HttpURL + this.APIendpoint + "/GetExistingQuestionTags?Username=" + Username;
		return this.FetchData(weburl);

	}

	//Retreiving Tags based on the location of the selected tag	
	GetTagonEdit(Questionid: string, Username: string) {

		let Weburl = this.configService.HttpURL + this.APIendpoint + '/GetTagonEdit?Questionid=' + Questionid + '&Username=' + Username;

		return this.FetchData(Weburl);
	}

	/**
	 * Compares the Tags in mapping with the  tags in CC, and skips the  mappings that has tags not present in tag list at CC, this normally occurs when Tags in CC are wantedly deleted from UI
	 * Questionslist: Questions that currently available in CC
	 * TagmappingBackup: backup list of all the existing mappings 
	 */
	SkipRemovedTagsinCC(Questionslist: any, TagmappingBackup: any) {
		var Questionids = "";
		for (var Qcounter = 0; Qcounter < Questionslist.length; Qcounter++) {
			for (var Tagmappingcounter = 0; Tagmappingcounter < TagmappingBackup.length; Tagmappingcounter++) {
				if (Questionslist[Qcounter].id == TagmappingBackup[Tagmappingcounter].QtnID) {
					if (Questionslist[Qcounter].questionTags.length == 0) {
						TagmappingBackup[Tagmappingcounter].Tag = "";
					}
					else {
						TagmappingBackup[Tagmappingcounter].Tag = Questionslist[Qcounter].questionTags[0];
					}
				}
			}

		}

		return TagmappingBackup;
	}

	postdata(body: string, Weburl: string): Promise<any> {


		var storeToken: any;
		var headers = new Headers();
		headers.append('Content-Type', 'application/x-www-form-urlencoded');
		headers.append('Accept', 'application/json');
		return this.http.post(Weburl, body, { headers: headers }).map(response => response.json()).toPromise();
	}

}


