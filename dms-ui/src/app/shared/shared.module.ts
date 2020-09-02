import { NgModule } from '@angular/core';
import { NumRestrictsDirective } from './directives/num-restricts.directive';
import { MaterialModule } from './modules/material-module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material';
import { OnlynumberDirective } from './directives/only-number.directive';

@NgModule({
  declarations: [NumRestrictsDirective, OnlynumberDirective],
  imports: [CommonModule, RouterModule, MaterialModule, MatTableModule],
  exports: [NumRestrictsDirective, OnlynumberDirective]
})
export class SharedModule {}
