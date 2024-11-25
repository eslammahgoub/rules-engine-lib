import type { BuildConfig } from 'bun'
import dts from 'bun-plugin-dts'

const defaultBuildConfig: BuildConfig = {
    entrypoints: ['./rules-engine/index.ts'],
    outdir: './dist'
}

await Promise.all([
    Bun.build({
        ...defaultBuildConfig,
        minify: true,
        plugins: [dts()],
        format: 'esm',
        naming: "[dir]/[name].js",
    }),
    Bun.build({
        ...defaultBuildConfig,
        minify: true,
        format: 'cjs',
        naming: "[dir]/[name].cjs",
    })
])