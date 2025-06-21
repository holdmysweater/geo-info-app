import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QueryParametersService {
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);

  public update(params: Record<string, any>, options: { replaceUrl?: boolean } = {}) {
    return this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
      replaceUrl: options.replaceUrl ?? true
    });
  }

  public watchParam(key: string) {
    return this.route.queryParamMap.pipe(
      map(params => params.get(key)),
      distinctUntilChanged()
    );
  }
}
