export interface Packet {
  $class: String;
  packetID: String;
  size: Number;
  packingDate: number;
  expireDate: String;
  batchID: String;
  organic: Boolean;
  type: String;
  used: Boolean;
  owner: String;
  img?;
  shipment?;
  finalLocation?;
}
