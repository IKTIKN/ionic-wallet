import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WalletPage } from './wallet.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { WalletPageRoutingModule } from './wallet-routing.module';
import { MainToolbarComponent } from 'src/app/components/main-toolbar/main-toolbar.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    WalletPageRoutingModule,
    SharedModule
  ],
  declarations: [WalletPage]
})
export class WalletPageModule {}
