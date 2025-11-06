import type { Status } from '@/services/constants';

export type ProductCode = string;

export type Box = {
  name: string;
  products: ProductCode[];
};

export type Pallet = {
  name: string;
  boxes: string[];
};

export type Units = {
  boxes: Box[];
  pallets: Pallet[];
};

export type Report = {
  filename: string;
  docId: string;
  StartDate: string;
  EndDate: string;
  gtin: string;
  ManufactureDate: string;
  BBD: string;
  Batch: string;
  Name: string;
  description: string;
  units: Units;
};

export type ReportMeta = {
  filename: string;
  Batch: string;
};

export type ReportGet = {
  id: string;
  startDate: string;
  endDate: string;
  gtin: string;
  manufactureDate: string;
  bbd: string;
  batch: string;
  codes: Code[];
  name: string;
  description: string;
  status: Status;
};

export type Code = {
  boxLabel: string;
  boxNumber: number;
  code: string;
  id: string;
  palletLabel: string;
  palletNumber: number;
  reportId: string;
  status: string;
};

export type MoveBoxPayload = {
  boxNumber: number;
  reportId: string;
  newPalletNumber?: number | null;
  newPalletLabel?: string | null;
};

export type AllPalletsForBox = Omit<MoveBoxPayload, 'newPalletNumber' | 'newPalletLabel'>;

export type ChangeStatus = AllPalletsForBox & {
  status?: Status;
};

export type Shipment = {};
