import { Component } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BaseUnsubscribe } from './base-unsubscribe';  // Import the base class

@Component({
  selector: 'app-example',
  template: '<p>Example Component</p>'
})
export class ExampleComponent extends BaseUnsubscribe {

  constructor() {
    super();
    
    // Example subscription
    someObservable$.pipe(
      takeUntil(this.ngUnSubscribe)
    ).subscribe((data) => {
      console.log(data);
    });
  }
}
