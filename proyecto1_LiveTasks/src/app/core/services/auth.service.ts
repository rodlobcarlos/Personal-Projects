import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
  getIdToken,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { Observable, from, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = getAuth(initializeApp(environment.firebase));
  private readonly router = inject(Router);

  readonly user = signal<User | null>(null);
  readonly authState$: Observable<User | null>;

  constructor() {
    this.authState$ = new Observable<User | null>((subscriber) => {
      const unsubscribe = onAuthStateChanged(
        this.auth,
        (user) => subscriber.next(user),
        (error) => subscriber.error(error),
      );
      return unsubscribe;
    });
    this.authState$.subscribe((user) => this.user.set(user));
  }

  getIdToken(): Observable<string | null> {
    const current = this.auth.currentUser;
    return from(current ? getIdToken(current) : Promise.resolve(null));
  }

  signIn(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  signUp(name: string, email: string, password: string): Observable<UserCredential> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password).then(async (credential) => {
        await updateProfile(credential.user, { displayName: name });
        return credential;
      }),
    );
  }

  signInWithGoogle(): Observable<UserCredential> {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider()));
  }

  logOut(): Observable<void> {
    return from(signOut(this.auth)).pipe(tap(() => this.router.navigate(['/auth/login'])));
  }

  errorKey(error: unknown): string | null {
    const code = (error as { code?: string } | null)?.code ?? '';
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/invalid-login-credentials':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'auth.invalidCredentials';
      case 'auth/email-already-in-use':
        return 'auth.emailInUse';
      case 'auth/weak-password':
        return 'auth.weakPassword';
      case 'auth/invalid-email':
        return 'auth.invalidEmail';
      case 'auth/too-many-requests':
        return 'auth.tooManyRequests';
      case 'auth/popup-closed-by-user':
      case 'auth/cancelled-popup-request':
        return null;
      default:
        return 'auth.genericError';
    }
  }
}
