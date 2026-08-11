import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { Auth } from '../../core/services/auth';
import { UserRole } from '../../core/models';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective {
  private auth = inject(Auth);
  private templateRef = inject(TemplateRef<unknown>);
  private viewContainer = inject(ViewContainerRef);

  private allowedRoles: UserRole[] = [];

  @Input() set appHasRole(roles: UserRole | UserRole[]) {
    this.allowedRoles = Array.isArray(roles) ? roles : [roles];
    this.updateView();
  }

  constructor() {
    effect(() => {
      const currentRole = this.auth.userRole();
      this.updateView();
    });
  }

  private updateView() {
    const userRole = this.auth.userRole();
    const isAuthorized = this.allowedRoles.includes(userRole);

    if (isAuthorized) {
      if (this.viewContainer.length === 0) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    } else {
      this.viewContainer.clear();
    }
  }
}
