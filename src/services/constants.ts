export enum ApiRoutes {
  GET_REPORT = '/packaging',
  CREATE_REPORT = '/packaging/create',
  MOVE_REPORT = '/packaging/move',
  PALLETS_ALL = '/packaging/pallets/available',
  CHANGE_STATUS = '/packaging/change/box-status',
  GET_STATUS = '/packaging/get/box-status',
  DELETE_PALLET_FOR_BOX = '/packaging/delete-pallet-box',
  // SHIPMENT = 'shipment',
  // SHIPMENT_STOCK = 'shipment/stock',
  DATA = '/data/agents',
  // SHIPMENT_TASK = 'shipment/task',
  CHANGE_PALLET_STATUS = '/packaging/pallet/status',
  UNPACK_PALLET = '/packaging/pallet/unpack',
  UNPACK_BOX = '/packaging/box/unpack',
  DELETE_PALLET = '/packaging/pallet/delete',
  DELETE_BOX = '/packaging/box/pallet',
}
export enum ApiRoutesTauri {
  SAVE_TAURI_XML = '/device-sync/xml',
  SAVE_TAURI_CSV = '/device-sync/csv',
}

export enum ApiRoutesShipment {
  SHIPMENT_AGENT = '/shipment/agents',
  SHIPMENT_REPORT = '/shipment/report',
}

export enum Status {
  IN_STOCK = 'IN_STOCK',
  DAMAGED = 'DAMAGED',
  RESERVE = 'RESERVE',
  SHIPPED = 'SHIPPED',
}
