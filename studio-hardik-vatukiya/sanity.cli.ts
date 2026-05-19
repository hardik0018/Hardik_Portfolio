import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '1wlu6dtl',
    dataset: 'production',
  },
  deployment: {
    appId: 'wmyjx4qhqo7fafoo72ck21nu',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
