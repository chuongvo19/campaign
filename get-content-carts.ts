getContentCarts(urlParams: ParamsGetListInApp) {
    const filterParams: ParamsGetListInApp | any =  utils.pickBy(urlParams, (value, key)  => key == 'campaignId' || (value != 'all' && value != null) );
    let params = new HttpParams({
        encoder: new CustomHttpUrlEncodingCodec(),
    });
    const keys = ['page', 'size']
    keys.forEach((key) => {
        if( (filterParams && filterParams[key] !== null ) || key == 'campaignId'){
            params = params.append(key, filterParams[key]);
        }
    });
    
    return this.http.post<Response<InAppMessageData[]>>(${this.NF}/in-app/search, filterParams, {params: params});
}

getContentCartStatistic(
    params: {
        inAppMessageContentIds: string[] | [],
        campaignIds: string[] | [],
    }
){
    return this.http.post<Response<InAppMessageData[]>>(${this.NF}/in-app/search-with-statistics, params);
}