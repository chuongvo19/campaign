import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreateInAppMesageComponent } from "./pages/create-in-app-mesage/create-in-app-mesage.component";
import { SendTestComponent } from "./pages/create-in-app-mesage/send-test/send-test.component";
import { DetailInAppMesageComponent } from "./pages/detail-in-app-mesage/detail-in-app-mesage.component";
import { ManageInAppMesageComponent } from "./pages/manage-in-app-mesage/manage-in-app-mesage.component";
import { CreateResolver } from "./pages/create-in-app-mesage/create-resolver";
import { ConfirmDeactivateGuard } from "./services/can-deactivate-guard.service";
import { AuthorGuard } from "../../core/guard/author-guard";
import { PERMS } from "../../core/constants/perms.constant";

const routes: Routes = [
  {
    path: "",
    component: ManageInAppMesageComponent,
    canActivate: [AuthorGuard],
    data: {
      permissions: {
        only: [
          PERMS.CONTENT_IN_APP.POST,
          PERMS.CONTENT_IN_APP.GET,
          PERMS.CONTENT_IN_APP_STATISTIC.POST,
          PERMS.CONTENT_IN_APP_EDIT.DELETE,
        ],
      },
    },
  },
  {
    path: "createMessage",
    component: CreateInAppMesageComponent,
    resolve: {
      dataDeviceList: CreateResolver,
    },
    canActivate: [AuthorGuard],
    data: {
      permissions: {
        only: [PERMS.CONTENT_IN_APP_EDIT.POST],
      },
    },
  },
  {
    path: "updateMessage/:id",
    canDeactivate: [ConfirmDeactivateGuard],
    component: CreateInAppMesageComponent,
    resolve: {
      dataDeviceList: CreateResolver,
    },
    canActivate: [AuthorGuard],
    data: {
      permissions: {
        only: [PERMS.CONTENT_IN_APP_EDIT.POST],
      },
    },
  },
  {
    path: "detailMessage/:id",
    component: DetailInAppMesageComponent,
    resolve: {
      dataDeviceList: CreateResolver,
    },
    canActivate: [AuthorGuard],
    data: {
      permissions: {
        only: [
          PERMS.CONTENT_IN_APP.POST,
          PERMS.CONTENT_IN_APP.GET,
          PERMS.CONTENT_IN_APP_STATISTIC.POST,
          PERMS.CONTENT_IN_APP_EDIT.DELETE,
        ],
      },
    },
  },
  {
    path: "test",
    component: SendTestComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InAppMessageRoutingModule {}
