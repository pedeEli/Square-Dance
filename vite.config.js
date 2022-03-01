import {defineConfig} from 'vite'
import {resolve} from 'path'

export default defineConfig({
    resolve: {
        alias: {
            '@ts': resolve(__dirname, './src/ts'),
            '@css': resolve(__dirname, './src/styles')
        }
    }
})