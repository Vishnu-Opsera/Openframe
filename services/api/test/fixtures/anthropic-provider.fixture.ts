export const anthropicFixtures = {
  success: { text: 'proposal', credential: 'secret://workspace/anthropic' },
  timeout: { text: '', credential: '<your-api-key>' },
  malformed: { text: '{', credential: 'secret://workspace/anthropic' },
}
