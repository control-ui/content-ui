import { TextEncoder, TextDecoder } from 'node:util'

// react-router@7 tests fail without mocking TextEncoder for jsdom
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
