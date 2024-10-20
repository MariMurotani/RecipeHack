import base64

def lambda_handler(event, context):
    # Authorization ヘッダーの取得
    auth_header = event['headers'].get('Authorization', '')
    
    if not auth_header.startswith('Basic '):
        return generate_policy('Deny', event['methodArn'])

    # Basic 認証のユーザー名とパスワードを取得
    auth_decoded = base64.b64decode(auth_header.split(' ')[1]).decode('utf-8')
    username, password = auth_decoded.split(':')

    # ユーザー名とパスワードの確認
    if username == "myusername" and password == "mypassword":
        return generate_policy('Allow', event['methodArn'])
    else:
        return generate_policy('Deny', event['methodArn'])

# ポリシーの生成
def generate_policy(effect, resource):
    return {
        'principalId': 'user',
        'policyDocument': {
            'Version': '2012-10-17',
            'Statement': [
                {
                    'Action': 'execute-api:Invoke',
                    'Effect': effect,
                    'Resource': resource
                }
            ]
        }
    }
