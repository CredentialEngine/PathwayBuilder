export const localSetting = {
  api: {
    url: 'https://localhost:44330/',
  },
};
export const sanboxSetting = {
  api: {
    //url:'https://sandbox.credentialengine.org/finderApi/'
    // url:'https://localhost:44356/',
    url: 'https://localhost:44330/',
    // url: 'https://sandbox.credentialengine.org/publisher/',
  },
};
export const productionSetting = {
  api: {
    // url:'https://sandbox.credentialengine.org/finderApi/'
    url: 'https://sandbox.credentialengine.org/publisher/',
    /* for production url */
  },
};
export const stagingSetting = {
  api: {
    url: 'https://staging.credentialengine.org/publisher/',
  },
};

export const sanboxSettingregistry = {
  api: {
    url: 'https://sandbox.credentialengineregistry.org/',
  },
};
export const productionSettingregistry = {
  api: {
    url: 'https://sandbox.credentialengineregistry.org/',
    /* for production url */
  },
};
export const stagingSettingregistry = {
  api: {
    url: 'https://staging.credentialengineregistry.org/',
  },
};
export const IS_LOCALHOST = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export const TEMP_BASE_URL =
  process.env.NODE_ENV !== 'production'
    ? sanboxSetting.api.url
    : productionSetting.api.url;

export const progressionModelUrl = TEMP_BASE_URL + 'progressionmodel';
