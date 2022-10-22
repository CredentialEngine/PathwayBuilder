export const sanboxSetting = {
  api: {
    url: 'https://sandbox.credentialengine.org/publisher/',
  },
};
export const productionSetting = {
  api: {
    url: 'https://apps.credentialengine.org/publisher/',
  },
};
export const stagingSetting = {
  api: {
    url: 'https://staging.credentialengine.org/publisher/',
  },
};

export const TEMP_BASE_URL =
  process.env.NODE_ENV !== 'production'
    ? sanboxSetting.api.url
    : productionSetting.api.url;
