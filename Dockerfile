# Multi stage build to allow us to improve performance
FROM node:10-alpine as base
WORKDIR /usr/src/app

# Install basic dependancies (Next.js, React)
COPY test/docker/app/package*.json ./
RUN npm ci --only=production

FROM node:10-alpine as app
COPY --from=base /usr/src/app ./

# Copy last build of library into the image and install dependences for it.
# This ensures the build is valid and package.json contains everything needed
# to actually run the library.
# Note: You must run `npm run build` first to build a release of the library
RUN mkdir -p node_modules/next-auth
# Copy all entrypoints for the library (if creating a new one, add it here)
COPY index.js providers.js adapters.js client.js jwt.js node_modules/next-auth/
# Copy the dist dir
COPY dist node_modules/next-auth/dist
# Copy the package.json for the library and install it's dependences
COPY package*.json node_modules/next-auth/
RUN cd node_modules/next-auth/ && npm ci --only=production

# Copy test pages across
COPY test/docker/app/pages ./pages

RUN npm run build

CMD [ "npm", "start" ]