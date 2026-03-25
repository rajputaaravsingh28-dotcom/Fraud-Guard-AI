import torch
import torch.nn as nn
import os

class Autoencoder(nn.Module):
    def __init__(self):
        super().__init__()
        self.encoder = nn.Linear(2, 1)
        self.decoder = nn.Linear(1, 2)

    def forward(self, x):
        return self.decoder(self.encoder(x))

_model = None

def get_model():
    global _model
    if _model is None:
        _model = Autoencoder()
        model_path = os.path.join(os.path.dirname(__file__), "autoencoder.pt")
        if os.path.exists(model_path):
            _model.load_state_dict(torch.load(model_path))
        _model.eval()
    return _model

def get_score(transaction) -> float:
    model = get_model()
    # Handle both Pydantic schemas and standard dicts
    amount = getattr(transaction, "amount", transaction.get("amount", 0) if isinstance(transaction, dict) else 0) / 200000.0
    loc_len = len(getattr(transaction, "location", transaction.get("location", "") if isinstance(transaction, dict) else "")) / 20.0
    
    # Provide synthetic inputs
    tensor_input = torch.tensor([float(val1), float(val2)], dtype=torch.float32)
    with torch.no_grad():
        output = model(tensor_input)
        error = torch.nn.functional.mse_loss(output, tensor_input).item()
        
    return min(100, error * 1000)
