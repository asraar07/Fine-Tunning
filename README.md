# Fine-Tuning Google GEMMA-2B-IT Model

This repository contains the code and instructions for fine-tuning the "google/gemma-2b-it" model for causal language modeling. The project utilizes advanced techniques in model quantization and parameter-efficient fine-tuning to enhance the model's efficiency and performance.

## Table of Contents
- Introduction
- Installation
- Dataset
- Fine-Tuning Process
- Usage
- Results
- Contributing
- License

## Introduction
The aim of this project is to fine-tune the "google/gemma-2b-it" language model to handle specific programming tasks more effectively. The project leverages the following key components:
- Hugging Face transformers: For model and tokenizer management.
- bitsandbytes: For 4-bit model quantization.
- peft (Parameter-Efficient Fine-Tuning): For applying LoRA (Low-Rank Adaptation) techniques.
- trl (Transformers Reinforcement Learning): For supervised fine-tuning.

## Installation
To replicate this project, follow these steps:

1. Clone the repository:
    ```
    git clone https://github.com/yourusername/finetune-gemma-2b-it.git
    cd finetune-gemma-2b-it
    ```

2. Install the required packages:
    ```
    pip install -r requirements.txt
    ```

3. Log in to Hugging Face:
    ```python
    from huggingface_hub import notebook_login
    notebook_login()
    ```

## Dataset
The dataset used for fine-tuning is `TokenBender/code_instructions_122k_alpaca_style`. It contains a variety of programming tasks and instructions. You can load the dataset as follows:

```python
from datasets import load_dataset

dataset = load_dataset("TokenBender/code_instructions_122k_alpaca_style", split="train")
```
## Fine-Tuning Process
The fine-tuning process involves several steps:

1. Model Quantization:
```
from transformers import AutoModelForCausalLM, BitsAndBytesConfig

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16
)
model = AutoModelForCausalLM.from_pretrained("google/gemma-2b-it", quantization_config=bnb_config, device_map={"": 0})
```
2. Generate Prompts
```
def generate_prompt(data_point):
    prefix_text = 'Below is an instruction that describes a task. Write a response that appropriately completes the request.\n\n'
    if data_point['input']:
        text = f"user {prefix_text} {data_point['instruction']} here are the inputs {data_point['input']} \nmodel{data_point['output']} "
    else:
        text = f"user {prefix_text} {data_point['instruction']} \nmodel{data_point['output']} "
    return text

text_column = [generate_prompt(data_point) for data_point in dataset]
dataset = dataset.add_column("prompt", text_column)
```
3. Split Dataset
```
dataset = dataset.shuffle(seed=1234)
dataset = dataset.train_test_split(test_size=0.2)
train_data = dataset["train"]
test_data = dataset["test"]
```
4. Prepare Model for Fine-Tuning
```
from peft import LoraConfig, prepare_model_for_kbit_training, get_peft_model

model.gradient_checkpointing_enable()
model = prepare_model_for_kbit_training(model)

lora_config = LoraConfig(
    r=64,
    lora_alpha=32,
    target_modules=find_all_linear_names(model),
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

model = get_peft_model(model, lora_config)
```
5. Train the Model
```
from trl import SFTTrainer
import transformers

trainer = SFTTrainer(
    model=model,
    train_dataset=train_data,
    eval_dataset=test_data,
    dataset_text_field="prompt",
    peft_config=lora_config,
    args=transformers.TrainingArguments(
        per_device_train_batch_size=1,
        gradient_accumulation_steps=4,
        warmup_steps=0.03,
        max_steps=10,
        learning_rate=2e-4,
        logging_steps=1,
        output_dir="outputs",
        optim="paged_adamw_8bit",
        save_strategy="epoch",
    ),
    data_collator=transformers.DataCollatorForLanguageModeling(tokenizer, mlm=False),
)

trainer.train()
```
6. Save and Push the Model
```
new_model = "gemma-Finetuned"
trainer.model.save_pretrained(new_model)
tokenizer.save_pretrained("merged_model")
merged_model.push_to_hub(new_model, use_temp_dir=False)
tokenizer.push_to_hub(new_model, use_temp_dir=False)
```

**Usage**

To use the fine-tuned model for generating responses to programming tasks, you can call the get_completion function:
```
def get_completion(query: str, model, tokenizer) -> str:
    device = "cuda:0"
    prompt_template = """
    user
    Below is an instruction that describes a task. Write a response that appropriately completes the request.
    {query}
    \nmodel
    """
    prompt = prompt_template.format(query=query)
    encodeds = tokenizer(prompt, return_tensors="pt", add_special_tokens=True)
    model_inputs = encodeds.to(device)
    generated_ids = model.generate(**model_inputs, max_new_tokens=1000, do_sample=True, pad_token_id=tokenizer.eos_token_id)
    decoded = tokenizer.decode(generated_ids[0], skip_special_tokens=True)
    return decoded

result = get_completion(query="code the fibonacci series in python without recursion", model=merged_model, tokenizer=tokenizer)
print(result)
```

**Results**

The fine-tuned model can generate Python code for a variety of programming tasks, showcasing its improved performance and efficiency. For example, the model was able to generate the following code for calculating the Fibonacci series without recursion:
```
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b
```
## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for more details

To save this content as a `.txt` file:

1. Open a text editor (e.g., Notepad).
2. Copy and paste the above content into the text editor.
3. Save the file with a `.txt` extension, for example, `README.txt`.

If you need the actual `.txt` file created and provided to you, please let me know, and I can assist you further.
