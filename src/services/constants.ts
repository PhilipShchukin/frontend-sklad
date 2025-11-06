export enum ApiRoutes {
  GET_REPORT = 'packaging',
  CREATE_REPORT = 'packaging/create',
  MOVE_REPORT = 'packaging/move',
  PALLETS_ALL = 'packaging/pallets/available',
  CHANGE_STATUS = 'packaging/change/box-status',
  GET_STATUS = 'packaging/get/box-status',
  DELETE_PALLET_FOR_BOX = 'packaging/delete-pallet-box',
  SHIPMENT = 'shipment',
  SHIPMENT_STOCK = 'shipment/stock',
  DATA = 'data/agents',
  SHIPMENT_TASK = 'shipment/task',
}

export enum Status {
  IN_STOCK = 'IN_STOCK',
  DAMAGED = 'DAMAGED',
  RESERVE = 'RESERVE',
  SHIPPED = 'SHIPPED',
}
