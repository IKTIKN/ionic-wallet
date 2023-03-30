import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionsPage } from './transactions.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    TransactionsRoutingModule,
    SharedModule
  ],
  declarations: [TransactionsPage]
})
export class TransactionsPageModule {}
