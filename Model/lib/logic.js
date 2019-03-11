'use strict';


/**
 * Thansfer the ownership of crops
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