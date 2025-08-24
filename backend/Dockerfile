# Use AWS Lambda Node.js 20 base image
FROM public.ecr.aws/lambda/nodejs:20

# We will install devDependencies for the build, then prune them.
# Keep production mode only after pruning.
ENV IS_LAMBDA=true

# Copy package files
COPY package*.json ${LAMBDA_TASK_ROOT}/

# Install dependencies including devDependencies (TypeScript, types, etc.)
RUN npm ci --include=dev

# Verify TypeScript is available (helpful during CI/build logs)
RUN npx tsc --version

# Copy source code and TypeScript config
COPY src/ ${LAMBDA_TASK_ROOT}/src/
COPY tsconfig.json ${LAMBDA_TASK_ROOT}/

# Build the TypeScript code (uses the build script from package.json)
RUN npm run build

# Remove source files and dev dependencies to minimize image size
RUN rm -rf src/ tsconfig.json \
    && npm prune --omit=dev \
    && npm cache clean --force

# Now set production environment for runtime
ENV NODE_ENV=production

# Set the CMD to your handler
CMD [ "dist/index.handler" ]
