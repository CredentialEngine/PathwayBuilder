export const sanboxSetting = {
  api: {
    url: 'https://sandbox.credentialengine.org/publisher/',
  },
};
export const productionSetting = {
  api: {
    url: 'https://sandbox.credentialengine.org/publisher/',
    /* for production url */
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

export const IS_LOCALHOST = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);
