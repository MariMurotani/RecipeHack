# ベースイメージとして Amazon Linux 2 を使用
FROM public.ecr.aws/lambda/python:3.11

# 必要なツールのインストール
RUN yum install -y git curl && \
    curl -sSL https://install.python-poetry.org | python3 - && \
    ln -s /root/.local/bin/poetry /usr/local/bin/poetry

# 作業ディレクトリを作成
WORKDIR /var/task

# Poetry プロジェクトファイルをコピー
COPY ../poetry.lock ../pyproject.toml ./

# Poetryで依存関係をインストール
RUN poetry config virtualenvs.create false && poetry install --no-dev

# Lambda ハンドラーコードをコンテナにコピー
COPY app.py .

# モデルをコンテナにコピー
COPY ./my_fine_tuned_model /opt/my_fine_tuned_model

# Lambda のエントリーポイントを指定
CMD ["app.lambda_handler"]