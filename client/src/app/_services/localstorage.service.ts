import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LocalstorageRefService } from './localstorage-ref.service';

@Injectable({ providedIn: 'root' })
export class LocalstorageService {
    private _localStorage: Storage;

    constructor(private _localStorageRefService: LocalstorageRefService) {
        this._localStorage = this._localStorageRefService.localStorage;
    }

    getItem(key: string): Observable<string | null> {
        const data = this._localStorage.getItem(key);
        if (data) return of(data);

        return of(null);
    }

    setItem(key: string, data: string): Observable<string> {
        this._localStorage.setItem(key, data);
        return of(data);
    }

    removeItem(key: string): Observable<boolean> {
        this._localStorage.removeItem(key);
        return of(true);
    }
}
