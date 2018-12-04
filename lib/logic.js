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