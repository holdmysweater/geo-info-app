import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Subscription, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InternationalizationService {
  private readonly service: TranslocoService = inject(TranslocoService);
  private subscription: Subscription | null = null;

  private readonly _options: string[] = ['ru', 'en'] as const;
  private readonly _language: WritableSignal<string> = signal<string>(this._options[0]!);

  public readonly language = this._language.asReadonly();

  constructor() {
    effect(() => {
      this.subscription?.unsubscribe();
      this.subscription = this.service
        .load(this._language())
        .pipe(take(1))
        .subscribe(() => {
            this.service.setActiveLang(this._language());
          }
        );
    });
  }

  public getOptions(): readonly string[] {
    return this._options;
  }

  public setLanguage(language: string): void {
    if (!this._options.includes(language)) {
      return;
    }

    this.service.setActiveLang(language);
    this._language.set(language);
  }
}
