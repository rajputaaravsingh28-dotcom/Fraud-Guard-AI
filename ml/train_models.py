import os
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
import joblib
from sklearn.ensemble import IsolationForest

class Autoencoder(nn.Module):
    def __init__(self):
        super().__init__()
        self.encoder = nn.Linear(2, 1)
        self.decoder = nn.Linear(1, 2)

    def forward(self, x):
        return self.decoder(self.encoder(x))

def generate_dataset(num_samples=10000):
    # Features: [Amount, Location Length]
    # Normal transactions: amount 10-5000, loc len 3-15
    normal_amounts = np.random.uniform(10, 5000, int(num_samples * 0.95))
    normal_locs = np.random.randint(3, 15, int(num_samples * 0.95))
    
    # Anomalous transactions: amount 50000-200000, loc len 1-20
    anom_amounts = np.random.uniform(50000, 200000, int(num_samples * 0.05))
    anom_locs = np.random.randint(1, 20, int(num_samples * 0.05))
    
    amounts = np.concatenate([normal_amounts, anom_amounts])
    locs = np.concatenate([normal_locs, anom_locs])
    
    data = np.column_stack((amounts, locs))
    np.random.shuffle(data)
    
    # Scale data roughly for NN
    data[:, 0] = data[:, 0] / 200000.0
    data[:, 1] = data[:, 1] / 20.0
    
    return data

def train_isolation_forest(data, save_path):
    print("Training Isolation Forest...")
    model = IsolationForest(contamination=0.05, random_state=42)
    model.fit(data)
    joblib.dump(model, save_path)
    print(f"Saved Isolation Forest to {save_path}")

def train_autoencoder(data, save_path, epochs=10):
    print("Training PyTorch Autoencoder...")
    model = Autoencoder()
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=0.01)
    
    tensor_data = torch.tensor(data, dtype=torch.float32)
    
    for epoch in range(epochs):
        optimizer.zero_grad()
        outputs = model(tensor_data)
        loss = criterion(outputs, tensor_data)
        loss.backward()
        optimizer.step()
        
        if (epoch + 1) % 2 == 0:
            print(f"Epoch [{epoch + 1}/{epochs}], Loss: {loss.item():.4f}")
            
    torch.save(model.state_dict(), save_path)
    print(f"Saved Autoencoder to {save_path}")

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    iso_path = os.path.join(current_dir, "iso_forest.joblib")
    auto_path = os.path.join(current_dir, "autoencoder.pt")
    
    print("Generating robust dataset of 10,000 transactions...")
    X_train = generate_dataset()
    
    train_isolation_forest(X_train, iso_path)
    train_autoencoder(X_train, auto_path)
    print("All models successfully trained and committed to disk.")
