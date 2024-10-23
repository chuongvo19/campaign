import {Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as Highcharts from 'highcharts';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, tap, map, startWith } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { DetailChart } from '../../../models/in-app-message.model';
import { DetailInappMessageService } from 'src/app/services/in-app-mesage/detail-in-app-message.service';
import { TranslateService } from '@ngx-translate/core';
import { BaseUnsubscribe } from 'src/app/lib/components/base-unsubscribe';

type Legend = {
    id: number | 'all',
    name: string
    color: string
    key: string
}

@Component({
    selector: 'chart-in-app-detail',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss'],
})

export class MyChartComponent extends BaseUnsubscribe implements OnInit {
    dataRetrieved$: any;
    reloadChart$!: BehaviorSubject<boolean>;
    dateChange$ = new Subject();
    @Input() dataChart: DetailChart[] = [];
    listCampaign: { id: string | ''; name: string; }[] = [];
    listCampaignIds: string[] = []
    checkLanguage: any[] = [
        {
            name: this.translateService.instant(detail.cm-sent)
        },
        {
            name: this.translateService.instant(detail.phone-number)
        }
    ];
    saveChartData: any[] = [];
    chartFormat: any[] = [];
    legendConfigs: Legend[] = [
        { id: 'all', name: 'Tất cả', color: '', key: ''},
        { id: 1, name: 'In app đã gửi', color: '#ffff00', key: 'totalInAppSent'},
        { id: 2, name: 'Delivered', color: '#63a103', key: 'totalDelivered'},
        { id: 3, name: 'Displayed', color: '#8080ff', key: 'totalDisplayed'},
        { id: 4, name: 'Auto Dismissed', color: '#facd91', key: 'totalAutoDismissed'},
        { id: 5, name: 'Dismissed', color: '#00ffff', key: 'totalDismissed'},
        { id: 6, name: 'Clicked', color: '#ec808d', key: 'totalClicked'},
        { id: 7, name: 'Chuyển đổi', color: '#caf982', key: 'totalConverted'},
    ];


    legendsFilter: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    legendsFilterBackup: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    campaignFilter = [
    ];

    @Input() serverFilterForm!:FormGroup;
    @Output() afterChange = new EventEmitter();



    constructor(
        private detailInAppChart: DetailInappMessageService,
        private activatedRoute: ActivatedRoute,
        public translateService: TranslateService,
    ) {
        super();
    }

    ngOnInit(): void {
        window.scroll({ top: 0, left: 0, behavior: 'smooth' });
        const initCampaignIds = ['all'];
        this.serverFilterForm.get('campaignIds')?.patchValue(initCampaignIds)
        this.setUpStreams();
        this.reloadChart$.next(true);
        combineLatest(
            this.dateChange$.pipe(startWith(null)),
            this.serverFilterForm.controls['campaignIds'].valueChanges.pipe(
                startWith( initCampaignIds ),
                debounceTime(1000)
            )
        )
        .pipe(
            takeUntil(this.ngUnSubscribe),
            distinctUntilChanged(),
            tap( () => { this.afterChange.emit(); }),
            switchMap(value => this.detailInAppChart.getDetailDataChart(this.serverFilterForm))
        )
        .subscribe((res) => {
            if (res) {
                let result = res?.data?.content
                if(res?.data && res?.data?.content.length !== 0) {result.forEach(this.changeDate)}
                this.createChartLine(res?.data?.content);
                this.saveChartData = res?.data?.content;
            }
        });
    }

    changeDate(e: any) {
        let formatDate = new Date(e?.day).toLocaleDateString('en-GB');
        let a = e;
        a.day = formatDate
        return a;
    }

    handleOnChangeLegend(event?: any) {
        if(event[event.length-1] === 'all'){
            this.legendsFilterBackup = ['all']
            this.legendsFilter = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            this.createChartLine(this.saveChartData);
        }
        else if(event[0] === 'all' && event.length === 2){
            this.legendsFilter = event.slice(1, event.length);
            this.legendsFilterBackup = event.slice(1, event.length);
            this.createChartLine(this.saveChartData);
        }
        else{
            this.legendsFilter = event;
            this.legendsFilterBackup = event;
            this.createChartLine(this.saveChartData);
        }
    }

    setUpStreams() {
        this.handleOnChangeLegend(['all'])
        this.reloadChart$ = new BehaviorSubject<boolean>(true);
        this.activatedRoute.params.subscribe(params => {
            this.detailInAppChart
            .getCampaignsById(params['id'])
            .pipe(map((res) => {
                let temp: { campaignId: string | 'all'; name: string }[] = [
                    {campaignId: 'all', name: this.translateService.instant('in-app-message.status.all'),}
                ]
                if (res) {
                    res?.data?.content.forEach((item: any) => {
                        let tempItem = {
                            campaignId: item.campaignId,
                            name: item.name
                        }
                        temp.push(tempItem)
                        this.listCampaignIds.push(item.campaignId)
                    })
                }

                return temp
            }))
            .subscribe((val: any) => {
                this.listCampaign = val
            })
        })
    }

    changeCampaign(selectedCampaigns: any){
        if ( Array.isArray(selectedCampaigns) ){
           const selectedIds = selectedCampaigns?.length ? selectedCampaigns.map( cp => cp.campaignId ) : [];
           if ( selectedIds?.length > 1 || ( selectedIds?.length == 1 && selectedIds[0] != 'all' ) ){
                const cpLasted = selectedIds[selectedIds?.length - 1];
                if ( cpLasted == 'all' ){
                    this.serverFilterForm.get('campaignIds')?.patchValue( ['all']);
                } else{
                    this.serverFilterForm.get('campaignIds')?.patchValue( selectedIds.filter(cpId => cpId !== 'all') );
                }
           }
        }
    }

    returnChart(data: any) {
        Highcharts.setOptions({
            lang: {
              decimalPoint: '.',
              thousandsSep: ','
            }
        });

        const mychart = Highcharts.chart('chart-line', {
            chart: {
                type: 'line',
            },
            title: {
                text: null,
            },
            credits: {
                enabled: false,
            },
            legend: {
                // enabled: false,
            },
            yAxis: {
                title: {
                    text: null,
                }
            },
            xAxis: {
                categories: this.chartFormat[0],
                labels: {
                    enabled: false
                }
            },
            tooltip: {
                pointFormat:
                <div style="display: flex; color: gray">
                    <div style="background-color: {series.color}; width: 11px; height: 11px; margin-right: 5px; margin-top: 4px"></div>
                    {series.name}: {series.point.symbol}
                    <span style="font-weight: bold; margin-left: 5px; color: black">{point.y:,.0f}</span>
                </div>
                ,
                headerFormat: <div style="color: gray">{point.key}</div>,
                useHTML: true,
                shared: true,
                crosshairs: true,
            },
            plotOptions: {
                series: {
                    events: {
                        legendItemClick(e: any) {
                            e.preventDefault();
                        },
                    },
                },
            },
            series: data,
        } as any);
        return mychart;
    }

    createChartLine(dataChartDetail: DetailChart[]) {
        const data: any[] = [];
        const reMap: any[] = [];
        if(dataChartDetail?.length > 0){
            let key = []
            for(let i = 1; i < this.legendConfigs.length; i++){
                let resultsEach = []
                key.push(this.legendConfigs[i].key)
                for(let j = 0; j < dataChartDetail.length; j++){
                    let keyCheck = this.legendConfigs[i].key as keyof DetailChart
                    resultsEach.push(dataChartDetail[j][keyCheck])
                }
                reMap.push(resultsEach)
            }
            let chartData: { key: string; data: any; }[] = []
            for(let i = 0; i < key.length; i++){
                let objectMap = {key: key[i], data: reMap[i]}
                chartData.push(objectMap)
            }
            const check3 = chartData.map((item, index) => {
                return {
                    name: this.legendConfigs[index+1]?.name ? this.legendConfigs[index+1]?.name : 'hi',
                    data: chartData.filter((o) => o.key === this.legendConfigs[index+1].key)[0]?.data,
                    color: this.legendConfigs[index+1]?.color ? this.legendConfigs[index+1]?.color : 'a',
                    visible: this.legendsFilter.includes(index + 1),
                };
            })
            for (let i = 0; i < dataChartDetail?.length; i++) {
                data.push(Object.values(dataChartDetail[i]));
            }
            this.chartFormat = [];
            for (let j = 0; j < Object.values(dataChartDetail[0]).length; j++) {
                let element: any[] = [];
                data.forEach((pos) => {
                    element.push(pos[j]);
                });
                this.chartFormat.push(element);
            }
            this.returnChart(check3);
        }
        else{
            let defaultData = [{
                day: "",
                totalInAppSent: 0,
                totalDelivered: 0,
                totalDismissed: 0,
                totalDisplayed: 0,
                totalConverted: 0,
                totalAutoDismissed: 0,
                totalClicked: 0,
            }]
            for (let i = 0; i < defaultData.length; i++) {
                data.push(Object.values(defaultData[i]));
            }
            this.chartFormat = [];
            for (let j = 0; j < Object.values(defaultData[0]).length; j++) {
                let element: any[] = [];
                data.forEach((pos) => {
                    element.push(pos[j]);
                });
                this.chartFormat.push(element);
            }
            const temp = this.chartFormat.slice(1, this.chartFormat.length);
            const check2 = temp.map((item, index) => {
                return {
                    name: this.legendConfigs[index+1].name,
                    data: temp[index],
                    color: this.legendConfigs[index+1].color,
                    visible: this.legendsFilter.includes(index + 1),
                };
            });
            this.returnChart(check2);
        }

    }

    onDateChange($event: any){
        !$event && this.dateChange$.next($event)
    }
}