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
 * Add new Irrigation to a Crop
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