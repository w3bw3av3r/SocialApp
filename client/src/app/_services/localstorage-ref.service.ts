import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalstorageRefService {
    get localStorage(): Storage {
        return localStorage;
    }
}
