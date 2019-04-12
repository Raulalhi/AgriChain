'use strict';

/**
 * Process new product recall case
 * @param {org.agrichain.crop.productRecall} data.packet - Packet affected
 * @transaction
 */

async function productRecall(data) {

  let factory = getFactory();
  let prodRecallRetailer = factory.newEvent('org.agrichain.crop', 'prodRecallRetailer');
  prodRecallRetailer.packetsAffected = "packetsAffectedShipment";
  prodRecallRetailer.reason = data.reason;
  emit(prodRecallRetailer);

  let packetsAffected = []
  let partiesAffected = []

  let possiblePartiesAffected = []

  const packetAffected = data.packet
  const reason = data.description

  const shipmentAffected = packetAffected.shipment
  possiblePartiesAffected.push(shipmentAffected.buyer)

  const batchAffected = packetAffected.batchID
  const packetsAffectedBatch = batchAffected.packets

  packetsAffectedBatch.forEach(packet => {
    if (packet.shipment) {
      possiblePartiesAffected.push(packet.shipment.buyer)
    }
  })

  const cropAffected = batchAffected.crop
  const batchesFromSameCrop = cropAffected.batches

  batchesFromSameCrop.forEach(batch => {
    possiblePartiesAffected.push(batch.owner);
  })

  const packetsAffectedShipment = shipmentAffected.packets


  const packetsAffectedCrop = []
  batchesFromSameCrop.forEach(batch => {
    packetsAffectedCrop.push(batch.packets)
  })

  let possibleAffected = [...packetsAffectedShipment, ...packetsAffectedBatch, ...packetsAffectedCrop]


  //Are same type affected?
  //Are different type affected?
  //Are s

  //Cleaning Data
  console.log(possibleAffected);

  possibleAffected.forEach(packet => {

    if (packetsAffected.indexOf(packet) === -1) {
      packetsAffected.push(packet)
    }
  })
  console.log(packetsAffected)

  possiblePartiesAffected.forEach(party => {

    if (partiesAffected.indexOf(party) === -1) {
      partiesAffected.push(party)
    }
  })
  console.log(partiesAffected)

  //Emit Events
  // let factory = getFactory();
  // let prodRecallRetailer = factory.newEvent('org.agrichain.crop', 'prodRecallRetailer');
  // prodRecallRetailer.packetsAffected = packetsAffectedShipment;
  // prodRecallRetailer.reason = reason;
  // emit(prodRecallRetailer);

  /*let prodRecallWholesaler = factory.newEvent('org.agrichain.crop', 'prodRecallWholesaler');
  prodRecallWholesaler.packetAffected = packetAffected;
  prodRecallWholesaler.packetsAffectedShipment = packetsAffectedShipment;
  prodRecallWholesaler.packetsAffectedBatch = packetsAffectedBatch;
  prodRecallWholesaler.packetsAffectedCrop = packetsAffectedCrop;
  prodRecallWholesaler.customersAffected = partiesAffected;
  prodRecallWholesaler.reason = reason;
  emit(prodRecallWholesaler);

  let prodRecallFarmer = factory.newEvent('org.agrichain.crop', 'prodRecallFarmer');
  prodRecallFarmer.batchAffected = batchAffected;
  prodRecallFarmer.reason = reason;
  emit(prodRecallFarmer);*/
}

/**
 * Get the traceability data for the consumer
 * @param {org.agrichain.crop.foodTraceFunc} data - packet to be trace
 * @transaction
 */
async function foodTraceFunc(data) {

  const packet = data.packet

  //Emit Event
  let factory = getFactory()
  let foodTrace = factory.newEvent('org.agrichain.crop', 'foodTrace')

  foodTrace.packet = packet
  foodTrace.pickupDate = packet.batchID.batchDate
  foodTrace.farmer = packet.batchID.crop.owner
  foodTrace.farm = packet.batchID.crop.farm
  emit(foodTrace)

  console.log(foodTrace)
}


/**
 * Transfer the ownership of crops
 * @param {org.agrichain.crop.transferCrops} transferData - includes the crop to be changed and the
 * new owner
 * @transaction
 */
async function transferCrops(transferData) {

  transferData.crop.owner = transferData.newOwner;
  let assetRegistry = await getAssetRegistry('org.agrichain.crop.Crop');
  await assetRegistry.update(transferData.crop);

}
/**
 * {
  "$class": "org.agrichain.crop.transferCrops",
  "crop": "org.agrichain.crop.Crop#Crop001",
  "newOwner": "org.agrichain.participants.Farmer#Farmer002"
}
 */

/**
 * Add new Irrigation to a Crop
 * @param {org.agrichain.crop.addIrrigation} addData - includes the new irrigation as well as the crop ID
 * @transaction
 */
async function addIrrigation(addData) {

  addData.crop.irrigations.push(addData.irr);
  let assetRegistry = await getAssetRegistry('org.agrichain.crop.Crop');
  await assetRegistry.update(addData.crop);

}

/**
 * Add new Irrigation to a Crop
 * @param {org.agrichain.crop.addTreatment} addData - includes the new treatment as well as the crop ID
 * @transaction
 */
async function addTreatment(addData) {

  addData.crop.treatments.push(addData.trt);
  let assetRegistry = await getAssetRegistry('org.agrichain.crop.Crop');
  await assetRegistry.update(addData.crop);
}

/**
 * Update Batch information once it has been processed by the wholesaler
 * @param {org.agrichain.crop.processBatch} 
 * batch - batch to be processed
 * storage - new storage for the batch
 * weight - batch's weight
 * @transaction
 */

async function processBatch(transferData) {

  transferData.batch.storage = transferData.storage;
  transferData.batch.weight = transferData.weight;

  let assetRegistry = await getAssetRegistry('org.agrichain.crop.Batch');
  await assetRegistry.update(transferData.batch);

  //Emit Event
  let factory = getFactory();
  let basicEvent = factory.newEvent('org.agrichain.crop', 'batchProcessed');
  basicEvent.batch = transferData.batch;
  basicEvent.weight = transferData.weight;
  basicEvent.crop = transferData.batch.crop;
  emit(basicEvent);

}

/**
 * Add new Irrigation to a Crop
 * @param {org.agrichain.crop.packetsForShipment} data - includes the shipment to be added along with the information of packets to be retrieved
 * @transaction
 */

async function packetsForShipment(data) {

  let assetRegistry = await getAssetRegistry('org.agrichain.crop.Packet');

  for (let i = 0; i < data.products.length; i++) {
    let product = data.products[i];
    let organic = data.organic[i];
    let amount = data.quantity[i];

    let packets = await query('getPacketByType', {
      type: product,
      organic: organic
    });

    for (let n = 0; n < packets.length; n++) {
      let packet = packets[n];

      if (amount > 0) {
        data.shipment.packets.push(packet);
        packet.used = true;
        packet.shipment = data.shipment;
        amount -= packet.size;
      }
      await assetRegistry.update(packet);
    }
  }
  let assetRegistry2 = await getAssetRegistry('org.agrichain.crop.Shipment');
  await assetRegistry2.add(data.shipment);
}


/**
 * Add new Irrigation to a Crop
 * @param {org.agrichain.crop.updatePosition} data - new location for a shipment
 * @transaction
 */
async function updatePosition(data) {

  data.shipment.locations.push(data.location);
  data.shipment.temperatures.push(data.temperature);
  let assetRegistry = await getAssetRegistry('org.agrichain.crop.Shipment');
  await assetRegistry.update(data.shipment);


  //Emit Event
  let factory = getFactory();
  let newEvent = factory.newEvent('org.agrichain.crop', 'shipmentUpdate');
  newEvent.shipment = data.shipment;
  newEvent.location = data.location;
  newEvent.temperature = data.temperature;
  emit(newEvent);
}

/**
 * Add new Irrigation to a Crop
 * @param {org.agrichain.crop.updatePackets} data.Packets - Packets to be updated
 * @transaction
 */

async function updatePackets(data) {

  const pp = data.packets

  let assetRegistry = await getAssetRegistry('org.agrichain.crop.Packet');

  for (var i = 0; i < pp.length; i++) {

    await assetRegistry.update(pp[i]);

  }
}