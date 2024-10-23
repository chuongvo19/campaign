import { catchError } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CustomHttpUrlEncodingCodec } from 'src/app/core/providers/custom-http-url-encoding-codec';
import { ApiService } from '../api.service';
import {
    DetailCampaign,
    DetailChart,
    DetailPhoneInApp,
    DetailWorkFlow,
    DevicePreview,
    InappMessage,
    InappMessageInfo,
} from 'src/app/modules/in-app-message/models/in-app-message.model';

@Injectable({
    providedIn: 'root',
})
export class DetailInappMessageService extends ApiService {
    constructor(private readonly http: HttpClient) {
        super();
    }

    getCampaignsById(para?: any){
        const url = ${this.NF}/in-app/search-campaign?inAppId=;
        return this.http.get<DetailCampaign>(${url}${para}).pipe(catchError((res) => of(res)));
    }

    getPhoneInCampaign(para?: any): Observable<any>{
        let params = new HttpParams({
            encoder: new CustomHttpUrlEncodingCodec(),
        });
        const keys = [
            'msisdn',
            'campaignId',
            'workflowId',
            'workflowNodeId',
            'page',
            'size',
        ];
        keys.forEach((key) => {
            if(para && para[key] !== null){
                params = params.append(key, (para[key] || para[key] === 0) ? para[key] : null);
            }
        });
        const url = ${this.NF}/in-app/${para.inAppId}/phone-in-campaigns;
        return this.http.get<DetailPhoneInApp>(
            url,
            {params: params}
        )
        .pipe(catchError((res) => of(res)))
    }

    getWorkFlowInApp(para?: any){
        const url =  ${this.NF}/in-app/statistic-workflow-item;
        const body = {
            inAppId: para.inAppId
        }
        return this.http.post<DetailWorkFlow>(
            ${url},
            body
        )
        .pipe(catchError((res) => of(res)))
    }

    getDetailDataChart(para?: any): Observable<any>{
        let passingParams = para?.value
        passingParams.startDate = new Date(passingParams?.startDate).getTime()
        passingParams.endDate = new Date(passingParams?.endDate).getTime()

        const url = ${this.NF}/in-app/statistic-chart
        const body = {
            inAppId: passingParams.inAppId,
            startDate: passingParams.startDate,
            endDate: passingParams.endDate,
            campaignIds: passingParams.campaignIds
        }
        return this.http.post<DetailChart>(
            ${url},
            body
        )
        .pipe(catchError((res) => of(res)))
    }
}