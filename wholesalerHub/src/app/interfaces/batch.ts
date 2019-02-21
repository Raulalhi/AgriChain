import { Crop } from "./crop";

export interface Batch {
  $class: string;
  batchID: string;
  storage: String;
  weight: number;
  batchDate: Date;
  bultos: String;
  owner: String;
  used: Boolean;
  crop;
  img?;
}
