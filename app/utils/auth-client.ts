import { createAuthClient } from 'better-auth/vue'
import { inferAdditionalFields, usernameClient } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    usernameClient(),
  ],
})
