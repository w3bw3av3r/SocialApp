import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';

@Injectable({
    providedIn: 'root',
})
export class PreventUnsavedChangesGuard
    implements CanDeactivate<MemberEditComponent>
{
    canDeactivate(component: MemberEditComponent): boolean {
        if (component.editMemberForm?.dirty)
            return confirm('All unsaved changes will be lost? Continue?');

        return true;
    }
}
