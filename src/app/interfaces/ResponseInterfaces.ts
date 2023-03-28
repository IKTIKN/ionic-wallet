export interface MultiAddressResponse {
    addresses: AddressResponse[]
    wallet: Balance
    txs: Tx[]
    info: Info
    recommend_include_fee: boolean
  }
  
  export interface AddressResponse {
    address: string
    final_balance: number
    n_tx: number
    total_received: number
    total_sent: number
  }
  
  export interface Balance {
    final_balance: number
    n_tx: number
    n_tx_filtered: number
    total_received: number
    total_sent: number
  }
  
  export interface Tx {
    hash: string
    ver: number
    vin_sz: number
    vout_sz: number
    size: number
    weight: number
    fee: number
    relayed_by: string
    lock_time: number
    tx_index: number
    double_spend: boolean
    time: number
    block_index: number
    block_height: number
    inputs: Input[]
    out: Out[]
    result: number
    balance: number
  }
  
  export interface Input {
    sequence: number
    witness: string
    script: string
    index: number
    prev_out: PrevOut
  }
  
  export interface PrevOut {
    addr: string
    n: number
    script: string
    spending_outpoints: SpendingOutpoint[]
    spent: boolean
    tx_index: number
    type: number
    value: number
  }
  
  export interface SpendingOutpoint {
    n: number
    tx_index: number
  }
  
  export interface Out {
    type: number
    spent: boolean
    value: number
    spending_outpoints: SpendingOutpoint2[]
    n: number
    tx_index: number
    script: string
    addr: string
  }
  
  export interface SpendingOutpoint2 {
    tx_index: number
    n: number
  }
  
  export interface Info {
    nconnected: number
    conversion: number
    symbol_local: SymbolLocal
    symbol_btc: SymbolBtc
    latest_block: LatestBlock
  }
  
  export interface SymbolLocal {
    code: string
    symbol: string
    name: string
    conversion: number
    symbolAppearsAfter: boolean
    local: boolean
  }
  
  export interface SymbolBtc {
    code: string
    symbol: string
    name: string
    conversion: number
    symbolAppearsAfter: boolean
    local: boolean
  }
  
  export interface LatestBlock {
    hash: string
    height: number
    time: number
    block_index: number
  }
  