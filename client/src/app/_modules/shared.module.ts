import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ToastrModule } from 'ngx-toastr';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FileUploadModule } from 'ng2-file-upload';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@NgModule({
    imports: [
        CommonModule,
        TooltipModule.forRoot(),
        BsDropdownModule.forRoot(),
        TabsModule.forRoot(),
        ToastrModule.forRoot({ positionClass: 'toast-bottom-right' }),
        NgxGalleryModule,
        NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
        FileUploadModule,
        BsDatepickerModule.forRoot(),
        PaginationModule.forRoot(),
        ButtonsModule.forRoot(),
    ],
    exports: [
        TooltipModule,
        BsDropdownModule,
        TabsModule,
        ToastrModule,
        NgxGalleryModule,
        NgxSpinnerModule,
        FileUploadModule,
        BsDatepickerModule,
        PaginationModule,
        ButtonsModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
