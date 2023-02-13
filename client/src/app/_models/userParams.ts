import { User } from './user';

export class UserParams {
    gender: string;
    minAge = 18;
    maxAge = 80;
    pageNumber = 1;
    pageSize = 12;
    orderBy = 'listActive';

    constructor(user: User) {
        this.gender = user.gender === 'female' ? 'male' : 'female';
    }
}
