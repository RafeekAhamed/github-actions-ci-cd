# GitHub Actions CI/CD – React Application

A production-oriented CI/CD project that automates validation of a React application, builds a hardened Docker image, and publishes the image to GitHub Container Registry (GHCR).

The project demonstrates a practical workflow using GitHub Actions, Docker Buildx, Nginx, Docker Scout, Software Bill of Materials (SBOM), and SLSA provenance attestations.

## Project Overview

The pipeline runs code-quality checks, automated tests, and a production build for the React application. After those checks pass on a push to `main`, GitHub Actions builds and publishes a Docker image to GHCR.

Pull requests run the application validation job. The image-publishing job is skipped for pull-request events.

### Key capabilities

- React application built with Vite.
- Oxlint code-quality checks.
- Automated component tests with Vitest and Testing Library.
- GitHub Actions CI/CD workflow.
- Multi-stage Docker build.
- Nginx production runtime using a non-root user.
- Docker image publishing to GitHub Container Registry.
- Docker Buildx build cache.
- SBOM and SLSA provenance attestations.
- Docker Scout vulnerability and policy assessment.
- Docker Compose deployment.

## Technology Stack

| Area | Technologies |
|---|---|
| Frontend | React 19, Vite 8 |
| Runtime and package management | Node.js 24, npm |
| Code quality | Oxlint |
| Testing | Vitest, Testing Library, jsdom |
| CI/CD | GitHub Actions |
| Containers | Docker, Docker Buildx |
| Web server | Nginx |
| Container registry | GitHub Container Registry (GHCR) |
| Container orchestration (local) | Docker Compose |
| Security assessment | Docker Scout |
| Supply-chain metadata | SPDX SBOM, SLSA provenance |

## Architecture

```text
Developer
   |
   | git push / pull request
   v
GitHub Repository
   |
   v
GitHub Actions
   |
   +--> Build and Test
   |      |
   |      +--> Checkout source
   |      +--> Setup Node.js 24
   |      +--> npm ci
   |      +--> npm run lint
   |      +--> npm run test:run
   |      +--> npm run build
   |
   +--> Docker Build and Publish
          |
          +--> Runs after Build and Test succeeds
          +--> Skipped for pull requests
          +--> Docker Buildx
          +--> Multi-stage Docker build
          +--> SBOM + SLSA provenance
          +--> Publish image to GHCR
                         |
                         v
                GitHub Container Registry
                         |
                         v
                  Docker Compose
                         |
                         v
                  Nginx :8080
                         |
                         v
                   React application
```

## Repository Structure

The following top-level entries are present in the repository:

```text
.
├── .github/
│   └── workflows/
│       └── ci.yml
├── app/                  # React + Vite application
├── docker/
├── docs/
├── nginx/                # Nginx runtime configuration
├── screenshots/
├── src/
├── tests/
├── .dockerignore
├── .gitignore
├── compose.yaml
└── Dockerfile
```

The React application is maintained in `app/`. Its npm commands should be run from that directory.

## CI/CD Workflow

Workflow file: `.github/workflows/ci.yml`

### Triggers

- Push to `main`.
- Pull requests targeting `main`.
- Manual execution using `workflow_dispatch`.

### Job 1: Build and Test React Application

This job runs on `ubuntu-latest` and performs:

1. Checks out the repository.
2. Configures Node.js 24 and npm dependency caching.
3. Installs locked dependencies using `npm ci`.
4. Runs Oxlint.
5. Runs the automated test suite.
6. Creates the production Vite build.

### Job 2: Build and Publish Docker Image

This job runs only after the application validation job succeeds. It is skipped for pull requests.

It:

1. Checks out the source.
2. Configures Docker Buildx.
3. Authenticates to GHCR using the workflow's `GITHUB_TOKEN`.
4. Generates image tags and OCI labels.
5. Builds and pushes the Linux AMD64 image.
6. Publishes SLSA provenance and an SPDX SBOM.
7. Uses GitHub Actions cache for Docker build layers.

### Published image tags

The workflow is configured to publish:

- `latest` for the default branch.
- `sha-<commit>` for the source commit.

Image repository:

```text
ghcr.io/rafeekahamed/github-actions-ci-cd
```

Example:

```text
ghcr.io/rafeekahamed/github-actions-ci-cd:latest
```

## Run the React Application Locally

Requirements:

- Node.js 24
- npm

Open PowerShell in the application directory:

```powershell
cd app
npm ci
npm run lint
npm run test:run
npm run build
```

To start the development server:

```powershell
npm run dev
```

Vite prints the local development URL in the terminal.

## Docker Build

Run these commands from the repository root.

Build the multi-stage image:

```powershell
docker build -t github-actions-ci-cd:local .
```

Run it:

```powershell
docker run --detach `
  --name github-actions-ci-cd-local `
  --publish 8080:8080 `
  github-actions-ci-cd:local
```

Check container status:

```powershell
docker ps
```

Check the HTTP response:

```powershell
Invoke-WebRequest http://localhost:8080
```

Expected HTTP status:

```text
200 OK
```

Stop and remove the test container:

```powershell
docker rm --force github-actions-ci-cd-local
```

## Docker Compose Deployment

The checked-in `compose.yaml` uses the `v4` image tag:

```text
ghcr.io/rafeekahamed/github-actions-ci-cd:v4
```

Authenticate to GHCR first if the package is private:

```powershell
docker login ghcr.io
```

Start the service:

```powershell
docker compose up -d
```

Inspect the service and health status:

```powershell
docker compose ps
```

Check the application:

```powershell
Invoke-WebRequest http://localhost:8080
```

Stop the service:

```powershell
docker compose down
```

The container listens on port `8080`, which is mapped to host port `8080`.

## Docker Security and Hardening

The Dockerfile uses a multi-stage build:

- Build stage: `node:24-alpine`.
- Runtime stage: `nginx:1-alpine-slim`.

The production image:

- Contains the compiled frontend assets rather than the Node.js build environment.
- Runs Nginx as UID/GID `101`, not as root.
- Uses the unprivileged HTTP port `8080`.
- Places the Nginx PID and temporary files in writable `/tmp` paths.
- Sends access and error logs to standard output and standard error.
- Includes a container health check.

Nginx configuration is maintained in:

- `nginx/nginx.conf`
- `nginx/default.conf`

## Image Security Assessment

Docker Scout was used to assess the published image.

Recorded assessment results for the CI-published image:

| Check | Result |
|---|---|
| Docker Scout health score | A — 94% |
| Critical vulnerabilities | 0 |
| High vulnerabilities | 0 |
| Medium vulnerabilities | 0 |
| Low vulnerabilities | 0 |
| Non-root runtime policy | Passed |
| Base-image freshness policy | Passed |
| Supply-chain attestations policy | Passed |
| Overall Scout policy | 6 of 7 policies passed |

### Vulnerability scan note

Docker Scout reported one distinct unspecified-severity CVE (`CVE-2026-107891`) against the Alpine `musl` source package, appearing in two package entries (`musl` and `musl-utils`). The image contained Alpine 3.24.3 with `musl` and `musl-utils` version `1.2.6-r3`.

The Alpine Security Tracker information reviewed for this project identifies `1.2.6-r3` as the fixed version for the Alpine 3.24 branch. Docker Scout's displayed generic fixed-version range did not reflect that branch-specific status. Therefore, the finding is documented rather than represented as a confirmed exploitable vulnerability. Recheck the current Alpine tracker and image scan when updating the base image.

### License policy note

The remaining failed Scout policy concerns copyleft-licensed packages inherited from the Alpine/Nginx runtime image. This is a license-compliance review item, not a vulnerability finding. Review applicable license obligations before distributing the image. System packages should not be removed solely to obtain a higher policy score without assessing runtime impact.

## Software Supply-Chain Attestations

The published GHCR image was verified to include:

- **SPDX SBOM** — package inventory for the image.
- **SLSA provenance v1** — build provenance metadata.

The attestation metadata identifies the GitHub repository and source commit used for the image build.

Inspect the published image:

```powershell
docker buildx imagetools inspect ghcr.io/rafeekahamed/github-actions-ci-cd:latest
```

Inspect attestations:

```powershell
docker scout attest list registry://ghcr.io/rafeekahamed/github-actions-ci-cd:latest
```

Review vulnerabilities:

```powershell
docker scout cves registry://ghcr.io/rafeekahamed/github-actions-ci-cd:latest
```

Review policy:

```powershell
docker scout policy registry://ghcr.io/rafeekahamed/github-actions-ci-cd:latest
```

## Verification Summary

The following checks were completed during project implementation:

- Local lint completed successfully.
- Automated test suite passed: 4 tests.
- Vite production build completed successfully.
- Docker image built successfully.
- Nginx ran as a non-root user.
- Container health check reported healthy.
- HTTP request to the application returned `200`.
- Docker Compose service started and reported healthy.
- GitHub Actions application validation job passed.
- GitHub Actions Docker build-and-publish job passed.
- GHCR image manifest was inspected.
- SBOM and SLSA provenance attestations were verified.
- Docker Scout assessment was recorded, including the remaining license-policy review item.

## Skills Demonstrated

- CI/CD pipeline design and implementation.
- GitHub Actions workflow automation.
- Node.js dependency management and build automation.
- Automated testing and code-quality gates.
- Multi-stage Docker builds.
- Nginx production configuration.
- Non-root container security.
- Container health checks.
- GHCR authentication and image publishing.
- Docker Buildx and build caching.
- SBOM and SLSA provenance.
- Vulnerability and license-policy assessment.
- Docker Compose deployment.
- Git version control and release traceability.

## Author

**Rafeek Ahamed M**  
DevOps Engineer | Azure Cloud Engineer

- GitHub: https://github.com/RafeekAhamed
- LinkedIn: https://www.linkedin.com/in/rafeek-ahamed-devops
- Portfolio: https://rafeek.rafeekahamed046.workers.dev

---

This project is part of a hands-on DevOps portfolio focused on practical automation, containerization, secure delivery, and cloud-native engineering practices.
