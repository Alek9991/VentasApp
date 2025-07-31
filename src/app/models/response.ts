export interface Response<T = any> {
    exito: number;
    mensaje: string;
    //data: any;
    data: T;
}