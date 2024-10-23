import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { CampaignComponent } from './pages/campaign/campaign.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ErrorPageComponent } from "./pages/error-page/error-page.component";
import { PermissionsGuard } from "./core/guard/permissions-guard";
import { AuthGuard } from './core/guard/auth-guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'cms', // khi vào home mà chưa login -> thì auth guard sẽ redirect sang login
        pathMatch: 'full'
    },
    {
        path: 'http:',
        redirectTo: 'cms', // khi vào home mà chưa login -> thì auth guard sẽ redirect sang login
        pathMatch: 'full'
    },
    {
        path: 'https:',
        redirectTo: 'cms', // khi vào home mà chưa login -> thì auth guard sẽ redirect sang login
        pathMatch: 'full'
    },
    {
        path: 'cms',
        component: CampaignComponent,
        canActivateChild: [AuthGuard],
        canActivate: [PermissionsGuard],
        children: [
            {
                path: '',
                redirectTo: 'report',
                pathMatch: 'full'
            },
            {
                path: 'report',
                loadChildren: () => import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule),
            },
            {
                path: 'campaign',
                loadChildren: () => import('./modules/campaign/campaign.module').then((m) => m.CampaignModule),
            },
            {
                path: 'segment',
                loadChildren: () => import('./modules/segment/segment.module').then((m) => m.SegmentModule),
            },
            {
                path: 'reward',
                loadChildren: () => import('./modules/reward/reward.module').then((m) => m.RewardModule),
            },
            {
                path: 'reward/stockpile',
                loadChildren: () => import('./modules/reward-stockpile/reward-stockpile.module').then((m) => m.RewardStockpileModule),
            },
            {
                path: 'content',
                loadChildren: () => import('./modules/content/content.module').then((m) => m.ContentModule),
            },
            {
                path: 'workflow',
                loadChildren: () => import('./modules/workflow/workflow.module').then((m) => m.WorkflowModule),
            },
            {
                path: 'customer',
                loadChildren: () => import('./modules/customer/customer.module').then((m) => m.CustomerModule),
            },
            {
                path: 'workflow-chart',
                loadChildren: () => import('./modules/workflow-chart/workflow-chart.module').then((m) => m.WorkflowChartModule)
            },
            // {
            //     path: 'minhnc12',
            //     loadChildren: () => import('./modules/condition-workflow/condition-workflow.module').then((m) => m.ConditionWorkflowModule)
            // },
            {
                path: 'in-app-message',
                loadChildren: () => import('./modules/in-app-message/in-app-message.module').then((m) => m.InAppMessageModule)
            },
            {
                path: 'global-settings',
                loadChildren: () => import('./modules/global-settings/settings.module').then((m) => m.SettingsModule)
            },
            {
                path: 'content-cart',
                loadChildren: () => import('./modules/content-cart/content-cart.module').then((m) => m.ContentCartModule)
            }
        ]
    },
    {
        path: 'error/:id',
        component: ErrorPageComponent
    },
    {
        path: 'showcase',
        loadChildren: () => import('./showcase/showcase.module').then((m) => m.ShowcaseModule),
    },
    {
        path: '**',
        component: NotFoundComponent
    },
];

const config: ExtraOptions = {
    onSameUrlNavigation: 'reload',
};

@NgModule({
    imports: [RouterModule.forRoot(routes, config)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}