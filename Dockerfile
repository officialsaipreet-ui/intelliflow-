# ============================================================
# z8run – Multi-stage Docker build
# Stage 1: Build Rust backend
# Stage 2: Build React frontend
# Stage 3: Minimal runtime image
# ============================================================

# ── Stage 1: Rust build ─────────────────────────────────────
FROM rust:1.91-bookworm AS backend-builder

WORKDIR /build

# Cache dependencies first
COPY Cargo.toml Cargo.lock ./
COPY crates/intelliflow-core/Cargo.toml       crates/intelliflow-core/Cargo.toml
COPY crates/intelliflow-api/Cargo.toml        crates/intelliflow-api/Cargo.toml
COPY crates/intelliflow-storage/Cargo.toml    crates/intelliflow-storage/Cargo.toml
COPY crates/intelliflow-runtime/Cargo.toml    crates/intelliflow-runtime/Cargo.toml
COPY bins/intelliflow-cli/Cargo.toml          bins/intelliflow-cli/Cargo.toml

# Create dummy src files so cargo can resolve deps
RUN mkdir -p crates/intelliflow-core/src      && echo "" > crates/intelliflow-core/src/lib.rs && \
    mkdir -p crates/intelliflow-api/src       && echo "" > crates/intelliflow-api/src/lib.rs && \
    mkdir -p crates/intelliflow-storage/src   && echo "" > crates/intelliflow-storage/src/lib.rs && \
    mkdir -p crates/intelliflow-runtime/src   && echo "" > crates/intelliflow-runtime/src/lib.rs && \
    mkdir -p bins/intelliflow-cli/src         && echo "fn main(){}" > bins/intelliflow-cli/src/main.rs

RUN cargo build --release --bin intelliflow 2>/dev/null || true

# Now copy real source and build
COPY crates/ crates/
COPY bins/   bins/

# Invalidate cargo cache for ALL crates (dummy libs must be recompiled)
RUN find crates/ bins/ -name "*.rs" -exec touch {} + && \
    cargo build --release --bin intelliflow

# ── Stage 2: Frontend build ─────────────────────────────────
FROM node:24-bookworm-slim AS frontend-builder

WORKDIR /build/frontend

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci

COPY frontend/ .
RUN npm run build

# ── Stage 3: Runtime ────────────────────────────────────────
FROM debian:bookworm-slim AS runtime

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        libssl3 \
        curl \
    && rm -rf /var/lib/apt/lists/*

# Non-root user
RUN groupadd -r z8run && useradd -r -g z8run -m z8run

WORKDIR /app

# Copy binary
COPY --from=backend-builder /build/target/release/intelliflow /app/intelliflow

# Copy frontend build
COPY --from=frontend-builder /build/frontend/dist /app/frontend/dist

# Data directory
RUN mkdir -p /app/data /app/data/plugins && chown -R z8run:z8run /app

USER z8run

# Defaults
ENV Z8_PORT=7700 \
    Z8_BIND=0.0.0.0 \
    Z8_DATA_DIR=/app/data \
    Z8_LOG_LEVEL=info

EXPOSE 7700

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:7700/api/v1/health || exit 1

ENTRYPOINT ["/app/intelliflow"]
CMD ["serve"]
