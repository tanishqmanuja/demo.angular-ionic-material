import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ng.ionic.material',
  appName: 'Ng IonMat',
  webDir: 'dist/mobile/browser',
  server: {
    androidScheme: "https",
    cleartext: true
  }
};

const isServerEnabled = process.env['CAP_SERVER_ENABLED'] === 'true';
const serverUrl = process.env['CAP_SERVER_URL'];

if (isServerEnabled && serverUrl) {
  config.server = {
    ...config.server,
      url: serverUrl,
      cleartext: true
  }
}


export default config;
