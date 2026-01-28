export enum ApiRoutes {
  GET_REPORT = '/packaging',
  CREATE_REPORT = '/packaging/create',
  PORTAL = '/packaging/portal',
  MOVE_REPORT = '/packaging/move',
  PALLETS_ALL = '/packaging/pallets/available',
  CHANGE_STATUS = '/packaging/change/box-status',
  GET_STATUS = '/packaging/get/box-status',
  DELETE_PALLET_FOR_BOX = '/packaging/delete-pallet-box',
  AGENTS_LIST = '/data/agents',
  CHANGE_PALLET_STATUS = '/packaging/pallet/status',
  UNPACK_PALLET = '/packaging/pallet/unpack',
  UNPACK_BOX = '/packaging/box/unpack',
  DELETE_PALLET = '/packaging/pallet/delete',
  DELETE_BOX = '/packaging/box/pallet',
}
export enum ApiRoutesTauri {
  SAVE_TAURI_XML = '/device-sync/xml',
  SAVE_TAURI_CSV = '/device-sync/csv',
  SAVE_TAURI_TXT = '/device-sync/txt',
  SAVE_TAURI_XLSX = '/device-sync/xlsx',
}

export enum ApiRoutesShipment {
  SHIPMENT_GTINS = '/shipment/gtin',
  SHIPMENT_REPORT = '/shipment/report',
  FIND_ALL = '/android/find-all',
  LABUBU = '/android/labubu',
  SHIPMENT_AGENT_REPORTS = '/shipment/agents-reports',
}

export enum Status {
  IN_STOCK = 'IN_STOCK',
  DAMAGED = 'DAMAGED',
  RESERVE = 'RESERVE',
  SHIPPED = 'SHIPPED',
}

export enum Marking {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}
