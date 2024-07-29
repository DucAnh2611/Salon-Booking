export interface IBaseInitialState {
    isCalling: boolean;
    isFailure: boolean;
}
export interface ICRUDInitialState extends IBaseInitialState {
    isDeleting: boolean;
    isUpdating: boolean;
    isCreating: boolean;
    reload: boolean;
}
