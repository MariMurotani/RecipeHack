import json
from transformers import AutoTokenizer, AutoModelForCausalLM

# モデルとトークナイザーの読み込み
model = AutoModelForCausalLM.from_pretrained("/opt/my_fine_tuned_model")
tokenizer = AutoTokenizer.from_pretrained("/opt/my_fine_tuned_model")

model.eval()

def lambda_handler(event, context):
    try:
        # リクエストの JSON からテキストを取得
        body = json.loads(event['body'])
        input_text = body.get('text', '')

        if not input_text:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'No input text provided.'})
            }

        # モデルでテキスト生成
        inputs = tokenizer(input_text, return_tensors="pt")
        outputs = model.generate(inputs["input_ids"], max_length=50)
        generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

        # 結果を返す
        return {
            'statusCode': 200,
            'body': json.dumps({'generated_text': generated_text})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
