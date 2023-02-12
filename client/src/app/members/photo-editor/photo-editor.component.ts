import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { Photo } from 'src/app/_models/photo';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

const URL = 'https://localhost:5001/api/v1/users/add-photo';

@Component({
    selector: 'app-photo-editor',
    templateUrl: './photo-editor.component.html',
    styleUrls: ['./photo-editor.component.css'],
})
export class PhotoEditorComponent implements OnInit {
    @Input() member: Member | undefined;
    uploader: FileUploader | undefined;
    hasImageDropzoneOver = false;
    response = '';
    user = this.accountService.currentUserValue;

    constructor(
        private accountService: AccountService,
        private memberService: MembersService,
        private toast: ToastrService
    ) {
        this.uploader = new FileUploader({
            url: URL,
            authToken: `Bearer ${this.user?.token}`,
            isHTML5: true,
            allowedFileType: ['image'],
            removeAfterUpload: true,
            autoUpload: false,
            maxFileSize: 10 * 1024 * 1024,
        });

        this.uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        };

        this.uploader.onSuccessItem = (item, response, status, headers) => {
            if (response) {
                const photos = JSON.parse(response);
                this.member?.photos.push(photos);
                if (photos.isMain && this.user && this.member) {
                    this.user.photoUrl = this.member.photoUrl = photos.url;
                    this.accountService.setCurrentUser(this.user);
                }
            }
        };
        this.hasImageDropzoneOver = false;
    }

    ngOnInit(): void {}

    fileOverImageDropzone(e: any) {
        this.hasImageDropzoneOver = e;
    }

    setMainPhoto(photo: Photo) {
        this.memberService.setMainPhoto(photo.id).subscribe({
            next: () => {
                if (this.user && this.member) {
                    this.user.photoUrl = this.member.photoUrl = photo.url;
                    this.accountService.setCurrentUser(this.user);
                    this.member.photos.forEach((p) => {
                        if (p.isMain) p.isMain = false;
                        if (p.id === photo.id) p.isMain = true;
                    });
                }
            },
        });
    }

    deletePhoto(photoId: number) {
        this.memberService.deletePhoto(photoId).subscribe({
            next: () => {
                if (this.member) {
                    this.member.photos = this.member.photos.filter(
                        (p) => p.id !== photoId
                    );
                }
            },
        });
    }
}
