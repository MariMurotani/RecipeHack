from flask import Flask, request, jsonify
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

app = Flask(__name__)

# モデルとトークナイザーの読み込み
model = AutoModelForCausalLM.from_pretrained("./my_fine_tuned_model/")
tokenizer = AutoTokenizer.from_pretrained("./my_fine_tuned_model/")

@app.route('/generate', methods=['POST'])
def generate_text():
    try:
        # リクエストからデータを取得
        input_data = request.json
        input_text = input_data.get('input_text', '')

        # モデルの推論
        inputs = tokenizer(input_text, return_tensors="pt")
        outputs = model.generate(inputs["input_ids"], max_length=50)

        # トークナイザーを使って出力をデコード
        generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

        # 結果を返す
        return jsonify({'generated_text': generated_text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9000)
