export const sendPush = async (devices, payload) => {
    // Phase 1: stub / console
    devices.forEach(d => {
      console.log("Push →", d.platform, payload);
    });
  
    // Phase 2:
    // ANDROID → Firebase Admin SDK
    // IOS → APNs
  };
  