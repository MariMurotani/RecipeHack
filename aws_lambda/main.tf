provider "aws" {
  region = "us-east-1"
}

resource "aws_iam_role" "lambda_role" {
  name = "lambda-execution-role"
  assume_role_policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [{
      "Action": "sts:AssumeRole",
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "my_lambda" {
  function_name = "text_generation_lambda"
  role          = aws_iam_role.lambda_role.arn
  package_type  = "Image"
  image_uri     = aws_ecr_repository.my_ecr.repository_url
  memory_size   = 512
  timeout       = 30
}

resource "aws_apigatewayv2_api" "http_api" {
  name          = "TextGenerationAPI"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id           = aws_apigatewayv2_api.http_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.my_lambda.arn
}

resource "aws_apigatewayv2_route" "default_route" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /generate"
  target    = aws_apigatewayv2_integration.lambda_integration.id
}

resource "aws_lambda_permission" "allow_api" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.my_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*"
}

output "api_endpoint" {
  value = aws_apigatewayv2_api.http_api.api_endpoint
}

# Lambda Authorizer の作成
resource "aws_lambda_function" "basic_authorizer" {
  filename      = "authorizer.zip"
  function_name = "basic_authorizer"
  role          = aws_iam_role.lambda_role.arn
  handler       = "authorizer.lambda_handler"
  runtime       = "python3.8"
}

# API Gateway に Lambda Authorizer を設定
resource "aws_apigatewayv2_authorizer" "basic_auth" {
  api_id   = aws_apigatewayv2_api.http_api.id
  name     = "BasicAuth"
  authorizer_type = "REQUEST"
  authorizer_uri  = aws_lambda_function.basic_authorizer.invoke_arn
  identity_sources = ["$request.header.Authorization"]
}

# Lambda 関数への権限付与
resource "aws_lambda_permission" "allow_api_auth" {
  statement_id  = "AllowAPIGatewayInvokeAuth"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.basic_authorizer.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*"
}

# API Gateway のルートに Authorizer を設定
resource "aws_apigatewayv2_route" "default_route" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /generate"
  target    = aws_apigatewayv2_integration.lambda_integration.id
  authorizer_id = aws_apigatewayv2_authorizer.basic_auth.id  # ここで Authorizer を設定
}