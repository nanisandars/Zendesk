import { Injectable } from 'angular2/core';
import { Http, Response, Jsonp, URLSearchParams } from 'angular2/http';
import { Headers, RequestOptions } from 'angular2/http';
@Injectable()
export class CCService {
    constructor(private jsonp: Jsonp, private http: Http) { }
    CCauthenticate(username: string, password: string): Promise<any> {
        var storeToken: any;
        var logError: any;
        var body = '';//`username=${username}&password=${password}`;
        body = 'grant_type=password&username=' + username + '&password=' + password + ''
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http
            .post('https://manage.getcloudcherry.com/api/LoginToken', body, { headers: headers })
            .map(response => response.json()).toPromise();
    }


    GetAPIKey(AccessToken: string) {
        let Weburl = "https://api.getcloudcherry.com/api/GenerateAPIKey";
        return this.CCAPIGet(Weburl, AccessToken);
    }

    PostMappings(Tagmappingbackup: any, integrationdata: any, AccessToken: string, IntegrationKey: string) {
        //Verifying if  mappings already exist or not.
        if (Tagmappingbackup.length == 0) {
            return "No mappings exist";
        }
        var logindata = null;
        var Preparedata = {
            "Mappings": Tagmappingbackup,
            "MappingsBackup": Tagmappingbackup
        };
        if (integrationdata == null) {
            integrationdata = Preparedata;
        }
        else {
            for (var counterbkp = 0; counterbkp < Tagmappingbackup.length; counterbkp++) {
                Tagmappingbackup[counterbkp].time = new Date();
                if (integrationdata.MappingsBackup == null)
                    integrationdata.MappingsBackup = [];
                integrationdata.MappingsBackup.push(Tagmappingbackup[counterbkp]);
            }
        }

        integrationdata.Mappings = Tagmappingbackup;
        var mappingstring = JSON.stringify(integrationdata);
        var Updateddata = {
            value: mappingstring
        };

        //Updating the mapping details into CC
        var errordetails = [];
        this.PostIntegrationData(Updateddata, AccessToken, IntegrationKey).then(function (data) {
            return "";
        }).catch(function (data) {
            return "Failed to save mappings, please try again";
        })


    }
    GetIntegrationData(AccessToken: string, IntegrationKey: string) {
        let Weburl = "https://api.getcloudcherry.com/api/UserData/" + IntegrationKey;

        return this.CCAPIGet(Weburl, AccessToken);
    }
    PostIntegrationData(body: any, AccessToken: string, IntegrationKey: string): Promise<any> {
        let Weburl = "https://api.getcloudcherry.com/api/UserData/" + IntegrationKey;
        var integrationdata: any;
        var Integrationdata = {
            "value": JSON.stringify(body)
        }
        return this.CCAPIPost(JSON.stringify(Integrationdata), Weburl, AccessToken)
    }

    CCAPIPost(body: any, Weburl: string, AccessToken: string): Promise<any> {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append("Authorization", 'Bearer ' + AccessToken);
        return this.http.post(Weburl, body, { headers: headers })
            .map(response => response.json()).toPromise();

    }

    CCAPIGet(Weburl: string, AccessToken: string): Promise<any> {
        var storeToken: any;
        var logError: any;
        var headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('Authorization', 'Bearer ' + AccessToken);
        return this.http
            .get(Weburl, { headers: headers })
            .map(request => <any>request.json()).toPromise();
    }
}
