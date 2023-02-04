import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
    imports: [
        CommonModule,
        ToastrModule.forRoot({ positionClass: 'toast-top-center' }),
        BsDropdownModule.forRoot(),
    ],
})
export class SharedModule {}
