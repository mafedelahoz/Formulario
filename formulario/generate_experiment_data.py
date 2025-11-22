import pandas as pd
import numpy as np
import random

NUM_LEADS = 1000
np.random.seed(42)

data = []
specialties = ['Odontología', 'Estética', 'Veterinaria', 'Medicina General']

for i in range(NUM_LEADS):
    user_id = i + 1
    
    variant = np.random.choice(['A', 'B'])
    specialty = np.random.choice(specialties)
    
    if specialty in ['Odontología', 'Estética']:
        segment = 'HIGH_TICKET'
    else:
        segment = 'LOW_TICKET'
    
    base_prob = 0.10
    
    if variant == 'A':
        conversion_prob = base_prob
    else:
        if segment == 'HIGH_TICKET':
            conversion_prob = base_prob + 0.15
        else:
            conversion_prob = base_prob + 0.02
    
    is_converted = 1 if random.random() < conversion_prob else 0
    
    data.append([user_id, variant, specialty, segment, is_converted])

df = pd.DataFrame(data, columns=['user_id', 'cta_version', 'specialty', 'segment', 'is_converted'])
df.to_csv('experiment_data.csv', index=False)

print("✅ File 'experiment_data.csv' created.")
print(f"Total leads: {len(df)}")
print(f"Variant A: {len(df[df['cta_version'] == 'A'])}")
print(f"Variant B: {len(df[df['cta_version'] == 'B'])}")
print(f"HIGH_TICKET: {len(df[df['segment'] == 'HIGH_TICKET'])}")
print(f"LOW_TICKET: {len(df[df['segment'] == 'LOW_TICKET'])}")
