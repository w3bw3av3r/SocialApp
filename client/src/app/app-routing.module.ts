import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './_guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { TestErrorComponent } from './errors/test-error/test-error.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { PreventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
    },
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            {
                path: 'members',
                component: MemberListComponent,
            },
            {
                path: 'members/:username',
                component: MemberDetailComponent,
            },
            {
                path: 'member/edit',
                // component: MemberEditComponent,
                loadComponent: () =>
                    import('./members/member-edit/member-edit.component').then(
                        (c) => c.MemberEditComponent
                    ),
                canDeactivate: [PreventUnsavedChangesGuard],
            },
            {
                path: 'lists',
                component: ListsComponent,
            },
            {
                path: 'messages',
                component: MessagesComponent,
            },
        ],
    },
    {
        path: 'errors',
        component: TestErrorComponent,
    },
    {
        path: 'not-found',
        component: NotFoundComponent,
    },
    {
        path: 'server-error',
        component: ServerErrorComponent,
    },
    {
        path: '**',
        pathMatch: 'full',
        component: NotFoundComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
