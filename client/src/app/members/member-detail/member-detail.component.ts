import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage } from '@kolkov/ngx-gallery';
import { tap } from 'rxjs/operators';
import { MembersService } from 'src/app/_services/members.service';

@Component({
    selector: 'app-member-detail',
    templateUrl: './member-detail.component.html',
    styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit {
    memberUsername = this.route.snapshot.paramMap.get('username')!;
    member$ = this.memberService.getMember(this.memberUsername).pipe(
        tap((member) => {
            for (const photo of member.photos) {
                this.galleryImages = [
                    ...this.galleryImages,
                    { small: photo.url, medium: photo.url, big: photo.url },
                ];
            }
        })
    );
    galleryOptions = [
        {
            width: '600px',
            height: '400px',
            arrowPrevIcon: 'fa fa-chevron-left',
            arrowNextIcon: 'fa fa-chevron-right',
            imagePercent: 100,
            thumbnailsColumns: 4,
            imageAnimation: NgxGalleryAnimation.Slide,
            preview: true,
        },
    ];
    galleryImages: NgxGalleryImage[] = [];

    constructor(
        private memberService: MembersService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {}
}
