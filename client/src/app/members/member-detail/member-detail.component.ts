import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';

import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';

@Component({
    selector: 'app-member-detail',
    templateUrl: './member-detail.component.html',
    styleUrls: ['./member-detail.component.css'],
})
export class MemberDetailComponent implements OnInit {
    @ViewChild('memberTabs', { static: true }) memberTabs?: TabsetComponent;
    activeTab?: TabDirective;
    member: Member = {} as Member;
    galleryImages: NgxGalleryImage[] = [];
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
    messages: Message[] | undefined = [];

    constructor(
        private memberService: MembersService,
        private messageService: MessageService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.route.data.subscribe({
            next: (data) => {
                this.member = data['member'];
            },
        });

        this.route.queryParams.subscribe({
            next: (params) => {
                params['tab'] && this.selectTab(params['tab']);
            },
        });

        this.getImages();
    }

    getImages() {
        for (const photo of this.member.photos) {
            this.galleryImages = [
                ...this.galleryImages,
                {
                    small: photo.url,
                    medium: photo.url,
                    big: photo.url,
                },
            ];
        }
    }

    loadMessages() {
        if (this.member) {
            this.messageService
                .getMessageThread(this.member.userName)
                .subscribe({
                    next: (messages) => {
                        this.messages = messages;
                    },
                });
        }
    }

    selectTab(heading: string) {
        if (this.memberTabs) {
            this.memberTabs.tabs.find((t) => t.heading === heading)!.active =
                true;
        }
    }

    onTabActivated(data: TabDirective) {
        this.activeTab = data;
        if (this.activeTab.heading === 'Messages') {
            this.loadMessages();
        }
    }
}
