import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.agrichain.participants{
   export abstract class AgriChainParticipant extends Participant {
      participantID: string;
      firstName: string;
      Company: string;
      emailt: string;
   }
   export class AgriChainNetworkAdmin extends Participant {
      NetworkAdminID: string;
      firstName: string;
      Company: string;
      email: string;
   }
   export class Farmer extends AgriChainParticipant {
   }
   export class Wholesaler extends AgriChainParticipant {
   }
   export class Retailer extends AgriChainParticipant {
   }
// }
