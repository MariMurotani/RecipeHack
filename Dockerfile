# Base image for Python 3.11.5
FROM python:3.11.5-slim

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gnupg2 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install npx
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npx@10.8.2

# Install Neo4j
RUN curl -fsSL https://debian.neo4j.com/neotechnology.gpg.key | apt-key add - \
    && echo 'deb https://debian.neo4j.com stable 5.x' | tee /etc/apt/sources.list.d/neo4j.list \
    && apt-get update && apt-get install -y neo4j

# Set environment variables for Neo4j
ENV NEO4J_URI=bolt://localhost:7687
ENV NEO4J_USER=neo4j
ENV NEO4J_PASSWORD=abcd7890

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 - && \
    export PATH="$HOME/.local/bin:$PATH"

# Copy the pyproject.toml and poetry.lock files
COPY pyproject.toml poetry.lock* /app/

# Set working directory
WORKDIR /app

# Install dependencies using Poetry
RUN poetry config virtualenvs.create false && poetry install --no-interaction --no-ansi

# Expose Neo4j ports and Jupyter port
EXPOSE 7474 7687 8888

# Start Neo4j and
