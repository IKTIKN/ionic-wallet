import { TestBed } from '@angular/core/testing';

import { BlockExplorerService } from './block-explorer.service';

describe('BlockExplorerService', () => {
  let service: BlockExplorerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlockExplorerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
