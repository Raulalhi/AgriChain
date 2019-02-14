import { Crop } from "./crop";

export interface Batch {
  $class: string;
  batchID: string;
  storage: String;
  weight: Float32Array;
  batchDate: Date;
  bultos: String;
  crop;
  img?;
}
