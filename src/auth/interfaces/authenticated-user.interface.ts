export interface AuthenticatedUser {
    _id: string;
    name: string;
    surname?: string;
    email: string;
}