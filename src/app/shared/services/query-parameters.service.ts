import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QueryParametersService {
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);

  public update(params: Record<string, any>, options: { replaceUrl?: boolean } = {}): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
      replaceUrl: options.replaceUrl ?? true
    }).then();
  }

  public watchParam(key: string): Observable<string | null> {
    return this.route.queryParamMap.pipe(
      map(params => params.get(key)),
      distinctUntilChanged()
    );
  }
}
