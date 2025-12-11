import { axiosClassic } from '@/api/interceptors';
import { ApiRoutes, Status } from './constants';
import type {
  AllPalletsForBox,
  ChangePalletStatus,
  ChangeStatus,
  DeleteBox,
  DeletePallet,
  MoveBoxPayload,
  ReportGet,
} from '@/types/pages-types/report-types';
// import type { Report as MyReport } from '@/types/pages-types/report-types';
export type PalletsResponse = {
  palletNumber: number[];
};
export type UpdateBoxStatusResponse = {
  count: number;
};
export type getBoxStatusResponse = Status[];

export const getAllReport = async (): Promise<ReportGet[]> => {
  return (await axiosClassic.get(ApiRoutes.GET_REPORT)).data;
};

export const pushReportDB = async (data: any): Promise<boolean> => {
  return await axiosClassic.post(ApiRoutes.CREATE_REPORT, data);
};

export const moveCode = async (data: MoveBoxPayload): Promise<boolean> => {
  return await axiosClassic.patch(ApiRoutes.MOVE_REPORT, data);
};

export const PalletsAll = async (data: AllPalletsForBox) => {
  return await axiosClassic.post<any>(ApiRoutes.PALLETS_ALL, data);
};

export const changeStatus = async (data: ChangeStatus) => {
  return await axiosClassic.post<UpdateBoxStatusResponse>(ApiRoutes.CHANGE_STATUS, data);
};

export const getBoxStatus = async (data: ChangeStatus) => {
  return await axiosClassic.post<getBoxStatusResponse>(ApiRoutes.GET_STATUS, data);
};

export const deletePalleteForBox = async (data: AllPalletsForBox) => {
  return await axiosClassic.post<boolean>(ApiRoutes.DELETE_PALLET_FOR_BOX, data);
};

export const changePalletStatus = async (data: ChangePalletStatus) => {
  return await axiosClassic.patch<boolean>(ApiRoutes.CHANGE_PALLET_STATUS, data);
};

export const unpackPallet = async (data: DeletePallet) => {
  return await axiosClassic.patch<boolean>(ApiRoutes.UNPACK_PALLET, data);
};
export const unpackBox = async (data: DeleteBox) => {
  return await axiosClassic.patch<boolean>(ApiRoutes.UNPACK_BOX, data);
};

export const deletePallete = async (data: DeletePallet) => {
  return await axiosClassic.delete<boolean>(ApiRoutes.DELETE_PALLET, { data });
};

export const deleteBox = async (data: DeleteBox) => {
  return await axiosClassic.delete<boolean>(ApiRoutes.DELETE_BOX, { data });
};
