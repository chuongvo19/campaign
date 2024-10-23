setUpStreams() {
    this.page$ = new BehaviorSubject<Pagination>(this.pagination);
    this.reloadList$ = new BehaviorSubject<boolean>(true);
    combineLatest(
        this.search$.pipe(
            startWith(this.filterForm.value),
            debounceTime(500),
            tap(() => {
                //handle validate recall api list filter
                this.page$.next({
                ...this.page$.getValue(),
                currentPage: 0,
                });
            }),
            filter(() => this.filterForm?.valid ),
        ),
        this.page$.
        pipe(
            distinctUntilChanged(
                (a: Pagination, b: Pagination) => a.currentPage === b.currentPage && a.pageSize === b.pageSize
            )
        ),
        this.reloadList$
    )
        .pipe(
            takeUntil(this.ngUnSubscribe),
            tap(() => {
                this.isLoadingStatistic = true;
            }),
            switchMap(([filterFormVal, page]) => {                                        
                return this.contentCartService
                    .getContentCarts({
                        query: filterFormVal?.searchText?.trim(),
                        status: filterFormVal?.status,
                        usageStatus: filterFormVal?.usageStatus,
                        fromDate: filterFormVal?.fromDate ? filterFormVal?.fromDate?.getTime() : null,
                        toDate: filterFormVal?.toDate ? filterFormVal?.toDate?.getTime() : null,
                        page: page?.currentPage,
                        size: page?.pageSize,
                        campaignId:
                            filterFormVal.campaign?.length && filterFormVal.campaign[0] == 'all'
                                ? this.listCampaignIds
                                : filterFormVal.campaign?.length
                                ? filterFormVal.campaign
                                : null,
                    })
                    .pipe(
                        tap((res: any) => {
                            this.contentCart = res?.data?.items ?? [];
                            console.log('3------',this.contentCart);
                            this.totalRecord = res?.data?.total ?? 0;
                            this.isShowNoRecord = true;
                        }),
                        catchError(() => {
                            this.isLoadingStatistic = false;
                            return of(null);
                        }),
                        switchMap((res) => {
                            // Get statistics
                            if (
                                res?.data?.items?.length &&
                                this.ngxPermissionsService.getPermission(PERMS.CONTENT_IN_APP_STATISTIC.POST)
                            ) {
                                return this.contentCartService
                                    .getContentCartStatistic({
                                        inAppMessageContentIds: res?.data?.items.map(
                                            (item: InAppMessageData) => item.inAppContentId
                                        ),
                                        campaignIds:
                                            !filterFormVal.campaign ||
                                            (filterFormVal.campaign?.length && filterFormVal.campaign[0] == 'all')
                                                ? this.listCampaignIds
                                                : filterFormVal.campaign?.length
                                                ? filterFormVal.campaign
                                                : [],
                                    })
                                    .pipe(
                                        tap((statisticRes: any) => {
                                            this.contentCart = this.contentCart.map(
                                                (message: InAppMessageData | any) => {
                                                    const messageStatistic = statisticRes.data.find(
                                                        (statistic: InAppMessageData) =>
                                                            statistic.inAppContentId == message.inAppContentId
                                                    );
                                                    const statisticKeys = [
                                                        'totalCMSent',
                                                        'totalCMSentSuccess',
                                                        'totalConverted',
                                                        'totalDismissed',
                                                        'totalDisplayed',
                                                        'totalInAppDelivered',
                                                        'totalInAppSent',
                                                        'totalAutoDismissed',
                                                        'totalClicked',
                                                    ];
                                                    statisticKeys.forEach((key) => {
                                                        message[key] = messageStatistic[key];
                                                    });
                                                    return message;
                                                }
                                            );
                                            this.isLoadingStatistic = false;
                                        }),
                                        catchError(() => {
                                            this.isLoadingStatistic = false;
                                            return of(null);
                                        })
                                    );
                            } else {
                                this.isLoadingStatistic = false;
                                return of([]);
                            }
                        })
                    );
            })
        )
        .subscribe((res: any) => {});
        
}