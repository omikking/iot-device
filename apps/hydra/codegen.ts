import { CodegenConfig } from '@graphql-codegen/cli';
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd(), true);

// NEXT_PUBLIC_API_URL is the bare API origin (banshee convention), so we append
// /graphql here — exactly like UrqlProvider does at runtime.
const schemaUrl = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/graphql`
  : undefined;

if (!schemaUrl) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

const config: CodegenConfig = {
  schema: schemaUrl,
  // Only .tsx is scanned — a graphql() document in a .ts file is silently ignored.
  documents: ['src/**/*.tsx'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './src/gql/': {
      preset: 'client',
      plugins: [],
    },
  },
};

export default config;
