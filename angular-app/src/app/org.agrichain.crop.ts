import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
import {AgriChainParticipant,Farmer} from './org.agrichain.participants';
// export namespace org.agrichain.crop{
   export class Crop extends Asset {
      cropID: string;
      type: CropType;
      organic: boolean;
      seedManufacturer: string;
      plantingDate: Date;
      pickupDate: Date;
      participantID: AgriChainParticipant;
      farm: Farm;
      treatments: Treatment[];
   }
   export class Farm extends Asset {
      farmID: string;
      location: string;
      farmerID: Farmer;
   }
   export class Treatment extends Asset {
      treatmentID: string;
      treatmentDate: Date;
      invoice: string;
      products: Product[];
   }
   export class Product extends Asset {
      productID: string;
      productName: string;
      productmanufacturer: string;
   }
   export class Irrigation extends Asset {
      irrigationID: string;
      irrigationDate: Date;
      nitrogenKGs: number;
      phosporousKGs: number;
      potassiumKGs: number;
      products: Product[];
   }
   export enum CropType {
      Cucumber,
      Watermelon,
      Tomato,
      Melon,
      Courgette,
      Aubergine,
      Pepper,
   }
   export class Packet extends Asset {
      packetID: string;
      packingDate: Date;
      size: string;
      expireDate: Date;
      cropID: Crop;
   }
   export class transferCrops extends Transaction {
      cropID: string;
      newOwner: AgriChainParticipant;
   }
   export class notifyParties extends Transaction {
   }
// }
